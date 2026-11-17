"""convert-publisher-file-to-pdf 본문 그림 (디자인 시스템 라이트 모드 토큰)
실행: /tmp/m/bin/python -I charts.py <출력 폴더>
입력: renders/*.png (변환 PDF를 PDFium으로 렌더링한 쪽 그림), gui/*.png (LibreOffice Draw 화면), shots/*.png (Zamzar 화면),
      results.json (scripts/score.py·visual.py 결과 모음)
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / 'tools'))
import chart_style as cs  # noqa: E402

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
INTER = '/usr/share/fonts/opentype/inter/Inter-{}.otf'
RES = json.loads((HERE / 'results.json').read_text())


def font(w, s):
    return ImageFont.truetype(INTER.format(w), s)


def canvas(w, h, title, subtitle):
    c = Image.new('RGB', (w, h), cs.BACKGROUND)
    d = ImageDraw.Draw(c)
    d.text((40, 30), title, font=font('Bold', 32), fill=cs.FOREGROUND)
    d.text((40, 78), subtitle, font=font('Regular', 20), fill=cs.MUTED)
    return c, d


def footer(c, d, note):
    w, h = c.size
    d.line((40, h - 56, w - 40, h - 56), fill=cs.BORDER, width=1)
    d.text((40, h - 42), note, font=font('Regular', 16), fill=cs.MUTED)
    d.text((w - 40, h - 44), cs.SITE_NAME, font=font('Bold', 19), fill=cs.FOREGROUND, anchor='ra')


def frame(c, d, im, x, y, label, accent):
    c.paste(im, (x, y))
    d.rectangle((x - 1, y - 1, x + im.width, y + im.height), outline=cs.BORDER, width=1)
    d.text((x, y + im.height + 12), label, font=font('SemiBold', 20), fill=cs.ACCENT if accent else cs.FOREGROUND)


def newsletter_compare():
    """뉴스레터 2쪽 위 기사: Publisher가 만든 PDF vs LibreOffice"""
    box = (330, 150, 1100, 800)
    a = Image.open(HERE / 'renders/zamzar-SampleNewsletter-p2.png').convert('RGB').crop(box)
    b = Image.open(HERE / 'renders/libreoffice-24.2.7-SampleNewsletter-p2.png').convert('RGB').crop(box)
    s = 0.72
    a = a.resize((int(a.width * s), int(a.height * s)), Image.LANCZOS)
    b = b.resize((int(b.width * s), int(b.height * s)), Image.LANCZOS)
    gap, top = 40, 140
    W = 40 * 2 + a.width + gap + b.width
    H = top + a.height + 60 + 70
    c, d = canvas(W, H, 'The same newsletter page, two ways',
                  'One story flows through three linked columns. LibreOffice repeats it in every column.')
    frame(c, d, a, 40, top, 'Zamzar (original Office fonts)', True)
    frame(c, d, b, 40 + a.width + gap, top, 'LibreOffice Draw 24.2.7 (26.2 and 26.8 match)', False)
    footer(c, d, 'Sample: Apache POI SampleNewsletter.pub, page 2. Rendered from each PDF on Nov 17, 2026.')
    c.save(OUT / 'publisher-vs-libreoffice-newsletter.webp', 'WEBP', quality=90)
    print('newsletter compare', c.size)


def overlap_chart():
    """뉴스레터: 정답보다 더 나온 단어 비율·겹친 글자 비율"""
    rows = [
        ('Zamzar', RES['zamzar']['SampleNewsletter']),
        ('FreeConvert (LibreOffice 26.2.5)', RES['freeconvert']['SampleNewsletter']),
        ('LibreOffice Draw 24.2.7', RES['libreoffice-24.2.7']['SampleNewsletter']),
        ('CloudConvert (LibreOffice 26.8.0)', RES['cloudconvert']['SampleNewsletter']),
    ]
    fig, axes = cs.figure()
    fig.clf()
    ax1 = fig.add_axes([0.33, 0.20, 0.27, 0.56])
    ax2 = fig.add_axes([0.66, 0.20, 0.30, 0.56])
    y = list(range(len(rows)))[::-1]
    for ax, key, title, xmax in [
        (ax1, 'extra_ratio', 'Extra repeated words', 1.8),
        (ax2, 'overlap_ratio', 'Characters printed on top of others', 0.36),
    ]:
        ax.set_xlim(0, xmax)
        ax.set_ylim(-0.6, len(rows) - 0.4)
        cs.style_axes(ax, 'x')
        ax.set_xticks([])
        for spine in ax.spines.values():
            spine.set_visible(False)
        for yy, (name, r) in zip(y, rows):
            v = r[key]
            color = cs.ACCENT if name.startswith('Zamzar') else cs.MUTED
            if v > 0:
                cs.rounded_barh(ax, yy, 0, v, 0.5, color)
            ax.text(v + xmax * 0.02, yy, f'{v * 100:.0f}%', va='center', ha='left', fontsize=15,
                    fontweight='semibold', color=cs.FOREGROUND)
        ax.set_title(title, loc='left', fontsize=15, fontweight='semibold', color=cs.FOREGROUND, pad=10)
        ax.set_yticks([])
    for yy, (name, _) in zip(y, rows):
        ax1.text(-0.05 * 1.8, yy, name, va='center', ha='right', fontsize=15, color=cs.FOREGROUND,
                 transform=ax1.transData)
    cs.header(fig, 'Only Zamzar kept the newsletter readable',
              '4-page newsletter. Repeated words are counted against the text stored in the .pub file.')
    cs.footer(fig, 'Measured Nov 17, 2026 with PDFium (the PDF engine in Chrome). The engine in brackets is what each PDF names as its maker.')
    cs.save(fig, str(OUT / 'newsletter-repeated-overlapping-text.webp'))
    print('overlap chart')


def results_table():
    """도구별 요약 표"""
    hdr = ['Tool', 'Made the PDF with', 'Brochure (2 pages)', 'Newsletter (4 pages)', 'Free limit']
    rows = [
        ['Zamzar', 'Publisher 2010 (brochure PDF)', 'Original fonts, clean', 'Clean, no repeats', '3 MB per file'],
        ['LibreOffice Draw', 'LibreOffice (on your PC)', 'Close, font swaps', 'Text repeated 3x', 'None, offline'],
        ['FreeConvert', 'LibreOffice 26.2.5', 'Close, Office fonts', 'Text repeated 3x', '1 GB per file'],
        ['CloudConvert', 'LibreOffice 26.8.0', 'Close, font swaps', 'Text repeated 3x', '10 files a day'],
        ['Aspose PUB app', 'Aspose.PUB', 'Server error', 'Server error', '-'],
    ]
    colw = [230, 330, 250, 270, 200]
    rh, top = 58, 150
    W = 40 * 2 + sum(colw)
    H = top + rh * (len(rows) + 1) + 90
    c, d = canvas(W, H, 'Publisher to PDF: what each free tool gave us',
                  'Same two .pub files in every tool, November 17, 2026. "Repeated" means linked columns each show the whole story.')
    y = top
    x = 40
    for i, h in enumerate(hdr):
        d.text((x, y + 18), h, font=font('SemiBold', 18), fill=cs.MUTED)
        x += colw[i]
    y += rh
    for r in rows:
        d.line((40, y, W - 40, y), fill=cs.BORDER, width=1)
        x = 40
        for i, v in enumerate(r):
            good = r[0] == 'Zamzar' and i in (0, 2, 3)
            weight = 'SemiBold' if i == 0 else 'Regular'
            d.text((x, y + 18), v, font=font(weight, 19), fill=cs.ACCENT if good else cs.FOREGROUND)
            x += colw[i]
        y += rh
    d.line((40, y, W - 40, y), fill=cs.BORDER, width=1)
    footer(c, d, 'Maker names come from each PDF\'s properties. Aspose failed with "Could not load file or assembly Aspose.PDF" on both files.')
    c.save(OUT / 'publisher-to-pdf-results-table.webp', 'WEBP', quality=90)
    print('table', c.size)


def libreoffice_menu():
    """LibreOffice Draw File > Export As > Export as PDF 메뉴 (뉴스레터를 연 화면)"""
    im = Image.open(HERE / 'gui/draw-export-as-menu3.png').convert('RGB').crop((0, 0, 940, 600))
    d = ImageDraw.Draw(im)
    # 클릭할 곳: File, Export As, Export as PDF...
    for b in [(2, 2, 30, 19), (4, 323, 174, 343), (174, 320, 304, 340)]:
        d.rounded_rectangle(b, radius=4, outline=cs.ACCENT, width=3)
    s = 1.25
    im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
    top = 130
    W, H = im.width + 80, top + im.height + 80
    c, d2 = canvas(W, H, 'LibreOffice Draw: File > Export As > Export as PDF',
                   'The .pub file opens straight into Draw. The repeated text is already visible before export.')
    c.paste(im, (40, top))
    d2.rectangle((39, top - 1, 40 + im.width, top + im.height), outline=cs.BORDER, width=1)
    footer(c, d2, 'LibreOffice Draw 24.2.7 on Linux with SampleNewsletter.pub open, November 17, 2026.')
    c.save(OUT / 'libreoffice-draw-export-as-pdf.webp', 'WEBP', quality=90)
    print('menu', c.size)


def zamzar_box():
    """Zamzar PUB to PDF 화면: 3MB 한도, Convert Now"""
    im = Image.open(HERE / 'shots/zamzar-SampleBrochure-1.png').convert('RGB').crop((150, 100, 1130, 580))
    d = ImageDraw.Draw(im)
    for b in [(90, 196, 298, 224), (639, 122, 933, 178)]:
        d.rounded_rectangle(b, radius=6, outline=cs.ACCENT, width=3)
    top = 130
    W, H = im.width + 80, top + im.height + 80
    c, d2 = canvas(W, H, 'Zamzar PUB to PDF: upload, then Convert Now',
                   'No sign-in for files up to 3 MB. The PDF downloads from the same page about a minute later.')
    c.paste(im, (40, top))
    d2.rectangle((39, top - 1, 40 + im.width, top + im.height), outline=cs.BORDER, width=1)
    footer(c, d2, 'zamzar.com/convert/pub-to-pdf, November 17, 2026. Free converted files are kept for up to 24 hours.')
    c.save(OUT / 'zamzar-pub-to-pdf.webp', 'WEBP', quality=90)
    print('zamzar', c.size)


if __name__ == '__main__':
    newsletter_compare()
    overlap_chart()
    results_table()
    libreoffice_menu()
    zamzar_box()
