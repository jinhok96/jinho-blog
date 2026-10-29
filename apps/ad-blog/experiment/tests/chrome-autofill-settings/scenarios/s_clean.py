def xclick(x,y):
    subprocess.run(["xdotool","mousemove",str(x),str(y),"click","1"],env=dict(os.environ,DISPLAY=":99")); time.sleep(1.5)
CHK="""() => { const res=[]; const walk=(n)=>{ if(n.nodeType===1){ if(n.tagName==='SETTINGS-CHECKBOX'){ res.push({text:(n.innerText||n.textContent||'').trim().slice(0,40), checked:n.checked}); } if(n.shadowRoot) walk(n.shadowRoot);} for(const c of (n.childNodes||[])) walk(c);}; walk(document.body); return res; }"""
pg.bring_to_front()
F="http://localhost:8765/form.html"; C="http://localhost:8765/checkout.html"
pg.goto(F); time.sleep(3)
vals={"#name":"Alex Sample","#email":"alex.sample@example.com","#tel":"(555) 010-0199","#street":"100 Test Street","#city":"Springfield","#state":"IL","#zip":"62701","#note":"Leave at the side door"}
for k,v in vals.items():
    pg.click(k); time.sleep(0.3); pg.keyboard.type(v, delay=20); time.sleep(0.2)
pg.keyboard.press("Escape"); pg.click("#go"); time.sleep(4)
xclick(1123,453); time.sleep(1)
# 주소 저장 뒤 뜨는 로그인 권유 말풍선 닫기
xclick(1161,111); time.sleep(1)
pg.goto(C); time.sleep(3)
cv={"#ccname":"Alex Sample","#ccnum":"4111 1111 1111 1111","#ccexp":"12/30","#cccsc":"123"}
for k,v in cv.items():
    pg.click(k); time.sleep(0.3); pg.keyboard.type(v, delay=20); time.sleep(0.2)
pg.keyboard.press("Escape"); pg.click("#pay"); time.sleep(4)
xclick(1122,402); time.sleep(1.5)
pg.goto("chrome://settings/autofill"); time.sleep(4); pg.bring_to_front(); time.sleep(1)
t=deep(pg); i=t.find("Google Password Manager | Opens"); print("COUNTS", t[i:i+300])
pg.mouse.move(690,500); pg.mouse.wheel(0,120); time.sleep(1.2); shot("h00_autofill_page_counts")
pg.goto("chrome://settings/clearBrowserData"); time.sleep(4); pg.bring_to_front(); time.sleep(1)
pg.get_by_text("Show more", exact=True).first.click(); time.sleep(2)
pg.get_by_text("More", exact=True).first.click(); time.sleep(1.2)
pg.get_by_text("All time", exact=True).first.click(); time.sleep(1.5)
for c in pg.evaluate(CHK):
    want = c['text'].startswith("Autofill form data")
    if c['checked'] != want:
        pg.locator("settings-checkbox", has_text=c['text'].split("\n")[0]).first.click(); time.sleep(0.6)
print("CHK", pg.evaluate(CHK))
time.sleep(1); shot("h01_autofill_only")
pg.get_by_text("Delete from this device", exact=True).first.click(); time.sleep(4)
pg.goto("chrome://settings/autofill"); time.sleep(4); t=deep(pg); i=t.find("Google Password Manager | Opens"); print("COUNTS AFTER", t[i:i+300])
pg.goto(F); time.sleep(3); pg.click("#name"); time.sleep(2.5); shot("h02_name_after"); pg.click("#note"); time.sleep(2.5); shot("h03_note_after")
