"""Brave(새 프로필)로 search.brave.com 설정 화면을 한 번 열어 본다. 막히면(429 등) 우회하지 않고 기록만 한다."""
import json, time
from playwright.sync_api import sync_playwright
from common import run_brave, stop_brave, shot, deep_text_js, toggles_js
proc, _ = run_brave('e')
out = {}
with sync_playwright() as p:
    b = p.chromium.connect_over_cdp('http://127.0.0.1:9340')
    page = b.contexts[0].pages[0]
    resp = page.goto('https://search.brave.com/settings', wait_until='load', timeout=45000)
    time.sleep(4)
    out['status'] = resp.status if resp else None
    out['url'] = page.url
    text = page.evaluate('() => document.body.innerText')
    open('screens/e-search-settings.txt', 'w').write(f"URL {page.url}\nStatus {out['status']}\n\n{text}\n")
    shot('e-search-settings')
    out['chars'] = len(text)
stop_brave(proc)
print(json.dumps(out))
