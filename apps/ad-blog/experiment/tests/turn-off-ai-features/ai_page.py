"""chrome://settings/ai 페이지의 문구 전체와 캡처 (메뉴 이름이 다른 프로필끼리 내용 비교용)
실행: /tmp/pw/bin/python ai_page.py {프로필 폴더} {캡처 파일}
"""
import os, subprocess, sys, time
from playwright.sync_api import sync_playwright

CH = "/tmp/chk/chrome/opt/google/chrome/chrome"
prof, shot = sys.argv[1], sys.argv[2]
env = dict(os.environ, DISPLAY=":99")
proc = subprocess.Popen([CH, f"--user-data-dir={prof}", "--remote-debugging-port=9333", "--no-first-run", "--no-sandbox",
                         "--test-type", "--no-default-browser-check", "--lang=en-US", "--window-size=1280,900",
                         "--window-position=0,0", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, env=env)
time.sleep(8)
DEEP = """() => { const out=[]; const walk=(n)=>{ if(n.nodeType===1 && (n.tagName==='STYLE'||n.tagName==='SCRIPT')) return; if(n.nodeType===3){const s=n.textContent.trim(); if(s) out.push(s);} if(n.shadowRoot) walk(n.shadowRoot); for(const c of n.childNodes) walk(c);}; walk(document.body); return out.join(' | '); }"""
with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://127.0.0.1:9333")
    pg = b.contexts[0].pages[0]
    pg.goto("chrome://settings/ai"); time.sleep(5)
    t = pg.evaluate(DEEP)
    i = t.find("by your organization")
    print(t[i + len("by your organization"):] if i >= 0 else t)
    pg.mouse.move(700, 500)
    pg.mouse.wheel(0, 120); time.sleep(1.5)
    subprocess.run(["import", "-display", ":99", "-window", "root", "-crop", "1280x900+0+0", shot])
proc.terminate(); time.sleep(3)
