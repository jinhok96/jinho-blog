def xclick(x,y):
    subprocess.run(["xdotool","mousemove",str(x),str(y),"click","1"],env=dict(os.environ,DISPLAY=":99")); time.sleep(1.5)
pg.bring_to_front()
F="http://localhost:8765/form.html"
pg.goto(F); time.sleep(3)
vals={"#name":"Alex Sample","#email":"alex.sample@example.com","#tel":"(555) 010-0199","#street":"100 Test Street","#city":"Springfield","#state":"IL","#zip":"62701","#note":"Leave at the side door"}
for k,v in vals.items():
    pg.click(k); time.sleep(0.3); pg.keyboard.type(v, delay=25); time.sleep(0.3)
pg.keyboard.press("Escape")
pg.click("#go"); time.sleep(4); shot("b01_save_bubble")
xclick(1123,453); time.sleep(1); shot("b02_after_save")
# 2. 저장한 주소 채우기
pg.goto(F); time.sleep(3)
pg.click("#name"); time.sleep(2.5); shot("b03_name_dropdown")
pg.keyboard.press("ArrowDown"); time.sleep(0.6); pg.keyboard.press("Enter"); time.sleep(2); shot("b04_filled")
print("FILLED", {k: pg.input_value(k) for k in vals})
# 3. 자유 입력 칸(배송 메모) 자동 완성
pg.goto(F); time.sleep(3)
pg.click("#note"); time.sleep(2.5); shot("b05_note_dropdown")
# 4. 설정의 저장 주소
pg.goto("chrome://settings/contactInfo"); time.sleep(4); shot("b06_contactinfo_saved")
print("CONTACT", deep(pg)[-700:])
# 5. Save and fill addresses 끄기
pg.locator('cr-toggle[aria-label="Save and fill addresses"]').click(); time.sleep(2)
print("TOG after off", [t for t in toggles(pg) if t['label']=='Save and fill addresses'])
shot("b07_toggle_off")
pg.goto(F); time.sleep(3)
pg.click("#name"); time.sleep(2.5); shot("b08_off_name")
pg.click("#note"); time.sleep(2.5); shot("b09_off_note")
pg.goto("chrome://settings/contactInfo"); time.sleep(4); shot("b10_off_contactinfo")
print("CONTACT OFF", deep(pg)[-700:])
pg.locator('cr-toggle[aria-label="Save and fill addresses"]').click(); time.sleep(2)
print("TOG after on", [t for t in toggles(pg) if t['label']=='Save and fill addresses'])
# 6. 항목 하나 지우기 (Shift+Delete)
pg.goto(F); time.sleep(3)
pg.click("#note"); time.sleep(2.5); shot("b11_on_note")
pg.keyboard.press("ArrowDown"); time.sleep(0.8); shot("b12_note_highlight")
pg.keyboard.press("Shift+Delete"); time.sleep(2); shot("b13_after_shift_delete")
pg.goto(F); time.sleep(3)
pg.click("#note"); time.sleep(2.5); shot("b14_note_after_delete")
