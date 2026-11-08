"""무손실 자르기 글 그래픽 4장 (1200×675 webp, ad-blog 디자인 시스템 라이트 모드).

수치는 results.jsonl(analyze.py), 화면은 screens/*.webp (Chromium 153, 2026-11-08 UTC). 내용 출처는 factcheck.md.
실행: python3 -I charts.py <출력 폴더>
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
CLIPS = 'Test clips: Tears of Steel (CC BY 3.0, Blender Foundation), 60 seconds, 1920×800, one H.264 MP4 and one HEVC MOV.'


def box(ax, x, y, w, h, fill, edge=None, lw=0, r=0.012):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle=f'round,pad=0,rounding_size={r}',
                                facecolor=fill, edgecolor=edge or fill, lw=lw, zorder=1))


def results_table():
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Only the copy modes kept every original frame',
              'We asked each tool to keep 0:12.5 to 0:30.0, then compared the result with the original, frame by frame')
    ax = fig.add_axes([0.03, 0.12, 0.94, 0.70])
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    cols = [0.0, 0.34, 0.55, 0.77]
    heads = ['Tool and setting', 'Frames identical\nto the original', 'Playback starts at\n(asked for 12.5 s)', 'Picture quality\nvs. original']
    for x, h in zip(cols, heads):
        ax.text(x + 0.01, 0.95, h, fontsize=12.5, color=cs.MUTED, va='top', linespacing=1.3)
    rows = [
        ('ezgif', 'Copy original (default)', '100%  ·  100%', '12.5 s  ·  12.5 s', 'Identical', True),
        ('123apps', 'No re-encoding switched on', '100%  ·  100%', '12.0 s  ·  9.5 s', 'Identical', True),
        ('ezgif', 'MP4 (h264/aac)', '0%  ·  0%', '12.5 s  ·  12.5 s', 'PSNR 45.1  ·  45.6 dB', False),
        ('123apps', 'Default settings', '0%  ·  0%', '12.5 s  ·  12.5 s', 'PSNR 44.7  ·  45.0 dB', False),
        ('Storrito', 'Says "no re-encoding"', '0%  ·  no video', '12.5 s  ·  -', 'PSNR 43.2 dB  ·  -', False),
    ]
    y = 0.78
    rh = 0.145
    for tool, setting, same, start, q, ok in rows:
        box(ax, 0.0, y - rh + 0.015, 1.0, rh - 0.025, cs.SURFACE if ok else cs.BACKGROUND, edge=cs.BORDER, lw=1, r=0.01)
        if ok:
            ax.add_patch(Rectangle((0.0, y - rh + 0.015), 0.006, rh - 0.025, facecolor=cs.ACCENT, edgecolor='none', zorder=2))
        ax.text(0.02, y - 0.045, tool, fontsize=15, fontweight='bold', va='center', zorder=3)
        ax.text(0.02, y - 0.09, setting, fontsize=12.5, color=cs.MUTED, va='center', zorder=3)
        color = cs.ACCENT if ok else cs.FOREGROUND
        ax.text(cols[1] + 0.01, y - 0.065, same, fontsize=14.5, fontweight='bold', color=color, va='center', zorder=3)
        ax.text(cols[2] + 0.01, y - 0.065, start, fontsize=14.5, va='center', zorder=3)
        ax.text(cols[3] + 0.01, y - 0.065, q, fontsize=14.5, fontweight='bold' if ok else 'normal', color=color, va='center', zorder=3)
        y -= rh
    cs.footer(fig,
              'Each cell: H.264 clip  ·  HEVC clip. Storrito saved an audio-only file from the HEVC clip in Chromium 153 on Linux.',
              CLIPS + ' Tested November 8, 2026.')
    cs.save(fig, f'{OUT}/trim-tools-frame-test.webp')


def keyframe_timeline():
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'A copy-mode cut can only begin at a keyframe',
              'Keyframes are the full pictures a video can start from. The frames between them depend on the one before')
    ax = fig.add_axes([0.05, 0.14, 0.92, 0.66])
    t0, t1 = 8.0, 14.6
    ax.set_xlim(t0, t1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    lanes = [
        ('H.264 clip: a keyframe every second', [9.0, 10.0, 11.0, 12.0, 13.0, 14.0], 12.0, 0.70),
        ('HEVC clip: keyframes only at scene changes', [9.5, 13.083], 9.5, 0.27),
    ]
    for label, kfs, before, yc in lanes:
        ax.text(t0, yc + 0.17, label, fontsize=14, fontweight='bold', va='bottom')
        ax.add_patch(FancyBboxPatch((t0, yc - 0.035), t1 - t0, 0.07, boxstyle='round,pad=0,rounding_size=0.03',
                                    mutation_aspect=0.12, facecolor=cs.SURFACE, edgecolor=cs.BORDER, lw=1))
        # 숨은 앞부분 (앞 키프레임 ~ 요청 시작)
        ax.add_patch(Rectangle((before, yc - 0.035), 12.5 - before, 0.07, facecolor=cs.MUTED, alpha=0.35, edgecolor='none', zorder=2))
        ax.add_patch(Rectangle((12.5, yc - 0.035), t1 - 12.5, 0.07, facecolor=cs.ACCENT, alpha=0.85, edgecolor='none', zorder=2))
        for k in kfs:
            ax.plot([k, k], [yc - 0.06, yc + 0.06], color=cs.FOREGROUND, lw=2.2, zorder=4)
        ax.annotate('', xy=(before, yc - 0.11), xytext=(12.5, yc - 0.11),
                    arrowprops=dict(arrowstyle='<->', color=cs.FOREGROUND, lw=1.3))
        ax.text((before + 12.5) / 2, yc - 0.13, f'{12.5 - before:.1f} s earlier', fontsize=12.5, ha='center', va='top')
        ax.text(before, yc + 0.075, f'{before:g} s', fontsize=11.5, color=cs.MUTED, ha='center', va='bottom')
    for yc in (0.70, 0.27):
        ax.plot([12.5, 12.5], [yc - 0.06, yc + 0.12], color=cs.ACCENT, lw=2, ls=(0, (3, 2)), zorder=5)
    ax.text(12.5, 0.93, 'You asked to start at 12.5 s', fontsize=12.5, color=cs.ACCENT, fontweight='bold', ha='center', va='bottom')
    for s in range(9, 15):
        ax.text(s, 0.0, f'{s}s', fontsize=11, color=cs.MUTED, ha='center', va='bottom')
    cs.footer(fig,
              'Black ticks = keyframes. Gray = frames a copy-mode cut has to keep. ezgif hid them and played from 12.5 s; '
              '123apps "No re-encoding" played them.',
              CLIPS + ' Tested November 8, 2026.')
    cs.save(fig, f'{OUT}/keyframe-start-shift.webp')


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


def ezgif_screen():
    img = Image.open(SCREENS / 'ezgif-cut-settings.webp').convert('RGB')
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'In ezgif, keep the default "Copy original"',
              'The Video cutter settings we used, after uploading our test clip')
    ax, w = place(fig, img, 36, 84, 470)
    mark(ax, 14, 316, 330, 338)  # Keep selected part
    mark(ax, 40, 428, 214, 466)  # Copy original
    side_text(fig, (36 + w + 30) / 1200, 'What these settings did', [
        ('Keep selected part', 'Saves only the range you set.\nezgif says Remove mode\nalways re-encodes.'),
        ('Copy original', 'Every frame matched the\noriginal in both test clips.\nMP4 (h264/aac) re-encoded.'),
        ('Limit', '200 MB per file. Uploads are\ndeleted after one hour.'),
    ])
    cs.footer(fig, 'Screenshot: ezgif.com Video cutter in Chromium 153, November 8, 2026. Boxes added by ToolProof.',
              'Video frames: Tears of Steel (CC BY 3.0, Blender Foundation).')
    cs.save(fig, f'{OUT}/ezgif-copy-original.webp')


def apps123_screen():
    img = Image.open(SCREENS / '123apps-no-re-encoding.webp').convert('RGB')
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'In 123apps, switch on "No re-encoding" before you save',
              'online-video-cutter.com: the gear button next to Save opens this panel. The switch is off by default')
    ax, w = place(fig, img, 36, 250, 1128 * img.height / img.width)
    mark(ax, 896, 166, 1072, 196)  # No re-encoding
    mark(ax, 1150, 274, 1332, 336)  # Save
    side = fig.add_axes([0.03, 0.12, 0.94, 0.22])
    side.set_xlim(0, 1)
    side.set_ylim(0, 1)
    side.axis('off')
    box(side, 0.0, 0.0, 1.0, 1.0, cs.SURFACE, r=0.05)
    side.text(0.025, 0.72, 'Off (default):', fontsize=13.5, fontweight='bold', va='center')
    side.text(0.16, 0.72, '0% of frames matched the original. HEVC came back as H.264.', fontsize=13, va='center')
    side.text(0.025, 0.30, 'On:', fontsize=13.5, fontweight='bold', color=cs.ACCENT, va='center')
    side.text(0.16, 0.30, '100% matched, but playback began at the keyframe before 12.5 s (12.0 s and 9.5 s).',
              fontsize=13, va='center')
    cs.footer(fig, 'Screenshot: online-video-cutter.com in Chromium 153, November 8, 2026. Boxes added by ToolProof.',
              'Video frames: Tears of Steel (CC BY 3.0, Blender Foundation).')
    cs.save(fig, f'{OUT}/123apps-no-re-encoding.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    results_table()
    keyframe_timeline()
    ezgif_screen()
    apps123_screen()
