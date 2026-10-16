# timing.json + results.jsonl(+ lo-lossless) → summary.json
import json, statistics as st, collections, glob, os
W = '/tmp/j2p'
T = json.load(open(f'{W}/timing.json'))
R = [json.loads(l) for l in open(f'{W}/results.jsonl')] + [json.loads(l) for l in open(f'{W}/results_lo_lossless.jsonl')]
inp = sum(os.path.getsize(f) for f in glob.glob(f'{W}/in/*.jpg'))
lol = sum(os.path.getsize(f) for f in glob.glob(f'{W}/out/lo-lossless/*.pdf'))
S = {'input_bytes': inp, 'configs': {}}
for c in ['img2pdf', 'img2pdf-letter', 'imagemagick', 'imagemagick-orient', 'pillow', 'libreoffice', 'lo-lossless', 'chromium']:
    rs = [r for r in R if r['config'] == c]; ts = [t for t in T if t['config'] == c]
    sc = [r['ssimulacra2'] for r in rs]
    S['configs'][c] = dict(
        bytes=ts[0]['bytes'] if ts else lol, ratio_vs_input=round((ts[0]['bytes'] if ts else lol) / inp, 3),
        sec_median=st.median(t['sec'] for t in ts) if ts else None, max_rss_mb=max(t['max_rss_mb'] for t in ts) if ts else None,
        identical=sum(r['identical'] for r in rs), ssim2_median=round(st.median(sc), 1), ssim2_min=min(sc),
        ssim2_min_photo=min(rs, key=lambda r: r['ssimulacra2'])['n'],
        orientation_ok=sum(r['orientation_ok'] for r in rs), portrait_ok=sum(r['orientation_ok'] for r in rs if r['n'] > 20),
        emb_px=collections.Counter('x'.join(map(str, r['emb_px'])) for r in rs).most_common(2),
        page_pt=collections.Counter('x'.join(map(str, r['page_pt'])) for r in rs).most_common(2), n=len(rs))
json.dump(S, open(f'{W}/summary.json', 'w'), indent=1)
for c, v in S['configs'].items(): print(c, v)
print(inp)
