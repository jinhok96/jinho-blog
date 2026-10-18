"""나눈 PDF 점검: python analyze.py <원본 packet.pdf> <결과.pdf> <원본에서의 시작 쪽(1부터)>
쪽 수, 쪽별 텍스트 일치, 책갈피(제목·대상 쪽), 문서 안 링크(대상 쪽이 이 파일 안에서 풀리는지), 외부 링크,
양식 칸 수·Name 값·입력 가능 여부(위젯이 AcroForm에 연결됐는지), 사진 원본 JPEG 바이트 일치, 파일 크기를 JSON으로 출력
실행: /tmp/pdfs/bin/python -I analyze.py ...
"""
import hashlib
import json
import sys
from pathlib import Path

import pikepdf
import pymupdf

src_path, out_path, start = sys.argv[1], sys.argv[2], int(sys.argv[3])
src = pymupdf.open(src_path)
out = pymupdf.open(out_path)
n = out.page_count

text_ok = sum(
    1 for i in range(n)
    if start - 1 + i < src.page_count
    and " ".join(out[i].get_text().split()) == " ".join(src[start - 1 + i].get_text().split())
)

toc = [{"level": l, "title": t, "page": p} for l, t, p in out.get_toc(simple=True)]

internal = internal_ok = external = 0
for pg in out:
    for ln in pg.get_links():
        if ln["kind"] == pymupdf.LINK_URI:
            external += 1
        elif ln["kind"] in (pymupdf.LINK_GOTO, pymupdf.LINK_NAMED):
            internal += 1
            if ln.get("page", -1) is not None and 0 <= ln.get("page", -1) < n:
                internal_ok += 1

pk = pikepdf.open(out_path)
fields = 0
name_val = None
widgets_on_pages = 0
af = pk.Root.get("/AcroForm")
if af is not None and "/Fields" in af:
    def walk(f, prefix=""):
        global fields, name_val
        nm = prefix + str(f.get("/T", ""))
        kids = f.get("/Kids")
        if kids is not None and any("/T" in k for k in kids):
            for k in kids:
                walk(k, nm + ".")
        else:
            fields += 1
            if nm.endswith("f1_01[0]"):
                name_val = str(f.get("/V", ""))
    for f in af.Fields:
        walk(f)
for p in pk.pages:
    for a in p.get("/Annots", []):
        if a.get("/Subtype") == "/Widget":
            widgets_on_pages += 1

# 사진: 원본 PDF의 JPEG 스트림 해시와 같은 것이 있는지
def jpeg_hashes(pdf):
    hs = set()
    for p in pdf.pages:
        for _, im in p.images.items():
            if im.get("/Filter") == "/DCTDecode":
                hs.add(hashlib.md5(im.read_raw_bytes()).hexdigest())
    return hs

src_pk = pikepdf.open(src_path)
src_j = jpeg_hashes(src_pk)
out_j = jpeg_hashes(pk)
all_imgs = sum(len(p.images) for p in pk.pages)

print(json.dumps({
    "file": Path(out_path).name, "pages": n, "bytes": Path(out_path).stat().st_size,
    "text_pages_identical": text_ok, "bookmarks": toc,
    "internal_links": internal, "internal_links_resolve": internal_ok, "external_links": external,
    "form_fields": fields, "widgets_on_pages": widgets_on_pages, "name_value": name_val,
    "images": all_imgs, "jpeg_identical_to_source": len(out_j & src_j),
}, ensure_ascii=False))
