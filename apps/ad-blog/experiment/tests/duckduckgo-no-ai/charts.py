"""DuckDuckGo AI 끄기 글 그래픽: 화면 캡처(주석) 5장 (1200×675 webp).

캡처 원본은 `screens/*.webp` (DuckDuckGo 웹: Playwright 일반 headless Chromium 153.0.8010.12, 새 프로필·로그인 없음,
1280×900 1배율, 2026-11-01 UTC. Chrome 화면은 같은 버전의 Chromium 설정 페이지). 조작 순서는 capture-notes.md,
내용 출처는 factcheck.md.
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
SOURCE = 'Screenshots: duckduckgo.com in a new browser profile with no account, November 1, 2026. Boxes added by ToolProof.'


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
    """Search Settings > AI Features 기본 화면 + 오른쪽에 설정별 기본값과 하는 일"""
    img = screen('02-settings-ai-default', (93, 100, 752, 712))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'DuckDuckGo has four AI settings on one tab',
              'Search Settings > AI Features on duckduckgo.com. These are the defaults in a new browser profile.')
    ax, w = place(fig, img, 36, 0.115, 480)
    frame(ax, img)
    mark(ax, 4, 66, 655, 150)  # Duck.ai
    mark(ax, 4, 172, 655, 380)  # Search Assist + Explore More
    mark(ax, 4, 398, 655, 476)  # Hide AI-Generated Images
    side_panel(fig, 0.03 + (w + 30) / 1200, 'Default in a new profile', [
        ('Duck.ai: On', 'Off hid the AI buttons on the homepage'),
        ('Search Assist: Sometimes', 'AI answers in search results'),
        ('Explore More: Sometimes', 'AI follow-up questions'),
        ('Hide AI-Generated Images: Off', 'Filters known AI image sites'),
    ])
    cs.footer(fig, SOURCE, 'Changes apply after you click Save and Exit.')
    cs.save(fig, f'{OUT}/duckduckgo-ai-features-settings.webp')


def home_before_after():
    """홈 위쪽: 기본 / Duck.ai 끔 / noai.duckduckgo.com (픽셀 좌표로 위에서부터 배치)"""
    crop = (40, 18, 1240, 150)
    default = screen('01-home-default', crop)
    off = screen('04-home-duckai-off', crop)
    noai = screen('11-noai-home', (320, 352, 960, 476))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'The Duck.ai switch clears the AI buttons from the homepage',
              'Top of the DuckDuckGo homepage in three states, same browser window size.')
    top = 130  # 위에서부터 픽셀
    w = 1000
    h = w * default.height / default.width

    def row(label, color, img, height, y_px, x_px=36):
        fig.text(x_px / 1200, 1 - (y_px + 18) / 675, label, fontsize=14, fontweight='bold', color=color)
        ax, ww = place(fig, img, x_px, 1 - (y_px + 26 + height) / 675, height)
        frame(ax, img)
        return ax, y_px + 26 + height + 16

    ax1, y = row('Default duckduckgo.com', cs.MUTED, default, h, top)
    mark(ax1, 718, 22, 916, 60, lw=2.5)  # Search / Ask AI 토글
    mark(ax1, 1040, 26, 1132, 56, lw=2.5)  # Duck.ai 버튼
    mark(ax1, 300, 70, 700, 96, lw=2.5)  # OPTIONAL 안내
    ax2, y = row('After turning off Duck.ai in Search Settings', cs.ACCENT, off, h, y)
    row('noai.duckduckgo.com, nothing changed', cs.ACCENT, noai, 96, y)
    fig.text(560 / 1200, 1 - (y + 70) / 675,
             'Turning off Duck.ai also removed the AI Settings\nbutton at the bottom right of the homepage.',
             fontsize=12.5, va='center', linespacing=1.4)
    cs.footer(fig, SOURCE)
    cs.save(fig, f'{OUT}/duckduckgo-homepage-ai-buttons.webp')


def homepage_panel():
    """홈 AI Settings 버튼의 창: Search Only는 Ask AI 토글만 숨김"""
    panel = screen('12-homepage-panel-search-only', (365, 133, 915, 767))
    after = screen('13-home-after-search-only', (40, 18, 1240, 100))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Search Only hides one toggle, not Duck.ai',
              'The AI Settings button on the homepage opens this panel. We picked Search Only and clicked Apply.')
    ax, w = place(fig, panel, 36, 0.115, 470)
    frame(ax, panel)
    mark(ax, 275, 205, 530, 309)  # Search Only
    x2 = 36 + w + 34
    fig.text(x2 / 1200, 0.765, 'Homepage after Apply', fontsize=14, fontweight='bold', color=cs.ACCENT)
    hb = (1200 - x2 - 30) * after.height / after.width
    axa, wa = place(fig, after, x2, 0.73 - hb / 675, hb)
    frame(axa, after)
    mark(axa, 1040, 22, 1132, 56, lw=2)  # Duck.ai 버튼 남음
    notes = [
        ('Gone', 'The Search / Ask AI toggle in the search box'),
        ('Still there', 'The Duck.ai button and the AI Settings button'),
        ('Unchanged', 'Duck.ai, Search Assist and Explore More in\nSearch Settings stayed at their defaults'),
    ]
    yy = 0.73 - hb / 675 - 0.07
    for head, body in notes:
        fig.text(x2 / 1200, yy, head, fontsize=13.5, fontweight='bold', va='top')
        fig.text(x2 / 1200, yy - 0.04, body, fontsize=12.5, va='top', linespacing=1.35)
        yy -= 0.1 + 0.035 * body.count('\n')
    cs.footer(fig, SOURCE, 'The panel says clearing cookies or browser storage may reset it.')
    cs.save(fig, f'{OUT}/duckduckgo-homepage-search-only.webp')


def cookie_warning():
    """Search Assist를 Never로 바꾸면 뜨는 경고 + 쿠키를 지운 새 프로필에서 기본값으로 돌아감"""
    modal = screen('noai-modal-search-assist-never', (474, 310, 806, 590))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'DuckDuckGo warns that clearing cookies resets your AI settings',
              'This box appeared when we set Search Assist to Never in Search Settings > AI Features.')
    h = 420
    ax, w = place(fig, modal, 36, 0.13, h)
    frame(ax, modal)
    mark(ax, 20, 128, 312, 222)  # 경고 문구
    side_panel(fig, 0.03 + (w + 34) / 1200, 'What we saw', [
        ('Where the settings live', 'One cookie on duckduckgo.com per\nchanged setting, each set to last a year'),
        ('After clearing cookies', 'A fresh profile showed Ask AI again and\nall four AI settings back at default'),
        ('Install Now button', 'Links to the DuckDuckGo No-AI Search\nextension in the Chrome Web Store'),
    ])
    cs.footer(fig, SOURCE, 'A new private window starts without your saved cookies, so it shows the defaults too.')
    cs.save(fig, f'{OUT}/duckduckgo-cookie-reset-warning.webp')


def chrome_default():
    """Chrome 설정 Site search에 noai 추가 → Make default"""
    dlg = screen('chrome-add-site-search', (384, 322, 896, 678))
    row = screen('chrome-made-default', (360, 440, 1020, 670))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Chrome can search noai.duckduckgo.com by default',
              'Settings > Search engine > Manage search engines and site search, then Add under Site search.')
    fig.text(36 / 1200, 0.765, '1. Add site search', fontsize=14, fontweight='bold', color=cs.MUTED)
    ax1, w1 = place(fig, dlg, 36, 0.13, 420)
    frame(ax1, dlg)
    mark(ax1, 18, 230, 494, 270, lw=2.5)  # URL 칸
    x2 = 36 + w1 + 34
    fig.text(x2 / 1200, 0.765, '2. More (three dots) > Make default', fontsize=14, fontweight='bold', color=cs.MUTED)
    h2 = (1200 - x2 - 30) * row.height / row.width
    ax2, w2 = place(fig, row, x2, 0.73 - h2 / 675, h2)
    frame(ax2, row)
    mark(ax2, 10, 180, 650, 228, lw=2.5)  # DuckDuckGo No AI (Default)
    fig.text(x2 / 1200, 0.73 - h2 / 675 - 0.06,
             'Type in the address bar as usual. Searches now go to\nnoai.duckduckgo.com, which has no AI settings to lose.',
             fontsize=12.5, va='top', linespacing=1.4)
    cs.footer(fig, 'Screenshots: Chromium 153 settings, the open-source base of Google Chrome, November 1, 2026. Boxes added by ToolProof.',
              'Google\'s Chrome help page gives the same steps for Chrome on a computer.')
    cs.save(fig, f'{OUT}/chrome-noai-default-search.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    settings_page()
    home_before_after()
    homepage_panel()
    cookie_warning()
    chrome_default()
