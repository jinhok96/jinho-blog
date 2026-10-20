"""summary.json·렌더링·화면 캡처(/tmp/cp) → 글 이미지(webp)
사용: /tmp/pv/bin/python -I charts.py <작업 폴더 /tmp/cp> <이미지 출력 폴더>
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402

W, OUT = Path(sys.argv[1]), Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)
S = W / 'shots'
ROWS = json.loads((Path(__file__).parent / 'summary.json').read_text())
R = {(r['tool'], r['doc']): r for r in ROWS}
FONT = '/usr/share/fonts/opentype/inter/Inter-SemiBold.otf'


def mb(b):
    return f'{b / 1e6:.2f} MB' if b >= 1e5 else f'{b / 1e3:.0f} KB'


# 1) 대표: 문서 3종 × 설정 4개, 원본 대비 크기(%)
DOCS = [('photo-brochure', 'Photo brochure (39.6 MB)'),
        ('scanned-letter', 'Scanned letter (7.1 MB)'),
        ('slides-screens', 'Screenshot slides (1.4 MB)')]
SETS = [('ilove-recommended', 'iLovePDF Recommended'), ('pdf24-default', 'PDF24 default'),
        ('sejda-medium', 'Sejda Desktop default'), ('ilove-extreme', 'iLovePDF Extreme')]
fig = cs.plt.figure(figsize=cs.FIGSIZE)
for i, (doc, title) in enumerate(DOCS):
    ax = fig.add_axes([0.2 + i * 0.27, 0.16, 0.22, 0.58])
    cs.style_axes(ax)
    ax.set_xlim(0, 115)
    ax.set_ylim(-0.5, len(SETS) - 0.5)  # 뒤집으면 rounded_barh 모서리 보정이 깨짐 → y를 거꾸로 배치
    ax.set_xticks([0, 50, 100], ['0', '50%', '100%'])
    ax.set_yticks([len(SETS) - 1 - k for k in range(len(SETS))], [s[1] for s in SETS] if i == 0 else [''] * len(SETS), fontsize=13)
    ax.set_title(title, fontsize=12.5, loc='left', fontweight='semibold', pad=12)
    fig.canvas.draw()
    for k, (tool, _) in enumerate(SETS):
        y = len(SETS) - 1 - k
        r = R[(tool, doc)]
        v = r['ratio'] * 100
        cs.rounded_barh(ax, y, 0, max(v, 0.6), 0.56, cs.ACCENT if tool == 'ilove-recommended' else cs.MUTED)
        ax.text(max(v, 0.6) + 3, y, f'{mb(r["bytes"])}', va='center', fontsize=12, fontweight='semibold')
cs.header(fig, 'How small each free tool made the same PDFs',
          'File size after compressing, as % of the original (default settings, plus iLovePDF Extreme)')
cs.footer(fig, 'ToolProof test, October 20, 2026. Same 3 PDFs in every tool. Sejda said the slides PDF was "already very well compressed".')
cs.save(fig, OUT / 'compress-pdf-size-chart.webp')


# 2) 확대 비교: 렌더링 후 같은 영역 자르기
def crop(pdf, page, box, dpi=200):
    with tempfile.TemporaryDirectory() as d:
        subprocess.run(['pdftoppm', '-r', str(dpi), '-f', str(page), '-l', str(page), '-png', str(pdf), d + '/p'], check=True)
        return Image.open(next(Path(d).glob('p-*'))).convert('RGB').crop(box)


def panel_grid(items, name, title, cols=2, tile=(560, 230)):
    pad, top, lab = 30, 110, 40
    rows = (len(items) + cols - 1) // cols
    canvas = Image.new('RGB', (1200, top + rows * (tile[1] + lab + 20) + 60), cs.SURFACE)
    d = ImageDraw.Draw(canvas)
    d.text((pad, 28), title[0], font=ImageFont.truetype(FONT.replace('SemiBold', 'Bold'), 30), fill=cs.FOREGROUND)
    d.text((pad, 70), title[1], font=ImageFont.truetype(FONT.replace('SemiBold', 'Regular'), 19), fill=cs.MUTED)
    f = ImageFont.truetype(FONT, 19)
    for k, (label, im, hi) in enumerate(items):
        x = pad + (k % cols) * (tile[0] + 20)
        y = top + (k // cols) * (tile[1] + lab + 20)
        d.text((x, y + 6), label, font=f, fill=cs.ACCENT if hi else cs.FOREGROUND)
        canvas.paste(im.resize(tile, Image.LANCZOS), (x, y + lab))
        d.rectangle([x, y + lab, x + tile[0] - 1, y + lab + tile[1] - 1], outline=cs.BORDER, width=2)
    d.text((1200 - pad, canvas.height - 40), cs.SITE_NAME, font=ImageFont.truetype(FONT.replace('SemiBold', 'Bold'), 20), fill=cs.FOREGROUND, anchor='ra')
    canvas.save(OUT / f'{name}.webp', 'WEBP', quality=88)
    print(OUT / f'{name}.webp', canvas.size)


IN = W / 'in'
F = W / 'flat'
box = (180, 200, 880, 488)  # 편지 1쪽 왼쪽 위 (200dpi)
panel_grid([
    ('Original scan (300 ppi, 7.1 MB)', crop(IN / 'scanned-letter.pdf', 1, box), False),
    ('iLovePDF Recommended (150 ppi, 1.23 MB)', crop(F / 'ilove-recommended__scanned-letter.pdf', 1, box), True),
    ('PDF24 at 100 DPI, quality 60 (0.75 MB)', crop(F / 'pdf24-100q60__scanned-letter.pdf', 1, box), False),
    ('iLovePDF Extreme (72 ppi, 0.44 MB)', crop(F / 'ilove-extreme__scanned-letter.pdf', 1, box), False),
], 'compress-pdf-scan-zoom', ('Scanned letter, zoomed in after compressing', 'Same area of page 1, rendered at 200 DPI. Text stayed readable in all four.'))

box = (150, 380, 750, 626)  # 슬라이드 1쪽 작은 글자 (200dpi)
panel_grid([
    ('Original screenshot PDF (1.38 MB)', crop(IN / 'slides-screens.pdf', 1, box), False),
    ('iLovePDF Recommended (1.02 MB)', crop(F / 'ilove-recommended__slides-screens.pdf', 1, box), True),
    ('PDF24 default (1.22 MB)', crop(F / 'pdf24-default__slides-screens.pdf', 1, box), False),
    ('iLovePDF Extreme (0.39 MB)', crop(F / 'ilove-extreme__slides-screens.pdf', 1, box), False),
], 'compress-pdf-small-text-zoom', ('Small text in a screenshot PDF, zoomed in', 'Slide 1, rendered at 200 DPI. Extreme blurred the small text the most.'))


# 3) 화면 캡처 + accent 상자
def shot(src, name, boxes=(), crop_box=None):
    im = Image.open(S / src).convert('RGB')
    d = ImageDraw.Draw(im)
    for b in boxes:
        d.rounded_rectangle(b, radius=6, outline=cs.ACCENT, width=4)
    if crop_box:
        im = im.crop(crop_box)
    im.save(OUT / f'{name}.webp', 'WEBP', quality=86)
    print(OUT / f'{name}.webp', im.size)


shot('ilove-recommended-options.png', 'ilovepdf-compression-levels', [(990, 196, 1362, 274), (1012, 812, 1342, 876)])
shot('ilove-recommended-done.png', 'ilovepdf-compressed-result', [(500, 255, 880, 350)], (0, 60, 1366, 600))
shot('pdf24-custom-options.png', 'pdf24-dpi-quality-settings', [(505, 622, 800, 660)], (0, 250, 1366, 770))
shot('pdf24-default-done.png', 'pdf24-compressed-result', [(260, 24, 1100, 46)], (0, 0, 1366, 395))
shot('sejda-options.png', 'sejda-desktop-compress-options', [(546, 314, 820, 352), (546, 388, 820, 426)], (0, 255, 1366, 780))
shot('sejda-limit.png', 'sejda-desktop-free-limit', [(340, 205, 1030, 272)], (0, 0, 1366, 420))
