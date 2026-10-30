import json, re
pages = ["ai", "profiles", "autofill", "privacy", "privacy/services", "privacy/services/search", "privacy/security", "appearance", "appearance/copilotAndSidebar", "sidebar", "startHomeNTP", "languages", "languages/writingAssistance", "downloads", "accessibility", "system", "defaultBrowser", "ai/copilotSettings", "ai/copilotNtp"]
out = {}
for u in pages:
    pg.goto("edge://settings/" + u)
    time.sleep(3)
    txt = deep(pg)
    out[u] = {"url": pg.url, "text": txt}
    print("=====", u, "->", pg.url, len(txt))
json.dump(out, open("/tmp/edgerun/dump.json", "w"), indent=1)
# 설정 검색
for q in ["Copilot", "AI", "Cowork"]:
    pg.goto("edge://settings/search?search=" + q)
    time.sleep(3)
    t = deep(pg)
    out["search:" + q] = {"url": pg.url, "text": t}
    shot("20-search-" + q)
json.dump(out, open("/tmp/edgerun/dump.json", "w"), indent=1)
