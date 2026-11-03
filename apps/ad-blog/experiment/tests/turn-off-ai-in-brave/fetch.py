"""1차 출처 페이지를 Chromium으로 렌더링해 본문 글자를 source-{이름}.txt로 저장한다.

사용: /tmp/pw/bin/python fetch.py {이름} {주소} [{이름} {주소} ...]
"""

import sys
import time
from datetime import datetime, timezone

from playwright.sync_api import sync_playwright

pairs = list(zip(sys.argv[1::2], sys.argv[2::2]))
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1243/chrome-linux64/chrome')
    page = b.new_page(locale='en-US')
    for name, url in pairs:
        try:
            resp = page.goto(url, wait_until='networkidle', timeout=45000)
            status = resp.status if resp else None
        except Exception as e:
            status = f'error {e}'
        time.sleep(2)
        # 접힌 단락(details)도 펼침
        try:
            page.evaluate("() => document.querySelectorAll('details').forEach(d => d.open = true)")
        except Exception:
            pass
        text = page.evaluate('() => document.body ? document.body.innerText : ""')
        stamp = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')
        with open(f'source-{name}.txt', 'w') as f:
            f.write(f'URL: {url}\nFinal: {page.url}\nStatus: {status}\nFetched: {stamp}\n\n{text}\n')
        print(name, status, len(text), page.url)
    b.close()
