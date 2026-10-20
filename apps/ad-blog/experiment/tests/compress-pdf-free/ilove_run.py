"""iLovePDF Compress PDF 웹(로그인 안 함)으로 PDF 1개 압축. 사용: ilove_run.py <pdf> <level extreme|recommended|low> <outdir> [shotprefix]"""
import sys, time
from pathlib import Path
from playwright.sync_api import sync_playwright
pdf, level, outdir = Path(sys.argv[1]), sys.argv[2], Path(sys.argv[3]); shot = sys.argv[4] if len(sys.argv) > 4 else None
outdir.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args=["--no-sandbox"])
    pg = b.new_page(viewport={"width": 1366, "height": 900}, accept_downloads=True)
    pg.goto("https://www.ilovepdf.com/compress_pdf", wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_timeout(3000)
    for sel in ["#onetrust-accept-btn-handler", "button:has-text('Accept')"]:
        try: pg.click(sel, timeout=1500)
        except Exception: pass
    pg.set_input_files("input[type=file]", str(pdf))
    try:
        pg.get_by_text("Compression level", exact=False).first.wait_for(timeout=60000)
    except Exception:
        pg.screenshot(path=f"/tmp/cp/shots/fail-{pdf.stem}-{level}.png"); print(pg.inner_text("body")[:800]); raise
    pg.wait_for_timeout(1500)
    LABEL = {"extreme": "Extreme compression", "recommended": "Recommended compression", "low": "Less compression"}[level]
    pg.get_by_text(LABEL, exact=False).first.click()
    pg.wait_for_timeout(800)
    if shot: pg.screenshot(path=f"/tmp/cp/shots/{shot}-options.png")
    t0 = time.time()
    pg.click("#processTask", timeout=30000)
    with pg.expect_download(timeout=300000) as d:
        pg.wait_for_timeout(1000)
    dl = d.value
    t1 = time.time()
    pg.wait_for_timeout(2000)
    if shot: pg.screenshot(path=f"/tmp/cp/shots/{shot}-done.png")
    out = outdir / (pdf.stem + ".pdf")
    dl.save_as(out)
    print(pdf.stem, level, dl.suggested_filename, round(t1 - t0, 1), out.stat().st_size, flush=True)
    b.close()
