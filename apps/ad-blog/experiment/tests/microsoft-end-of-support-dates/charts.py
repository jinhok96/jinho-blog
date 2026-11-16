"""Microsoft 지원 종료 허브 그래픽 3장 (1200×675 webp, 디자인 시스템 라이트 모드 토큰).

1. microsoft-support-end-dates-timeline.webp — 가정용 Windows·Office 판별 지원 종료일 (2026-11-16 기준 끝남/남음)
2. november-2026-security-update-check.webp — 2026-11-10 보안 업데이트에 판별로 실렸는지 (KB·Office 보안 릴리스 노트)
3. what-to-do-by-version.webp — 지금 쓰는 판별로 할 일

날짜·사실 출처는 factcheck.md (모두 2026-11-16 Chromium으로 연 Microsoft 문서, source-*.txt).
실행: python3 -I charts.py <출력 폴더>
"""
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.dates as mdates  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'
CHECKED = date(2026, 11, 16)

# (이름, 종료일) — 위에서부터 끝나는 순서
PRODUCTS = [
    ('Windows 10 without ESU', date(2025, 10, 14)),
    ('Office 2016 and Office 2019', date(2025, 10, 14)),
    ('Windows 11 Home/Pro 24H2', date(2026, 10, 13)),
    ('Office 2021', date(2026, 10, 13)),
    ('Windows 10 with ESU', date(2027, 10, 12)),
    ('Windows 11 Home/Pro 25H2', date(2027, 10, 12)),
    ('Windows 11 26H1 (new PCs only)', date(2028, 3, 14)),
    ('Windows 11 Home/Pro 26H2', date(2028, 10, 10)),
    ('Microsoft 365 apps on Windows 10', date(2028, 10, 10)),
    ('Office 2024', date(2029, 10, 9)),
]


def months_between(a: date, b: date) -> int:
    m = (b.year - a.year) * 12 + (b.month - a.month)
    if b.day < a.day:
        m -= 1
    return m


def months_rounded(a: date, b: date) -> int:
    return round((b - a).days / 30.44)


def fmt(d: date) -> str:
    return f'{d:%b} {d.day}, {d.year}'


def timeline():
    n = mdates.date2num
    fig, ax = cs.figure()
    fig.subplots_adjust(left=0.29, right=0.97, top=0.8, bottom=0.17)
    rows = len(PRODUCTS)
    ax.set_xlim(n(date(2025, 4, 1)), n(date(2032, 5, 1)))
    ax.set_ylim(-0.7, rows - 0.3)
    today = n(CHECKED)
    for i, (name, end) in enumerate(PRODUCTS):
        y = rows - 1 - i
        ended = end < CHECKED
        color = cs.MUTED if ended else cs.ACCENT
        if not ended:
            cs.rounded_barh(ax, y, today, n(end) - today, 0.42, cs.ACCENT)
            label = f'{fmt(end)} · about {months_rounded(CHECKED, end)} months left'
            ax.text(n(end) + 25, y, label, va='center', fontsize=12, fontweight='semibold', color=cs.FOREGROUND)
        else:
            ax.plot([n(end)], [y], 'o', ms=11, color=cs.MUTED, zorder=4)
            ax.text(n(end) + 55, y, f'Ended {fmt(end)}', va='center', fontsize=12, color=cs.MUTED, zorder=5,
                    bbox=dict(facecolor=cs.BACKGROUND, edgecolor='none', pad=1.5))
    ax.axvline(today, color=cs.FOREGROUND, lw=1.4, ls='--', zorder=2)
    ax.text(today, rows - 0.25, f'Checked {fmt(CHECKED)}', fontsize=11.5, ha='center', va='bottom', color=cs.FOREGROUND)
    ax.set_yticks(range(rows))
    ax.set_yticklabels([p[0] for p in reversed(PRODUCTS)], fontsize=13, fontweight='semibold')
    ax.xaxis.set_major_locator(mdates.YearLocator())
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y'))
    cs.header(fig, 'When Microsoft stops fixing Windows and Office at home',
              'End of security updates by version. Gray = already ended, blue = time left from November 16, 2026')
    cs.footer(fig, 'Sources: Microsoft Lifecycle product pages, Windows 11 release information (26H2 Home/Pro), consumer ESU page,',
              '"Windows 10 end of support and Microsoft 365 Apps" (Microsoft Learn), all checked November 16, 2026')
    cs.save(fig, f'{OUT}/microsoft-support-end-dates-timeline.webp')


def rounded_box(fig, x, y, w, h, color, radius=0.012):
    fig.add_artist(FancyBboxPatch((x, y), w, h, boxstyle=f'round,pad=0,rounding_size={radius}',
                                  transform=fig.transFigure, facecolor=color, edgecolor='none'))


def update_check():
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Who got the November 10, 2026 security update?',
              "Versions listed in Microsoft's November 2026 update notes for home PCs")
    rows = [
        ('Windows 11 Home/Pro 26H2', True, 'Listed in KB5132061 (build 26300.9974)'),
        ('Windows 11 Home/Pro 25H2', True, 'Listed in KB5132061 (build 26200.9974)'),
        ('Windows 11 Home/Pro 24H2', False, 'Not listed: KB5132061 names only Enterprise and Education 24H2'),
        ('Windows 10 22H2 with ESU', True, 'KB5131096 (build 19045.7846), plus a Nov 13 non-security fix'),
        ('Office 2024', True, 'Version 2610 (Build 20527.20196)'),
        ('Office 2021 (retail)', True, 'Listed with the same build, even though support ended Oct 13'),
        ('Office 2019 and 2016 (retail)', False, 'Not listed; only Office 2019 Volume Licensed appears'),
    ]
    top, row_h, left, width = 0.775, 0.087, 0.03, 0.94
    # 머리줄
    fig.text(left + 0.012, top + 0.012, 'Version', fontsize=12, color=cs.MUTED, fontweight='semibold')
    fig.text(0.355, top + 0.012, 'Got it?', fontsize=12, color=cs.MUTED, fontweight='semibold')
    fig.text(0.47, top + 0.012, 'Where Microsoft lists it', fontsize=12, color=cs.MUTED, fontweight='semibold')
    fig.add_artist(plt.Line2D([left, left + width], [top, top], color=cs.BORDER, lw=1))
    for i, (name, got, note) in enumerate(rows):
        y = top - (i + 1) * row_h
        if i % 2 == 0:
            rounded_box(fig, left, y + 0.006, width, row_h - 0.012, cs.SURFACE)
        cy = y + row_h / 2
        fig.text(left + 0.012, cy, name, fontsize=14, fontweight='semibold', va='center')
        color = cs.ACCENT if got else cs.MUTED
        fig.add_artist(plt.Circle((0.362, cy), 0.008, transform=fig.transFigure, color=color))
        fig.text(0.378, cy, 'Yes' if got else 'No', fontsize=14, fontweight='bold', va='center', color=color)
        fig.text(0.47, cy, note, fontsize=12.5, va='center', color=cs.FOREGROUND)
    cs.footer(fig, 'Sources: KB5132061 and KB5131096 "Applies To" (Microsoft Support), Microsoft 365 Apps security updates release notes',
              '(Microsoft Learn), Windows 10 release information, all checked November 16, 2026')
    cs.save(fig, f'{OUT}/november-2026-security-update-check.webp')


def what_to_do():
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'What to do with the version you have', 'One line per version, based on Microsoft support dates checked November 16, 2026')
    rows = [
        ('Windows 11 24H2 (Home or Pro)', 'Install the free 26H2 update from Windows Update: fixes until Oct 10, 2028'),
        ('Windows 11 25H2', 'Nothing urgent: fixes until Oct 12, 2027, and 26H2 adds a year'),
        ('Windows 10', 'Enroll in ESU (free with settings sync, 1,000 Rewards points or $30) until Oct 12, 2027'),
        ('Office 2016, 2019 or 2021', 'Move to Office 2024 (fixes until Oct 9, 2029), Microsoft 365 or free Office on the web'),
        ('Microsoft 365 on Windows 10', 'Keeps getting security fixes until Oct 10, 2028, but no new features after Version 2608'),
        ('Publisher', 'Save each file as a PDF; open the PDF in Word if you still need to edit it'),
    ]
    top, row_h, left, width = 0.79, 0.105, 0.03, 0.94
    col = 0.285
    for i, (who, todo) in enumerate(rows):
        y = top - (i + 1) * row_h
        rounded_box(fig, left, y + 0.008, col, row_h - 0.016, cs.SURFACE)
        rounded_box(fig, left + col + 0.01, y + 0.008, width - col - 0.01, row_h - 0.016, cs.SURFACE)
        cy = y + row_h / 2
        fig.text(left + 0.015, cy, who, fontsize=13.5, fontweight='bold', va='center')
        fig.text(left + col + 0.025, cy, todo, fontsize=12.5, va='center', color=cs.FOREGROUND)
    cs.footer(fig, 'Sources: Microsoft Lifecycle, consumer ESU page, Windows 11 release information, "Windows 10 end of support and Microsoft 365',
              'Apps", "Microsoft Publisher will no longer be supported after October 2026" (Microsoft Support), checked November 16, 2026')
    cs.save(fig, f'{OUT}/what-to-do-by-version.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    timeline()
    update_check()
    what_to_do()
