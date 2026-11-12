"""results/scores.json·결과 PDF·화면 캡처 → 글 이미지(webp, 디자인 시스템 라이트 모드)

사용: /tmp/meas/bin/python -I charts.py <작업 폴더 /tmp/dl> <이미지 출력 폴더>
  작업 폴더: testpdf/(원본), out/(결과 PDF), shots/(화면 캡처 png)
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
HERE = Path(__file__).parent
SCORES = json.loads((HERE / 'results/scores.json').read_text())
TRUTH = json.loads((HERE / 'truth.json').read_text())
INTER = '/usr/share/fonts/opentype/inter/Inter-{}.otf'


def font(weight, size):
    return ImageFont.truetype(INTER.format(weight), size)


def weighted(tool, kinds):
    """정답 단어 수로 가중한 단어 비율 (%)"""
    s = SCORES[f'{tool}__scanned-8-pages.pdf']
    n = {t['page']: len(t['text'].split()) for t in TRUTH if t['pdf'] == 'scanned-8-pages.pdf'}
    rows = [p for p in s['by_page'] if p['kind'] in kinds]
    return 100 * sum(p['word_recall'] * n[p['page']] for p in rows) / sum(n[p['page']] for p in rows)


def mb(b):
    return f'{b / 1e6:.1f} MB'


# 1) 결과 표 그래픽
TOOLS = [
    ('naps2-fast', 'NAPS2 8.6.0', 'Desktop app, offline'),
    ('pdf24', 'PDF24 Tools', 'Website'),
    ('ilovepdf', 'iLovePDF', 'Website, no sign-in'),
    ('sejda', 'Sejda', 'Website, 10-page free limit'),
]
PAGE_IMG = {'naps2-fast': 'Kept 300 ppi', 'pdf24': 'Kept 300 ppi, straightened', 'ilovepdf': 'Cut to 150 ppi', 'sejda': 'Untouched'}
REAL_TEXT = {'naps2-fast': 'Left alone', 'pdf24': 'Left alone', 'ilovepdf': 'Turned into images', 'sejda': 'Left alone'}
cols = [('Scanned pages', 'text'), ('8-pt fine print', 'small'), ('Table numbers', 'table'), ('Phone photo', 'photo'),
        ('Page images', None), ('Pages with real text', None), ('File size', None)]
cw = [240, 150, 140, 140, 130, 250, 200, 100]
canvas = Image.new('RGB', (sum(cw) + 60, 640), cs.BACKGROUND)
d = ImageDraw.Draw(canvas)
d.text((30, 28), 'Making a scanned PDF searchable: four free tools, same files', font=font('Bold', 30), fill=cs.FOREGROUND)
d.text((30, 72), 'Share of the real words each result let you search (Chrome\'s PDF engine), plus what happened to the pages.',
       font=font('Regular', 19), fill=cs.MUTED)
y0 = 140
x = 30
heads = ['Tool'] + [c[0] for c in cols]
for w, h in zip(cw, heads):
    d.text((x, y0), h, font=font('SemiBold', 17), fill=cs.MUTED)
    x += w
d.line((30, y0 + 34, sum(cw) + 30, y0 + 34), fill=cs.BORDER, width=2)
y = y0 + 52
best = {}
for _, kind in cols[:4]:
    best[kind] = max(weighted(t, {kind}) for t, *_ in TOOLS)
for tool, name, where in TOOLS:
    s = SCORES[f'{tool}__scanned-8-pages.pdf']
    x = 30
    d.text((x, y), name, font=font('Bold', 21), fill=cs.FOREGROUND)
    d.text((x, y + 30), where, font=font('Regular', 16), fill=cs.MUTED)
    x += cw[0]
    for (label, kind), w in zip(cols[:4], cw[1:5]):
        v = weighted(tool, {kind})
        d.text((x, y + 8), f'{v:.1f}%', font=font('SemiBold', 22), fill=cs.ACCENT if v >= best[kind] - 0.05 else cs.FOREGROUND)
        x += w
    bad_img = tool == 'ilovepdf'
    d.text((x, y + 10), PAGE_IMG[tool], font=font('SemiBold', 17), fill=cs.FOREGROUND)
    x += cw[5]
    d.text((x, y + 10), REAL_TEXT[tool], font=font('SemiBold', 17), fill=cs.FOREGROUND)
    if bad_img:
        d.text((x, y + 34), 'and its link removed', font=font('Regular', 15), fill=cs.MUTED)
    x += cw[6]
    d.text((x, y + 10), mb(s['bytes']), font=font('SemiBold', 17), fill=cs.FOREGROUND)
    y += 92
    d.line((30, y - 20, sum(cw) + 30, y - 20), fill=cs.BORDER, width=1)
d.text((30, y + 4), 'Original: 8-page scan, 300 ppi grayscale, 7.3 MB (5 text pages, a statement table, 8-pt print, a phone photo of a page).',
       font=font('Regular', 16), fill=cs.MUTED)
d.text((30, y + 30), 'Sejda added the text layer twice on pages 1 to 5, so Chrome counts each match there twice. Tested November 12, 2026.',
       font=font('Regular', 16), fill=cs.MUTED)
d.text((canvas.width - 30, canvas.height - 40), cs.SITE_NAME, font=font('Bold', 20), fill=cs.FOREGROUND, anchor='ra')
canvas.save(OUT / 'make-pdf-searchable-results.webp', 'WEBP', quality=90)
print(OUT / 'make-pdf-searchable-results.webp', canvas.size)


# 2) 확대 비교 (원래 글자 쪽·8pt 스캔)
def crop(pdf, page, box, dpi=200):
    with tempfile.TemporaryDirectory() as t:
        subprocess.run(['pdftoppm', '-r', str(dpi), '-f', str(page), '-l', str(page), '-png', str(pdf), t + '/p'], check=True)
        return Image.open(next(Path(t).glob('p-*'))).convert('RGB').crop(box)


def panel_grid(items, name, title, cols=2, tile=(560, 230)):
    pad, top, lab = 30, 110, 40
    rows = (len(items) + cols - 1) // cols
    cv = Image.new('RGB', (1200, top + rows * (tile[1] + lab + 20) + 60), cs.SURFACE)
    dd = ImageDraw.Draw(cv)
    dd.text((pad, 28), title[0], font=font('Bold', 30), fill=cs.FOREGROUND)
    dd.text((pad, 70), title[1], font=font('Regular', 19), fill=cs.MUTED)
    for k, (label, im, hi) in enumerate(items):
        xx = pad + (k % cols) * (tile[0] + 20)
        yy = top + (k // cols) * (tile[1] + lab + 20)
        dd.text((xx, yy + 6), label, font=font('SemiBold', 19), fill=cs.ACCENT if hi else cs.FOREGROUND)
        cv.paste(im.resize(tile, Image.LANCZOS), (xx, yy + lab))
        dd.rectangle([xx, yy + lab, xx + tile[0] - 1, yy + lab + tile[1] - 1], outline=cs.BORDER, width=2)
    dd.text((1200 - pad, cv.height - 40), cs.SITE_NAME, font=font('Bold', 20), fill=cs.FOREGROUND, anchor='ra')
    cv.save(OUT / f'{name}.webp', 'WEBP', quality=88)
    print(OUT / f'{name}.webp', cv.size)


IN, RES = W / 'testpdf', W / 'out'
# 원래 글자 쪽: 링크 줄(Source text: Project Gutenberg)이 있는 아래쪽, 300 dpi 1:1 화소. iLovePDF는 쪽 크기가 약 1.3% 작아져 같은 위치를 비율로 맞춤
box_digital = (300, 2130, 860, 2360)
s = 603.95 / 612
box_ilove = tuple(round(v * s) for v in box_digital)
box_small = (345, 450, 905, 680)
panel_grid([
    ('Original page with real text', crop(IN / 'mixed-3-pages.pdf', 1, box_digital, 300), False),
    ('After iLovePDF OCR: now a 150 ppi image', crop(RES / 'ilovepdf__mixed-3-pages.pdf', 1, box_ilove, 300), True),
    ('Original 8-pt scan (300 ppi)', crop(IN / 'scanned-8-pages.pdf', 7, box_small, 300), False),
    ('After iLovePDF OCR (150 ppi)', crop(RES / 'ilovepdf__scanned-8-pages.pdf', 7, tuple(round(v * s) for v in box_small), 300), True),
], 'ilovepdf-ocr-zoom-comparison', ('Zoomed in: what iLovePDF did to the pages', 'Same areas at 300 DPI, actual pixels. The blue link on the real-text page no longer works after OCR.'))


# 3) 화면 캡처 + accent 상자
def shot(src, name, boxes=(), crop_box=None):
    im = Image.open(W / 'shots' / src).convert('RGB')
    dd = ImageDraw.Draw(im)
    for b in boxes:
        dd.rounded_rectangle(b, radius=6, outline=cs.ACCENT, width=4)
    if crop_box:
        im = im.crop(crop_box)
    im.save(OUT / f'{name}.webp', 'WEBP', quality=86)
    print(OUT / f'{name}.webp', im.size)


shot('naps2-ocr-setup.png', 'naps2-make-pdfs-searchable-setting', [(632, 418, 880, 442), (198, 58, 258, 120), (330, 58, 412, 120)], (50, 30, 1552, 700))
shot('pdf24-scan-options.png', 'pdf24-ocr-pdf-options', [(412, 652, 850, 690), (483, 724, 783, 780)], (0, 110, 1280, 800))
shot('ilp-scan-options.png', 'ilovepdf-ocr-pdf-options', [(917, 376, 1260, 470), (917, 488, 1260, 602)], (300, 60, 1280, 1000))
shot('sejda-scan-options.png', 'sejda-recognize-text-all-pages', [(486, 815, 780, 846), (482, 940, 783, 980)], (0, 30, 1280, 1000))


# 4) Chrome PDF 보기 찾기: PDF24(1/1) vs Sejda(1/2)
a = Image.open(W / 'shots/viewer-pdf24-search.png').convert('RGB').crop((485, 80, 1450, 330))
b = Image.open(W / 'shots/viewer-sejda-search.png').convert('RGB').crop((485, 80, 1450, 330))
cv = Image.new('RGB', (1200, 110 + 2 * (a.height + 60) + 40), cs.SURFACE)
dd = ImageDraw.Draw(cv)
dd.text((30, 28), 'Searching the OCR result in Chrome\'s PDF viewer', font=font('Bold', 30), fill=cs.FOREGROUND)
dd.text((30, 70), 'The phrase "know Mr. Bingley" appears once in the document. Chromium 153, November 12, 2026.', font=font('Regular', 19), fill=cs.MUTED)
for k, (label, im) in enumerate([('PDF24 result: 1 of 1 match', a), ('Sejda result: 1 of 2 matches, because pages 1 to 5 got the text twice', b)]):
    yy = 110 + k * (im.height + 60)
    dd.text((30, yy + 6), label, font=font('SemiBold', 19), fill=cs.ACCENT if k == 0 else cs.FOREGROUND)
    cv.paste(im, (30, yy + 40))
    dd.rectangle([30, yy + 40, 30 + im.width - 1, yy + 40 + im.height - 1], outline=cs.BORDER, width=2)
dd.text((1170, cv.height - 36), cs.SITE_NAME, font=font('Bold', 20), fill=cs.FOREGROUND, anchor='ra')
cv.save(OUT / 'chrome-pdf-search-ocr-results.webp', 'WEBP', quality=88)
print(OUT / 'chrome-pdf-search-ocr-results.webp', cv.size)
