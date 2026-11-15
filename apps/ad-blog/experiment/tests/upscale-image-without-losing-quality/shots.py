"""화면 캡처(screens/*.webp, 측정 때 찍은 png를 줄여 보관) → 글 그림: 필요한 부분만 자르고 클릭·확인 위치에 accent 상자
실행: /tmp/meas/bin/python -I shots.py <출력 폴더>
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402

HERE = Path(__file__).parent
OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)


def shot(src, crop, boxes, name, width=1200):
    im = Image.open(HERE / 'screens' / src).convert('RGB').crop(crop)
    d = ImageDraw.Draw(im)
    for b in boxes:  # 원본 좌표 → 자른 좌표
        x0, y0, x1, y1 = b
        d.rounded_rectangle((x0 - crop[0], y0 - crop[1], x1 - crop[0], y1 - crop[1]), radius=8, outline=cs.ACCENT, width=4)
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(OUT / name, 'WEBP', quality=90)
    print(OUT / name, im.size)


# Pixelcut: 로그인 없이 Download를 누르면 미리보기(1080x810)만 Free, 원래 크기는 로그인 필요
shot('pixelcut2-cat-menu.webp', (283, 0, 1366, 760), [(968, 62, 1212, 172)], 'pixelcut-download-preview-only.webp')
# Bigjpg 설정 창: Photo, 4x (8x·16x는 업그레이드), 노이즈 제거 None
shot('bigjpg4-cat-dialog2.webp', (433, 28, 933, 575), [(570, 180, 830, 222)], 'bigjpg-settings-photo-4x.webp')
# iLoveIMG: 몇 장 뒤 나온 Upgrade to Premium 창 (뒤로 4x가 회색인 옵션 패널)
shot('iloveimg-forest-fail.webp', (0, 60, 1366, 900), [(308, 160, 1058, 290)], 'iloveimg-upscale-premium-popup.webp')
