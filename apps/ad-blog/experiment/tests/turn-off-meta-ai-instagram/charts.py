"""Instagram Meta AI 끄기: 도움말 검색 캡처 + 끌 수 있는 범위 + 메뉴 경로 + 삭제 vs 초기화 (1200×675 webp).

내용 출처는 factcheck.md (Instagram·Facebook·WhatsApp 도움말, Meta Privacy Center·Newsroom, 2026-10-24 UTC 확인).
캡처 원본 `ig-search-page.png`는 shot.cjs로 찍은 help.instagram.com 검색 화면 (1100×900, 2배율).
실행: python3 -I charts.py <출력 폴더>
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch  # noqa: E402
from PIL import Image, ImageDraw  # noqa: E402

HERE = Path(__file__).resolve().parent
OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'
SOURCE = 'Source: Instagram Help Center and Meta Privacy Center, checked October 24, 2026'


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


def help_search_screenshot():
    """검색창 + Meta AI 지원 도우미 답 + 첫 결과만 잘라 답 상자에 accent 테두리"""
    img = Image.open(HERE / 'ig-search-page.png').convert('RGB')
    # 2200×1800 원본 기준: 왼쪽 열(검색창·답·결과), 로고 줄과 오른쪽 채팅 창 제외
    crop = img.crop((40, 205, 1450, 1035))
    draw = ImageDraw.Draw(crop)
    # 답 상자(원본 약 x 48~1436, y 408~792)를 accent로 표시
    draw.rounded_rectangle((8, 198, 1400, 590), radius=28, outline=cs.ACCENT, width=6)
    w = 1200
    crop = crop.resize((w, round(crop.height * w / crop.width)), Image.LANCZOS)
    path = f'{OUT}/instagram-help-search-turn-off-meta-ai.webp'
    crop.save(path, 'WEBP', quality=90)
    print(path, crop.size)


# (묶음 제목, 색, 본문)
GROUPS = [
    ('Has an off switch', cs.ACCENT,
     'AI images of you (Imagine yourself), seeing those images in Feed,\nAI translations on Reels, Meta AI apps reusing your public reels\' audio'),
    ('Can be reset or deleted, not turned off', cs.FOREGROUND,
     'Meta AI\'s saved copy of your chats (/reset-ai and /reset-all-ais),\nthe Meta AI chat in your inbox, single messages others could share with it'),
    ('No off switch', cs.MUTED,
     'Meta AI in the Explore and inbox search bar, Meta AI in the Compose list,\n@Meta AI in group chats, Edit with Meta AI, use of AI chats for ads'),
]


def what_you_can_turn_off():
    fig, ax = canvas('How much of Meta AI you can turn off on Instagram',
                     'Instagram has no single Meta AI switch. A few features have their own toggle; most can only be avoided.')
    rh = 0.32
    for i, (title, color, body) in enumerate(GROUPS):
        y = 0.84 - i * rh
        box(ax, 0.0, y - rh / 2 + 0.02, 0.012, rh - 0.04, color)
        ax.text(0.035, y + 0.085, title, fontsize=16, fontweight='bold', va='center',
                color=color if color != cs.MUTED else cs.FOREGROUND)
        ax.text(0.035, y - 0.04, body, fontsize=13, va='center', linespacing=1.5)
    cs.footer(fig, 'AI images of you are being introduced gradually in the United States. Since December 16, 2025, Meta uses AI chats to personalize ads.',
              SOURCE + ' and Meta Newsroom (October 1, 2025)')
    cs.save(fig, f'{OUT}/meta-ai-instagram-what-you-can-turn-off.webp')


# (할 일, 메뉴 단계)
PATHS = [
    ('Make Meta AI\nforget a chat', ['Meta AI chat', 'Type /reset-ai', 'Send']),
    ('Delete the\nMeta AI chat', ['Messages', 'Tap and hold\nthe Meta AI chat', 'Delete', 'Delete']),
    ('AI images\nof you', ['Meta AI chat', 'AI info', 'Imagine yourself', 'Create AI images\nof yourself off']),
    ('AI images\nin Feed', ['Meta AI chat', 'AI info', 'Imagine yourself', 'See AI images of\nyourself in Feed off']),
    ('Reel\ntranslations', ['Translated reel', 'View translations', 'Original language']),
    ('Audio reuse\non Meta AI', ['Profile', 'Menu', 'Sharing and reuse', 'Reels off']),
]


def menu_paths():
    fig, ax = canvas('Where each Meta AI control is on Instagram',
                     'Steps from Instagram\'s iPhone help pages. Reset Meta AI first, then delete the chat: deleting alone only clears your inbox.')
    rh = 0.163
    bw, gap, x0 = 0.175, 0.025, 0.18
    for i, (feature, steps) in enumerate(PATHS):
        y = 0.92 - i * rh
        ax.text(0.0, y, feature, fontsize=13, fontweight='bold', va='center', linespacing=1.2)
        for j, step in enumerate(steps):
            x = x0 + j * (bw + gap)
            last = j == len(steps) - 1
            box(ax, x, y - 0.06, bw, 0.12, cs.ACCENT if last else cs.SURFACE)
            ax.text(x + bw / 2, y, step, fontsize=11, ha='center', va='center', zorder=2, linespacing=1.15,
                    color=cs.BACKGROUND if last else cs.FOREGROUND, fontweight='bold' if last else 'semibold')
            if not last:
                ax.annotate('', xy=(x + bw + gap - 0.003, y), xytext=(x + bw + 0.003, y),
                            arrowprops=dict(arrowstyle='-|>', color=cs.MUTED, lw=1.4), zorder=2)
    cs.footer(fig, 'Reel translations can also be switched off with Don\'t translate in the reel\'s three-dot menu, under audio and language (Meta Newsroom).',
              SOURCE)
    cs.save(fig, f'{OUT}/meta-ai-instagram-menu-paths.webp')


# (항목, 채팅 삭제, /reset-ai, /reset-all-ais)
ACTIONS = [
    ('Removes the chat\nfrom your inbox', 'Yes', 'No', 'No'),
    ('Deletes Meta AI\'s copy\nof your messages', 'No', 'Yes, this chat', 'Yes, every AI chat\non Instagram'),
    ('Deletes details\nMeta AI saved about you', 'No', 'Yes, from this chat', 'Yes, including\ngroup chats'),
    ('Works on', 'Your own inbox only', 'Instagram, Messenger,\nWhatsApp', 'Instagram, Messenger,\nWhatsApp'),
]


def delete_vs_reset():
    fig, ax = canvas('Deleting the Meta AI chat vs. resetting Meta AI',
                     'Meta says deleting a chat only clears it from your view. The reset commands delete Meta AI\'s own copy.')
    cols = [(0.31, 'Delete chat'), (0.53, 'Type /reset-ai'), (0.77, 'Type /reset-all-ais')]
    for x, c in cols:
        ax.text(x, 0.95, c, fontsize=14, va='center', fontweight='bold', color=cs.MUTED if x < 0.4 else cs.ACCENT)
    rh = 0.215
    for i, (row, a, b, c) in enumerate(ACTIONS):
        y = 0.77 - i * rh
        ax.text(0.0, y, row, fontsize=13.5, fontweight='bold', va='center', linespacing=1.35)
        for x, v in [(0.31, a), (0.53, b), (0.77, c)]:
            no = v == 'No'
            ax.text(x, y, v, fontsize=13, va='center', linespacing=1.35,
                    color=cs.MUTED if no else cs.FOREGROUND, fontweight='normal' if no else 'semibold')
        if i < len(ACTIONS) - 1:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1)
    cs.footer(fig, 'After a reset you still see your copy of the chat, but Meta AI no longer remembers it. Then delete the chat to clear it from your inbox.',
              'Source: Meta Privacy Center page on changing or deleting your information from chats with AIs, checked October 24, 2026')
    cs.save(fig, f'{OUT}/meta-ai-delete-chat-vs-reset.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    help_search_screenshot()
    what_you_can_turn_off()
    menu_paths()
    delete_vs_reset()
