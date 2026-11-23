"""영상 회전 글 그래픽 5장 (1200×675 webp, ad-blog 디자인 시스템 라이트 모드).

수치는 results.jsonl(analyze.py)·align.jsonl(align_psnr.py), 화면은 screens/*.webp
(LosslessCut 3.70.0 · VLC 3.0.20 · HandBrake 1.7.2 · Chromium · Firefox 160.0.1, Linux, 2026-11-22 UTC). 내용 출처는 factcheck.md.
실행: /tmp/charts/bin/python -I charts.py <출력 폴더>
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
CLIP = 'Test file: a 30-second H.264 MP4 that plays sideways because of its rotation flag (Tears of Steel, CC BY 3.0, Blender Foundation).'


def box(ax, x, y, w, h, fill, edge=None, lw=0, r=0.012):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle=f'round,pad=0,rounding_size={r}',
                                facecolor=fill, edgecolor=edge or fill, lw=lw, zorder=1))


def place(fig, img, x_px, y_px_from_bottom, h_px):
    w_px = h_px * img.width / img.height
    ax = fig.add_axes([x_px / 1200, y_px_from_bottom / 675, w_px / 1200, h_px / 675])
    ax.imshow(img)
    ax.axis('off')
    ax.add_patch(Rectangle((0, 0), img.width - 1, img.height - 1, fill=False, edgecolor=cs.BORDER, lw=1.2, zorder=2))
    return ax, w_px


def mark(ax, x0, y0, x1, y1, lw=3):
    ax.add_patch(Rectangle((x0, y0), x1 - x0, y1 - y0, fill=False, edgecolor=cs.ACCENT, lw=lw, zorder=3))


def results_table():
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Only LosslessCut turned the video upright without re-encoding it',
              'One sideways test video rotated in five free tools, then compared with the original frame by frame')
    ax = fig.add_axes([0.03, 0.115, 0.94, 0.73])
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    cols = [0.0, 0.27, 0.45, 0.62, 0.79]
    heads = ['Tool and setting', 'Frames identical\nto the original', 'Upright when\nplayed?', 'File size\n(original 26.3 MB)',
             'Recording date\nand location']
    for x, h in zip(cols, heads):
        ax.text(x + 0.01, 0.985, h, fontsize=12, color=cs.MUTED, va='top', linespacing=1.25)
    rows = [
        ('LosslessCut 3.70.0', 'Rotate button, then Export', 'All 720', 'Yes, in all 3 players', '26.3 MB, unchanged', 'Both kept', True),
        ('HandBrake 1.7.2', 'Fast 1080p30 + Rotation 270°', 'None (42.3 dB)', 'Yes', '14.0 MB', 'Date reset, no location', False),
        ('ezgif', 'rotate 270 + "Copy original"', 'None (42.2 dB)', 'Yes', '12.2 MB', 'Both removed', False),
        ('123apps', 'Rotate + free 720p export', 'None (34.0 dB)', 'Yes, at 1732×720', '10.3 MB, 30 fps', 'Both removed', False),
        ('VLC 3.0.20', 'Effects rotation + Convert', 'None', 'No, still sideways', '11.8 MB, MP2 sound', 'Date reset, no location', False),
        ('VLC 3.0.20', '+ Video transformation filter', 'None (42.0 dB*)', 'Only in VLC', '11.8 MB, MP2 sound', 'Date reset, no location', False),
    ]
    y = 0.86
    rh = 0.135
    for tool, setting, same, upright, size, meta, ok in rows:
        box(ax, 0.0, y - rh + 0.012, 1.0, rh - 0.02, cs.SURFACE if ok else cs.BACKGROUND, edge=cs.BORDER, lw=1, r=0.01)
        ax.text(0.015, y - 0.042, tool, fontsize=13.5, fontweight='bold', va='center', zorder=3)
        ax.text(0.015, y - 0.087, setting, fontsize=11, color=cs.MUTED, va='center', zorder=3)
        color = cs.ACCENT if ok else cs.FOREGROUND
        ax.text(cols[1] + 0.01, y - 0.063, same, fontsize=13, fontweight='bold', color=color, va='center', zorder=3)
        ax.text(cols[2] + 0.01, y - 0.063, upright, fontsize=12.5, va='center', zorder=3,
                fontweight='bold' if ok else 'normal', color=color)
        ax.text(cols[3] + 0.01, y - 0.063, size, fontsize=12.5, va='center', zorder=3)
        ax.text(cols[4] + 0.01, y - 0.063, meta, fontsize=12.5, va='center', zorder=3)
        y -= rh
    cs.footer(fig,
              'dB = brightness PSNR against the matching original frame (higher is closer). *After turning VLC\'s frames upright.',
              'Test file: 30-second H.264 MP4 that plays sideways because of its rotation flag. Tested Nov. 22, 2026.')
    cs.save(fig, f'{OUT}/rotate-video-tool-results.webp')


def losslesscut_screen():
    """LosslessCut 3.70.0: 회전 버튼 위 툴팁(Don't modify) 화면 → 한 번 누른 뒤 0°·Rotation preview 화면, 각 1366×900"""
    a = Image.open(SCREENS / 'losslesscut-before-rotate.webp').convert('RGB')
    b = Image.open(SCREENS / 'losslesscut-after-rotate-0.webp').convert('RGB')
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'In LosslessCut, click the rotate button until the preview stands up',
              'The button is at the bottom left after you turn on "Toggle advanced view" (LosslessCut 3.70.0)')
    h = 360
    ax1, w1 = place(fig, a, 36, 120, h)
    ax2, w2 = place(fig, b, 36 + w1 + 36, 120, h)
    mark(ax1, 238, 858, 560, 900, lw=3.5)     # Set output rotation 툴팁 + 버튼
    mark(ax2, 240, 866, 290, 900, lw=3.5)     # 0°
    mark(ax2, 8, 76, 238, 112, lw=3.5)        # Rotation preview
    mark(ax2, 1278, 866, 1362, 900, lw=3.5)   # Export
    fig.text((36 + w1 / 2) / 1200, (120 + h + 10) / 675, 'Before: plays sideways', fontsize=14, fontweight='bold', ha='center')
    fig.text((36 + w1 + 36 + w2 / 2) / 1200, (120 + h + 10) / 675, 'After one click: 0°, then Export',
             fontsize=14, fontweight='bold', ha='center', color=cs.ACCENT)
    fig.text((36 + w1 / 2) / 1200, 92 / 675, 'Tooltip: "Set output rotation. Current: Don\'t modify"', fontsize=12.5, ha='center')
    fig.text((36 + w1 + 36 + w2 / 2) / 1200, 92 / 675, 'Saved file: all 720 frames identical, same size',
             fontsize=12.5, ha='center', color=cs.ACCENT, fontweight='bold')
    cs.footer(fig, 'Screenshots: LosslessCut 3.70.0 for Linux, November 22, 2026. Boxes added by ToolProof.',
              'Each click adds 90 degrees (0°, 90°, 180°, 270°). Our phone-style clip needed one click; yours may need more.')
    cs.save(fig, f'{OUT}/losslesscut-rotate-button.webp')


def vlc_settings():
    """VLC 3.0.20: Effects and Filters > Video Effects > Geometry(Transform 270) + Convert 프로필 편집 > Video codec > Filters"""
    a = Image.open(SCREENS / 'vlc-effects-transform-270.webp').convert('RGB')
    b = Image.open(SCREENS / 'vlc-profile-transformation-filter.webp').convert('RGB')
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Saving a rotated video in VLC takes two settings, not one',
              'Tools > Effects and Filters rotates playback only; the Convert profile needs the transformation filter too')
    h = 390
    ax1, w1 = place(fig, a, 36, 110, h)
    ax2, w2 = place(fig, b, 36 + w1 + 40, 110, h)
    mark(ax1, 18, 104, 240, 128)     # Transform 체크
    mark(ax1, 30, 144, 230, 176)     # Rotate by 270 degrees
    mark(ax1, 400, 420, 482, 449)    # Save
    mark(ax2, 34, 376, 228, 396)     # Video transformation filter
    mark(ax2, 136, 56, 228, 80)      # Video codec 탭
    fig.text((36 + w1 / 2) / 1200, (110 + h + 10) / 675, '1. Video Effects > Geometry', fontsize=14, fontweight='bold', ha='center')
    fig.text((36 + w1 + 40 + w2 / 2) / 1200, (110 + h + 10) / 675, '2. Profile > Video codec > Filters',
             fontsize=14, fontweight='bold', ha='center', color=cs.ACCENT)
    cs.footer(fig, 'With only step 1, our saved file still played sideways. With both, it looked right in VLC but not in browsers (next image).',
              'Screenshots: VLC 3.0.20 for Linux, November 22, 2026. Boxes added by ToolProof.')
    cs.save(fig, f'{OUT}/vlc-rotate-and-save-settings.webp')


def vlc_players():
    """VLC 3.0.20로 회전해 저장한 같은 파일: VLC(정상)·Chromium(좌우 반전)·Firefox 160.0.1(누움)"""
    a = Image.open(SCREENS / 'play-vlc-file-in-vlc.webp').convert('RGB')
    b = Image.open(SCREENS / 'play-vlc-file-in-chromium.webp').convert('RGB')
    c = Image.open(SCREENS / 'play-vlc-file-in-firefox.webp').convert('RGB')
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, "VLC's rotated video looked different in every player",
              'The same file saved by VLC 3.0.20, paused on the same shot in three players')
    h = 182
    ax1, w1 = place(fig, a, 36, 330, h)
    ax2, w2 = place(fig, b, 36, 100, h)
    fig.text(36 / 1200, (330 + h + 9) / 675, 'In VLC 3.0.20: upright and correct', fontsize=13.5, fontweight='bold')
    fig.text(36 / 1200, (100 + h + 9) / 675, 'In Chromium: upright, but left and right are swapped',
             fontsize=13.5, fontweight='bold', color=cs.ACCENT)
    x3 = 36 + max(w1, w2) + 70
    hf = 412
    ax3, w3 = place(fig, c, x3, 100, hf)
    fig.text(x3 / 1200, (100 + hf + 9) / 675, 'In Firefox 160.0.1: still sideways', fontsize=13.5,
             fontweight='bold', color=cs.ACCENT)
    fig.text((x3 + w3 + 26) / 1200, (100 + hf - 30) / 675,
             'VLC saved a rotation\nflag that also flips\nthe picture, and each\nplayer read it its\nown way.',
             fontsize=12.5, va='top', linespacing=1.35)
    cs.footer(fig, 'Our LosslessCut, HandBrake, ezgif and 123apps files played upright in all three players.',
              'Video frames: Tears of Steel (CC BY 3.0, Blender Foundation). Screenshots on Linux, November 22, 2026.')
    cs.save(fig, f'{OUT}/vlc-rotated-video-in-three-players.webp')


def online_tools():
    """ezgif 결과(Copy original, -53.57%) + 123apps Export 창(720p 기본, 1080p 유료 표시)"""
    a = Image.open(SCREENS / 'ezgif-copy-original-result.webp').convert('RGB')
    b = Image.open(SCREENS / '123apps-export-720p.webp').convert('RGB').crop((380, 40, 1200, 560))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Both online rotators re-encoded the video, even ezgif\'s "Copy original"',
              'ezgif.com/rotate-video and 123apps (online-video-cutter.com/rotate-video) in Chromium, November 22, 2026')
    h = 420
    ax1, w1 = place(fig, a, 36, 95, h)
    ax2, w2 = place(fig, b, 36 + w1 + 40, 95 + (h - 330) / 2, 330)
    mark(ax1, 52, 215, 240, 250)     # Copy original
    mark(ax1, 24, 728, 330, 758)     # 11.63MiB (-53.57%)
    mark(ax2, 580, 125, 678, 182)    # 720p
    mark(ax2, 682, 125, 770, 182)    # 1080p (유료 표시)
    fig.text((36 + w1 / 2) / 1200, (95 + h + 8) / 675, 'ezgif: file shrank by 53.6%', fontsize=14, fontweight='bold', ha='center')
    fig.text((36 + w1 + 40 + w2 / 2) / 1200, (95 + h + 8) / 675, '123apps: free export tops out at 720p',
             fontsize=14, fontweight='bold', ha='center', color=cs.ACCENT)
    fig.text((36 + w1 + 40 + w2 / 2) / 1200, (95 + (h - 330) / 2 - 26) / 675, '1080p carries a premium mark',
             fontsize=12.5, ha='center')
    cs.footer(fig, 'ezgif: 42.2 dB and the recording date and location removed. 123apps: 1732×720 at 30 fps, 34.0 dB.',
              'Screenshots: Chromium on Linux. Boxes added by ToolProof.')
    cs.save(fig, f'{OUT}/online-video-rotators.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    results_table()
    losslesscut_screen()
    vlc_settings()
    vlc_players()
    online_tools()
