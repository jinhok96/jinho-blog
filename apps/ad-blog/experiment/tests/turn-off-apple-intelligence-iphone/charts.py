"""iPhone Apple Intelligence 끄기: iOS 26 vs 27 비교 + iOS 27 메뉴 경로 + 끌 수 있는 범위 + iPhone·iPad·Mac 비교 (1200×675 webp).

내용 출처는 factcheck.md (Apple iPhone·iPad·Mac User Guide, Apple Support 121115, 2026-10-23 UTC 확인).
실행: python3 -I charts.py <출력 폴더>
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'
SOURCE = 'Source: Apple iPhone User Guide for iOS 27 and iOS 26, "Turn off and restrict access to Apple Intelligence features", checked October 23, 2026'


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


# (항목, iOS 26, iOS 27)
VERSIONS = [
    ('One switch for all of\nApple Intelligence', 'Yes: Settings > Apple\nIntelligence & Siri', 'No'),
    ('How you turn it off', 'One button', 'One feature at a time'),
    ('How it arrives', 'You turn it on', 'On automatically after\nthe iOS 27 update'),
    ('Screen Time blocks', 'Writing Tools, Image Creation,\nIntelligence Extensions', 'Siri AI or Siri Classic, plus\nSiri AI abilities like Image Creation'),
]


def ios26_vs_ios27():
    fig, ax = canvas('Turning off Apple Intelligence: iOS 26 vs. iOS 27',
                     "Apple's iOS 26 guide has one Apple Intelligence switch. The iOS 27 guide lists a switch for each feature instead.")
    for x, c in [(0.36, 'iOS 26'), (0.68, 'iOS 27')]:
        ax.text(x, 0.95, c, fontsize=15, color=cs.MUTED if x < 0.5 else cs.ACCENT, va='center', fontweight='bold')
    rh = 0.215
    for i, (row, a, b) in enumerate(VERSIONS):
        y = 0.77 - i * rh
        ax.text(0.015, y, row, fontsize=14, fontweight='bold', va='center', linespacing=1.35)
        ax.text(0.36, y, a, fontsize=13.5, va='center', linespacing=1.4, color=cs.MUTED)
        ax.text(0.68, y, b, fontsize=13.5, va='center', linespacing=1.4, fontweight='semibold')
        if i < len(VERSIONS) - 1:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1)
    cs.footer(fig, 'Supported iPhones: iPhone 15 Pro, iPhone 15 Pro Max, iPhone 16 models and later. Apple Support "Get started with the next generation of Apple Intelligence".', SOURCE)
    cs.save(fig, f'{OUT}/apple-intelligence-ios-26-vs-ios-27.webp')


# (기능, 메뉴 단계)
PATHS = [
    ('Siri AI', ['Siri', 'Turn Off Siri', 'Turn on Siri', 'Siri Classic']),
    ('Message summaries', ['Apps', 'Messages', 'Summarize\nMessages off']),
    ('Email summaries', ['Apps', 'Mail', 'Summarize Message\nPreviews off']),
    ('Notification\nsummaries', ['Notifications', 'Summarize\nNotifications', 'Summarize\nNotifications off']),
    ('Priority\nnotifications', ['Notifications', 'Prioritize\nNotifications', 'Prioritize\nNotifications off']),
    ('Smart Replies\nin Mail', ['Apps', 'Mail', 'Personalize\nSmart Replies off']),
    ('Voicemail\nsuggestions', ['Apps', 'Phone', 'Suggestions in\nVoicemail off']),
    ('ChatGPT', ['Siri', 'ChatGPT', 'Use ChatGPT off']),
]


def menu_paths():
    fig, ax = canvas('Where each Apple Intelligence switch is on iPhone (iOS 27)',
                     'Every path starts in the Settings app. With Siri AI, ChatGPT is under Siri > Extensions > ChatGPT > Use Extension.')
    rh = 0.124
    bw, gap, x0 = 0.18, 0.025, 0.2
    for i, (feature, steps) in enumerate(PATHS):
        y = 0.94 - i * rh
        ax.text(0.0, y, feature, fontsize=13, fontweight='bold', va='center', linespacing=1.2)
        for j, step in enumerate(steps):
            x = x0 + j * (bw + gap)
            last = j == len(steps) - 1
            box(ax, x, y - 0.052, bw, 0.104, cs.ACCENT if last else cs.SURFACE)
            ax.text(x + bw / 2, y, step, fontsize=11, ha='center', va='center', zorder=2, linespacing=1.15,
                    color=cs.BACKGROUND if last else cs.FOREGROUND, fontweight='bold' if last else 'semibold')
            if not last:
                ax.annotate('', xy=(x + bw + gap - 0.003, y), xytext=(x + bw + 0.003, y),
                            arrowprops=dict(arrowstyle='-|>', color=cs.MUTED, lw=1.4), zorder=2)
    cs.footer(fig, 'Siri AI: turning off Siri, then turning it back on with Siri Classic, keeps Siri without AI.',
              'Source: Apple iPhone User Guide (iOS 27), Apple Intelligence and ChatGPT pages, checked October 23, 2026')
    cs.save(fig, f'{OUT}/iphone-ios-27-apple-intelligence-menu-paths.webp')


# (묶음 제목, 기능 목록)
GROUPS = [
    ('Has its own off switch', cs.ACCENT,
     'Siri AI (switch to Siri Classic), message, email and notification summaries,\npriority notifications, Smart Replies in Mail, voicemail suggestions,\nCall Context cards, Journal writing prompts, ChatGPT extension'),
    ('Can be blocked in Screen Time', cs.FOREGROUND,
     'Siri AI as a whole (allow Siri Classic only or no Siri),\nSiri AI abilities such as Image Creation, Sensitive Topics, Explicit Language,\nthe ChatGPT extension'),
    ('No off switch in the iOS 27 guide', cs.MUTED,
     'Writing Tools and automatic proofreading, Clean Up, Extend and Reframe\nin Photos, Image Playground, Genmoji, Visual Intelligence.\nMost of these only start when you tap them'),
]


def what_you_can_turn_off():
    fig, ax = canvas('How much of Apple Intelligence you can turn off on iOS 27',
                     'Features that work in the background mostly have switches. Most tools you tap to use have none.')
    rh = 0.32
    for i, (title, color, body) in enumerate(GROUPS):
        y = 0.84 - i * rh
        box(ax, 0.0, y - rh / 2 + 0.02, 0.012, rh - 0.04, color)
        ax.text(0.035, y + 0.085, title, fontsize=16, fontweight='bold', va='center', color=color if color != cs.MUTED else cs.FOREGROUND)
        ax.text(0.035, y - 0.04, body, fontsize=13, va='center', linespacing=1.5)
    cs.footer(fig, 'Apple says Apple Intelligence uses up to 8 GB of storage on most supported iPhones, up to 14 GB on iPhone 17 Pro models, iPhone Air and iPhone Duo.',
              'Source: Apple iPhone User Guide (iOS 27) and Apple Support 121115, checked October 23, 2026')
    cs.save(fig, f'{OUT}/apple-intelligence-what-you-can-turn-off.webp')


# (기능, iPhone, iPad, Mac)
DEVICES = [
    ('Siri AI', 'Settings > Siri', 'Settings > Siri', 'System Settings > Siri'),
    ('Message summaries', 'Settings > Apps > Messages', 'Settings > Apps > Messages', 'Messages > Settings'),
    ('Email summaries', 'Settings > Apps > Mail', 'Settings > Apps > Mail', 'Mail > Settings > Viewing'),
    ('Notification summaries', 'Settings > Notifications', 'Settings > Notifications', 'System Settings > Notifications'),
    ('Priority notifications', 'Settings > Notifications', 'Settings > Notifications', 'Not listed for Mac'),
    ('Smart Replies in Mail', 'Settings > Apps > Mail', 'Settings > Apps > Mail', 'Mail > Settings > Composing'),
]


def iphone_ipad_mac():
    fig, ax = canvas('Apple Intelligence switches on iPhone, iPad and Mac',
                     'iPad uses the same paths as iPhone. On a Mac, most switches are inside each app\'s own settings.')
    cols = [(0.255, 'iPhone (iOS 27)'), (0.505, 'iPad (iPadOS 27)'), (0.755, 'Mac (macOS 27)')]
    for x, c in cols:
        ax.text(x, 0.95, c, fontsize=13.5, color=cs.MUTED, va='center', fontweight='semibold')
    rh = 0.135
    for i, (name, a, b, c) in enumerate(DEVICES):
        y = 0.8 - i * rh
        ax.text(0.0, y, name, fontsize=13.5, fontweight='bold', va='center')
        ax.text(0.255, y, a, fontsize=12, va='center')
        ax.text(0.505, y, b, fontsize=12, va='center')
        ax.text(0.755, y, c, fontsize=12, va='center', color=cs.MUTED if c.startswith('Not') else cs.ACCENT,
                fontweight='normal' if c.startswith('Not') else 'semibold')
        if i < len(DEVICES) - 1:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1)
    cs.footer(fig, 'Supported iPads: iPad mini (A17 Pro) and iPad models with M1 or later. Supported Macs: M1 or later.',
              'Source: Apple iPhone, iPad and Mac User Guides, "Turn off and restrict access to Apple Intelligence features", checked October 23, 2026')
    cs.save(fig, f'{OUT}/apple-intelligence-iphone-ipad-mac.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    ios26_vs_ios27()
    menu_paths()
    what_you_can_turn_off()
    iphone_ipad_mac()
