"""chain.py로 스위치 5개를 끈 프로필에서 Leo가 아직 열리는지, brave://flags로 끄면 무엇이 바뀌는지 확인한다.

사용: /tmp/pw/bin/python after.py {프로필} {단계}
단계: left    — 스위치를 다 끈 뒤 남는 진입점(메뉴·새 탭·brave://leo-ai 주소)
      flagoff — brave-ai-chat 실험 기능을 Disabled로 바꾸고 다시 실행해 확인
      flagback — Default로 되돌리고 다시 실행해 스위치 상태가 남는지 확인
"""

import json
import sys
import time

from playwright.sync_api import sync_playwright

from chain import page_text, prefs_snapshot, set_flag
from common import run_brave, shot, stop_brave, xdo
from probe import probe

profile, stage = sys.argv[1], sys.argv[2]
out = {'stage': stage}


def main_menu(name):
    xdo('mousemove', '1259', '59')
    xdo('click', '1')
    time.sleep(1.5)
    shot(name)
    xdo('key', 'Escape')
    time.sleep(0.5)


def new_tab(name):
    with sync_playwright() as p:
        b = p.chromium.connect_over_cdp('http://127.0.0.1:9340')
        ctx = b.contexts[0]
        page = ctx.pages[0]
        page.bring_to_front()
    xdo('key', 'ctrl+t')
    time.sleep(3)
    shot(name)
    xdo('key', 'ctrl+w')
    time.sleep(1)


proc, _ = run_brave(profile)
if stage == 'left':
    out['leo_page'] = page_text('brave://leo-ai', f'{profile}-left-leo-page')
    main_menu(f'{profile}-left-main-menu')
    new_tab(f'{profile}-left-new-tab')
    out['settings'] = page_text('brave://settings/leo-ai', f'{profile}-left-settings-leo')
elif stage == 'flagoff':
    out['flag'] = set_flag('brave-ai-chat', 'Disabled')
    stop_brave(proc)
    proc, _ = run_brave(profile)
    out['settings'] = page_text('brave://settings/leo-ai', f'{profile}-flagoff-settings-leo')
    out['leo_page'] = page_text('brave://leo-ai', f'{profile}-flagoff-leo-page')
    out['appearance'] = page_text('brave://settings/appearance', f'{profile}-flagoff-settings-appearance')
    main_menu(f'{profile}-flagoff-main-menu')
    out['probe'] = probe(f'{profile}-flagoff')
elif stage == 'flagback':
    out['flag'] = set_flag('brave-ai-chat', 'Default')
    stop_brave(proc)
    proc, _ = run_brave(profile)
    out['settings'] = page_text('brave://settings/leo-ai', f'{profile}-flagback-settings-leo')
    out['probe'] = probe(f'{profile}-flagback')
stop_brave(proc)
out['prefs'] = prefs_snapshot()
json.dump(out, open(f'after-{profile}-{stage}.json', 'w'), indent=1)
print(json.dumps({k: v for k, v in out.items() if k != 'prefs'}, indent=1)[:3000])
