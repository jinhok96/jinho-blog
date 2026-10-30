exec(open("common.py").read())
for item in os.environ["SET"].split(";"):
    page, label = item.split("|")
    pg.goto("edge://settings/" + page); time.sleep(3)
    click_toggle(pg, label)
    print("set", page, [(t['label'], t['checked']) for t in toggles(pg)])
