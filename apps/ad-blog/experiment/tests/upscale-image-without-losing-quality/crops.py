"""확대 비교 그림: 같은 부분을 원본·보통 확대·도구별 결과로 나란히 (화소를 늘리지 않고 그대로 자름)
실행: /tmp/meas/bin/python -I crops.py /tmp/upscale <출력 폴더>
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402

ROOT, OUT = Path(sys.argv[1]), Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)
INTER = '/usr/share/fonts/opentype/inter/Inter-{}.otf'


def font(w, s):
    return ImageFont.truetype(INTER.format(w), s)


def load(p):
    im = Image.open(p)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
        im = Image.alpha_composite(bg, im)
    return im.convert('RGB')


def panel_set(name, scale, box, tools):
    """[(라벨, 이미지)] — box는 정답 1600x1200 좌표"""
    gt = load(ROOT / 'gt' / f'{name}.png')
    src = load(ROOT / ('in2' if scale == 2 else 'in') / f'{name}.png')
    out = [('Original', gt.crop(box)), ('Normal resize', src.resize(gt.size, Image.BICUBIC).crop(box))]
    for key, label in tools:
        f = next((ROOT / f'out{scale}' / key).glob(f'{name}.*'))
        out.append((label, load(f).crop(box)))
    return out


def grid(path, title, subtitle, rows, zoom, note):
    """rows: [(행 이름, [(라벨, 이미지)])]"""
    pw, ph = rows[0][1][0][1].size
    pw, ph = int(pw * zoom), int(ph * zoom)
    n = len(rows[0][1])
    gap, left, top = 16, 30, 140
    W = left * 2 + n * pw + (n - 1) * gap
    H = top + len(rows) * (ph + 50) + 28 * sum(1 for r in rows if r[0]) + 70
    c = Image.new('RGB', (W, H), cs.BACKGROUND)
    d = ImageDraw.Draw(c)
    d.text((left, 28), title, font=font('Bold', 30), fill=cs.FOREGROUND)
    d.text((left, 74), subtitle, font=font('Regular', 19), fill=cs.MUTED)
    y = top
    for rname, panels in rows:
        if rname:
            d.text((left, y - 2), rname, font=font('SemiBold', 18), fill=cs.MUTED)
            y += 28
        for i, (label, im) in enumerate(panels):
            x = left + i * (pw + gap)
            c.paste(im.resize((pw, ph), Image.NEAREST), (x, y))
            d.text((x, y + ph + 8), label, font=font('SemiBold', 18), fill=cs.ACCENT if label == 'Original' else cs.FOREGROUND)
        y += ph + 50
    d.line((left, H - 52, W - left, H - 52), fill=cs.BORDER, width=1)
    d.text((left, H - 38), note, font=font('Regular', 15), fill=cs.MUTED)
    d.text((W - left, H - 40), cs.SITE_NAME, font=font('Bold', 18), fill=cs.FOREGROUND, anchor='ra')
    c.save(path, 'WEBP', quality=92)
    print(path, c.size)


T2 = [('bigjpg', 'Bigjpg'), ('iloveimg', 'iLoveIMG'), ('imgupscaler', 'Img.Upscaler')]
T4 = [('bigjpg', 'Bigjpg'), ('imgupscaler', 'Img.Upscaler')]

if __name__ == '__main__':
    mode = sys.argv[3] if len(sys.argv) > 3 else 'all'
    # 글자: 주문 번호·배송 날짜 줄 (4배). 줄 전체가 보이게 결과마다 한 줄씩 세로로
    text_box = (70, 645, 760, 705)
    ps = panel_set('text', 4, text_box, T4)
    grid(OUT / 'upscale-small-text-4x.webp', 'Small text enlarged 4x: one tool rewrote the date',
         'The smallest line of an order screenshot, cut from each 1600 x 1200 result and shown at 2x.',
         [(label, [('', im)]) for label, im in ps], 2.0,
         'Input: 400 x 300 PNG made from the original. Normal resize = bicubic. Tested November 15, 2026, no sign-in.')
    # 얼굴: 옛 흑백 인물 사진 눈 부분 (2배, 세 도구)
    face_box = (600, 560, 1120, 820)
    grid(OUT / 'upscale-old-portrait-2x.webp', 'An old portrait enlarged 2x',
         'Eyes of a public-domain black-and-white photo, cut from each 1600 x 1200 result.',
         [('', panel_set('portrait', 2, face_box, T2))], 0.6,
         'Input: 800 x 600 PNG made from the original. Normal resize = bicubic. Tested November 15, 2026, no sign-in.')
    # 얼굴 4배 (iLoveIMG는 무료 4x 없음)
    grid(OUT / 'upscale-old-portrait-4x.webp', 'The same portrait enlarged 4x: what the AI added',
         'iLoveIMG is missing because its free tier only offers 2x.',
         [('', panel_set('portrait', 4, face_box, T4))], 0.75,
         'Input: 400 x 300 PNG made from the original. Normal resize = bicubic. Tested November 15, 2026, no sign-in.')
    # 간판 글자 (4배)
    sign_box = (620, 330, 1100, 690)
    grid(OUT / 'upscale-street-sign-4x.webp', 'A street sign enlarged 4x',
         'Letters and peeling paint on a sign, cut from each 1600 x 1200 result.',
         [('', panel_set('sign', 4, sign_box, T4))], 0.8,
         'Input: 400 x 300 PNG made from the original. Normal resize = bicubic. Tested November 15, 2026, no sign-in.')
