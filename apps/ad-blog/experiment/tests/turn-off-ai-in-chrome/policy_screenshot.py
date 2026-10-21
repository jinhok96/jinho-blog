"""chrome://policy 캡처: 글의 예시 정책 3개를 Linux 관리 정책 파일로 넣고 Chromium으로 연 화면 (1200×675 PNG).

/etc/chromium/policies/managed/50-toolproof-ai-off.json 을 만든 뒤 실행하고, 캡처 후 삭제한다
(컨테이너의 기존 정책 파일은 건드리지 않음. 이름 필터 "Settings"로 예시 정책만 보이게 함).
  {"GeminiSettings": 1, "GenAILocalFoundationalModelSettings": 1, "HelpMeWriteSettings": 2}
실행: python3 -I policy_screenshot.py <출력 PNG>
"""
import sys
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    ctx = p.chromium.launch_persistent_context(
        '/tmp/toolproof-policy-profile', executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
        headless=True, viewport={'width': 1200, 'height': 675}, locale='en-US')
    pg = ctx.new_page()
    pg.goto('chrome://policy')
    pg.wait_for_timeout(2000)
    pg.locator('input').first.fill('Settings')
    pg.wait_for_timeout(1000)
    pg.screenshot(path=sys.argv[1])
    ctx.close()
