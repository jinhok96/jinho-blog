def xclick(x,y):
    subprocess.run(["xdotool","mousemove",str(x),str(y),"click","1"],env=dict(os.environ,DISPLAY=":99")); time.sleep(1.5)
def xkey(k):
    subprocess.run(["xdotool","key",k],env=dict(os.environ,DISPLAY=":99")); time.sleep(1)
TOP=87
def sugg(sel, row=0):
    b=pg.locator(sel).bounding_box()
    return int(b['x']+70), int(TOP+b['y']+b['height']+22+row*44)
pg.bring_to_front()
F="http://localhost:8765/form.html"
ids=["#name","#email","#tel","#street","#city","#state","#zip","#note"]
pg.goto(F); time.sleep(3)
pg.click("#name"); time.sleep(2.5); shot("c03_name_dropdown")
x,y=sugg("#name"); subprocess.run(["xdotool","mousemove",str(x),str(y)],env=dict(os.environ,DISPLAY=":99")); time.sleep(1.2); shot("c03b_hover_preview")
xclick(x,y); time.sleep(1.5); shot("c04_filled")
print("FILLED", {k: pg.input_value(k) for k in ids})
pg.goto(F); time.sleep(3)
pg.click("#note"); time.sleep(2.5); shot("c05_note_dropdown")
pg.click("#city"); time.sleep(2.5); shot("c05b_city_dropdown")
pg.goto("chrome://settings/contactInfo"); time.sleep(4); shot("c06_contactinfo_saved")
print("CONTACT", deep(pg)[-600:])
pg.locator('cr-toggle[aria-label="Save and fill addresses"]').click(); time.sleep(2)
print("TOG after off", [t for t in toggles(pg) if t['label']=='Save and fill addresses'])
shot("c07_toggle_off")
pg.goto(F); time.sleep(3)
pg.click("#name"); time.sleep(2.5); shot("c08_off_name")
pg.click("#note"); time.sleep(2.5); shot("c09_off_note")
# 끈 상태에서 새 주소 제출 → 저장 제안이 뜨는지
vals={"#name":"Sam Tester","#email":"sam.tester@example.com","#tel":"(555) 010-0142","#street":"200 Sample Road","#city":"Dayton","#state":"OH","#zip":"45402","#note":"Ring the bell"}
for k,v in vals.items():
    pg.click(k); time.sleep(0.3); pg.keyboard.type(v, delay=20); time.sleep(0.2)
pg.keyboard.press("Escape"); pg.click("#go"); time.sleep(4); shot("c09b_off_submit")
pg.goto("chrome://settings/contactInfo"); time.sleep(4); shot("c10_off_contactinfo")
print("CONTACT OFF", deep(pg)[-600:])
pg.locator('cr-toggle[aria-label="Save and fill addresses"]').click(); time.sleep(2)
print("TOG after on", [t for t in toggles(pg) if t['label']=='Save and fill addresses'])
pg.goto(F); time.sleep(3)
pg.click("#note"); time.sleep(2.5); shot("c11_on_note")
