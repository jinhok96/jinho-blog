"""results.json + 출력 영상 프레임 → 글 이미지 (webp).

사용: /tmp/cv/venv/bin/python -I charts.py <작업 폴더(/tmp/cv)> <출력 폴더>
"""

import glob
import io
import json
import os
import subprocess
import sys

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from PIL import Image, ImageDraw, ImageFont  # noqa: E402

ROOT, DEST = sys.argv[1:3]
os.makedirs(DEST, exist_ok=True)
HERE = os.path.dirname(os.path.abspath(__file__))
R = json.load(open(os.path.join(HERE, "results.json")))
FF = glob.glob(os.path.join(ROOT, "tools/ffmpeg-n9*/bin/ffmpeg"))[0]
SURF, INK, INK2, GRID, BLUE, RED, AMBER = "#fcfcfb", "#0b0b0b", "#52514e", "#e4e3df", "#2a78d6", "#d0473a", "#c98a00"
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 14, "text.color": INK, "axes.labelcolor": INK2,
                     "xtick.color": INK2, "ytick.color": INK})
FONTB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
CLIPS = [("animation", "Animation"), ("live-action", "Live action"), ("screen", "Screen recording")]
FOOT = "ToolProof test, Oct 2026 · three 60-second 1080p clips · HandBrake 1.11.2, FFmpeg 9.0.2 · 4-core CPU, no GPU"
MAIN = [
    ("hb-fast-1080p30", "HandBrake Fast 1080p30 (default)"),
    ("ff-x264-crf23", "FFmpeg default (x264 CRF 23)"),
    ("hb-social-25mb-1min", "HandBrake Social 25 MB 1 Minute"),
    ("ff-x264-24mb-1080p", "FFmpeg x264 aimed at 24 MB"),
    ("hb-19mb-1080p", "HandBrake + Avg Bitrate for 19 MB"),
    ("ff-x264-19mb-1080p", "FFmpeg x264 aimed at 19 MB"),
    ("ff-x265-19mb-1080p", "FFmpeg x265 aimed at 19 MB"),
    ("ff-av1-19mb-1080p", "FFmpeg AV1 aimed at 19 MB"),
    ("hb-social-10mb-1min", "HandBrake Social 10 MB 1 Minute"),
    ("ff-x264-9mb-720p", "FFmpeg x264 720p aimed at 9.5 MB"),
]


def r(clip, s):
    return R[f"{clip}--{s}"]


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


# 1. 대표 이미지: 설정별 클립 3개 크기 + 용량 한도선
fig, axes = plt.subplots(1, 3, figsize=(12, 6.75), facecolor=SURF, gridspec_kw={"wspace": 0.1})
fig.subplots_adjust(left=0.255, right=0.985, top=0.78, bottom=0.12)
for i, (clip, title) in enumerate(CLIPS):
    ax = axes[i]
    y = list(range(len(MAIN)))[::-1]
    sizes = [r(clip, s)["bytes"] / 1e6 for s, _ in MAIN]
    ax.barh(y, sizes, color=[RED if v > 20 else BLUE for v in sizes], height=0.62)
    for yi, (s, _), v in zip(y, MAIN, sizes):
        ax.text(v + 0.5, yi, f"{v:.1f} · {r(clip, s)['vmaf_mean']:.1f}", va="center", fontsize=10.5, color=INK)
    for lim, lab in [(10, "10"), (20, "20"), (25, "25")]:
        ax.axvline(lim, color=INK2 if lim == 20 else GRID, lw=1.2, ls="--", zorder=0)
    ax.set_xlim(0, 46)
    ax.set_xticks([0, 10, 20, 25, 40])
    ax.set_xticklabels(["0", "10", "20", "25", "40"], fontsize=11)
    ax.set_yticks(y)
    ax.set_yticklabels([lab for _, lab in MAIN] if i == 0 else [""] * len(MAIN), fontsize=11.5)
    ax.set_title(title, loc="left", fontsize=14, color=INK, pad=8)
    style(ax)
fig.text(0.02, 0.93, "Compressing a 1-minute 1080p video: size and quality", fontsize=19, weight="bold", color=INK)
fig.text(0.02, 0.875, "Bar = file size in MB, number after the dot = VMAF quality (100 = identical). Red = over Discord's 20 MB free limit.",
         fontsize=12, color=INK2)
fig.text(0.02, 0.04, FOOT, fontsize=10.5, color=INK2)
save_fig(fig, "compress-video-size-quality-chart.webp")
plt.close(fig)

# 2. 19MB 목표에서 인코더별 VMAF (평균 + 하위 5% 프레임)
T19 = [("hb-19mb-1080p", "HandBrake\nH.264"), ("ff-x264-19mb-720p", "FFmpeg\nH.264\n1280 wide"),
       ("ff-x264-19mb-1080p", "FFmpeg\nH.264"), ("ff-x265-19mb-1080p", "FFmpeg\nH.265"),
       ("ff-av1-19mb-1080p", "FFmpeg\nAV1")]
fig, axes = plt.subplots(1, 2, figsize=(12, 6.2), facecolor=SURF, gridspec_kw={"wspace": 0.12})
fig.subplots_adjust(left=0.06, right=0.99, top=0.8, bottom=0.24)
for ax, clip, title in [(axes[0], "animation", "Animation"), (axes[1], "live-action", "Live action")]:
    x = range(len(T19))
    m = [r(clip, s)["vmaf_mean"] for s, _ in T19]
    p = [r(clip, s)["vmaf_p5"] for s, _ in T19]
    ax.bar([i - 0.2 for i in x], m, 0.38, color=BLUE, label="Average")
    ax.bar([i + 0.2 for i in x], p, 0.38, color=AMBER, label="Worst 5% of frames")
    for i in x:
        ax.text(i - 0.2, m[i] + 0.3, f"{m[i]:.1f}", ha="center", fontsize=10.5)
        ax.text(i + 0.2, p[i] + 0.3, f"{p[i]:.1f}", ha="center", fontsize=10.5)
    ax.set_ylim(75, 100)
    ax.set_xticks(list(x))
    ax.set_xticklabels([lab for _, lab in T19], fontsize=10.5)
    ax.set_title(title, loc="left", fontsize=14, pad=8)
    ax.set_facecolor(SURF)
    for s in ["top", "right"]:
        ax.spines[s].set_visible(False)
    ax.spines["left"].set_color(GRID)
    ax.spines["bottom"].set_color(GRID)
axes[0].legend(frameon=False, fontsize=11, loc="upper left")
fig.text(0.02, 0.93, "Same 19 MB budget, different encoders: VMAF quality", fontsize=19, weight="bold")
fig.text(0.02, 0.875, "Higher is better. Full 1920 width unless noted. All files 15.5-19.0 MB for 60 s with 128 kbps audio. Screen recording: 97-99.6 on all.",
         fontsize=12, color=INK2)
fig.text(0.02, 0.03, FOOT, fontsize=10.5, color=INK2)
save_fig(fig, "compress-video-encoder-quality-19mb.webp")
plt.close(fig)

# 3. 인코딩 시간 (클립 3개 합계)
TT = [("hb-social-10mb-1min", "HandBrake Social 10 MB"), ("hb-19mb-1080p", "HandBrake + Avg Bitrate 19 MB"),
      ("ff-x264-crf23", "FFmpeg default (CRF 23)"), ("ff-x264-19mb-1080p", "FFmpeg x264 two-pass 19 MB"),
      ("ff-av1-19mb-1080p", "FFmpeg AV1 19 MB"), ("ff-x265-19mb-1080p", "FFmpeg x265 two-pass 19 MB")]
fig, ax = plt.subplots(figsize=(12, 5.6), facecolor=SURF)
fig.subplots_adjust(left=0.27, right=0.95, top=0.8, bottom=0.14)
y = list(range(len(TT)))[::-1]
tot = [sum(r(c, s)["seconds"] for c, _ in CLIPS) / 60 for s, _ in TT]
ax.barh(y, tot, color=BLUE, height=0.6)
for yi, v, (s, _) in zip(y, tot, TT):
    mem = max(r(c, s)["max_rss_mb"] for c, _ in CLIPS)
    ax.text(v + 0.05, yi, f"{v:.1f} min · peak {mem} MB RAM", va="center", fontsize=11.5)
ax.set_yticks(y)
ax.set_yticklabels([lab for _, lab in TT], fontsize=12)
ax.set_xlim(0, 9.6)
ax.set_xticks([])
style(ax)
fig.text(0.02, 0.92, "Time to compress three 1-minute 1080p clips", fontsize=19, weight="bold")
fig.text(0.02, 0.865, "One run per setting, total for all three clips. Two-pass encodes include both passes.", fontsize=12, color=INK2)
fig.text(0.02, 0.04, FOOT, fontsize=10.5, color=INK2)
save_fig(fig, "compress-video-encoding-time.webp")
plt.close(fig)


# 4·5. 같은 프레임 확대 비교
def frame(path, n, w, h):
    raw = subprocess.check_output([FF, "-v", "error", "-i", path, "-vf",
                                   f"select=eq(n\\,{n}),scale={w}:{h}:flags=bicubic", "-frames:v", "1",
                                   "-f", "rawvideo", "-pix_fmt", "rgb24", "-"])
    return Image.frombytes("RGB", (w, h), raw)


def crops(clip, n, box, items, out, cols, zoom):
    w, h = (1920, 800) if clip == "live-action" else (1920, 1080)
    tiles = []
    for key, lab in items:
        path = os.path.join(ROOT, "src_clips", f"{clip}.mp4") if key == "original" else os.path.join(ROOT, "out", f"{clip}--{key}.mp4")
        im = frame(path, n, w, h).crop(box)
        tiles.append((im.resize((im.width * zoom, im.height * zoom), Image.LANCZOS), lab))
    tw, th = tiles[0][0].size
    pad, lab_h = 12, 34
    rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * tw + (cols + 1) * pad, rows * (th + lab_h) + (rows + 1) * pad), SURF)
    d = ImageDraw.Draw(sheet)
    font = ImageFont.truetype(FONTB, 19)
    for i, (im, lab) in enumerate(tiles):
        x = pad + (i % cols) * (tw + pad)
        yy = pad + (i // cols) * (th + lab_h + pad)
        d.text((x, yy + 4), lab, fill=INK, font=font)
        sheet.paste(im, (x, yy + lab_h))
    sheet.save(os.path.join(DEST, out), "WEBP", quality=90)
    print(out, sheet.size)


def lab(clip, key, name):
    x = r(clip, key)
    return f"{name}: {x['bytes'] / 1e6:.1f} MB, {x['width']}×{x['height']}"


crops("screen", 900, (700, 250, 1100, 475),
      [("original", "Original (1920×1080)"),
       ("hb-social-10mb-1min", lab("screen", "hb-social-10mb-1min", "HandBrake Social 10 MB")),
       ("ff-x264-9mb-720p", lab("screen", "ff-x264-9mb-720p", "FFmpeg x264")),
       ("ff-x264-19mb-1080p", lab("screen", "ff-x264-19mb-1080p", "FFmpeg x264"))],
      "compress-video-screen-text-comparison.webp", 2, 2)
crops("live-action", 1260, (620, 140, 1100, 410),
      [("original", "Original (1920×800)"),
       ("hb-social-10mb-1min", lab("live-action", "hb-social-10mb-1min", "HandBrake Social 10 MB")),
       ("hb-19mb-1080p", lab("live-action", "hb-19mb-1080p", "HandBrake Avg Bitrate")),
       ("ff-x264-19mb-1080p", lab("live-action", "ff-x264-19mb-1080p", "FFmpeg H.264")),
       ("ff-x265-19mb-1080p", lab("live-action", "ff-x265-19mb-1080p", "FFmpeg H.265")),
       ("ff-av1-19mb-1080p", lab("live-action", "ff-av1-19mb-1080p", "FFmpeg AV1"))],
      "compress-video-live-action-faces.webp", 3, 1)
