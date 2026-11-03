"""이미 떠 있는 Brave(CDP 9340)에서 설정 페이지 글자·토글을 모은다.

사용: /tmp/pw/bin/python survey.py {주소} {저장 이름}
"""

import json
import sys
import time

from playwright.sync_api import sync_playwright

from common import deep_text_js, shot, toggles_js

url, name = sys.argv[1], sys.argv[2]
with sync_playwright() as p:
    b = p.chromium.connect_over_cdp('http://127.0.0.1:9340')
    ctx = b.contexts[0]
    page = ctx.pages[0] if ctx.pages else ctx.new_page()
    page.bring_to_front()
    try:
        page.goto(url, wait_until='load', timeout=20000)
    except Exception as e:  # brave:// 페이지는 load 이벤트가 늦을 수 있음
        print('goto:', e)
    time.sleep(3)
    text = page.evaluate(deep_text_js())
    tg = page.evaluate(toggles_js())
    print('URL', page.url)
    print(text[:6000])
    print(json.dumps(tg, indent=1))
    with open(f'screens/{name}.txt', 'w') as f:
        f.write(f'URL {page.url}\n\n{text}\n\nTOGGLES\n{json.dumps(tg, indent=1)}\n')
    shot(name)
