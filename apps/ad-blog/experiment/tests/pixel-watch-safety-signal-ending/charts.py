"""Pixel Watch Safety Signal 종료: 연결 상황별 안전 기능 표 + 일정 타임라인 (1200×675 webp).

내용과 날짜 출처는 factcheck.md. 실행: python charts.py <출력 폴더>
"""
import io
import sys
from datetime import date

import matplotlib
matplotlib.use('Agg')
import matplotlib.dates as mdates
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
from PIL import Image

OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'
SURF, INK, INK2, GRID, BLUE, ORANGE = '#fcfcfb', '#0b0b0b', '#52514e', '#e4e3df', '#2a78d6', '#c2560f'
BLUE_BG, ORANGE_BG, GREY_BG = '#dbe8f8', '#f6e1d2', '#efeeea'
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 15, 'text.color': INK, 'xtick.color': INK2, 'ytick.color': INK})


def save(fig, name):
    b = io.BytesIO()
    fig.savefig(b, format='png', dpi=100, facecolor=SURF)
    path = f'{OUT}/{name}'
    Image.open(b).convert('RGB').save(path, 'WEBP', quality=90)
    print(path, Image.open(path).size)


def matrix():
    # (상황, 12월 12일까지, 이후, 이후 칸 색)
    rows = [
        ('Phone nearby\n(Bluetooth)', 'Works', 'Works', 'ok'),
        ('Watch has its own\ncarrier line', 'Works', 'Works', 'ok'),
        ('Watch on Wi-Fi,\nphone left behind', 'Works', 'Works, per Google*', 'warn'),
        ('No phone, no Wi-Fi,\nno carrier line', 'Works through\nSafety Signal', 'No connection for\nSOS or Fall Detection', 'lost'),
    ]
    fig = plt.figure(figsize=(12, 6.75))
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 6.75)
    ax.axis('off')
    fig.patch.set_facecolor(SURF)
    ax.text(0.3, 6.25, 'Pixel Watch 2 and 3 LTE: when safety features can reach help',
            fontsize=21, fontweight='bold', va='center')
    ax.text(0.3, 5.78, 'Emergency SOS, Fall Detection, Safety Check and Emergency Sharing, by how the watch is connected',
            fontsize=13, color=INK2, va='center')
    col_x = [0.3, 4.15, 8.05]
    col_w = [3.7, 3.75, 3.65]
    head_y = 5.2
    for x, w, t in zip(col_x[1:], col_w[1:], ['Until Dec 12, 2026', 'After Dec 12, 2026']):
        ax.text(x + w / 2, head_y, t, ha='center', va='center', fontsize=16, fontweight='bold')
    ax.text(col_x[0], head_y, 'Watch is away from your phone and...', va='center', fontsize=13.5, color=INK2)
    row_h, gap = 0.9, 0.12
    y = head_y - 0.42
    styles = {'ok': (BLUE_BG, INK), 'warn': (BLUE_BG, INK), 'lost': (ORANGE_BG, ORANGE)}
    for label, before, after, kind in rows:
        y -= row_h
        ax.text(col_x[0], y + row_h / 2, label, va='center', fontsize=15)
        for x, w, txt, (bg, fg) in [
            (col_x[1], col_w[1], before, (BLUE_BG, INK)),
            (col_x[2], col_w[2], after, styles[kind]),
        ]:
            ax.add_patch(FancyBboxPatch((x + 0.05, y + 0.04), w - 0.1, row_h - 0.08,
                                        boxstyle='round,pad=0,rounding_size=0.08', fc=bg, ec='none'))
            ax.text(x + w / 2, y + row_h / 2, txt, ha='center', va='center', fontsize=14.5,
                    color=fg, fontweight='bold' if kind == 'lost' and txt == after else 'normal')
        y -= gap
    notes = [
        "*Google's announcement says the features keep working on Wi-Fi, but its safety help page says an LTE watch needs",
        ' an active LTE connection to call 911 without your phone.',
        'Source: Google Pixel Watch Community announcement (Oct 8, 2026) and Help Center, checked Oct 17, 2026',
    ]
    for i, t in enumerate(notes):
        ax.text(0.3, 0.6 - i * 0.22, t, fontsize=11, color=INK2, va='center')
    save(fig, 'safety-signal-before-after.webp')


def timeline():
    d = lambda y, m, dd: mdates.date2num(date(y, m, dd))
    # (날짜, 위/아래, 정렬, 문구, 확정 날짜 여부)
    events = [
        (d(2026, 10, 8), 1, 'center', 'Oct 8\nGoogle announces\nthe end of Safety Signal', True),
        (d(2026, 11, 12), 1, 'center', 'About Nov 12 or earlier\nEmail and push notice:\n30-day transition starts', False),
        (d(2026, 12, 12), -1, 'right', 'Dec 12\nSafety Signal\naccess ends', True),
    ]
    fig, ax = plt.subplots(figsize=(12, 6.75))
    ax.set_facecolor(SURF)
    x0, x1 = d(2026, 9, 28), d(2026, 12, 28)
    ax.plot([x0, x1], [0, 0], color=INK2, lw=2, zorder=1)
    ax.barh(0, d(2026, 12, 12) - d(2026, 11, 12), left=d(2026, 11, 12), height=0.16, color=BLUE, alpha=0.35, zorder=2)
    for x, side, align, text, fixed in events:
        ax.plot([x, x], [0, 0.42 * side], color=GRID, lw=2, zorder=1)
        if fixed:
            ax.plot([x], [0], 'o', ms=14, color=ORANGE, mec=SURF, mew=2, zorder=3)
        else:
            ax.plot([x], [0], 'o', ms=14, color=SURF, mec=ORANGE, mew=3, zorder=3)
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
    fig.suptitle('Pixel Watch Safety Signal: the shutdown timeline', x=0.012, ha='left', fontsize=21, fontweight='bold', y=0.965)
    fig.text(0.012, 0.885, 'Filled dot: date from Google · Hollow dot: our estimate (Google gives 30 days from the email, ending Dec 12)',
             fontsize=13, color=INK2)
    fig.text(0.012, 0.018, 'Source: Google Pixel Watch Community announcement, posted Oct 8, 2026, last edited Oct 9, 2026',
             fontsize=11.5, color=INK2)
    fig.subplots_adjust(left=0.03, right=0.97, top=0.84, bottom=0.14)
    save(fig, 'safety-signal-timeline.webp')


if __name__ == '__main__':
    matrix()
    timeline()
