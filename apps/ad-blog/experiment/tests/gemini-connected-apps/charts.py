"""Gemini Connected Apps 칼럼 그래픽: 공식 목록 집계 + 연결 해제 데이터 표 + 메뉴 경로 + 타임라인 (1200×675 webp).

집계는 connected-apps-2026-10-23.json (parse_apps.py가 Google 공식 표 17434654에서 만든 것), 나머지 내용 출처는 factcheck.md.
실행: python3 -I charts.py <출력 폴더>
"""
import json
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch  # noqa: E402

HERE = Path(__file__).resolve().parent
OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'
APPS = json.loads((HERE / 'connected-apps-2026-10-23.json').read_text(encoding='utf-8'))
LIST_SOURCE = 'Source: Google Gemini Help, "Check the availability & requirements of Connected Apps" table (83 rows), downloaded October 23, 2026'


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


def where_from(a):
    loc = a['location']
    if loc == 'US only':
        return 'US only'
    if any(k in loc for k in ('Brazil only', 'India only')):
        return 'Brazil or India only'
    return 'Wider availability'


def app_list_breakdown():
    """회사 유형별 앱 수를 지역 제한으로 나눈 가로 막대 (그 밖의 회사 = accent)"""
    owners = ['Other company', 'Phone maker or built-in', 'Google']
    label = {'Other company': 'Other companies', 'Phone maker or built-in': 'Phone makers and\nbuilt-in phone apps',
             'Google': 'Google'}
    norm = {'Phone maker / built-in': 'Phone maker or built-in'}
    counts = {o: Counter() for o in owners}
    for a in APPS:
        counts[norm.get(a['owner'], a['owner'])][where_from(a)] += 1
    fig, ax = cs.figure()
    fig.subplots_adjust(left=0.22, right=0.95, top=0.76, bottom=0.2)
    ax.set_xlim(0, 56)
    ax.set_ylim(-0.6, len(owners) - 0.4)
    ax.set_yticks(range(len(owners)))
    ax.set_yticklabels([label[o] for o in owners], fontsize=15, fontweight='semibold')
    ax.invert_yaxis()
    segs = [('US only', cs.ACCENT), ('Brazil or India only', cs.MUTED), ('Wider availability', cs.BORDER)]
    for i, o in enumerate(owners):
        left = 0
        for key, color in segs:
            n = counts[o][key]
            cs.rounded_barh(ax, i, left, n, 0.5, color)
            if n >= 3:
                ax.text(left + n / 2, i, str(n), ha='center', va='center', fontsize=13, fontweight='bold', zorder=4,
                        color=cs.BACKGROUND if color != cs.BORDER else cs.FOREGROUND)
            left += n
        ax.text(left + 0.8, i, f'{left} apps', va='center', fontsize=14, fontweight='bold')
    ax.set_xticks([])
    ax.spines['bottom'].set_visible(False)
    ax.grid(False)
    cs.header(fig, 'Over half of the outside apps in Gemini are US only',
              '27 of the 51 apps from other companies are listed as US only. Blue = US only, gray = Brazil or India only, light = wider.')
    cs.footer(fig, 'Company groups are our classification by app name. "Wider" includes OpenTable (UK and US) and Pandora (US and Puerto Rico).', LIST_SOURCE)
    cs.save(fig, f'{OUT}/gemini-connected-apps-by-company.webp')


# (행동, 무엇이 일어나는가, 무엇이 남는가)
DATA_ROWS = [
    ('Connect\nan app', 'Gemini can use that app\'s content\n(emails, files, events, photos)',
     'Gemini shares chat, device, and\nlocation info with the app for tasks'),
    ('Disconnect\nan app', 'Gemini stops using that app\nin new chats',
     'Your Gemini Apps Activity stays.\nData the app already got stays\nunder that app\'s own policy'),
    ('Delete Gemini\nApps Activity', 'Saved Gemini chats are removed\nfrom your account',
     'Data outside apps got stays. Chats\nhuman reviewers saw: up to 3 years'),
    ('Turn off\nKeep Activity', 'Most Connected Apps stop\n(web, iPhone, watch)',
     'New chats still kept 72 hours.\nAndroid keeps Phone, Messages,\nWhatsApp, Device assistance'),
]


def disconnect_table():
    fig, ax = canvas('What disconnecting an app does and does not delete',
                     'Disconnecting stops future access. It does not pull back data an app already got from Gemini.')
    for x, c in [(0.015, 'You do this'), (0.25, 'What happens'), (0.62, 'What stays')]:
        ax.text(x, 0.95, c, fontsize=13, color=cs.MUTED, va='center', fontweight='semibold')
    rh = 0.215
    for i, (act, happens, stays) in enumerate(DATA_ROWS):
        y = 0.79 - i * rh
        hi = i == 1
        if hi:
            box(ax, 0.0, y - rh / 2 + 0.012, 1.0, rh - 0.024, cs.SURFACE)
        ax.text(0.015, y, act, fontsize=15, fontweight='bold', va='center', zorder=2, linespacing=1.3,
                color=cs.ACCENT if hi else cs.FOREGROUND)
        ax.text(0.25, y, happens, fontsize=12.5, va='center', linespacing=1.4, zorder=2)
        ax.text(0.62, y, stays, fontsize=12.5, va='center', linespacing=1.45, zorder=2,
                fontweight='semibold' if hi else 'normal')
        if i < len(DATA_ROWS) - 1 and not hi and i + 1 != 1:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1)
    cs.footer(fig, 'Source: Google Gemini Apps Privacy Hub and "Use & manage Connected Apps in Gemini," checked October 23, 2026')
    cs.save(fig, f'{OUT}/gemini-disconnect-what-stays.webp')


PATHS = [
    ('Computer\n(gemini.google.com)', ['Sidebar', 'Customize\n(or More > Customize)', 'Connectors tab', 'More options >\nDisconnect']),
    ('Android, iPhone,\niPad', ['Menu', 'Customize\n(or More > Customize)', 'Connectors tab', 'More options >\nDisconnect']),
    ('Customize not\nthere yet', ['Settings', 'Personal Intelligence\n(if shown)', 'Connected Apps', 'Turn off\nthe app']),
]


def menu_paths():
    fig, ax = canvas('Where Gemini Connected Apps live now',
                     'The new Customize menu replaces the old Connected Apps page. Google is rolling it out over about 15 days.')
    rh = 0.31
    bw, gap, x0 = 0.175, 0.03, 0.2
    for i, (device, steps) in enumerate(PATHS):
        y = 0.80 - i * rh
        old = i == 2
        ax.text(0.0, y, device, fontsize=15, fontweight='bold', va='center', linespacing=1.3,
                color=cs.MUTED if old else cs.FOREGROUND)
        for j, step in enumerate(steps):
            x = x0 + j * (bw + gap)
            last = j == len(steps) - 1
            fill = cs.ACCENT if last and not old else cs.SURFACE
            box(ax, x, y - 0.09, bw, 0.18, fill, edge=cs.BORDER if old else None, lw=1 if old else 0)
            ax.text(x + bw / 2, y, step, fontsize=12.5, ha='center', va='center', zorder=2, linespacing=1.3,
                    color=cs.BACKGROUND if last and not old else (cs.MUTED if old else cs.FOREGROUND),
                    fontweight='bold' if last else 'semibold')
            if not last:
                ax.annotate('', xy=(x + bw + gap - 0.004, y), xytext=(x + bw + 0.004, y),
                            arrowprops=dict(arrowstyle='-|>', color=cs.MUTED, lw=1.5), zorder=2)
    cs.footer(fig, 'Menu names from Google Gemini Help ("Use & manage Connected Apps," "Connect & manage custom apps"), checked October 23, 2026.')
    cs.save(fig, f'{OUT}/gemini-connected-apps-menu-path.webp')


EVENTS = [
    ('May 19', 'OpenTable, Canva,\nand Instacart arrive'),
    ('Aug 12', 'Made by Google batch:\nZocdoc, Ticketmaster, more'),
    ('Sep 23', 'Adobe, Experian,\nPeloton, more'),
    ('Oct 13', 'Customize menu starts\nrolling out (up to 15 days)'),
    ('Oct 21', 'Google Workspace\nannounces it'),
]


def timeline():
    fig, ax = canvas('How outside apps reached Gemini in 2026',
                     'Google added them in batches, then moved them into one Customize menu with Skills.')
    y = 0.5
    ax.plot([0.04, 0.96], [y, y], color=cs.BORDER, lw=3, zorder=1)
    n = len(EVENTS)
    for i, (d, t) in enumerate(EVENTS):
        x = 0.08 + i * (0.84 / (n - 1))
        cur = i >= 3
        ax.scatter([x], [y], s=260, color=cs.ACCENT if cur else cs.MUTED, zorder=3)
        ax.text(x, y + 0.13, d, ha='center', va='center', fontsize=17, fontweight='bold',
                color=cs.ACCENT if cur else cs.FOREGROUND)
        ax.text(x, y - 0.17, t, ha='center', va='center', fontsize=12.5, linespacing=1.45)
    cs.footer(fig, 'Sources: Gemini release notes (2026.05.19, 2026.10.13), Google Blog (August 12 and September 23, 2026),',
              'Google Workspace Updates (October 21, 2026)')
    cs.save(fig, f'{OUT}/gemini-connected-apps-timeline.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    app_list_breakdown()
    disconnect_table()
    menu_paths()
    timeline()
