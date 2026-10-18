"""results.jsonl·GUI 캡처(/tmp/j2p/shots/*.png) → 글 이미지(webp)
사용: /tmp/pdfs/bin/python -I charts.py <작업 폴더 /tmp/j2p> <이미지 출력 폴더>
"""
import json
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw, ImageFont

W = Path(sys.argv[1])
S = W / "shots"
OUT = Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)
HERE = Path(__file__).parent
R = [json.loads(l) for l in (HERE / "results.jsonl").read_text().splitlines()]
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 13})
FONT = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
GOOD, BAD, WARN, INK = "#2a9d8f", "#d1495b", "#e09f3e", "#222222"


def pages(pdf):
    return [r for r in R if r["pdf"] == pdf]


def img_bytes(pdf, photo):
    return next(r["images"][0]["bytes"] for r in pages(pdf) if r.get("match_photo") == photo)


def save_img(im, name, q=86):
    im.convert("RGB").save(OUT / f"{name}.webp", quality=q, method=6)


# 1) 대표: 앱 × 항목 점검표 (숫자는 results.jsonl에서)
pa, sj = pages("pdfarranger-default.pdf"), pages("sejda-default.pdf")
same = lambda ps: sum(i["jpeg_bytes_identical"] for r in ps for i in r["images"])
upright = lambda ps: sum(1 for r in ps if r["match_photo"] in (9, 10) and r["rotate_needed"] == 0)
mb = lambda pdf: pages(pdf)[0]["size_bytes"] / 1e6
APPS = ["PDF Arranger 1.14", "Sejda PDF Desktop\n7.9.10 (free)", "Chrome 141\n(Print > Save as PDF)"]
rows = [
    [("Yes", True), (f"{upright(pa)} of 2", True), (f"{same(pa)} of 10", True),
     (f"{mb('pdfarranger-default.pdf'):.1f} MB", True), ("Photo size\n(56 x 42 in)", False), ("None", True)],
    [("Yes", True), (f"{upright(sj)} of 2", True), (f"{same(sj)} of 10\n(2 portraits\nre-saved)", None),
     (f"{mb('sejda-default.pdf'):.1f} MB", True), ("A4\n(Letter in\nthe menu)", None), ("3 tasks\na day", False)],
    [("No, one photo\nper PDF", False), ("Yes", True), ("Landscape yes,\nportrait no", None),
     (f"Portrait photo:\n{mb('chrome-09-default.pdf'):.1f} MB", False), ("Adds date and\nfile path", False), ("None", True)],
]
cols = ["Many photos\nin one PDF", "Portrait photos\nupright", "Photos kept\nas is", "PDF size\n(10 photos, 22.6 MB)", "Default page", "Free-version\nlimit"]
fig, ax = plt.subplots(figsize=(12, 6.75))
ax.set_xlim(0, len(cols))
ax.set_ylim(0, len(APPS))
ax.invert_yaxis()
for r, cells in enumerate(rows):
    for c, (txt, ok) in enumerate(cells):
        color = WARN if ok is None else (GOOD if ok else BAD)
        ax.add_patch(plt.Rectangle((c + 0.04, r + 0.08), 0.92, 0.84, color=color, alpha=0.92))
        ax.text(c + 0.5, r + 0.5, txt, ha="center", va="center", color="white", fontsize=12.5, fontweight="bold")
ax.set_yticks([r + 0.5 for r in range(len(APPS))], APPS, fontsize=12.5)
ax.set_xticks([c + 0.5 for c in range(len(cols))], cols, fontsize=11.5)
ax.xaxis.tick_top()
ax.tick_params(length=0)
for sp in ax.spines.values():
    sp.set_visible(False)
fig.text(0.5, 0.035, "10 phone-size JPG photos (12 MP, 2 shot in portrait). Chrome makes one PDF per photo. Tested October 18, 2026.",
         ha="center", fontsize=11, color="#555555")
fig.subplots_adjust(left=0.17, right=0.985, top=0.83, bottom=0.09)
fig.savefig(W / "hero.png", dpi=100)
save_img(Image.open(W / "hero.png"), "jpg-to-pdf-what-each-app-does")

# 2) 사진 1장이 PDF 안에서 차지하는 크기: 가로 사진(01)·세로 사진(09)
orig = {1: (W / "in/01.jpg").stat().st_size, 9: (W / "in/09.jpg").stat().st_size}
groups = [("Original JPG", orig[1], orig[9]),
          ("PDF Arranger", img_bytes("pdfarranger-default.pdf", 1), img_bytes("pdfarranger-default.pdf", 9)),
          ("Sejda (free)", img_bytes("sejda-default.pdf", 1), img_bytes("sejda-default.pdf", 9)),
          ("Chrome", img_bytes("chrome-01-default.pdf", 1), img_bytes("chrome-09-default.pdf", 9))]
fig, ax = plt.subplots(figsize=(12, 6.75))
x = range(len(groups))
b1 = ax.bar([i - 0.2 for i in x], [g[1] / 1e6 for g in groups], 0.38, color="#457b9d", label="Landscape photo")
b2 = ax.bar([i + 0.2 for i in x], [g[2] / 1e6 for g in groups], 0.38, color=WARN, label="Portrait photo (phone held upright)")
for bars in (b1, b2):
    for b in bars:
        ax.text(b.get_x() + b.get_width() / 2, b.get_height() + 0.3, f"{b.get_height():.2f} MB", ha="center", fontsize=12, color=INK)
ax.set_xticks(list(x), [g[0] for g in groups], fontsize=13)
ax.set_ylabel("Size of the photo inside the PDF (MB)")
ax.set_ylim(0, 24)
ax.legend(frameon=False, loc="upper left")
for sp in ("top", "right"):
    ax.spines[sp].set_visible(False)
ax.set_title("Chrome stores a portrait photo uncompressed: 1.85 MB becomes 21.55 MB", fontsize=15, pad=14)
fig.tight_layout()
fig.savefig(W / "sizes.png", dpi=100)
save_img(Image.open(W / "sizes.png"), "jpg-to-pdf-photo-size-inside-pdf")


# 3) 앱 화면 캡처
def labeled(img, text, color):
    bar = Image.new("RGB", (img.width, 40), color)
    ImageDraw.Draw(bar).text((12, 8), text, font=FONT, fill="white")
    out = Image.new("RGB", (img.width, img.height + 40), "white")
    out.paste(bar, (0, 0))
    out.paste(img, (0, 40))
    return out


save_img(Image.open(S / "chrome-print-preview-default.png").crop((256, 82, 1342, 800)), "chrome-print-image-default-headers")
a = labeled(Image.open(S / "chrome-landscape-two-pages.png").crop((256, 82, 950, 800)), "Landscape, default scale: 2 pages", BAD)
b = labeled(Image.open(S / "chrome-landscape-fixed.png").crop((256, 82, 950, 800)), "Margins None + Scale 90: 1 page", GOOD)
both = Image.new("RGB", (a.width * 2 + 20, a.height), "white")
both.paste(a, (0, 0))
both.paste(b, (a.width + 20, 0))
save_img(both, "chrome-landscape-photo-two-pages-fix")
save_img(Image.open(S / "sejda-page-size-menu.png").crop((200, 127, 1385, 900)), "sejda-jpg-to-pdf-page-size-options")
a = Image.open(S / "sejda-jpg-to-pdf-limits.png").crop((470, 505, 1130, 565))
b = Image.open(S / "sejda-daily-limit.png").crop((340, 190, 1265, 510))
lim = Image.new("RGB", (925, 400), "white")
lim.paste(a, ((925 - a.width) // 2, 10))
lim.paste(b, (0, 80))
save_img(lim, "sejda-free-limits-jpg-to-pdf")
save_img(Image.open(S / "pdfarranger-photos.png").crop((0, 0, 1400, 900)), "pdf-arranger-photos-portrait-upright")
save_img(Image.open(S / "pdfarranger-page-size.png").crop((520, 290, 890, 610)).resize((740, 640)), "pdf-arranger-page-size-us-letter")
print(sorted(p.name for p in OUT.iterdir()))
