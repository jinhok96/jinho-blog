"""results.jsonl·출력 JPG·GUI 캡처(/tmp/p2j/shots/*.png) → 글 이미지(webp)
사용: /tmp/pdfs/bin/python -I charts.py <작업 폴더 /tmp/p2j> <이미지 출력 폴더>
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
O = W / "out"
OUT = Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)
HERE = Path(__file__).parent
R = {(r["folder"], r["file"]): r for r in map(json.loads, (HERE / "results.jsonl").read_text().splitlines())}
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 13})
FONT = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
GOOD, BAD, WARN, INK = "#2a9d8f", "#d1495b", "#e09f3e", "#222222"


def save_img(im, name, q=86):
    im.convert("RGB").save(OUT / f"{name}.webp", quality=q, method=6)


def mb(folder, f):
    return R[(folder, f)]["bytes"] / 1e6


# 1) 대표: 앱 × 항목 점검표 (숫자는 results.jsonl에서)
g, lo, sj = R[("gimp", "irs-1040.jpg")], R[("lo", "irs-1040.jpg")], R[("sejda-150", "1_irs-1040.jpg")]
APPS = ["GIMP 3.2.6", "LibreOffice Draw\n26.8.1", "Sejda PDF Desktop\n7.9.10 (free)"]
rows = [
    [("Only page 2\n(the last one)", False), (f"300 ppi\n{g['w']} x {g['h']}", True), ("Any number\nyou type", True),
     (f"{mb('gimp', 'irs-1040.jpg'):.1f} MB", True), ("None", True)],
    [("Only the page\non screen", False), (f"96 ppi\n{lo['w']} x {lo['h']}", False), ("Any, but the\nResolution box\ndoesn't add pixels", None),
     (f"{mb('lo', 'irs-1040.jpg'):.2f} MB\n(blurry)", None), ("None", True)],
    [("Both pages,\none JPG each", True), (f"150 dpi\n{sj['w']} x {sj['h']}", None), ("220 dpi max", None),
     (f"{mb('sejda-150', '1_irs-1040.jpg'):.1f} MB", True), ("3 tasks a day,\n20 pages", False)],
]
cols = ["Pages saved from\na 2-page PDF", "Default size\n(Letter page)", "Higher\nresolution", "Size per page\n(default)", "Free-version\nlimit"]
fig, ax = plt.subplots(figsize=(12, 6.75))
ax.set_xlim(0, len(cols))
ax.set_ylim(0, len(APPS))
ax.invert_yaxis()
for r, cells in enumerate(rows):
    for c, (txt, ok) in enumerate(cells):
        color = WARN if ok is None else (GOOD if ok else BAD)
        ax.add_patch(plt.Rectangle((c + 0.04, r + 0.08), 0.92, 0.84, color=color, alpha=0.92))
        ax.text(c + 0.5, r + 0.5, txt, ha="center", va="center", color="white", fontsize=12.5, fontweight="bold")
ax.set_xticks([c + 0.5 for c in range(len(cols))], cols, fontsize=12)
ax.xaxis.tick_top()
ax.set_yticks([r + 0.5 for r in range(len(APPS))], APPS, fontsize=13)
ax.tick_params(length=0)
for s in ax.spines.values():
    s.set_visible(False)
fig.suptitle("PDF to JPG with default settings: what each free app gave us", fontsize=17, fontweight="bold", y=0.985)
fig.text(0.5, 0.015, "Input: IRS Form 1040 (2 pages, Letter). Tested by ToolProof, October 2026.", ha="center", fontsize=11, color="#555")
fig.tight_layout(rect=(0, 0.04, 1, 0.95))
fig.savefig(W / "_chart.png", dpi=100)
plt.close(fig)
save_img(Image.open(W / "_chart.png").resize((1200, 675)), "pdf-to-jpg-default-results")


# 2) 작은 글씨 확대 비교: 같은 종이 영역(1040 1쪽 위쪽)을 설정별로
def crop_in(path, x0, y0, x1, y1, width=1100):
    im = Image.open(path)
    ppi = im.width / 8.5
    c = im.crop((round(x0 * ppi), round(y0 * ppi), round(x1 * ppi), round(y1 * ppi)))
    return c.resize((width, round(width * (y1 - y0) / (x1 - x0))), Image.NEAREST)


AREA = (0.45, 1.55, 3.45, 2.05)
panels = [
    (O / "lo/irs-1040.jpg", "LibreOffice Draw default: 96 ppi (816 x 1056)"),
    (O / "sejda-150/1_irs-1040.jpg", "Sejda default: 150 dpi (1275 x 1649)"),
    (O / "sejda-220/1_irs-1040.jpg", "Sejda Large: 220 dpi (1870 x 2420)"),
    (O / "lo/irs-1040-fixed.jpg", "LibreOffice Draw set to 300 ppi (2550 x 3300)"),
]
crops = [crop_in(p, *AREA) for p, _ in panels]
pad, lab = 16, 40
H = sum(c.height + lab + pad for c in crops) + pad
canvas = Image.new("RGB", (1100 + 2 * pad, H), "white")
d = ImageDraw.Draw(canvas)
y = pad
for c, (_, t) in zip(crops, panels):
    d.text((pad, y + 6), t, font=FONT, fill=INK)
    canvas.paste(c, (pad, y + lab))
    d.rectangle((pad - 1, y + lab - 1, pad + c.width, y + lab + c.height), outline="#999")
    y += c.height + lab + pad
save_img(canvas, "pdf-to-jpg-resolution-zoom")

# 3) LibreOffice 글꼴 바꿈: 같은 줄을 Sejda(원래 글꼴)와 비교
AREA2 = (0.3, 3.85, 6.3, 4.25)
c1, c2 = crop_in(O / "sejda-220/1_irs-1040.jpg", *AREA2), crop_in(O / "lo/irs-1040-fixed.jpg", *AREA2)
canvas = Image.new("RGB", (1100 + 2 * pad, c1.height + c2.height + 2 * lab + 3 * pad), "white")
d = ImageDraw.Draw(canvas)
d.text((pad, pad + 6), "Sejda (original font)", font=FONT, fill=INK)
canvas.paste(c1, (pad, pad + lab))
y = pad + lab + c1.height + pad
d.text((pad, y + 6), "LibreOffice Draw (font replaced, text runs together)", font=FONT, fill=INK)
canvas.paste(c2, (pad, y + lab))
save_img(canvas, "libreoffice-pdf-font-change")

# 4~9) GUI 캡처 자르기
shots = {
    "gimp-last-page-on-top": ("g2.png", (0, 0, 848, 749)),
    "gimp-open-pages-as-images": ("gimp-images-option.png", (0, 0, 608, 660)),
    "libreoffice-resolution-trap": ("lo-resolution-trap.png", (596, 268, 1003, 732)),
    "libreoffice-resolution-fixed": ("lo-resolution-fixed.png", (596, 268, 1003, 732)),
    "sejda-pdf-to-jpg-options": ("sejda-pdf-to-jpg-options.png", (200, 200, 1400, 900)),
    "sejda-free-daily-limit": ("s21.png", (220, 170, 1370, 520)),
}
for name, (f, box) in shots.items():
    save_img(Image.open(S / f).crop(box), name, q=90)
print(sorted(p.name for p in OUT.iterdir()))
