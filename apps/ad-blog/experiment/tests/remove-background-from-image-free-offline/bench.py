"""AIM-500 층화 표본(50장)에서 rembg 모델별 정확도·속도·메모리 측정."""
import io, json, sys, time, resource, random, collections
import numpy as np
import onnxruntime as ort
import pyarrow.parquet as pq
from PIL import Image
from rembg import new_session, remove

PARQUET = '/tmp/bgdata/aim.parquet'
QUOTA = {'animal': 15, 'portrait': 10, 'plant': 8, 'transparent': 6, 'furniture': 5, 'toy': 4, 'fruit': 2}

def sample():
    t = pq.read_table(PARQUET, columns=['image_name', 'category'])
    names = t.column('image_name').to_pylist(); cats = t.column('category').to_pylist()
    by = collections.defaultdict(list)
    for i, (n, c) in enumerate(zip(names, cats)): by[c].append((n, i))
    rng = random.Random(20261013)
    picked = []
    for c, k in QUOTA.items():
        picked += [i for _, i in rng.sample(sorted(by[c]), k)]
    return sorted(picked)

def main(model):
    idx = sample()
    t = pq.read_table(PARQUET)
    so = ort.SessionOptions(); so.enable_cpu_mem_arena = False; so.enable_mem_pattern = False
    s = new_session(model, sess_opts=so)
    rows = []
    for i in idx:
        r = t.slice(i, 1).to_pylist()[0]
        img = Image.open(io.BytesIO(r['image']['bytes'])).convert('RGB')
        gt = np.asarray(Image.open(io.BytesIO(r['mask']['bytes'])).convert('L'), dtype=np.float32) / 255
        t0 = time.perf_counter(); m = remove(img, session=s, only_mask=True); dt = time.perf_counter() - t0
        pr = np.asarray(m.convert('L').resize(img.size), dtype=np.float32) / 255
        if pr.shape != gt.shape: pr = np.asarray(m.convert('L').resize((gt.shape[1], gt.shape[0])), dtype=np.float32) / 255
        mae = float(np.abs(pr - gt).mean())
        gb, pb = gt >= 0.5, pr >= 0.5
        union = (gb | pb).sum(); iou = float((gb & pb).sum() / union) if union else 1.0
        rows.append(dict(name=r['image_name'], category=r['category'], type=r['type'], w=img.width, h=img.height, sec=dt, mae=mae, iou=iou))
        print(model, len(rows), r['category'], round(dt, 2), round(iou, 3), flush=True)
    peak = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1e6
    json.dump(dict(model=model, onnxruntime=ort.__version__, peak_rss_gb=peak, rows=rows), open(f'res/{model}.json', 'w'), indent=1)

if __name__ == '__main__':
    main(sys.argv[1])
