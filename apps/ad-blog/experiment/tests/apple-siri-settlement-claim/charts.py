"""Apple Siri 합의금: 청구율별 기기당 지급액 그래프 + 일정 타임라인 (1200×675 webp).

값과 날짜 출처는 factcheck.md. 실행: python charts.py <출력 폴더>
"""
import io
import sys
from datetime import date

import matplotlib
matplotlib.use('Agg')
import matplotlib.dates as mdates
import matplotlib.pyplot as plt
from PIL import Image

OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'
SURF, INK, INK2, GRID, BLUE, ORANGE = '#fcfcfb', '#0b0b0b', '#52514e', '#e4e3df', '#2a78d6', '#c2560f'
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 15, 'text.color': INK, 'xtick.color': INK2, 'ytick.color': INK})

# 법원 문서 기준 값 (ECF 77·78·78-1·78-2)
TOTAL = 250_000_000
FEES_MAX = 70_000_000        # 변호사 보수·비용 상한 28% (신청 예정 최대치)
ADMIN_MAX = 5_444_056        # Verita 통지·관리 비용 상한
SERVICE = 130_000            # 대표 원고 65명 × $2,000
DEVICES = 37_000_000         # 대상 기기 약 3,700만 대
NET = TOTAL - FEES_MAX - ADMIN_MAX - SERVICE
CAP, PRESUMPTIVE = 95, 25

# 신청서(ECF 77)가 비교 사례로 든 과거 합의의 청구율
PAST = [('Siri privacy\n(Lopez v. Apple)', 2.57), ('Apple Watch\nscreens', 3.35), ('iPhone\nslowdowns', 3.6), ('Nexus 6P', 18.0)]


def payout(rate_pct):
    return min(CAP, NET / (DEVICES * rate_pct / 100))


def save(fig, name):
    b = io.BytesIO()
    fig.savefig(b, format='png', dpi=100, facecolor=SURF)
    path = f'{OUT}/{name}'
    Image.open(b).convert('RGB').save(path, 'WEBP', quality=90)
    print(path, Image.open(path).size)


def payout_chart():
    fig, ax = plt.subplots(figsize=(12, 6.75))
    ax.set_facecolor(SURF)
    xs = [x / 20 for x in range(10, 30 * 20 + 1)]
    ax.plot(xs, [payout(x) for x in xs], color=BLUE, lw=3.5, zorder=3)
    cap_at = NET / (DEVICES * CAP) * 100
    even_at = NET / (DEVICES * PRESUMPTIVE) * 100
    ax.axhline(PRESUMPTIVE, color=INK2, lw=1.2, ls=(0, (4, 3)), zorder=1)
    ax.text(29.8, PRESUMPTIVE + 2, '$25 "presumptive" payment', ha='right', fontsize=13, color=INK2)
    ax.plot([even_at], [PRESUMPTIVE], 'o', ms=11, color=BLUE, mec=SURF, mew=2, zorder=4)
    ax.annotate(f'${PRESUMPTIVE} if about {even_at:.0f}% of\ndevices are claimed', (even_at, PRESUMPTIVE), (even_at + 1.2, 52),
                fontsize=14, arrowprops=dict(arrowstyle='-', color=INK2, lw=1))
    ax.annotate(f'$95 cap holds up to\nabout {cap_at:.0f}% claimed', (cap_at, CAP), (cap_at + 1.5, 80),
                fontsize=14, arrowprops=dict(arrowstyle='-', color=INK2, lw=1))
    for label, rate in PAST:
        ax.plot([rate], [payout(rate)], 'o', ms=12, color=ORANGE, mec=SURF, mew=2, zorder=5)
    ax.text(3.0, 101, 'Past Apple and phone settlements: 2.6%-3.6% claimed', ha='left', fontsize=13, color=ORANGE)
    ax.text(18.0, payout(18.0) - 9, 'Nexus 6P: 18%', ha='center', fontsize=13, color=ORANGE)
    ax.set_xlim(0, 30)
    ax.set_ylim(0, 108)
    ax.set_xlabel('Share of the ~37 million eligible iPhones with a valid claim', fontsize=14, color=INK2)
    ax.xaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f'{v:.0f}%'))
    ax.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f'${v:.0f}'))
    ax.grid(color=GRID, lw=1)
    ax.set_axisbelow(True)
    for s in ['top', 'right']:
        ax.spines[s].set_visible(False)
    ax.spines['left'].set_color(GRID)
    ax.spines['bottom'].set_color(GRID)
    fig.suptitle('Apple Siri settlement: what you get depends on who claims', x=0.012, ha='left', fontsize=21, fontweight='bold', y=0.965)
    fig.text(0.012, 0.885, f'Estimated payment per iPhone · ${NET / 1e6:,.1f}M left after maximum fees and costs, split among claimed devices',
             fontsize=13, color=INK2)
    fig.text(0.012, 0.018, 'Our estimate from court filings in Landsheft v. Apple (N.D. Cal. 5:25-cv-02668): settlement, fee cap, admin cost cap, device count, past claim rates',
             fontsize=11.5, color=INK2)
    fig.subplots_adjust(left=0.07, right=0.975, top=0.84, bottom=0.15)
    save(fig, 'apple-siri-settlement-payout-by-claim-rate.webp')


def timeline():
    d = lambda y, m, dd: mdates.date2num(date(y, m, dd))
    events = [
        (d(2026, 5, 5), 1, 'left', 'May 5\nSettlement filed'),
        (d(2026, 7, 17), -1, 'center', 'Jul 17\nJudge gives\npreliminary approval'),
        (d(2026, 9, 21), 1, 'center', 'Sep 21\nClaims open'),
        (d(2026, 12, 21), -1, 'center', 'Dec 21\nLast day to claim,\nopt out or object'),
        (d(2027, 2, 24), 1, 'right', 'Feb 24, 2027\nFinal approval\nhearing'),
    ]
    fig, ax = plt.subplots(figsize=(12, 6.75))
    ax.set_facecolor(SURF)
    x0, x1, end = d(2026, 4, 15), d(2027, 7, 1), d(2027, 3, 10)
    ax.plot([x0, end], [0, 0], color=INK2, lw=2, zorder=1)
    ax.plot([end, x1], [0, 0], color=INK2, lw=2, ls=(0, (2, 3)), zorder=1)
    ax.text((end + x1) / 2 + 8, -0.16, 'Payments: 60 days\nafter approval is final\n(later if appealed)', ha='center', va='top', fontsize=14, color=INK2)
    today = d(2026, 10, 19)
    ax.plot([today, today], [-0.3, 0.3], color=BLUE, lw=3, zorder=2)
    ax.text(today, 0.34, 'Today', ha='center', va='bottom', fontsize=13, color=BLUE, fontweight='bold')
    for x, side, align, text in events:
        ax.plot([x, x], [0, 0.5 * side], color=GRID, lw=2, zorder=1)
        ax.plot([x], [0], 'o', ms=14, color=ORANGE, mec=SURF, mew=2, zorder=3)
        dx = {'center': 0, 'right': 2, 'left': -2}[align]
        ax.text(x + dx, 0.54 * side, text, ha=align, va='bottom' if side > 0 else 'top', fontsize=14)
    ax.set_xlim(x0, x1)
    ax.set_ylim(-1.2, 1.2)
    ax.set_yticks([])
    ax.xaxis.set_major_locator(mdates.MonthLocator(bymonth=[1, 3, 5, 7, 9, 11]))
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%b\n%Y'))
    for s in ['top', 'right', 'left']:
        ax.spines[s].set_visible(False)
    ax.spines['bottom'].set_color(GRID)
    fig.suptitle('Apple Siri settlement: key dates', x=0.012, ha='left', fontsize=21, fontweight='bold', y=0.965)
    fig.text(0.012, 0.885, 'Dots: dates from court filings or class counsel · Dashed line: payment date not set as of Oct 19, 2026',
             fontsize=13, color=INK2)
    fig.text(0.012, 0.018, 'Source: Landsheft v. Apple, N.D. Cal. ECF 78, 94, 97; Dec 21 deadline from class counsel (Clarkson Law Firm); Sep 21 as reported',
             fontsize=11.5, color=INK2)
    fig.subplots_adjust(left=0.03, right=0.97, top=0.84, bottom=0.14)
    save(fig, 'apple-siri-settlement-timeline.webp')


if __name__ == '__main__':
    print(f'NET={NET:,} cap_at={NET / (DEVICES * CAP) * 100:.2f}% even_at={NET / (DEVICES * PRESUMPTIVE) * 100:.2f}%')
    for _, r in PAST:
        print(r, round(payout(r), 2))
    payout_chart()
    timeline()
