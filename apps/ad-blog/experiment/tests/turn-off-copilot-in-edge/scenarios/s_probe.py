exec(open("common.py").read())
exec(open("probe.py").read())
TAG = os.environ["TAG"]
for u in ["ai", "languages"]:
    pg.goto("edge://settings/" + u); time.sleep(3)
    print(u, [(t['label'], t['checked'], t['disabled']) for t in toggles(pg)])
probe(TAG)
