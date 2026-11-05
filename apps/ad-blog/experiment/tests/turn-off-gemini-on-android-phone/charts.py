"""Android 휴대폰 Gemini 끄기 글 그래픽 3장 (1200×675 webp).

내용 출처는 factcheck.md (Google·Samsung 도움말, 2026-11-05 UTC 확인). 캡처 원본은
`screens/help-16938321-2026-11-05.webp` (render_help.cjs: Playwright Chromium, 창 1100px, 2배율).
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
DOCS = 'Sources: Google Gemini Apps Help, Pixel Phone Help and Samsung US support pages, checked November 5, 2026.'


def box(ax, x, y, w, h, fill, edge=None, lw=0, r=0.012):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle=f'round,pad=0,rounding_size={r}',
                                facecolor=fill, edgecolor=edge or fill, lw=lw, zorder=1))


def shortcuts():
    """Gemini가 열리는 곳 → 막는 설정 → 설정 위치"""
    rows = [
        ('Holding the power\nor side button', 'Set the press-and-hold action to\nPower menu (Pixel) or Power off menu (Samsung)', 'Phone Settings'),
        ('Saying "Hey Google"', 'Turn off Hey Google', 'Gemini app > Settings >\nTalk to Gemini hands-free'),
        ('Your lock screen', 'Turn off Use Gemini without unlocking', 'Gemini app > Settings >\nGemini on lock screen'),
        ('Every assistant shortcut,\nincluding swipes and Home', 'Set Default digital assistant app to None', 'Phone Settings > Apps >\nDefault apps'),
        ('The Gemini button\nin Google Messages', 'Turn off Show Gemini button', 'Messages settings >\nGemini in Messages'),
        ('The Gemini app icon', 'Delete the app, or disable it on some phones.\nThis alone does not change your assistant.', 'Play Store or\nphone Settings'),
    ]
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Each Gemini shortcut on Android has its own setting',
              'Where Gemini opens on an Android phone, and the setting Google or Samsung documents for it.')
    ax = fig.add_axes([0.03, 0.1, 0.94, 0.72])
    ax.set_xlim(0, 1)
    ax.set_ylim(0, len(rows) + 0.9)
    ax.axis('off')
    xs = [0.01, 0.25, 0.71]
    for x, head in zip(xs, ['Where Gemini opens', 'Setting that stops it', 'Where to find it']):
        ax.text(x, len(rows) + 0.42, head, fontsize=13, fontweight='bold', color=cs.MUTED, va='center')
    for r, (where, setting, place) in enumerate(rows):
        y = len(rows) - r - 0.5
        if r % 2 == 0:
            box(ax, 0.0, y - 0.47, 1.0, 0.94, cs.SURFACE)
        ax.text(xs[0], y, where, fontsize=13, fontweight='bold', va='center', linespacing=1.25, zorder=2)
        color = cs.MUTED if r == len(rows) - 1 else cs.ACCENT
        ax.text(xs[1], y, setting, fontsize=12.5, va='center', linespacing=1.3, color=color if r == 3 else cs.FOREGROUND, zorder=2,
                fontweight='semibold' if r == 3 else 'normal')
        ax.text(xs[2], y, place, fontsize=12, va='center', linespacing=1.3, color=cs.MUTED, zorder=2)
    cs.footer(fig, DOCS, 'Menu names vary by phone maker. The highlighted row is the only one that covers every shortcut at once.')
    cs.save(fig, f'{OUT}/gemini-android-shortcut-settings.webp')


def help_page():
    """Google 도움말 16938321: 목차의 'Switch from Gemini to Google Assistant' 링크(본문에 절 없음) + Default digital assistant 절"""
    shot = Image.open(HERE / 'screens/help-16938321-2026-11-05.webp').convert('RGB')
    toc = shot.crop((100, 455, 1340, 920))
    default = shot.crop((100, 1555, 1340, 2420))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, "Google's Gemini help page lists a way back it no longer explains",
              '"Manage or delete the Gemini app on your Android device", rendered in Chromium on November 5, 2026.')
    # 왼쪽: 목차
    w1 = 500
    h1 = w1 * toc.height / toc.width
    fig.text(36 / 1200, 0.765, 'Contents at the top of the page', fontsize=14, fontweight='bold', color=cs.MUTED)
    ax1 = fig.add_axes([36 / 1200, 0.73 - h1 / 675, w1 / 1200, h1 / 675])
    ax1.imshow(toc)
    ax1.axis('off')
    ax1.add_patch(Rectangle((0, 0), toc.width - 1, toc.height - 1, fill=False, edgecolor=cs.BORDER, lw=1.2, zorder=2))
    ax1.add_patch(Rectangle((50, 240), 610, 56, fill=False, edgecolor=cs.ACCENT, lw=3, zorder=3))
    fig.text(36 / 1200, 0.73 - h1 / 675 - 0.05,
             'This link points to a section called\n"Switch from Gemini to Google Assistant",\nbut the page has no section with that name.\nThe other seven links all lead somewhere.',
             fontsize=12.5, va='top', linespacing=1.4)
    # 오른쪽: 기본 어시스턴트 절
    x2 = 36 + w1 + 44
    h2 = 415
    w2 = h2 * default.width / default.height
    fig.text(x2 / 1200, 0.765, 'What the page offers instead', fontsize=14, fontweight='bold', color=cs.ACCENT)
    ax2 = fig.add_axes([x2 / 1200, 0.73 - h2 / 675, w2 / 1200, h2 / 675])
    ax2.imshow(default)
    ax2.axis('off')
    ax2.add_patch(Rectangle((0, 0), default.width - 1, default.height - 1, fill=False, edgecolor=cs.BORDER, lw=1.2, zorder=2))
    ax2.add_patch(Rectangle((20, 590), 700, 60, fill=False, edgecolor=cs.ACCENT, lw=3, zorder=3))  # None
    ax2.add_patch(Rectangle((60, 645), 1160, 105, fill=False, edgecolor=cs.ACCENT, lw=2.5, zorder=3))  # "Google" 설명
    cs.footer(fig, 'Screenshots: support.google.com/gemini/answer/16938321, Chromium on Linux, November 5, 2026. Boxes added by ToolProof.')
    cs.save(fig, f'{OUT}/gemini-android-help-page-missing-section.webp')


def which_option():
    """목적별로 고르는 설정"""
    cards = [
        ('It pops up when I hold the button', 'Change the press-and-hold action\nto the power menu', 'Gemini still opens by voice\nand from the app'),
        ('I want no assistant at all', 'Default digital assistant app:\nNone', 'Hey Google and touch shortcuts\nneed Google as the assistant app'),
        ('I still use Gemini, just not by voice', 'Turn off Hey Google in\nthe Gemini app', 'The button and app\nstill open Gemini'),
        ("I don't want my chats saved", 'Turn off Keep Activity\n(Gemini Apps Activity)', 'Gemini keeps working,\nwith fewer features'),
        ('I want the app gone', 'Pick None first, then delete\nor disable the app', 'Deleting alone leaves\nGemini as your assistant'),
        ('I want Google Assistant back', 'Only if your phone still offers it;\nGoogle no longer documents how', 'Google said in 2025 most phones\nwould lose classic Assistant'),
    ]
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Pick the Gemini setting by what bothers you',
              'Six goals and the setting that matches each one on an Android phone.')
    ax = fig.add_axes([0.03, 0.1, 0.94, 0.72])
    ax.set_xlim(0, 3)
    ax.set_ylim(0, 2)
    ax.axis('off')
    for i, (goal, setting, note) in enumerate(cards):
        col, row = i % 3, 1 - i // 3
        x, y = col + 0.03, row + 0.05
        box(ax, x, y, 0.94, 0.9, cs.SURFACE, r=0.04)
        ax.text(x + 0.05, y + 0.8, goal, fontsize=13, fontweight='bold', va='top', zorder=2)
        ax.text(x + 0.05, y + 0.6, setting, fontsize=12.5, va='top', color=cs.ACCENT, fontweight='semibold', linespacing=1.3, zorder=2)
        ax.text(x + 0.05, y + 0.3, note, fontsize=11.5, va='top', color=cs.MUTED, linespacing=1.3, zorder=2)
    cs.footer(fig, DOCS)
    cs.save(fig, f'{OUT}/gemini-android-which-setting.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    shortcuts()
    help_page()
    which_option()
