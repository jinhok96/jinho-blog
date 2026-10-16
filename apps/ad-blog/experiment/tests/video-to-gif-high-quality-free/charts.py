"""results.json·sweep.json·GIF 프레임 → 글 이미지 (webp).

사용: /tmp/v2g/venv/bin/python -I charts.py <작업 폴더(/tmp/v2g)> <출력 폴더>
"""

import io
import json
import os
import sys

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from PIL import Image, ImageDraw, ImageFont  # noqa: E402

ROOT, DEST = sys.argv[1:3]
os.makedirs(DEST, exist_ok=True)
HERE = os.path.dirname(os.path.abspath(__file__))
R = {(r["clip"], r["config"]): r for r in json.load(open(os.path.join(HERE, "results.json")))}
SW = json.load(open(os.path.join(HERE, "sweep.json")))
SURF, INK, INK2, GRID, BLUE, RED, TEAL = "#fcfcfb", "#0b0b0b", "#52514e", "#e4e3df", "#2a78d6", "#d0473a", "#1b9e77"
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 14, "text.color": INK, "axes.labelcolor": INK2, "xtick.color": INK2, "ytick.color": INK})
FONTB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
SET = ["ffmpeg-default", "ffmpeg-palette", "ffmpeg-palette-small", "gifski-q90", "gifski-q70", "imagemagick-default", "imagemagick-optimize"]
LAB = {"ffmpeg-default": "FFmpeg (default)", "ffmpeg-palette": "FFmpeg + palette", "ffmpeg-palette-small": "FFmpeg small palette",
       "gifski-q90": "gifski (default Q90)", "gifski-q70": "gifski Q70", "imagemagick-default": "ImageMagick (default)",
       "imagemagick-optimize": "ImageMagick Optimize", "original": "Original video frame"}
CLIPS = [("animation", "Animation (480 px)"), ("live-action", "Live action (480 px)"), ("screen", "Screen recording (640 px)")]
FOOT = "ToolProof test, Oct 2026 · 5-second clips at 15 fps · FFmpeg 9.0.2, gifski 1.34.0, ImageMagick 7.1.2-34 · 4-core CPU"


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


# 1. 대표 이미지: 클립별 GIF 크기 + SSIM
fig, axes = plt.subplots(1, 3, figsize=(12, 6.75), facecolor=SURF, gridspec_kw={"wspace": 0.08})
fig.subplots_adjust(left=0.205, right=0.985, top=0.76, bottom=0.12)
for i, (clip, title) in enumerate(CLIPS):
    ax = axes[i]
    vals = [R[(clip, s)]["size_kb"] / 1024 for s in SET]
    ssim = [R[(clip, s)]["ssim"] for s in SET]
    y = list(range(len(SET)))[::-1]
    ax.barh(y, vals, color=[RED if v < 0.8 else BLUE for v in ssim], height=0.62)
    for yi, v, q in zip(y, vals, ssim):
        ax.text(v + 0.15, yi, f"{v:.1f} MB · {q:.2f}", va="center", fontsize=11.5, color=INK)
    ax.set_yticks(y)
    ax.set_yticklabels([LAB[k] for k in SET] if i == 0 else [""] * len(SET))
    ax.set_xlim(0, 10.5)
    ax.set_title(title, loc="left", fontsize=14, color=INK, pad=8)
    style(ax)
fig.text(0.02, 0.92, "Video to GIF: file size and quality, same 75 frames", fontsize=19, weight="bold", color=INK)
fig.text(0.02, 0.865, "Shorter bar = smaller GIF. Number after the dot = SSIM vs. the original frames (1.00 = identical). Red = visibly broken colors.", fontsize=12, color=INK2)
fig.text(0.02, 0.04, FOOT, fontsize=10.5, color=INK2)
save_fig(fig, "video-to-gif-size-quality-chart.webp")
plt.close(fig)


def crops(clip, frame, box, names, out, cols, zoom=2):
    tiles = []
    for n in names:
        if n == "original":
            src = os.path.join(ROOT, "ref", clip, f"{frame:03d}.png")
        else:
            src = os.path.join(ROOT, "out", clip, f"{n}.frames", f"{frame:03d}.png")
        im = Image.open(src).convert("RGB").crop(box)
        tiles.append(im.resize((im.width * zoom, im.height * zoom), Image.NEAREST))
    w, h = tiles[0].size
    rows = (len(tiles) + cols - 1) // cols
    pad, lab = 14, 40
    font = ImageFont.truetype(FONTB, 24)
    sheet = Image.new("RGB", (cols * w + (cols + 1) * pad, rows * (h + lab) + (rows + 1) * pad), SURF)
    d = ImageDraw.Draw(sheet)
    for i, (t, n) in enumerate(zip(tiles, names)):
        x = pad + (i % cols) * (w + pad)
        y = pad + (i // cols) * (h + lab + pad)
        label = LAB[n] if n == "original" else f"{LAB[n]} · {R[(clip, n)]['size_kb'] / 1024:.1f} MB"
        d.text((x, y + 6), label, fill=INK, font=font)
        sheet.paste(t, (x, y + lab))
    sheet.save(os.path.join(DEST, out), "WEBP", quality=92)
    print(out, sheet.size)


# 2. 하늘 그라데이션 (애니메이션)
crops("animation", 37, (0, 0, 300, 170), ["original", "ffmpeg-default", "ffmpeg-palette", "ffmpeg-palette-small", "gifski-q90", "imagemagick-optimize"],
      "video-to-gif-sky-gradient-comparison.webp", 3)
# 3. 얼굴·피부 (실사)
crops("live-action", 30, (200, 20, 440, 180), ["original", "ffmpeg-default", "ffmpeg-palette", "gifski-q90"],
      "video-to-gif-live-action-faces.webp", 2)
# 4. 화면 녹화 글자
crops("screen", 40, (170, 60, 470, 200), ["original", "ffmpeg-default", "ffmpeg-palette", "gifski-q90"],
      "video-to-gif-screen-recording-text.webp", 2)

# 5. 폭·fps별 크기 (실사)
fig, ax = plt.subplots(figsize=(12, 5.6), facecolor=SURF)
fig.subplots_adjust(left=0.08, right=0.98, top=0.78, bottom=0.22)
labels = [f"{r['width']} px\n{r['fps']} fps" for r in SW]
x = list(range(len(SW)))
ax.bar([i - 0.2 for i in x], [r["ffmpeg_small_kb"] / 1024 for r in SW], width=0.38, color=BLUE, label="FFmpeg small palette")
ax.bar([i + 0.2 for i in x], [r["gifski_q90_kb"] / 1024 for r in SW], width=0.38, color=TEAL, label="gifski (default Q90)")
for i, r in enumerate(SW):
    ax.text(i - 0.2, r["ffmpeg_small_kb"] / 1024 + 0.1, f"{r['ffmpeg_small_kb'] / 1024:.1f}", ha="center", fontsize=11.5)
    ax.text(i + 0.2, r["gifski_q90_kb"] / 1024 + 0.1, f"{r['gifski_q90_kb'] / 1024:.1f}", ha="center", fontsize=11.5)
ax.set_xticks(x)
ax.set_xticklabels(labels)
ax.set_facecolor(SURF)
for s in ["top", "right", "left"]:
    ax.spines[s].set_visible(False)
ax.spines["bottom"].set_color(GRID)
ax.set_yticks([])
ax.legend(frameon=False, loc="upper left", fontsize=12)
fig.text(0.02, 0.92, "Width matters more than frame rate (GIF size in MB, live-action clip)", fontsize=17, weight="bold", color=INK)
fig.text(0.02, 0.86, "Doubling width (320 → 640 px) made files about 3.7x bigger; going from 10 to 15 fps made them about 1.4x bigger.", fontsize=12, color=INK2)
fig.text(0.02, 0.04, FOOT.replace("5-second clips at 15 fps", "same 5-second clip"), fontsize=10.5, color=INK2)
save_fig(fig, "video-to-gif-width-fps-size.webp")
plt.close(fig)

# 6. 시간·메모리 (3개 클립 합계·최대)
fig, axes = plt.subplots(1, 2, figsize=(12, 5.2), facecolor=SURF, gridspec_kw={"wspace": 0.1})
fig.subplots_adjust(left=0.205, right=0.97, top=0.76, bottom=0.12)
for ax, (key, title, agg, fmt, xmax) in zip(axes, [
        ("seconds", "Time to make all 3 GIFs (seconds)", sum, lambda v: f"{v:.1f} s", 75),
        ("peak_mb", "Peak memory (MB)", max, lambda v: f"{v:.0f} MB", 900)]):
    vals = [agg(R[(c, s)][key] for c, _ in CLIPS) for s in SET]
    y = list(range(len(SET)))[::-1]
    ax.barh(y, vals, color=BLUE, height=0.62)
    for yi, v in zip(y, vals):
        ax.text(v + xmax * 0.02, yi, fmt(v), va="center", fontsize=12.5)
    ax.set_yticks(y)
    ax.set_yticklabels([LAB[k] for k in SET] if ax is axes[0] else [""] * len(SET))
    ax.set_xlim(0, xmax)
    ax.set_title(title, loc="left", fontsize=14, pad=8)
    style(ax)
fig.text(0.02, 0.92, "Speed and memory: ImageMagick took 41-59 seconds, every other setup under 8", fontsize=18, weight="bold", color=INK)
fig.text(0.02, 0.865, "Median of 3 runs per clip. Input was the same PNG frames for every tool.", fontsize=12, color=INK2)
fig.text(0.02, 0.04, FOOT, fontsize=10.5, color=INK2)
save_fig(fig, "video-to-gif-speed-memory.webp")
plt.close(fig)
