"""설정 화면에서 글자가 일치하는 요소를 눌러 새로 열린 화면을 기록한다.

사용: /tmp/pw/bin/python click_text.py {주소} "{누를 글자}" {저장 이름}
"""

import json
import sys
import time

from playwright.sync_api import sync_playwright

from common import deep_text_js, shot, toggles_js

url, label, name = sys.argv[1], sys.argv[2], sys.argv[3]
with sync_playwright() as p:
    b = p.chromium.connect_over_cdp('http://127.0.0.1:9340')
    ctx = b.contexts[0]
    page = ctx.pages[0]
    page.bring_to_front()
    try:
        page.goto(url, wait_until='load', timeout=20000)
    except Exception as e:
        print('goto:', e)
    time.sleep(2)
    loc = page.get_by_text(label, exact=True).first
    loc.scroll_into_view_if_needed()
    loc.click()
    time.sleep(3)
    target = ctx.pages[-1]
    target.bring_to_front()
    time.sleep(1)
    text = target.evaluate(deep_text_js())
    tg = target.evaluate(toggles_js())
    print('URL', target.url)
    print(text[:4000])
    print(json.dumps(tg, indent=1)[:3000])
    with open(f'screens/{name}.txt', 'w') as f:
        f.write(f'URL {target.url}\n\n{text}\n\nTOGGLES\n{json.dumps(tg, indent=1)}\n')
    shot(name)
