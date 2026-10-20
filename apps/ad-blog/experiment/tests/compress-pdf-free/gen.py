"""압축 테스트용 PDF 4개 생성 (내용·정답 텍스트를 직접 알 수 있게 모두 직접 만든 문서).

사용: /tmp/pv/bin/python -I gen.py PHOTO_DIR OUT_DIR
- photo-brochure.pdf : 원본 카메라 JPEG 8장(재인코딩 없이 그대로 삽입) + 캡션 + 링크
- scanned-letter.pdf : 300dpi 컬러 JPEG(q92)로 만든 '스캔' 6쪽, 텍스트 층 없음
- text-report.pdf    : 글꼴을 포함한 텍스트 20쪽 + 벡터 차트 3개 + 링크
- slides-screens.pdf : 1920x1080 PNG(무손실) 화면 12장 (작은 글자 포함)
"""
import json
import random
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont
from reportlab import rl_config
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter, landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

rl_config.useA85 = 0  # 기본값은 이미지를 ASCII85로 한 번 더 감쌈(+25%, 실제 앱 PDF와 다름) → 끔
PHOTOS, OUT = Path(sys.argv[1]), Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)
FD = '/usr/share/fonts/truetype/dejavu/'
pdfmetrics.registerFont(TTFont('Sans', FD + 'DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('Serif', FD + 'DejaVuSerif.ttf'))
rng = random.Random(7)

WORDS = ('account balance budget invoice schedule meeting project review summary quarter report office '
         'customer service payment delivery address contract policy update window system printer network '
         'storage backup folder document signature request approval monthly weekly travel expense receipt '
         'total amount number reference section figure table result change version support').split()


def sentence(n):
    w = [rng.choice(WORDS) for _ in range(n)]
    return ' '.join(w).capitalize() + '.'


truth = {}

# 1. 사진 안내서
c = canvas.Canvas(str(OUT / 'photo-brochure.pdf'), pagesize=letter)
W, H = letter
words = []
for i in range(1, 9):
    p = PHOTOS / f'{i:02d}.jpg'
    with Image.open(p) as im:
        iw, ih = im.size
    bw = W - 72
    bh = bw * ih / iw
    c.setFont('Sans', 20)
    title = f'Listing photo {i}'
    c.drawString(36, H - 60, title)
    c.drawImage(str(p), 36, H - 90 - bh, bw, bh)
    c.setFont('Serif', 11)
    y = H - 110 - bh
    for _ in range(6):
        s = sentence(12)
        c.drawString(36, y, s)
        words += s.lower().replace('.', '').split()
        y -= 16
    c.setFillColor(HexColor('#1a56db'))
    c.drawString(36, y - 6, 'tool-proof.com')
    c.linkURL('https://tool-proof.com/', (36, y - 10, 140, y + 6))
    c.setFillColor(HexColor('#000000'))
    words += title.lower().split()
    c.showPage()
c.save()
truth['photo-brochure'] = words

# 2. 스캔 편지 (텍스트를 이미지로 그린 뒤 약간 기울이고 노이즈·종이색 추가)
pages, words = [], []
font = ImageFont.truetype(FD + 'DejaVuSerif.ttf', 42)  # 300dpi에서 약 10pt
for pg in range(6):
    im = Image.new('RGB', (2550, 3300), (250, 248, 240))
    d = ImageDraw.Draw(im)
    y = 260
    for _ in range(38):
        s = sentence(9)
        d.text((220, y), s, font=font, fill=(25, 25, 30))
        words += s.lower().replace('.', '').split()
        y += 72
    im = im.rotate(0.4, resample=Image.BICUBIC, fillcolor=(250, 248, 240))
    noise = Image.effect_noise(im.size, 10).convert('L')
    im = Image.blend(im, Image.merge('RGB', (noise,) * 3), 0.06).filter(ImageFilter.GaussianBlur(0.6))
    f = OUT / f'_scan{pg}.jpg'
    im.save(f, quality=92, dpi=(300, 300))
    pages.append(f)
c = canvas.Canvas(str(OUT / 'scanned-letter.pdf'), pagesize=letter)
for f in pages:
    c.drawImage(str(f), 0, 0, W, H)
    c.showPage()
c.save()
for f in pages:
    f.unlink()
truth['scanned-letter'] = words

# 3. 텍스트 보고서
c = canvas.Canvas(str(OUT / 'text-report.pdf'), pagesize=letter)
words = []
for pg in range(20):
    c.setFont('Sans', 16)
    c.drawString(54, H - 60, f'Section {pg + 1}')
    c.setFont('Serif', 10.5)
    y = H - 90
    lines = 28 if pg % 7 == 3 else 46
    for _ in range(lines):
        s = sentence(13)
        c.drawString(54, y, s)
        words += s.lower().replace('.', '').split()
        y -= 14
    if pg % 7 == 3:  # 벡터 막대 차트
        for k in range(8):
            h = rng.randint(30, 220)
            c.setFillColor(HexColor(['#2563eb', '#16a34a', '#d97706', '#dc2626'][k % 4]))
            c.rect(80 + k * 55, 60, 38, h, fill=1, stroke=0)
        c.setFillColor(HexColor('#000000'))
    c.setFont('Sans', 9)
    c.drawString(54, 30, 'Source: tool-proof.com')
    c.linkURL('https://tool-proof.com/', (54, 26, 170, 40))
    c.showPage()
c.save()
truth['text-report'] = words

# 4. 화면 캡처 슬라이드 (PNG, 작은 글자 포함)
c = canvas.Canvas(str(OUT / 'slides-screens.pdf'), pagesize=landscape(letter))
LW, LH = landscape(letter)
words = []
small = ImageFont.truetype(FD + 'DejaVuSans.ttf', 18)
big = ImageFont.truetype(FD + 'DejaVuSans-Bold.ttf', 44)
for pg in range(12):
    im = Image.new('RGB', (1920, 1080), (255, 255, 255))
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, 1920, 90), fill=(30, 64, 175))
    t = f'Quarterly update {pg + 1}'
    d.text((60, 18), t, font=big, fill=(255, 255, 255))
    words += t.lower().split()
    d.rectangle((60, 140, 920, 1020), fill=(241, 245, 249))
    y = 170
    for _ in range(24):
        s = sentence(7)
        d.text((90, y), s, font=small, fill=(15, 23, 42))
        words += s.lower().replace('.', '').split()
        y += 34
    for k in range(10):  # 단색 막대 차트
        h = rng.randint(80, 700)
        d.rectangle((1000 + k * 85, 1000 - h, 1060 + k * 85, 1000), fill=[(37, 99, 235), (22, 163, 74), (217, 119, 6)][k % 3])
    f = OUT / f'_slide{pg}.png'
    im.save(f)
    c.drawImage(str(f), 0, (LH - LW * 9 / 16) / 2, LW, LW * 9 / 16)  # 16:9 비율 유지
    c.showPage()
    f.unlink()
c.save()
truth['slides-screens'] = words

json.dump(truth, open(OUT / 'truth.json', 'w'))
for k in truth:
    print(k, (OUT / f'{k}.pdf').stat().st_size)
