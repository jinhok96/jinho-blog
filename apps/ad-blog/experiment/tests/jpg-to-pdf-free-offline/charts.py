"""summary.json·결과 PDF·스크린샷 → 글 이미지(webp)."""
import json, os, sys, subprocess, glob, tempfile
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw, ImageFont, ImageOps

W = '/tmp/j2p'
OUT = sys.argv[1]
S = json.load(open(f'{W}/summary.json'))
C = S['configs']
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 13})
FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 26)
GOOD, BAD, NEUTRAL = '#2a9d8f', '#d1495b', '#e9a03b'


def save_fig(fig, name):
    p = f'{W}/{name}.png'
    fig.savefig(p, dpi=100)
    plt.close(fig)
    Image.open(p).convert('RGB').save(f'{OUT}/{name}.webp', quality=88, method=6)


def save_img(im, name, q=86):
    im.convert('RGB').save(f'{OUT}/{name}.webp', quality=q, method=6)


ROWS = [('img2pdf', 'img2pdf 0.6.3'), ('chromium', 'Chromium 141\n(print to PDF)'),
        ('imagemagick', 'ImageMagick 7.1.2\n(default)'), ('pillow', 'Pillow 12.3\n(Python, default)'),
        ('libreoffice', 'LibreOffice 26.8\n(default export)')]

# 1) 대표 그래프: PDF 크기 + 화질 + 세로 사진 방향
fig, (a1, a2) = plt.subplots(1, 2, figsize=(12, 6.75), gridspec_kw={'width_ratios': [1.15, 1]})
y = list(range(len(ROWS)))[::-1]
inmb = S['input_bytes'] / 1e6
mb = [C[k]['bytes'] / 1e6 for k, _ in ROWS]
cols = [GOOD if C[k]['portrait_ok'] == 4 else BAD for k, _ in ROWS]
a1.barh(y, mb, color=cols)
a1.axvline(inmb, color='#555', ls='--', lw=1.2)
a1.text(inmb + 2, 4.45, f'24 JPGs: {inmb:.1f} MB', color='#444', fontsize=11)
for yi, v, (k, _) in zip(y, mb, ROWS):
    a1.text(v + 2, yi, f'{v:.1f} MB', va='center', fontsize=12)
a1.set_yticks(y, [l for _, l in ROWS], fontsize=11.5)
a1.set_xlim(0, 175)
a1.set_xlabel('PDF size for 24 phone photos (MB)')
q = [C[k]['ssim2_median'] for k, _ in ROWS]
qmin = [C[k]['ssim2_min'] for k, _ in ROWS]
a2.barh(y, q, color=cols)
a2.scatter([m for m, (k, _) in zip(qmin, ROWS) if C[k]['identical'] < 24], [yi for yi, (k, _) in zip(y, ROWS) if C[k]['identical'] < 24], color='#222', zorder=5, s=30, label='worst photo')
for yi, v, (k, _) in zip(y, q, ROWS):
    if C[k]['identical'] == 24:
        a2.text(3, yi, 'identical pixels', va='center', ha='left', color='white', fontsize=12, fontweight='bold')
    elif C[k]['ssim2_min'] < 50:
        a2.text(v + 1.5, yi, f"median {v:.0f}\nworst {C[k]['ssim2_min']:.0f}", va='center', ha='left', color='#222', fontsize=11.5)
    else:
        a2.text(3, yi, f"median {v:.0f}, worst {C[k]['ssim2_min']:.0f}", va='center', ha='left', color='white', fontsize=12, fontweight='bold')
a2.set_yticks(y, [''] * len(y))
a2.set_xlim(0, 100)
a2.set_xlabel('Image quality vs original (SSIMULACRA2, median)')
a2.axvline(90, color='#999', ls=':', lw=1)
a2.legend(loc='lower right', bbox_to_anchor=(1, -0.02), fontsize=10, frameon=False)
fig.suptitle('JPG to PDF: which tools keep your photos untouched?\n24 phone photos (12 MP), green = portrait photos upright, red = portrait photos sideways', fontsize=14)
fig.tight_layout(rect=(0, 0, 1, 0.93))
save_fig(fig, 'jpg-to-pdf-size-quality-chart')

# 2) 세로 사진(21번) 방향: 도구별 PDF 첫 화면
def render(pdf, page):
    with tempfile.TemporaryDirectory() as d:
        subprocess.run(['pdftoppm', '-f', str(page), '-l', str(page), '-scale-to', '420', '-png', pdf, f'{d}/r'], check=True)
        return Image.open(glob.glob(f'{d}/r*.png')[0]).convert('RGB')
cells = [(f'{W}/out/img2pdf.pdf', 21, 'img2pdf', True), (f'{W}/out/chromium/21.pdf', 1, 'Chromium', True),
         (f'{W}/out/imagemagick.pdf', 21, 'ImageMagick', False), (f'{W}/out/pillow.pdf', 21, 'Pillow', False),
         (f'{W}/out/libreoffice/21.pdf', 1, 'LibreOffice', False)]
cw, ch = 300, 400
canvas = Image.new('RGB', (len(cells) * (cw + 20) + 20, ch + 110), '#eef1f4')
d = ImageDraw.Draw(canvas)
for i, (pdf, p, lab, ok) in enumerate(cells):
    im = render(pdf, p)
    im.thumbnail((cw, ch))
    x = 20 + i * (cw + 20)
    canvas.paste(im, (x + (cw - im.width) // 2, 20 + (ch - im.height) // 2))
    d.rectangle([x + (cw - im.width) // 2 - 1, 20 + (ch - im.height) // 2 - 1, x + (cw + im.width) // 2, 20 + (ch + im.height) // 2], outline='#999')
    d.text((x + cw // 2, ch + 45), lab, font=FONT, fill='#222', anchor='mm')
    d.text((x + cw // 2, ch + 82), 'upright' if ok else 'sideways', font=FONT, fill=GOOD if ok else BAD, anchor='mm')
save_img(canvas, 'jpg-to-pdf-portrait-orientation')

# 3) 확대 비교: 18번(눈 덮인 숲) 같은 영역 100%
o = Image.open(f'{W}/in/18.jpg').convert('RGB')
box = (1700, 1200, 2100, 1500)
def emb(pdf, page):
    with tempfile.TemporaryDirectory() as dd:
        subprocess.run(['pdfimages', '-f', str(page), '-l', str(page), '-j', pdf, f'{dd}/x'], check=True)
        f = sorted(glob.glob(f'{dd}/x-*'))[0]
        im = Image.open(f).convert('RGB'); im.load(); return im
R18 = {r['config']: r['ssimulacra2'] for r in [json.loads(l) for l in open(f'{W}/results.jsonl')] if r['n'] == 18}
parts = [('Original JPG', o, 'photo 18, 100% crop'),
         ('ImageMagick', emb(f'{W}/out/imagemagick.pdf', 18), f"re-encoded, score {R18['imagemagick']:.0f}"),
         ('Pillow', emb(f'{W}/out/pillow.pdf', 18), f"quality 75, score {R18['pillow']:.0f}"),
         ('LibreOffice', emb(f'{W}/out/libreoffice/18.pdf', 1), f"2244 px wide, score {R18['libreoffice']:.0f}")]
tw = 380
canvas = Image.new('RGB', (len(parts) * (tw + 16) + 16, 285 + 100), '#eef1f4')
d = ImageDraw.Draw(canvas)
for i, (lab, im, sub) in enumerate(parts):
    if im.size != o.size:
        sx = im.width / o.width
        crop = im.crop(tuple(round(v * sx) for v in box)).resize((box[2] - box[0], box[3] - box[1]), Image.LANCZOS)
    else:
        crop = im.crop(box)
    crop = crop.resize((tw, round(tw * 300 / 400)), Image.LANCZOS)
    x = 16 + i * (tw + 16)
    canvas.paste(crop, (x, 16))
    d.text((x + tw // 2, 16 + crop.height + 30), lab, font=FONT, fill='#222', anchor='mm')
    d.text((x + tw // 2, 16 + crop.height + 66), sub, font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 22), fill='#555', anchor='mm')
save_img(canvas, 'jpg-to-pdf-quality-zoom-comparison', q=92)

# 4) LibreOffice 스크린샷 (Xvfb에서 직접 캡처)
save_img(Image.open(f'{W}/shot_pdfdlg.png').crop((280, 240, 1220, 715)), 'libreoffice-export-pdf-image-settings')
save_img(Image.open(f'{W}/shot_draw_sideways.png').crop((0, 0, 1130, 950)).resize((904, 760), Image.LANCZOS), 'libreoffice-draw-portrait-photo-sideways')

# 5) 시간·메모리
rows = [('img2pdf', 'img2pdf'), ('pillow', 'Pillow'), ('chromium', 'Chromium print*'), ('libreoffice', 'LibreOffice*'), ('imagemagick', 'ImageMagick')]
fig, ax = plt.subplots(figsize=(12, 4.6))
yy = list(range(len(rows)))[::-1]
v = [C[k]['sec_median'] for k, _ in rows]
ax.barh(yy, v, color='#1b6ca8')
for yi, s, (k, _) in zip(yy, v, rows):
    mem = f", peak RAM {C[k]['max_rss_mb'] / 1024:.1f} GB" if k == 'imagemagick' else (f", peak RAM {C[k]['max_rss_mb']} MB" if k in ('img2pdf', 'pillow') else '')
    ax.text(s + 0.5, yi, f'{s:.1f} s{mem}', va='center', fontsize=12)
ax.set_yticks(yy, [l for _, l in rows])
ax.set_xlim(0, 52)
ax.set_xlabel('Seconds to convert 24 photos (median of 3 runs, 4-core CPU)')
ax.set_title('img2pdf finished in under a second because it copies the JPG data instead of re-encoding it\n* one PDF per photo, includes app start-up', fontsize=13)
fig.tight_layout()
save_fig(fig, 'jpg-to-pdf-speed-chart')
print(sorted(os.listdir(OUT)))
