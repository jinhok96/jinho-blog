"""summary.json·runs.jsonl·Chrome 캡처 → 글 이미지(webp). 사용: /tmp/pdfm/bin/python -I charts.py <작업 폴더 /tmp/merge> <이미지 출력 폴더>"""
import json
import statistics
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw, ImageFont

W = Path(sys.argv[1])
OUT = Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)
HERE = Path(__file__).parent
S = json.loads((HERE / "summary.json").read_text())
C = json.loads((HERE / "chrome_tests.json").read_text())
RUNS = [json.loads(l) for l in (HERE / "runs.jsonl").read_text().splitlines()]
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 13, "axes.spines.top": False, "axes.spines.right": False})
FONT = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
FONT_S = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
GOOD, BAD, MID, INK = "#2a9d8f", "#d1495b", "#e9c46a", "#222222"

ROWS = [
    ("pdftk", "pdftk-java 3.3.3"),
    ("pypdf", "pypdf 6.21 (Python)"),
    ("ghostscript", "Ghostscript 10.08"),
    ("qpdf", "qpdf 12.4.2"),
    ("pdfunite", "pdfunite (Poppler 26.10)"),
    ("pymupdf", "PyMuPDF 1.28.2 (Python)"),
]


def save_fig(fig, name):
    p = W / f"{name}.png"
    fig.savefig(p, dpi=100)
    plt.close(fig)
    Image.open(p).convert("RGB").save(OUT / f"{name}.webp", quality=88, method=6)


def save_img(im, name, q=86):
    im.convert("RGB").save(OUT / f"{name}.webp", quality=q, method=6)


# 1) 대표: 도구 × 항목 점검표
cols = ["Bookmarks\nkept", "Table-of-contents\nlinks work", "Two copies of a form\nstay separate", "Photos\nuntouched"]
fig, ax = plt.subplots(figsize=(12, 6.75))
ax.set_xlim(0, 4)
ax.set_ylim(0, len(ROWS))
ax.invert_yaxis()
for r, (k, label) in enumerate(ROWS):
    s = S[k]
    form = C["form_test"]["page10_after_edit"][k]
    cells = [
        (f'{s["toc_correct"]} of 8', s["toc_correct"] == 8),
        (f'{s["internal_links_ok"]} of 6', s["internal_links_ok"] == 6),
        ("Yes" if "unchanged" in form else ("No: flattened" if "not fillable" in form else "No: linked"), "unchanged" in form),
        (f'{s["photos_pixels_identical"]} of 3', s["photos_pixels_identical"] == 3),
    ]
    for c, (txt, ok) in enumerate(cells):
        ax.add_patch(plt.Rectangle((c + 0.04, r + 0.08), 0.92, 0.84, color=GOOD if ok else BAD, alpha=0.9 if ok else 0.85))
        ax.text(c + 0.5, r + 0.5, txt, ha="center", va="center", color="white", fontsize=15, fontweight="bold")
ax.set_yticks([r + 0.5 for r in range(len(ROWS))], [l for _, l in ROWS], fontsize=14)
ax.set_xticks([c + 0.5 for c in range(4)], cols, fontsize=13)
ax.xaxis.tick_top()
ax.tick_params(length=0)
for sp in ax.spines.values():
    sp.set_visible(False)
ax.set_title("Merging 5 PDFs (21 pages) with each tool's default command", loc="left", fontsize=16, pad=58)
fig.text(0.01, 0.015, "Checked in the merged file and in Chrome 141's PDF viewer. Green = same as the original files.", fontsize=11, color="#555")
fig.tight_layout(rect=(0, 0.03, 1, 1))
save_fig(fig, "merge-pdf-what-each-tool-keeps")


def label(im, text, color=INK):
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, im.width, 40), fill="white")
    d.text((12, 8), text, font=FONT, fill=color)
    return im


# 2) 양식: 4쪽에 입력한 뒤 10쪽 Name 칸 (pypdf 기본 vs qpdf)
def form_row(tool):
    a = Image.open(W / f"form-{tool}-p4.png").crop((230, 125, 980, 200))
    b = Image.open(W / f"form-{tool}-p10.png").crop((230, 170, 980, 245))
    return a, b


panel = Image.new("RGB", (1500, 2 * (40 + 50 + 75 + 30)), "white")
y = 0
for tool, title, col in (("pypdf", "pypdf default: typing on page 4 also changed page 10", BAD),
                         ("pdftk", "pdftk: page 10 keeps its own value", GOOD)):
    a, b = form_row(tool)
    panel.paste(label(Image.new("RGB", (1500, 40), "white"), title, col), (0, y))
    d = ImageDraw.Draw(panel)
    d.text((12, y + 48), "Page 4 (first W-9)", font=FONT_S, fill="#555")
    d.text((762, y + 48), "Page 10 (second W-9)", font=FONT_S, fill="#555")
    panel.paste(a, (0, y + 80))
    panel.paste(b, (750, y + 80))
    y += 40 + 50 + 75 + 30
save_img(panel.resize((1200, round(panel.height * 1200 / 1500))), "merged-w9-form-fields-chrome")

# 3) 책갈피: pdftk 사이드바 vs qpdf
a = Image.open(W / "outline-pdftk.png").crop((0, 0, 640, 360))
b = Image.open(W / "outline-qpdf.png").crop((0, 0, 640, 360))
im = Image.new("RGB", (1290, 410), "white")
im.paste(label(Image.new("RGB", (640, 40), "white"), "pdftk: bookmarks kept", GOOD), (0, 0))
im.paste(label(Image.new("RGB", (640, 40), "white"), "qpdf: no bookmarks", BAD), (650, 0))
im.paste(a, (0, 50))
im.paste(b, (650, 50))
save_img(im, "merged-pdf-bookmarks-chrome")

# 4) 목차 링크 클릭 후 쪽 번호
tools = ["pdftk", "pypdf", "ghostscript", "qpdf", "pdfunite", "pymupdf"]
im = Image.new("RGB", (1200, 60 + 50 * len(tools)), "white")
d = ImageDraw.Draw(im)
d.text((12, 12), 'After clicking "Measurements" (should jump to page 2)', font=FONT, fill=INK)
for i, t in enumerate(tools):
    sh = Image.open(W / f"link-{t}.png")
    yy = 60 + 50 * i
    lab = dict(ROWS)[t]
    pgno = C["link_test"]["page_after_click"][t]
    d.text((12, yy + 10), lab, font=FONT_S, fill=INK)
    im.paste(sh.crop((420, 8, 520, 48)), (380, yy + 2))
    d.text((520, yy + 10), "jumped to page 2" if pgno == 2 else "link did nothing", font=FONT_S, fill=GOOD if pgno == 2 else BAD)
    im.paste(sh.crop((300, 60, 700, 100)).resize((300, 30)), (860, yy + 8)) if pgno == 2 else None
save_img(im, "merged-pdf-toc-links-chrome")

# 5) 속도·메모리 (3회 중앙값)
med = {t: statistics.median(r["sec"] for r in RUNS if r["tool"] == t) for t, _ in ROWS}
mem = {t: max(r["maxrss_mb"] for r in RUNS if r["tool"] == t) for t, _ in ROWS}
order = sorted(ROWS, key=lambda x: med[x[0]])
fig, (a1, a2) = plt.subplots(1, 2, figsize=(12, 5.4))
yy = list(range(len(order)))[::-1]
a1.barh(yy, [med[k] for k, _ in order], color=GOOD)
for y_, (k, _) in zip(yy, order):
    a1.text(med[k] + 0.01, y_, f"{med[k]:.2f} s", va="center", fontsize=12)
a1.set_yticks(yy, [l for _, l in order])
a1.set_xlim(0, max(med.values()) * 1.3)
a1.set_title("Time to merge 5 PDFs (21 pages, 5.6 MB)", loc="left", fontsize=14)
a2.barh(yy, [mem[k] for k, _ in order], color="#264653")
for y_, (k, _) in zip(yy, order):
    a2.text(mem[k] + 1, y_, f"{mem[k]:.0f} MB", va="center", fontsize=12)
a2.set_yticks(yy, [""] * len(order))
a2.set_xlim(0, max(mem.values()) * 1.3)
a2.set_title("Peak memory", loc="left", fontsize=14)
fig.text(0.01, 0.01, "Median of 3 runs, 4-core Xeon 2.1 GHz, 16 GB RAM. Python tools include starting Python.", fontsize=11, color="#555")
fig.tight_layout(rect=(0, 0.04, 1, 1))
save_fig(fig, "merge-pdf-speed-memory")

# 6) 채울 수 있는 칸(파란 배경) vs Ghostscript(인쇄된 글자)
a = Image.open(W / "fill-qpdf.png").crop((180, 140, 1020, 420))
b = Image.open(W / "fill-ghostscript.png").crop((180, 140, 1020, 420))
im = Image.new("RGB", (1690, 330), "white")
im.paste(label(Image.new("RGB", (840, 40), "white"), "qpdf: fields still fillable (blue)", GOOD), (0, 0))
im.paste(label(Image.new("RGB", (840, 40), "white"), "Ghostscript: form flattened", BAD), (850, 0))
im.paste(a, (0, 50))
im.paste(b, (850, 50))
save_img(im.resize((1200, round(330 * 1200 / 1690))), "ghostscript-flattened-w9-chrome")
print("ok", sorted(p.name for p in OUT.glob("*.webp")))
