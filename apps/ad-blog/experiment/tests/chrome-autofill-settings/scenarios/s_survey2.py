pg.bring_to_front()
def go(u, wait=4):
    pg.goto(u); time.sleep(wait); pg.bring_to_front(); time.sleep(0.5)
go("chrome://settings/autofill")
pg.mouse.move(690,500); pg.mouse.wheel(0,120); time.sleep(1.2); shot("v_top")
for sub in ["payments","contactInfo","identityDocs","travel"]:
    go("chrome://settings/"+sub)
    pg.mouse.move(690,500); pg.mouse.wheel(0,120); time.sleep(1.2); shot("v_"+sub)
go("chrome://password-manager/settings", 5)
print("PWSET", deep(pg)[:3000])
print("PWTOG", toggles(pg))
shot("v_pw_settings")
