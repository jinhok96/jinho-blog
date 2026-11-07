"""free-image-converter-photo-tools 허브 글 그래픽 (데이터: photo-video 상시 글 6편의 측정 결과)

실행: python3 -I charts.py <출력 폴더>
"""

import sys
import textwrap
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
from matplotlib.patches import FancyBboxPatch  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else '.'

# 작업, 추천, 종류, 근거 한 줄. 출처: 각 글의 요약 표·Which one should you use
PICKS = [
    ('HEIC to JPG', 'XnConvert', 'App', 'Faster of 2 apps: 24 photos in 33 seconds, all upright. Tick Preserve color profile'),
    ('WebP to JPG', 'XnConvert', 'App', 'Smallest JPGs of 5 tools (1.66x the WebP). For transparent images, ezgif'),
    ('Photo under 100 KB', 'Resize, then GIMP', 'App', 'At 1024 px, 20 of 20 photos fit with medium quality. At full size, 14 of 20'),
    ('Remove a background', 'iLoveIMG', 'Website', 'Only site with free full-size cutouts, no account. 17 of 20 clean'),
    ('Remove photo metadata', 'ExifCleaner', 'App', 'Removed all personal data and kept portraits upright. Website: ExifRemove'),
    ('Video for Discord', 'HandBrake', 'App', 'A bitrate set for 19 MB gave 17 to 19 MB files at 1080p. Social 25 MB went over'),
]

# 도구·기본값, 측정에서 생긴 일, 고치는 법. 출처: 각 글의 결과 절
TRAPS = [
    ('XnConvert, HEIC to JPG', 'Dropped the color profile: duller colors', 'Tick Preserve color profile'),
    ('XnConvert, any job', 'Kept the GPS location in 24 of 24 photos', 'Untick Preserve Metadata'),
    ('GIMP, JPEG export', 'Save Exif and Save color profile were off', 'Tick both before Export'),
    ('iLoveIMG, WebP to JPG', 'Filled transparent areas with black', 'Use ezgif, or save as PNG'),
    ('ExifCleaner 4.6.0', 'Save as copy on: 8 of 8 photos failed', 'Turn it off, clean copies'),
    ('Jimpl, Verexif, IMGonline', 'Turned 2 of 2 portrait photos sideways', 'Use ExifRemove or ExifCleaner'),
    ('HandBrake Social 25 MB', 'Made 20.2 to 23.9 MB files, over 20 MB', 'Set a bitrate for 19 MB'),
]


def picks():
    fig = cs.plt.figure(figsize=cs.FIGSIZE)
    ax = fig.add_axes([0.03, 0.11, 0.94, 0.72])
    ax.set_xlim(0, 3)
    ax.set_ylim(2, 0)
    ax.axis('off')
    w, h, gap = 0.96, 0.92, 0.04
    for k, (job, pick, kind, why) in enumerate(PICKS):
        col, row = k % 3, k // 3
        x, y = col + gap / 2, row + gap
        ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0,rounding_size=0.03', mutation_aspect=0.6,
                                    facecolor=cs.SURFACE, edgecolor=cs.BORDER, lw=1, zorder=1))
        ax.text(x + 0.05, y + 0.14, job, fontsize=14, fontweight='semibold', color=cs.MUTED, va='center')
        ax.text(x + 0.05, y + 0.33, pick, fontsize=20, fontweight='bold', color=cs.ACCENT, va='center')
        ax.text(x + w - 0.05, y + 0.14, kind, fontsize=12, fontweight='semibold', ha='right', va='center',
                color=cs.FOREGROUND)
        ax.text(x + 0.05, y + 0.52, textwrap.fill(why, 34), fontsize=12.5, va='top', linespacing=1.35)
    cs.header(fig, 'Best free tool for each photo and video job, from our tests',
              '14 free tools on 6 jobs, each job tested on its own set of test files (Oct 15-22, 2026)')
    cs.footer(fig, 'App = installs on Windows, Mac and Linux, files stay on your computer. Website = your file is uploaded.',
              'Source: ToolProof tests of HEIC and WebP to JPG, 100 KB photos, background removal, metadata removal and video compression')
    cs.save(fig, f'{OUT}/best-free-photo-tool-per-job.webp')


def traps():
    fig = cs.plt.figure(figsize=cs.FIGSIZE)
    ax = fig.add_axes([0.03, 0.11, 0.94, 0.71])
    ax.set_xlim(0, 1)
    ax.set_ylim(len(TRAPS) - 0.5, -1.1)
    ax.axis('off')
    cols = [(0.0, 'Tool and default'), (0.34, 'What happened in our test'), (0.71, 'Fix')]
    for x, label in cols:
        ax.text(x, -0.75, label, fontsize=13, fontweight='semibold', color=cs.MUTED, va='center')
    ax.plot([0, 1], [-0.45, -0.45], color=cs.BORDER, lw=1)
    for i, (tool, what, fix) in enumerate(TRAPS):
        ax.text(0.0, i, tool, fontsize=14, fontweight='semibold', va='center')
        ax.text(0.34, i, what, fontsize=13.5, va='center')
        ax.text(0.71, i, fix, fontsize=13.5, fontweight='semibold', color=cs.ACCENT, va='center')
        ax.plot([0, 1], [i + 0.5, i + 0.5], color=cs.BORDER, lw=1)
    cs.header(fig, 'Default settings that changed the result',
              'Seven things the default settings did in our tests, and the setting or tool that fixed each one')
    cs.footer(fig, 'Discord limit: 20 MB per file on free accounts, per Discord Help Center (October 2026).',
              'Source: ToolProof tests, Oct 15-22, 2026 (XnConvert 1.118, GIMP 3.2.6, ExifCleaner 4.6.0, HandBrake 1.11.2, 4 websites)')
    cs.save(fig, f'{OUT}/photo-tool-default-traps.webp')


picks()
traps()
