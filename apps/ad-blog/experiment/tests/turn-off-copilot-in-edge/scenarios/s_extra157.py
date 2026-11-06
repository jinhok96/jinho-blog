# 2026-11-07 Edge 157 재확인: 주소창 제안(버튼 켬·끔), Copilot new tab page 켬 → 새 탭
exec(open("common.py").read())
import subprocess as sp
def xdo(*a):
    sp.run(["xdotool", *a], env=dict(os.environ, DISPLAY=":99"))
def addressbar(tag):
    pg.goto("http://localhost:8766/"); time.sleep(3)
    xdo("mousemove", "560", "60"); xdo("click", "1"); time.sleep(1)
    xdo("key", "ctrl+l"); time.sleep(1)  # 첫 실행에서 주소가 선택되지 않아 글자가 주소 뒤에 붙음 → 주소창 전체 선택 후 입력
    xdo("type", "--delay", "80", "how long is a marathon"); time.sleep(4)
    shot("157-41-addressbar-" + tag)
    xdo("key", "Escape"); xdo("key", "Escape"); time.sleep(1)
addressbar("on")
pg.goto("edge://settings/ai"); time.sleep(4)
click_toggle(pg, "Show Copilot button in toolbar"); time.sleep(2)
addressbar("off")
pg.goto("edge://settings/ai"); time.sleep(4)
click_toggle(pg, "Show Copilot button in toolbar"); time.sleep(2)
click_toggle(pg, "Copilot new tab page"); time.sleep(3)
print("ntp on", [(t['label'], t['checked'], t['disabled']) for t in toggles(pg)])
shot("157-81-ntp-on-settings")
xdo("key", "ctrl+t"); time.sleep(8)
shot("157-82-copilot-ntp")
print("pages", [x.url for x in ctx.pages])
for x in ctx.pages:
    if "ntp" in x.url or "newtab" in x.url:
        try: print("NTP text", deep(x)[:600])
        except Exception as e: print("ntp err", e)
