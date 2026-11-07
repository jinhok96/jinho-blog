exec(open("common.py").read())
import json
res = {}
for u in ["ai", "languages", "startHomeNTP", "privacy/services", "appearance", "accessibility", "autofill"]:
    pg.goto("edge://settings/" + u)
    time.sleep(3)
    res[u] = toggles(pg)
    print("=====", u)
    for t in res[u]:
        print("  ", t)
json.dump(res, open("/tmp/edgerun/toggles-default.json", "w"), indent=1)
