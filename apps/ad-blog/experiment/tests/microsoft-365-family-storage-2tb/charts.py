"""Microsoft 365 Family 저장 공간 2TB 공유 전환: 인원별 총 용량 비교 + 구독 유형별 전환 시점 (1200×675 webp).

날짜·용량 출처는 factcheck.md. 실행: python charts.py <출력 폴더>
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
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 15, 'text.color': INK, 'xtick.color': INK2, 'ytick.color': INK2})


def save(fig, name):
    b = io.BytesIO()
    fig.savefig(b, format='png', dpi=100, facecolor=SURF)
    path = f'{OUT}/{name}'
    Image.open(b).convert('RGB').save(path, 'WEBP', quality=90)
    print(path, Image.open(path).size)


def storage_by_family_size():
    people = list(range(1, 7))
    before = [n * 1 for n in people]  # 1 TB per person
    after = [2 for _ in people]  # 2 TB shared pool
    fig, ax = plt.subplots(figsize=(12, 6.75))
    ax.set_facecolor(SURF)
    w = 0.38
    ax.bar([p - w / 2 - 0.01 for p in people], before, w, color=BLUE, label='Before: 1 TB per person')
    ax.bar([p + w / 2 + 0.01 for p in people], after, w, color=ORANGE, label='After: 2 TB shared')
    for p, b, a in zip(people, before, after):
        diff = a - b
        txt = f'+{diff} TB' if diff > 0 else ('same total' if diff == 0 else f'{diff} TB')
        ax.text(p, max(a, b) + 0.18, txt, ha='center', va='bottom', fontsize=15,
                fontweight='bold', color=ORANGE if diff < 0 else INK)
        ax.text(p + w / 2 + 0.01, a / 2, ('1 TB\neach*' if p == 2 else f'{round(2000 / p)} GB\neach*') if p > 1 else '2 TB', ha='center', va='center',
                fontsize=11.5, color='white', fontweight='bold')
    ax.set_xticks(people)
    ax.set_xticklabels([f'{p} {"person" if p == 1 else "people"}' for p in people], color=INK, fontsize=14)
    ax.set_ylim(0, 7.1)
    ax.set_yticks(range(0, 7))
    ax.set_yticklabels([f'{t} TB' for t in range(0, 7)])
    ax.yaxis.grid(True, color=GRID)
    ax.set_axisbelow(True)
    for s in ['top', 'right', 'left']:
        ax.spines[s].set_visible(False)
    ax.spines['bottom'].set_color(GRID)
    ax.tick_params(axis='y', length=0)
    ax.legend(loc='upper left', frameon=False, fontsize=14, bbox_to_anchor=(0, 1.0))
    fig.suptitle('Microsoft 365 Family: total OneDrive storage by household size',
                 x=0.012, ha='left', fontsize=21, fontweight='bold', y=0.965)
    fig.text(0.012, 0.885, 'Everyone who uses OneDrive on the plan counts. Same comparison applies to Microsoft 365 Premium.',
             fontsize=13, color=INK2)
    fig.text(0.012, 0.045, '*If the 2 TB pool is split evenly (1 TB = 1,000 GB).', fontsize=11, color=INK2)
    fig.text(0.012, 0.015, 'Source: Microsoft Support, "Microsoft storage quotas" and "Changes to Microsoft 365 storage," checked Oct 18, 2026',
             fontsize=11, color=INK2)
    fig.subplots_adjust(left=0.07, right=0.98, top=0.84, bottom=0.14)
    save(fig, 'family-storage-by-household-size.webp')


def switch_dates():
    d = lambda y, m, dd: mdates.date2num(date(y, m, dd))
    x0, x1 = d(2026, 9, 1), d(2028, 9, 1)
    # (라벨, 전환일, 확정 날짜인지 예시인지)
    rows = [
        ('New or repurchased plan', d(2026, 10, 8), 'Oct 8, 2026'),
        ('Upgrade to Premium now', d(2026, 10, 18), 'At upgrade'),
        ('Monthly plan', d(2027, 5, 2), 'First renewal from May 2'),
        ('Yearly plan, renews May 2', d(2027, 5, 2), 'May 2, 2027'),
        ('Yearly plan, renews Jan 15', d(2028, 1, 15), 'Jan 15, 2028'),
        ('Yearly plan, renews May 1', d(2028, 5, 1), 'May 1, 2028'),
    ]
    fig, ax = plt.subplots(figsize=(12, 6.75))
    ax.set_facecolor(SURF)
    n = len(rows)
    for i, (label, sw, txt) in enumerate(rows):
        y = n - 1 - i
        if sw > x0:
            ax.barh(y, sw - x0, left=x0, height=0.56, color=BLUE)
        ax.barh(y, x1 - sw, left=sw, height=0.56, color=ORANGE)
        ax.text(sw + 8, y, txt, va='center', ha='left', fontsize=13, color='white', fontweight='bold')
    ax.axvline(d(2027, 5, 2), color=INK, lw=1.5, ls=(0, (4, 3)))
    ax.text(d(2027, 5, 2) + 8, n - 0.35, 'May 2, 2027', ha='left', va='bottom', fontsize=12.5, color=INK)
    ax.set_yticks(range(n))
    ax.set_yticklabels([r[0] for r in rows][::-1], color=INK, fontsize=13.5)
    ax.set_xlim(x0, x1)
    ax.set_ylim(-0.6, n + 0.1)
    ax.xaxis.set_major_locator(mdates.MonthLocator(bymonth=[1, 5, 9]))
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%b\n%Y'))
    for s in ['top', 'right', 'left']:
        ax.spines[s].set_visible(False)
    ax.spines['bottom'].set_color(GRID)
    ax.tick_params(axis='y', length=0)
    fig.suptitle('When your Microsoft 365 plan switches to 2 TB shared',
                 x=0.012, ha='left', fontsize=21, fontweight='bold', y=0.965)
    fig.text(0.012, 0.895, 'Blue: 1 TB per person  ·  Orange: 2 TB shared. Existing plans switch at the first renewal on or after May 2, 2027.',
             fontsize=13, color=INK2)
    fig.text(0.012, 0.018, 'Renewal dates in the last three rows are examples. Source: Microsoft Support, "Changes to Microsoft 365 storage," checked Oct 18, 2026',
             fontsize=11, color=INK2)
    fig.subplots_adjust(left=0.25, right=0.955, top=0.83, bottom=0.13)
    save(fig, 'storage-switch-dates.webp')


if __name__ == '__main__':
    storage_by_family_size()
    switch_dates()
