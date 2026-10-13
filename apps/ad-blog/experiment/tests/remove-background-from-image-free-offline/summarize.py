"""res/*.json → summary.json + 표 출력."""
import json, glob, os, statistics as st
SIZES = {m: os.path.getsize(f'/root/.rembg/models/{m}/{m}.onnx') / 1e6 for m in os.listdir('/root/.rembg/models')}
out = {}
for f in sorted(glob.glob('res/*.json')):
    d = json.load(open(f)); rows = d['rows']; m = d['model']
    ious = [r['iou'] for r in rows]
    cat = {}
    for c in ['animal', 'portrait', 'plant', 'transparent', 'furniture', 'toy', 'fruit']:
        xs = [r['iou'] for r in rows if r['category'] == c]
        if xs: cat[c] = round(st.mean(xs), 3)
    out[m] = dict(n=len(rows), mean_iou=round(st.mean(ious), 3), median_iou=round(st.median(ious), 3),
                  clean_rate=round(sum(i >= 0.95 for i in ious) / len(ious), 3),
                  fail_rate=round(sum(i < 0.8 for i in ious) / len(ious), 3),
                  mean_mae=round(st.mean(r['mae'] for r in rows), 4),
                  median_sec=round(st.median(r['sec'] for r in rows), 2),
                  peak_rss_gb=round(d['peak_rss_gb'], 2), model_mb=round(SIZES.get(m, 0)), by_category=cat)
json.dump(out, open('summary.json', 'w'), indent=1)
print('| model | n | meanIoU | medIoU | >=.95 | <.8 | MAE | sec | RAM | MB |')
for m, s in sorted(out.items(), key=lambda x: -x[1]['mean_iou']):
    print(f"| {m} | {s['n']} | {s['mean_iou']} | {s['median_iou']} | {s['clean_rate']} | {s['fail_rate']} | {s['mean_mae']} | {s['median_sec']} | {s['peak_rss_gb']} | {s['model_mb']} |")
for m, s in out.items(): print(m, s['by_category'])
