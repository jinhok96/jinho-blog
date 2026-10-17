"""명령줄 도구(ImageMagick·jpegoptim·cwebp) 이름·막대를 뺀 그래프 2개 다시 그리기 (2026-10-17).

charts.py의 1)·2)와 같은 크기·파일명. summary.json만 읽고 측정값은 바꾸지 않음.
- 1) 대표 그래프: 부제에서 "via ImageMagick" 삭제 (데이터 같음)
- 2) 목표 용량 통과 수: jpegoptim·cwebp 막대 삭제, 도구 이름 없이 "원본 크기" vs "줄인 뒤"만

사용: python -I charts_no_cli.py <출력 폴더(content/posts/images/compress-image-to-100kb)>
"""
import io
import json
import os
import sys

import matplotlib

matplotlib.use('Agg')
import matplotlib.pyplot as plt  # noqa: E402
from PIL import Image  # noqa: E402

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
HERE = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(os.path.join(HERE, 'summary.json')))['groups']
LONG = [640, 800, 1024, 1280, 1600, 1920, 2560, 3200, 4032]
TARGETS = [1000, 500, 200, 100, 50]
LABEL = {1000: '1 MB', 500: '500 KB', 200: '200 KB', 100: '100 KB', 50: '50 KB'}
COL = {1000: '#1b6ca8', 500: '#2a9d8f', 200: '#e9a03b', 100: '#d1495b', 50: '#6d597a'}
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 13})


def save(fig, name):
    b = io.BytesIO()
    fig.savefig(b, format='png', dpi=100)
    plt.close(fig)
    Image.open(b).convert('RGB').save(f'{OUT}/{name}.webp', quality=88, method=6)
    print(name)


# 1) 대표 그래프: 긴 변 길이별 화질 중앙값 (JPEG)
fig, ax = plt.subplots(figsize=(12, 6.75))
x = list(range(len(LONG)))
for t in TARGETS:
    y = [S[f'{t}|im|{L}']['screen_median'] for L in LONG]
    ax.plot(x, y, marker='o', lw=2.5, color=COL[t], label=f'Target {LABEL[t]}')
    b = max(range(len(LONG)), key=lambda i: y[i])
    ax.scatter([b], [y[b]], s=180, facecolors='none', edgecolors=COL[t], lw=2.5, zorder=5)
for v, txt in [(90, 'visually lossless'), (70, 'high'), (50, 'medium'), (30, 'low')]:
    ax.axhline(v, color='#999', lw=0.8, ls='--')
    ax.text(8.45, v + 1, txt, color='#666', fontsize=11, ha='right')
ax.set_xticks(x, [f'{L}' + ('\n(original)' if L == 4032 else '') for L in LONG])
ax.set_xlabel('Long edge after resizing (pixels)')
ax.set_ylabel('Quality on a 1600-pixel screen (SSIMULACRA2, median)')
ax.set_ylim(-60, 100)
ax.set_title('Same file size, very different quality: resize before you compress\n20 photos (12 MP), JPEG, circle = best size for each target', fontsize=14)
ax.legend(loc='upper center', bbox_to_anchor=(0.5, -0.17), ncol=5, fontsize=11, frameon=False)
ax.grid(axis='y', alpha=0.15)
fig.tight_layout()
save(fig, 'compress-image-size-quality-chart')

# 2) 목표 용량 통과 수 (100,000·200,000 바이트 이하): 원본 크기 그대로 vs 줄인 뒤 (JPEG)
fig, axes = plt.subplots(1, 2, figsize=(12, 5.2))
best_L = {100: 1024, 200: 1280}
for ax, t in zip(axes, [100, 200]):
    rows = [(4032, 'Full size (4032 px)', '#d1495b'), (best_L[t], f'Resized to {best_L[t]} px', '#2a9d8f')]
    vals = [S[f'{t}|im|{L}']['fit_1000'] for L, _, _ in rows]
    ys = list(range(len(rows)))[::-1]
    ax.barh(ys, vals, color=[c for _, _, c in rows], height=0.55)
    for yi, v in zip(ys, vals):
        ax.text(v + 0.3, yi, f'{v}/20', va='center', fontsize=12)
    ax.set_yticks(ys, [lab for _, lab, _ in rows], fontsize=11)
    ax.set_ylim(-0.7, 1.7)
    ax.set_xlim(0, 25)
    ax.set_title(f'Target {t} KB', fontsize=13)
    ax.set_xlabel('Photos (out of 20)')
fig.suptitle('At full resolution, some photos never got under the target\n(JPEG, counted as a hit only at or under 100,000 / 200,000 bytes)', fontsize=13)
fig.tight_layout()
save(fig, 'compress-image-target-size-hit-rate')
