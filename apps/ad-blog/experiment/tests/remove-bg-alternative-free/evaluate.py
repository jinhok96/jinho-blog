"""웹 배경 제거 도구 출력(투명 PNG)의 알파를 AIM-500 정답 알파 매트와 비교."""
import glob, os, json, statistics as st
import numpy as np
from PIL import Image
from scipy import ndimage
TOOLS = ['removebg', 'iloveimg', 'removalai', 'pixlr']
rows = []
cats = {l.split()[0]: l.split()[1] for l in open('picked.txt')}
for tool in TOOLS:
    for f in sorted(glob.glob(f'out/{tool}/*.png')):
        name = os.path.basename(f)[:-4]
        gt = np.asarray(Image.open(f'gt/{name}.png').convert('L'), dtype=np.float32) / 255
        im = Image.open(f).convert('RGBA')
        out_px = im.size
        a = im.getchannel('A').resize((gt.shape[1], gt.shape[0]), Image.BILINEAR)
        pr = np.asarray(a, dtype=np.float32) / 255
        gb, pb = gt >= 0.5, pr >= 0.5
        iou = float((gb & pb).sum() / (gb | pb).sum())
        mae = float(np.abs(pr - gt).mean())
        # 경계 띠(정답 윤곽 ±15px)의 오차: 머리카락·털 같은 가장자리 품질
        band = ndimage.binary_dilation(gb, iterations=15) & ~ndimage.binary_erosion(gb, iterations=15)
        edge = float(np.abs(pr - gt)[band].mean())
        nalpha = len(np.unique(np.asarray(im.getchannel('A'))))
        rows.append(dict(tool=tool, name=name, category=cats[name], w=out_px[0], h=out_px[1], iou=iou, mae=mae, edge_mae=edge, alpha_levels=nalpha))
json.dump(rows, open('results.json', 'w'), indent=1)
summary = {}
for tool in TOOLS:
    r = [x for x in rows if x['tool'] == tool]
    if not r: continue
    summary[tool] = dict(n=len(r), iou_median=st.median(x['iou'] for x in r), iou_mean=st.mean(x['iou'] for x in r),
        clean=sum(x['iou'] >= 0.95 for x in r), fail=sum(x['iou'] < 0.8 for x in r),
        edge_mae_median=st.median(x['edge_mae'] for x in r), mae_median=st.median(x['mae'] for x in r),
        out_size=f"{r[0]['w']}x{r[0]['h']}", megapixels_median=st.median(x['w']*x['h']/1e6 for x in r),
        alpha_levels_median=st.median(x['alpha_levels'] for x in r))
json.dump(summary, open('summary.json', 'w'), indent=1)
print(json.dumps(summary, indent=1))
