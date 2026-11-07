"""Chrome 설정 왼쪽 메뉴의 AI 항목 이름을 실행마다 기록 (새 프로필 첫 실행 vs 다음 실행)
실행: /tmp/pw/bin/python menu_check.py {프로필 폴더} {실행 라벨} [캡처 파일]
"""
import json, os, pathlib, subprocess, sys, time
from playwright.sync_api import sync_playwright

CH = "/tmp/chk/chrome/opt/google/chrome/chrome"
prof, label = sys.argv[1], sys.argv[2]
shot = sys.argv[3] if len(sys.argv) > 3 else None
env = dict(os.environ, DISPLAY=":99")
proc = subprocess.Popen([CH, f"--user-data-dir={prof}", "--remote-debugging-port=9333", "--no-first-run", "--no-sandbox",
                         "--test-type", "--no-default-browser-check", "--lang=en-US", "--window-size=1280,900",
                         "--window-position=0,0", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, env=env)
time.sleep(8)
MENU = """() => { const out=[]; const walk=(n)=>{ if(n.nodeType===1){ if(n.tagName==='A' && n.getAttribute('href')) { const t=n.textContent.trim().replace(/\\s+/g,' '); if(t) out.push(n.getAttribute('href')+' = '+t);} if(n.shadowRoot) walk(n.shadowRoot);} for(const c of (n.childNodes||[])) walk(c);}; const m=document.querySelector('settings-ui').shadowRoot.querySelector('settings-menu'); walk(m.shadowRoot||m); return out; }"""
DEEP = """() => { const out=[]; const walk=(n)=>{ if(n.nodeType===1 && (n.tagName==='STYLE'||n.tagName==='SCRIPT')) return; if(n.nodeType===3){const s=n.textContent.trim(); if(s) out.push(s);} if(n.shadowRoot) walk(n.shadowRoot); for(const c of n.childNodes) walk(c);}; walk(document.body); return out.join(' | '); }"""
res = {"run": label, "utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://127.0.0.1:9333")
    pg = b.contexts[0].pages[0]
    pg.goto("chrome://settings/"); time.sleep(4)
    res["menu"] = pg.evaluate(MENU)
    pg.goto("chrome://settings/ai"); time.sleep(4)
    res["ai_url"] = pg.url
    t = pg.evaluate(DEEP)
    res["ai_page_head"] = t[:600]
    if shot:
        subprocess.run(["import", "-display", ":99", "-window", "root", "-crop", "1280x900+0+0", shot])
    pg.goto("chrome://version"); time.sleep(3)
    v = pg.evaluate(DEEP)
    i = v.find("Variations")
    res["version_variations_len"] = len(v[i:]) if i >= 0 else 0
proc.terminate(); time.sleep(3)
ls = pathlib.Path(prof) / "Local State"
if ls.exists():
    st = json.loads(ls.read_text())
    var = st.get("variations_compressed_seed") or st.get("variations_seed")
    res["local_state_seed"] = bool(var)
    res["seed_keys"] = sorted(k for k in st if k.startswith("variations"))
print(json.dumps(res, ensure_ascii=False, indent=1))
