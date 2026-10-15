"""summary.json·렌더링 결과 → 글 이미지 (webp).

사용: python charts.py <작업 폴더(pdfs, render, edited 포함)> <출력 폴더>
  render/{도구}/{문서}.pdf : 변환된 .docx를 LibreOffice Writer 24.2(시스템)로 PDF 변환한 것
  edited/{도구}-1.png      : edit_test.py 결과를 같은 방식으로 렌더링한 1쪽
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

WORK, DEST = sys.argv[1], sys.argv[2]
os.makedirs(DEST, exist_ok=True)
HERE = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(os.path.join(HERE, "summary.json")))
TOOLS = ["pdf2docx", "libreoffice", "calibre"]
LAB = {"pdf2docx": "pdf2docx 0.5.13", "libreoffice": "LibreOffice 26.8", "calibre": "Calibre 7.6"}
SURF, INK, INK2, GRID, BLUE = "#fcfcfb", "#0b0b0b", "#52514e", "#e4e3df", "#2a78d6"
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 15, "text.color": INK, "axes.labelcolor": INK2, "xtick.color": INK2, "ytick.color": INK})
FOOT = "ToolProof test, Oct 2026 · 10 text-based PDFs (letters, reports, invoices, newsletters) · 4-core CPU · default settings"
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONTB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


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
    ax.grid(axis="x", color=GRID, lw=1)
    ax.set_axisbelow(True)


def bars(ax, vals, fmt, title, xmax, labels=True):
    y = list(range(len(TOOLS)))[::-1]
    ax.barh(y, vals, color=BLUE, height=0.6)
    for yi, v in zip(y, vals):
        ax.text(v + xmax * 0.02, yi, fmt(v), va="center", fontsize=15, color=INK)
    ax.set_yticks(y)
    ax.set_yticklabels([LAB[t] for t in TOOLS] if labels else [""] * len(TOOLS))
    ax.set_xlim(0, xmax)
    ax.set_xticks([])
    ax.set_title(title, loc="left", fontsize=15, color=INK, pad=10)
    style(ax)


# 1. 대표 이미지: 편집하기 쉬운 결과인가 (3개 지표, 작은 다중 막대)
o = {t: S[t]["overall"] for t in TOOLS}
fig, axes = plt.subplots(1, 3, figsize=(12, 6.75), facecolor=SURF, gridspec_kw={"wspace": 0.12})
fig.subplots_adjust(left=0.17, right=0.97, top=0.78, bottom=0.12)
bars(axes[0], [o[t]["para_intact"] * 100 for t in TOOLS], lambda v: f"{v:.0f}%", "Paragraphs kept whole", 125)
bars(axes[1], [o[t]["tables_ok"] for t in TOOLS], lambda v: f"{v:.0f} of 4", "Gridded tables rebuilt\nas real Word tables", 5.6, labels=False)
bars(axes[2], [o[t]["textbox_share"] * 100 for t in TOOLS], lambda v: f"{v:.0f}%", "Text stuck in text boxes\n(lower is better)", 125, labels=False)
axes[0].set_title("Paragraphs kept whole\n(higher is better)", loc="left", fontsize=15, color=INK, pad=10)
fig.text(0.02, 0.93, "Which free offline PDF to Word converter gives you an editable file?", fontsize=20, weight="bold", color=INK)
fig.text(0.02, 0.03, FOOT, fontsize=11.5, color=INK2)
save_fig(fig, "pdf-to-word-editability-chart.webp")
plt.close(fig)

# 2. 속도·메모리
fig, axes = plt.subplots(1, 2, figsize=(12, 4.6), facecolor=SURF, gridspec_kw={"wspace": 0.12})
fig.subplots_adjust(left=0.17, right=0.97, top=0.78, bottom=0.14)
bars(axes[0], [o[t]["sec_median"] for t in TOOLS], lambda v: f"{v:.2f} s", "Seconds per file (median)", 1.35)
bars(axes[1], [o[t]["rss_gb_max"] * 1024 for t in TOOLS], lambda v: f"{v:.0f} MB", "Peak memory", 280, labels=False)
fig.text(0.02, 0.91, "All three converted each 1-2 page PDF in about a second", fontsize=18, weight="bold", color=INK)
fig.text(0.02, 0.03, "ToolProof test, Oct 2026 · 11 PDFs × 3 runs, one file per launch · Intel Xeon 2.8 GHz, 4 cores, no GPU", fontsize=11.5, color=INK2)
save_fig(fig, "pdf-to-word-speed-memory.webp")
plt.close(fig)


# 3·4. 원본 PDF vs 변환 결과(1쪽) 나란히
def page_png(pdf, dpi):
    with tempfile.TemporaryDirectory() as d:
        subprocess.run(["pdftoppm", "-r", str(dpi), "-png", "-f", "1", "-l", "1", pdf, os.path.join(d, "p")], check=True)
        f = [x for x in os.listdir(d)][0]
        return Image.open(os.path.join(d, f)).convert("RGB")


def side_by_side(doc, name, crop_h, dpi=60):
    panels = [("Original PDF", os.path.join(WORK, "pdfs", f"{doc}.pdf"))] + [(LAB[t], os.path.join(WORK, "render", t, f"{doc}.pdf")) for t in TOOLS]
    imgs = [page_png(p, dpi) for _, p in panels]
    w = imgs[0].width
    imgs = [i.crop((0, 0, w, min(crop_h, i.height))) for i in imgs]
    gap, head = 16, 48
    W = len(imgs) * w + (len(imgs) + 1) * gap
    H = head + crop_h + gap
    canvas = Image.new("RGB", (W, H), SURF)
    dr = ImageDraw.Draw(canvas)
    f = ImageFont.truetype(FONTB, 20)
    for k, ((title, _), im) in enumerate(zip(panels, imgs)):
        x = gap + k * (w + gap)
        dr.text((x, 14), title, font=f, fill=INK)
        canvas.paste(im, (x, head))
        dr.rectangle([x - 1, head - 1, x + w, head + im.height], outline=GRID, width=2)
    canvas.save(os.path.join(DEST, name), "WEBP", quality=90)
    print(name, canvas.size)


side_by_side("03-invoice", "pdf-to-word-invoice-table-comparison.webp", 360)
side_by_side("05-newsletter", "pdf-to-word-two-column-newsletter.webp", 660)

# 5. 편집 테스트: 첫 문단에 문장을 넣은 뒤
ims = [Image.open(os.path.join(WORK, "edited", f"{t}-1.png")).convert("RGB") for t in ["libreoffice", "pdf2docx", "calibre"]]
ims = [i.crop((60, 55, 500, 300)) for i in ims]
gap, head = 16, 48
w, h = ims[0].size
canvas = Image.new("RGB", (3 * w + 4 * gap, head + h + gap), SURF)
dr = ImageDraw.Draw(canvas)
f = ImageFont.truetype(FONTB, 18)
for k, (t, im) in enumerate(zip(["libreoffice", "pdf2docx", "calibre"], ims)):
    x = gap + k * (w + gap)
    dr.text((x, 14), LAB[t], font=f, fill=INK)
    canvas.paste(im, (x, head))
    dr.rectangle([x - 1, head - 1, x + w, head + h], outline=GRID, width=2)
canvas.save(os.path.join(DEST, "pdf-to-word-editing-test.webp"), "WEBP", quality=92)
print("pdf-to-word-editing-test.webp", canvas.size)
