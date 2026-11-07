"""Arc 종료 칼럼 그래픽: arc.net 일정 화면 캡처 + 공식 일정 타임라인 + 데이터 종류별 행방 표 + Dia 요금제·기본값 (1200×675 webp).

내용 출처는 factcheck.md. 캡처 원본 `arc-net-timeline.png`는 shot.cjs로 찍은 arc.net 첫 화면 Timeline 구역
(1280px 폭, 2배율, 2026-10-25).
실행: python3 -I charts.py <출력 폴더>
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch, Rectangle  # noqa: E402
from PIL import Image  # noqa: E402

HERE = Path(__file__).resolve().parent
OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'


def box(ax, x, y, w, h, fill, edge=None, lw=0):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0,rounding_size=0.012',
                                facecolor=fill, edgecolor=edge or fill, lw=lw, zorder=1))


def canvas(title, subtitle):
    fig = plt.figure(figsize=cs.FIGSIZE)
    ax = fig.add_axes([0.03, 0.12, 0.94, 0.71])
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    cs.header(fig, title, subtitle)
    return fig, ax


def farewell_screenshot():
    """arc.net 일정 캡처의 오른쪽 일정 열만 잘라 왼쪽에 두고, 12월 22일 항목을 accent 상자로 표시. 오른쪽에 첫 화면에 없는 날짜"""
    img = Image.open(HERE / 'arc-net-timeline.png').convert('RGB')
    img = img.crop((960, 40, 1960, 1230))  # 왼쪽 빈 공간과 'Timeline' 제목 제외
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Arc\'s own timeline ends on December 22',
              'The "A farewell to Arc" page at arc.net, as shown on October 25, 2026.')
    h_px = 480
    w_px = h_px * img.width / img.height
    ax = fig.add_axes([36 / 1200, 0.115, w_px / 1200, h_px / 675])
    ax.imshow(img)
    ax.axis('off')
    # 12월 22일 항목: 자른 뒤 기준 약 y 820~1170
    ax.add_patch(Rectangle((14, 818), 980, 362, fill=False, edgecolor=cs.ACCENT, lw=3, zorder=3))
    side = fig.add_axes([0.55, 0.12, 0.42, 0.71])
    side.set_xlim(0, 1)
    side.set_ylim(0, 1)
    side.axis('off')
    box(side, 0.0, -0.02, 1.0, 0.99, cs.SURFACE)
    side.text(0.06, 0.88, 'Only in Arc\'s Help Center', fontsize=15, fontweight='bold', color=cs.ACCENT, zorder=2)
    notes = [
        ('November 23', 'Arc for Mac and Windows starts\nshowing sunset reminders'),
        ('December 15', 'Last day to request a copy of your\nArc account data or ask Arc to delete it'),
        ('After December 22', 'You can\'t open Arc to reach the\nSpaces, tabs and passwords saved\non your own computer'),
    ]
    y = 0.74
    for d, t in notes:
        side.text(0.06, y, d, fontsize=14, fontweight='bold', va='top', zorder=2)
        side.text(0.06, y - 0.07, t, fontsize=12.5, va='top', linespacing=1.45, zorder=2)
        y -= 0.225
    cs.footer(fig, 'Sources: arc.net (captured in Chromium on October 25, 2026; box added by ToolProof) and Arc Help Center,',
              '"Arc Sunset: Key Dates and What to Expect" (updated October 22, 2026).')
    cs.save(fig, f'{OUT}/arc-farewell-page-timeline.webp')


EVENTS = [
    ('Oct 22', 'Sunset announced.\nNo new Arc accounts'),
    ('Nov 23', 'Arc Search AI off,\nno sign-in or sync.\nDesktop reminders'),
    ('Dec 15', 'Last day to request\nor delete your\naccount data'),
    ('Dec 22', 'Arc for Mac and\nWindows stops.\nAccounts deactivated'),
    ('By Jan 21', 'Account data deleted\n(within 30 days of\ndeactivation)'),
]


def timeline():
    fig, ax = canvas('Five dates for Arc users', 'All dates 2026 except the last. The import into Dia only works while Arc still opens, so before December 22.')
    y = 0.56
    ax.plot([0.03, 0.97], [y, y], color=cs.BORDER, lw=3, zorder=1)
    n = len(EVENTS)
    for i, (d, t) in enumerate(EVENTS):
        x = 0.1 + i * (0.8 / (n - 1))
        cur = d == 'Dec 22'
        ax.scatter([x], [y], s=280, color=cs.ACCENT if cur else cs.MUTED, zorder=3)
        ax.text(x, y + 0.14, d, ha='center', va='center', fontsize=16, fontweight='bold',
                color=cs.ACCENT if cur else cs.FOREGROUND)
        ax.text(x, y - 0.21, t, ha='center', va='center', fontsize=12.5, linespacing=1.45)
    cs.footer(fig, 'Sources: arc.net and Arc Help Center ("Arc Sunset: Key Dates and What to Expect," "Delete My Arc Account"), checked October 25, 2026.',
              'January 21, 2027 is 30 days after December 22, our calculation from Arc\'s "within 30 days."')
    cs.save(fig, f'{OUT}/arc-sunset-dates.webp')


# (데이터, Dia 가져오기, Arc 내보내기 파일, 강조)
ROWS = [
    ('Spaces, Favorites, pinned tabs, folders', 'Yes (Spaces become Profiles)', 'Yes, as links', True),
    ('Bookmarks and history', 'Yes', 'Not listed', False),
    ('Saved passwords and cookies', 'Yes (you stay signed in)', 'Not listed', True),
    ('Extensions', 'Yes (you choose which)', 'Not listed', False),
    ('Easels', 'No', 'No (save each as a PNG)', False),
    ('Boosts', 'No', 'No', False),
    ('Payment methods and autofill', 'No (Dia imports these from no browser)', 'No', False),
]


def data_table():
    fig, ax = canvas('Where your Arc data can go before December 22',
                     'Dia\'s import is the only route Arc documents for passwords, history and logins. The export file holds only links.')
    cols = [(0.015, 'Your Arc data'), (0.39, 'Import into Dia'), (0.72, 'Arc Data Export.md')]
    for x, c in cols:
        ax.text(x, 0.965, c, fontsize=13, color=cs.MUTED, va='center', fontweight='semibold')
    rh = 0.128
    for i, (data, dia, exp, hi) in enumerate(ROWS):
        y = 0.865 - i * rh
        if hi:
            box(ax, 0.0, y - rh / 2 + 0.01, 1.0, rh - 0.02, cs.SURFACE)
        ax.text(0.015, y, data, fontsize=13.5, fontweight='bold', va='center', zorder=2)
        dia_yes = dia.startswith('Yes')
        ax.text(0.39, y, dia, fontsize=13, va='center', zorder=2,
                color=cs.ACCENT if dia_yes else cs.MUTED, fontweight='semibold' if dia_yes else 'normal')
        exp_yes = exp.startswith('Yes')
        ax.text(0.72, y, exp, fontsize=13, va='center', zorder=2,
                color=cs.FOREGROUND if exp_yes else cs.MUTED, fontweight='semibold' if exp_yes else 'normal')
        if i < len(ROWS) - 1 and not hi and not ROWS[i + 1][3]:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1)
    cs.footer(fig, 'Sources: Arc Help Center, "Move from Arc to Dia" and "How Do I Export My Data from Arc?" (updated October 22, 2026).',
              'After December 22 Arc won\'t open, so neither route works. We couldn\'t run Arc or Dia: both are Mac and Windows only.')
    cs.save(fig, f'{OUT}/arc-data-where-it-goes.webp')


PLANS = [
    ('Better Browser', 'Free', 'Profiles, tab groups, Split View,\nad and tracker blocker, sync.\n"No AI features"', False),
    ('Better Answers', '\\$10 or \\$20\na month', 'Ask Dia on any page, chat with\ncontext from your tools. Plan card\nsays \\$10, the FAQ says \\$20', True),
    ('Better Days', '\\$100\na month', '6x the usage of Better Answers,\nMorning Brief, reports and decks.\nEvery new user\'s 14-day trial', False),
]


def dia_plans():
    fig, ax = canvas('Dia is free, but its trial starts on the \\$100 plan',
                     'When the 14-day trial ends, AI features pause unless you pay. Dia\'s plans page lists two prices for the middle plan.')
    w = 0.315
    for i, (name, price, desc, hi) in enumerate(PLANS):
        x = i * (w + 0.0275)
        box(ax, x, 0.30, w, 0.66, cs.SURFACE, edge=cs.ACCENT if hi else cs.BORDER, lw=2 if hi else 1)
        ax.text(x + 0.03, 0.885, name, fontsize=15, fontweight='bold', zorder=2)
        ax.text(x + 0.03, 0.77, price, fontsize=19, fontweight='bold', va='top', linespacing=1.2, zorder=2,
                color=cs.ACCENT if hi else cs.FOREGROUND)
        ax.text(x + 0.03, 0.56, desc, fontsize=12, va='top', linespacing=1.5, zorder=2)
    ax.text(0.0, 0.2, 'On by default in Dia', fontsize=13, color=cs.MUTED, fontweight='semibold', va='center')
    ax.text(0.0, 0.1, 'Settings > Privacy > Share content data to help improve Dia', fontsize=14, fontweight='bold',
            va='center', color=cs.ACCENT)
    ax.text(0.0, 0.025, 'Content data is not tied to your account and is kept for 30 days, according to Dia. Memory can also be turned off in Settings.',
            fontsize=12, va='center')
    cs.footer(fig, 'Sources: diabrowser.com/plans and diabrowser.com/security, opened October 25, 2026. Paid plans apply to new Mac users;',
              'Dia\'s page says Windows "stays as it is for now." Prices as of October 25, 2026.')
    cs.save(fig, f'{OUT}/dia-plans-and-defaults.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    farewell_screenshot()
    timeline()
    data_table()
    dia_plans()
