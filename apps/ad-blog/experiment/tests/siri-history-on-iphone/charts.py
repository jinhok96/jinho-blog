"""iPhone Siri 기록 글 그래픽: 설명서 화면 캡처 + 기록이 있는 곳 표 + 지우기 버튼 문서 비교 + 보관 기간 (1200×675 webp).

내용 출처는 factcheck.md. 캡처 원본 `guide-siri-app-delete.png`는 shot.cjs로 찍은
iPhone User Guide "Siri AI: Use the Siri app on iPhone"의 "Delete Siri conversations" 절부터 끝까지
(1100px 폭, 2배율, 2026-10-27 16:0x UTC).
실행: python3 -I charts.py <출력 폴더>  (matplotlib·Pillow가 있는 python)
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


def guide_screenshot():
    """'Change Siri app settings' 절, Keep Conversations 항목과 Note(30일·1년이면 오래된 대화 영구 삭제)를 accent 상자로"""
    img = Image.open(HERE / 'guide-siri-app-delete.png').convert('RGB')
    img = img.crop((0, 697, img.width, 1600))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Apple\'s steps: Settings > Siri > Keep Conversations',
              'iPhone User Guide for iOS 27, "Siri AI: Use the Siri app on iPhone." Read October 27, 2026.')
    h_px = 470
    w_px = h_px * img.width / img.height
    left = (1200 - w_px) / 2
    ax = fig.add_axes([left / 1200, 0.115, w_px / 1200, h_px / 675])
    ax.imshow(img)
    ax.axis('off')
    # Keep Conversations 줄 + Note 줄 (원본 y 약 1342~1484 → 자른 뒤 645~787)
    ax.add_patch(Rectangle((128, 636), 1450, 160, fill=False, edgecolor=cs.ACCENT, lw=3, zorder=3))
    cs.footer(fig, 'Source: support.apple.com/guide/iphone/p7ny364ngxlj, captured in Chromium on October 27, 2026 (UTC). Box added by ToolProof.')
    cs.save(fig, f'{OUT}/apple-guide-siri-keep-conversations.webp')


# (어디, 무엇이 있나, 볼 수 있나, 지우는 법)
PLACES = [
    ('Siri app\n(Siri AI only)', 'Your Siri AI conversations,\nsynced through iCloud', 'Yes, in the\nSiri app', 'Touch and hold > Delete, or\nSettings > Siri > Keep Conversations'),
    ('Your iPhone\n(any Siri)', 'Transcripts of Siri and\nDictation requests', 'No list\nto browse', 'Settings > Siri > Siri & Dictation\nHistory, per Apple\'s privacy page'),
    ('Apple\'s servers', 'Transcripts under a random ID,\nup to 2 years. Audio only if\nyou opted in', 'No', 'Apple\'s iPhone pages don\'t say how.\nTo stop audio storage, turn off\nImprove Siri & Dictation'),
    ('ChatGPT\n(if signed in)', 'Requests Siri passed\nto ChatGPT', 'Yes, in your\nChatGPT history', 'Delete in ChatGPT. Not saved if\nyou aren\'t signed in'),
]


def places_table():
    fig, ax = canvas('Where your Siri history is kept on iPhone',
                     'Four places, and only two of them show you a list. iOS 27, from Apple\'s guides and privacy pages.')
    cols = [(0.0, 'Where'), (0.18, 'What\'s there'), (0.47, 'Can you see it?'), (0.65, 'How to delete it')]
    for x, c in cols:
        ax.text(x + 0.012, 0.975, c, fontsize=12.5, color=cs.ACCENT if c.startswith('How') else cs.MUTED,
                va='center', fontweight='semibold')
    rh = 0.225
    for i, (where, what, see, delete) in enumerate(PLACES):
        y = 0.82 - i * rh
        box(ax, 0.65, y - rh / 2 + 0.014, 0.35, rh - 0.028, cs.SURFACE)
        ax.text(0.012, y, where, fontsize=13, fontweight='bold', va='center', linespacing=1.3, zorder=2)
        ax.text(0.192, y, what, fontsize=11.5, va='center', linespacing=1.35, zorder=2)
        ax.text(0.482, y, see, fontsize=12, va='center', linespacing=1.3, zorder=2,
                color=cs.ACCENT if see.startswith('Yes') else cs.MUTED, fontweight='semibold')
        ax.text(0.662, y, delete, fontsize=11.2, va='center', linespacing=1.35, zorder=2)
        if i:
            ax.plot([0, 1], [y + rh / 2, y + rh / 2], color=cs.BORDER, lw=1, zorder=0)
    cs.footer(fig, 'Sources: Apple iPhone User Guide for iOS 27 (Siri app, ChatGPT), apple.com/legal/privacy Siri pages (September 14, 2026).')
    cs.save(fig, f'{OUT}/siri-history-where-it-is-kept.webp')


# (문서, 날짜·판, 말하는 것, 강조 여부)
DOCS = [
    ('Siri, Dictation & Privacy', 'apple.com, September 14, 2026',
     'Deletes "the transcripts\nof your Siri and Dictation\nrequests that are stored\non your device."\n\nPath: Settings > Siri >\nSiri & Dictation History', True),
    ('Mac User Guide', 'macOS Tahoe 26 and Sequoia 15',
     'Deletes "request history,\nboth audio recordings and\ntranscripts," tied to a\nrandom identifier and\n"less than six months old."\n\nNeeds an internet\nconnection', False),
    ('Mac User Guide', 'macOS 27',
     'No page for it. The\nold link opens the guide\'s\nfront page, and the page\'s\nversion list starts at\nmacOS Tahoe 26', False),
    ('iPhone User Guide', 'Siri settings page, iOS 27',
     'Doesn\'t mention Siri &\nDictation History. Its iOS 26\nand iOS 18 versions don\'t\neither', False),
]


def docs_card():
    fig, ax = canvas('What "Delete Siri & Dictation History" removes, by Apple page',
                     'Four Apple pages, read on October 27, 2026. Only one describes the iPhone button.')
    w = 0.235
    gap = (1 - 4 * w) / 3
    for i, (name, ver, says, accent) in enumerate(DOCS):
        x = i * (w + gap)
        box(ax, x, 0.1, w, 0.87, cs.BACKGROUND, edge=cs.ACCENT if accent else cs.BORDER, lw=2.5 if accent else 1.2)
        ax.text(x + 0.018, 0.9, name, fontsize=14, fontweight='bold', va='center', zorder=2)
        ax.text(x + 0.018, 0.82, ver, fontsize=10.5, color=cs.MUTED, va='center', zorder=2)
        ax.plot([x + 0.018, x + w - 0.018], [0.76, 0.76], color=cs.BORDER, lw=1, zorder=2)
        ax.text(x + 0.018, 0.71, says, fontsize=12, va='top', linespacing=1.45, zorder=2)
    cs.footer(fig, 'Sources: apple.com/legal/privacy/data/en/ask-siri-dictation, support.apple.com/guide/mac-help/mchlf55961c0,', 'support.apple.com/guide/iphone/iphc28624b81abc. Read in Chromium on October 27, 2026 (UTC).')
    cs.save(fig, f'{OUT}/delete-siri-dictation-history-apple-pages.webp')


# (이름, 길이(개월), 표시, 내가 정하는 것인지)
KEPT = [
    ('Apple Intelligence Report', 7 / 30, 'Last 15 minutes or 7 days of requests\nsent to Apple\'s servers', True),
    ('Siri app, Keep Conversations', 12, '30 days or 1 year, then older chats\nare permanently deleted (or another option)', True),
    ('Delete window on Mac', 6, 'Request history under 6 months old\n(macOS 26 guide)', False),
    ('Apple\'s request history', 24, 'Up to 2 years under a random ID,\nreviewed samples can stay longer', False),
]


def kept_chart():
    fig, ax = cs.figure()
    fig.subplots_adjust(left=0.27, right=0.97, top=0.8, bottom=0.2)
    ax.set_xlim(0, 30)
    ax.set_ylim(-0.6, len(KEPT) - 0.4)
    ax.set_xticks([0, 6, 12, 18, 24, 30])
    ax.set_xticklabels(['0', '6 months', '1 year', '18 months', '2 years', ''])
    ax.set_yticks(range(len(KEPT)))
    ax.set_yticklabels([k[0] for k in reversed(KEPT)], fontweight='semibold')
    for i, (name, months, label, mine) in enumerate(reversed(KEPT)):
        cs.rounded_barh(ax, i, 0, max(months, 0.25), 0.5, cs.ACCENT if mine else cs.MUTED)
        if months > 18:
            ax.text(1.2, i, label, fontsize=11.5, va='center', linespacing=1.3, color=cs.BACKGROUND, zorder=5)
        else:
            ax.text(max(months, 0.25) + 0.5, i, label, fontsize=11.5, va='center', linespacing=1.3)
    # 1년 막대 안쪽에 30일 지점 표시
    ax.plot([1, 1], [1.75, 2.25], color=cs.BACKGROUND, lw=2, zorder=4)
    cs.header(fig, 'How long Siri history can be kept',
              'Blue: limits you can choose on iPhone. Gray: Apple\'s side, as its pages describe it.')
    cs.footer(fig, 'Sources: Apple iPhone User Guide for iOS 27 (Siri app, Apple Intelligence and privacy), Mac User Guide for macOS 26,',
              'apple.com/legal/privacy Siri, Dictation & Privacy (September 14, 2026). Private Cloud Compute keeps no request data, per Apple.')
    cs.save(fig, f'{OUT}/siri-history-how-long-kept.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    guide_screenshot()
    places_table()
    docs_card()
    kept_chart()
