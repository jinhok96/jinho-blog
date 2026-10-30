# 기본 상태(새 프로필, 로그아웃)에서 Copilot이 보이는 곳
import subprocess as sp
def xdo(*a):
    sp.run(["xdotool", *a], env=dict(os.environ, DISPLAY=":99"))
TAG = globals().get("TAG", "a")
pg.goto("http://localhost:8766/")
time.sleep(3)
shot(f"30{TAG}-page")
# 오른쪽 클릭 (문단 위)
box = pg.locator("#para").bounding_box()
print("para", box)
# 창 안 페이지 좌표 → 화면 좌표: 브라우저 UI 높이 보정을 위해 window.screenY/outerHeight-innerHeight 사용
off = pg.evaluate("() => ({x: window.screenX + (window.outerWidth-window.innerWidth), y: window.screenY + (window.outerHeight-window.innerHeight)})")
print("offset", off)
sx, sy = int(off["x"] + box["x"] + 120), int(off["y"] + box["y"] + 15)
xdo("mousemove", str(sx), str(sy)); time.sleep(0.5)
xdo("click", "3"); time.sleep(2)
shot(f"31{TAG}-rightclick")
xdo("key", "Escape"); time.sleep(1)
# 텍스트 선택 → 미니 메뉴
pg.evaluate("() => { const p=document.getElementById('para'); const r=document.createRange(); r.setStart(p.firstChild,0); r.setEnd(p.firstChild,60); }")
xdo("mousemove", str(int(off["x"] + box["x"] + 2)), str(sy)); xdo("mousedown", "1")
xdo("mousemove", str(int(off["x"] + box["x"] + 400)), str(sy)); time.sleep(0.3)
xdo("mouseup", "1"); time.sleep(2)
shot(f"32{TAG}-select")
# 선택한 채 오른쪽 클릭
xdo("click", "3"); time.sleep(2)
shot(f"33{TAG}-select-rightclick")
xdo("key", "Escape"); time.sleep(1)
# 글 입력 칸
tb = pg.locator("#note").bounding_box()
xdo("mousemove", str(int(off["x"] + tb["x"] + 40)), str(int(off["y"] + tb["y"] + 20))); xdo("click", "1"); time.sleep(1)
xdo("type", "--delay", "60", "the trail was muddy so we turned back early"); time.sleep(3)
shot(f"34{TAG}-textarea")
# 입력한 글 선택
xdo("key", "ctrl+a"); time.sleep(2)
shot(f"35{TAG}-textarea-selected")
xdo("click", "3"); time.sleep(2)
shot(f"36{TAG}-textarea-rightclick")
xdo("key", "Escape"); time.sleep(1)
# 주소창
xdo("key", "ctrl+l"); time.sleep(1)
xdo("type", "--delay", "60", "how long is a marathon"); time.sleep(3)
shot(f"37{TAG}-addressbar")
xdo("key", "Escape"); xdo("key", "Escape"); time.sleep(1)
# 새 탭
xdo("key", "ctrl+t"); time.sleep(5)
shot(f"38{TAG}-newtab")
print("PAGES", [x.url for x in ctx.pages])
