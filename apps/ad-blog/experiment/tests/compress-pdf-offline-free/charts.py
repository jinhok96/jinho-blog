"""summary.json·압축 결과 → 글 이미지 (webp).

사용: /tmp/pv/bin/python -I charts.py <원본 폴더> <결과 폴더> <출력 폴더>
"""

import io
import json
import os
import subprocess
import sys
import tempfile

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from PIL import Image, ImageDraw, ImageFont  # noqa: E402

IN, OUT, DEST = sys.argv[1:4]
os.makedirs(DEST, exist_ok=True)
HERE = os.path.dirname(os.path.abspath(__file__))
R = {(r["tool"], r["doc"]): r for r in json.load(open(os.path.join(HERE, "summary.json")))}
SURF, INK, INK2, GRID, BLUE, RED = "#fcfcfb", "#0b0b0b", "#52514e", "#e4e3df", "#2a78d6", "#d0473a"
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 14, "text.color": INK, "axes.labelcolor": INK2, "xtick.color": INK2, "ytick.color": INK})
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONTB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
SET = ["qpdf", "ocrmypdf-O2", "ocrmypdf-O3", "gs-printer", "gs-ebook", "gs-screen"]
LAB = {"qpdf": "qpdf (lossless)", "ocrmypdf-O2": "OCRmyPDF -O2", "ocrmypdf-O3": "OCRmyPDF -O3", "gs-printer": "Ghostscript /printer",
       "gs-ebook": "Ghostscript /ebook", "gs-screen": "Ghostscript /screen", "gs-default": "Ghostscript (no preset)", "qpdf-oi": "qpdf --optimize-images",
       "ocrmypdf-O1": "OCRmyPDF -O1", "gs-prepress": "Ghostscript /prepress"}
DOCS = [("photo-brochure", "Photo brochure (39.6 MB)"), ("scanned-letter", "Scanned letter (7.1 MB)"),
        ("slides-screens", "Slides with screenshots (1.4 MB)"), ("text-report", "Text report (86 KB)")]
FOOT = "ToolProof test, Oct 2026 · 4 PDFs we made (46 pages) · Ghostscript 10.08.0, OCRmyPDF 17.13.0, qpdf 12.4.2"


def save_fig(fig, name):
    b = io.BytesIO()
    fig.savefig(b, format="png", dpi=100, facecolor=SURF)
    Image.open(b).convert("RGB").save(os.path.join(DEST, name), "WEBP", quality=90)
    print(name)


def style(ax):
    ax.set_facecolor(SURF)
    for s in ["top", "right", "left"]:
        ax.spines[s].set_visible(False)
    ax.spines["bottom"].set_color(GRID)
    ax.tick_params(axis="y", length=0)
    ax.set_xticks([])


def hbars(ax, keys, vals, fmt, title, xmax, labels, colors):
    y = list(range(len(keys)))[::-1]
    ax.barh(y, vals, color=colors, height=0.62)
    for yi, v in zip(y, vals):
        ax.text(v + xmax * 0.03, yi, fmt(v), va="center", fontsize=13.5, color=INK)
    ax.set_yticks(y)
    ax.set_yticklabels([LAB[k] for k in keys] if labels else [""] * len(keys))
    ax.set_xlim(0, xmax)
    ax.set_title(title, loc="left", fontsize=14, color=INK, pad=8)
    style(ax)


# 1. 대표 이미지: 문서별 압축 후 크기 (% of original)
fig, axes = plt.subplots(1, 4, figsize=(12, 6.75), facecolor=SURF, gridspec_kw={"wspace": 0.1})
fig.subplots_adjust(left=0.165, right=0.985, top=0.76, bottom=0.17)
for i, (doc, title) in enumerate(DOCS):
    vals = [R[(s, doc)]["ratio"] * 100 for s in SET]
    bad = [R[(s, doc)].get("ocr_recall", 1) < 0.95 or v > 101 for s, v in zip(SET, vals)]
    hbars(axes[i], SET, vals, lambda v: f"{v:.0f}%", title.replace(" (", "\n("), 175, i == 0, [RED if b else BLUE for b in bad])
    axes[i].axvline(100, color=INK2, lw=1, ls=(0, (3, 3)))
fig.text(0.02, 0.92, "Compress PDF offline: file size after compression (% of original)", fontsize=19, weight="bold", color=INK)
fig.text(0.02, 0.865, "Shorter is smaller. Red = file got more than 1% bigger, or text became hard to read (OCR word recall under 95%). Dashed line = original size.", fontsize=12, color=INK2)
fig.text(0.02, 0.04, FOOT, fontsize=11, color=INK2)
save_fig(fig, "compress-pdf-size-chart.webp")
plt.close(fig)

# 2. 읽기 쉬움: 스캔·슬라이드 OCR 단어 재현율
keys = ["qpdf", "ocrmypdf-O3", "gs-ebook", "gs-screen"]
fig, axes = plt.subplots(1, 2, figsize=(12, 4.4), facecolor=SURF, gridspec_kw={"wspace": 0.1})
fig.subplots_adjust(left=0.2, right=0.97, top=0.78, bottom=0.15)
for i, doc in enumerate(["scanned-letter", "slides-screens"]):
    vals = [R[(k, doc)]["ocr_recall"] * 100 for k in keys]
    hbars(axes[i], keys, vals, lambda v: f"{v:.0f}%", ["Scanned letter: words OCR could read", "Slides: words OCR could read"][i], 125, i == 0,
          [RED if v < 95 else BLUE for v in vals])
fig.text(0.02, 0.04, "Tesseract 5 word recall on each compressed file (scan at 300 dpi, slides at 200 dpi). The originals scored 100%.", fontsize=11.5, color=INK2)
save_fig(fig, "compress-pdf-readability-chart.webp")
plt.close(fig)

# 3. 속도·메모리 (사진 안내서 기준)
keys = ["qpdf", "ocrmypdf-O3", "gs-ebook", "gs-screen", "gs-printer"]
fig, axes = plt.subplots(1, 2, figsize=(12, 4.4), facecolor=SURF, gridspec_kw={"wspace": 0.1})
fig.subplots_adjust(left=0.2, right=0.97, top=0.8, bottom=0.15)
hbars(axes[0], keys, [R[(k, "photo-brochure")]["sec"] for k in keys], lambda v: f"{v:.1f} s", "Seconds for the 39.6 MB photo brochure", 8, True, BLUE)
hbars(axes[1], keys, [R[(k, "photo-brochure")]["ram_mb"] for k in keys], lambda v: f"{v:.0f} MB", "Peak memory", 1050, False, BLUE)
fig.text(0.02, 0.04, "Median of 3 runs, 4-core Intel Xeon 2.1 GHz, 16 GB RAM, no GPU.", fontsize=11.5, color=INK2)
save_fig(fig, "compress-pdf-speed-memory.webp")
plt.close(fig)


# 4·5. 확대 비교 이미지
def crop(pdf, page, dpi, box):
    with tempfile.TemporaryDirectory(dir="/tmp/w") as d:
        subprocess.run(["pdftoppm", "-r", str(dpi), "-f", str(page), "-l", str(page), "-png", pdf, d + "/p"], check=True)
        f = [x for x in os.listdir(d)][0]
        return Image.open(os.path.join(d, f)).convert("RGB").crop(box)


def compare(doc, page, dpi, box, items, name, scale=1):
    tiles = []
    for key, label in items:
        pdf = os.path.join(IN, f"{doc}.pdf") if key == "original" else os.path.join(OUT, f"{key}__{doc}.pdf")
        im = crop(pdf, page, dpi, box)
        if scale != 1:
            im = im.resize((int(im.width * scale), int(im.height * scale)), Image.NEAREST)
        tiles.append((im, label))
    w, h = tiles[0][0].size
    gap, head = 16, 46
    canvas = Image.new("RGB", (w * len(tiles) + gap * (len(tiles) + 1), h + head + gap), SURF)
    d = ImageDraw.Draw(canvas)
    f = ImageFont.truetype(FONTB, 22)
    for i, (im, label) in enumerate(tiles):
        x = gap + i * (w + gap)
        d.text((x, 10), label, font=f, fill=INK)
        canvas.paste(im, (x, head))
    canvas.save(os.path.join(DEST, name), "WEBP", quality=92)
    print(name, canvas.size)


s = lambda k, d: f"{R[(k, d)]['bytes'] / 1e6:.2f} MB" if R[(k, d)]["bytes"] > 1e6 else f"{R[(k, d)]['bytes'] / 1e3:.0f} KB"
compare("scanned-letter", 1, 150, (110, 120, 510, 330),
        [(k, f"{n} · {s(k, 'scanned-letter')}") for k, n in [("original", "Original"), ("gs-ebook", "/ebook"), ("gs-screen", "/screen")]],
        "compress-pdf-scan-text-comparison.webp", 1)
compare("slides-screens", 2, 220, (80, 420, 470, 620),
        [(k, f"{n} · {s(k, 'slides-screens')}") for k, n in [("original", "Original"), ("ocrmypdf-O3", "OCRmyPDF -O3"), ("gs-screen", "GS /screen")]],
        "compress-pdf-slide-text-comparison.webp", 1)
compare("photo-brochure", 5, 220, (700, 500, 1060, 800),
        [(k, f"{n} · {s(k, 'photo-brochure')}") for k, n in [("original", "Original"), ("ocrmypdf-O3", "OCRmyPDF -O3"), ("gs-ebook", "GS /ebook")]],
        "compress-pdf-photo-detail-comparison.webp", 1)
