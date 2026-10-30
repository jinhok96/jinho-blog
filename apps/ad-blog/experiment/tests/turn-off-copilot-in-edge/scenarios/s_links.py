# 설정 화면의 Learn more 링크 주소와 Manage settings가 여는 곳 확인
pg.goto("edge://settings/ai"); time.sleep(4)
hrefs = pg.evaluate("""() => { const res=[]; const walk=(n)=>{ if(n.nodeType===1){ const h=n.getAttribute('href'); if(h) res.push({tag:n.tagName, href:h, text:(n.textContent||'').trim().slice(0,60)}); } if(n.nodeType===1 && n.shadowRoot) walk(n.shadowRoot); for(const c of (n.childNodes||[])) walk(c);}; walk(document.documentElement); return res; }""")
for h in hrefs:
    print(h)
before = len(ctx.pages)
for label in ["Manage settings", "Learn more & join"]:
    try:
        pg.get_by_text(label, exact=True).first.click()
        time.sleep(6)
        print(label, "->", [x.url for x in ctx.pages])
        shot("70-" + label.replace(" ", "_").replace("&", "and"))
    except Exception as e:
        print("ERR", label, e)
    pg.goto("edge://settings/ai"); time.sleep(3)
# Learn more 링크들 클릭
links = pg.locator("text=Learn more")
n = links.count()
print("learn more count", n)
for i in range(n):
    try:
        links.nth(i).click(); time.sleep(5)
        print("learn", i, [x.url for x in ctx.pages])
    except Exception as e:
        print("ERR learn", i, e)
    pg.goto("edge://settings/ai"); time.sleep(3)
pg.goto("edge://settings/languages"); time.sleep(3)
links = pg.locator("text=Learn more")
for i in range(links.count()):
    try:
        links.nth(i).click(); time.sleep(5)
        print("lang learn", i, [x.url for x in ctx.pages])
    except Exception as e:
        print("ERR", e)
    pg.goto("edge://settings/languages"); time.sleep(3)
