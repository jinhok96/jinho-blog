"""Chrome 156을 Xvfb에서 새 프로필로 띄우고 CDP로 연결해 시나리오 파일을 실행한다.

사용: /tmp/pw/bin/python run.py {프로필 경로} {시나리오.py}
- Chrome: dl.google.com 안정판 deb를 dpkg-deb -x로 /tmp/cr/chrome에 푼 것
- 캡처: ImageMagick import로 Xvfb 화면 1280×900 (브라우저 UI·자동 완성 말풍선 포함)
"""
import os
import subprocess
import sys
import time

from playwright.sync_api import sync_playwright

CH = "/tmp/cr/chrome/opt/google/chrome/chrome"
SHOTS = "/tmp/cr/shots/"
DEEP = """() => { const out=[]; const walk=(n)=>{ if(n.nodeType===1 && (n.tagName==='STYLE'||n.tagName==='SCRIPT')) return; if(n.nodeType===3){const s=n.textContent.trim(); if(s) out.push(s);} if(n.shadowRoot) walk(n.shadowRoot); for(const c of n.childNodes) walk(c);}; walk(document.body); return out.join(' | '); }"""
TOG = """() => { const res=[]; const walk=(n)=>{ if(n.nodeType===1){ if(n.tagName==='CR-TOGGLE'){ let p=n; let label=''; for(let i=0;i<8&&p;i++){ p=p.parentNode||p.host; if(p&&p.host) p=p.host; if(p&&p.getAttribute&&p.getAttribute('label')){label=p.getAttribute('label');break;} } const r=n.getBoundingClientRect(); res.push({label, checked:n.checked, disabled:n.disabled, aria:n.getAttribute('aria-label'), visible: r.width>0}); } if(n.shadowRoot) walk(n.shadowRoot);} for(const c of (n.childNodes||[])) walk(c);}; walk(document.body); return res; }"""

prof = sys.argv[1]
env = dict(os.environ, DISPLAY=":99")
proc = subprocess.Popen(
    [CH, f"--user-data-dir={prof}", "--remote-debugging-port=9333", "--no-first-run", "--no-sandbox",
     "--test-type", "--no-default-browser-check", "--lang=en-US", "--window-size=1280,900",
     "--window-position=0,0", "about:blank"],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, env=env)
time.sleep(10)


def shot(name):
    subprocess.run(["import", "-display", ":99", "-window", "root", "-crop", "1280x900+0+0", SHOTS + name + ".png"])


def deep(pg):
    return pg.evaluate(DEEP)


def toggles(pg):
    return pg.evaluate(TOG)


# 시나리오가 오류로 멈춰도 Chrome을 닫음 (남은 Chrome이 9333 포트를 잡고 있으면 다음 실행이 그 브라우저에 붙음)
try:
    with sync_playwright() as p:
        b = p.chromium.connect_over_cdp("http://127.0.0.1:9333")
        ctx = b.contexts[0]
        pg = ctx.pages[0]
        exec(open(sys.argv[2]).read())
finally:
    proc.terminate()
    time.sleep(3)
