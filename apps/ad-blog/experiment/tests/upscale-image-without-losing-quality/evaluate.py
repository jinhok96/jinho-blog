"""업스케일 결과를 정답(1600x1200 원본 축소본)과 비교
- PSNR(dB, 높을수록 원본과 화소가 가까움), SSIM(0~1, 구조 유사도), LPIPS(낮을수록 사람 눈에 가까움, AlexNet)
- 기준선: 같은 입력을 보통 확대(bicubic·Lanczos, Pillow)한 결과
- 출력 크기가 정답과 다르면 점수를 내지 않고 크기만 기록 (예: Pixelcut 로그인 없는 미리보기 1080x810)
실행: /tmp/meas/bin/python -I evaluate.py /tmp/upscale results/scores.json
"""
import glob
import json
import os
import sys

import numpy as np
from PIL import Image
from skimage.metrics import peak_signal_noise_ratio, structural_similarity

root, out = sys.argv[1], sys.argv[2]
try:
    import lpips
    import torch

    LP = lpips.LPIPS(net='alex', verbose=False)
except Exception as e:  # LPIPS가 없으면 PSNR·SSIM만
    print('LPIPS 없음:', e)
    LP = None


def lp(a, b):
    if LP is None:
        return None
    t = lambda x: torch.from_numpy(x.astype(np.float32) / 127.5 - 1).permute(2, 0, 1)[None]
    with torch.no_grad():
        return float(LP(t(a), t(b)))


def load(p):
    im = Image.open(p)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
        im = Image.alpha_composite(bg, im)
    return im.convert('RGB')


def score(gt, im):
    a, b = np.asarray(gt), np.asarray(im)
    return {
        'psnr': round(float(peak_signal_noise_ratio(a, b, data_range=255)), 2),
        'ssim': round(float(structural_similarity(a, b, channel_axis=2, data_range=255)), 4),
        'lpips': None if LP is None else round(lp(a, b), 4),
    }


rows = []
names = sorted(os.path.basename(p)[:-4] for p in glob.glob(f'{root}/gt/*.png'))
for scale, indir in (('2x', 'in2'), ('4x', 'in')):
    for name in names:
        gt = load(f'{root}/gt/{name}.png')
        src = load(f'{root}/{indir}/{name}.png')
        for ref, flt in (('bicubic', Image.BICUBIC), ('lanczos', Image.LANCZOS)):
            rows.append({'scale': scale, 'tool': ref, 'image': name, 'size': list(gt.size), **score(gt, src.resize(gt.size, flt))})
        for d in sorted(glob.glob(f"{root}/out{scale[0]}/*/")):
            tool = os.path.basename(d.rstrip('/'))
            f = glob.glob(f'{d}{name}.*')
            if not f:
                continue
            raw = Image.open(f[0])
            im = load(f[0])
            r = {'scale': scale, 'tool': tool, 'image': name, 'size': list(im.size), 'format': raw.format, 'bytes': os.path.getsize(f[0])}
            if im.size == gt.size:
                r.update(score(gt, im))
            rows.append(r)
            print(scale, tool, name, r.get('psnr'), r.get('ssim'), r.get('lpips'), r['size'], r['format'])
json.dump(rows, open(out, 'w'), indent=1)

# 도구별 평균 (점수가 있는 이미지만)
summary = {}
for r in rows:
    if 'psnr' not in r:
        continue
    k = (r['scale'], r['tool'])
    s = summary.setdefault(k, {'n': 0, 'psnr': 0, 'ssim': 0, 'lpips': 0})
    s['n'] += 1
    for m in ('psnr', 'ssim', 'lpips'):
        s[m] += r[m] or 0
print('\n| 배율 | 도구 | 이미지 수 | PSNR | SSIM | LPIPS |')
for (sc, tool), s in sorted(summary.items()):
    n = s['n']
    print(f"| {sc} | {tool} | {n} | {s['psnr'] / n:.2f} | {s['ssim'] / n:.4f} | {s['lpips'] / n:.4f} |")
