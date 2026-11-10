"""iPhone 영상 MP4 변환 글 그래픽 6장 (1200×675 webp, ad-blog 디자인 시스템 라이트 모드).

수치는 results.jsonl(analyze_convert.py·align_psnr.py), 화면은 screens/*.webp
(Chromium 153 2026-11-10 UTC · LosslessCut 3.69.0 · VLC 3.0.20 · HandBrake 1.7.2, Linux, 2026-11-10 UTC). 내용 출처는 factcheck.md.
실행: /tmp/mvenv/bin/python -I charts.py <출력 폴더>
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch, Rectangle  # noqa: E402
from PIL import Image  # noqa: E402

HERE = Path(__file__).resolve().parent
SCREENS = HERE / 'screens'
OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'
CLIP = ('Test file: a 60-second HEVC .mov in the format iPhone records by default, with a recording date and location tag '
        '(Tears of Steel, CC BY 3.0, Blender Foundation).')


def box(ax, x, y, w, h, fill, edge=None, lw=0, r=0.012):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle=f'round,pad=0,rounding_size={r}',
                                facecolor=fill, edgecolor=edge or fill, lw=lw, zorder=1))


def results_table():
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Only the copy modes kept every original frame',
              'One iPhone-style .mov converted to MP4 in five free tools, then compared with the original frame by frame')
    ax = fig.add_axes([0.03, 0.115, 0.94, 0.73])
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    cols = [0.0, 0.30, 0.47, 0.62, 0.79]
    heads = ['Tool and setting', 'Frames identical\nto the original', 'Video inside\nthe MP4', 'Sound', 'Recording date\nand location']
    for x, h in zip(cols, heads):
        ax.text(x + 0.01, 0.985, h, fontsize=12, color=cs.MUTED, va='top', linespacing=1.25)
    rows = [
        ('LosslessCut', 'mp4 + Preserve all metadata', 'All 1,440', 'HEVC, copied', 'Copied', 'Both kept', True),
        ('LosslessCut', 'mp4, default settings', 'All 1,440', 'HEVC, copied', 'Copied', 'Date kept, no location', True),
        ('VLC', 'Keep original video and audio', '1,437 of 1,440', 'HEVC, copied', 'Copied', 'Date reset, no location', True),
        ('HandBrake', 'Fast 1080p30 (default)', 'None (42.0 dB)', 'H.264', 'AAC 160 kbps', 'Date reset, no location', False),
        ('CloudConvert', 'Default settings', 'None (42.0 dB)', 'H.264', 'AAC 128 kbps', 'Both removed', False),
        ('123apps', 'Default settings', 'None (43.4 dB)', 'H.264, 25 fps', 'AAC 128 kbps', 'Both removed', False),
        ('VLC', 'Video - H.264 + MP3 (MP4)', 'None (42.0 dB)', 'H.264', 'MP2, silent\nin Chromium', 'Date reset, no location', False),
    ]
    y = 0.86
    rh = 0.118
    for tool, setting, same, video, sound, meta, ok in rows:
        box(ax, 0.0, y - rh + 0.01, 1.0, rh - 0.016, cs.SURFACE if ok else cs.BACKGROUND, edge=cs.BORDER, lw=1, r=0.01)
        ax.text(0.015, y - 0.037, tool, fontsize=13.5, fontweight='bold', va='center', zorder=3)
        ax.text(0.015, y - 0.077, setting, fontsize=11, color=cs.MUTED, va='center', zorder=3)
        color = cs.ACCENT if ok else cs.FOREGROUND
        ax.text(cols[1] + 0.01, y - 0.054, same, fontsize=13, fontweight='bold', color=color, va='center', zorder=3)
        ax.text(cols[2] + 0.01, y - 0.054, video, fontsize=12.5, va='center', zorder=3)
        ax.text(cols[3] + 0.01, y - 0.054, sound, fontsize=12.5, va='center', linespacing=1.15, zorder=3)
        ax.text(cols[4] + 0.01, y - 0.054, meta, fontsize=12.5, va='center', zorder=3)
        y -= rh
    cs.footer(fig,
              'dB = brightness PSNR against the matching original frame (higher is closer). '
              '123apps repeated one frame each second (24 to 25 fps).',
              'Test file: 60-second HEVC .mov in the format iPhone uses by default, with date and location tags. Tested Nov. 10, 2026.')
    cs.save(fig, f'{OUT}/iphone-video-converter-results.webp')


def place(fig, img, x_px, y_px_from_bottom, h_px):
    w_px = h_px * img.width / img.height
    ax = fig.add_axes([x_px / 1200, y_px_from_bottom / 675, w_px / 1200, h_px / 675])
    ax.imshow(img)
    ax.axis('off')
    ax.add_patch(Rectangle((0, 0), img.width - 1, img.height - 1, fill=False, edgecolor=cs.BORDER, lw=1.2, zorder=2))
    return ax, w_px


def mark(ax, x0, y0, x1, y1, lw=3):
    ax.add_patch(Rectangle((x0, y0), x1 - x0, y1 - y0, fill=False, edgecolor=cs.ACCENT, lw=lw, zorder=3))


def side_text(fig, left, title, rows, top=0.80):
    side = fig.add_axes([left, 0.12, 0.97 - left, 0.71])
    side.set_xlim(0, 1)
    side.set_ylim(0, 1)
    side.axis('off')
    box(side, 0.0, 0.0, 1.0, 1.0, cs.SURFACE, r=0.03)
    side.text(0.07, 0.93, title, fontsize=15, fontweight='bold', color=cs.ACCENT, va='top', zorder=2)
    y = 0.80
    for head, body in rows:
        side.text(0.07, y, head, fontsize=13.5, fontweight='bold', va='top', zorder=2)
        side.text(0.07, y - 0.065, body, fontsize=12, va='top', linespacing=1.35, zorder=2)
        y -= 0.065 + 0.05 * (body.count('\n') + 1) + 0.06
    return side


def losslesscut_screen():
    """LosslessCut 3.69.0 Export options (Show advanced options 켬, Preserve all MP4/MOV metadata 켬), 840×758 자름"""
    img = Image.open(SCREENS / 'losslesscut-export-options-mp4.webp').convert('RGB')
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'In LosslessCut, pick mp4 and turn on "Preserve all MP4/MOV metadata"',
              'Export > Export options, after opening the whole video without setting any cut points (LosslessCut 3.69.0)')
    ax, w = place(fig, img, 36, 84, 470)
    mark(ax, 8, 64, 832, 92)     # Exporting whole file without cutting
    mark(ax, 8, 148, 832, 190)   # Output container format: mp4
    mark(ax, 8, 612, 832, 656)   # Preserve all MP4/MOV metadata
    side_text(fig, (36 + w + 30) / 1200, 'What these settings did', [
        ('Whole file, no cut points', 'With no segments set, Export\ncopies the entire video.'),
        ('Output container: mp4', 'All 1,440 frames matched the\noriginal. Sound copied as is.'),
        ('Preserve all metadata (on)', 'Kept the recording date and\nlocation. Off by default: the\nlocation tag was dropped.'),
    ])
    cs.footer(fig, 'Screenshot: LosslessCut 3.69.0 for Linux, November 10, 2026. Boxes added by ToolProof.',
              'Results: our 60-second HEVC test .mov. The video stays HEVC, so some Windows PCs need Microsoft\'s HEVC Video Extensions to play it.')
    cs.save(fig, f'{OUT}/losslesscut-mp4-export-options.webp')


def handbrake_portrait():
    """HandBrake 1.7.2 Dimensions 탭, 세로 시험 영상(표시 800×1920): 기본 1080p 제한 vs 2160p 4K 제한, 각각 720×400 자름"""
    a = Image.open(SCREENS / 'handbrake-portrait-1080p-limit.webp').convert('RGB')
    b = Image.open(SCREENS / 'handbrake-portrait-4k-limit.webp').convert('RGB')
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, "HandBrake's default preset shrinks a vertical video to 1,080 pixels tall",
              'Dimensions tab with our 800×1920 portrait test clip. Changing Resolution Limit to 2160p 4K keeps every line')
    h = 300
    ax1, w1 = place(fig, a, 36, 150, h)
    ax2, w2 = place(fig, b, 36 + w1 + 36, 150, h)
    for ax in (ax1, ax2):
        mark(ax, 440, 92, 706, 120)   # Resolution Limit
        mark(ax, 6, 364, 300, 392)    # Final storage size
    fig.text((36 + w1 / 2) / 1200, (150 + h + 12) / 675, 'Default: 1080p Full HD limit', fontsize=14, fontweight='bold', ha='center')
    fig.text((36 + w1 + 36 + w2 / 2) / 1200, (150 + h + 12) / 675, 'Changed: 2160p 4K Ultra HD limit',
             fontsize=14, fontweight='bold', ha='center', color=cs.ACCENT)
    fig.text((36 + w1 / 2) / 1200, 118 / 675, 'Saved as 800 × 1080, stretched back when played',
             fontsize=13, ha='center')
    fig.text((36 + w1 + 36 + w2 / 2) / 1200, 118 / 675, 'Saved as 800 × 1920, same as the original',
             fontsize=13, ha='center', color=cs.ACCENT, fontweight='bold')
    cs.footer(fig, 'Screenshots: HandBrake 1.7.2 for Linux, November 10, 2026. Boxes added by ToolProof.',
              'The current HandBrake 1.11.2 uses the same 1920 × 1080 limit in its default preset, per its source code.')
    cs.save(fig, f'{OUT}/handbrake-portrait-resolution-limit.webp')


def cloudconvert_screen():
    """CloudConvert Options (기본값), Video Codec 목록 펼침, 1026×690 자름"""
    img = Image.open(SCREENS / 'cloudconvert-options-codecs.webp').convert('RGB')
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'CloudConvert re-encodes unless you pick "Copy (no re-encoding)"',
              'cloudconvert.com/mov-to-mp4: the Options button next to the file opens this panel')
    ax, w = place(fig, img, 36, 84, 470)
    mark(ax, 25, 225, 500, 256)    # Copy (no re-encoding)
    mark(ax, 525, 145, 1002, 180)  # CRF 23
    mark(ax, 25, 547, 1002, 582)   # AAC 128
    side_text(fig, (36 + w + 30) / 1200, 'Defaults we saw', [
        ('Video: H.264, CRF 23', 'Re-encoded. 0 of 1,440\nframes matched; 42.0 dB.'),
        ('Audio: AAC 128 kbps', 'Down from 192 kbps in\nthe original.'),
        ('Free limit', '10 conversion credits a day.\nWe ran out before testing\nthe Copy option.'),
    ])
    cs.footer(fig, 'Screenshot: CloudConvert in Chromium 153, November 10, 2026. Boxes added by ToolProof.',
              'The recording date and location tags were missing from the converted file.')
    cs.save(fig, f'{OUT}/cloudconvert-default-options.webp')


def vlc_screen():
    """VLC 3.0.20 Convert 프로필 편집 창: Audio codec 탭(기본값) + Video codec 탭(Keep original video track 켬), 각 584×470 자름"""
    a = Image.open(SCREENS / 'vlc-profile-audio-codec.webp').convert('RGB')
    b = Image.open(SCREENS / 'vlc-keep-original-video.webp').convert('RGB')
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'VLC\'s MP4 profile changes the sound unless you keep the original tracks',
              'Media > Convert / Save > Convert > wrench icon next to "Video - H.264 + MP3 (MP4)" (VLC 3.0.20)')
    h = 380
    ax1, w1 = place(fig, a, 36, 110, h)
    ax2, w2 = place(fig, b, 36 + w1 + 36, 110, h)
    mark(ax1, 112, 186, 552, 216)   # Codec MPEG Audio
    mark(ax1, 112, 220, 552, 248)   # 128 kb/s
    mark(ax2, 16, 120, 206, 148)    # Keep original video track
    fig.text((36 + w1 / 2) / 1200, (110 + h + 10) / 675, 'Audio codec tab, as it opens', fontsize=14, fontweight='bold', ha='center')
    fig.text((36 + w1 + 36 + w2 / 2) / 1200, (110 + h + 10) / 675, 'Video codec tab, box ticked',
             fontsize=14, fontweight='bold', ha='center', color=cs.ACCENT)
    cs.footer(fig, 'As it opens, the profile saved MP2 sound in our test, and Chromium played the video silently.',
              'Ticking Keep original on both tabs copied the HEVC video and AAC sound. Screenshots: VLC 3.0.20 for Linux, Nov. 10, 2026.')
    cs.save(fig, f'{OUT}/vlc-mp4-profile-sound.webp')


def vlc_mirror():
    """세로 시험 영상을 VLC 3.0.20 기본 프로필·HandBrake 1.7.2 기본 프리셋으로 바꾼 결과를 Chromium 153에서 4.2초에 멈춘 화면"""
    a = Image.open(SCREENS / 'handbrake-portrait-in-chromium.webp').convert('RGB')
    b = Image.open(SCREENS / 'vlc-portrait-in-chromium.webp').convert('RGB')
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, "VLC's converted vertical video played as a mirror image",
              'The same moment (4.2 seconds) of our vertical test clip after conversion, played in Chromium 153')
    h = 430
    ax1, w1 = place(fig, a, 0, 95, h)
    ax2, w2 = place(fig, b, 0, 95, h)
    gap = 120
    x1 = (1200 - (w1 + w2 + gap)) / 2
    ax1.set_position([x1 / 1200, 95 / 675, w1 / 1200, h / 675])
    ax2.set_position([(x1 + w1 + gap) / 1200, 95 / 675, w2 / 1200, h / 675])
    fig.text((x1 + w1 / 2) / 1200, (95 + h + 10) / 675, 'HandBrake: as recorded', fontsize=14, fontweight='bold', ha='center')
    fig.text((x1 + w1 + gap + w2 / 2) / 1200, (95 + h + 10) / 675, 'VLC: left and right swapped', fontsize=14,
             fontweight='bold', ha='center', color=cs.ACCENT)
    cs.footer(fig, 'VLC 3.0.20 kept the clip upright but saved an orientation flag that also flips it. LosslessCut, HandBrake and 123apps matched the original.',
              'Video frames: Tears of Steel (CC BY 3.0, Blender Foundation). Screenshots: Chromium 153 on Linux, November 10, 2026.')
    cs.save(fig, f'{OUT}/vlc-vertical-video-mirrored.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    results_table()
    losslesscut_screen()
    handbrake_portrait()
    cloudconvert_screen()
    vlc_screen()
    vlc_mirror()
