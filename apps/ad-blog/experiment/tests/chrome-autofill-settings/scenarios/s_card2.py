def xclick(x,y):
    subprocess.run(["xdotool","mousemove",str(x),str(y),"click","1"],env=dict(os.environ,DISPLAY=":99")); time.sleep(1.5)
pg.bring_to_front()
C="http://localhost:8765/checkout.html"
pg.goto(C); time.sleep(3)
vals={"#ccname":"Alex Sample","#ccnum":"4111 1111 1111 1111","#ccexp":"12/30","#cccsc":"123"}
for k,v in vals.items():
    pg.click(k); time.sleep(0.3); pg.keyboard.type(v, delay=25); time.sleep(0.3)
pg.keyboard.press("Escape")
pg.click("#pay"); time.sleep(4)
xclick(1122,402); time.sleep(1.5); shot("f01_after_card_save")
pg.goto("chrome://settings/payments"); time.sleep(4); pg.bring_to_front(); time.sleep(1); shot("f02_payments_saved")
print("PAY", deep(pg)[-500:])
pg.goto("chrome://settings/clearBrowserData"); time.sleep(4); pg.bring_to_front(); time.sleep(1); shot("f03_clear_dialog")
print("CLEAR", deep(pg)[-2500:])
