"""Edge Copilot 끄기 글 그래픽: Edge 156 화면 캡처(주석) + 진입점 결과 표 (1200×675 webp).

캡처 원본은 `screens/*.webp` (Microsoft Edge 156.0.4314.56 Linux, 새 프로필·로그아웃, Xvfb 1280×900 1배율,
2026-10-30 UTC, 조작 순서는 capture-notes.md). 내용 출처는 factcheck.md.
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
SOURCE = 'Screenshots: Microsoft Edge 156.0.4314.56, new signed-out profile, October 30, 2026. Boxes added by ToolProof.'


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
    """흰 캡처가 배경과 섞이지 않게 테두리"""
    ax.add_patch(Rectangle((0, 0), img.width - 1, img.height - 1, fill=False, edgecolor=cs.BORDER, lw=1.2, zorder=2))


def mark(ax, x0, y0, x1, y1, lw=3):
    ax.add_patch(Rectangle((x0, y0), x1 - x0, y1 - y0, fill=False, edgecolor=cs.ACCENT, lw=lw, zorder=3))


def side_panel(fig, left, title, rows, top=0.86):
    """오른쪽 설명 패널: 줄 수에 맞춰 항목 간격을 정함"""
    side = fig.add_axes([left, 0.12, 0.97 - left, 0.71])
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


def settings_page():
    """Settings > Copilot and AI 기본 화면: 버튼 스위치 표시, 오른쪽에 스위치별 기본값"""
    img = screen('f-s1-ai-default', (418, 170, 1240, 835))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Edge keeps its Copilot switches on one page',
              'Settings > Copilot and AI in Edge 156. These are the defaults on a new, signed-out profile.')
    ax, w = place(fig, img, 36, 0.115, 480)
    frame(ax, img)
    mark(ax, 8, 186, 816, 240)  # Show Copilot button in toolbar
    side_panel(fig, 0.03 + (w + 30) / 1200, 'Default on our copy', [
        ('Copilot button in toolbar: On', 'Off hid Copilot in four places'),
        ('Context clues: Off', 'Page, tabs and history for Copilot'),
        ('Copilot new tab page: Off', 'A Copilot chat box as your new tab'),
        ('Allow Cowork: Off', 'Copilot clicks and types for you'),
    ])
    cs.footer(fig, SOURCE)
    cs.save(fig, f'{OUT}/edge-copilot-and-ai-settings.webp')


def before_after():
    """같은 시험 페이지에서 버튼 스위치 끄기 전후: 툴바, 오른쪽 클릭 메뉴, 텍스트 선택 미니 메뉴"""
    tb_a = screen('f-a-1-rightclick', (1000, 42, 1280, 78))
    tb_b = screen('f-b-1-rightclick', (1000, 42, 1280, 78))
    menu_a = screen('f-a-1-rightclick', (384, 205, 778, 640))
    menu_b = screen('f-b-1-rightclick', (384, 205, 778, 610))
    mini_a = screen('f-a-2-minimenu', (680, 74, 738, 234))
    mini_b = screen('f-b-2-minimenu', (680, 74, 738, 204))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'One switch hid Copilot in four places',
              'Edge 156, signed out, same test page. Right: after turning off Show Copilot button in toolbar.')
    scale = 330 / menu_a.height
    cols = [(46, 'Before', cs.MUTED, tb_a, menu_a, mini_a, 'Ctrl+Shift+. opened the Copilot pane'),
            (636, 'After', cs.ACCENT, tb_b, menu_b, mini_b, 'Ctrl+Shift+. did nothing')]
    for x0, label, color, tb, menu, mini, shortcut in cols:
        fig.text(x0 / 1200, 0.765, label, fontsize=16, fontweight='bold', color=color)
        axt, wt = place(fig, tb, x0, 0.66, 50)
        frame(axt, tb)
        axm, wm = place(fig, menu, x0, 0.62 - menu.height * scale / 675, menu.height * scale)
        frame(axm, menu)
        axi, wi = place(fig, mini, x0 + wm + 26, 0.62 - mini.height * scale / 675, mini.height * scale)
        frame(axi, mini)
        fig.text((x0 + wm + 26 + wi + 14) / 1200, 0.565, 'Mini menu\non selected\ntext', fontsize=11.5,
                 color=cs.MUTED, va='top', linespacing=1.3)
        fig.text((x0 + wm + 26) / 1200, 0.215, shortcut.replace(' opened', '\nopened').replace(' did', '\ndid'),
                 fontsize=12.5, fontweight='bold', color=color, va='top', linespacing=1.35)
        if label == 'Before':
            mark(axt, 200, 2, 279, 34, lw=2.5)  # Chat 버튼
            mark(axm, 30, 210, 390, 240, lw=2.5)  # Summarize with Copilot
            mark(axi, 12, 68, 46, 96, lw=2.5)  # Copilot 아이콘
    cs.footer(fig, SOURCE, 'Turning the switch back on brought all four back.')
    cs.save(fig, f'{OUT}/edge-copilot-before-after.webp')


def writing_stays():
    """Use writing assistance를 꺼도 글 입력 칸 오른쪽 클릭에 Help me rewrite가 남음"""
    settings = screen('f-s4-lang-wa-off', (428, 572, 1218, 690))
    menu = screen('f-c-4-textarea-rightclick', (2, 380, 628, 790))
    popup = screen('f-c-5-alt-i', (262, 388, 676, 560))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Help me rewrite stayed after both switches were off',
              'Edge 156, signed out, with Show Copilot button and Use writing assistance both turned off.')
    fig.text(36 / 1200, 0.765, 'Settings > Languages > Writing assistance', fontsize=13, fontweight='bold', color=cs.MUTED)
    axs, ws = place(fig, settings, 36, 0.735 - 540 * settings.height / settings.width / 675, 540 * settings.height / settings.width)
    frame(axs, settings)
    mark(axs, 4, 2, 786, 54)  # Use writing assistance (꺼짐)
    fig.text(36 / 1200, 0.49, 'Alt+I in a text box still opened this', fontsize=13, fontweight='bold', color=cs.MUTED)
    axp, wp = place(fig, popup, 36, 0.13, 212)
    frame(axp, popup)
    fig.text(586 / 1200, 0.765, 'Right-click on selected text in a text box', fontsize=13, fontweight='bold', color=cs.MUTED)
    axm, wm = place(fig, menu, 586, 0.13, 384)
    frame(axm, menu)
    mark(axm, 10, 100, 400, 130, lw=2.5)  # Help me rewrite
    cs.footer(fig, SOURCE, 'We were signed out, so Edge only asked us to sign in. We could not see what it does after sign-in.')
    cs.save(fig, f'{OUT}/edge-help-me-rewrite-stays.webp')


def grayed_out():
    """버튼 스위치를 끈 뒤: 문맥 단서 스위치와 Manage settings가 회색"""
    img = screen('f-s2-ai-button-off', (418, 300, 1240, 690))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Hiding the Copilot button grays out two settings',
              'Settings > Copilot and AI right after we turned off Show Copilot button in toolbar.')
    h = 440
    ax, w = place(fig, img, (1200 - h * img.width / img.height) / 2, 0.135, h)
    frame(ax, img)
    mark(ax, 26, 120, 816, 184)  # context clues (회색)
    mark(ax, 668, 330, 806, 368)  # Manage settings (회색)
    cs.footer(fig, SOURCE, 'The context clues switch was usable again after we turned the button back on. Locked switches at work or school are set by your IT admin.')
    cs.save(fig, f'{OUT}/edge-copilot-grayed-out-settings.webp')


def results_table():
    """진입점 × 상태 결과 표"""
    rows = [
        ('Copilot (Chat) button in the toolbar', 'Shown', 'Gone', 'Gone'),
        ('Summarize with Copilot in the right-click menu', 'Shown', 'Gone', 'Gone'),
        ('Copilot icon in the text selection mini menu', 'Shown', 'Gone', 'Gone'),
        ('Ctrl+Shift+. shortcut', 'Opens Copilot', 'Nothing', 'Nothing'),
        ('Help me rewrite in a text box (right-click)', 'Shown', 'Shown', 'Shown'),
        ('Alt+I in a text box', 'Sign-in prompt', 'Sign-in prompt', 'Sign-in prompt'),
        ('Copilot suggestions in the address bar', 'None', 'None', 'None'),
    ]
    heads = ['Default', 'Copilot button\nswitch off', '+ Writing\nassistance off']
    fig = plt.figure(figsize=cs.FIGSIZE)
    ax = fig.add_axes([0.03, 0.12, 0.94, 0.70])
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    cs.header(fig, 'Where Copilot showed up in Edge 156, and what each switch did',
              'Same test page and steps in each state. New signed-out profile, October 30, 2026.')
    xs = [0.0, 0.47, 0.66, 0.84]
    ytop = 0.93
    for i, h in enumerate(heads):
        ax.text(xs[i + 1] + 0.005, ytop, h, fontsize=13, fontweight='bold', va='center', color=cs.MUTED, linespacing=1.2)
    step = 0.115
    for r, (name, *vals) in enumerate(rows):
        y = ytop - 0.115 - r * step
        if r % 2 == 0:
            box(ax, 0.0, y - step / 2 + 0.008, 1.0, step - 0.016, cs.SURFACE)
        ax.text(0.015, y, name, fontsize=13, va='center', zorder=2)
        for c, v in enumerate(vals):
            changed = c > 0 and v != vals[0]
            ax.text(xs[c + 1] + 0.005, y, v, fontsize=13, va='center', zorder=2,
                    fontweight='bold' if changed else 'normal', color=cs.ACCENT if changed else cs.FOREGROUND)
    cs.footer(fig, 'Source: ToolProof test of Microsoft Edge 156.0.4314.56. Turning the Copilot button switch back on restored the first four.',
              'Signed out, Help me rewrite and Alt+I only asked us to sign in.')
    cs.save(fig, f'{OUT}/edge-copilot-entry-points-results.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    settings_page()
    before_after()
    writing_stays()
    grayed_out()
    results_table()
