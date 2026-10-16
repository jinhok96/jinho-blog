"""Chrome(PDFium) 뷰어에서 4쪽 W-9 Name 칸에 입력 → 10쪽 Name 칸 화면 확인"""
import sys, time
from playwright.sync_api import sync_playwright
tool = sys.argv[1]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args=["--headless=new"], headless=True)
    pg = b.new_page(viewport={"width": 1200, "height": 900})
    pg.goto(f"file:///tmp/merge/out/{tool}.pdf#page=4&zoom=100&toolbar=0&navpanes=0")
    time.sleep(4)
    pg.mouse.click(600, 170)
    time.sleep(0.5)
    pg.keyboard.press("End")
    pg.keyboard.press("Shift+Home")
    pg.keyboard.insert_text("EDITED ON PAGE 4")
    pg.keyboard.press("Tab")
    time.sleep(1)
    pg.screenshot(path=f"/tmp/merge/form-{tool}-p4.png")
    pg.mouse.move(600, 500)
    pg.mouse.wheel(0, int(sys.argv[2]) if len(sys.argv) > 2 else 6360)
    time.sleep(3)
    pg.screenshot(path=f"/tmp/merge/form-{tool}-p10.png")
    b.close()
