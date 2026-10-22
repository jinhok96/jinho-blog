"""Chrome 156 화면 캡처(같은 폴더의 PNG 원본) → 글 이미지 webp (잘라내기 + accent 상자).

원본: shoot 스크립트(capture.py)로 2026-10-21(UTC) Xvfb에서 찍은 PNG.
실행: python3 -I screens.py <출력 폴더>
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402

HERE = Path(__file__).resolve().parent
OUT = Path(sys.argv[1] if len(sys.argv) > 1 else 'img')


def out(img, name, boxes=()):
    d = ImageDraw.Draw(img)
    for b in boxes:
        d.rounded_rectangle(b, radius=8, outline=cs.ACCENT, width=4)
    img.convert('RGB').save(OUT / name, 'WEBP', quality=88)
    print(OUT / name, img.size)


# 1) HTTP 경고 창 (주소창 포함)
im = Image.open(HERE / 'e1_warning.png').crop((0, 0, 1200, 470))
out(im, 'chrome-http-warning-dialog.webp', [(352, 98, 848, 336)])

# 2) 설정: Always use secure connections 켜짐 + 두 옵션
im = Image.open(HERE / 'second_settings.png').crop((0, 130, 1200, 680))
out(im, 'chrome-always-use-secure-connections-setting.webp', [(340, 325, 1006, 528)])

# 3) Enhanced protection 펼친 설명
im = Image.open(HERE / 'f1_enhanced.png').crop((0, 220, 1200, 690))
out(im, 'chrome-enhanced-protection-details.webp')
