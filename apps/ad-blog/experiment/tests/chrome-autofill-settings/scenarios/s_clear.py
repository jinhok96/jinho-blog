pg.bring_to_front()
CHK="""() => { const res=[]; const walk=(n)=>{ if(n.nodeType===1){ if(n.tagName==='CR-CHECKBOX'||n.tagName==='SETTINGS-CHECKBOX'){ res.push({tag:n.tagName, text:(n.innerText||n.textContent||'').trim().slice(0,80), checked:n.checked, label:n.getAttribute('label')}); } if(n.shadowRoot) walk(n.shadowRoot);} for(const c of (n.childNodes||[])) walk(c);}; walk(document.body); return res; }"""
pg.goto("chrome://settings/clearBrowserData"); time.sleep(4); pg.bring_to_front(); time.sleep(1)
pg.get_by_text("Show more", exact=True).first.click(); time.sleep(2); shot("g01_show_more")
print("AFTER SHOWMORE", deep(pg)[deep(pg).find("Delete browsing data | Last"):][:1500])
print("CHK", pg.evaluate(CHK))
