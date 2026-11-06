# 2026-11-07 Edge 157 재확인: 설정 묶음 글자와 스위치 기본값을 Edge 156 기록(source-edge-156-settings-text.txt)과 같은 형식으로 저장
exec(open("common.py").read())
import json
out = {"ua": pg.evaluate("() => navigator.userAgent")}
for u in ["ai", "appearance", "startHomeNTP", "languages", "appearance/toolbar", "appearance/contextMenus"]:
    pg.goto("edge://settings/" + u); time.sleep(4)
    out[u] = {"url": pg.url, "text": deep(pg), "toggles": toggles(pg)}
    print("=====", u, "->", pg.url, len(out[u]["text"]), [(t['label'], t['checked'], t['disabled']) for t in out[u]["toggles"]])
pg.goto("edge://settings/ai"); time.sleep(4); shot("157-10-copilot-ai")
pg.goto("edge://version"); time.sleep(3); out["version"] = deep(pg)
json.dump(out, open("/tmp/edgerun/survey157.json", "w"), indent=1)
