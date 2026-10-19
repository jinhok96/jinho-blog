"""iLovePDF PDF to Word 웹에서 파일 1개 변환 (Playwright Chromium). 사용: ilove_one.py <pdf> <outdir> [shotprefix]"""
import sys, time
from pathlib import Path
from playwright.sync_api import sync_playwright
pdf, outdir = Path(sys.argv[1]), Path(sys.argv[2]); shot = sys.argv[3] if len(sys.argv) > 3 else None
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args=["--no-sandbox"])
    pg = b.new_page(viewport={"width": 1366, "height": 900}, accept_downloads=True)
    pg.goto("https://www.ilovepdf.com/pdf_to_word", wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_timeout(3000)
    for sel in ["#onetrust-accept-btn-handler", "button:has-text('Accept')"]:
        try: pg.click(sel, timeout=1500)
        except Exception: pass
    pg.set_input_files("input[type=file]", str(pdf))
    pg.wait_for_timeout(4000)
    if shot: pg.screenshot(path=f"/tmp/p2w/shots/{shot}-options.png")
    t0 = time.time()
    pg.click("#processTask", timeout=30000)
    with pg.expect_download(timeout=180000) as d:
        pg.wait_for_timeout(1000)
    dl = d.value
    t1 = time.time()
    pg.wait_for_timeout(1500)
    if shot: pg.screenshot(path=f"/tmp/p2w/shots/{shot}-done.png")
    out = outdir / (pdf.stem + Path(dl.suggested_filename).suffix)
    dl.save_as(out)
    print(pdf.stem, dl.suggested_filename, round(t1 - t0, 1), out.stat().st_size)
    b.close()
