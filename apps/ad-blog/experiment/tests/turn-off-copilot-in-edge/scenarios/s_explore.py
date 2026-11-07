exec(open("common.py").read())
import subprocess as sp
def xdo(*a):
    sp.run(["xdotool", *a], env=dict(os.environ, DISPLAY=":99"))
for sub in ["Toolbar", "Context menus"]:
    pg.goto("edge://settings/appearance")
    time.sleep(3)
    pg.get_by_text(sub, exact=True).last.click()
    time.sleep(3)
    print("=====", sub, pg.url)
    t = deep(pg)
    i = t.find("Reset settings")
    print(t[:200])
    print(t[t.find("Learn more")+10:][:3500])
    for x in toggles(pg):
        print("  ", x)
    shot("40-" + sub.replace(" ", "_"))
# 주소창
pg.goto("http://localhost:8766/")
time.sleep(2)
xdo("mousemove", "560", "60"); xdo("click", "1"); time.sleep(1)
xdo("type", "--delay", "80", "how long is a marathon"); time.sleep(4)
shot("41-addressbar")
xdo("key", "Escape"); xdo("key", "Escape"); time.sleep(1)
# Chat 버튼
xdo("mousemove", "1237", "60"); xdo("click", "1"); time.sleep(8)
shot("42-chat-click")
print("PAGES", [x.url for x in ctx.pages])
