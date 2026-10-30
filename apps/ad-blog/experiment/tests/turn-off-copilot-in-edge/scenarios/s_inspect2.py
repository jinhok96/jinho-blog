pg.goto("edge://settings/ai")
time.sleep(4)
r = pg.evaluate("""() => { const tags={}; const hits=[]; const walk=(n)=>{ if(n.nodeType===1){ tags[n.tagName]=(tags[n.tagName]||0)+1; if(/SWITCH|TOGGLE/i.test(n.tagName) || /switch|toggle/i.test(n.className||'') ) { hits.push({tag:n.tagName, cls:String(n.className).slice(0,80), attrs:[...n.attributes].map(a=>a.name+'='+a.value).join(' ').slice(0,300)}); } } if(n.shadowRoot) walk(n.shadowRoot); for(const c of (n.childNodes||[])) walk(c);}; walk(document.documentElement); return {tags, hits: hits.slice(0,30)}; }""")
print(r["tags"])
for h in r["hits"]:
    print(h)
