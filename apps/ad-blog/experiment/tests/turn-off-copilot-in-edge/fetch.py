"""1차 출처를 Chromium(en-US)으로 렌더링해 본문 글자와 링크를 저장. 사용: fetch.py 이름 URL [이름 URL ...]"""
import sys, time, json
from playwright.sync_api import sync_playwright
args = sys.argv[1:]
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(locale="en-US", viewport={"width": 1280, "height": 900})
    for i in range(0, len(args), 2):
        name, url = args[i], args[i+1]
        pg = ctx.new_page()
        try:
            pg.goto(url, wait_until="domcontentloaded", timeout=60000)
            time.sleep(6)
            # 접힌 단락 펼치기
            for el in pg.locator("details:not([open]) > summary").all():
                try: el.click(timeout=1000)
                except Exception: pass
            for el in pg.locator("button[aria-expanded=false]").all()[:40]:
                try: el.click(timeout=800)
                except Exception: pass
            time.sleep(1)
            text = pg.evaluate("() => document.body.innerText")
            links = pg.evaluate("() => [...document.querySelectorAll('a[href]')].map(a => (a.innerText||'').trim().replace(/\\s+/g,' ').slice(0,80) + ' -> ' + a.href)")
            open(f"/tmp/edgerun/src/{name}.txt", "w").write(f"URL: {url}\nFinal: {pg.url}\nTitle: {pg.title()}\nFetched: {time.strftime('%Y-%m-%d %H:%M UTC', time.gmtime())}\n\n{text}\n")
            open(f"/tmp/edgerun/src/{name}.links.txt", "w").write("\n".join(links))
            print(name, pg.url, len(text))
        except Exception as e:
            print("ERR", name, url, e)
        pg.close()
    b.close()
