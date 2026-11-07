"""Brave AI 끄기 글 그래픽 7장 (1200×675 webp).

캡처 원본은 `screens/*.webp` (Brave 1.98.63, Chromium 156.0.8078.80, Linux, Xvfb 1280×900 1배율, 새 프로필·로그인 없음,
2026-11-03 UTC). 조작 순서는 capture-notes.md, 내용 출처는 factcheck.md.
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
SCREENS = HERE / 'screens'
OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'
SOURCE = 'Screenshots: Brave 1.98.63 on Linux, new profile with no account, November 3, 2026. Boxes added by ToolProof.'


def box(ax, x, y, w, h, fill, edge=None, lw=0):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0,rounding_size=0.012',
                                facecolor=fill, edgecolor=edge or fill, lw=lw, zorder=1))


def screen(name, crop):
    return Image.open(SCREENS / f'{name}.webp').convert('RGB').crop(crop)


def place(fig, img, x_px, y_frac, h_px):
    """캡처를 왼쪽 x_px, 아래 y_frac 위치에 높이 h_px로 배치하고 축을 돌려줌 (좌표는 캡처 픽셀)"""
    w_px = h_px * img.width / img.height
    ax = fig.add_axes([x_px / 1200, y_frac, w_px / 1200, h_px / 675])
    ax.imshow(img)
    ax.axis('off')
    return ax, w_px


def frame(ax, img):
    ax.add_patch(Rectangle((0, 0), img.width - 1, img.height - 1, fill=False, edgecolor=cs.BORDER, lw=1.2, zorder=2))


def mark(ax, x0, y0, x1, y1, lw=3):
    ax.add_patch(Rectangle((x0, y0), x1 - x0, y1 - y0, fill=False, edgecolor=cs.ACCENT, lw=lw, zorder=3))


def side_panel(fig, left, title, rows, top=0.86, bottom=0.12):
    side = fig.add_axes([left, bottom, 0.97 - left, 0.83 - bottom])
    side.set_xlim(0, 1)
    side.set_ylim(0, 1)
    side.axis('off')
    box(side, 0.0, -0.02, 1.0, 0.99, cs.SURFACE)
    side.text(0.06, top + 0.02, title, fontsize=15, fontweight='bold', color=cs.ACCENT, zorder=2)
    y = top - 0.09
    for head, body in rows:
        side.text(0.06, y, head, fontsize=13.5, fontweight='bold', va='top', zorder=2)
        side.text(0.06, y - 0.06, body, fontsize=12, va='top', linespacing=1.35, zorder=2)
        y -= 0.065 + 0.056 * (body.count('\n') + 1) + 0.04
    return side


def leo_settings():
    """Settings > Leo: 기본으로 켜진 스위치 3개 + 주소창 제안 링크"""
    img = screen('01-settings-leo', (394, 250, 1075, 760))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Brave puts three Leo switches on one settings page',
              'Settings > Leo (brave://settings/leo-ai). All three were on in a new profile.')
    ax, w = place(fig, img, 36, 0.115, 480)
    frame(ax, img)
    mark(ax, 4, 194, 677, 240)  # sidebar
    mark(ax, 4, 244, 677, 324)  # context menu
    mark(ax, 4, 329, 677, 409)  # Tab Focus Mode
    mark(ax, 4, 413, 677, 456, lw=2.5)  # Adjust autocomplete suggestions
    side_panel(fig, 0.03 + (w + 30) / 1200, 'What turning each one off removed', [
        ('Show Leo icon in the sidebar', 'The Leo icon at the top of the sidebar'),
        ('Show Leo in the context menu', 'Leo AI tools when you right-click\nselected text or a text box'),
        ('Tab Focus Mode', 'The Organize tab in tab search'),
        ('Adjust autocomplete suggestions', 'Opens the address bar checkboxes.\nUnchecking Leo AI Assistant hides Ask Leo'),
    ])
    cs.footer(fig, SOURCE, 'Each change stayed after we closed and reopened Brave.')
    cs.save(fig, f'{OUT}/brave-leo-settings-switches.webp')


def toolbar_button():
    """툴바 Leo AI 버튼: 오른쪽 클릭 메뉴 Hide Leo AI icon + Customize toolbar 패널의 Leo AI 스위치"""
    menu = screen('c-toolbar-menu-hide', (1016, 36, 1280, 250))
    panel = screen('04-customize-toolbar', (822, 150, 1232, 740))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'The Leo AI toolbar button has its own off switch',
              'Right-click the button, or turn it off in the toolbar panel. The Leo settings page does not cover it.')
    fig.text(36 / 1200, 0.765, 'Right-click the Leo AI button', fontsize=14, fontweight='bold', color=cs.MUTED)
    h1 = 300
    ax1, w1 = place(fig, menu, 36, 0.73 - h1 / 675, h1)
    frame(ax1, menu)
    mark(ax1, 10, 178, 262, 210, lw=2.5)  # Hide Leo AI icon
    mark(ax1, 200, 6, 246, 40, lw=2.5)  # 툴바 버튼
    x2 = 36 + w1 + 60
    fig.text(x2 / 1200, 0.765, 'Or: Settings > Appearance > Customize your toolbar', fontsize=14, fontweight='bold', color=cs.MUTED)
    h2 = 440
    ax2, w2 = place(fig, panel, x2, 0.73 - h2 / 675, h2)
    frame(ax2, panel)
    mark(ax2, 6, 496, 404, 536, lw=2.5)  # Leo AI 행
    fig.text(36 / 1200, 0.73 - h1 / 675 - 0.06,
             'Either one removed the button, and it\nstayed gone after a restart.',
             fontsize=12.5, va='top', linespacing=1.4)
    cs.footer(fig, SOURCE)
    cs.save(fig, f'{OUT}/brave-leo-toolbar-button.webp')


def right_click():
    """선택한 글 오른쪽 클릭: Leo AI tools 하위 메뉴 (끄기 전) vs 없음 (끈 뒤)"""
    before = screen('c-s2-sidebar-off-3b-context-submenu', (300, 245, 1045, 740))
    after = screen('c-s3-context-off-3-context-selection', (170, 205, 790, 425))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'One switch removes Leo from the right-click menu',
              'We selected a paragraph on the same test page and right-clicked it, before and after the switch.')
    fig.text(36 / 1200, 0.765, 'Before: Leo AI tools', fontsize=14, fontweight='bold', color=cs.MUTED)
    h1 = 430
    ax1, w1 = place(fig, before, 36, 0.73 - h1 / 675, h1)
    frame(ax1, before)
    mark(ax1, 2, 131, 516, 161, lw=2.5)  # Leo AI tools
    x2 = 36 + w1 + 40
    fig.text(x2 / 1200, 0.765, 'After: Show Leo in the context menu off', fontsize=14, fontweight='bold', color=cs.ACCENT)
    w2 = 1200 - x2 - 30
    h2 = w2 * after.height / after.width
    ax2, _ = place(fig, after, x2, 0.73 - h2 / 675, h2)
    frame(ax2, after)
    fig.text(x2 / 1200, 0.73 - h2 / 675 - 0.06,
             'The same menu without Leo AI tools. Text boxes\nlost the same submenu, which holds the\nParaphrase, Improve and Change tone rewrites.',
             fontsize=12.5, va='top', linespacing=1.4)
    cs.footer(fig, SOURCE)
    cs.save(fig, f'{OUT}/brave-leo-right-click-before-after.webp')


def address_bar():
    """주소창: Ask Leo 줄 (끄기 전) vs 없음 (Leo AI Assistant 체크 해제 뒤) + 체크박스"""
    before = screen('c-s3-context-off-5-omnibox', (200, 40, 1080, 180))
    after = screen('c-s4-autocomplete-off-5-omnibox', (200, 40, 1080, 180))
    boxes = screen('k-appearance-autocomplete', (394, 615, 1075, 898))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Ask Leo in the address bar is a separate checkbox',
              'We typed the same question in the address bar before and after unchecking Leo AI Assistant.')
    top = 128
    w = 640
    h = w * before.height / before.width

    def row(label, color, img, y_px):
        fig.text(36 / 1200, 1 - (y_px + 18) / 675, label, fontsize=14, fontweight='bold', color=color)
        ax, _ = place(fig, img, 36, 1 - (y_px + 26 + h) / 675, h)
        frame(ax, img)
        return ax, y_px + 26 + h + 22

    ax1, y = row('Before: Ask Leo row', cs.MUTED, before, top)
    mark(ax1, 4, 92, 876, 136, lw=2.5)
    row('After: Leo AI Assistant unchecked', cs.ACCENT, after, y)
    x2 = 36 + w + 40
    fig.text(x2 / 1200, 0.765, 'Settings > Appearance', fontsize=14, fontweight='bold', color=cs.MUTED)
    w2 = 1200 - x2 - 30
    h2 = w2 * boxes.height / boxes.width
    ax3, _ = place(fig, boxes, x2, 0.73 - h2 / 675, h2)
    frame(ax3, boxes)
    mark(ax3, 50, 245, 668, 281, lw=2.5)  # Leo AI Assistant
    fig.text(x2 / 1200, 0.73 - h2 / 675 - 0.06,
             'Under Show autocomplete suggestions\nin address bar. Leo\'s Adjust autocomplete\nsuggestions link opens this spot.',
             fontsize=12.5, va='top', linespacing=1.4)
    cs.footer(fig, SOURCE)
    cs.save(fig, f'{OUT}/brave-ask-leo-address-bar.webp')


def matrix():
    """진입점 8곳 × (기본 / 스위치 5개 끈 뒤 / brave://flags Disabled) 결과 표"""
    rows = [
        ('Leo AI button on the toolbar', 'Shown', 'Gone', 'Gone'),
        ('Leo icon in the sidebar', 'Shown', 'Gone', 'Gone'),
        ('Leo AI tools on right-click', 'Shown', 'Gone', 'Gone'),
        ('Ask Leo in the address bar', 'Shown', 'Gone', 'Gone'),
        ('Organize tab in tab search', 'Shown', 'Gone', 'Gone'),
        ('Leo AI in the main menu', 'Shown', 'Still there', 'Gone'),
        ('brave://leo-ai chat page', 'Opens', 'Still opens', 'Invalid address'),
        ('Leo section in Settings', 'Shown', 'Still there', 'Gone'),
    ]
    cols = ['New profile', 'After the five\nswitches', 'After Brave AI Chat\nDisabled in flags']
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'The switches hide Leo, the flag removes it',
              'What we saw in Brave 1.98.63 after each change and a restart.')
    ax = fig.add_axes([0.03, 0.1, 0.94, 0.72])
    ax.set_xlim(0, 1)
    ax.set_ylim(0, len(rows) + 1.2)
    ax.axis('off')
    xs = [0.0, 0.43, 0.62, 0.81]
    ax.text(xs[0] + 0.01, len(rows) + 0.55, 'Where Leo shows up', fontsize=13, fontweight='bold', color=cs.MUTED, va='center')
    for i, c in enumerate(cols):
        ax.text(xs[i + 1] + 0.085, len(rows) + 0.55, c, fontsize=13, fontweight='bold', color=cs.MUTED, ha='center', va='center', linespacing=1.2)
    for r, (name, a, b, c) in enumerate(rows):
        y = len(rows) - r - 0.5
        if r % 2 == 0:
            box(ax, 0.0, y - 0.45, 1.0, 0.9, cs.SURFACE)
        ax.text(xs[0] + 0.01, y, name, fontsize=13.5, va='center', zorder=2)
        for i, v in enumerate((a, b, c)):
            gone = v in ('Gone', 'Invalid address')
            ax.text(xs[i + 1] + 0.085, y, v, fontsize=13.5, ha='center', va='center', zorder=2,
                    color=cs.ACCENT if gone else (cs.FOREGROUND if i else cs.MUTED),
                    fontweight='bold' if gone or v.startswith('Still') else 'normal')
    cs.footer(fig, 'Source: ToolProof test, Brave 1.98.63 on Linux, November 3, 2026. Five switches: toolbar button, sidebar icon,',
              'context menu, Leo AI Assistant autocomplete, Tab Focus Mode. The flag test used a separate new profile.')
    cs.save(fig, f'{OUT}/brave-leo-switches-vs-flag.webp')


def flags_page():
    """brave://flags: Brave AI Chat를 Disabled로 바꾸고 Relaunch"""
    rows = screen('c-flag-brave-ai-chat-Disabled', (220, 200, 970, 700))
    bar = screen('c-flag-brave-ai-chat-Disabled', (0, 828, 1240, 890))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Brave AI Chat set to Disabled on the flags page',
              'Type brave://flags/#brave-ai-chat in the address bar, pick Disabled, then click Relaunch.')
    h1 = 400
    ax1, w1 = place(fig, rows, 36, 0.21, h1)
    frame(ax1, rows)
    mark(ax1, 10, 300, 745, 398, lw=2.5)  # Brave AI Chat 행
    wb = 1200 - 72
    hb = wb * bar.height / bar.width
    ax2, _ = place(fig, bar, 36, 0.1, hb)
    frame(ax2, bar)
    mark(ax2, 1108, 6, 1214, 56, lw=2.5)  # Relaunch
    side_panel(fig, 0.03 + (w1 + 40) / 1200, 'After the relaunch', [
        ('Gone', 'Every Leo button, menu item, right-click\nentry and the Leo settings page'),
        ('Applies to', 'Every profile in this copy of Brave'),
        ('To undo', 'Set it back to Default and relaunch.\nYour Leo switches keep their old state'),
    ], top=0.84, bottom=0.21)
    cs.footer(fig, SOURCE)
    cs.save(fig, f'{OUT}/brave-flags-ai-chat-disabled.webp')


def search_ai():
    """search.brave.com 설정: Answer with AI 켜짐(기본) vs 꺼짐, 쿠키"""
    on = screen('e-search-settings', (104, 640, 775, 740))
    off = screen('f-settings-after', (104, 640, 775, 740))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Brave Search AI answers have their own switch',
              'search.brave.com/settings. It is a website setting, separate from the Leo switches in the browser.')
    w = 640
    h = w * on.height / on.width
    fig.text(36 / 1200, 0.765, 'Default: on', fontsize=14, fontweight='bold', color=cs.MUTED)
    ax1, _ = place(fig, on, 36, 0.73 - h / 675, h)
    frame(ax1, on)
    y2 = 0.73 - h / 675 - 0.09
    fig.text(36 / 1200, y2, 'After clicking the switch', fontsize=14, fontweight='bold', color=cs.ACCENT)
    ax2, _ = place(fig, off, 36, y2 - 0.035 - h / 675, h)
    frame(ax2, off)
    mark(ax2, 588, 10, 662, 46, lw=2.5)
    side_panel(fig, 0.03 + (w + 40) / 1200, 'Where the choice is saved', [
        ('A cookie on search.brave.com', 'Named summarizer, value 0,\nset to expire in 180 days'),
        ('What resets it', 'Clearing cookies, a private window,\nor a different browser or device'),
        ('No account needed', 'We changed it without signing in')
    ])
    cs.footer(fig, SOURCE)
    cs.save(fig, f'{OUT}/brave-search-answer-with-ai.webp')


def brave199_notes():
    """Brave 1.99.55 릴리스 노트의 Leo 변경 vs 같은 시나리오 재시험에서 본 것 (2026-11-07 추가, 결과는 r199/)"""
    rows = [
        ('Leo shows a list of choices when it\nneeds clarification on a task', 'Not a setting: no new switch on the\nLeo settings page'),
        ('Improved follow-up prompts and\nupdated AI Chat models', 'Three model names changed in\nSettings > Leo, such as Grok 4.7'),
        ('Security fix for AI Chat tool-use\napprovals', 'Nothing you can see or set on\nscreen'),
        ('(Not in the notes)\nThe five Leo switches', 'Same names, all on by default, each\nremoved the same place as in 1.98'),
        ('(Not in the notes)\nBrave AI Chat flag and policy', 'Still removed every part of Leo,\nincluding brave://leo-ai'),
    ]
    fig = plt.figure(figsize=cs.FIGSIZE)
    ax = fig.add_axes([0.03, 0.12, 0.94, 0.70])
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    cs.header(fig, 'What Brave 1.99 changed for Leo, and what we saw',
              "Brave's November 5, 2026 desktop release notes vs. our retest of Brave 1.99.55 on a new profile.")
    xs = [0.0, 0.5]
    ytop = 0.95
    for x, h in zip(xs, ["Brave's 1.99.55 release notes", 'Our retest, November 7, 2026']):
        ax.text(x + 0.015, ytop, h, fontsize=13, fontweight='bold', va='center', color=cs.MUTED)
    step = 0.172
    for r, (claim, seen) in enumerate(rows):
        y = ytop - 0.13 - r * step
        if r % 2 == 0:
            box(ax, 0.0, y - step / 2 + 0.008, 1.0, step - 0.016, cs.SURFACE)
        ax.text(0.015, y, claim, fontsize=13, va='center', zorder=2, linespacing=1.3,
                color=cs.MUTED if claim.startswith('(') else cs.FOREGROUND)
        last = r >= len(rows) - 2
        ax.text(xs[1] + 0.015, y, seen, fontsize=13, va='center', zorder=2, linespacing=1.3,
                fontweight='bold' if last else 'normal', color=cs.ACCENT if last else cs.FOREGROUND)
    cs.footer(fig, 'Sources: Brave desktop release notes v1.99.55 (brave.com/latest). ToolProof test of Brave 1.99.55 on Linux.',
              'Same test page, same steps and same restarts as our November 3 test of Brave 1.98.63.')
    cs.save(fig, f'{OUT}/brave-199-leo-changes.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    figures = [leo_settings, toolbar_button, right_click, address_bar, matrix, flags_page, search_ai, brave199_notes]
    only = set(sys.argv[2:])  # 그림 이름을 주면 그것만 다시 그림 (2026-11-07)
    for f in figures:
        if not only or f.__name__ in only:
            f()
