"""Apple Mail × Exchange Web Services 종료: 영향 표 + 일정 타임라인 + Mac 종류별 선택지 (1200×675 webp).

내용 출처는 factcheck.md (Apple 지원 문서 149092·105128·보안 업데이트 목록, Microsoft Exchange 팀 블로그 2026-02-05,
Microsoft Learn EWS 중단 문서, Microsoft 지원 legacy Outlook for Mac 종료, Mac App Store Outlook 페이지, 2026-10-22 확인).
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


def canvas(title, subtitle):
    fig = plt.figure(figsize=cs.FIGSIZE)
    ax = fig.add_axes([0.03, 0.12, 0.94, 0.71])
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    cs.header(fig, title, subtitle)
    return fig, ax


# (앱, 부가 설명, 연결 방식, 영향, 강조 여부)
ROWS = [
    ('Mail, Calendar, Contacts, Notes, Reminders', 'On a Mac, with a Microsoft 365 work or school account', 'EWS', 'Can stop syncing once your\norganization\'s EWS is off', True),
    ('Legacy Outlook for Mac', 'The old version (Legacy Outlook switch on)', 'EWS', 'Stops working with\nMicrosoft 365 mailboxes', True),
    ('Current Outlook for Mac', 'Free on the Mac App Store, macOS 14 or later', 'Microsoft\'s sync', 'Keeps working', False),
    ('Mail on iPhone and iPad', 'Microsoft Exchange account', 'ActiveSync', 'Not part of Apple\'s\nmacOS notice', False),
    ('Any app, company-run Exchange server', 'Mail hosted on your organization\'s own server', 'EWS', 'Not affected (Exchange\nServer keeps EWS)', False),
]


def who_is_affected():
    fig, ax = canvas('Which apps lose their work email connection',
                     'Microsoft is turning off Exchange Web Services (EWS) for Microsoft 365. Apps that still use it stop syncing.')
    cols = [(0.60, 'Connects with'), (0.83, 'What happens')]
    for x, c in cols:
        ax.text(x, 0.96, c, fontsize=13, color=cs.MUTED, ha='center', va='center', fontweight='semibold')
    rh = 0.18
    for i, (name, sub, via, effect, hi) in enumerate(ROWS):
        y = 0.82 - i * rh
        if hi:
            box(ax, 0.0, y - rh / 2 + 0.01, 1.0, rh - 0.02, cs.SURFACE)
        ax.text(0.015, y + 0.028, name, fontsize=15, fontweight='bold', va='center', zorder=2)
        ax.text(0.015, y - 0.035, sub, fontsize=11.5, color=cs.MUTED, va='center', zorder=2)
        ax.text(0.60, y, via, fontsize=14, fontweight='bold', ha='center', va='center', zorder=2,
                color=cs.ACCENT if via == 'EWS' and hi else cs.FOREGROUND)
        ax.text(0.83, y, effect, fontsize=12.5, ha='center', va='center', linespacing=1.4, zorder=2,
                fontweight='semibold' if hi else 'normal', color=cs.FOREGROUND if hi else cs.MUTED)
        if i < len(ROWS) - 1 and not hi and not ROWS[i + 1][4]:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1, zorder=2)
    cs.footer(fig, 'Personal iCloud and Gmail accounts in Mail are not Microsoft 365 and are not part of this change.',
              'Source: Apple Support 149092, 105128; Microsoft Exchange Team blog (Feb 5, 2026); Microsoft Support. As of Oct 22, 2026.')
    cs.save(fig, f'{OUT}/ews-who-is-affected.webp')


# (x 위치, 날짜, 내용, 강조)
EVENTS = [
    (0.00, '2018', 'Microsoft stops\nadding features\nto EWS', False),
    (0.16, 'Feb 5, 2026', 'Microsoft sets a\nphased plan and\nfinal date', False),
    (0.32, 'Oct 1, 2026', 'EWS starts being\nswitched off,\norganization by\norganization', True),
    (0.48, 'Oct 13, 2026', 'Apple posts its\nnotice for Mac\nMail and Calendar', False),
    (0.64, 'No date yet', 'Apple update to\nmacOS 27 that\nmoves to Graph', False),
    (0.80, 'Apr 1, 2027', 'EWS off for good;\nIT can no longer\nturn it back on', True),
]


def timeline():
    fig, ax = canvas('The EWS shutdown, and where Apple\'s fix fits',
                     'Your IT team can keep EWS on for now. After April 1, 2027, nobody can.')
    ax.plot([0.02, 0.98], [0.62, 0.62], color=cs.BORDER, lw=3, zorder=1)
    for x, date, text, hi in EVENTS:
        cx = x + 0.08
        dashed = date == 'No date yet'
        c = cs.ACCENT if hi else cs.MUTED
        if dashed:
            ax.scatter([cx], [0.62], s=150, facecolor=cs.BACKGROUND, edgecolor=cs.MUTED, lw=2, zorder=3)
        else:
            ax.scatter([cx], [0.62], s=220 if hi else 120, color=c, zorder=3)
        ax.text(cx, 0.76, date, fontsize=14.5, fontweight='bold', ha='center', va='center',
                color=cs.ACCENT if hi else (cs.MUTED if dashed else cs.FOREGROUND))
        ax.text(cx, 0.40, text, fontsize=12.5, ha='center', va='center', linespacing=1.5,
                color=cs.FOREGROUND, fontweight='semibold' if hi else 'normal')
    box(ax, 0.02, 0.0, 0.96, 0.15, cs.SURFACE)
    ax.text(0.04, 0.075, 'Apple says the Graph update is for macOS 27, which runs only on Macs with Apple silicon.',
            fontsize=13, va='center')
    cs.footer(fig, 'Source: Microsoft Exchange Team blog (Feb 5, 2026) and Microsoft Learn; Apple Support 149092 (Oct 13, 2026) and Apple security releases list.')
    cs.save(fig, f'{OUT}/ews-shutdown-timeline.webp')


# (제목, 부제, 단계 목록, 강조)
PANELS = [
    ('Mac with Apple silicon', 'M1 or newer, can run macOS 27',
     ['Ask IT whether Apple is on the EWS allow list',
      'Install macOS 27 updates as they arrive',
      'Use Outlook for Mac or the web until Apple\'s fix ships'], True),
    ('Intel Mac on macOS 14 to 26', 'Cannot run macOS 27',
     ['Apple has named no fix for these Macs',
      'Move work email to Outlook for Mac (free app)',
      'Keep Mail for personal iCloud or Gmail accounts'], False),
    ('Mac on macOS 13 or older', 'Too old for the Outlook app',
     ['Use Outlook on the web in Safari or Chrome',
      'Or update macOS if your Mac supports it',
      'Ask IT about an approved alternative'], False),
]


def options_by_mac():
    fig, ax = canvas('What to do depends on which Mac you have',
                     'Apple\'s promised fix is tied to macOS 27. Intel Macs top out at macOS Tahoe 26.')
    w, gap = 0.315, 0.0275
    for i, (title, sub, steps, hi) in enumerate(PANELS):
        x = i * (w + gap)
        box(ax, x, 0.02, w, 0.93, cs.SURFACE, edge=cs.ACCENT if hi else cs.BORDER, lw=2 if hi else 1)
        ax.text(x + 0.025, 0.86, title, fontsize=16, fontweight='bold', va='center',
                color=cs.ACCENT if hi else cs.FOREGROUND)
        ax.text(x + 0.025, 0.78, sub, fontsize=12, color=cs.MUTED, va='center')
        ax.plot([x + 0.025, x + w - 0.025], [0.71, 0.71], color=cs.BORDER, lw=1)
        for j, step in enumerate(steps):
            y = 0.60 - j * 0.2
            ax.scatter([x + 0.04], [y], s=420, color=cs.ACCENT if hi else cs.MUTED, zorder=3)
            ax.text(x + 0.04, y, str(j + 1), fontsize=11, fontweight='bold', color=cs.BACKGROUND,
                    ha='center', va='center', zorder=4)
            words, lines, cur = step.split(), [], ''
            for wd in words:
                if len(cur) + len(wd) > 24:
                    lines.append(cur)
                    cur = wd
                else:
                    cur = f'{cur} {wd}'.strip()
            lines.append(cur)
            ax.text(x + 0.07, y, '\n'.join(lines), fontsize=12.5, va='center', linespacing=1.35)
    cs.footer(fig, 'Outlook for Mac on the Mac App Store requires macOS 14.0 or later. macOS 27 runs on Macs with Apple silicon (Apple security releases list).',
              'Source: Apple Support 149092; Mac App Store listing for Microsoft Outlook (version 16.114). As of Oct 22, 2026.')
    cs.save(fig, f'{OUT}/ews-options-by-mac.webp')


if __name__ == '__main__':
    who_is_affected()
    timeline()
    options_by_mac()
