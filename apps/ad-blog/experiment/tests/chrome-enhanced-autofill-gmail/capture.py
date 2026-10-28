import time, subprocess, sys, os
from playwright.sync_api import sync_playwright
CH="/tmp/news/chrome/opt/google/chrome/chrome"
S="/tmp/news/shots/"
prof=sys.argv[1]
extra=sys.argv[3:] if len(sys.argv)>3 else []
env=dict(os.environ, DISPLAY=":99")
proc=subprocess.Popen([CH,f"--user-data-dir={prof}","--remote-debugging-port=9333","--no-first-run","--no-sandbox","--test-type","--no-default-browser-check","--lang=en-US","--window-size=1280,900","--window-position=0,0",*extra,"about:blank"],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,env=env)
time.sleep(8)
def shot(n): subprocess.run(["import","-display",":99","-window","root","-crop","1280x900+0+0",S+n+".png"])
with sync_playwright() as p:
    b=p.chromium.connect_over_cdp("http://127.0.0.1:9333")
    ctx=b.contexts[0]; pg=ctx.pages[0]
    exec(open(sys.argv[2]).read())
proc.terminate(); time.sleep(2)
# --- 시나리오 (capture.py 두 번째 인자로 넘긴 파일, 실행 순서대로)
# --- s1.py
# pg.goto("chrome://settings/autofill"); time.sleep(4)
# shot("a1_autofill")
# t=pg.locator("body").inner_text(); print(t[:3000])
# print("URL",pg.url)
# --- s3.py
# DEEP="""() => { const out=[]; const walk=(n)=>{ if(n.nodeType===1 && (n.tagName==='STYLE'||n.tagName==='SCRIPT')) return; if(n.nodeType===3){const s=n.textContent.trim(); if(s) out.push(s);} if(n.shadowRoot) walk(n.shadowRoot); for(const c of n.childNodes) walk(c);}; walk(document.body); return out.join(' | '); }"""
# pg.goto("chrome://settings/autofill"); time.sleep(4)
# t=pg.evaluate(DEEP); i=t.find("Identity docs"); print(t[i:i+1500])
# pg.mouse.move(690,600); 
# for k in range(3): pg.mouse.wheel(0,400); time.sleep(0.7)
# time.sleep(1.5); shot("a3_autofill_bottom")
# for u in ["chrome://settings/enhancedAutofill","chrome://settings/autofill/ai","chrome://settings/autofillAi","chrome://settings/autofillSettings"]:
#     pg.goto(u); time.sleep(3); print("==",u,"->",pg.url); t=pg.evaluate(DEEP); j=t.find("Enhanced autofill"); print(t[j:j+600] if j>=0 else t[-400:])
# --- s4.py
# pg.goto("chrome://settings/autofill"); time.sleep(4)
# el=pg.get_by_text("Settings that affect how autofill works across different types of info").first
# el.scroll_into_view_if_needed(); time.sleep(1)
# el.click(); time.sleep(2.5)
# pg.mouse.move(690,600)
# for k in range(3): pg.mouse.wheel(0,400); time.sleep(0.7)
# time.sleep(1.5); shot("a4_autofill_settings_expanded")
# --- s5.py
# DEEP="""() => { const out=[]; const walk=(n)=>{ if(n.nodeType===1 && (n.tagName==='STYLE'||n.tagName==='SCRIPT')) return; if(n.nodeType===3){const s=n.textContent.trim(); if(s) out.push(s);} if(n.shadowRoot) walk(n.shadowRoot); for(const c of n.childNodes) walk(c);}; walk(document.body); return out.join(' | '); }"""
# TOG="""() => { const res=[]; const walk=(n)=>{ if(n.nodeType===1){ if(n.tagName==='CR-TOGGLE'){ let p=n; let label=''; for(let i=0;i<6&&p;i++){ p=p.parentNode||p.host; if(p&&p.host) p=p.host; if(p&&p.getAttribute&&p.getAttribute('label')){label=p.getAttribute('label');break;} } res.push({label, checked:n.checked, disabled:n.disabled, aria:n.getAttribute('aria-label')}); } if(n.shadowRoot) walk(n.shadowRoot);} for(const c of (n.childNodes||[])) walk(c);}; walk(document.body); return res; }"""
# pg.goto("chrome://settings/autofill"); time.sleep(4)
# el=pg.get_by_text("Settings that affect how autofill works across different types of info").first
# el.click(); time.sleep(2)
# print(pg.evaluate(TOG))
# pg.goto("chrome://settings/addresses"); time.sleep(4)
# print("ADDR:",pg.url, pg.evaluate(DEEP)[-1500:])
# print(pg.evaluate(TOG))
# pg.goto("chrome://settings/ai"); time.sleep(4)
# t=pg.evaluate(DEEP); i=t.find("AI in Chrome"); print("AI:",pg.url, t[i:i+3000])
# shot("a5_ai_in_chrome")
# --- s6.py
# HREF="""() => { const res=[]; const walk=(n)=>{ if(n.nodeType===1){ if(n.tagName==='A' && /Learn more/.test(n.textContent)) res.push(n.textContent.trim()+' -> '+n.href); if(n.shadowRoot) walk(n.shadowRoot);} for(const c of (n.childNodes||[])) walk(c);}; walk(document.body); return res; }"""
# pg.goto("chrome://settings/contactInfo"); time.sleep(4)
# print(pg.evaluate(HREF))
# shot("a6_contact_info")
# --- s7.py
# pg.goto("chrome://settings/contactInfo"); time.sleep(4)
# pg.mouse.move(690,600)
# pg.mouse.wheel(0,150); time.sleep(1.5)
# shot("a7_contact_info")
