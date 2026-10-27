"""iPhone Duo 화면 균열 칼럼 그래픽: Apple 수리 가격 화면 캡처 + 화면 수리비 비교 + 2년 비용 + 기한 타임라인 (1200×675 webp).

내용 출처는 factcheck.md. 캡처 원본 `price-widget-service.png`·`price-widget-applecare.png`는 shot_prices.cjs·shot_applecare.cjs로
찍은 support.apple.com/iphone/repair/screen-replacement 가격 위젯(iPhone Duo 선택, 1000px 폭, 2026-10-27 21:4x UTC).
가격 숫자는 같은 위젯이 부르는 API 응답 `api-pricing-OOW.json`·`api-pricing-AC2B.json`, AppleCare+ 요금은 `api-applecare-product-price.json`.
실행: python3 -I charts.py <출력 폴더>  (matplotlib·Pillow가 있는 python)
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Rectangle  # noqa: E402
from PIL import Image  # noqa: E402

HERE = Path(__file__).resolve().parent
OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'


def prices(kind):
    """API 응답에서 {기기 이름: {서비스: 달러}}"""
    data = json.loads((HERE / f'api-pricing-{kind}.json').read_text())
    out = {}
    for product in data['products']:
        for child in product.get('childrenProducts', []):
            out[child['product_eng_title']] = {
                s['serviceLabel']: float(s['price'].replace('$', '').replace(',', '')) for s in child['services']
            }
    return out


OOW = prices('OOW')
AC = prices('AC2B')
# AppleCare+ with Theft and Loss for iPhone Duo: 같은 이름이 월간·연간 2개 → 요금 주기로 구분
_DUO_PLANS = [v for v in json.loads((HERE / 'api-applecare-product-price.json').read_text())['items'].values()
              if v['name'].replace('\xa0', ' ') == 'AppleCare+ with Theft and Loss for iPhone Duo']
PLAN_YEAR = next(v['price']['value'] for v in _DUO_PLANS if v['price']['display']['coverageTerm'].startswith('Annual'))
PLAN_MONTH = next(v['price']['value'] for v in _DUO_PLANS if v['price']['display']['coverageTerm'].startswith('Monthly'))


def money(v):
    """달러 표기. matplotlib는 $ 두 개 사이를 수식으로 그리므로 \\$로 씀"""
    return (f'${v:,.0f}' if v == int(v) else f'${v:,.2f}').replace('$', r'\$')


def price_screenshots():
    """보증 외·AppleCare 두 탭의 가격 목록을 나란히, 내부 화면 줄을 accent 상자로 (Apple 제품 사진은 잘라 냄)"""
    # (파일, 자를 영역 (left, top, right, bottom), 내부 화면 줄 y 범위, 패널 이름)
    panels = [
        ('price-widget-service.png', (318, 466, 852, 800), (728, 762), 'Without AppleCare (out of warranty)'),
        ('price-widget-applecare.png', (318, 292, 852, 588), (476, 510), 'With AppleCare+ or AppleCare One'),
    ]
    fig = plt.figure(figsize=cs.FIGSIZE)
    fig.patch.set_facecolor(cs.BACKGROUND)
    cs.header(fig, 'Apple\'s own iPhone Duo repair prices',
              'Apple\'s repair estimator with iPhone Duo selected, both tabs. Read October 27, 2026.')
    for i, (name, crop, (y0, y1), label) in enumerate(panels):
        img = Image.open(HERE / name).convert('RGB').crop(crop)
        w_px, h_px = img.size
        scale = 0.94 * 540 / w_px
        disp_w, disp_h = w_px * scale, h_px * scale
        left = 36 + i * 576
        bottom = 78 + (460 - disp_h) / 2
        ax = fig.add_axes([left / 1200, bottom / 675, disp_w / 1200, disp_h / 675])
        ax.imshow(img)
        ax.axis('off')
        ax.add_patch(Rectangle((2, y0 - crop[1] - 4), w_px - 4, (y1 - y0) + 8, fill=False, edgecolor=cs.ACCENT, lw=3, zorder=3))
        fig.text(left / 1200, (bottom + disp_h + 14) / 675, label, fontsize=14, fontweight='bold')
    cs.footer(fig, 'Source: support.apple.com/iphone/repair/screen-replacement, captured in Chromium on October 27, 2026 (UTC).',
              'Out-of-warranty prices are estimates before tax; Apple inspects the phone first. Boxes added by ToolProof.')
    cs.save(fig, f'{OUT}/apple-iphone-duo-repair-prices.webp')


def screen_compare():
    """보증 외 화면 수리비: iPhone Duo 내부 화면(accent) vs 외부 화면·iPhone 18 Pro·Pro Max 화면, AppleCare 요금은 막대 옆 글자로"""
    rows = [
        ('iPhone Duo inner screen', OOW['iPhone Duo']['Inner display damage'], AC['iPhone Duo']['Inner display damage'], True),
        ('iPhone Duo outer screen', OOW['iPhone Duo']['Outer display damage'], AC['iPhone Duo']['Outer display damage'], False),
        ('iPhone 18 Pro Max screen', OOW['iPhone 18 Pro Max']['Screen damage'], AC['iPhone 18 Pro Max']['Screen damage'], False),
        ('iPhone 18 Pro screen', OOW['iPhone 18 Pro']['Screen damage'], AC['iPhone 18 Pro']['Screen damage'], False),
        ('iPhone Duo cover layer only', OOW['iPhone Duo']['Cover layer damage'], AC['iPhone Duo']['Cover layer damage'], False),
    ]
    fig, ax = cs.figure()
    fig.subplots_adjust(left=0.25, right=0.97, top=0.8, bottom=0.2)
    ax.set_xlim(0, 1300)
    ax.set_ylim(-0.6, len(rows) - 0.4)
    ax.set_xticks([0, 250, 500, 750, 1000])
    ax.set_xticklabels(['$0', '$250', '$500', '$750', '$1,000'])
    ax.set_yticks(range(len(rows)))
    ax.set_yticklabels([r[0] for r in reversed(rows)], fontweight='semibold')
    for i, (name, oow, ac, hot) in enumerate(reversed(rows)):
        cs.rounded_barh(ax, i, 0, oow, 0.52, cs.ACCENT if hot else cs.MUTED)
        ax.text(oow + 14, i + 0.12, money(oow), fontsize=14, fontweight='bold', va='center',
                color=cs.ACCENT if hot else cs.FOREGROUND)
        ax.text(oow + 14, i - 0.17, f'{money(ac)} with AppleCare', fontsize=11.5, va='center', color=cs.MUTED)
    ratio = OOW['iPhone Duo']['Inner display damage'] / OOW['iPhone 18 Pro Max']['Screen damage']
    cs.header(fig, 'A cracked iPhone Duo inner screen costs the most to fix',
              f'Apple\'s out-of-warranty estimates: the inner screen is {ratio:.1f} times the price of an iPhone 18 Pro Max screen.')
    cs.footer(fig, 'Source: Apple repair estimator (support.apple.com/iphone/repair), US prices before tax, read October 27, 2026.',
              'A defect covered by Apple\'s one-year warranty has no repair fee; these prices apply to damage such as drops or pressure.')
    cs.save(fig, f'{OUT}/iphone-duo-vs-iphone-18-pro-screen-repair.webp')


def two_year_cost():
    """2년 동안 내부 화면 사고 1번이 났을 때 총비용: AppleCare+ 없이 vs 연간·월간 AppleCare+ (+사고 없을 때 보험료만)"""
    year, month = PLAN_YEAR, PLAN_MONTH
    inner_oow = OOW['iPhone Duo']['Inner display damage']
    inner_ac = AC['iPhone Duo']['Inner display damage']
    rows = [
        ('No AppleCare+,\none inner screen accident', inner_oow, f'{money(inner_oow)} repair', True),
        ('AppleCare+ paid yearly,\none inner screen accident', 2 * year + inner_ac, f'2 x {money(year)} + {money(inner_ac)} fee', False),
        ('AppleCare+ paid monthly,\none inner screen accident', 24 * month + inner_ac, f'24 x {money(month)} + {money(inner_ac)} fee', False),
        ('AppleCare+ paid yearly,\nno accident', 2 * year, f'2 x {money(year)}', False),
    ]
    fig, ax = cs.figure()
    fig.subplots_adjust(left=0.27, right=0.97, top=0.8, bottom=0.2)
    ax.set_xlim(0, 1300)
    ax.set_ylim(-0.6, len(rows) - 0.4)
    ax.set_xticks([0, 250, 500, 750, 1000])
    ax.set_xticklabels(['$0', '$250', '$500', '$750', '$1,000'])
    ax.set_yticks(range(len(rows)))
    ax.set_yticklabels([r[0] for r in reversed(rows)], fontweight='semibold', linespacing=1.3)
    for i, (name, total, how, hot) in enumerate(reversed(rows)):
        cs.rounded_barh(ax, i, 0, total, 0.52, cs.ACCENT if hot else cs.MUTED)
        ax.text(total + 14, i + 0.12, money(total), fontsize=14, fontweight='bold', va='center',
                color=cs.ACCENT if hot else cs.FOREGROUND)
        ax.text(total + 14, i - 0.17, how, fontsize=11.5, va='center', color=cs.MUTED)
    cs.header(fig, 'Two years with an iPhone Duo: AppleCare+ vs. one accident',
              'Total cost if the inner screen is damaged once by accident (not the defect Apple acknowledged).')
    cs.footer(fig, 'Sources: Apple repair estimator and AppleCare pricing for iPhone Duo (AppleCare+ with Theft and Loss), US, before tax,',
              'read October 27, 2026. Plan prices can change; Apple renews AppleCare+ until you cancel.')
    cs.save(fig, f'{OUT}/iphone-duo-applecare-two-year-cost.webp')


# (날짜 라벨, 그래프 위치(10-16부터 일수), 설명, 강조)
EVENTS = [
    ('Oct 16', 0, 'Pre-orders\nopen', False),
    ('Oct 23', 7, 'First phones\narrive, stores\nstart selling', False),
    ('Oct 26', 10, 'Apple says it\'s\naware of an inner\nscreen issue', True),
    ('Nov 6', 21, 'Last day to return\nan Oct 23 delivery\n(14 days)', True),
    ('Dec 15-22', 60, 'AppleCare+ window\ncloses for launch-week\nbuyers (60 days)', True),
    ('Oct 2027', 82, 'One-year warranty\nends for launch-\nweek phones', False),
]


def deadlines():
    fig = plt.figure(figsize=cs.FIGSIZE)
    ax = fig.add_axes([0.04, 0.12, 0.92, 0.7])
    ax.set_xlim(-4, 88)
    ax.set_ylim(0, 1)
    ax.axis('off')
    cs.header(fig, 'iPhone Duo screen problems: the dates that matter',
              'Count from the day you received or bought the phone. Dates below are for launch-week phones.')
    y = 0.58
    ax.plot([0, 70], [y, y], color=cs.BORDER, lw=3, solid_capstyle='round', zorder=1)
    ax.plot([70, 76], [y, y], color=cs.BORDER, lw=3, ls=(0, (1.5, 2.5)), zorder=1)
    ax.plot([76, 82], [y, y], color=cs.BORDER, lw=3, solid_capstyle='round', zorder=1)
    for i, (date, x, what, hot) in enumerate(EVENTS):
        color = cs.ACCENT if hot else cs.MUTED
        ax.scatter([x], [y], s=190, color=color, zorder=3, edgecolor=cs.BACKGROUND, linewidth=2.5)
        up = i % 2 == 0
        ax.text(x, y + (0.1 if up else -0.1), date, fontsize=15, fontweight='bold', ha='center',
                va='bottom' if up else 'top', color=cs.ACCENT if hot else cs.FOREGROUND)
        ax.text(x, y + (0.21 if up else -0.2), what, fontsize=12, ha='center', va='bottom' if up else 'top', linespacing=1.35)
    cs.footer(fig, 'Sources: Apple Newsroom (October 23, 2026), Apple returns policy (14 days from receipt), AppleCare FAQ (plans within 60 days',
              'of purchase in Settings), Apple One (1) Year Limited Warranty. Apple\'s statement on October 26 was given to 9to5Mac.')
    cs.save(fig, f'{OUT}/iphone-duo-screen-deadlines.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    price_screenshots()
    screen_compare()
    two_year_cost()
    deadlines()
