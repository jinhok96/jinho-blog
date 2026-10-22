"""remove-metadata-from-photos 글 그래픽

데이터: results/summary.json (analyze.py), results/{사이트}.json (run_web.py 업로드 기록)
결과 이미지: /tmp/meta/res/{도구}/, 원본: /tmp/meta/set/, 스크린샷: /tmp/meta/shots·/tmp/meta/probe
실행: /tmp/gsc/bin/python -I charts.py <출력 폴더>
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
from PIL import Image, ImageDraw, ImageOps  # noqa: E402

HERE = Path(__file__).resolve().parent
OUT = sys.argv[1] if len(sys.argv) > 1 else '.'
WORK = Path('/tmp/meta')
S = json.load(open(HERE / 'results/summary.json'))
UPLOAD = {s: json.load(open(HERE / f'results/{s}.json')) for s in ('exifremove', 'jimpl', 'verexif', 'imgonline')}
PRIVATE = ['gps', 'camera', 'serial', 'date', 'author', 'xmp_iptc_city', 'thumbnail']

# (키, 이름, 종류, 설정)
TOOLS = [
    ('exifcleaner', 'ExifCleaner 4.6.0', 'Desktop app', 'default'),
    ('exifremove', 'ExifRemove', 'Website', 'default'),
    ('xnconvert_nometa', 'XnConvert 1.118', 'Desktop app', 'Preserve Metadata off'),
    ('jimpl', 'Jimpl', 'Website', 'default'),
    ('verexif', 'Verexif', 'Website', 'default'),
    ('imgonline', 'IMGonline', 'Website', 'default'),
]


def checks(key):
    rows = S[key].values()
    removed = all(not any(r[k] for k in PRIVATE) for r in rows)
    upright = sum(r['orientation_ok'] for r in rows), len(rows)
    untouched = sum(r['raw_pixels_identical'] for r in rows), len(rows)
    if key in UPLOAD:
        local = not any(v['uploaded'] for v in UPLOAD[key].values())
    else:
        local = True  # 데스크톱 앱: 네트워크를 쓰지 않는 로컬 처리
    return removed, upright, untouched, local


def results_table():
    fig = cs.plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Every tool removed the location. Most turned portrait photos sideways',
              'Our test photos had GPS, camera, serial number, date, author and a thumbnail. Default settings except where noted')
    cs.footer(fig, 'Desktop apps: 8 photos each. Websites: 4 photos each (2 portrait). "Unchanged" = stored pixels identical to the original.',
              'XnConvert keeps all metadata by default; result shown with Preserve Metadata turned off. Tested Oct 22, 2026.')
    cols = ['Location & camera\ndata removed', 'Portrait photos\nstay upright', 'Image left\nunchanged', 'Photo stays on\nyour device']
    x_name, xs = 0.03, [0.42, 0.56, 0.70, 0.84]
    top = 0.74
    for x, c in zip(xs, cols):
        fig.text(x + 0.05, top, c, ha='center', va='bottom', fontsize=12.5, fontweight='semibold', color=cs.MUTED)
    row_h = 0.098
    for i, (key, name, kind, setting) in enumerate(TOOLS):
        y = top - 0.06 - i * row_h
        if i:
            fig.add_artist(cs.plt.Line2D([0.03, 0.97], [y + row_h / 2, y + row_h / 2], color=cs.BORDER, lw=1))
        fig.text(x_name, y + 0.012, name, fontsize=15, fontweight='bold', va='center')
        fig.text(x_name, y - 0.025, kind + ('' if setting == 'default' else f' · {setting}'), fontsize=11, color=cs.MUTED, va='center')
        removed, upright, untouched, local = checks(key)
        vals = [
            ('Yes', True) if removed else ('No', False),
            ('Yes' if upright[0] == upright[1] else f'No ({upright[1] - upright[0]} of 2 sideways)', upright[0] == upright[1]),
            ('Yes' if untouched[0] == untouched[1] else ('All re-compressed' if untouched[0] == 0 else 'Portraits re-saved'), untouched[0] == untouched[1]),
            ('Yes' if local else 'No, uploaded', local),
        ]
        for x, (txt, good) in zip(xs, vals):
            fig.text(x + 0.05, y, txt, ha='center', va='center', fontsize=13 if len(txt) < 12 else 11.5,
                     fontweight='semibold', color=cs.ACCENT if good else cs.MUTED)
    cs.save(fig, f'{OUT}/photo-metadata-remover-results.webp')


def framed(im, box):
    im = im.convert('RGB')
    im.thumbnail(box, Image.LANCZOS)
    ImageDraw.Draw(im).rectangle((0, 0, im.width - 1, im.height - 1), outline=cs.BORDER)
    return im


def sideways():
    """세로 사진(03): 원본이 화면에 보이는 모습 vs 회전 정보를 지운 결과 vs 회전을 지킨 결과"""
    panels = [
        (WORK / 'set/03.jpg', 'Original photo', 'Rotation tag tells apps to turn it upright', cs.MUTED),
        (WORK / 'res/jimpl/03.jpg', 'Jimpl, Verexif, IMGonline', 'Rotation tag removed: shows up sideways', cs.ACCENT),
        (WORK / 'res/exifremove/03.jpg', 'ExifRemove, ExifCleaner 4.6.0', 'Still upright after cleaning', cs.MUTED),
    ]
    fig = cs.plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Why a "cleaned" phone photo can turn sideways',
              'Phones often save portrait photos sideways plus a rotation tag. Deleting every tag deletes that instruction too')
    cs.footer(fig, 'Same portrait test photo (stored as 4032x3024 with EXIF orientation "Rotate 90 CW"), opened the way apps display it.',
              'Tested Oct 22, 2026. XnConvert also kept it upright by rotating the pixels and re-compressing the photo.')
    w = 0.29
    for i, (path, title, sub, color) in enumerate(panels):
        x0 = 0.04 + i * (w + 0.025)
        im = framed(ImageOps.exif_transpose(Image.open(path)), (560, 560))
        ax = fig.add_axes([x0, 0.20, w, 0.50])
        ax.imshow(im)
        ax.axis('off')
        fig.text(x0 + w / 2, 0.775, title, ha='center', fontsize=14, fontweight='bold')
        fig.text(x0 + w / 2, 0.145, sub, ha='center', fontsize=12, color=color, fontweight='semibold' if color == cs.ACCENT else 'normal')
    cs.save(fig, f'{OUT}/sideways-photo-after-removing-metadata.webp')


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
    results_table()
    sideways()
    # ExifCleaner 4.6.0 설정: Preserve orientation·Save as copy (기본 켜짐)
    screenshot(WORK / 'shots/ec46_settings.png', f'{OUT}/exifcleaner-settings-preserve-orientation.webp', (0, 0, 900, 700),
               [(596, 270, 872, 346), (596, 570, 872, 646)])
    # XnConvert Output 탭: Preserve Metadata 기본 체크
    screenshot(WORK / 'shots/xnc_output.png', f'{OUT}/xnconvert-preserve-metadata-option.webp', (0, 0, 700, 560),
               [(32, 442, 176, 465)])
    # ExifRemove 결과: Keep photos the right way up, 정리 완료
    screenshot(WORK / 'shots/exifremove_done.png', f'{OUT}/exifremove-cleaned-photos.webp', (60, 455, 1220, 1280),
               [(95, 862, 730, 932)])
    # Jimpl: 테스트 사진에서 읽힌 위치·카메라·작성자
    screenshot(WORK / 'probe/jimpl_after.png', f'{OUT}/photo-metadata-shown-by-jimpl.webp', (0, 0, 1280, 960),
               [(650, 668, 1250, 958)])
