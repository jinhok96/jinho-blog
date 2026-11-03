"""새 프로필 m: Settings > Appearance > Customize your toolbar 패널의 Leo AI 스위치를 끄면 툴바 버튼이 사라지는지, 재시작 뒤 유지되는지."""
import json, time
from playwright.sync_api import sync_playwright
from common import run_brave, stop_brave, shot, xdo
from chain import prefs_snapshot
proc, _ = run_brave('m')
with sync_playwright() as p:
    page = p.chromium.connect_over_cdp('http://127.0.0.1:9340').contexts[0].pages[0]
    page.goto('brave://settings/appearance', wait_until='load'); time.sleep(2)
    page.get_by_text('Customize your toolbar', exact=True).first.click(); time.sleep(3)
shot('m-panel-before')
xdo('mousemove', '1194', '666'); xdo('click', '1'); time.sleep(2)
shot('m-panel-after')
stop_brave(proc)
pr = prefs_snapshot()
print({k: v for k, v in pr.items() if 'toolbar' in k})
proc, _ = run_brave('m')
time.sleep(2)
shot('m-after-restart')
stop_brave(proc)
