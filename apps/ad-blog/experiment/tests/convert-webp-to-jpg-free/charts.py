"""convert-webp-to-jpg-free 글 그래픽

데이터: results/summary.json (analyze.py), 변환 결과 이미지는 작업 폴더(/tmp/w/out), 스크린샷은 /tmp/w/shots·/tmp/w/probe
실행: python3 -I charts.py <출력 폴더> <작업 폴더(/tmp/w)>
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
from PIL import Image, ImageDraw  # noqa: E402

HERE = Path(__file__).resolve().parent
OUT = sys.argv[1] if len(sys.argv) > 1 else '.'
WORK = Path(sys.argv[2] if len(sys.argv) > 2 else '/tmp/w')
S = json.load(open(HERE / 'results/summary.json'))
TOOLS = ['xnconvert', 'gimp', 'cloudconvert', 'ezgif', 'iloveimg']
NAMES = {'xnconvert': 'XnConvert', 'gimp': 'GIMP', 'cloudconvert': 'CloudConvert', 'ezgif': 'ezgif', 'iloveimg': 'iLoveIMG'}


def checker(size, cell=14):
    w, h = size
    im = Image.new('RGB', size, (255, 255, 255))
    px = im.load()
    for yy in range(h):
        for xx in range(w):
            if (xx // cell + yy // cell) % 2:
                px[xx, yy] = (226, 226, 232)
    return im


def framed(im, box):
    """이미지를 box 크기로 맞추고 border 색 1px 테두리"""
    im = im.convert('RGB').resize(box, Image.LANCZOS)
    ImageDraw.Draw(im).rectangle((0, 0, box[0] - 1, box[1] - 1), outline=cs.BORDER)
    return im


def transparency():
    rows = [('logo', 'Dark logo', (176, 88)), ('sticker', 'White sticker', (120, 120))]
    cols = ['original'] + TOOLS
    fig = cs.plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'What happens to a transparent WebP when it becomes a JPG',
              'Default settings, no account. JPG has no transparency, so each tool paints the see-through area a solid color')
    cs.footer(fig, 'White fill hides white artwork; black fill (iLoveIMG) hides dark artwork. Only ezgif lets you pick the fill color.',
              'Test files: our own lossless WebP graphics on a transparent background. Converted Oct 22, 2026 (KST).')
    cw = 0.148
    for i, c in enumerate(cols):
        x0 = 0.035 + i * (cw + 0.012)
        label = 'Original WebP' if c == 'original' else NAMES[c]
        fig.text(x0 + cw / 2, 0.765, label, ha='center', fontsize=13, fontweight='semibold',
                 color=cs.MUTED if c == 'original' else cs.FOREGROUND)
        for j, (n, rname, box) in enumerate(rows):
            if c == 'original':
                src = Image.open(WORK / f'set/{n}.webp').convert('RGBA').resize(box, Image.LANCZOS)
                im = checker(box)
                im.paste(src, (0, 0), src)
                im = framed(im, box)
            else:
                im = framed(Image.open(WORK / f'out/{c}/{n}.jpg'), box)
            h = 0.26
            y0 = 0.45 - j * (h + 0.06)
            ax = fig.add_axes([x0, y0, cw, h])
            ax.imshow(im)
            ax.axis('off')
            if c != 'original':
                bg = S['tools'][c]['transparent'][n]['bg_rgb']
                fill = 'white fill' if bg == [255, 255, 255] else 'black fill'
                gone = S['tools'][c]['transparent'][n]['fg_bg_luma_diff'] < 30
                ax.set_title(fill + (' - art lost' if gone else ''), fontsize=11, y=-0.2,
                             color=cs.ACCENT if gone else cs.MUTED, fontweight='semibold' if gone else 'normal')
    cs.save(fig, f'{OUT}/transparent-webp-to-jpg-results.webp')


def size_chart():
    ps = S['photo_summary']
    order = sorted(TOOLS, key=lambda t: ps[t]['size_ratio'])
    fig, ax = cs.figure()
    fig.subplots_adjust(left=0.16, right=0.95, top=0.79, bottom=0.17)
    ax.set_xlim(0, 2.8)
    ax.set_ylim(-0.6, len(order) - 0.4)
    ys = list(range(len(order) - 1, -1, -1))
    ax.set_yticks(ys)
    ax.set_yticklabels([NAMES[t] for t in order], fontsize=15, fontweight='semibold')
    ax.set_xticks([0, 0.5, 1.0, 1.5, 2.0, 2.5])
    ax.set_xticklabels(['0', '0.5x', '1x', '1.5x', '2x', '2.5x'])
    ax.axvline(1.0, color=cs.MUTED, lw=1.2, ls=(0, (4, 3)))
    for y, t in zip(ys, order):
        r = ps[t]['size_ratio']
        cs.rounded_barh(ax, y, 0, r, 0.56, cs.ACCENT if t == order[0] else cs.MUTED)
        ax.text(r + 0.03, y, f"{r:.2f}x  (quality {ps[t]['quality'][0]})", va='center', fontsize=13, fontweight='semibold')
    ax.text(1.0, len(order) - 0.45, 'same size as the WebP', ha='center', va='bottom', fontsize=11, color=cs.MUTED)
    cs.header(fig, 'Every tool made bigger files: JPG size vs. the original WebP',
              'Total size of 6 converted photos (1600 x 1067) divided by the 6 WebP originals, default settings')
    cs.footer(fig, 'All five kept full resolution and stayed close to the WebP (similarity score SSIM 0.979 to 0.987). CloudConvert: 5 photos (daily limit).',
              'Quality = the JPG quality number each tool used by default (CloudConvert "auto" picked 92).')
    cs.save(fig, f'{OUT}/jpg-size-vs-webp.webp')


def animated():
    fig = cs.plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Animated WebP to JPG: what each tool gave back',
              'Our 12-frame test animation (a blue dot moving right). A JPG can hold only one frame')
    cs.footer(fig, 'iLoveIMG and CloudConvert split the frames, but 8 or 9 of them came out as cut-off patches, not full frames.',
              'ezgif failed on this file in 3 tries. Converted Oct 22, 2026 (KST), default settings.')
    panels = [
        ('Original frame 3', Image.open(WORK / 'ref/anim_03.png'), 'full 800 x 450 frame'),
        ('XnConvert', Image.open(WORK / 'out/xnconvert/animated.jpg'), '1 JPG: frame 1 only'),
        ('GIMP', Image.open(WORK / 'out/gimp/animated.jpg'), '1 JPG: frame 12 only'),
        ('iLoveIMG / CloudConvert', Image.open(WORK / 'out/cloudconvert/anim/animated-3.jpg'), 'frame 3 = 207 x 273 patch'),
    ]
    box = (256, 144)
    for i, (title, im, note) in enumerate(panels):
        x0 = 0.04 + i * 0.235
        fig.text(x0 + 0.105, 0.765, title, ha='center', fontsize=13, fontweight='semibold',
                 color=cs.MUTED if i == 0 else cs.FOREGROUND)
        canvas = Image.new('RGB', (800, 450), (255, 255, 255))
        if im.size == (800, 450):
            canvas = im.convert('RGB')
        else:
            canvas.paste(im.convert('RGB'), (0, 0))
            d = ImageDraw.Draw(canvas)
            d.rectangle((0, 0, im.size[0], im.size[1]), outline=cs.ACCENT, width=6)
        ax = fig.add_axes([x0, 0.33, 0.21, 0.38])
        ax.imshow(framed(canvas, box))
        ax.axis('off')
        fig.text(x0 + 0.105, 0.28, note, ha='center', fontsize=12,
                 color=cs.ACCENT if i == 3 else cs.MUTED, fontweight='semibold' if i == 3 else 'normal')
    fig.text(0.04, 0.2, 'iLoveIMG: 11 JPGs for 12 frames (3 full, 8 patches). CloudConvert: 12 JPGs (3 full, 9 patches).',
             fontsize=12, color=cs.FOREGROUND)
    cs.save(fig, f'{OUT}/animated-webp-to-jpg-frames.webp')


def screenshot(src, dst, crop, boxes):
    im = Image.open(src).convert('RGB').crop(crop)
    d = ImageDraw.Draw(im)
    for b in boxes:  # 원본 좌표 → 자른 좌표
        d.rounded_rectangle((b[0] - crop[0], b[1] - crop[1], b[2] - crop[0], b[3] - crop[1]), radius=6, outline=cs.ACCENT, width=4)
    if im.width < 1200:
        im = im.resize((1200, round(im.height * 1200 / im.width)), Image.LANCZOS)
    im.save(dst, 'WEBP', quality=88)
    print(dst, im.size)


if __name__ == '__main__':
    transparency()
    size_chart()
    animated()
    # XnConvert Output 탭 + JPG Write settings 대화상자 (기본 품질 85)
    screenshot(WORK / 'shots/keep_xnc_settings.png', f'{OUT}/xnconvert-jpg-settings.webp', (0, 0, 1400, 620),
               [(1104, 176, 1368, 236), (462, 292, 936, 322)])
    # CloudConvert Options: 품질 auto, 배경색 옵션 없음
    screenshot(WORK / 'probe/cc_options.png', f'{OUT}/cloudconvert-options.webp', (150, 110, 1216, 790),
               [(178, 548, 682, 692)])
