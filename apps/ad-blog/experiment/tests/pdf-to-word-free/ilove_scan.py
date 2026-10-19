"""iLovePDF 스캔 PDF: Apply OCR(유료 여부 확인) / Continue without OCR(다운로드)"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
mode = sys.argv[1]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args=["--no-sandbox"])
    pg = b.new_page(viewport={"width": 1366, "height": 900}, accept_downloads=True)
    pg.goto("https://www.ilovepdf.com/pdf_to_word", wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_timeout(3000)
    pg.set_input_files("input[type=file]", "/tmp/p2w/in/11-scanned.pdf")
    pg.wait_for_timeout(4000)
    pg.click("#processTask")
    pg.locator("button:visible", has_text="Continue without OCR").first.wait_for(timeout=60000)
    pg.screenshot(path="/tmp/p2w/shots/ilove-scan-prompt.png")
    if mode == "ocr":
        pg.locator("button:visible", has_text="Apply OCR").first.click(); pg.wait_for_timeout(8000)
        pg.screenshot(path="/tmp/p2w/shots/ilove-scan-ocr.png"); print(pg.url)
        with pg.expect_download(timeout=120000) as d:
            pg.locator("a:visible, button:visible", has_text="Download WORD").first.click()
        d.value.save_as("/tmp/p2w/out/ilovepdf/11-scanned-ocr.docx"); print("ocr saved", d.value.suggested_filename)
    else:
        with pg.expect_download(timeout=120000) as d:
            pg.locator("button:visible", has_text="Continue without OCR").first.click()
        d.value.save_as("/tmp/p2w/out/ilovepdf/11-scanned.docx"); print("saved")
    b.close()
