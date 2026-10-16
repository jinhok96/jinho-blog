#!/usr/bin/env python3
"""같은 프레임의 같은 영역을 설정별로 잘라 2배 확대해 한 장으로 붙임 (비교 이미지용)."""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
ROOT = Path("/tmp/v2g")
clip, frame, box, out = sys.argv[1], int(sys.argv[2]), tuple(map(int, sys.argv[3].split(","))), sys.argv[4]
names = sys.argv[5].split(",")
labels = sys.argv[6].split("|")
zoom = 2
tiles = []
for n in names:
    src = ROOT / "ref" / clip / f"{frame:03d}.png" if n == "original" else ROOT / "out" / clip / f"{n}.frames" / f"{frame:03d}.png"
    tiles.append(Image.open(src).convert("RGB").crop(box).resize(((box[2]-box[0])*zoom, (box[3]-box[1])*zoom), Image.NEAREST))
w, h = tiles[0].size
cols = int(sys.argv[7]) if len(sys.argv) > 7 else len(tiles)
rows = (len(tiles) + cols - 1) // cols
pad, lab = 12, 36
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
sheet = Image.new("RGB", (cols * w + (cols + 1) * pad, rows * (h + lab) + (rows + 1) * pad), "white")
d = ImageDraw.Draw(sheet)
for i, (t, l) in enumerate(zip(tiles, labels)):
    x = pad + (i % cols) * (w + pad); y = pad + (i // cols) * (h + lab + pad)
    d.text((x, y + 4), l, fill=(20, 24, 33), font=font)
    sheet.paste(t, (x, y + lab))
sheet.save(out)
print(out, sheet.size)
