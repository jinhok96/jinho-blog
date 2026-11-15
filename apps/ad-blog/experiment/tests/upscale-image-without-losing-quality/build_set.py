"""업스케일 시험 세트: PD12M(CC0) 사진 5장 + 합성 글자 그림 1장
정답(gt) 1600x1200 PNG  →  입력 in2 800x600 (2배 축소) · in 400x300 (4배 축소), 넓이 평균(BOX)
실행: /tmp/meas/bin/python -I build_set.py  (작업 폴더 /tmp/upscale)"""
import json, os, urllib.request, io
from PIL import Image, ImageDraw, ImageFont
W, H = 1600, 1200
PICK = [  # (이름, PD12M id 앞 8자, 설명)
    ('sign', 'd8668572', 'green street sign "Rue Neuve" on a building'),
    ('cat', '433b4d81', 'calico cat next to a fence'),
    ('forest', 'ad0f91c8', 'path through a green forest'),
    ('building', '2ce8e533', 'large white building with lawn and trees'),
    ('portrait', '964dd75c', 'old black-and-white portrait photo of a man'),
]
os.chdir('/tmp/upscale'); os.makedirs('orig', exist_ok=True); os.makedirs('gt', exist_ok=True); os.makedirs('in', exist_ok=True); os.makedirs('in2', exist_ok=True)
import pyarrow.parquet as pq
rows = {r['id'][:8]: r for r in pq.read_table('meta000.parquet').to_pylist() if r['id'][:8] in {p[1] for p in PICK}}
meta = []
for name, pid, desc in PICK:
    r = rows[pid]; path = f'orig/{name}.jpg'
    if not os.path.exists(path):
        urllib.request.urlretrieve(r['url'], path)
    im = Image.open(path).convert('RGB')
    # 4:3으로 가운데 자르고 1600x1200으로 줄임 (고품질 축소 → 정답)
    w, h = im.size; tw = min(w, h * 4 // 3); th = tw * 3 // 4
    top = int(h * 0.04) if h > w else (h - th) // 2  # 세로 사진은 얼굴이 있는 위쪽
    im = im.crop(((w - tw) // 2, top, (w - tw) // 2 + tw, top + th)).resize((W, H), Image.LANCZOS)
    im.save(f'gt/{name}.png')
    meta.append({'name': name, 'id': r['id'], 'url': r['url'], 'license': r['license'], 'source': r['source'], 'orig': [w, h], 'caption': r['caption'][:200], 'desc': desc})
# 합성 그림: 화면 캡처처럼 작은 글자·선이 있는 그림 (정답을 정확히 앎)
g = Image.new('RGB', (W, H), (250, 250, 248)); d = ImageDraw.Draw(g)
font = lambda s: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', s)
bold = lambda s: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', s)
d.rectangle((0, 0, W, 110), fill=(37, 99, 235)); d.text((60, 30), 'Weekly Order Summary', font=bold(52), fill='white')
rows_ = [('Item', 'Qty', 'Price'), ('Blue ceramic mug', '4', '$12.50'), ('Oak cutting board', '1', '$34.00'), ('Linen tea towel', '6', '$8.75'), ('Glass storage jar', '3', '$15.20'), ('Total', '14', '$170.70')]
y = 170
for i, (a, b, c) in enumerate(rows_):
    f = bold(40) if i in (0, len(rows_) - 1) else font(40)
    d.text((80, y), a, font=f, fill=(20, 20, 20)); d.text((900, y), b, font=f, fill=(20, 20, 20)); d.text((1200, y), c, font=f, fill=(20, 20, 20))
    y += 78; d.line((80, y - 14, 1520, y - 14), fill=(200, 200, 200), width=2)
d.text((80, y + 20), 'Order #48213  ·  Shipped November 12, 2026  ·  Tracking 1Z 999 AA1 0123 4567 84', font=font(28), fill=(80, 80, 80))
for k in range(6):  # 색 막대
    x = 80 + k * 240; hgt = [180, 120, 240, 90, 200, 150][k]
    d.rounded_rectangle((x, 1120 - hgt, x + 160, 1120), radius=12, fill=[(37, 99, 235), (234, 88, 12), (22, 163, 74), (147, 51, 234), (219, 39, 119), (8, 145, 178)][k])
g.save('gt/text.png')
meta.append({'name': 'text', 'source': 'ToolProof (generated with Pillow, DejaVu Sans)', 'desc': 'screenshot-like order summary with small text, table lines and colored bars'})
for m in meta:
    gt = Image.open(f"gt/{m['name']}.png")
    gt.resize((W // 4, H // 4), Image.BOX).save(f"in/{m['name']}.png")  # 4배 축소 입력 (4x 시험)
    gt.resize((W // 2, H // 2), Image.BOX).save(f"in2/{m['name']}.png")  # 2배 축소 입력 (2x 시험)
json.dump(meta, open('set.json', 'w'), indent=1)
print(json.dumps(meta, indent=1)[:2000])
