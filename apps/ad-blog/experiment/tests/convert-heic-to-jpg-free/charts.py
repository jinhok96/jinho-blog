"""summary.json·변환 결과·스크린샷 → 글 이미지 (webp).

사용: python charts.py <작업 폴더(/tmp/heic: out, shots 포함)> <출력 폴더>
"""

import io
import json
import os
import sys

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from PIL import Image, ImageCms, ImageDraw, ImageFont, ImageOps  # noqa: E402

WORK, DEST = sys.argv[1], sys.argv[2]
os.makedirs(DEST, exist_ok=True)
HERE = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(os.path.join(HERE, "summary.json")))
TOOLS = ["xnconvert", "magick", "gimp"]
LAB = {"xnconvert": "XnConvert 1.118", "magick": "ImageMagick 7.1.2", "gimp": "GIMP 3.2.6"}
SURF, INK, INK2, GRID, BLUE, RED = "#fcfcfb", "#0b0b0b", "#52514e", "#e4e3df", "#2a78d6", "#d0473a"
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 15, "text.color": INK, "axes.labelcolor": INK2, "xtick.color": INK2, "ytick.color": INK})
FOOT = "ToolProof test, Oct 2026 · 24 HEIC photos (4032×3024, Display P3, with GPS and date) · 4-core CPU · default settings"
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


def bars(ax, vals, fmt, title, xmax, labels=True, colors=None):
    y = list(range(len(TOOLS)))[::-1]
    ax.barh(y, vals, color=colors or BLUE, height=0.6)
    for yi, v in zip(y, vals):
        ax.text(v + xmax * 0.02, yi, fmt(v), va="center", fontsize=15, color=INK)
    ax.set_yticks(y)
    ax.set_yticklabels([LAB[t] for t in TOOLS] if labels else [""] * len(TOOLS))
    ax.set_xlim(0, xmax)
    ax.set_xticks([])
    ax.set_title(title, loc="left", fontsize=15, color=INK, pad=10)
    style(ax)


# 1. 대표 이미지: 기본 설정에서 색·위치·속도
fig, axes = plt.subplots(1, 3, figsize=(12, 6.75), facecolor=SURF, gridspec_kw={"wspace": 0.12})
fig.subplots_adjust(left=0.18, right=0.97, top=0.78, bottom=0.12)
de = [S[t]["deltaE_median"] for t in TOOLS]
bars(axes[0], de, lambda v: f"{v:.2f}", "Color shift vs original\n(ΔE2000, lower is better)", 2.4, colors=[RED if v > 1 else BLUE for v in de])
gps = [S[t]["gps_kept"] for t in TOOLS]
bars(axes[1], gps, lambda v: f"{v:.0f} of 24", "Photos that kept\nlocation and date", 33, labels=False, colors=[RED if v == 0 else BLUE for v in gps])
bars(axes[2], [S[t]["sec_24_median"] for t in TOOLS], lambda v: f"{v:.0f} s", "Seconds to convert\nall 24 photos", 92, labels=False)
fig.text(0.02, 0.93, "HEIC to JPG with free offline tools: what the default settings keep", fontsize=20, weight="bold", color=INK)
fig.text(0.02, 0.03, FOOT, fontsize=11.5, color=INK2)
save_fig(fig, "heic-to-jpg-default-settings-chart.webp")
plt.close(fig)

# 2. 설정을 바꾼 뒤 색 차이 + 메모리
fig, axes = plt.subplots(1, 2, figsize=(12, 4.6), facecolor=SURF, gridspec_kw={"wspace": 0.12})
fig.subplots_adjust(left=0.18, right=0.97, top=0.76, bottom=0.14)
fixed = {"xnconvert": "xnconvert_icc", "magick": "magick", "gimp": "gimp_meta"}
bars(axes[0], [S[fixed[t]]["deltaE_median"] for t in TOOLS], lambda v: f"{v:.2f}", "Color shift after turning on\nthe color profile option (ΔE2000)", 2.4)
bars(axes[1], [S[t]["max_rss_mb"] for t in TOOLS], lambda v: f"{v:.0f} MB", "Peak memory while converting", 560, labels=False)
fig.text(0.02, 0.03, "Same 24 photos, median per photo. ImageMagick keeps the profile by default. 4-core CPU, 24 photos in one batch.", fontsize=11.5, color=INK2)
save_fig(fig, "heic-to-jpg-color-fixed-memory.webp")
plt.close(fig)

# 3. 색 비교: 같은 사진, 프로필 유지 vs 누락 (브라우저가 보여 주는 그대로 sRGB로 렌더링)
SRGB = ImageCms.createProfile("sRGB")


def shown(path):
    im = Image.open(path)
    icc = im.info.get("icc_profile")
    im = ImageOps.exif_transpose(im).convert("RGB")
    if icc:
        im = ImageCms.profileToProfile(im, ImageCms.ImageCmsProfile(io.BytesIO(icc)), SRGB, renderingIntent=1, outputMode="RGB")
    return im


def compare(n, box, name, title):
    a = shown(f"{WORK}/out/magick/{n}.jpg").crop(box)
    b = shown(f"{WORK}/out/gimp/{n}.jpg").crop(box)
    w = 590
    h = round(a.height * w / a.width)
    a, b = a.resize((w, h), Image.LANCZOS), b.resize((w, h), Image.LANCZOS)
    canvas = Image.new("RGB", (1200, h + 110), SURF)
    canvas.paste(a, (0, 70))
    canvas.paste(b, (610, 70))
    d = ImageDraw.Draw(canvas)
    f, fb = ImageFont.truetype(FONT, 19), ImageFont.truetype(FONTB, 21)
    d.text((0, 10), "Color profile kept (ImageMagick default)", font=fb, fill=INK)
    d.text((610, 10), "Color profile dropped (GIMP default)", font=fb, fill=INK)
    d.text((0, 40), f"ΔE2000 {S['magick']['per_file'][int(n) - 1]['deltaE']:.2f}", font=f, fill=INK2)
    d.text((610, 40), f"ΔE2000 {S['gimp']['per_file'][int(n) - 1]['deltaE']:.2f}", font=f, fill=INK2)
    d.text((0, h + 80), title, font=f, fill=INK2)
    canvas.save(os.path.join(DEST, name), "WEBP", quality=92)
    print(name)


compare("16", (800, 600, 3200, 2400), "heic-to-jpg-color-profile-comparison.webp", "Same HEIC photo, converted two ways. Without the profile, Display P3 colors are shown as sRGB and look duller.")


# 4·5. 스크린샷: 설정 위치 강조
def shot(src, crop, boxes, name, scale=1.0):
    im = Image.open(src).convert("RGB").crop(crop)
    d = ImageDraw.Draw(im)
    for b in boxes:
        d.rectangle(b, outline=RED, width=4)
    if scale != 1.0:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    im.save(os.path.join(DEST, name), "WEBP", quality=92)
    print(name, im.size)


shot(f"{WORK}/shots/xnc_output_jpg.png", (0, 0, 1400, 570), [(34, 444, 200, 490), (1106, 178, 1366, 202)], "xnconvert-output-preserve-color-profile.webp")
shot(f"{WORK}/shots/gimp_jpeg.png", (0, 0, 700, 574), [(26, 286, 180, 332), (10, 20, 316, 60)], "gimp-export-jpeg-save-exif-color-profile.webp")
