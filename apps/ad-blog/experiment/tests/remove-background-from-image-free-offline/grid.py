"""cut/*.png → 체커보드 위 합성 비교 그리드 (webp)."""
import sys
from PIL import Image, ImageDraw, ImageFont
OUT = sys.argv[1]; key = sys.argv[2]; models = sys.argv[3].split(','); labels = sys.argv[4].split(','); dst = sys.argv[5]
cols = int(sys.argv[6]) if len(sys.argv) > 6 else 3
FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 30)
def checker(w, h, s=16):
    im = Image.new('RGB', (w, h), (255, 255, 255)); dr = ImageDraw.Draw(im)
    for y in range(0, h, s):
        for x in range(0, w, s):
            if (x // s + y // s) % 2: dr.rectangle([x, y, x + s - 1, y + s - 1], fill=(214, 214, 214))
    return im
tiles = []
for m, lab in zip(['orig'] + models, labels):
    src = Image.open(f'{OUT}/cut/{key}.png' if m == 'orig' else f'{OUT}/cut/{key}.{m}.png').convert('RGBA')
    bg = checker(*src.size).convert('RGBA'); bg.alpha_composite(src); tiles.append((bg.convert('RGB'), lab))
tw = 400; th = int(tiles[0][0].height * tw / tiles[0][0].width); pad = 16; lh = 48
rows = (len(tiles) + cols - 1) // cols
W = cols * tw + (cols + 1) * pad; H = rows * (th + lh) + (rows + 1) * pad
canvas = Image.new('RGB', (W, H), (252, 252, 251)); dr = ImageDraw.Draw(canvas)
for i, (im, lab) in enumerate(tiles):
    r, c = divmod(i, cols); x = pad + c * (tw + pad); y = pad + r * (th + lh + pad)
    canvas.paste(im.resize((tw, th), Image.LANCZOS), (x, y + lh))
    dr.text((x, y + 8), lab, font=FONT, fill=(11, 11, 11))
canvas.save(dst, 'WEBP', quality=88); print(dst, canvas.size)
