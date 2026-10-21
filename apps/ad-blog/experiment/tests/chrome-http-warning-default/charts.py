"""Chrome HTTP 경고 기본값: 보호 수준별 기능 표 + 일정 타임라인 (1200×675 webp).

내용 출처는 factcheck.md (Google 블로그 2025-10-28·2026-10-20·2026-10-21, Chrome 도움말 9890866·10468685, Chromium Dash, 2026-10-21(미국 시간) 확인).
실행: python3 -I charts.py <출력 폴더>
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'


def box(ax, x, y, w, h, fill, edge=None, lw=0):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0,rounding_size=0.012',
                                facecolor=fill, edgecolor=edge or fill, lw=lw, zorder=1))


# (기능, 설명, Standard, Enhanced)
ROWS = [
    ('Warning before an HTTP site', 'New default, October 2026', 'yes', 'yes'),
    ('Red warning on known-bad sites', 'Full-page "dangerous site" screen', 'yes', 'yes'),
    ('New "suspicious site" warnings', 'Lower-confidence, Enhanced only', 'no', 'yes'),
    ('Gemini scam check of page text', 'Fake antivirus, fake updates', 'no', 'yes'),
    ('Warning on copied "fix" commands', 'ClickFix scams', 'no', 'yes'),
    ('What Chrome sends to Google', 'Per Chrome\'s settings page', 'Partial URL*', 'Full URLs**'),
]


def protection_matrix():
    fig = plt.figure(figsize=cs.FIGSIZE)
    ax = fig.add_axes([0.03, 0.12, 0.94, 0.71])
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    cs.header(fig, 'What each Chrome protection level gets you now',
              'The HTTP warning is on for everyone. Google\'s newest scam warnings need Enhanced protection.')
    xs = [0.66, 0.88]
    for x, c in zip(xs, ['Standard\n(default)', 'Enhanced\n(opt-in)']):
        ax.text(x, 0.95, c, fontsize=13, color=cs.MUTED, ha='center', va='center', fontweight='semibold')
    box(ax, 0.79, 0.0, 0.18, 0.885, cs.SURFACE)
    rh = 0.148
    for i, (name, sub, a, b) in enumerate(ROWS):
        y = 0.81 - i * rh
        ax.text(0.01, y + 0.025, name, fontsize=15.5, fontweight='bold', va='center')
        ax.text(0.01, y - 0.037, sub, fontsize=11.5, color=cs.MUTED, va='center')
        for x, v in zip(xs, (a, b)):
            if v == 'yes':
                ax.text(x, y, 'Yes', fontsize=16, fontweight='bold', color=cs.ACCENT, ha='center', va='center')
            elif v == 'no':
                ax.text(x, y, 'No', fontsize=15, fontweight='semibold', color=cs.MUTED, ha='center', va='center')
            else:
                ax.text(x, y, v, fontsize=12.5, fontweight='semibold', ha='center', va='center')
        if i < len(ROWS) - 1:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1, zorder=2)
    cs.footer(fig, '* Obfuscated part of the URL via a privacy server; full URLs and bits of page content only if a site acts suspiciously.',
              '** Plus a small sample of page content, downloads, extension activity and system info. Source: Google blog (Oct 20-21, 2026), Chrome 156 settings.')
    cs.save(fig, f'{OUT}/chrome-protection-levels.webp')


# (x 위치, 날짜, 내용, 강조)
EVENTS = [
    (0.04, '2022', 'Opt-in setting\n"Always use secure\nconnections" launches', False),
    (0.22, 'Oct 28, 2025', 'Google announces\nit will become\nthe default', False),
    (0.40, 'Apr 7, 2026', 'Chrome 147: on for\nEnhanced protection\nusers', False),
    (0.58, 'Sep 22, 2026', 'Chrome 154 ships\n(the version Google\nhad named)', False),
    (0.76, 'Oct 21, 2026', 'Google: now on by\ndefault for all users', True),
]


def timeline():
    fig = plt.figure(figsize=cs.FIGSIZE)
    ax = fig.add_axes([0.03, 0.12, 0.94, 0.71])
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    cs.header(fig, 'How Chrome got to warning before HTTP sites',
              'Four years from opt-in setting to default. The warning covers public sites, not your router or printer.')
    ax.plot([0.02, 0.98], [0.62, 0.62], color=cs.BORDER, lw=3, zorder=1)
    for x, date, text, hi in EVENTS:
        c = cs.ACCENT if hi else cs.MUTED
        ax.scatter([x + 0.07], [0.62], s=220 if hi else 120, color=c, zorder=3)
        ax.text(x + 0.07, 0.76, date, fontsize=15, fontweight='bold', ha='center', va='center',
                color=cs.ACCENT if hi else cs.FOREGROUND)
        ax.text(x + 0.07, 0.42, text, fontsize=12.5, ha='center', va='center', linespacing=1.5,
                color=cs.FOREGROUND, fontweight='semibold' if hi else 'normal')
    box(ax, 0.02, 0.0, 0.96, 0.17, cs.SURFACE)
    ax.text(0.04, 0.085, 'In our test of Chrome 156 (Oct 21, 2026), a new profile had the switch off on first launch and on at the next launch.',
            fontsize=12.5, va='center')
    cs.footer(fig, 'Source: Google blog posts of Oct 28, 2025 and Oct 21, 2026; Chromium Dash release dates.')
    cs.save(fig, f'{OUT}/chrome-http-warning-timeline.webp')


if __name__ == '__main__':
    protection_matrix()
    timeline()
