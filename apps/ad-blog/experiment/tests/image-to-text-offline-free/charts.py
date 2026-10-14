"""summary.json·이미지·결과 → 글 이미지 (webp).

사용: python charts.py <작업 폴더(imgs, results 포함)>
출력: img/ (content/posts/images/image-to-text-offline-free/로 복사)
"""

import io
import json
import os
import sys
import textwrap

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from PIL import Image, ImageDraw, ImageFont  # noqa: E402

W = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__))
os.makedirs("img", exist_ok=True)
S = json.load(open(os.path.join(HERE, "summary.json")))
ORDER = ["tesseract", "tesseract-psm6", "rapidocr", "rapidocr-medium", "easyocr", "doctr", "doctr-fast"]
ORDER = [e for e in ORDER if e in S]
LAB = {"tesseract": "Tesseract 5.3", "tesseract-psm6": "Tesseract (--psm 6)", "rapidocr": "RapidOCR (small)",
       "rapidocr-medium": "RapidOCR (medium)", "easyocr": "EasyOCR 1.7", "doctr": "docTR (default)", "doctr-fast": "docTR (mobile)"}
CONDS = ["screenshot", "small", "scan", "photo", "receipt"]
CLAB = {"screenshot": "Screenshot", "small": "Tiny text", "scan": "Scanned page", "photo": "Phone photo", "receipt": "Receipt"}
SURF, INK, INK2, GRID, BLUE, GRAY = "#fcfcfb", "#0b0b0b", "#52514e", "#e4e3df", "#2a78d6", "#a9a8a3"
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 15, "text.color": INK, "axes.labelcolor": INK2,
                     "xtick.color": INK2, "ytick.color": INK})
FOOT = "ToolProof test, Oct 2026 · 50 images (10 per type) · 4-core CPU, no GPU · default settings"


def save(fig, path):
    b = io.BytesIO()
    fig.savefig(b, format="png", dpi=100, facecolor=SURF)
    Image.open(b).convert("RGB").save(path, "WEBP", quality=90)
    print(path)


def style(ax):
    ax.set_facecolor(SURF)
    for s in ["top", "right", "left"]:
        ax.spines[s].set_visible(False)
    ax.spines["bottom"].set_color(GRID)
    ax.tick_params(axis="y", length=0)


def bars(ax, labels, vals, fmt, title, xmax):
    y = list(range(len(labels)))[::-1]
    ax.barh(y, vals, color=BLUE, height=0.62)
    for yi, v in zip(y, vals):
        ax.text(v + xmax * 0.015, yi, fmt(v), va="center", fontsize=14, color=INK)
    ax.set_yticks(y)
    ax.set_yticklabels(labels)
    ax.set_xlim(0, xmax)
    ax.set_title(title, loc="left", fontsize=16, color=INK, pad=12)
    ax.grid(axis="x", color=GRID, lw=1)
    ax.set_axisbelow(True)
    style(ax)


MAIN = [e for e in ORDER if e != "tesseract-psm6"]
labels = [LAB[e] for e in MAIN]

# 1. 대표 이미지: 조건별 단어 인식률 표 (셀 = 단어 재현율 %)
HEAT = ORDER
fig, ax = plt.subplots(figsize=(12, 6.75))
data = [[S[e]["by_cond"][c]["word_recall_mean"] * 100 for c in CONDS] for e in HEAT]
cmap = matplotlib.colors.LinearSegmentedColormap.from_list("b", ["#f3d9c9", "#f7f1e3", "#cfe2f6", "#2a78d6"])
norm = matplotlib.colors.Normalize(vmin=60, vmax=100)
for i, row in enumerate(data):
    for j, v in enumerate(row):
        ax.add_patch(plt.Rectangle((j, i), 0.96, 0.9, color=cmap(norm(max(v, 60)))))
        ax.text(j + 0.48, i + 0.45, f"{v:.1f}%", ha="center", va="center", fontsize=17,
                color="white" if v >= 96 else INK, fontweight="bold" if v == max(r[j] for r in data) else "normal")
ax.set_xlim(0, len(CONDS))
ax.set_ylim(len(HEAT), -0.15)
ax.set_xticks([j + 0.48 for j in range(len(CONDS))])
ax.set_xticklabels([CLAB[c] for c in CONDS], fontsize=15)
ax.xaxis.tick_top()
ax.set_yticks([i + 0.45 for i in range(len(HEAT))])
ax.set_yticklabels([LAB[e] for e in HEAT], fontsize=15)
for s in ax.spines.values():
    s.set_visible(False)
ax.tick_params(length=0)
fig.suptitle("Free offline OCR: share of words read correctly, by image type", x=0.012, ha="left", fontsize=20,
             fontweight="bold", color=INK, y=0.975)
fig.text(0.012, 0.015, FOOT + " · higher is better", fontsize=12, color=INK2)
fig.subplots_adjust(left=0.2, right=0.985, top=0.80, bottom=0.07)
save(fig, "img/offline-ocr-accuracy-by-image-type.webp")

# 2. 속도·메모리
fig, (a, b) = plt.subplots(1, 2, figsize=(12, 6), sharey=True, gridspec_kw={"wspace": 0.08})
sec = [S[e]["overall"]["sec_median"] for e in MAIN]
ram = [S[e]["max_rss_gb"] for e in MAIN]
bars(a, labels, sec, lambda v: f"{v:.1f} s", "Seconds per image (median)", max(sec) * 1.25)
bars(b, labels, ram, lambda v: f"{v:.1f} GB", "Peak RAM", max(ram) * 1.25)
fig.text(0.012, 0.02, FOOT, fontsize=12, color=INK2)
fig.subplots_adjust(left=0.19, right=0.98, top=0.88, bottom=0.12)
save(fig, "img/offline-ocr-speed-memory.webp")

# 3. 테스트 이미지 예시 5종 (직접 생성한 이미지, 퍼블릭 도메인 텍스트)
samples = ["screenshot_00.png", "small_03.png", "scan_02.jpg", "photo_01.jpg", "receipt_04.jpg"]
canvas = Image.new("RGB", (1200, 760), SURF)
d = ImageDraw.Draw(canvas)
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 22)
boxes = [(20, 50, 580, 330), (620, 50, 1180, 330), (20, 410, 420, 740), (440, 410, 900, 740), (920, 410, 1180, 740)]
for (x0, y0, x1, y1), f, c in zip(boxes, samples, ["screenshot", "small", "scan", "photo", "receipt"]):
    im = Image.open(os.path.join(W, "imgs", f)).convert("RGB")
    im.thumbnail((x1 - x0, y1 - y0), Image.LANCZOS)
    canvas.paste(im, (x0, y0))
    d.text((x0, y0 - 34), CLAB[c], font=font, fill=INK)
canvas.save("img/offline-ocr-test-images.webp", "WEBP", quality=88)
print("img/offline-ocr-test-images.webp")


# 4. 영수증 실제 출력 비교: Tesseract 기본 vs --psm 6 vs RapidOCR
def output(engine, file):
    for line in open(os.path.join(W, "results", f"{engine}.jsonl")).read().splitlines()[1:]:
        r = json.loads(line)
        if r["file"] == file:
            return [x for x in r["text"].splitlines() if x.strip()]
    return []


REC = "receipt_01.jpg"
cols = [("Tesseract (default)", output("tesseract", REC)), ("Tesseract --psm 6", output("tesseract-psm6", REC)),
        ("docTR (default)", output("doctr", REC))]
canvas = Image.new("RGB", (1200, 900), SURF)
d = ImageDraw.Draw(canvas)
mono = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", 15)
head = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
rec = Image.open(os.path.join(W, "imgs", REC)).convert("RGB")
rec.thumbnail((300, 840), Image.LANCZOS)
canvas.paste(rec, (16, 44))
d.text((16, 12), "Input image", font=head, fill=INK)
x, bottom = 340, 0
for title, lines in cols:
    d.text((x, 12), title, font=head, fill=INK)
    y = 48
    for ln in lines[:44]:
        for part in textwrap.wrap(ln, 30) or [""]:
            d.text((x, y), part, font=mono, fill=INK2)
            y += 19
    bottom = max(bottom, y, 44 + rec.height)
    x += 290
canvas = canvas.crop((0, 0, 1200, max(bottom + 24, 675)))
canvas.save("img/offline-ocr-receipt-output.webp", "WEBP", quality=90)
print("img/offline-ocr-receipt-output.webp")


# 5. 작은 글자 실제 출력 비교: 정답에 없는 단어는 주황색
import re  # noqa: E402

SMALL = "small_01.png"
TRUTH = {t["file"]: t["text"] for t in json.load(open(os.path.join(W, "imgs", "truth.json")))}
truth_words = set(re.sub(r"[^\w']", " ", TRUTH[SMALL].lower()).split())
canvas = Image.new("RGB", (1200, 675), SURF)
d = ImageDraw.Draw(canvas)
src = Image.open(os.path.join(W, "imgs", SMALL)).convert("RGB")
crop = src.crop((0, 0, src.width, 70))
canvas.paste(crop, (16, 48))
d.text((16, 12), "Input: 11px text from a screenshot (actual size)", font=head, fill=INK)
body = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 17)
y = 140
for eng in ["tesseract", "rapidocr", "easyocr", "doctr"]:
    d.text((16, y), LAB[eng], font=head, fill=INK)
    y += 30
    text = " ".join(output(eng, SMALL))
    text = text[: text.rfind(" ", 0, 230)]  # 단어 중간에서 자르지 않음
    x = 16
    for wd in text.split():
        core = re.sub(r"[^\w']", "", wd.lower())
        ok = core in truth_words if core else not re.search(r"\w", wd)
        wpx = d.textlength(wd + " ", font=body)
        if x + wpx > 1180:
            x, y = 16, y + 25
        d.text((x, y), wd, font=body, fill=INK2 if ok else "#d95f02")
        x += wpx
    y += 44
d.text((16, 645), "Orange = word not in the original text. About the first 230 characters of each tool's output, default settings.", font=body, fill=INK2)
canvas.save("img/offline-ocr-tiny-text-output.webp", "WEBP", quality=90)
print("img/offline-ocr-tiny-text-output.webp")
