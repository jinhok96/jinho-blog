"""Windows 11 24H2 Home·Pro 업데이트 종료: 버전별 지원 기간 타임라인 + 버전별 남은 업데이트 개월 수 (1200×675 webp).

날짜 출처는 factcheck.md (Microsoft Learn "Windows 11 release information", 2026-10-19 확인).
실행: python charts.py <출력 폴더>
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
TODAY = date(2026, 10, 19)

# 버전, 배포일, Home·Pro 종료일, Enterprise·Education 종료일
VERSIONS = [
    ('24H2', date(2024, 10, 1), date(2026, 10, 13), date(2027, 10, 12)),
    ('25H2', date(2025, 9, 30), date(2027, 10, 12), date(2028, 10, 10)),
    ('26H2', date(2026, 9, 29), date(2028, 10, 10), date(2029, 10, 9)),
]


def save(fig, name):
    b = io.BytesIO()
    fig.savefig(b, format='png', dpi=100, facecolor=SURF)
    path = f'{OUT}/{name}'
    Image.open(b).convert('RGB').save(path, 'WEBP', quality=90)
    print(path, Image.open(path).size)


def support_timeline():
    n = mdates.date2num
    fig, ax = plt.subplots(figsize=(12, 6.75))
    ax.set_facecolor(SURF)
    for i, (ver, start, home_end, _) in enumerate(VERSIONS):
        y = len(VERSIONS) - 1 - i
        ended = home_end < TODAY
        color = ORANGE if ended else BLUE
        ax.barh(y, n(home_end) - n(start), left=n(start), height=0.5, color=color)
        label = f'Ended {home_end:%b} {home_end.day}, {home_end.year}' if ended else f'Until {home_end:%b} {home_end.day}, {home_end.year}'
        ax.text(n(home_end) + 12, y, label, va='center', fontsize=15, fontweight='bold', color=color)
    ax.axvline(n(TODAY), color=INK, lw=1.6, ls='--')
    ax.text(n(TODAY) + 8, 2.62, f'Today ({TODAY:%b} {TODAY.day})', fontsize=13, color=INK)
    ax.set_yticks(range(len(VERSIONS)))
    ax.set_yticklabels([f'Version {v[0]}' for v in reversed(VERSIONS)], color=INK, fontsize=16, fontweight='bold')
    ax.set_xlim(n(date(2024, 7, 1)), n(date(2030, 3, 1)))
    ax.set_ylim(-0.6, 2.9)
    ax.xaxis.set_major_locator(mdates.YearLocator())
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y'))
    ax.xaxis.grid(True, color=GRID)
    ax.set_axisbelow(True)
    for s in ['top', 'right', 'left']:
        ax.spines[s].set_visible(False)
    ax.spines['bottom'].set_color(GRID)
    ax.tick_params(axis='y', length=0)
    fig.suptitle('Windows 11 Home and Pro: security updates by version',
                 x=0.012, ha='left', fontsize=22, fontweight='bold', y=0.965)
    fig.text(0.012, 0.885, 'Each bar runs from release to the last monthly update. Version 24H2 got its last one on Oct 13, 2026.',
             fontsize=13, color=INK2)
    fig.text(0.012, 0.045, 'Enterprise and Education editions get 12 more months (24H2: until Oct 12, 2027).', fontsize=11.5, color=INK2)
    fig.text(0.012, 0.015, 'Source: Microsoft Learn, "Windows 11 release information," checked Oct 19, 2026',
             fontsize=11.5, color=INK2)
    fig.subplots_adjust(left=0.15, right=0.98, top=0.84, bottom=0.14)
    save(fig, 'windows-11-version-support-timeline.webp')


def months_left():
    rows = [
        ('Stay on 24H2', date(2026, 10, 13)),
        ('Update to 25H2', date(2027, 10, 12)),
        ('Update to 26H2', date(2028, 10, 10)),
    ]
    months = [max(0, (end - TODAY).days / 30.44) for _, end in rows]
    fig, ax = plt.subplots(figsize=(12, 6.75))
    ax.set_facecolor(SURF)
    ys = list(range(len(rows)))[::-1]
    for y, (label, end), m in zip(ys, rows, months):
        color = ORANGE if m == 0 else BLUE
        ax.barh(y, m, height=0.52, color=color)
        txt = 'No more updates (next missed: Nov 10, 2026)' if m == 0 else f'About {round(m)} months (until {end:%b} {end.day}, {end.year})'
        ax.text(m + 0.4, y, txt, va='center', fontsize=15, fontweight='bold', color=color)
    ax.set_yticks(ys)
    ax.set_yticklabels([r[0] for r in rows], color=INK, fontsize=16, fontweight='bold')
    ax.set_xlim(0, 46)
    ax.set_xticks(range(0, 37, 6))
    ax.set_xticklabels([f'{t} mo' for t in range(0, 37, 6)])
    ax.xaxis.grid(True, color=GRID)
    ax.set_axisbelow(True)
    for s in ['top', 'right', 'left']:
        ax.spines[s].set_visible(False)
    ax.spines['bottom'].set_color(GRID)
    ax.tick_params(axis='y', length=0)
    fig.suptitle('Security updates left for a Windows 11 Home or Pro PC on 24H2',
                 x=0.012, ha='left', fontsize=21, fontweight='bold', y=0.965)
    fig.text(0.012, 0.885, f'Counted from {TODAY:%B} {TODAY.day}, {TODAY.year}. The 26H2 update is free and needs one restart.',
             fontsize=13, color=INK2)
    fig.text(0.012, 0.015, 'Source: Microsoft Learn, "Windows 11 release information"; Microsoft Support KB5121794. Checked Oct 19, 2026',
             fontsize=11.5, color=INK2)
    fig.subplots_adjust(left=0.19, right=0.98, top=0.84, bottom=0.1)
    save(fig, 'security-updates-left-by-version.webp')


support_timeline()
months_left()
