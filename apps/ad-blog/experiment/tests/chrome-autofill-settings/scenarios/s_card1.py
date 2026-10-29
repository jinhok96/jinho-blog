pg.bring_to_front()
C="http://localhost:8765/checkout.html"
pg.goto(C); time.sleep(3)
pg.click("#ccname"); time.sleep(2.5); shot("e01_ccname_click")
vals={"#ccname":"Alex Sample","#ccnum":"4111 1111 1111 1111","#ccexp":"12/30","#cccsc":"123"}
for k,v in vals.items():
    pg.click(k); time.sleep(0.3); pg.keyboard.type(v, delay=25); time.sleep(0.3)
pg.keyboard.press("Escape")
pg.click("#pay"); time.sleep(4); shot("e02_save_card_bubble")
subprocess.run(["xdotool","key","Return"],env=dict(os.environ,DISPLAY=":99")); time.sleep(2); shot("e03_after_return")
pg.goto("chrome://settings/payments"); time.sleep(4); shot("e04_payments")
print("PAY", deep(pg)[-900:])
