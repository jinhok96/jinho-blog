CHK="""() => { const res=[]; const walk=(n)=>{ if(n.nodeType===1){ if(n.tagName==='SETTINGS-CHECKBOX'){ res.push({text:(n.innerText||n.textContent||'').trim().slice(0,40), checked:n.checked}); } if(n.shadowRoot) walk(n.shadowRoot);} for(const c of (n.childNodes||[])) walk(c);}; walk(document.body); return res; }"""
pg.bring_to_front()
F="http://localhost:8765/form.html"
pg.goto("chrome://settings/autofill"); time.sleep(4); t=deep(pg); i=t.find("Google Password Manager | Opens"); print("COUNTS", t[i:i+300])
pg.goto("chrome://settings/clearBrowserData"); time.sleep(4); pg.bring_to_front(); time.sleep(1)
pg.get_by_text("Show more", exact=True).first.click(); time.sleep(2)
pg.mouse.click(796,187); time.sleep(1.5); shot("h00b_more_menu")
pg.mouse.click(740,261); time.sleep(1.5)
for c in pg.evaluate(CHK):
    want = c['text'].startswith("Autofill form data")
    if c['checked'] != want:
        pg.locator("settings-checkbox", has_text=c['text'].split("\n")[0]).first.click(); time.sleep(0.6)
print("CHK", pg.evaluate(CHK))
time.sleep(1); shot("h01_autofill_only")
pg.get_by_text("Delete from this device", exact=True).first.click(); time.sleep(4)
pg.goto("chrome://settings/autofill"); time.sleep(4); t=deep(pg); i=t.find("Google Password Manager | Opens"); print("COUNTS AFTER", t[i:i+300])
pg.goto(F); time.sleep(3); pg.click("#name"); time.sleep(2.5); shot("h02_name_after"); pg.click("#note"); time.sleep(2.5); shot("h03_note_after")
