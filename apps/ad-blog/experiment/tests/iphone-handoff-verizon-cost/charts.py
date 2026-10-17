"""iPhone Handoff 통신사별 누적 요금 그래프 + 발표 일정 타임라인 (1200×675 webp).

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

# 월 요금 (세금·수수료 제외). AT&T는 미지원(None)
FEES = [('T-Mobile', 5.0, 'Available now'), ('Verizon', 10.0, 'Coming soon, no date yet'), ('AT&T', None, 'Not offered as of Oct 17, 2026')]


def save(fig, name):
    b = io.BytesIO()
    fig.savefig(b, format='png', dpi=100, facecolor=SURF)
    path = f'{OUT}/{name}'
    Image.open(b).convert('RGB').save(path, 'WEBP', quality=90)
    print(path, Image.open(path).size)


def cost_chart():
    fig, ax = plt.subplots(figsize=(12, 6.75))
    ax.set_facecolor(SURF)
    h = 0.32
    ys = list(range(len(FEES)))[::-1]
    for y, (name, fee, status) in zip(ys, FEES):
        if fee is None:
            ax.text(4, y, status, va='center', fontsize=15, color=INK2, style='italic')
            continue
        for off, months, color in ((h / 2 + 0.02, 12, BLUE), (-h / 2 - 0.02, 24, ORANGE)):
            total = fee * months
            ax.barh(y + off, total, height=h, color=color)
            ax.text(total + 4, y + off, f'${total:,.0f} over {months} months', va='center', fontsize=14)
    ax.set_yticks(ys)
    ax.set_yticklabels([f'{n}\n' + (f'${f:.0f}/month' if f else 'no price') for n, f, _ in FEES])
    ax.set_xlim(0, 330)
    ax.set_ylim(-0.6, len(FEES) - 0.4)
    ax.xaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f'${v:,.0f}'))
    ax.grid(axis='x', color=GRID, lw=1)
    ax.set_axisbelow(True)
    for s in ['top', 'right', 'left']:
        ax.spines[s].set_visible(False)
    ax.spines['bottom'].set_color(GRID)
    ax.tick_params(axis='y', length=0)
    fig.suptitle('What iPhone Handoff adds to your phone bill', x=0.012, ha='left', fontsize=21, fontweight='bold', y=0.965)
    fig.text(0.012, 0.885, 'Blue: 12 months · Orange: 24 months · One phone number shared by two iPhones',
             fontsize=13, color=INK2)
    fig.text(0.012, 0.018, 'Before taxes and fees. Source: T-Mobile (Sep 10, 2026) and Verizon (Oct 16, 2026) announcements, checked Oct 17, 2026',
             fontsize=11.5, color=INK2)
    fig.subplots_adjust(left=0.15, right=0.975, top=0.84, bottom=0.12)
    save(fig, 'iphone-handoff-cost-by-carrier.webp')


def timeline():
    d = lambda y, m, dd: mdates.date2num(date(y, m, dd))
    # (날짜, 위/아래, 문구 정렬, 문구)
    events = [
        (d(2026, 9, 9), 1, 'center', 'Sep 9\nApple publishes its\niPhone Handoff guide'),
        (d(2026, 9, 10), -1, 'left', 'Sep 10\nT-Mobile: $5/month'),
        (d(2026, 10, 16), 1, 'right', 'Oct 16\nVerizon: $10/month,\n"coming soon"'),
        (d(2026, 10, 23), -1, 'left', 'Oct 23\niPhone Duo\nin stores'),
    ]
    fig, ax = plt.subplots(figsize=(12, 6.75))
    ax.set_facecolor(SURF)
    x0, x1, today = d(2026, 8, 25), d(2026, 12, 10), d(2026, 10, 27)
    ax.plot([x0, today], [0, 0], color=INK2, lw=2, zorder=1)
    # 날짜 미정 구간은 점선으로만 표시 (특정 날짜에 점을 찍지 않음)
    ax.plot([today, x1], [0, 0], color=INK2, lw=2, ls=(0, (2, 3)), zorder=1)
    ax.text((today + x1) / 2, 0.12, 'Not announced yet:\nVerizon start date\nAT&T support', ha='center', va='bottom', fontsize=14, color=INK2)
    for x, side, align, text in events:
        ax.plot([x, x], [0, 0.42 * side], color=GRID, lw=2, zorder=1)
        ax.plot([x], [0], 'o', ms=14, color=ORANGE, mec=SURF, mew=2, zorder=3)
        dx = {'center': 0, 'right': 1, 'left': -1}[align]
        ax.text(x + dx, 0.46 * side, text, ha=align, va='bottom' if side > 0 else 'top', fontsize=14)
    ax.set_xlim(x0, x1)
    ax.set_ylim(-1.15, 1.15)
    ax.set_yticks([])
    ax.xaxis.set_major_locator(mdates.MonthLocator())
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%b\n%Y'))
    for s in ['top', 'right', 'left']:
        ax.spines[s].set_visible(False)
    ax.spines['bottom'].set_color(GRID)
    fig.suptitle('iPhone Handoff in the U.S.: who charges what, and when', x=0.012, ha='left', fontsize=21, fontweight='bold', y=0.965)
    fig.text(0.012, 0.885, 'Dots: dates from Apple, T-Mobile or Verizon · Dashed line: dates not announced as of Oct 17, 2026',
             fontsize=13, color=INK2)
    fig.text(0.012, 0.018, 'Source: Apple Support (Sep 9), T-Mobile Newsroom (Sep 10), Verizon News (Oct 16, 2026; also the Oct 23 store date)',
             fontsize=11.5, color=INK2)
    fig.subplots_adjust(left=0.03, right=0.97, top=0.84, bottom=0.14)
    save(fig, 'iphone-handoff-timeline.webp')


if __name__ == '__main__':
    cost_chart()
    timeline()
