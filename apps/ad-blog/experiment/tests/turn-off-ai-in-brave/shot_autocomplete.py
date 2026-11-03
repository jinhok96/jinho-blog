"""새 프로필 k에서 Settings > Appearance의 주소창 제안 체크박스(Leo AI Assistant 포함)를 화면 가운데로 스크롤해 캡처."""
import time
from playwright.sync_api import sync_playwright
from common import run_brave, stop_brave, shot, xdo
proc, _ = run_brave('k')
with sync_playwright() as p:
    page = p.chromium.connect_over_cdp('http://127.0.0.1:9340').contexts[0].pages[0]
    page.goto('brave://settings/appearance', wait_until='load'); time.sleep(2)
    xdo('mousemove', '1248', '109'); xdo('click', '1'); time.sleep(1)  # 분석 안내 막대 닫기(X)
    page.get_by_text('Leo AI Assistant', exact=True).first.scroll_into_view_if_needed(); time.sleep(0.5)
    page.mouse.wheel(0, 150); time.sleep(1)
    shot('k-appearance-autocomplete')
stop_brave(proc)
