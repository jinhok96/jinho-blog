"""PDF24 Tools Compress PDF 웹(로그인 없음)으로 PDF 1개 압축. 사용: pdf24_run.py <pdf> <outdir> [dpi] [quality] [shotprefix]"""
import sys, time
from pathlib import Path
from playwright.sync_api import sync_playwright
pdf, outdir = Path(sys.argv[1]), Path(sys.argv[2])
dpi = sys.argv[3] if len(sys.argv) > 3 else None
q = sys.argv[4] if len(sys.argv) > 4 else None
shot = sys.argv[5] if len(sys.argv) > 5 else None
outdir.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args=["--no-sandbox"])
    pg = b.new_page(viewport={"width": 1366, "height": 900}, accept_downloads=True)
    pg.goto("https://tools.pdf24.org/en/compress-pdf", wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_timeout(4000)
    pg.set_input_files("input[type=file]", str(pdf))
    btn = pg.get_by_role("button", name="Compress").or_(pg.locator("button:has-text('Compress')")).first
    btn.wait_for(timeout=120000)
    for _ in range(240):
        if btn.is_enabled(): break
        pg.wait_for_timeout(1000)
    pg.wait_for_timeout(1000)
    inputs = pg.locator("input[type=number], input[type=text]").all()
    vis = [i for i in inputs if i.is_visible()]
    if dpi: vis[0].fill(dpi)
    if q: vis[1].fill(q)
    print("fields", [i.input_value() for i in vis])
    if shot: pg.screenshot(path=f"/tmp/cp/shots/{shot}-options.png")
    t0 = time.time()
    btn.click()
    dl_btn = pg.frame_locator("iframe[src*=job-monitor]").get_by_text("Download", exact=True).first
    try:
        dl_btn.wait_for(state="visible", timeout=300000)
    except Exception:
        pg.screenshot(path=f"/tmp/cp/shots/pdf24-fail-{pdf.stem}.png"); raise
    t1 = time.time()
    pg.wait_for_timeout(1500)
    if shot: pg.screenshot(path=f"/tmp/cp/shots/{shot}-done.png")
    with pg.expect_download(timeout=120000) as d:
        dl_btn.click()
    out = outdir / (pdf.stem + ".pdf")
    d.value.save_as(out)
    print(pdf.stem, dpi, q, d.value.suggested_filename, round(t1 - t0, 1), out.stat().st_size, flush=True)
    b.close()
