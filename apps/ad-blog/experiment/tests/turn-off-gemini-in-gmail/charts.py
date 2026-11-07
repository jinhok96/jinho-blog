"""Gmail Gemini 끄기: 설정 3개 대응표 + 계정별 기능 표 + 플랫폼별 메뉴 경로 + Chrome 156 캡처 자르기 (1200×675 webp).

내용 출처는 factcheck.md (Gmail 도움말 15604322·16831098·16561387·16789526·16845247·16887555, 2026-10-22 확인).
실행: python3 -I charts.py <출력 폴더>
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch  # noqa: E402
from PIL import Image  # noqa: E402

HERE = Path(__file__).resolve().parent
OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'
SOURCE = 'Source: Google Gmail Help, "Learn about smart features & controls" and Gemini feature pages, checked October 22, 2026'


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


# (설정 이름, 메뉴 위치, 끄면 사라지는 것, Gemini 포함 여부)
SWITCHES = [
    ('Smart features in\nGoogle Workspace', 'Manage Workspace smart\nfeature settings',
     'Gemini side panel, Help me write, email summaries,\nAI Overview in search, Gmail events in Calendar', True),
    ('Smart features in\nGmail, Chat, and Meet', 'General tab checkbox',
     'Inbox tabs (Primary, Social, Promotions), Smart Compose,\nSmart Reply, summary cards for trips and packages', False),
    ('Smart features in\nother Google products', 'Manage Workspace smart\nfeature settings',
     'Personal Intelligence in the Gemini app and Search,\nMaps reservations, Wallet pass suggestions', False),
]


def three_switches():
    fig, ax = canvas('Gmail has three smart feature switches',
                     'The Google Workspace switch is the one that removes Gemini. The other two turn off older features.')
    for x, c in [(0.015, 'Setting'), (0.30, 'Where it is'), (0.52, 'What turns off')]:
        ax.text(x, 0.95, c, fontsize=13, color=cs.MUTED, va='center', fontweight='semibold')
    rh = 0.29
    for i, (name, where, effect, hi) in enumerate(SWITCHES):
        y = 0.75 - i * rh
        if hi:
            box(ax, 0.0, y - rh / 2 + 0.015, 1.0, rh - 0.03, cs.SURFACE)
        ax.text(0.015, y, name, fontsize=15, fontweight='bold', va='center', linespacing=1.35, zorder=2,
                color=cs.ACCENT if hi else cs.FOREGROUND)
        ax.text(0.30, y, where, fontsize=12.5, va='center', linespacing=1.4, zorder=2, color=cs.MUTED)
        ax.text(0.52, y, effect, fontsize=13, va='center', linespacing=1.5, zorder=2,
                fontweight='semibold' if hi else 'normal')
        if i < len(SWITCHES) - 1 and not hi:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1)
    cs.footer(fig, SOURCE)
    cs.save(fig, f'{OUT}/gmail-smart-feature-switches.webp')


# (기능, 무료 개인 계정, Google AI 요금제·Workspace)
FEATURES = [
    ('AI Overview email summaries', 'Yes, worldwide', 'Yes'),
    ('Help me write', 'Yes, US only', 'Yes'),
    ('Suggested Replies', 'Yes, US and English only', 'Yes'),
    ('AI Overview in Gmail search', 'No', 'Yes, English only'),
    ('AI Inbox', 'No', 'Yes, US and English only'),
    ('Proofread', 'No', 'Yes, on the web'),
    ('Gemini side panel (Ask Gemini)', 'No', 'Yes'),
]


def features_by_account():
    fig, ax = canvas('Which Gemini features appear in your Gmail',
                     'A free personal account in the US already has three of them. All need the Workspace smart features switch on.')
    cols = [(0.56, 'Free personal account'), (0.84, 'Google AI plan or\nWorkspace plan')]
    for x, c in cols:
        ax.text(x, 0.95, c, fontsize=13, color=cs.MUTED, ha='center', va='center', fontweight='semibold', linespacing=1.3)
    rh = 0.125
    for i, (name, free, paid) in enumerate(FEATURES):
        y = 0.80 - i * rh
        on_free = free.startswith('Yes')
        if on_free:
            box(ax, 0.0, y - rh / 2 + 0.008, 1.0, rh - 0.016, cs.SURFACE)
        ax.text(0.015, y, name, fontsize=15, fontweight='bold', va='center', zorder=2)
        ax.text(0.56, y, free, fontsize=13.5, ha='center', va='center', zorder=2,
                color=cs.ACCENT if on_free else cs.MUTED, fontweight='bold' if on_free else 'normal')
        ax.text(0.84, y, paid, fontsize=13.5, ha='center', va='center', zorder=2)
        if i < len(FEATURES) - 1 and not on_free and not FEATURES[i + 1][1].startswith('Yes'):
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1)
    cs.footer(fig, 'Google AI plans: Google AI Plus, Pro, or Ultra. Availability as of October 22, 2026.', SOURCE)
    cs.save(fig, f'{OUT}/gmail-gemini-features-by-account.webp')


# (기기, 메뉴 단계)
PATHS = [
    ('Computer', ['Settings (gear)', 'See all settings', 'General tab', 'Manage Workspace\nsmart feature settings']),
    ('Android', ['Menu', 'Settings', 'Your account', 'Google Workspace\nsmart features']),
    ('iPhone or iPad', ['Menu', 'Settings', 'Data privacy', 'Google Workspace\nsmart features']),
]


def menu_paths():
    fig, ax = canvas('Where to find the Gemini switch in Gmail',
                     'Then turn off "Smart features in Google Workspace" and save. The change applies to every device you use.')
    rh = 0.31
    bw, gap, x0 = 0.175, 0.03, 0.2
    for i, (device, steps) in enumerate(PATHS):
        y = 0.80 - i * rh
        ax.text(0.0, y, device, fontsize=16, fontweight='bold', va='center')
        for j, step in enumerate(steps):
            x = x0 + j * (bw + gap)
            last = j == len(steps) - 1
            box(ax, x, y - 0.09, bw, 0.18, cs.ACCENT if last else cs.SURFACE)
            ax.text(x + bw / 2, y, step, fontsize=12.5, ha='center', va='center', zorder=2, linespacing=1.3,
                    color=cs.BACKGROUND if last else cs.FOREGROUND, fontweight='bold' if last else 'semibold')
            if not last:
                ax.annotate('', xy=(x + bw + gap - 0.004, y), xytext=(x + bw + 0.004, y),
                            arrowprops=dict(arrowstyle='-|>', color=cs.MUTED, lw=1.5), zorder=2)
    cs.footer(fig, 'Menu names from Google Gmail Help for each platform, checked October 22, 2026.')
    cs.save(fig, f'{OUT}/gmail-gemini-switch-menu-path.webp')


def chrome_screenshot():
    # 컨테이너 정책 때문에 생긴 "managed" 안내는 잘라내고 AI innovations 목록만 남김
    raw = Image.open(HERE / 'chrome-156-ai-innovations-raw.png').convert('RGB')
    crop = raw.crop((320, 300, 1030, 570))
    canvas_img = Image.new('RGB', (1200, 675), cs.SURFACE)
    scale = 1160 / crop.width
    crop = crop.resize((1160, int(crop.height * scale)), Image.LANCZOS)
    canvas_img.paste(crop, (20, (675 - crop.height) // 2))
    out = Path(OUT) / 'chrome-156-ai-innovations-settings.webp'
    canvas_img.save(out, 'WEBP', quality=90)
    print(out, canvas_img.size)


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    three_switches()
    features_by_account()
    menu_paths()
    chrome_screenshot()
