"""Firefox AI 끄기 글 그래픽: Firefox 159 화면 캡처(주석) + 차단 범위 표 (1200×675 webp).

캡처 원본은 `screens/*.webp` (Firefox 159.0 Linux, 새 프로필, Xvfb 1440×960 1배율, 2026-10-28 15:47~15:55 UTC,
조작 순서는 factcheck.md "직접 실행"). 내용 출처는 factcheck.md.
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
SOURCE = 'Screenshots: Firefox 159.0 on a new profile, October 28, 2026. Boxes added by ToolProof.'


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
    """AI controls 첫 화면: 왼쪽 메뉴의 AI controls와 Block AI enhancements 스위치를 표시, 오른쪽에 6개 기능"""
    img = screen('ai-controls-default', (36, 140, 920, 960))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Firefox puts every AI switch on one page',
              'Settings > AI controls in Firefox 159. On a new profile, every feature starts as Available.')
    ax, w = place(fig, img, 36, 0.115, 480)
    mark(ax, 2, 522, 240, 566)  # 왼쪽 메뉴 AI controls
    mark(ax, 303, 255, 860, 375)  # Block AI enhancements
    side_panel(fig, 0.03 + (w + 30) / 1200, 'Listed on our copy', [
        ('On-device AI', 'Translations, Speech recognition,\nImage alt text in PDF viewer,\nTab group suggestions,\nKey points in link previews'),
        ('AI chatbot in the sidebar', 'Claude, ChatGPT, Gemini\nor Mistral Vibe'),
        ('Smart Window', 'Gets its own row only after it\nreaches your copy of Firefox'),
    ])
    cs.footer(fig, SOURCE)
    cs.save(fig, f'{OUT}/firefox-ai-controls-settings.webp')


def block_dialog():
    """Block AI enhancements 확인 창: 차단 목록의 Smart Window를 표시"""
    img = screen('block-confirm-dialog', (513, 310, 928, 736))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'What the Block AI enhancements switch covers',
              'The confirmation Firefox 159 shows when you turn the switch on.')
    ax, w = place(fig, img, 36, 0.115, 480)
    mark(ax, 27, 251, 157, 273)  # Smart Window 항목
    side_panel(fig, 0.03 + (w + 34) / 1200, 'What we saw', [
        ('Seven features, one click', 'Smart Window is on the list even\nthough its row wasn\'t shown on\nour AI controls page'),
        ('Extensions too', 'Only extensions that use AI\nprovided by Firefox'),
        ('Downloaded models removed', 'The AI controls page says on-device\nAI models already downloaded are\nremoved when a feature is blocked'),
    ])
    cs.footer(fig, SOURCE)
    cs.save(fig, f'{OUT}/firefox-block-ai-confirmation.webp')


def before_after():
    """같은 프랑스어 시험 페이지에서 차단 전후 오른쪽 클릭 메뉴와 사이드바 아이콘 비교"""
    menu_before = screen('before-context-menu', (503, 229, 763, 517))
    menu_after = screen('after-context-menu', (503, 229, 763, 472))
    bar_before = screen('before-sidebar', (0, 88, 41, 262))
    bar_after = screen('after-sidebar', (0, 88, 41, 262))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'What disappears after you block AI in Firefox',
              'Right-click menu on selected French text, and the sidebar icons, before and after the switch.')
    h = 390
    ax1, w1 = place(fig, menu_before, 60, 0.155, h)
    mark(ax1, 4, 186, 256, 230, lw=2.5)  # Translate Selection, Ask an AI Chatbot
    axs1, ws1 = place(fig, bar_before, 60 + w1 + 24, 0.155 + (h - 242) / 675, 242)
    mark(axs1, 3, 40, 38, 66, lw=2.5)  # 챗봇 아이콘
    x2 = 660
    ax2, w2 = place(fig, menu_after, x2, 0.155 + (h - h * menu_after.height / menu_before.height) / 675,
                    h * menu_after.height / menu_before.height)
    place(fig, bar_after, x2 + w2 + 24, 0.155 + (h - 242) / 675, 242)
    fig.text(60 / 1200, 0.155 + h / 675 + 0.025, 'Before', fontsize=16, fontweight='bold', color=cs.MUTED)
    fig.text(x2 / 1200, 0.155 + h / 675 + 0.025, 'After Block AI enhancements', fontsize=16, fontweight='bold', color=cs.ACCENT)
    fig.text(60 / 1200, 0.11, 'Translate Selection and Ask an AI Chatbot, plus the chatbot icon', fontsize=12, color=cs.MUTED)
    fig.text(x2 / 1200, 0.11, 'Both menu items and the chatbot icon are gone', fontsize=12, color=cs.MUTED)
    cs.footer(fig, SOURCE, 'Same test page both times. The Before sidebar is from a second new profile.')
    cs.save(fig, f'{OUT}/firefox-before-after-block.webp')


def translations_only():
    """번역만 Available로 되돌린 상태: 설정 행 + 번역은 돌아오고 챗봇은 없는 메뉴"""
    rows = screen('translations-available', (341, 672, 896, 960))
    menu = screen('selective-context-menu', (503, 229, 763, 494))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Keep one AI feature and block the rest',
              'After blocking everything, we set only Translations back to Available.')
    ax1, w1 = place(fig, rows, 36, 0.15, 360)
    mark(ax1, 410, 22, 542, 62)  # Translations: Available
    ax2, w2 = place(fig, menu, 36 + w1 + 44, 0.15, 360)
    mark(ax2, 4, 186, 256, 208, lw=2.5)  # Translate Selection to English
    fig.text(36 / 1200, 0.15 + 360 / 675 + 0.025, 'Settings > AI controls', fontsize=14, fontweight='bold', color=cs.MUTED)
    fig.text((36 + w1 + 44) / 1200, 0.15 + 360 / 675 + 0.025, 'Right-click menu', fontsize=14, fontweight='bold', color=cs.MUTED)
    cs.footer(fig, SOURCE + ' Ask an AI Chatbot stayed hidden.')
    cs.save(fig, f'{OUT}/firefox-keep-translations-block-rest.webp')


def quick_action():
    """주소창에 disable ai를 치면 나오는 Manage AI controls 빠른 동작"""
    img = screen('quick-action-disable-ai', (258, 42, 1219, 176))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'The shortcut: type "disable ai" in the address bar',
              'Firefox 159 offers a Manage AI controls button. Press Tab to select it, then Enter.')
    ax, w = place(fig, img, 50, 0.47, 1100 * img.height / img.width)
    mark(ax, 124, 92, 278, 122)
    fig.text(50 / 1200, 0.36, 'Firefox also lists this shortcut for "off ai" and "manage ai."', fontsize=15, color=cs.FOREGROUND)
    fig.text(50 / 1200, 0.30, 'It opens the same Settings > AI controls page.', fontsize=15, color=cs.FOREGROUND)
    cs.footer(fig, SOURCE)
    cs.save(fig, f'{OUT}/firefox-disable-ai-address-bar.webp')


def coverage():
    """차단 스위치가 끄는 것 vs 그대로 두는 것"""
    fig = plt.figure(figsize=cs.FIGSIZE)
    ax = fig.add_axes([0.03, 0.12, 0.94, 0.71])
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    cs.header(fig, 'What Block AI enhancements turns off, and what it leaves on',
              'Firefox 159 on a computer. Checked on a new profile on October 28, 2026.')
    cols = [
        (0.0, 'Turned off', cs.ACCENT, [
            'Translations (pages and selected text)',
            'Speech recognition',
            'Image alt text in the PDF viewer',
            'Tab group suggestions',
            'Key points in link previews',
            'Smart Window',
            'AI chatbot in the sidebar and right-click menu',
            'Extensions that use AI provided by Firefox',
        ]),
        (0.51, 'Left on', cs.MUTED, [
            'Search suggestions in the address bar',
            'Perplexity and other search engines',
            'AI built into websites, like Google AI Overviews',
            'Extensions that use their own AI service',
        ]),
    ]
    for x, title, color, items in cols:
        box(ax, x, 0.0, 0.49, 0.98, cs.SURFACE)
        ax.add_patch(FancyBboxPatch((x + 0.03, 0.865), 0.012, 0.06, boxstyle='round,pad=0,rounding_size=0.004',
                                    facecolor=color, edgecolor=color, zorder=2))
        ax.text(x + 0.055, 0.895, title, fontsize=17, fontweight='bold', va='center', color=color, zorder=2)
        for i, item in enumerate(items):
            ax.text(x + 0.035, 0.77 - i * 0.092, item, fontsize=13.5, va='center', zorder=2)
    cs.footer(fig, 'Sources: Firefox 159 AI controls page and confirmation dialog, and Settings > Search after blocking.',
              'Search engine AI is controlled by each search engine, not by Firefox.')
    cs.save(fig, f'{OUT}/firefox-ai-block-coverage.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    settings_page()
    block_dialog()
    before_after()
    translations_only()
    quick_action()
    coverage()
