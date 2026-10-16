"""summary.json·출력 JPG·스크린샷 → 글 이미지(webp). 사용: python3 -I charts.py <작업 폴더> <이미지 출력 폴더>"""
import json, sys
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw, ImageFont

W = Path(sys.argv[1]); OUT = Path(sys.argv[2])
S = json.loads((W / 'summary.json').read_text())
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 13, 'axes.spines.top': False, 'axes.spines.right': False})
FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 26)
FONT_S = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 22)
GOOD, BAD, LIGHT, INK = '#2a9d8f', '#d1495b', '#9fd3cc', '#222222'

def save_fig(fig, name):
    p = W / f'{name}.png'; fig.savefig(p, dpi=100); plt.close(fig)
    Image.open(p).convert('RGB').save(OUT / f'{name}.webp', quality=88, method=6)

def save_img(im, name, q=86):
    im.convert('RGB').save(OUT / f'{name}.webp', quality=q, method=6)

ROWS = [('pdftoppm', 'pdftoppm (Poppler 26.10)'), ('pymupdf', 'PyMuPDF 1.28 (MuPDF)'), ('gs', 'Ghostscript 10.08'),
        ('magick', 'ImageMagick 7.1.2'), ('libreoffice', 'LibreOffice 26.8')]
DPI = {'pdftoppm': 150, 'pymupdf': 72, 'gs': 72, 'magick': 72, 'libreoffice': 96}
TUNED = {'pdftoppm': 'pdftoppm-300', 'pymupdf': 'pymupdf-300', 'gs': 'gs-300-aa', 'magick': 'magick-300-flat', 'libreoffice': 'libreoffice-2550'}

# 1) 대표: 기본 설정 vs 300 DPI에서 IRS 1040 1쪽 OCR 판독 단어 비율
fig, ax = plt.subplots(figsize=(12, 6.75))
y = list(range(len(ROWS)))[::-1]
d = [S[f'{k}-default']['irs-1040']['p1_recall'] * 100 for k, _ in ROWS]
t = [S[TUNED[k]]['irs-1040']['p1_recall'] * 100 for k, _ in ROWS]
h = 0.36
ax.barh([v + h / 2 for v in y], d, h, color=[GOOD if v > 50 else BAD for v in d], label='Default settings')
ax.barh([v - h / 2 for v in y], t, h, color=LIGHT, label='300 DPI (fixed settings)')
for yi, v, (k, _) in zip(y, d, ROWS):
    ax.text(v + 1, yi + h / 2, f'{v:.0f}%  at {DPI[k]} DPI' + ('  (page 1 only)' if k == 'libreoffice' else ''), va='center', fontsize=12, color=INK)
for yi, v in zip(y, t):
    ax.text(v + 1, yi - h / 2, f'{v:.0f}%', va='center', fontsize=12, color='#555')
ax.set_yticks(y, [l for _, l in ROWS], fontsize=13)
ax.set_xlim(0, 118); ax.set_xticks([0, 25, 50, 75, 100], ['0%', '25%', '50%', '75%', '100%'])
ax.set_xlabel('Words on IRS Form 1040 page 1 that OCR could read back from the JPG')
ax.set_title('PDF to JPG: default settings vs 300 DPI (same form, 5 free tools)', loc='left', fontsize=16, pad=14)
ax.legend(loc='upper center', bbox_to_anchor=(0.45, -0.12), ncol=2, frameon=False, fontsize=12)
fig.tight_layout(); save_fig(fig, 'pdf-to-jpg-default-vs-300-dpi')

# 2) DPI별 쪽당 크기 + OCR (두 개의 그래프로 분리, 한 축씩)
dpis = [72, 100, 150, 200, 300, 400, 600]
fig, (a1, a2) = plt.subplots(1, 2, figsize=(12, 5.6))
for q, col in ((75, GOOD), (90, '#264653')):
    kb = [S[f'pdftoppm-r{x}-q{q}']['irs-1040']['kb_per_page'] for x in dpis]
    a1.plot(dpis, kb, marker='o', lw=2, color=col, label=f'JPEG quality {q}')
    a1.text(dpis[-1] + 10, kb[-1], f'{kb[-1]/1000:.1f} MB', va='center', fontsize=11, color=INK)
a1.set_xlabel('DPI'); a1.set_ylabel('KB per page (IRS Form 1040)'); a1.set_xticks([72, 150, 200, 300, 400, 600]); a1.set_xlim(50, 680)
a1.legend(frameon=False, fontsize=11); a1.set_title('File size grows with DPI', loc='left')
r = [S[f'pdftoppm-r{x}-q75']['irs-1040']['p1_recall'] * 100 for x in dpis]
a2.plot(dpis, r, marker='o', lw=2, color=GOOD)
for x, v in zip(dpis, r):
    a2.text(x, v + 3, f'{v:.0f}%', ha='center', fontsize=11, color=INK)
a2.set_ylim(0, 105); a2.set_xticks([72, 150, 200, 300, 400, 600]); a2.set_xlim(50, 650)
a2.set_xlabel('DPI'); a2.set_ylabel('Words OCR could read (page 1, quality 75)')
a2.set_title('OCR readability levels off around 200-300 DPI', loc='left')
fig.tight_layout(); save_fig(fig, 'pdf-to-jpg-dpi-size-readability')

# 3) 같은 영역 확대 비교 (IRS 1040 1쪽, 포인트 단위 영역 → 각 해상도)
X0, Y0, X1, Y1 = 30, 276, 330, 300  # pt
def crop(path, dpi, label, width=1180):
    im = Image.open(path)
    s = dpi / 72
    c = im.crop((round(X0 * s), round(Y0 * s), round(X1 * s), round(Y1 * s)))
    c = c.resize((width, round(width * (Y1 - Y0) / (X1 - X0))), Image.LANCZOS)
    lab = Image.new('RGB', (width, 40), 'white'); ImageDraw.Draw(lab).text((6, 6), label, font=FONT_S, fill=INK)
    out = Image.new('RGB', (width, c.height + 40), 'white'); out.paste(lab, (0, 0)); out.paste(c, (0, 40)); return out
O = W / 'out'
parts = [crop(O / 'gs-default/irs-1040/p-1.jpg', 72, 'Ghostscript default: 72 DPI, no anti-aliasing'),
         crop(O / 'magick-default/irs-1040/p-0.jpg', 72, 'ImageMagick default: 72 DPI'),
         crop(O / 'pdftoppm-default/irs-1040/p-1.jpg', 150, 'pdftoppm default: 150 DPI'),
         crop(O / 'pdftoppm-300/irs-1040/p-1.jpg', 300, 'pdftoppm -r 300: 300 DPI')]
im = Image.new('RGB', (1200, sum(p.height + 14 for p in parts) + 6), 'white')
yy = 6
for p in parts:
    im.paste(p, (10, yy)); yy += p.height + 14
save_img(im, 'irs-1040-fine-print-by-dpi')

# 4) ImageMagick 투명 배경 → 검은색
a = Image.open(O / 'magick-default/mixed/p-0.jpg').resize((560, 725), Image.LANCZOS)
b = Image.open(O / 'magick-300-flat/mixed/p-0.jpg').resize((560, 725), Image.LANCZOS)
im = Image.new('RGB', (1200, 800), 'white'); dr = ImageDraw.Draw(im)
im.paste(a, (25, 60)); im.paste(b, (615, 60))
dr.text((25, 12), 'magick in.pdf out.jpg', font=FONT, fill=BAD)
dr.text((615, 12), '+ -background white -alpha remove', font=FONT, fill=GOOD)
for x in (25, 615): dr.rectangle((x - 1, 59, x + 560, 785), outline='#bbb')
save_img(im, 'imagemagick-pdf-black-background')

# 5) LibreOffice 글꼴 대체 (같은 영역, 300 DPI 비교)
def crop2(path, label):
    c = Image.open(path).crop((0, 1130, 1400, 1250)).resize((1180, 101), Image.LANCZOS)
    out = Image.new('RGB', (1180, 141), 'white'); ImageDraw.Draw(out).text((6, 6), label, font=FONT_S, fill=INK); out.paste(c, (0, 40)); return out
p1 = crop2(O / 'pdftoppm-300/irs-1040/p-1.jpg', 'pdftoppm (uses the fonts embedded in the PDF)')
p2 = crop2(O / 'libreoffice-2550/irs-1040/irs-1040.jpg', 'LibreOffice Draw export (substitutes fonts: "Digital Assets" runs into the text)')
im = Image.new('RGB', (1200, p1.height + p2.height + 30), 'white'); im.paste(p1, (10, 8)); im.paste(p2, (10, p1.height + 22))
save_img(im, 'libreoffice-pdf-font-substitution')

# 6) 스크린샷
save_img(Image.open(W / 'viz/gimp-import.png'), 'gimp-import-pdf-300-dpi')
save_img(Image.open(W / 'viz/lo-jpeg-options.png'), 'libreoffice-draw-jpeg-options')
