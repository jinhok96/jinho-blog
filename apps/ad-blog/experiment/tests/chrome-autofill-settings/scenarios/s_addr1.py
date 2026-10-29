pg.bring_to_front()
F="http://localhost:8765/form.html"
pg.goto(F); time.sleep(3)
pg.click("#name"); time.sleep(2.5); shot("a01_fresh_click_name")
vals={"#name":"Alex Sample","#email":"alex.sample@example.com","#tel":"(555) 010-0199","#street":"100 Test Street","#city":"Springfield","#state":"IL","#zip":"62701","#note":"Leave at the side door"}
for k,v in vals.items():
    pg.click(k); time.sleep(0.3); pg.keyboard.type(v, delay=30); time.sleep(0.3)
pg.keyboard.press("Escape")
shot("a02_typed")
pg.click("#go"); time.sleep(4); shot("a03_after_submit")
print("URL after submit", pg.url)
