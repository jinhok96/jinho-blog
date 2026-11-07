"""Brave Search의 Answer with AI를 끄기 전후로 같은 검색을 한 번씩 해 보고, 설정이 어디에 저장되는지 본다.

사용: /tmp/pw/bin/python search_ai.py   (새 프로필 f, 검색은 켜짐·꺼짐 각 1회만. 막히면 우회하지 않음)
"""

import json
import time
from urllib.parse import quote

from playwright.sync_api import sync_playwright

from common import run_brave, shot, stop_brave, xdo

Q = 'how do solar panels work'
out = {}


def cookies(ctx):
    return [
        {'name': c['name'], 'value': c['value'][:40], 'domain': c['domain'], 'expires': c.get('expires')}
        for c in ctx.cookies(['https://search.brave.com'])
    ]


proc, _ = run_brave('f')
with sync_playwright() as p:
    b = p.chromium.connect_over_cdp('http://127.0.0.1:9340')
    ctx = b.contexts[0]
    page = ctx.pages[0]

    # 1) 켜짐(기본) 상태 검색
    r = page.goto(f'https://search.brave.com/search?q={quote(Q)}', wait_until='load', timeout=45000)
    time.sleep(8)
    out['search_on'] = {'status': r.status if r else None, 'url': page.url}
    open('screens/f-search-on.txt', 'w').write(page.evaluate('() => document.body.innerText'))
    shot('f-search-on')
    out['cookies_after_search'] = cookies(ctx)

    # 2) 설정에서 Answer with AI 끄기
    page.goto('https://search.brave.com/settings', wait_until='load', timeout=45000)
    time.sleep(3)
    out['learn_more_links'] = page.evaluate("() => [...document.querySelectorAll('a')].filter(a => /learn more/i.test(a.innerText)).map(a => a.href)")
    sw = page.evaluate("""() => {
      const label = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'Answer with AI');
      let row = label; for (let i = 0; i < 6 && row; i++) { const inp = row.querySelector && row.querySelector('input[type=checkbox], [role=switch], button[role=switch]'); if (inp) { const r = inp.getBoundingClientRect(); return {tag: inp.tagName, checked: inp.checked ?? inp.getAttribute('aria-checked'), x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width}; } row = row.parentElement; }
      return null;
    }""")
    out['switch_before'] = sw
    shot('f-settings-before')
    # 화면의 스위치를 누름 (스크린샷 기준 좌표: 스위치 가운데)
    xdo('mousemove', '731', '671')
    xdo('click', '1')
    time.sleep(2)
    sw2 = page.evaluate("""() => {
      const label = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'Answer with AI');
      let row = label; for (let i = 0; i < 6 && row; i++) { const inp = row.querySelector && row.querySelector('input[type=checkbox], [role=switch], button[role=switch]'); if (inp) return {checked: inp.checked ?? inp.getAttribute('aria-checked')}; row = row.parentElement; }
      return null;
    }""")
    out['switch_after'] = sw2
    shot('f-settings-after')
    out['cookies_after_toggle'] = cookies(ctx)
    try:
        out['local_storage_keys'] = page.evaluate('() => Object.keys(localStorage)')
    except Exception as e:
        out['local_storage_keys'] = str(e)

    # 3) 꺼짐 상태에서 같은 검색
    r = page.goto(f'https://search.brave.com/search?q={quote(Q)}', wait_until='load', timeout=45000)
    time.sleep(8)
    out['search_off'] = {'status': r.status if r else None, 'url': page.url}
    open('screens/f-search-off.txt', 'w').write(page.evaluate('() => document.body.innerText'))
    shot('f-search-off')
stop_brave(proc)
json.dump(out, open('search-ai-f.json', 'w'), indent=1)
print(json.dumps(out, indent=1)[:4000])
