"""명령줄 도구(FFmpeg)를 뺀 글 이미지 다시 만들기 (2026-10-17).

charts.py와 같은 파일명·스타일. results.json만 읽고 측정값은 바꾸지 않음.
- 1. 대표 그래프: FFmpeg 행 삭제, HandBrake 4개 설정만
- 3. 인코딩 시간: FFmpeg 행 삭제, HandBrake 설정 7개(전체 결과 표의 HandBrake 행과 같음)
- 4·5. 확대 비교: 원본 영상(/tmp/cv)이 없어 다시 뽑을 수 없으므로, 기존 시트에서
  FFmpeg 타일이 있는 아래 줄을 잘라냄 (위 줄의 원본·HandBrake 타일은 픽셀 그대로)
- 2. 인코더별 VMAF(19MB)는 FFmpeg 막대를 빼면 HandBrake 1개만 남아 다시 그리지 않음 (글에서 뺌)

사용: python -I charts_no_cli.py <출력 폴더(content/posts/images/compress-video-for-discord-email)>
"""

import io
import json
import os
import sys

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from PIL import Image  # noqa: E402

DEST = sys.argv[1]
os.makedirs(DEST, exist_ok=True)
HERE = os.path.dirname(os.path.abspath(__file__))
R = json.load(open(os.path.join(HERE, "results.json")))
SURF, INK, INK2, GRID, BLUE, RED = "#fcfcfb", "#0b0b0b", "#52514e", "#e4e3df", "#2a78d6", "#d0473a"
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 14, "text.color": INK, "axes.labelcolor": INK2,
                     "xtick.color": INK2, "ytick.color": INK})
CLIPS = [("animation", "Animation"), ("live-action", "Live action"), ("screen", "Screen recording")]
FOOT = "ToolProof test, Oct 2026 · three 60-second 1080p clips · HandBrake 1.11.2 · 4-core CPU, no GPU"
MAIN = [
    ("hb-fast-1080p30", "HandBrake Fast 1080p30 (default)"),
    ("hb-social-25mb-1min", "HandBrake Social 25 MB 1 Minute"),
    ("hb-19mb-1080p", "HandBrake + Avg Bitrate for 19 MB"),
    ("hb-social-10mb-1min", "HandBrake Social 10 MB 1 Minute"),
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
    ax.barh(y, sizes, color=[RED if v > 20 else BLUE for v in sizes], height=0.55)
    for yi, (s, _), v in zip(y, MAIN, sizes):
        ax.text(v + 0.5, yi, f"{v:.1f} · {r(clip, s)['vmaf_mean']:.1f}", va="center", fontsize=11.5, color=INK)
    for lim in (10, 20, 25):
        ax.axvline(lim, color=INK2 if lim == 20 else GRID, lw=1.2, ls="--", zorder=0)
    ax.set_xlim(0, 46)
    ax.set_xticks([0, 10, 20, 25, 40])
    ax.set_xticklabels(["0", "10", "20", "25", "40"], fontsize=11)
    ax.set_yticks(y)
    ax.set_yticklabels([lab for _, lab in MAIN] if i == 0 else [""] * len(MAIN), fontsize=11.5)
    ax.set_ylim(-0.6, len(MAIN) - 0.4)
    ax.set_title(title, loc="left", fontsize=14, color=INK, pad=8)
    style(ax)
fig.text(0.02, 0.93, "Compressing a 1-minute 1080p video: size and quality", fontsize=19, weight="bold", color=INK)
fig.text(0.02, 0.875, "Bar = file size in MB, number after the dot = VMAF quality (100 = identical). Red = over Discord's 20 MB free limit.",
         fontsize=12, color=INK2)
fig.text(0.02, 0.04, FOOT, fontsize=10.5, color=INK2)
save_fig(fig, "compress-video-size-quality-chart.webp")
plt.close(fig)

# 3. 인코딩 시간 (클립 3개 합계), HandBrake 설정 7개
TT = [("hb-social-10mb-1min", "Social 10 MB 1 Minute"),
      ("hb-fast-1080p30-nodecomb", "Fast 1080p30, interlace detection off"),
      ("hb-social-25mb-1min", "Social 25 MB 1 Minute"),
      ("hb-fast-1080p30", "Fast 1080p30 (default)"),
      ("hb-19mb-1080p", "Avg Bitrate for 19 MB"),
      ("hb-19mb-1080p-slow", "Avg Bitrate 19 MB, preset slow"),
      ("hb-19mb-1080p-slow-high", "Avg Bitrate 19 MB, slow, profile high")]
fig, ax = plt.subplots(figsize=(12, 5.6), facecolor=SURF)
fig.subplots_adjust(left=0.31, right=0.95, top=0.8, bottom=0.14)
y = list(range(len(TT)))[::-1]
tot = [sum(r(c, s)["seconds"] for c, _ in CLIPS) / 60 for s, _ in TT]
ax.barh(y, tot, color=BLUE, height=0.6)
for yi, v in zip(y, tot):
    ax.text(v + 0.05, yi, f"{v:.1f} min", va="center", fontsize=11.5)
ax.set_yticks(y)
ax.set_yticklabels([lab for _, lab in TT], fontsize=12)
ax.set_xlim(0, 6)
ax.set_xticks([])
style(ax)
fig.text(0.02, 0.92, "Time to compress three 1-minute 1080p clips in HandBrake", fontsize=19, weight="bold")
fig.text(0.02, 0.865, "One run per setting, total for all three clips. Two-pass encodes include both passes.", fontsize=12, color=INK2)
fig.text(0.02, 0.04, FOOT, fontsize=10.5, color=INK2)
save_fig(fig, "compress-video-encoding-time.webp")
plt.close(fig)


# 4·5. 확대 비교 시트에서 위 줄만 남김 (charts.py crops(): pad 12, 제목 34px)
def top_row(name, tile_h):
    p = os.path.join(DEST, name)
    im = Image.open(p).convert("RGB")
    pad, lab_h = 12, 34
    im = im.crop((0, 0, im.width, pad + lab_h + tile_h + pad))
    im.save(p, "WEBP", quality=92)
    print(name, im.size)


top_row("compress-video-screen-text-comparison.webp", 450)  # 400×225 타일을 2배 확대
top_row("compress-video-live-action-faces.webp", 270)  # 480×270 타일
