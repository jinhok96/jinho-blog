"""remove-bg-alternative-free 글 그래픽

데이터: results/summary.json (evaluate.py), 예시는 scikit-image 퍼블릭 도메인 사진의 도구별 결과(/tmp/bg/exout)
실행: python3 -I charts.py <출력 폴더> <작업 폴더(/tmp/bg)>
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
from PIL import Image  # noqa: E402

HERE = Path(__file__).resolve().parent
OUT = sys.argv[1] if len(sys.argv) > 1 else '.'
WORK = Path(sys.argv[2] if len(sys.argv) > 2 else '/tmp/bg')
S = json.load(open(HERE / 'results/summary.json'))
NAMES = {'iloveimg': 'iLoveIMG', 'removebg': 'remove.bg', 'removalai': 'removal.ai', 'pixlr': 'Pixlr'}


def free_size():
    rows = [('iloveimg', 'full size', True), ('pixlr', 'full size, 3 a day', False),
            ('removebg', 'preview', False), ('removalai', 'preview', False)]
    fig, ax = cs.figure()
    fig.subplots_adjust(left=0.15, right=0.95, top=0.79, bottom=0.17)
    ax.set_xlim(0, 2.6)
    ax.set_ylim(-0.6, len(rows) - 0.4)
    ys = list(range(len(rows) - 1, -1, -1))
    ax.set_yticks(ys)
    ax.set_yticklabels([NAMES[k] for k, _, _ in rows], fontsize=15, fontweight='semibold')
    ax.set_xticks([0, 0.5, 1.0, 1.5, 2.0, 2.5])
    ax.set_xticklabels(['0', '0.5', '1.0', '1.5', '2.0', '2.5 MP'])
    for y, (k, note, pick) in zip(ys, rows):
        mp = S[k]['megapixels_median']
        cs.rounded_barh(ax, y, 0, mp, 0.56, cs.ACCENT if pick else cs.MUTED)
        ax.text(mp + 0.03, y, f'{mp:.2f} MP, {note}', va='center', fontsize=13, fontweight='semibold')
    cs.header(fig, 'How big a cutout each free remover lets you download',
              'Median megapixels of the free download, 20 test photos of about 1.7 MP each (Oct 21, 2026)')
    cs.footer(fig, 'remove.bg and removal.ai sell the full-size file (credits). Pixlr stopped free saves after 3 photos.',
              'Tested without an account in Chromium. MP = megapixels (width x height / 1,000,000).')
    cs.save(fig, f'{OUT}/free-download-size.webp')


def accuracy():
    order = ['removalai', 'removebg', 'iloveimg']
    fig, ax = cs.figure()
    fig.subplots_adjust(left=0.15, right=0.95, top=0.79, bottom=0.17)
    ax.set_xlim(0, 30)
    ax.set_ylim(-0.6, len(order) - 0.4)
    ys = list(range(len(order) - 1, -1, -1))
    ax.set_yticks(ys)
    ax.set_yticklabels([NAMES[k] for k in order], fontsize=15, fontweight='semibold')
    ax.set_xticks([0, 5, 10, 15, 20])
    ax.set_xlim(0, 26)
    for y, k in zip(ys, order):
        s = S[k]
        cs.rounded_barh(ax, y, 0, s['clean'], 0.56, cs.ACCENT if k == 'removebg' else cs.MUTED)
        ax.text(s['clean'] + 0.2, y, f"{s['clean']}/20 clean, {s['fail']} failed",
                va='center', fontsize=13, fontweight='semibold')
    cs.header(fig, 'Clean cutouts out of 20 photos, checked against hand-made masks',
              'Clean = at least 95% overlap with the hand-drawn AIM-500 mask. Failed = under 80% overlap')
    cs.footer(fig, 'Every failure was a plant photo. Overlap = shared subject area / combined subject area (IoU), at original size.',
              '20 AIM-500 photos: 6 animals, 5 people, 3 plants, 2 furniture, 2 toys, 2 fruit. Pixlr: only 3 photos (daily limit).')
    cs.save(fig, f'{OUT}/cutout-accuracy.webp')


def checker(size, cell=16):
    w, h = size
    im = Image.new('RGB', size, (255, 255, 255))
    px = im.load()
    for yy in range(h):
        for xx in range(w):
            if (xx // cell + yy // cell) % 2:
                px[xx, yy] = (232, 232, 236)
    return im


def examples():
    tools = ['removebg', 'removalai', 'iloveimg']
    photos = ['chelsea', 'astronaut']
    fig = cs.plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Same photos, three free removers',
              'Public-domain test photos: Chelsea the cat (CC0) and a NASA portrait. Checkerboard = transparent')
    cs.footer(fig, 'Free downloads from each site on Oct 21, 2026, shown at the same size. These small photos (under 0.3 MP) came back near full size.')
    cw, ch = 0.29, 0.31
    for i, t in enumerate(tools):
        for j, p in enumerate(photos):
            im = Image.open(WORK / f'exout/{t}/{p}.png').convert('RGBA')
            box = (360, 240) if p == 'chelsea' else (240, 240)
            im = im.resize(box, Image.LANCZOS)
            bg = checker(box)
            bg.paste(im, (0, 0), im)
            x0 = 0.04 + i * (cw + 0.03)
            y0 = 0.45 - j * (ch + 0.035)
            ax = fig.add_axes([x0, y0, cw, ch])
            ax.imshow(bg)
            ax.axis('off')
        fig.text(0.04 + i * (cw + 0.03) + cw / 2, 0.775, NAMES[t], ha='center', fontsize=15, fontweight='semibold')
    cs.save(fig, f'{OUT}/same-photo-three-removers.webp')


if __name__ == '__main__':
    free_size()
    accuracy()
    examples()
