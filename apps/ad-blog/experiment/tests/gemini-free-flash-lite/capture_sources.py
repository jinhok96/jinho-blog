"""Google 공식 요금·도움말 페이지를 Chromium으로 렌더링해 텍스트·화면을 저장."""
import sys
from playwright.sync_api import sync_playwright

PAGES = {
    "one-plans": "https://one.google.com/about/plans?hl=en&gl=US",
    "gemini-subscriptions": "https://gemini.google/subscriptions/?hl=en",
    "gemini-models-help": "https://support.google.com/gemini/answer/18648722?hl=en",
    "gemini-limits-help": "https://support.google.com/gemini/answer/16275805?hl=en",
}
out = sys.argv[1]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    pg = b.new_page(viewport={"width": 1400, "height": 900}, locale="en-US")
    for name, url in PAGES.items():
        pg.goto(url, wait_until="networkidle", timeout=90000)
        pg.wait_for_timeout(3000)
        open(f"{out}/{name}.txt", "w").write(pg.inner_text("body"))
        pg.screenshot(path=f"{out}/{name}.png", full_page=True)
        print(name, "ok")
    b.close()
