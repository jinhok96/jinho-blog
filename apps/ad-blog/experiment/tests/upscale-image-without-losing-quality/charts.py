"""results/scores.json → 글 그림 (디자인 시스템 라이트 모드)
1) upscale-results-table.webp: 도구별 결과 요약 표 그래픽
2) upscale-lpips-chart.webp: 2x·4x 평균 LPIPS 막대 (보통 확대와 비교)
실행: /tmp/meas/bin/python -I charts.py <출력 폴더>
"""
import json
import sys
from pathlib import Path

import matplotlib.pyplot as plt
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
HERE = Path(__file__).parent
R = json.loads((HERE / 'results/scores.json').read_text())
INTER = '/usr/share/fonts/opentype/inter/Inter-{}.otf'


def font(w, s):
    return ImageFont.truetype(INTER.format(w), s)


def avg(scale, tool, m):
    v = [r[m] for r in R if r['scale'] == scale and r['tool'] == tool and m in r]
    return sum(v) / len(v) if v else None


def wins(scale, tool, m):
    base = {r['image']: r[m] for r in R if r['scale'] == scale and r['tool'] == 'bicubic'}
    rs = [r for r in R if r['scale'] == scale and r['tool'] == tool and m in r]
    better = (lambda a, b: a < b) if m == 'lpips' else (lambda a, b: a > b)
    return sum(better(r[m], base[r['image']]) for r in rs), len(rs)


# 1) 요약 표
rows = [
    ('Bigjpg', '2x, 4x', 'PNG', f"{wins('2x', 'bigjpg', 'lpips')[0]} of 6", f"{wins('4x', 'bigjpg', 'lpips')[0]} of 6", 'Beat a normal resize on every image, both scores'),
    ('iLoveIMG', '2x only', 'PNG', f"{wins('2x', 'iloveimg', 'lpips')[0]} of 6", 'Not free', 'Premium pop-up after a few images'),
    ('Img.Upscaler', '2x, 4x', 'JPEG', f"{wins('2x', 'imgupscaler', 'lpips')[0]} of 6", f"{wins('4x', 'imgupscaler', 'lpips')[0]} of 6", 'Sharpest look, but rewrote small letters'),
    ('Pixelcut', '2x, 4x', 'PNG', '-', '-', 'No sign-in: 1080 x 810 preview only'),
    ('Icons8', '2x demo', '-', '-', '-', 'Free demo adds a watermark, 3 tries'),
]
cols = ['Tool', 'Free sizes', 'File', 'Looked closer than a normal\nresize at 2x (6 photos)', 'Same at 4x', 'What we saw']
cw = [190, 150, 90, 300, 160, 430]
W = sum(cw) + 60
H = 150 + 70 + len(rows) * 64 + 90
c = Image.new('RGB', (W, H), cs.BACKGROUND)
d = ImageDraw.Draw(c)
d.text((30, 28), 'Free AI image upscalers vs. a normal resize', font=font('Bold', 30), fill=cs.FOREGROUND)
d.text((30, 74), 'Six test images shrunk and enlarged back, compared with the original. Websites, no sign-in, default settings.',
       font=font('Regular', 19), fill=cs.MUTED)
y = 140
x = 30
for w, h in zip(cw, cols):
    d.multiline_text((x, y), h, font=font('SemiBold', 17), fill=cs.MUTED, spacing=4)
    x += w
y += 62
d.line((30, y - 8, W - 30, y - 8), fill=cs.BORDER, width=2)
for i, r in enumerate(rows):
    x = 30
    for j, (w, v) in enumerate(zip(cw, r)):
        good = (j in (3, 4) and v.endswith('of 6') and int(v.split()[0]) >= 5)
        f = font('Bold' if j == 0 else 'Regular', 20)
        d.text((x, y + 14), v, font=f, fill=cs.ACCENT if good else (cs.MUTED if v in ('-', 'Not free') else cs.FOREGROUND))
        x += w
    y += 64
    d.line((30, y - 4, W - 30, y - 4), fill=cs.BORDER, width=1)
d.text((30, H - 58), '"Looked closer" = lower LPIPS (a measure of visible difference) than the same image enlarged with bicubic resizing.',
       font=font('Regular', 15), fill=cs.MUTED)
d.text((30, H - 34), 'Tested November 15, 2026. Pixelcut and Icons8 were not scored: their free downloads were smaller or watermarked.',
       font=font('Regular', 15), fill=cs.MUTED)
d.text((W - 30, H - 36), cs.SITE_NAME, font=font('Bold', 18), fill=cs.FOREGROUND, anchor='ra')
c.save(OUT / 'upscale-results-table.webp', 'WEBP', quality=92)
print(OUT / 'upscale-results-table.webp', c.size)

# 2) LPIPS 막대 (2x | 4x)
fig = plt.figure(figsize=cs.FIGSIZE)
cs.header(fig, 'How different each result looks from the original',
          'Average LPIPS over 6 images, lower is better. Gray bar: the same images enlarged with a normal (bicubic) resize.')
panels = [('2x (800 x 600 to 1600 x 1200)', '2x', ['bicubic', 'bigjpg', 'iloveimg', 'imgupscaler']),
          ('4x (400 x 300 to 1600 x 1200)', '4x', ['bicubic', 'bigjpg', 'imgupscaler'])]
names = {'bicubic': 'Normal resize', 'bigjpg': 'Bigjpg', 'iloveimg': 'iLoveIMG', 'imgupscaler': 'Img.Upscaler'}
for k, (title, sc, tools) in enumerate(panels):
    ax = fig.add_axes([0.14 + k * 0.45, 0.2, 0.32, 0.56])
    cs.style_axes(ax)
    ax.set_xlim(0, 0.5)
    ax.set_ylim(-0.6, 3.6)
    ax.set_yticks(range(4))
    labels = [names[t] for t in tools] + [''] * (4 - len(tools))
    ax.set_yticklabels(list(reversed(labels)))
    ax.set_xticks([0, 0.1, 0.2, 0.3, 0.4, 0.5])
    ax.set_title(title, loc='left', fontsize=14, fontweight='bold', color=cs.FOREGROUND, pad=12)
    fig.canvas.draw()
    for i, t in enumerate(tools):
        v = avg(sc, t, 'lpips')
        yy = 3 - i
        cs.rounded_barh(ax, yy, 0, v, 0.56, cs.MUTED if t == 'bicubic' else cs.ACCENT)
        ax.text(v + 0.008, yy, f'{v:.2f}', va='center', fontsize=13, fontweight='semibold', color=cs.FOREGROUND)
    if sc == '4x':
        ax.text(0.0, 0, 'iLoveIMG: 4x is not free', va='center', fontsize=12, color=cs.MUTED)
cs.footer(fig, 'Test set: 5 public-domain photos (sign, cat, forest, building, old portrait) and 1 screenshot with small text. '
          'Websites tested November 15, 2026, no sign-in.',
          'LPIPS (AlexNet) estimates how different two images look to people. Pixel-level scores (PSNR, SSIM) are in our test notes.')
cs.save(fig, OUT / 'upscale-lpips-chart.webp')
