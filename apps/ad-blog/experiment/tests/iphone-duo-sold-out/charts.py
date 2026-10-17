"""iPhone Duo 결제 방식별 24개월 비용 그래프 + 주문 일정 타임라인 (1200×675 webp).

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

PRICE = 1999.00
ACMI = 83.29  # 24개월, 마지막 달은 잔액
LEASE_24 = 57.99
lease_paid = round(LEASE_24 * 24, 2)
buyout = round(PRICE - lease_paid, 2)


def save(fig, name):
    b = io.BytesIO()
    fig.savefig(b, format='png', dpi=100, facecolor=SURF)
    path = f'{OUT}/{name}'
    Image.open(b).convert('RGB').save(path, 'WEBP', quality=90)
    print(path, Image.open(path).size)


def cost_chart():
    rows = [
        ('Pay in full', PRICE, 0, 'You own it'),
        (f'Apple Card Monthly\nInstallments (${ACMI}/mo)', PRICE, 0, 'You own it'),
        (f'Apple Upgrade lease\n(${LEASE_24}/mo), return it', lease_paid, 0, 'You give it back'),
        ('Apple Upgrade lease,\nthen buy it', lease_paid, buyout, 'You own it'),
    ]
    fig, ax = plt.subplots(figsize=(12, 6.75))
    ax.set_facecolor(SURF)
    ys = list(range(len(rows)))[::-1]
    for y, (label, paid, extra, outcome) in zip(ys, rows):
        ax.barh(y, paid, height=0.52, color=BLUE)
        if extra:
            # 2px 표면 간격으로 두 구간을 나눔
            ax.barh(y, extra - 6, left=paid + 6, height=0.52, color=ORANGE)
            ax.text(paid + extra / 2, y, f'${extra:,.2f}\nbuyout', ha='center', va='center', fontsize=12, color=SURF, fontweight='bold')
        total = paid + extra
        ax.text(total + 25, y + 0.07, f'${total:,.2f}', va='bottom', fontsize=16, fontweight='bold')
        ax.text(total + 25, y - 0.05, outcome, va='top', fontsize=13, color=INK2)
    ax.set_yticks(ys)
    ax.set_yticklabels([r[0] for r in rows])
    ax.set_xlim(0, 2450)
    ax.set_ylim(-0.6, len(rows) - 0.4)
    ax.xaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f'${v:,.0f}'))
    ax.grid(axis='x', color=GRID, lw=1)
    ax.set_axisbelow(True)
    for s in ['top', 'right', 'left']:
        ax.spines[s].set_visible(False)
    ax.spines['bottom'].set_color(GRID)
    ax.tick_params(axis='y', length=0)
    fig.suptitle('What a $1,999 iPhone Duo costs over 24 months', x=0.012, ha='left', fontsize=21, fontweight='bold', y=0.965)
    fig.text(0.012, 0.885, 'Blue: payments during the 24 months · Orange: one-time payment to keep a leased phone',
             fontsize=13, color=INK2)
    fig.text(0.012, 0.018, 'Base 256GB model, before tax, trade-in, and AppleCare. Source: Apple Store and Apple Upgrade pages, checked Oct 17, 2026',
             fontsize=11.5, color=INK2)
    fig.subplots_adjust(left=0.235, right=0.975, top=0.84, bottom=0.12)
    save(fig, 'iphone-duo-cost-by-payment.webp')


def timeline():
    d = lambda y, m, dd: mdates.date2num(date(y, m, dd))
    # (날짜, 위/아래, 문구 정렬, 문구, 공식 발표 여부)
    events = [
        (d(2026, 9, 9), 1, 'center', 'Sep 9\nApple announces\niPhone Duo', True),
        (d(2026, 10, 16), -1, 'right', 'Oct 16\nPre-orders open\n5 a.m. PT', True),
        (d(2026, 10, 23), 1, 'center', 'Oct 23\nFirst pre-orders\narrive (U.S.)', True),
        (d(2026, 10, 30), -1, 'left', 'Oct 30\nLaunch in 28 more\ncountries and regions', True),
        (d(2027, 1, 25), 1, 'center', 'Late Jan 2027\nShip estimate for\nnew orders (reported)', False),
    ]
    fig, ax = plt.subplots(figsize=(12, 6.75))
    ax.set_facecolor(SURF)
    x0, x1 = d(2026, 9, 1), d(2027, 2, 20)
    ax.plot([x0, x1], [0, 0], color=INK2, lw=2, zorder=1)
    # 주문 후 대기 구간 (보도 기준)
    ax.barh(0, d(2027, 1, 25) - d(2026, 10, 17), left=d(2026, 10, 17), height=0.16, color=BLUE, alpha=0.35, zorder=2)
    ax.text(d(2026, 12, 12), 0.13, 'About 14 weeks between ordering now and delivery',
            ha='center', va='bottom', fontsize=13, color=INK2)
    for x, side, align, text, official in events:
        ax.plot([x, x], [0, 0.42 * side], color=GRID, lw=2, zorder=1)
        if official:
            ax.plot([x], [0], 'o', ms=14, color=ORANGE, mec=SURF, mew=2, zorder=3)
        else:
            ax.plot([x], [0], 'o', ms=14, color=SURF, mec=ORANGE, mew=3, zorder=3)
        dx = {'center': 0, 'right': 2, 'left': -2}[align]
        ax.text(x + dx, 0.46 * side, text, ha=align, va='bottom' if side > 0 else 'top', fontsize=14)
    ax.set_xlim(x0, x1)
    ax.set_ylim(-1.15, 1.15)
    ax.set_yticks([])
    ax.xaxis.set_major_locator(mdates.MonthLocator())
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%b\n%Y'))
    for s in ['top', 'right', 'left']:
        ax.spines[s].set_visible(False)
    ax.spines['bottom'].set_color(GRID)
    fig.suptitle('iPhone Duo: from announcement to your door', x=0.012, ha='left', fontsize=21, fontweight='bold', y=0.965)
    fig.text(0.012, 0.885, 'Filled dot: date from Apple · Hollow dot: Apple Store estimate reported by 9to5Mac and others on Oct 16',
             fontsize=13, color=INK2)
    fig.text(0.012, 0.018, 'Source: Apple Newsroom (Sep 9 and Oct 15, 2026), 9to5Mac (Oct 16, 2026). Estimates change as Apple adds stock.',
             fontsize=11.5, color=INK2)
    fig.subplots_adjust(left=0.03, right=0.97, top=0.84, bottom=0.14)
    save(fig, 'iphone-duo-order-timeline.webp')


if __name__ == '__main__':
    cost_chart()
    timeline()
