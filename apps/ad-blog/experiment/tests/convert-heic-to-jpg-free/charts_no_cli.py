"""명령줄 도구(ImageMagick)를 뺀 그래프 다시 그리기 (2026-10-17).

charts.py의 1·2와 같은 크기·파일명·스타일. summary.json만 읽고 측정값은 바꾸지 않음.
3(색 비교)은 변환 결과 원본(/tmp/heic/out)이 없어 다시 만들 수 없으므로,
기존 이미지의 왼쪽 제목에서 "(ImageMagick default)"만 지움 (사진·수치는 그대로).

사용: python -I charts_no_cli.py <출력 폴더(content/posts/images/convert-heic-to-jpg-free)>
"""

import io
import json
import os
import sys

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from PIL import Image, ImageDraw, ImageFont  # noqa: E402

DEST = sys.argv[1]
os.makedirs(DEST, exist_ok=True)
HERE = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(os.path.join(HERE, "summary.json")))
TOOLS = ["xnconvert", "gimp"]
LAB = {"xnconvert": "XnConvert 1.118", "gimp": "GIMP 3.2.6"}
SURF, INK, INK2, GRID, BLUE, RED = "#fcfcfb", "#0b0b0b", "#52514e", "#e4e3df", "#2a78d6", "#d0473a"
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 15, "text.color": INK, "axes.labelcolor": INK2, "xtick.color": INK2, "ytick.color": INK})
FOOT = "ToolProof test, Oct 2026 · 24 HEIC photos (4032×3024, Display P3, with GPS and date) · 4-core CPU · default settings"
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
    ax.barh(y, vals, color=colors or BLUE, height=0.5)
    for yi, v in zip(y, vals):
        ax.text(v + xmax * 0.02, yi, fmt(v), va="center", fontsize=15, color=INK)
    ax.set_yticks(y)
    ax.set_yticklabels([LAB[t] for t in TOOLS] if labels else [""] * len(TOOLS))
    ax.set_ylim(-0.7, len(TOOLS) - 0.3)
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
fixed = {"xnconvert": "xnconvert_icc", "gimp": "gimp_meta"}
bars(axes[0], [S[fixed[t]]["deltaE_median"] for t in TOOLS], lambda v: f"{v:.2f}", "Color shift after turning on\nthe color profile option (ΔE2000)", 2.4)
bars(axes[1], [S[t]["max_rss_mb"] for t in TOOLS], lambda v: f"{v:.0f} MB", "Peak memory while converting", 560, labels=False)
fig.text(0.02, 0.03, "Same 24 photos, median per photo. 4-core CPU, 24 photos in one batch.", fontsize=11.5, color=INK2)
save_fig(fig, "heic-to-jpg-color-fixed-memory.webp")
plt.close(fig)

# 3. 색 비교 이미지: 왼쪽 제목의 도구 이름만 지움 (charts.py compare()와 같은 위치·글꼴)
p = os.path.join(DEST, "heic-to-jpg-color-profile-comparison.webp")
im = Image.open(p).convert("RGB")
d = ImageDraw.Draw(im)
d.rectangle((0, 0, 605, 38), fill=SURF)
d.text((0, 10), "Color profile kept", font=ImageFont.truetype(FONTB, 21), fill=INK)
im.save(p, "WEBP", quality=92)
print("heic-to-jpg-color-profile-comparison.webp", im.size)
