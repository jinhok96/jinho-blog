"""Android 전화번호 인증 칼럼 그래픽: 도움말 화면 캡처 + Google 문서 3곳 문장 대조 + 스위치 3곳 효과 + 보도 타임라인 (1200×675 webp).

내용 출처는 factcheck.md. 캡처 원본 `help-7521240-turn-off.png`는 shot.cjs로 찍은 support.google.com/android/answer/7521240
화면 (1100px 폭, 2배율, 2026-10-24).
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


def help_screenshot():
    """도움말 캡처에서 회색 테두리를 잘라 넣고, '모든 계정에 추가' 문단을 accent 상자로 표시"""
    img = Image.open(HERE / 'help-7521240-turn-off.png').convert('RGB')
    img = img.crop((60, 0, 1470, 890))  # 좌우 회색 테두리 제외
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Google\'s help page: on by default, added to every account',
              'Android Help, "Manage phone number verification on your device," as shown on October 24, 2026.')
    # 캔버스 픽셀 기준 위치 (가로 1200, 세로 675)
    h_px = 470
    w_px = h_px * img.width / img.height
    left = (1200 - w_px) / 2
    ax = fig.add_axes([left / 1200, 0.115, w_px / 1200, h_px / 675])
    ax.imshow(img)
    ax.axis('off')
    # 첫 번째 항목(기본값·모든 계정) 원본 좌표 약 x 100~1360, y 190~335 (자른 뒤 기준)
    ax.add_patch(Rectangle((92, 186), 1290, 248, fill=False, edgecolor=cs.ACCENT, lw=3, zorder=3))
    cs.footer(fig, 'Source: support.google.com/android/answer/7521240, captured in Chromium on October 24, 2026. Box added by ToolProof.')
    cs.save(fig, f'{OUT}/google-help-default-all-accounts.webp')


# (문서, 문장, 강조 여부)
DOCS = [
    ('Android Help\n"Manage phone number\nverification on your device"',
     '"We verify the phone number and add them to all\nGoogle Accounts that are signed in on the device.\nThis applies to both current and future accounts."', True),
    ('Google Account Help\n"Change the phone number on\nyour account & how it\'s used"',
     '"Any verified phone numbers for an Android device\ncan be added to any Google Account that is\nsigned into that device."', False),
    ('Google Account Help\n"Sign in with your phone\nnumber instead of a username"',
     'Use a number that: "Belongs only to you" and\n"You don\'t use on another Google Account\nto sign in."', False),
]


def doc_compare():
    fig, ax = canvas('Three Google help pages, three ways of putting it',
                     'Only the Android page says the number goes on every account. Another page tells you not to share a number across accounts.')
    for x, c in [(0.015, 'Google page'), (0.36, 'What it says')]:
        ax.text(x, 0.96, c, fontsize=13, color=cs.MUTED, va='center', fontweight='semibold')
    rh = 0.29
    for i, (doc, quote, hi) in enumerate(DOCS):
        y = 0.77 - i * rh
        if hi:
            box(ax, 0.0, y - rh / 2 + 0.015, 1.0, rh - 0.03, cs.SURFACE)
        ax.text(0.015, y, doc, fontsize=13.5, fontweight='bold', va='center', linespacing=1.35, zorder=2,
                color=cs.ACCENT if hi else cs.FOREGROUND)
        ax.text(0.36, y, quote, fontsize=14, va='center', linespacing=1.5, zorder=2,
                fontweight='semibold' if hi else 'normal')
        if 0 < i < len(DOCS) - 1:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1)
    cs.footer(fig, 'Sources: support.google.com/android/answer/7521240, /accounts/answer/3463280 and /accounts/answer/7222352',
              '(Android versions), all opened October 24, 2026.')
    cs.save(fig, f'{OUT}/google-help-pages-compared.webp')


# (어디서, 무엇을 하나, 무엇은 그대로인가)
SWITCHES = [
    ('Phone Settings > Google >\nAll services > Phone\nnumber verification: off',
     'Stops automatic verification, so the\nphone\'s numbers aren\'t added to\naccounts from now on',
     'Numbers already added stay on\nevery account they were added to'),
    ('Each Google Account >\nPersonal info > Phone >\nDelete > Remove number',
     'Takes the number off that one account\n(repeat for every account where you\ndon\'t want it)',
     'That account loses the number for\nsign-in and recovery unless you\nadd it back as a recovery phone'),
    ('Same Phone page >\nBetter ads and\nGoogle services: off',
     'Stops that number being used across\nGoogle services to show you more\nrelevant ads ("Across Google")',
     'The number stays on the account\nfor sign-in and recovery'),
]


def switch_table():
    fig, ax = canvas('Three places to check, and what each one does',
                     'Turning off the phone setting doesn\'t undo past links. You clean up each account separately.')
    for x, c in [(0.015, 'Where'), (0.36, 'What it does'), (0.69, 'What it leaves alone')]:
        ax.text(x, 0.96, c, fontsize=13, color=cs.MUTED, va='center', fontweight='semibold')
    rh = 0.29
    for i, (where, does, leaves) in enumerate(SWITCHES):
        y = 0.77 - i * rh
        hi = i == 0
        if hi:
            box(ax, 0.0, y - rh / 2 + 0.015, 1.0, rh - 0.03, cs.SURFACE)
        ax.text(0.015, y, where, fontsize=13.5, fontweight='bold', va='center', linespacing=1.35, zorder=2,
                color=cs.ACCENT if hi else cs.FOREGROUND)
        ax.text(0.36, y, does, fontsize=12.5, va='center', linespacing=1.45, zorder=2)
        ax.text(0.69, y, leaves, fontsize=12.5, va='center', linespacing=1.45, zorder=2, color=cs.MUTED)
        if 0 < i < len(SWITCHES) - 1:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1)
    cs.footer(fig, 'Sources: Android Help (7521240) and Google Account Help (3463280, Android version), checked October 24, 2026.',
              'Menu names can differ by phone maker. We could not open these screens without an Android phone and Google account.')
    cs.save(fig, f'{OUT}/phone-number-switches.webp')


EVENTS = [
    ('Late 2025', 'Help page gains "on by\ndefault" and "all Google\nAccounts" wording*'),
    ('Oct 14, 2026', 'Android Authority reports\nnumbers being linked to\nevery signed-in account'),
    ('Oct 18 to 22', 'Android Central, BGR,\nMalwarebytes and\nLifehacker follow up'),
    ('Oct 24, 2026', 'Engadget reports it; Google\'s\npage still says on by default.\nNo public Google statement'),
]


def timeline():
    fig, ax = canvas('A default many people only noticed in October 2026',
                     'Google made no announcement this month. The reports describe a default already written in its help page.')
    y = 0.55
    ax.plot([0.04, 0.96], [y, y], color=cs.BORDER, lw=3, zorder=1)
    n = len(EVENTS)
    for i, (d, t) in enumerate(EVENTS):
        x = 0.11 + i * (0.78 / (n - 1))
        cur = i == n - 1
        ax.scatter([x], [y], s=260, color=cs.ACCENT if cur else cs.MUTED, zorder=3)
        ax.text(x, y + 0.13, d, ha='center', va='center', fontsize=15, fontweight='bold',
                color=cs.ACCENT if cur else cs.FOREGROUND)
        ax.text(x, y - 0.2, t, ha='center', va='center', fontsize=12.5, linespacing=1.45)
    cs.footer(fig, '*Android Authority (October 14, 2026) reported the help page changed between August and October 2025; we could not open',
              'archived copies to confirm. Coverage dates from Google News; Google help page checked October 24, 2026.')
    cs.save(fig, f'{OUT}/phone-number-linking-timeline.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    help_screenshot()
    doc_compare()
    switch_table()
    timeline()
