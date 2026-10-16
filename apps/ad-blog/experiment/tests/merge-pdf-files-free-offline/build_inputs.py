"""입력 PDF 5개 → {W}/in (W 기본 /tmp/merge)

1) report-a.pdf, report-b.pdf: 직접 만든 3쪽 문서를 Chromium(Playwright, outline=True, tagged=True)으로 인쇄.
   책갈피(h1·h2) 4개씩, 목차의 문서 안 링크 3개씩, 외부 링크 1개씩
2) w9-a.pdf, w9-b.pdf: IRS Form W-9 (Rev. March 2024, 6쪽, 공공 영역, https://www.irs.gov/pub/irs-pdf/fw9.pdf)
   1번 칸(Name)에 서로 다른 테스트 값을 pypdf로 입력. XFA 계층은 지워 모든 뷰어가 같은 AcroForm 값을 보이게 함
3) photos.pdf: PD12M 14·15·18번(CC0, convert-heic-to-jpg-free/sources.json)을 3000px 폭·품질 90 JPEG로 줄여 img2pdf로 1장 1쪽
실행: /tmp/pdfm/bin/python -I build_inputs.py [W]
"""
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageOps
from playwright.sync_api import sync_playwright
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject

W = Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/merge")
IN = W / "in"
IN.mkdir(parents=True, exist_ok=True)

PARA = (
    "This paragraph is filler text for a merge test. It gives each page enough body text "
    "so that text extraction before and after merging can be compared word for word. "
) * 6


def report_html(letter: str) -> str:
    secs = [("Summary", "summary"), ("Measurements", "measurements"), ("Appendix", "appendix")]
    toc = "".join(f'<li><a href="#{a}-{letter}">{t}</a></li>' for t, a in secs)
    body = ""
    for i, (t, a) in enumerate(secs):
        brk = 'style="break-before: page"' if i else ""
        body += f'<h2 id="{a}-{letter}" {brk}>{t} ({letter.upper()})</h2><p>{PARA}</p>'
        body += f"<p>{PARA}</p>"
    return f"""<!doctype html><html><head><meta charset="utf-8"><title>Test report {letter.upper()}</title>
<style>body{{font:12pt/1.5 sans-serif;margin:0.8in}}</style></head><body>
<h1>Test report {letter.upper()}</h1>
<p>Contents:</p><ol>{toc}</ol>
<p>External link: <a href="https://www.irs.gov/forms-pubs/about-form-w-9">IRS About Form W-9</a></p>
{body}</body></html>"""


with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    pg = b.new_page()
    for L in "ab":
        pg.set_content(report_html(L))
        pg.pdf(path=str(IN / f"report-{L}.pdf"), format="Letter", outline=True, tagged=True, print_background=True)
    b.close()

for L, name in (("a", "TEST VENDOR ONE LLC"), ("b", "TEST VENDOR TWO LLC")):
    w = PdfWriter(clone_from=str(W / "src" / "fw9.pdf"))
    af = w._root_object["/AcroForm"]
    if "/XFA" in af:
        del af[NameObject("/XFA")]
    w.update_page_form_field_values(w.pages[0], {"topmostSubform[0].Page1[0].f1_01[0]": name}, auto_regenerate=False)
    w.set_need_appearances_writer(False)
    w.write(IN / f"w9-{L}.pdf")

ph = []
for n in (14, 15, 18):
    im = ImageOps.exif_transpose(Image.open(W / "photos" / f"{n}.jpg")).convert("RGB")
    im = im.resize((3000, round(im.height * 3000 / im.width)), Image.LANCZOS)
    out = W / "photos" / f"s{n}.jpg"
    im.save(out, quality=90)
    ph.append(str(out))
subprocess.run(["img2pdf", "--pagesize", "Letter^T", "-o", str(IN / "photos.pdf"), *ph], check=True)

for f in sorted(IN.glob("*.pdf")):
    r = PdfReader(f)
    print(f.name, len(r.pages), f.stat().st_size, "fields", len(r.get_fields() or {}), "outline", len(r.outline))
