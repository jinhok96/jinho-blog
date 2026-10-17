"""Chrome(PDFium) 뷰어에서 나눈 W-9 첫 쪽 Name 칸(입력값 TEST VENDOR ONE LLC)을 클릭하고 글자를 덧붙여 입력 → 윗부분 캡처
입력이 되면 칸 값이 바뀌고, 양식이 평면화됐으면 화면이 그대로임
실행: /tmp/pdfs/bin/python -I chrome_form_shot.py <pdf> <out.png>
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
    pg.keyboard.insert_text(" - EDITED")
    time.sleep(1)
    pg.screenshot(path=out, clip={"x": 100, "y": 20, "width": 1000, "height": 250})
    b.close()
