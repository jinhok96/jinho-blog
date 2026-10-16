"""합친 PDF가 무엇을 유지했는지 검사 → summary.json
- 쪽 수, 크기
- 책갈피(PyMuPDF get_toc): 개수와 대상 쪽이 맞는지 (기대: report-a 1~3쪽, report-b 19~21쪽)
- 문서 안 링크: 목차 링크 6개가 올바른 쪽으로 가는지, 외부 링크 2개
- 양식: 위젯 수, AcroForm 필드 수, 4쪽·10쪽 Name 칸 값, 두 W-9의 Name 칸이 같은 필드로 묶였는지
- 사진: 사진 쪽 이미지 스트림 원본 바이트가 입력과 같은지 (MD5)
- 텍스트: pdftotext 쪽별 결과가 입력과 같은지
실행: /tmp/pdfm/bin/python -I analyze.py [W]
"""
import hashlib
import json
import subprocess
import sys
from pathlib import Path

import pikepdf
import pymupdf

W = Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/merge")
ORDER = ["report-a", "w9-a", "w9-b", "photos", "report-b"]
NAME = "f1_01"


def page_texts(f):
    out = subprocess.run(["pdftotext", "-layout", str(f), "-"], capture_output=True, text=True).stdout
    return [" ".join(p.split()) for p in out.split("\f")][:-1]


def img_pixels(f, pages):
    """사진 쪽 이미지를 풀어서 픽셀 비교용 해시"""
    import io

    from PIL import Image
    d = pymupdf.open(f)
    res = []
    for i in pages:
        for x in d[i].get_images():
            im = Image.open(io.BytesIO(d.extract_image(x[0])["image"])).convert("RGB")
            res.append(hashlib.md5(im.tobytes()).hexdigest())
    return res


def img_md5s(f, pages):
    pdf = pikepdf.open(f)
    res = []
    for i in pages:
        pg = pdf.pages[i]
        for _, x in pg.images.items():  # pikepdf 10: deprecated 경고만, 결과 같음
            res.append(hashlib.md5(x.read_raw_bytes()).hexdigest())
    return res


# 기대값 (입력에서 계산)
offs, n = {}, 0
for k in ORDER:
    offs[k] = n
    n += len(pymupdf.open(W / "in" / f"{k}.pdf"))
TOTAL = n
exp_text = sum((page_texts(W / "in" / f"{k}.pdf") for k in ORDER), [])
exp_img = img_md5s(W / "in" / "photos.pdf", range(3))
exp_px = img_pixels(W / "in" / "photos.pdf", range(3))
exp_toc = []
for k in ("report-a", "report-b"):
    for lvl, t, p in pymupdf.open(W / "in" / f"{k}.pdf").get_toc():
        exp_toc.append((lvl, t, p + offs[k]))

summary = {"expected": {"pages": TOTAL, "toc": exp_toc, "input_bytes": sum((W / "in" / f"{k}.pdf").stat().st_size for k in ORDER)}}
for f in sorted((W / "out").glob("*.pdf")):
    d = pymupdf.open(f)
    r = {"bytes": f.stat().st_size, "pages": len(d)}
    toc = [tuple(x) for x in d.get_toc()]
    r["toc_count"] = len(toc)
    r["toc_correct"] = sum(1 for x in toc if x in exp_toc)
    internal = ok = ext = 0
    for k in ("report-a", "report-b"):
        src = pymupdf.open(W / "in" / f"{k}.pdf")
        for j in range(len(src)):
            want = [L["page"] + offs[k] for L in src[j].get_links() if L["kind"] in (pymupdf.LINK_GOTO, pymupdf.LINK_NAMED)]
            got = []
            for L in d[offs[k] + j].get_links():
                if L["kind"] == pymupdf.LINK_URI:
                    ext += 1
                elif L["kind"] in (pymupdf.LINK_GOTO, pymupdf.LINK_NAMED):
                    internal += 1
                    got.append(L.get("page"))
            ok += sum(1 for a, b in zip(want, got) if a == b)
    r.update(internal_links=internal, internal_links_ok=ok, external_links=ext)
    widgets = sum(len(list(d[i].widgets())) for i in range(len(d)))
    r["widgets"] = widgets
    vals = {}
    for i in (offs["w9-a"], offs["w9-b"]):
        for w in d[i].widgets():
            if NAME in w.field_name:
                vals[i + 1] = (w.field_name, w.field_value)
    r["name_fields"] = vals
    pdf = pikepdf.open(f)
    af = pdf.Root.get("/AcroForm")
    r["acroform"] = af is not None
    if af is not None:
        def count(fs):
            c = 0
            for x in fs:
                c += count(x.Kids) if "/Kids" in x and "/T" in x.Kids[0] else 1
            return c
        r["acroform_terminal_fields"] = count(af.Fields) if "/Fields" in af else 0
        r["need_appearances"] = bool(af.get("/NeedAppearances", False))
    # 두 Name 칸이 같은 필드 객체(부모)를 공유하는지
    names = [v[0] for v in vals.values()]
    r["name_fields_shared"] = len(names) == 2 and names[0] == names[1]
    got_img = img_md5s(f, range(offs["photos"], offs["photos"] + 3))
    r["photos_stream_identical"] = sum(1 for a, b in zip(got_img, exp_img) if a == b)
    got_px = img_pixels(f, range(offs["photos"], offs["photos"] + 3))
    r["photos_pixels_identical"] = sum(1 for a, b in zip(got_px, exp_px) if a == b)
    got_text = page_texts(f)
    r["text_pages_identical"] = sum(1 for a, b in zip(got_text, exp_text) if a == b)
    summary[f.stem] = r
    print(f.stem, json.dumps(r, ensure_ascii=False))
json.dump(summary, open(Path(__file__).parent / "summary.json", "w"), indent=1, ensure_ascii=False)
