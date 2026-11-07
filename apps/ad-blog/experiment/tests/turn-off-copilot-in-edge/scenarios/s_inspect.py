pg.goto("edge://settings/ai")
time.sleep(4)
print("frames", [f.url for f in pg.frames])
for f in pg.frames:
    try:
        n = f.evaluate("() => document.querySelectorAll('*').length")
        sw = f.evaluate("() => Array.from(document.querySelectorAll('[role=switch], input[type=checkbox], button[aria-pressed], [aria-checked]')).map(e=>({tag:e.tagName, role:e.getAttribute('role'), ac:e.getAttribute('aria-checked'), c:e.checked, lab:e.getAttribute('aria-label'), lby:e.getAttribute('aria-labelledby'), dis:e.disabled}))")
        print(f.url, n, sw[:20])
    except Exception as e:
        print("err", f.url, e)
html = pg.evaluate("() => { const el=[...document.querySelectorAll('*')].find(e=>e.textContent.trim()==='Show Copilot button in toolbar'); if(!el) return 'none'; let p=el; for(let i=0;i<5;i++) p=p.parentElement; return p.outerHTML.slice(0,3000); }")
print(html)
