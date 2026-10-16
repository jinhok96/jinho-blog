# 스크롤 캡처: chrome_scroll_shot.py <pdf> <출력.png> <스크롤 px> (100% 확대에서 1쪽 ≈ 1,060px)
import sys, time
from playwright.sync_api import sync_playwright
f, out, dy = sys.argv[1], sys.argv[2], int(sys.argv[3])
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args=["--headless=new"], headless=True)
    pg = b.new_page(viewport={"width": 1200, "height": 900})
    pg.goto(f"file://{f}#page=1&zoom=100&toolbar=0&navpanes=0")
    time.sleep(4)
    pg.mouse.move(600, 500); pg.mouse.wheel(0, dy); time.sleep(2)
    pg.screenshot(path=out)
    b.close()
