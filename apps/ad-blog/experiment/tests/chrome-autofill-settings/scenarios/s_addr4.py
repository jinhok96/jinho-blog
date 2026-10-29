def xmove(x,y):
    subprocess.run(["xdotool","mousemove",str(x),str(y)],env=dict(os.environ,DISPLAY=":99")); time.sleep(1.2)
def xclick(x,y):
    subprocess.run(["xdotool","mousemove",str(x),str(y),"click","1"],env=dict(os.environ,DISPLAY=":99")); time.sleep(1.5)
TOP=87
pg.bring_to_front()
F="http://localhost:8765/form.html"
ids=["#name","#email","#tel","#street","#city","#state","#zip","#note"]
pg.goto(F); time.sleep(3)
b=pg.locator("#name").bounding_box(); print("BOX", b)
pg.click("#name"); time.sleep(2.5)
x,y=int(b['x']+180), int(TOP+b['y']+b['height']+42)
xmove(x,y); shot("d01_hover_preview")
xclick(x,y); time.sleep(1.5); shot("d02_filled")
print("FILLED", {k: pg.input_value(k) for k in ids})
# 한 항목 지우기: 배송 메모 제안에서 Shift+Delete
pg.goto(F); time.sleep(3)
b=pg.locator("#note").bounding_box()
pg.click("#note"); time.sleep(2.5)
nx,ny=int(b['x']+110), int(TOP+b['y']+b['height']+30)
xmove(nx,ny); shot("d03_note_hover")
subprocess.run(["xdotool","key","shift+Delete"],env=dict(os.environ,DISPLAY=":99")); time.sleep(2); shot("d04_after_shift_delete")
pg.goto(F); time.sleep(3); pg.click("#note"); time.sleep(2.5); shot("d05_note_after")
