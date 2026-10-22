"""Office 2021 지원 종료: 버전별 지원 기간 타임라인 + 지금부터 2029-10까지 3년 비용 비교 (1200×675 webp).

날짜·가격 출처는 factcheck.md (Microsoft Learn Lifecycle, Microsoft 365 요금 비교 페이지, 2026-10-20 확인).
실행: python3 -I charts.py <출력 폴더>
"""
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.dates as mdates  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'
TODAY = date(2026, 10, 20)

# 버전, 출시일, 지원 종료일 (Microsoft Learn Lifecycle)
VERSIONS = [
    ('Office 2019', date(2018, 9, 24), date(2025, 10, 14)),
    ('Office 2021', date(2021, 10, 5), date(2026, 10, 13)),
    ('Office 2024', date(2024, 10, 1), date(2029, 10, 9)),
]


def support_timeline():
    n = mdates.date2num
    fig, ax = cs.figure()
    fig.subplots_adjust(left=0.16, right=0.97, top=0.8, bottom=0.2)
    ax.set_xlim(n(date(2018, 6, 1)), n(date(2032, 6, 1)))
    ax.set_ylim(-0.6, 2.8)
    for i, (name, start, end) in enumerate(VERSIONS):
        y = len(VERSIONS) - 1 - i
        ended = end < TODAY
        color = cs.MUTED if ended else cs.ACCENT
        cs.rounded_barh(ax, y, n(start), n(end) - n(start), 0.46, color)
        label = f'Ended {end:%b} {end.day}, {end.year}' if ended else f'Until {end:%b} {end.day}, {end.year}'
        if ended:  # 종료 라벨은 막대 안쪽 오른쪽 (오늘 점선과 겹치지 않게)
            ax.text(n(end) - 60, y, label, va='center', ha='right', fontsize=14, fontweight='semibold',
                    color=cs.BACKGROUND, zorder=5)
        else:
            ax.text(n(end) + 70, y, label, va='center', fontsize=14, fontweight='semibold')
    ax.axvline(n(TODAY), color=cs.FOREGROUND, lw=1.4, ls='--', zorder=4)
    ax.text(n(TODAY) - 40, 2.55, f'Today ({TODAY:%b} {TODAY.day}, {TODAY.year})', fontsize=12.5, ha='right')
    ax.set_yticks(range(len(VERSIONS)))
    ax.set_yticklabels([v[0] for v in reversed(VERSIONS)], fontsize=16, fontweight='semibold')
    ax.xaxis.set_major_locator(mdates.YearLocator(2))
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y'))
    cs.header(fig, 'One-time-purchase Office: security updates by version',
              'Office 2021 got its last update on Oct 13, 2026. There is no paid extension.')
    cs.footer(fig, 'Office 2016 also ended Oct 14, 2025. Bars run from release to the end of support.',
              'Source: Microsoft Learn Lifecycle (Office 2021, Office 2024, end of support 2025), checked Oct 20, 2026')
    cs.save(fig, f'{OUT}/office-version-support-timeline.webp')


def three_year_cost():
    # 2026-10 ~ 2029-10 (Office 2024 지원 종료까지 약 3년)
    rows = [
        ('Microsoft 365 for the web', 0, 'Free (Word, Excel, PowerPoint in a browser)', False),
        ('Office Home 2024, 1 PC', 179.99, '$179.99 once (no Outlook)', True),
        ('Microsoft 365 Personal', 3 * 99.99, '$299.97 ($99.99 a year x 3)', False),
        ('Microsoft 365 Family', 3 * 129.99, '$389.97 ($129.99 a year x 3, up to 6 people)', False),
        ('Office Home 2024, 3 PCs', 3 * 179.99, '$539.97 (3 licenses)', False),
    ]
    fig, ax = cs.figure()
    fig.subplots_adjust(left=0.25, right=0.97, top=0.8, bottom=0.2)
    ax.set_xlim(0, 1000)
    ax.set_ylim(-0.6, len(rows) - 0.4)
    ys = list(range(len(rows)))[::-1]
    for y, (name, cost, label, hi) in zip(ys, rows):
        cs.rounded_barh(ax, y, 0, cost, 0.5, cs.ACCENT if hi else cs.MUTED)
        ax.text(cost + 12, y, label.replace('$', r'\$'), va='center', fontsize=13.5, fontweight='semibold')
    ax.set_yticks(ys)
    ax.set_yticklabels([r[0] for r in rows], fontsize=14.5, fontweight='semibold')
    ax.set_xticks(range(0, 601, 100))
    ax.set_xticklabels([f'${t}' for t in range(0, 601, 100)])
    cs.header(fig, 'What it costs to replace Office 2021 through October 2029',
              'Three years, the remaining support life of Office 2024. U.S. list prices as of Oct 20, 2026.')
    cs.footer(fig, 'Subscriptions assume today\'s prices stay the same. Microsoft 365 plans include Outlook and get new versions.',
              'Source: Microsoft 365 plan comparison page (microsoft.com), checked Oct 20, 2026')
    cs.save(fig, f'{OUT}/office-2021-replacement-cost.webp')


support_timeline()
three_year_cost()
