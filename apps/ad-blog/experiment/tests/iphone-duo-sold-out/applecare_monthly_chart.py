"""iPhone Duo 결제 방식별 월 비용 + AppleCare+ 월 요금 (1200×675 webp, 2026-10-28 갱신).

값 출처 (2026-10-28 curl로 받은 일반 페이지, 발췌는 이 폴더 source-*-2026-10-28.txt)
- Apple Card Monthly Installments $83.29, AppleCare+ with Theft and Loss $19.99/mo·$199.99/yr: apple.com/shop/buy-iphone/iphone-duo
- Apple Upgrade 리스 $57.99(24개월)·$82.99(12개월), AppleCare는 리스와 따로 Apple이 청구: apple.com/shop/apple-upgrade
실행: python3 -I applecare_monthly_chart.py <출력 폴더>  (matplotlib·Pillow가 있는 python)
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'

APPLECARE_MONTH = 19.99
APPLECARE_YEAR = 199.99
# (행 이름, 기기 월 납부액)
ROWS = [
    ('Pay in full\n($1,999 up front)', 0.0),
    ('Apple Card Monthly\nInstallments, 24 months', 83.29),
    ('Apple Upgrade lease,\n12 months', 82.99),
    ('Apple Upgrade lease,\n24 months', 57.99),
]


def money(v):
    """달러 표기. matplotlib는 $ 두 개 사이를 수식으로 그리므로 \\$로 씀"""
    return f'${v:,.2f}'.replace('$', r'\$')


def main():
    fig, ax = cs.figure()
    fig.subplots_adjust(left=0.23, right=0.97, top=0.8, bottom=0.2)
    ax.set_xlim(0, 165)
    ax.set_ylim(-0.6, len(ROWS) - 0.4)
    ax.set_xticks([0, 25, 50, 75, 100])
    ax.set_xticklabels(['$0', '$25', '$50', '$75', '$100'])
    ax.set_yticks(range(len(ROWS)))
    ax.set_yticklabels([r[0] for r in reversed(ROWS)], fontweight='semibold', linespacing=1.3)
    for i, (_, device) in enumerate(reversed(ROWS)):
        total = device + APPLECARE_MONTH
        if device:
            cs.rounded_barh(ax, i, 0, device, 0.52, cs.MUTED)
        cs.rounded_barh(ax, i, device, APPLECARE_MONTH, 0.52, cs.ACCENT)
        ax.text(total + 1.5, i + 0.12, f'{money(total)}/mo', fontsize=14, fontweight='bold', va='center')
        how = f'{money(device)} phone + {money(APPLECARE_MONTH)} AppleCare+' if device else f'{money(APPLECARE_MONTH)} AppleCare+ only'
        ax.text(total + 1.5, i - 0.17, how, fontsize=11.5, va='center', color=cs.MUTED)
    cs.header(fig, 'What an iPhone Duo costs each month with AppleCare+',
              'Gray: phone payment. Blue: AppleCare+ with Theft and Loss, which Apple bills separately, even on a lease.')
    cs.footer(fig, 'Sources: Apple Store iPhone Duo page and Apple Upgrade page, base 256GB model, US, before tax, read October 28, 2026.',
              f'Paying AppleCare+ yearly ({money(APPLECARE_YEAR)}) works out to about {money(APPLECARE_YEAR / 12)} a month.')
    cs.save(fig, f'{OUT}/iphone-duo-monthly-cost-with-applecare.webp')


if __name__ == '__main__':
    main()
