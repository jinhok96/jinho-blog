"""관리 정책 BraveAIChatEnabled=false(/etc/brave/policies/managed)일 때 Leo 설정·진입점을 본다 (새 프로필 h)."""
import json, time
from playwright.sync_api import sync_playwright
from chain import page_text
from common import run_brave, stop_brave, shot, deep_text_js, xdo
proc, _ = run_brave('h')
out = {}
out['settings'] = page_text('brave://settings/leo-ai', 'h-policy-settings-leo')
out['leo_page'] = page_text('brave://leo-ai', 'h-policy-leo-page')
with sync_playwright() as p:
    b = p.chromium.connect_over_cdp('http://127.0.0.1:9340')
    page = b.contexts[0].pages[0]
    page.goto('brave://policy', wait_until='load'); time.sleep(2)
    t = page.evaluate(deep_text_js())
    out['policy'] = [ln for ln in t.split('\n') if 'BraveAIChat' in ln or 'false' in ln.lower()][:10]
    open('screens/h-policy.txt','w').write(t)
    page.goto('http://127.0.0.1:8767/', wait_until='load'); time.sleep(2)
shot('h-policy-window')
xdo('mousemove', '1259', '59'); xdo('click', '1'); time.sleep(1.5); shot('h-policy-main-menu'); xdo('key', 'Escape')
stop_brave(proc)
print(json.dumps(out, indent=1))
