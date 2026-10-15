"""스캔 PDF(11-scanned)에 OCRmyPDF로 텍스트 층을 넣은 뒤 3개 도구로 다시 변환한 결과 채점.

미리 실행한 명령 (작업 폴더 기준)
  ocrmypdf -q pdfs/11-scanned.pdf ocr/11-scanned-ocr.pdf          (OCRmyPDF 17.13.0, Tesseract 5.3.4)
  pdf2docx convert ocr/11-scanned-ocr.pdf ocr/11-ocr-pdf2docx.docx
  soffice --headless --infilter=writer_pdf_import --convert-to docx --outdir ocr/lo ocr/11-scanned-ocr.pdf
  ebook-convert ocr/11-scanned-ocr.pdf ocr/11-ocr-calibre.docx

사용: python ocr_test.py <작업 폴더>
"""

import json
import sys
from collections import Counter
from pathlib import Path

WORK = Path(sys.argv[1])
sys.argv = ["score.py", str(WORK / "pdfs"), str(WORK / "out")]
src = (Path(__file__).parent / "score.py").read_text().split("summary = {}")[0]
exec(src)  # load()·words()·norm()·truth 재사용

t = truth["11-scanned"]
exp = Counter(w for s in t["paragraphs"] + t["lines"] for w in words(s))
res = {}
for tool, f in [("pdf2docx", "ocr/11-ocr-pdf2docx.docx"), ("libreoffice", "ocr/lo/11-scanned-ocr.docx"), ("calibre", "ocr/11-ocr-calibre.docx")]:
    paras, tables, images, box = load(WORK / f)
    got = Counter(w for p in paras for w in words(p))
    on = [norm(p) for p in paras]
    res[tool] = {
        "word_recall": round(sum(min(c, got[w]) for w, c in exp.items()) / sum(exp.values()), 4),
        "para_intact": round(sum(1 for p in t["paragraphs"] if any(norm(p) in o for o in on)) / len(t["paragraphs"]), 4),
        "images": images,
        "textbox_share": round(box, 4),
    }
print(json.dumps(res, indent=1))
(Path(__file__).parent / "ocr_summary.json").write_text(json.dumps(res, indent=1))
