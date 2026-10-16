"""results.jsonl → summary.json (목표 용량별 중앙값·통과율·최적 긴 변)."""
import json, statistics as st, sys
from collections import defaultdict

r = [json.loads(l) for l in open(sys.argv[1])]
g = defaultdict(list)
for x in r:
    g[(x['target_kb'], x['method'], x['long_edge'])].append(x)

def q(v, p):
    v = sorted(v); k = (len(v) - 1) * p; f = int(k)
    return v[f] + (v[min(f + 1, len(v) - 1)] - v[f]) * (k - f)

out = {}
for (t, m, L), xs in sorted(g.items()):
    s = [x['screen'] for x in xs]
    out[f'{t}|{m}|{L}'] = dict(
        target_kb=t, method=m, long_edge=L, n=len(xs),
        screen_median=round(st.median(s), 1), screen_p10=round(q(s, 0.1), 1), screen_min=round(min(s), 1), screen_max=round(max(s), 1),
        fit_1000=sum(x['bytes'] <= t * 1000 for x in xs), fit_1024=sum(x['bytes'] <= t * 1024 for x in xs),
        bytes_median=int(st.median(x['bytes'] for x in xs)), bytes_max=max(x['bytes'] for x in xs),
        quality_median=(st.median(x['quality'] for x in xs) if m == 'im' else None),
        quality_min=(min(x['quality'] for x in xs) if m == 'im' else None),
        sec_median=round(st.median(x['sec'] for x in xs), 2),
    )
best = {}
for t in [1000, 500, 200, 100, 50]:
    for m in ['im', 'webp']:
        cand = [v for v in out.values() if v['target_kb'] == t and v['method'] == m and v['fit_1000'] == v['n']]
        if cand:
            b = max(cand, key=lambda v: v['screen_median'])
            best[f'{t}|{m}'] = b
json.dump(dict(groups=out, best=best), open(sys.argv[2], 'w'), indent=1)
for k, v in best.items():
    print(k, v['long_edge'], v['screen_median'], v['screen_p10'], v['quality_median'], v['bytes_median'])
