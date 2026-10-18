"""입력 PDF 1개 → {W}/in/packet.pdf (12쪽)

쪽 구성 (나누기 대상이 섞인 "서류 묶음"):
  1~4쪽  report: 직접 만든 4쪽 문서, Chromium(Playwright, outline=True, tagged=True) 인쇄
         책갈피 h1 1개 + h2 3개(Summary 2쪽·Measurements 3쪽·Appendix 4쪽), 1쪽 목차의 문서 안 링크 3개, 외부 링크 1개
  5~10쪽 IRS Form W-9 (Rev. March 2024, 공공 영역, https://www.irs.gov/pub/irs-pdf/fw9.pdf)
         1번 칸(Name)에 테스트 값 입력, XFA 계층 삭제 (모든 뷰어가 같은 AcroForm 값을 보게)
  11~12쪽 사진: PD12M 14·15번(CC0, convert-heic-to-jpg-free/sources.json)을 3000px 폭·품질 90 JPEG로, img2pdf로 1장 1쪽
합치기는 pypdf append (merge-pdf-files-free-offline 측정에서 책갈피·링크·단일 양식을 모두 유지한 방법)
실행: /tmp/pdfs/bin/python -I build_input.py [W]
"""
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageOps
from playwright.sync_api import sync_playwright
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject

W = Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/split")
IN = W / "in"
IN.mkdir(parents=True, exist_ok=True)
PARTS = W / "parts"
PARTS.mkdir(exist_ok=True)

PARA = (
    "This paragraph is filler text for a split test. It gives each page enough body text "
    "so that text extraction before and after splitting can be compared word for word. "
) * 6

secs = [("Summary", "summary"), ("Measurements", "measurements"), ("Appendix", "appendix")]
toc = "".join(f'<li><a href="#{a}">{t}</a></li>' for t, a in secs)
body = f"<p>{PARA}</p>"
for t, a in secs:
    body += f'<h2 id="{a}" style="break-before: page">{t}</h2><p>{PARA}</p><p>{PARA}</p>'
html = f"""<!doctype html><html><head><meta charset="utf-8"><title>Test report</title>
<style>body{{font:12pt/1.5 sans-serif;margin:0.8in}}</style></head><body>
<h1>Test report</h1><p>Contents:</p><ol>{toc}</ol>
<p>External link: <a href="https://www.irs.gov/forms-pubs/about-form-w-9">IRS About Form W-9</a></p>
{body}</body></html>"""

with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    pg = b.new_page()
    pg.set_content(html)
    pg.pdf(path=str(PARTS / "report.pdf"), format="Letter", outline=True, tagged=True, print_background=True)
    b.close()

w = PdfWriter(clone_from=str(W / "src" / "fw9.pdf"))
af = w._root_object["/AcroForm"]
if "/XFA" in af:
    del af[NameObject("/XFA")]
w.update_page_form_field_values(w.pages[0], {"topmostSubform[0].Page1[0].f1_01[0]": "TEST VENDOR ONE LLC"}, auto_regenerate=False)
w.set_need_appearances_writer(False)
w.write(PARTS / "w9.pdf")

ph = []
for n in (14, 15):
    im = ImageOps.exif_transpose(Image.open(W / "photos" / f"{n}.jpg")).convert("RGB")
    im = im.resize((3000, round(im.height * 3000 / im.width)), Image.LANCZOS)
    out = W / "photos" / f"s{n}.jpg"
    im.save(out, quality=90)
    ph.append(str(out))
subprocess.run(["/tmp/pdfs/bin/img2pdf", "--pagesize", "Letter^T", "-o", str(PARTS / "photos.pdf"), *ph], check=True)

m = PdfWriter()
for f in ("report.pdf", "w9.pdf", "photos.pdf"):
    m.append(str(PARTS / f))
m.write(IN / "packet.pdf")

r = PdfReader(IN / "packet.pdf")
print("packet.pdf", len(r.pages), "pages", (IN / "packet.pdf").stat().st_size, "bytes",
      "fields", len(r.get_fields() or {}), "outline", r.outline)
