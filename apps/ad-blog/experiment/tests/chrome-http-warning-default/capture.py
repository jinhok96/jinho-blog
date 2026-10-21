import time, subprocess, sys
from playwright.sync_api import sync_playwright
CH="/tmp/news/chrome/opt/google/chrome/chrome"
S="/tmp/news/shots/"
prof=sys.argv[1]
proc=subprocess.Popen([CH,f"--user-data-dir={prof}","--remote-debugging-port=9333","--no-first-run","--no-sandbox","--test-type","--no-default-browser-check","--lang=en-US",
  "--proxy-server=https=127.0.0.1:43745","--proxy-bypass-list=*neverssl.com;*badssl.com","--window-size=1200,860","--window-position=0,0","about:blank"],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
time.sleep(8)
with sync_playwright() as p:
    b=p.chromium.connect_over_cdp("http://127.0.0.1:9333")
    ctx=b.contexts[0]; pg=ctx.pages[0]
    exec(open(sys.argv[2]).read())
proc.terminate()
# --- scenario a.py
# pg.goto("chrome://settings/security"); time.sleep(3)
# pg.screenshot(path=S+"fresh_settings.png")
# pg.goto("http://neverssl.com/",timeout=60000); time.sleep(6)
# pg.screenshot(path=S+"fresh_http.png"); print("http:",pg.url,"|",pg.title()); print(pg.inner_text("body")[:600])
# pg.goto("chrome://version"); time.sleep(1); t=pg.inner_text("body"); print(t[:300]); 
# import re; print(re.findall(r"Command Line.*",t)[:1])
# --- scenario b.py
# pg.goto("chrome://settings/security"); time.sleep(3)
# pg.screenshot(path=S+"second_settings.png")
# pg.goto("http://neverssl.com/",timeout=60000); time.sleep(6)
# pg.screenshot(path=S+"second_http.png"); print("http:",pg.url,"|",pg.title())
# pg.goto("chrome://version/?show-variations-cmd"); time.sleep(1); t=pg.inner_text("body"); 
# i=t.find("Variations"); print(t[i:i+400] if i>=0 else "no variations")
# pg.goto("chrome://local-state"); time.sleep(1); t=pg.inner_text("body"); import re; print("seed" , "variations_compressed_seed" in t, re.findall(r'"variations_seed_date"[^,]*',t)[:1], re.findall(r'"variations_country"[^,]*',t)[:1])
# --- scenario c.py
# pg.goto("http://neverssl.com/",timeout=60000); time.sleep(8)
# h=pg.content(); print(len(h)); import re
# print(re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',re.sub(r'<script.*?</script>|<style.*?</style>','',h,flags=re.S)))[:1500])
# open(S+"warn.html","w").write(h)
# subprocess.run(["import","-window","root",S+"root.png"])
# --- scenario e.py
# def shot(n): subprocess.run(["import","-window","root","-crop","1200x860+0+0",S+n+".png"])
# def visit(u,w=8):
#     try: pg.goto(u,timeout=30000)
#     except Exception as e: print(" goto err",str(e)[:60])
#     time.sleep(w)
# visit("http://http.badssl.com/"); shot("e1_warning"); print("1:",pg.url)
# subprocess.run(["xdotool","mousemove","432","302","click","1"]); time.sleep(6)
# print("after continue:",pg.url,"|",pg.title()); shot("e2_loaded")
# visit("chrome://version",2)
# visit("http://http.badssl.com/",6); print("revisit:",pg.url,"|",pg.title()); shot("e3_revisit")
# --- scenario f.py
# def shot(n): subprocess.run(["import","-window","root","-crop","1200x860+0+0",S+n+".png"])
# pg.goto("chrome://settings/security"); time.sleep(3)
# pg.locator("#enhancedProtection, settings-collapse-radio-button").first
# # expand enhanced
# try:
#     pg.get_by_role("button", name="Enhanced protection").first.click(); time.sleep(2)
# except Exception as e: print("expand err", str(e)[:100])
# shot("f1_enhanced")
# t=pg.locator("body").inner_text(); i=t.find("Enhanced protection"); print(t[i:i+2000])
