"""영상 소리 빼기 글 그래픽 5장 (1200×675 webp, ad-blog 디자인 시스템 라이트 모드).

수치는 results.jsonl(analyze.py)·align.jsonl(align_psnr.py)·frame_map.jsonl(frame_map.py), 화면은 screens/*.webp
(LosslessCut 3.70.0 · VLC 3.0.20 · HandBrake 1.7.2 on Linux, ezgif·123apps·Cloudinary in Chromium, 2026-11-24 UTC).
내용 출처는 factcheck.md.
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
    cs.header(fig, 'Two free tools removed the sound and left every frame untouched',
              'The same 30-second MP4 run through seven free tools and settings, then compared with the original')
    ax = fig.add_axes([0.03, 0.115, 0.94, 0.73])
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    cols = [0.0, 0.30, 0.50, 0.66, 0.82]
    heads = ['Tool and setting', 'Frames identical\nto the original', 'File size\n(original 26.3 MB)', 'Picture size\nand frame rate',
             'Recording date\nand location']
    for x, h in zip(cols, heads):
        ax.text(x + 0.01, 0.985, h, fontsize=12, color=cs.MUTED, va='top', linespacing=1.25)
    rows = [
        ('LosslessCut 3.70.0', 'Audio track off, then Export', 'All 720', '25.5 MB', '1920×800, 24 fps', 'Both kept', True),
        ('ezgif Mute video', 'Upload, then "Mute video!"', 'All 720', '25.5 MB', '1920×800, 24 fps', 'Date removed', True),
        ('VLC 3.0.20', 'Audio off + Keep original video', '717 (last 3 cut)', '25.4 MB', '1920×800, 24 fps', 'Date reset, no location', False),
        ('HandBrake 1.7.2', 'Fast 1080p30, audio track deleted', 'None (42.2 dB)', '13.4 MB', '1920×800, 24 fps', 'Date reset, no location', False),
        ('VLC 3.0.20', 'Default H.264 profile, audio off', 'None (42.1 dB*)', '11.3 MB', '1920×800, 24 fps', 'Date reset, no location', False),
        ('Cloudinary', 'Remove Audio, MP4 output', 'None (39.9 dB)', '6.7 MB', '1920×800, 24 fps', 'Both removed', False),
        ('123apps', 'Volume 0% + free export', 'None, 720p', '9.8 MB', '1728×720, 30 fps', 'Both removed', False),
    ]
    y = 0.865
    rh = 0.118
    for tool, setting, same, size, pic, meta, ok in rows:
        box(ax, 0.0, y - rh + 0.01, 1.0, rh - 0.016, cs.SURFACE if ok else cs.BACKGROUND, edge=cs.BORDER, lw=1, r=0.01)
        ax.text(0.015, y - 0.037, tool, fontsize=13, fontweight='bold', va='center', zorder=3)
        ax.text(0.015, y - 0.077, setting, fontsize=10.5, color=cs.MUTED, va='center', zorder=3)
        color = cs.ACCENT if ok else cs.FOREGROUND
        ax.text(cols[1] + 0.01, y - 0.056, same, fontsize=12.5, fontweight='bold', color=color, va='center', zorder=3)
        ax.text(cols[2] + 0.01, y - 0.056, size, fontsize=12.5, va='center', zorder=3)
        ax.text(cols[3] + 0.01, y - 0.056, pic, fontsize=12.5, va='center', zorder=3,
                color=cs.ACCENT if '720,' in pic and '1920' not in pic else cs.FOREGROUND)
        ax.text(cols[4] + 0.01, y - 0.056, meta, fontsize=12, va='center', zorder=3)
        y -= rh
    cs.footer(fig,
              'Every tool removed the audio track completely; none left a silent track. dB = brightness PSNR vs. the matching original frame (higher is closer). *Last 2 frames cut.',
              'Test file: 30-second 1920×800 H.264 MP4 with AAC sound, recording date and location tags. Tested November 24, 2026.')
    cs.save(fig, f'{OUT}/remove-audio-tool-results.webp')


def losslesscut_screen():
    """LosslessCut 3.70.0: Tracks 창에서 소리 트랙 끔(Tracks 1/2) → Export options 'Keeping 1 tracks', 각 1366×900"""
    a = Image.open(SCREENS / 'lc-tracks-landscape.webp').convert('RGB')
    b = Image.open(SCREENS / 'lc-export-options.webp').convert('RGB')
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'In LosslessCut, switch off the audio track, then export',
              'Open the Tracks list at the top left, click the speaker icon, and check "Keeping 1 tracks" (LosslessCut 3.70.0)')
    h = 360
    ax1, w1 = place(fig, a, 36, 120, h)
    ax2, w2 = place(fig, b, 36 + w1 + 36, 120, h)
    mark(ax1, 92, 494, 136, 522, lw=3.5)      # 소리 트랙 Keep 아이콘(꺼짐)
    mark(ax1, 3, 32, 100, 57, lw=3.5)         # Tracks (1/2)
    mark(ax2, 912, 240, 1050, 268, lw=3.5)    # Keeping 1 tracks
    mark(ax2, 1252, 858, 1362, 896, lw=3.5)   # Export
    fig.text((36 + w1 / 2) / 1200, (120 + h + 10) / 675, '1. Tracks: speaker icon turns red', fontsize=14,
             fontweight='bold', ha='center')
    fig.text((36 + w1 + 36 + w2 / 2) / 1200, (120 + h + 10) / 675, '2. Export: "Keeping 1 tracks"',
             fontsize=14, fontweight='bold', ha='center', color=cs.ACCENT)
    fig.text((36 + w1 + 36 + w2 / 2) / 1200, 92 / 675, 'Saved file: all 720 frames identical, date and location kept',
             fontsize=12.5, ha='center', color=cs.ACCENT, fontweight='bold')
    fig.text((36 + w1 / 2) / 1200, 92 / 675, 'The top-left button changes from "Tracks (2/2)" to "Tracks (1/2)"',
             fontsize=12.5, ha='center')
    cs.footer(fig, 'Screenshots: LosslessCut 3.70.0 for Linux, November 24, 2026. Boxes added by ToolProof.',
              'For iPhone videos, also turn on "Preserve all MP4/MOV metadata" under Show advanced options to keep the location.')
    cs.save(fig, f'{OUT}/losslesscut-audio-track-off.webp')


def vlc_settings():
    """VLC 3.0.20: 프로필 편집 > Audio codec 'Audio' 체크 해제 + Video codec 'Keep original video track'"""
    a = Image.open(SCREENS / 'vlc-audio-unchecked.webp').convert('RGB').crop((360, 95, 946, 566))
    b = Image.open(SCREENS / 'vlc-keep-original-video.webp').convert('RGB').crop((360, 95, 946, 566))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, "VLC needs two boxes changed in the Convert profile",
              'Media > Convert / Save, pick the file, then click the wrench next to Profile (VLC 3.0.20)')
    h = 400
    ax1, w1 = place(fig, a, 60, 105, h)
    ax2, w2 = place(fig, b, 60 + w1 + 60, 105, h)
    mark(ax1, 20, 88, 82, 112)     # Audio 체크박스 (crop 좌표)
    mark(ax1, 228, 54, 330, 80)    # Audio codec 탭
    mark(ax2, 22, 122, 205, 146)   # Keep original video track
    mark(ax2, 125, 54, 228, 80)    # Video codec 탭
    fig.text((60 + w1 / 2) / 1200, (105 + h + 10) / 675, '1. Audio codec: clear "Audio"', fontsize=14,
             fontweight='bold', ha='center')
    fig.text((60 + w1 + 60 + w2 / 2) / 1200, (105 + h + 10) / 675, '2. Video codec: "Keep original video track"',
             fontsize=14, fontweight='bold', ha='center', color=cs.ACCENT)
    cs.footer(fig, 'Without step 2, VLC re-encoded the picture (file 57% smaller). With it, the frames were copied but the last 3 were cut.',
              'Screenshots: VLC 3.0.20 for Linux, November 24, 2026. Boxes added by ToolProof.')
    cs.save(fig, f'{OUT}/vlc-convert-without-audio.webp')


def portrait_frames():
    """세로(iPhone식) 시험 영상 10초 화면: 원본 / ezgif(LosslessCut과 같은 프레임) / Cloudinary / 123apps(가로로 눌림)"""
    o = Image.open(SCREENS / 'frame-portrait-original.webp').convert('RGB')
    e = Image.open(SCREENS / 'frame-portrait-ezgif.webp').convert('RGB')
    c = Image.open(SCREENS / 'frame-portrait-cloudinary.webp').convert('RGB')
    p = Image.open(SCREENS / 'frame-portrait-123apps.webp').convert('RGB')
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, '123apps squeezed our portrait video into a wide frame',
              'The same moment from an iPhone-style portrait clip after removing the sound in each tool')
    h = 400
    x = 40
    ax1, w = place(fig, o, x, 105, h)
    fig.text((x + w / 2) / 1200, (105 + h + 10) / 675, 'Original', fontsize=13.5, fontweight='bold', ha='center')
    x += w + 34
    ax2, w = place(fig, e, x, 105, h)
    fig.text((x + w / 2) / 1200, (105 + h + 10) / 675, 'ezgif, LosslessCut', fontsize=13.5, fontweight='bold', ha='center')
    x += w + 34
    ax3, w = place(fig, c, x, 105, h)
    fig.text((x + w / 2) / 1200, (105 + h + 10) / 675, 'Cloudinary', fontsize=13.5, fontweight='bold', ha='center')
    x += w + 44
    hp = 220
    ax4, w4 = place(fig, p, x, 105 + (h - hp) / 2, hp)
    fig.text((x + w4 / 2) / 1200, (105 + (h - hp) / 2 + hp + 10) / 675, '123apps free export', fontsize=13.5,
             fontweight='bold', ha='center', color=cs.ACCENT)
    fig.text((x + w4 / 2) / 1200, (105 + (h - hp) / 2 - 28) / 675, '1728×720: the tall picture\nis stretched sideways',
             fontsize=12.5, ha='center', va='top', color=cs.ACCENT, linespacing=1.3)
    cs.footer(fig, 'ezgif and LosslessCut kept the original frames and the rotation flag; Cloudinary re-encoded the picture upright (40.6 dB).',
              'Video frames: Tears of Steel (CC BY 3.0, Blender Foundation). Test clip stored the way iPhones save portrait video. Nov. 24, 2026.')
    cs.save(fig, f'{OUT}/portrait-video-after-removing-sound.webp')


def ezgif_screen():
    """ezgif.com/mute-video 결과 화면(크기 -2.85%) + 로컬 처리 상자"""
    a = Image.open(SCREENS / 'ezgif-landscape-result.webp').convert('RGB').crop((403, 780, 1210, 1300))
    b = Image.open(SCREENS / 'ezgif-local-landscape-form.webp').convert('RGB').crop((300, 160, 1100, 760))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'ezgif removed the sound without touching the picture',
              'ezgif.com/mute-video in Chromium, with and without "Local processing", November 24, 2026')
    h = 380
    ax1, w1 = place(fig, a, 40, 110, h)
    ax2, w2 = place(fig, b, 40 + w1 + 40, 110, h)
    mark(ax1, 7, 31, 123, 70)        # Mute video!
    mark(ax1, 27, 482, 684, 508)     # 24.33MiB (-2.85%)
    fig.text((40 + w1 / 2) / 1200, (110 + h + 10) / 675, 'Result: 2.85% smaller, sound gone', fontsize=14,
             fontweight='bold', ha='center')
    fig.text((40 + w1 + 40 + w2 / 2) / 1200, (110 + h + 10) / 675, '"Local processing" mode: no upload',
             fontsize=14, fontweight='bold', ha='center', color=cs.ACCENT)
    fig.text((40 + w1 + 40 + w2 / 2) / 1200, 82 / 675,
             'Same result either way: all 720 frames identical', fontsize=12.5, ha='center')
    cs.footer(fig, 'The file shrinks only by the size of the removed audio (192 kbps AAC). ezgif dropped the recording date tag.',
              'Screenshots: Chromium on Linux. Boxes added by ToolProof.')
    cs.save(fig, f'{OUT}/ezgif-mute-video.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    results_table()
    losslesscut_screen()
    vlc_settings()
    portrait_frames()
    ezgif_screen()
