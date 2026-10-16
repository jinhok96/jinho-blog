# Chrome(Chromium 141, Playwright 1.64, --headless=new) PDF 뷰어 화면 캡처: chrome_shot.py <pdf> <#조각> <출력.png> [클릭 x,y ...]
import sys, time
from playwright.sync_api import sync_playwright
f, frag, out = sys.argv[1], sys.argv[2], sys.argv[3]
clicks = sys.argv[4:]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args=["--headless=new"], headless=True)
    pg = b.new_page(viewport={"width": 1280, "height": 800})
    pg.goto(f"file://{f}#{frag}")
    time.sleep(4)
    for c in clicks:
        x, y = map(int, c.split(","))
        pg.mouse.click(x, y); time.sleep(1.5)
    pg.screenshot(path=out)
    b.close()
