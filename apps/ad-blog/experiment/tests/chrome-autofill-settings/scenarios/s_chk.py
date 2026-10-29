pg.bring_to_front()
pg.goto("chrome://settings/autofill"); time.sleep(4); t=deep(pg); i=t.find("Google Password Manager | Opens"); print("COUNTS", t[i:i+260])
