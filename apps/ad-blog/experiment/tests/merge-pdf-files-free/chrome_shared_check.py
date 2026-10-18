"""Chrome(PDFium) 뷰어에서 합친 W-9 2부의 첫 W-9(1쪽) 2번 칸(Business name)에 입력 → 7쪽(두 번째 W-9)으로 스크롤해 같은 칸 캡처
칸을 공유하면 두 번째 W-9에도 같은 글자가 나타남
실행: /tmp/pdfs/bin/python -I chrome_shared_check.py <pdf> <out-prefix>
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
    pg.screenshot(path=out + "-p1-before.png")
    pg.mouse.click(600, 202)
    time.sleep(0.5)
    pg.keyboard.insert_text("TYPED ON FORM 1")
    pg.keyboard.press("Tab")
    time.sleep(1)
    pg.screenshot(path=out + "-p1.png")
    for _ in range(60):
        pg.mouse.wheel(0, 107)
        time.sleep(0.05)
    time.sleep(1.5)
    pg.screenshot(path=out + "-p7.png")
    b.close()
