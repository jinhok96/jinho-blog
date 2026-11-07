"""NAPS2 8.5.1 OCR 측정 그래픽 3장 (1200×675 webp): OCR 설정 화면 캡처 + 이미지 유형별 단어 판독률 + 영수증 출력 비교.

측정: naps2/naps2-*.jsonl → naps2/naps2-summary.json (score.py), 2026-10-25. 절차는 facts.md 'NAPS2 측정 (2026-10-25)'.
캡처 `naps2/naps2-ocr-setup.png`는 Xvfb(1440×900)에서 찍은 NAPS2 8.5.1 Linux 화면.
실행: python3 -I naps2_charts.py <출력 폴더>
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Rectangle  # noqa: E402
from PIL import Image  # noqa: E402

HERE = Path(__file__).resolve().parent
OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'
SUMMARY = json.loads((HERE / 'naps2/naps2-summary.json').read_text())


def ocr_setup_screenshot():
    """NAPS2 창만 잘라 넣고 OCR 버튼과 'Make PDFs searchable using OCR'을 accent 상자로 표시"""
    left, top = 116, 150  # 1440×900 캡처에서 NAPS2 창 위치
    img = Image.open(HERE / 'naps2/naps2-ocr-setup.png').convert('RGB').crop((left, top, 1328, 775))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'NAPS2: turn on OCR once, then every PDF you save is searchable',
              'OCR Setup in NAPS2 8.5.1 after importing our 50 test images, October 25, 2026.')
    h_px = 470
    w_px = h_px * img.width / img.height
    ax = fig.add_axes([(1200 - w_px) / 2 / 1200, 0.115, w_px / 1200, h_px / 675])
    ax.imshow(img)
    ax.axis('off')
    # 원본 캡처 좌표 - 창 위치: OCR 버튼 x 255~295 y 176~240, 체크박스 줄 x 553~800 y 368~392
    ax.add_patch(Rectangle((255 - left, 176 - top), 40, 64, fill=False, edgecolor=cs.ACCENT, lw=3, zorder=3))
    ax.add_patch(Rectangle((552 - left, 367 - top), 250, 26, fill=False, edgecolor=cs.ACCENT, lw=3, zorder=3))
    cs.footer(fig, 'Screenshot: NAPS2 8.5.1 for Linux, run by ToolProof. Boxes added by ToolProof.')
    cs.save(fig, f'{OUT}/naps2-ocr-setup.webp')


# (이미지 유형, summary 조건 키, 설명)
TYPES = [
    ('Scanned pages', 'scan', 'slightly tilted, noisy book pages'),
    ('Screenshots', 'screenshot', 'web page text at normal size'),
    ('Small text', 'small', 'screenshots with tiny 11px text'),
    ('Receipts', 'receipt', 'faded store receipts'),
    ('Phone photos', 'photo', 'pages photographed at an angle'),
]


def word_recall_chart():
    fast = SUMMARY['naps2-fast']['by_cond']
    fig, ax = cs.figure()
    fig.subplots_adjust(left=0.24, right=0.9, top=0.8, bottom=0.2)
    ax.set_xlim(0, 100)
    ax.set_ylim(-0.6, len(TYPES) - 0.4)
    ys = [len(TYPES) - 1 - i for i in range(len(TYPES))]  # 위에서부터 TYPES 순서 (invert_yaxis는 막대 모서리 보정을 깨뜨림)
    ax.set_yticks([y + 0.08 for y in ys])
    ax.set_yticklabels([t[0] for t in TYPES], fontsize=15, fontweight='semibold')
    ax.set_xticks([0, 25, 50, 75, 100])
    ax.set_xticklabels(['0%', '25%', '50%', '75%', '100%'])
    for y, (_, key, note) in zip(ys, TYPES):
        v = fast[key]['word_recall_mean'] * 100
        cs.rounded_barh(ax, y + 0.08, 0, v, 0.42, cs.ACCENT if v >= 90 else cs.MUTED)
        ax.text(v + 1.2, y + 0.08, f'{v:.1f}%', va='center', fontsize=15, fontweight='semibold', color=cs.FOREGROUND)
        ax.text(0.5, y - 0.3, note, va='center', fontsize=11.5, color=cs.MUTED)
    cs.header(fig, 'NAPS2 reads scans and screenshots, but not photos or receipts',
              'Share of words NAPS2 8.5.1 found, 10 test images per type, default Fast mode. Best mode scored within 4 points.')
    cs.footer(fig, 'ToolProof test, October 25, 2026: English OCR, words counted regardless of order. Details in "How we tested."')
    cs.save(fig, f'{OUT}/naps2-word-accuracy-by-image.webp')


def receipt_comparison():
    """영수증 원본(가격 열 accent 상자) vs NAPS2가 PDF에 넣은 텍스트"""
    img = Image.open(HERE / 'naps2/receipt_00.jpg').convert('RGB')
    text = (HERE / 'naps2/receipt_00-naps2-fast.txt').read_text().replace('\f', '')
    lines = []
    for ln in (x.rstrip() for x in text.splitlines()):
        if ln or (lines and lines[-1]):  # 연달아 나오는 빈 줄은 하나로
            lines.append(ln)
    while lines and not lines[-1]:
        lines.pop()
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'What NAPS2 read from a receipt: no prices at all',
              'Left: test receipt. Right: the text NAPS2 8.5.1 saved in the searchable PDF (default Fast mode).')
    h_px = 470
    w_px = h_px * img.width / img.height
    ax = fig.add_axes([60 / 1200, 0.115, w_px / 1200, h_px / 675])
    ax.imshow(img)
    ax.axis('off')
    ax.add_patch(Rectangle((488, 270), 145, 640, fill=False, edgecolor=cs.ACCENT, lw=3, zorder=3))
    ax.text(560, 262, 'missing', ha='center', va='bottom', fontsize=13, fontweight='semibold', color=cs.ACCENT)
    tx = fig.add_axes([(60 + w_px + 60) / 1200, 0.115, 0.5, h_px / 675])
    tx.set_xlim(0, 1)
    tx.set_ylim(0, 1)
    tx.axis('off')
    tx.add_patch(Rectangle((0, 0), 1, 1, facecolor=cs.SURFACE, edgecolor=cs.BORDER, lw=1))
    tx.text(0.05, 0.95, '\n'.join(lines), va='top', ha='left', family='monospace', fontsize=12.5,
            color=cs.FOREGROUND, linespacing=1.25)
    tx.text(0.95, 0.06, 'Kept: store, date, 4 of 10 items\nLost: 6 items and all 14 prices',
            va='bottom', ha='right', fontsize=13, fontweight='semibold', color=cs.FOREGROUND, linespacing=1.4)
    cs.footer(fig, 'ToolProof test receipt (made-up items and prices), October 25, 2026. Text extracted from the PDF NAPS2 saved.')
    cs.save(fig, f'{OUT}/naps2-receipt-no-prices.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    ocr_setup_screenshot()
    word_recall_chart()
    receipt_comparison()
