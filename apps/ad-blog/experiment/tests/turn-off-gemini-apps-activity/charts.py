"""Gemini History(옛 Gemini Apps Activity·Keep Activity) 끄기 글 그래픽: 도움말 화면 캡처 + 켜짐/꺼짐 기능 표 + 보관 기간 (1200×675 webp).

내용 출처는 factcheck.md. 캡처 원본 `help-13278892-turn-off-history.png`는 shot.cjs로 찍은
support.google.com/gemini/answer/13278892 (Computer) 화면 (1100px 폭, 2배율, 2026-11-21 UTC,
`node shot.cjs <url> help-13278892-turn-off-history.png "Turn off History" "When History is off"`).
2026-10-26판(`help-13278892-turn-off.png`, Keep Activity·72시간)은 기록으로 남김. 2026-11-22 세션 102: History 개명 반영.
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
    """'Turn off History' 단계 부분만 (좌우 회색 테두리와 아래 'When History is off' 단락 제외), 3단계를 accent 상자로"""
    img = Image.open(HERE / 'help-13278892-turn-off-history.png').convert('RGB')
    img = img.crop((40, 0, 1485, 622))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Google\'s steps: Settings > History > On > Turn off',
              'Gemini Apps Help, "Manage & delete your history in Gemini Apps" (Computer), November 21, 2026.')
    h_px = 470
    w_px = h_px * img.width / img.height
    left = (1200 - w_px) / 2
    ax = fig.add_axes([left / 1200, 0.115, w_px / 1200, h_px / 675])
    ax.imshow(img)
    ax.axis('off')
    # 3단계 'Near the top, click On > Turn off or Turn off and delete history.' (자른 뒤 기준 약 x 123~1132, y 378~422)
    ax.add_patch(Rectangle((106, 368), 1050, 62, fill=False, edgecolor=cs.ACCENT, lw=3, zorder=3))
    cs.footer(fig, 'Source: support.google.com/gemini/answer/13278892, captured in Chromium on November 21, 2026. Box added by ToolProof.')
    cs.save(fig, f'{OUT}/google-help-turn-off-gemini-history.webp')


# (기능, 켜짐, 꺼짐, 도움말 문서) — 2026-11-21 UTC 재확인판 (factcheck.md '2026-11-22 재확인')
ROWS = [
    ('Recent chats list', 'New chats saved; search,\npin and rename work', 'New chats not saved; list\nfeatures need it on', '13666746'),
    ('Memory and\nPersonal Intelligence', 'Available if you\'re eligible', 'Not available', '16598469\n16598406'),
    ('Tasks', 'Available', 'Not available', '13594961'),
    ('Skills', 'Work with every app\nyou connected', 'Work, but can\'t reach\nCalendar, Drive or other\nConnected Apps', '17094296'),
    ('Connected Apps', 'Every app you connected', 'Android: only Phone, Messages,\nWhatsApp, Device assistance.\nWeb, iPhone, watch: none', '13695044'),
    ('Maps, Flights, Hotels,\nYouTube info', 'Used in answers', 'Not used (Google Search\nstill is)', '13695044'),
    ('Training Google\'s AI', 'Only if "Chat content" is\nchecked (on by default)', 'Not used, unless you\nsend feedback', '13278892\n13594961'),
]


def on_off_table():
    fig, ax = canvas('What changes when Gemini History is off',
                     'History replaces the Keep Activity switch, once called Gemini Apps Activity. Each row comes from a Google help page.')
    cols = [(0.0, 'Feature'), (0.25, 'History on'), (0.53, 'History off'), (0.875, 'Google page')]
    for x, c in cols:
        ax.text(x + 0.012, 0.985, c, fontsize=12.5, color=cs.ACCENT if c.endswith('off') else cs.MUTED,
                va='center', fontweight='semibold')
    rh = 0.137
    for i, (feat, on, off, src) in enumerate(ROWS):
        y = 0.88 - i * rh
        box(ax, 0.53, y - rh / 2 + 0.008, 0.335, rh - 0.016, cs.SURFACE)
        ax.text(0.012, y, feat, fontsize=12.5, fontweight='bold', va='center', linespacing=1.3, zorder=2)
        ax.text(0.262, y, on, fontsize=11.5, va='center', linespacing=1.35, zorder=2, color=cs.MUTED)
        three = off.count('\n') >= 2
        ax.text(0.542, y, off, fontsize=10.8 if three else 11.5, va='center', linespacing=1.2 if three else 1.35, zorder=2)
        ax.text(0.887, y, src, fontsize=11, va='center', linespacing=1.3, zorder=2, color=cs.MUTED)
        if i < len(ROWS) - 1:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1, zorder=0)
    cs.footer(fig, 'Sources: support.google.com/gemini/answer/ + the page number, opened November 21, 2026. One Google page (13278892) also lists',
              'Gemini Notebook as available with History off; the Connected Apps page (13695044) does not.')
    cs.save(fig, f'{OUT}/gemini-history-on-vs-off.webp')


# (기간, 무엇, 설명, 강조)
CARDS = [
    ('About 2 months', 'History off', 'Each new chat stays with\nyour account, out of view,\nso Gemini can reply and\nGoogle can protect the\nservice.', True),
    ('18 months', 'History on', 'Default auto-delete. You\ncan change it to 3 or 36\nmonths, or keep chats\nuntil you delete them.', False),
    ('Up to 3 years', 'Chats a reviewer read', 'Cut off from your\naccount. Deleting your\nhistory doesn\'t remove\nthem.', False),
    ('Up to 3 years', 'Feedback you send', 'Includes your last 24\nhours of chats, even with\nHistory off.', False),
]


def retention_cards():
    fig, ax = canvas('How long Google keeps your Gemini chats',
                     'Since Google\'s November 2026 update, History off keeps new chats for about two months instead of 72 hours.')
    n = len(CARDS)
    gap = 0.025
    w = (1 - gap * (n - 1)) / n
    for i, (period, what, desc, hi) in enumerate(CARDS):
        x = i * (w + gap)
        box(ax, x, 0.04, w, 0.9, cs.SURFACE, edge=cs.ACCENT if hi else cs.BORDER, lw=2.5 if hi else 1)
        ax.text(x + 0.022, 0.83, what, fontsize=13, color=cs.MUTED, fontweight='semibold', va='center', zorder=2)
        ax.text(x + 0.022, 0.69, period, fontsize=22 if len(period) <= 13 else 19, fontweight='bold', va='center', zorder=2,
                color=cs.ACCENT if hi else cs.FOREGROUND)
        ax.text(x + 0.022, 0.56, desc, fontsize=12.5, va='top', linespacing=1.55, zorder=2)
    cs.footer(fig, 'Sources: Gemini Apps Privacy Hub (support.google.com/gemini/answer/13594961, last updated November 19, 2026) and',
              'support.google.com/gemini/answer/13278892, opened November 21, 2026. Google says "around" two months and "up to" 3 years.')
    cs.save(fig, f'{OUT}/gemini-chat-retention-periods.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    help_screenshot()
    on_off_table()
    retention_cards()
