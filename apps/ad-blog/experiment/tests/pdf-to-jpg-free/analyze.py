"""GUI 앱 3개(GIMP·LibreOffice Draw·Sejda Desktop)가 만든 JPG를 점검.
사용: python3 -I analyze.py <작업 폴더(/tmp/p2j)> > results.jsonl
- 어느 쪽인지: 출력과 pdftoppm 300 DPI 기준 렌더(ref/*.png)를 같은 크기 회색조로 줄여 RMSE가 가장 작은 쪽
- 픽셀 크기·JPEG 품질 추정값(ImageMagick %Q)·DPI 표기·파일 크기
- word_recall: 그 쪽 원본 텍스트(pdftotext) 단어 중 Tesseract OCR 결과에 있는 비율 (판독성 대리 지표)
- fine_recall: mixed 문서 7pt 각주 28단어 재현율
- mean: 평균 밝기(0~1). 흰 배경이 사라지면 크게 낮아짐
"""
import json, re, subprocess, sys
from collections import Counter
from pathlib import Path

W = Path(sys.argv[1]); OUT = W / "out"; REF = W / "ref"
FINE = ("Fine print test at 7 points: Terms apply. Reference number 4821-7730-1956. Contact support within 30 days "
        "of purchase for a full refund. Version 2.14, printed October 16, 2026.")
# 출력 폴더 → 앱·설정 이름
CFG = {"gimp": "GIMP 3.2.6 (defaults: 300 ppi, Q90)", "lo": "LibreOffice Draw 26.8.1",
       "sejda-150": "Sejda Desktop 7.9.10 Medium (150 dpi, default)", "sejda-220": "Sejda Desktop 7.9.10 Large (220 dpi)",
       "sejda-mixed": "Sejda Desktop 7.9.10 Large (220 dpi)"}
REFS = {"irs-1": ("irs-1040", 1), "irs-2": ("irs-1040", 2), "mixed-1": ("mixed", 1),
        "photos-1": ("photos", 1), "photos-2": ("photos", 2), "photos-3": ("photos", 3)}

def run(*a):
    return subprocess.run(a, capture_output=True, text=True).stdout

def words(t):
    t = t.replace("’", "'").replace("‘", "'").replace("—", " ").replace("–", "-").lower()
    return [w for w in (x.strip(".,;:!?\"'()[]") for x in t.split()) if re.search(r"[a-z0-9]", w)]

def recall(ref, hyp):
    rc, hc = Counter(ref), Counter(hyp)
    n = sum(rc.values())
    return round(sum(min(c, hc[w]) for w, c in rc.items()) / n, 4) if n else None

def small(img, w, h, out):
    subprocess.run(["convert", str(img), "-colorspace", "gray", "-resize", f"{w}x{h}!", str(out)], check=True)

def rmse(a, b):
    o = subprocess.run(["compare", "-metric", "RMSE", str(a), str(b), "null:"], capture_output=True, text=True).stderr
    return float(o.split("(")[1].split(")")[0])

def which_page(img, landscape):
    small(img, 255, 330 if not landscape else 197, W / "_a.png")
    best = None
    for key, (doc, pg) in REFS.items():
        ref = REF / f"{key}.png"
        rl = doc == "photos"
        if rl != landscape:
            continue
        small(ref, 255, 330 if not landscape else 197, W / "_b.png")
        e = rmse(W / "_a.png", W / "_b.png")
        if best is None or e < best[0]:
            best = (round(e, 4), doc, pg)
    return best

if __name__ == "__main__":
    for d in sorted(OUT.iterdir()):
        for f in sorted(d.glob("*.jpg")):
            w, h, q, x, mean = run("identify", "-format", "%w %h %Q %x %[fx:mean]", str(f)).split()
            e, doc, pg = which_page(f, int(w) > int(h))
            r = {"folder": d.name, "file": f.name, "app": CFG.get(d.name), "w": int(w), "h": int(h), "q_est": int(q),
                 "dpi_tag": x, "bytes": f.stat().st_size, "mean": round(float(mean), 3),
                 "matches": f"{doc} p{pg}", "rmse": e}
            if doc != "photos":
                hyp = words(run("tesseract", str(f), "-", "--psm", "3"))
                r["word_recall"] = recall(words(run("pdftotext", "-f", str(pg), "-l", str(pg), str(W / "in" / f"{doc}.pdf"), "-")), hyp)
                if doc == "mixed":
                    r["fine_recall"] = recall(words(FINE), hyp)
            print(json.dumps(r), flush=True)
