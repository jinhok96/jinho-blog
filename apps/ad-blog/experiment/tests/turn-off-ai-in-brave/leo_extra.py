"""Leo 대화 기록 스위치·Clear Leo data 확인 창·관리 정책 목록을 확인한다 (새 프로필 g, 아무것도 지우지 않음).

사용: /tmp/pw/bin/python leo_extra.py
"""

import json
import time

from playwright.sync_api import sync_playwright

from common import deep_text_js, run_brave, shot, stop_brave, xdo

out = {}
proc, _ = run_brave('g')
with sync_playwright() as p:
    b = p.chromium.connect_over_cdp('http://127.0.0.1:9340')
    ctx = b.contexts[0]
    page = ctx.pages[0]
    page.goto('brave://settings/leo-ai', wait_until='load')
    time.sleep(3)
    # Clear Leo data 확인 창 (취소만 누름)
    page.get_by_text('Clear Leo data', exact=True).first.click()
    time.sleep(2)
    out['clear_dialog'] = page.evaluate(deep_text_js())[-1500:]
    shot('g-clear-leo-data-dialog')
    xdo('key', 'Escape')
    time.sleep(1)
    # 대화 기록 스위치가 보이게 스크롤
    page.get_by_text('Store my conversation history', exact=True).first.scroll_into_view_if_needed()
    time.sleep(1)
    shot('g-store-history')
    # 관리 정책 목록 (값이 없는 정책도 표시)
    page.goto('brave://policy', wait_until='load')
    time.sleep(2)
    try:
        page.get_by_text('Show policies with no value set').first.click()
        time.sleep(2)
    except Exception as e:
        out['policy_click'] = str(e)
    text = page.evaluate(deep_text_js())
    lines = [ln for ln in text.split('\n') if 'AIChat' in ln or 'Leo' in ln or 'BraveAI' in ln or 'AiChat' in ln]
    out['policy_lines'] = lines[:40]
    open('screens/g-policy.txt', 'w').write(text)
stop_brave(proc)
json.dump(out, open('leo-extra-g.json', 'w'), indent=1)
print(json.dumps(out, indent=1)[:4000])
