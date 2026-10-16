"""scores.json + runs.jsonl → summary.json (글에 쓰는 값)."""
import json, sys
from pathlib import Path
W = Path(sys.argv[1])
S = json.loads((W / "scores.json").read_text())
runs = {}
for l in (W / "runs.jsonl").read_text().splitlines():
    r = json.loads(l); runs[(r["config"], r["doc"])] = r
out = {}
for c, d in S.items():
    row = {}
    for doc, v in d.items():
        f0 = v["files"][0] if v["files"] else {}
        r = runs.get((c, doc), {})
        row[doc] = {"pages": v["pages"], "kb_total": round(v["bytes"] / 1000), "kb_per_page": round(v["bytes"] / 1000 / max(v["pages"], 1)),
                    "px": f"{f0.get('w')}x{f0.get('h')}", "jpeg_q": f0.get("q"), "word_recall": v.get("word_recall"),
                    "p1_recall": v.get("p1_recall"), "fine_recall": v.get("fine_recall"),
                    "sec_median": r.get("sec_median"), "max_rss_mb": r.get("max_rss_mb")}
    out[c] = row
(W / "summary.json").write_text(json.dumps(out, indent=1))
for c in out:
    if "-r" in c and not c.endswith("300"): continue
    i, m, p = out[c]["irs-1040"], out[c]["mixed"], out[c]["photos"]
    print(f"{c:20} {i['px']:>10} q{i['jpeg_q']} pages {i['pages']}/{m['pages']}/{p['pages']} irsP1 {i['p1_recall']} mixed {m['word_recall']} fine {m['fine_recall']} KB/page irs {i['kb_per_page']} photos {p['kb_per_page']} sec {i['sec_median']}/{m['sec_median']}/{p['sec_median']} rss {p['max_rss_mb']}")
