CHK="""() => { const res=[]; const walk=(n)=>{ if(n.nodeType===1){ if(n.tagName==='SETTINGS-CHECKBOX'){ res.push({text:(n.innerText||n.textContent||'').trim().slice(0,40), checked:n.checked}); } if(n.shadowRoot) walk(n.shadowRoot);} for(const c of (n.childNodes||[])) walk(c);}; walk(document.body); return res; }"""
pg.bring_to_front()
pg.goto("chrome://settings/clearBrowserData"); time.sleep(4); pg.bring_to_front(); time.sleep(1)
pg.get_by_text("Show more", exact=True).first.click(); time.sleep(2)
pg.mouse.click(796,187); time.sleep(1.5); shot("i00_menu")
pg.mouse.click(740,261); time.sleep(1.5)
for c in pg.evaluate(CHK):
    want = c['text'].startswith("Autofill form data")
    if c['checked'] != want:
        pg.locator("settings-checkbox", has_text=c['text'].split("\n")[0]).first.click(); time.sleep(0.6)
print("CHK", pg.evaluate(CHK))
time.sleep(1); shot("i01_clear_autofill_alltime")
pg.get_by_text("Cancel", exact=True).first.click(); time.sleep(1)
