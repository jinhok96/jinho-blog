"""summary.json·results.jsonl·GIMP 스크린샷 → 글 이미지(webp)."""
import json, os, sys
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw, ImageFont

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
S = json.load(open('/tmp/ci/summary.json'))['groups']
R = [json.loads(l) for l in open('/tmp/ci/out/results.jsonl')]
LONG = [640, 800, 1024, 1280, 1600, 1920, 2560, 3200, 4032]
TARGETS = [1000, 500, 200, 100, 50]
LABEL = {1000: '1 MB', 500: '500 KB', 200: '200 KB', 100: '100 KB', 50: '50 KB'}
COL = {1000: '#1b6ca8', 500: '#2a9d8f', 200: '#e9a03b', 100: '#d1495b', 50: '#6d597a'}
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 13})


def save(fig, name):
    p = f'/tmp/ci/{name}.png'
    fig.savefig(p, dpi=100)
    plt.close(fig)
    Image.open(p).convert('RGB').save(f'{OUT}/{name}.webp', quality=88, method=6)


# 1) 대표 그래프: 긴 변 길이별 화질 중앙값 (JPEG, ImageMagick)
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
ax.set_title('Same file size, very different quality: resize before you compress\n20 photos (12 MP), JPEG via ImageMagick, circle = best size for each target', fontsize=14)
ax.legend(loc='upper center', bbox_to_anchor=(0.5, -0.17), ncol=5, fontsize=11, frameon=False)
ax.grid(axis='y', alpha=0.15)
fig.tight_layout()
save(fig, 'compress-image-size-quality-chart')

# 2) 목표 용량 통과 수 (100,000·200,000 바이트 이하, 원본 크기 그대로 vs 줄인 뒤)
fig, axes = plt.subplots(1, 2, figsize=(12, 5.2))
rows = [('im', 4032, 'ImageMagick, full size'), ('jo', 4032, 'jpegoptim, full size'), ('webp', 4032, 'cwebp (WebP), full size'), ('im', 'best', 'ImageMagick after resizing')]
best_L = {100: 1024, 200: 1280}
for ax, t in zip(axes, [100, 200]):
    vals, cols, labels = [], [], []
    for m, L, lab in rows:
        LL = best_L[t] if L == 'best' else L
        g = S[f'{t}|{m}|{LL}']
        vals.append(g['fit_1000'])
        cols.append('#2a9d8f' if L == 'best' else '#d1495b')
        labels.append(lab + (f' to {LL} px' if L == 'best' else ''))
    ax.barh(range(len(vals))[::-1], vals, color=cols)
    for i, v in enumerate(vals):
        ax.text(v + 0.3, len(vals) - 1 - i, f'{v}/20', va='center', fontsize=12)
    ax.set_yticks(range(len(vals))[::-1], labels, fontsize=11)
    ax.set_xlim(0, 25)
    ax.set_title(f'Target {t} KB', fontsize=13)
    ax.set_xlabel('Photos (out of 20)')
fig.suptitle('Asking for a target size at full resolution often misses it\n(counted as a hit only at or under 100,000 / 200,000 bytes)', fontsize=13)
fig.tight_layout()
save(fig, 'compress-image-target-size-hit-rate')

# 3) 확대 비교: 15번 사진, 1600x1200 화면 기준, 고양이 얼굴
M = '/tmp/ci/dl/squashfs-root/AppRun'
box = (560, 305, 1000, 635)
def view(p):
    return Image.open(p).convert('RGB').resize((1600, 1200), Image.LANCZOS).crop(box)
by = {(x['target_kb'], x['method'], x['long_edge']): x for x in R if x['n'] == '15'}
panels = [
    ('/tmp/ci/in/15.jpg', f"Original ({os.path.getsize('/tmp/ci/in/15.jpg')/1e6:.1f} MB, 4032 px)"),
    ('/tmp/ci/out/15/im_100_4032.jpg', f"100 KB at full size: {by[(100,'im',4032)]['bytes']/1000:.0f} KB, quality {by[(100,'im',4032)]['quality']}"),
    ('/tmp/ci/out/15/im_100_1024.jpg', f"100 KB at 1024 px: {by[(100,'im',1024)]['bytes']/1000:.0f} KB, quality {by[(100,'im',1024)]['quality']}"),
]
W, H = box[2] - box[0], box[3] - box[1]
canvas = Image.new('RGB', (W * 3 + 40, H + 50), 'white')
d = ImageDraw.Draw(canvas)
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 17)
for i, (p, lab) in enumerate(panels):
    canvas.paste(view(p), (i * (W + 20), 50))
    d.text((i * (W + 20) + 4, 14), lab, fill='black', font=font)
canvas.save(f'{OUT}/compress-image-100kb-full-size-vs-resized.webp', quality=90, method=6)
print('crop sizes', canvas.size)

# 4) GIMP 스크린샷 자르기
Image.open('/tmp/ci/gshot/scale-dialog.png').convert('RGB').crop((380, 220, 1220, 760)).save(f'{OUT}/gimp-scale-image-1600-pixels.webp', quality=90, method=6)
Image.open('/tmp/ci/gshot/export-q60-420.png').convert('RGB').crop((250, 120, 950, 694)).save(f'{OUT}/gimp-export-jpeg-quality-file-size.webp', quality=90, method=6)
