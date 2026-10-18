# 입력 세트: convert-heic-to-jpg-free/sources.json의 CC0 사진(PD12M) 01~08 → /tmp/j2p/orig/NN.jpg (curl로 받음)
# 01~08: 4032x3024 가운데 자르기 → 품질 92·4:2:0·72 DPI JPEG (휴대폰 12MP 사진 크기)
# 09~10: 03·08의 세로 자르기(3024x4032). 픽셀은 가로로 눕혀 저장하고 EXIF Orientation=6 (휴대폰 세로 사진처럼)
# 기준 이미지(바로 선 모습)는 ref/NN.png
import struct, sys
from pathlib import Path
from PIL import Image, ImageOps

W = Path(sys.argv[1] if len(sys.argv) > 1 else '/tmp/j2p')
(W / 'in').mkdir(exist_ok=True); (W / 'ref').mkdir(exist_ok=True)

def exif_app1(orientation):
    tiff = b'MM\x00\x2a' + struct.pack('>I', 8) + struct.pack('>H', 1)
    tiff += struct.pack('>HHIHH', 0x0112, 3, 1, orientation, 0) + struct.pack('>I', 0)
    body = b'Exif\x00\x00' + tiff
    return b'\xff\xe1' + struct.pack('>H', len(body) + 2) + body

def save_jpeg(img, path):
    img.save(path, 'JPEG', quality=92, subsampling=2, dpi=(72, 72))

for n in range(1, 9):
    im = ImageOps.exif_transpose(Image.open(W / f'orig/{n:02d}.jpg')).convert('RGB')
    im = ImageOps.fit(im, (4032, 3024), Image.LANCZOS)
    im.save(W / f'ref/{n:02d}.png'); save_jpeg(im, W / f'in/{n:02d}.jpg')

for k, n in ((9, 3), (10, 8)):
    src = Image.open(W / f'ref/{n:02d}.png')
    up = ImageOps.fit(src.crop((882, 0, 3150, 3024)), (3024, 4032), Image.LANCZOS)
    up.save(W / f'ref/{k:02d}.png')
    p = W / f'in/{k:02d}.jpg'
    save_jpeg(up.transpose(Image.ROTATE_90), p)   # 저장 픽셀은 반시계 90° → Orientation 6(시계 90°)으로 바로 섬
    data = p.read_bytes(); p.write_bytes(data[:2] + exif_app1(6) + data[2:])
    assert ImageOps.exif_transpose(Image.open(p)).size == (3024, 4032)
