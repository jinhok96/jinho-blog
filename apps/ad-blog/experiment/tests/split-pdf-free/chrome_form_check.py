"""Chrome(PDFium) 뷰어에서 나눈 W-9 첫 쪽의 Name 칸을 클릭해 입력 → 화면 캡처 (입력 가능 여부를 눈으로 확인)
실행: /tmp/pdfs/bin/python -I chrome_form_check.py <pdf> <out.png>
"""
import sys
import time

from playwright.sync_api import sync_playwright

pdf, out = sys.argv[1], sys.argv[2]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args=["--headless=new"], headless=True)
    pg = b.new_page(viewport={"width": 1200, "height": 900})
    pg.goto(f"file://{pdf}#page=1&zoom=100&toolbar=0&navpanes=0")
    time.sleep(4)
    pg.mouse.click(600, 170)
    time.sleep(0.5)
    pg.keyboard.press("End")
    pg.keyboard.press("Shift+Home")
    pg.keyboard.insert_text("TYPED IN CHROME")
    pg.keyboard.press("Tab")
    time.sleep(1)
    pg.screenshot(path=out)
    b.close()
