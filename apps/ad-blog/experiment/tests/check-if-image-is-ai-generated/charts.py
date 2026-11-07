"""AI 이미지 판별 글 본문 그래픽: Inspect 캡처 3장(주석) + C2PA 편집 측정 결과 (1200×675 webp).

캡처 원본은 `screens/*.webp` (inspect_capture.js, Adobe Inspect beta·CAI Verify, Chromium 153.0.8010.12 headless,
1280×900, 2026-10-29 09:3x UTC). 올린 파일은 make_source.py로 다시 만든 AI 라벨(trainedAlgorithmicMedia) 테스트 이미지,
그 Chromium 스크린숏(픽셀 동일), ImageMagick 6.9.12-98 `-quality 85` 재저장본. 캡처 상단 Adobe 로고 헤더는 잘라 냄.
측정 결과 그래픽은 results.txt (2026-10-11).
실행: python3 -I charts.py <출력 폴더>
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch, Rectangle  # noqa: E402
from PIL import Image  # noqa: E402

HERE = Path(__file__).resolve().parent
SCREENS = HERE / 'screens'
OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'
BOXES = {k: v['boxes'] for k, v in json.loads((SCREENS / 'capture-notes.json').read_text())['inspect'].items()}
SHOT = 'Screenshots: Adobe Inspect (beta) in Chromium 153, October 29, 2026. Site header cropped out, boxes added by ToolProof.'
SHOT_BOTH = 'Screenshots: Adobe Inspect (beta) and CAI Verify in Chromium 153, October 29, 2026. Boxes added by ToolProof.'
TEST_IMAGE = 'Test file: our own image signed with a public C2PA test certificate and labeled as AI-generated (not a real AI image).'


def box(ax, x, y, w, h, fill, r=0.012):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle=f'round,pad=0,rounding_size={r}',
                                facecolor=fill, edgecolor=fill, lw=0, zorder=1))


def shot(fig, name, crop, rect, marks=()):
    """캡처를 crop(left, top, right, bottom)으로 잘라 rect(그림 좌표)에 넣고, marks(캡처 좌표 상자)에 accent 테두리"""
    img = Image.open(SCREENS / f'{name}.webp').convert('RGB').crop(crop)
    ax = fig.add_axes(rect)
    ax.imshow(img)
    ax.axis('off')
    ax.add_patch(Rectangle((0, 0), img.width - 1, img.height - 1, fill=False, edgecolor=cs.BORDER, lw=1))
    for x, y, w, h in marks:
        ax.add_patch(Rectangle((x - crop[0], y - crop[1]), w, h, fill=False, edgecolor=cs.ACCENT, lw=3, zorder=3))
    return img


def mark(name, line, pad=(10, 8), width=None):
    b = BOXES[name][line]
    return (b['x'] - pad[0], b['y'] - pad[1], (width or b['width']) + 2 * pad[0], b['height'] + 2 * pad[1])


def place(crop, left_px, top_px, height_px):
    """crop 비율을 지키며 높이 height_px로 놓을 rect (1200×675 기준 픽셀 → 그림 좌표)"""
    w = height_px * (crop[2] - crop[0]) / (crop[3] - crop[1])
    return [left_px / 1200, 1 - (top_px + height_px) / 675, w / 1200, height_px / 675], w


def place_scaled(crop, left_px, top_px, scale):
    """두 캡처를 같은 배율로 나란히 놓을 때: 높이 = crop 높이 × scale"""
    return place(crop, left_px, top_px, (crop[3] - crop[1]) * scale)


def original():
    """원본: How this was made·AI actions(Created with AI)·경고 1줄 → AI 라벨을 읽는 곳 표시"""
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Inspect shows the AI label when Content Credentials are intact',
              'Our AI-labeled test file in Adobe Inspect: the label sits under AI actions.')
    crop = (24, 64, 1262, 790)
    rect, w = place(crop, 36, 128, 470)
    b = BOXES['ai-labeled-original']['Created with AI']
    shot(fig, 'inspect-ai-labeled-original', crop, rect,
         marks=[(662, 372, 588, 76), (662, 532, 588, 34)])
    side_left = (36 + w + 28) / 1200
    side = fig.add_axes([side_left, 0.115, 0.97 - side_left, 0.7])
    side.set_xlim(0, 1)
    side.set_ylim(0, 1)
    side.axis('off')
    box(side, 0, 0, 1, 1, cs.SURFACE)
    notes = [
        ('Created with AI', 'The signer recorded that\nthe image was made\nwith an AI tool'),
        ('Unrecognized source', 'Inspect doesn\'t know the\nsigner. Ours used a\npublic test certificate'),
    ]
    y = 0.9
    for head, body in notes:
        side.text(0.09, y, head, fontsize=14, fontweight='bold', color=cs.ACCENT, va='top')
        side.text(0.09, y - 0.085, body, fontsize=12.5, va='top', linespacing=1.4)
        y -= 0.44
    assert b['y'] > 372 and b['y'] + b['height'] < 448, 'Created with AI 위치가 상자 밖'
    cs.footer(fig, SHOT, TEST_IMAGE)
    cs.save(fig, f'{OUT}/inspect-ai-label-original.webp')


def screenshot_vs_original():
    """같은 픽셀: 원본 파일 vs Chromium 스크린숏 → 스크린숏은 We couldn't verify how this was made"""
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'A screenshot of the same image lost its AI label',
              'Adobe Inspect results for our test file and a pixel-for-pixel identical screenshot of it.')
    crop_a = (640, 100, 1266, 585)
    crop_b = (640, 100, 1266, 560)
    top, scale = 150, 0.869
    rect_a, w_a = place_scaled(crop_a, 36, top, scale)
    rect_b, _ = place_scaled(crop_b, 36 + w_a + 40, top, scale)
    shot(fig, 'inspect-ai-labeled-original', crop_a, rect_a, marks=[mark('ai-labeled-original', 'Created with AI', width=588 - 20)])
    shot(fig, 'inspect-ai-labeled-screenshot', crop_b, rect_b,
         marks=[mark('ai-labeled-screenshot', "We couldn't verify how this was made", pad=(8, 6))])
    for rect, label in ((rect_a, 'Original file'), (rect_b, 'Screenshot of it')):
        fig.text(rect[0], rect[1] + rect[3] + 0.012, label, fontsize=14, fontweight='bold', va='bottom')
    cs.footer(fig, SHOT, TEST_IMAGE)
    cs.save(fig, f'{OUT}/inspect-screenshot-lost-ai-label.webp')


def resaved():
    """ImageMagick 재저장: Inspect는 AI 라벨 + 변경 경고, Verify는 변조 경고만"""
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'A re-saved copy kept its label but was flagged as changed',
              'The same re-saved file in Adobe Inspect (left) and CAI Verify (right).')
    crop_a = (640, 100, 1266, 600)
    crop_b = (968, 10, 1272, 470)
    top, scale = 150, 0.84
    rect_a, w_a = place_scaled(crop_a, 36, top, scale)
    rect_b, _ = place_scaled(crop_b, 36 + w_a + 40, top, scale)
    shot(fig, 'inspect-ai-labeled-imagemagick-resave', crop_a, rect_a,
         marks=[mark('ai-labeled-imagemagick-resave', 'There are unrecorded changes', pad=(34, 7))])
    shot(fig, 'verify-ai-labeled-imagemagick-resave', crop_b, rect_b, marks=[(976, 74, 290, 92)])
    for rect, label in ((rect_a, 'Inspect: label shown, plus a warning'), (rect_b, 'Verify: warning only')):
        fig.text(rect[0], rect[1] + rect[3] + 0.012, label, fontsize=14, fontweight='bold', va='bottom')
    cs.footer(fig, SHOT_BOTH, 'Test file: our AI-labeled test image re-saved as a JPEG at quality 85 by ImageMagick, which copies the credentials without updating them.')
    cs.save(fig, f'{OUT}/inspect-verify-resaved-copy.webp')


def edit_results():
    """2026-10-11 측정: 일상 편집 11개 + C2PA 지원 편집 1개의 결과를 세 묶음으로"""
    groups = [
        ('8', 'Credentials removed', 'No C2PA data left, same as\nan image never labeled', cs.ACCENT,
         ['Re-save as JPEG (Pillow)', 'Resize to 50%', 'Crop to 80%', 'Rotate 90 degrees', 'Convert to PNG',
          'Convert to WebP', 'Strip metadata (ImageMagick)', 'Screenshot (Chromium)']),
        ('3', 'Kept but flagged', 'Label still readable, but\nchecks fail: file changed', cs.FOREGROUND,
         ['Re-save as JPEG (ImageMagick)', 'Remove only EXIF data', 'Edit pixels, copy metadata']),
        ('1', 'Kept and valid', 'Re-signed with the original\nattached as its parent', cs.FOREGROUND,
         ['Resize in a C2PA-aware tool']),
    ]
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Most everyday edits erased Content Credentials',
              'What happened to the C2PA label after 12 edits to two signed JPEG images.')
    ax = fig.add_axes([0.03, 0.12, 0.94, 0.7])
    ax.set_xlim(0, 3)
    ax.set_ylim(0, 1)
    ax.axis('off')
    for i, (num, head, sub, color, items) in enumerate(groups):
        x = i + 0.03
        box(ax, x, 0, 0.94, 1, cs.SURFACE, r=0.02)
        ax.text(x + 0.07, 0.9, num, fontsize=40, fontweight='bold', color=color, va='top')
        ax.text(x + 0.3, 0.885, head, fontsize=15, fontweight='bold', va='top')
        ax.text(x + 0.3, 0.8, sub, fontsize=11.5, color=cs.MUTED, va='top', linespacing=1.35)
        ax.plot([x + 0.07, x + 0.87], [0.64, 0.64], color=cs.BORDER, lw=1)
        for j, item in enumerate(items):
            ax.text(x + 0.07, 0.585 - j * 0.07, item, fontsize=12.5, va='top')
    cs.footer(fig, 'Test: our AI-labeled image and the c2pa-rs sample C.jpg, each checked with c2patool 0.27.22 and c2pa-python 0.38.0, October 11, 2026.',
              'Both images gave the same result, except that C.jpg has no EXIF data to remove.')
    cs.save(fig, f'{OUT}/c2pa-edit-results.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    original()
    screenshot_vs_original()
    resaved()
    edit_results()
