"""떠 있는 Brave(CDP 9340)에서 Leo 진입점을 차례로 확인하고 캡처한다.

사용: /tmp/pw/bin/python probe.py {접두어}   (또는 chain.py가 probe(prefix)를 부름)
확인 순서: ① 시험 페이지 전체(툴바 버튼·사이드바 아이콘) ② 문단 오른쪽 클릭
③ 문단 선택 후 오른쪽 클릭(+ Leo AI tools 하위 메뉴) ④ 글 입력 칸 선택 후 오른쪽 클릭
⑤ 주소창에 질문 입력 ⑥ 탭 검색 창 Organize 탭
브라우저 메뉴는 페이지 밖이라 xdotool로 누르고 화면 전체를 캡처한다.
"""

import json
import subprocess
import sys
import time

from playwright.sync_api import sync_playwright

from common import shot, xdo

TEST = 'http://127.0.0.1:8767/'


def pixel(path, x, y):
    out = subprocess.run(['convert', path, '-format', f'%[pixel:p{{{x},{y}}}]', 'info:'], capture_output=True, text=True).stdout
    return out.strip()


def is_blue(px):
    # 'srgb(63,57,232)' 같은 값에서 파랑이 강한지
    try:
        r, g, b = [int(float(v)) for v in px[px.index('(') + 1:px.index(')')].split(',')[:3]]
    except Exception:
        return False
    return b > 180 and r < 120 and g < 120


def probe(prefix, cdp='http://127.0.0.1:9340'):
    log = {}
    with sync_playwright() as p:
        b = p.chromium.connect_over_cdp(cdp)
        ctx = b.contexts[0]
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        for extra in ctx.pages[1:]:
            extra.close()
        page.bring_to_front()
        page.goto(TEST, wait_until='load')
        time.sleep(2)

        # 분석 안내 막대(파란 Got it 버튼)가 있으면 닫기(X)만 누름
        first = shot(f'{prefix}-0-raw')
        if is_blue(pixel(first, 914, 97)):
            xdo('mousemove', '1248', '109')
            xdo('click', '1')
            time.sleep(1)
            log['infobar'] = 'closed'

        page.evaluate("() => { window.__off = null; addEventListener('mousemove', e => { window.__off = {x: 650 - e.clientX, y: 610 - e.clientY}; }); }")
        xdo('mousemove', '640', '600')
        time.sleep(0.3)
        xdo('mousemove', '650', '610')
        time.sleep(0.5)
        off = page.evaluate('() => window.__off')
        log['offset'] = off
        xdo('mousemove', '400', '700')
        time.sleep(0.5)
        log['window'] = shot(f'{prefix}-1-window')

        r = page.locator('#p1').bounding_box()
        px, py = int(off['x'] + r['x'] + 60), int(off['y'] + r['y'] + 12)

        # ② 문단 위 오른쪽 클릭 (선택 없음)
        xdo('mousemove', str(px), str(py))
        xdo('click', '3')
        time.sleep(1.5)
        log['context'] = shot(f'{prefix}-2-context')
        xdo('key', 'Escape')
        time.sleep(0.5)

        # ③ 문단 선택 후 오른쪽 클릭
        xdo('mousemove', str(px), str(py))
        xdo('click', '--repeat', '3', '--delay', '80', '1')
        time.sleep(0.5)
        log['selected'] = page.evaluate('() => getSelection().toString().slice(0, 40)')
        xdo('click', '3')
        time.sleep(1.5)
        log['context_selection'] = shot(f'{prefix}-3-context-selection')
        # 하위 메뉴: 네 번째 항목(선택 메뉴의 Leo AI tools 자리)에서 오른쪽 화살표
        for _ in range(4):
            xdo('key', 'Down')
            time.sleep(0.2)
        xdo('key', 'Right')
        time.sleep(1.2)
        log['context_selection_sub'] = shot(f'{prefix}-3b-context-submenu')
        xdo('key', 'Escape')
        xdo('key', 'Escape')
        time.sleep(0.5)

        # ④ 글 입력 칸에 글을 쓰고 전체 선택 후 오른쪽 클릭
        page.click('#t1')
        page.fill('#t1', '')
        page.keyboard.type('our roof gets sun most of the afternoon so we want to try panels')
        page.keyboard.press('Control+A')
        t = page.locator('#t1').bounding_box()
        tx, ty = int(off['x'] + t['x'] + 80), int(off['y'] + t['y'] + 14)
        xdo('mousemove', str(tx), str(ty))
        xdo('click', '3')
        time.sleep(1.5)
        log['context_textarea'] = shot(f'{prefix}-4-context-textarea')
        xdo('key', 'Escape')
        time.sleep(0.5)

        # ⑤ 주소창에 질문 입력
        xdo('key', 'ctrl+l')
        time.sleep(0.5)
        xdo('type', '--delay', '60', 'how do solar panels work')
        time.sleep(2.5)
        log['omnibox'] = shot(f'{prefix}-5-omnibox')
        xdo('key', 'Escape')
        xdo('key', 'Escape')
        time.sleep(0.5)

        # ⑥ 탭 검색 (Ctrl+Shift+A) → Organize 탭
        page.bring_to_front()
        page.click('h1')
        xdo('key', 'ctrl+shift+a')
        time.sleep(2)
        log['tab_search'] = shot(f'{prefix}-6-tab-search')
        xdo('mousemove', '1199', '58')
        xdo('click', '1')
        time.sleep(2)
        log['tab_organize'] = shot(f'{prefix}-7-tab-organize')
        xdo('key', 'Escape')
        time.sleep(0.5)
    return log


if __name__ == '__main__':
    print(json.dumps(probe(sys.argv[1]), indent=1))
