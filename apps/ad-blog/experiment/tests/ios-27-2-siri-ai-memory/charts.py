"""iOS 27.2 Siri AI 기억 칼럼 그래픽: 설명서 화면 캡처 + 데이터 출처별 설정 표 + 기기별 업데이트 표 + 문서 변경 비교 (1200×675 webp).

내용 출처는 factcheck.md. 캡처 원본 `guide-exclude-apps.png`는 shot.cjs로 찍은
iPhone User Guide "Change Siri settings on iPhone"의 "Exclude apps from Siri, Search, and suggestions" 절
(1100px 폭, 2배율, 2026-10-26 21:3x UTC).
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
    """Excluded Apps 절 전체, 'Excluded apps aren't available to Siri, Search, or suggestions. All apps are included by default' 두 줄을 accent 상자로"""
    img = Image.open(HERE / 'guide-exclude-apps.png').convert('RGB')
    img = img.crop((0, 0, img.width, 1100))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Apple\'s steps: Settings > Siri > Excluded Apps',
              'iPhone User Guide for iOS 27, "Change Siri settings on iPhone," updated for iOS 27.2. October 26, 2026.')
    h_px = 470
    w_px = h_px * img.width / img.height
    left = (1200 - w_px) / 2
    ax = fig.add_axes([left / 1200, 0.115, w_px / 1200, h_px / 675])
    ax.imshow(img)
    ax.axis('off')
    # 3·4번째 줄 (약 y 236~342): 제외한 앱은 Siri·Search·suggestions 모두에서 빠지고, 기본값은 모든 앱 포함
    ax.add_patch(Rectangle((20, 232), 1660, 112, fill=False, edgecolor=cs.ACCENT, lw=3, zorder=3))
    cs.footer(fig, 'Source: support.apple.com/guide/iphone/iphc28624b81abc, captured in Chromium on October 26, 2026 (UTC). Box added by ToolProof.')
    cs.save(fig, f'{OUT}/apple-guide-excluded-apps.webp')


# (데이터, 27.2에서, 막는 설정, 대가)
SOURCES = [
    ('Your past Siri\nconversations', 'New: Siri can\nrecall them', 'Siri app history: delete chats, or\nSettings > Siri > Keep Conversations', 'Chats you delete are gone; Apple\ndoesn\'t say if recall goes with them'),
    ('Photos attached\nin Messages', 'New source', 'Settings > Siri > Excluded Apps\n> add Messages', 'Messages also drops out of\nSearch and suggestions'),
    ('Calendar event\nattendees', 'New source', 'Excluded Apps > add Calendar', 'Calendar also drops out of\nSearch and suggestions'),
    ('Your voicemails', 'New source', 'Excluded Apps > add Phone', 'Phone also drops out of Search and\nsuggestions, and Siri can\'t act in it'),
    ('Safari history and\nReading List', 'Better results', 'Excluded Apps > add Safari', 'Safari also drops out of\nSearch and suggestions'),
]


def sources_table():
    fig, ax = canvas('What Siri AI can use after iOS 27.2, and what stops it',
                     'Applies only if you turned on Siri AI (Beta). There is no separate switch for recall in Apple\'s guide.')
    cols = [(0.0, 'Your data'), (0.2, 'In iOS 27.2'), (0.36, 'Setting that limits it'), (0.7, 'What you give up')]
    for x, c in cols:
        ax.text(x + 0.012, 0.975, c, fontsize=12.5, color=cs.ACCENT if c.startswith('Setting') else cs.MUTED,
                va='center', fontweight='semibold')
    rh = 0.18
    for i, (data, new, setting, cost) in enumerate(SOURCES):
        y = 0.85 - i * rh
        box(ax, 0.36, y - rh / 2 + 0.012, 0.33, rh - 0.024, cs.SURFACE)
        ax.text(0.012, y, data, fontsize=12.5, fontweight='bold', va='center', linespacing=1.3, zorder=2)
        ax.text(0.212, y, new, fontsize=12, va='center', linespacing=1.3, zorder=2,
                color=cs.ACCENT if new.startswith('New') else cs.MUTED)
        ax.text(0.372, y, setting, fontsize=11.5, va='center', linespacing=1.35, zorder=2)
        ax.text(0.712, y, cost, fontsize=11.5, va='center', linespacing=1.35, zorder=2, color=cs.MUTED)
        if i < len(SOURCES) - 1:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1, zorder=0)
    cs.footer(fig, 'Sources: Apple, "About iOS 27 Updates" (support.apple.com/149076) and iPhone User Guide pages "Change Siri settings" and',
              '"Use the Siri app," opened October 26, 2026 (UTC). Apple: "Excluded apps aren\'t available to Siri, Search, or suggestions."')
    cs.save(fig, f'{OUT}/siri-ai-ios-27-2-data-and-settings.webp')


# (기기, 업데이트, CVE, 설명, 강조)
DEVICES = [
    ('iPhone 15 Pro, 15 Pro Max,\niPhone 16 and later', 'iOS 27.2', '163', 'Siri AI memory and new data\nsources, if Siri AI is on', True),
    ('Other iPhones from\niPhone 11 on', 'iOS 27.2', '163', 'Security fixes and other\nfeatures, no Siri AI', False),
    ('iPhones staying\non iOS 26', 'iOS 26.7.2', '134', 'Security fixes only', False),
    ('iPhone XS, XS Max, XR', 'iOS 18.7.11', '3', 'One bug Apple says may have\nbeen exploited in targeted attacks', False),
]


def device_table():
    fig, ax = canvas('Which update your iPhone got on October 26, 2026',
                     'Apple released four iPhone updates the same day. Only the newest models get the Siri AI changes.')
    cols = [(0.0, 'iPhone'), (0.3, 'Update'), (0.46, 'Security fixes (CVEs)'), (0.68, 'What it brings')]
    for x, c in cols:
        ax.text(x + 0.012, 0.975, c, fontsize=12.5, color=cs.MUTED, va='center', fontweight='semibold')
    rh = 0.225
    for i, (dev, upd, cve, desc, hi) in enumerate(DEVICES):
        y = 0.83 - i * rh
        if hi:
            box(ax, 0.003, y - rh / 2 + 0.014, 0.994, rh - 0.028, cs.SURFACE, edge=cs.ACCENT, lw=2)
        ax.text(0.014, y, dev, fontsize=13, fontweight='bold', va='center', linespacing=1.3, zorder=2)
        ax.text(0.312, y, upd, fontsize=15, fontweight='bold', va='center', zorder=2,
                color=cs.ACCENT if hi else cs.FOREGROUND)
        ax.text(0.472, y, cve, fontsize=15, fontweight='bold', va='center', zorder=2)
        ax.text(0.692, y, desc, fontsize=12, va='center', linespacing=1.35, zorder=2)
        if i < len(DEVICES) - 1 and not hi:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1, zorder=0)
    cs.footer(fig, 'Sources: Apple security releases (support.apple.com/100100) and security notes 149230 (iOS 27.2), 149227 (iOS 26.7.2),',
              '149225 (iOS 18.7.11), opened October 26, 2026. CVE counts are unique CVE IDs listed in each note, counted by ToolProof.')
    cs.save(fig, f'{OUT}/iphone-updates-october-26-2026.webp')


# (문서, 날짜, 내용, 강조)
DOCS = [
    ('iPhone User Guide', 'Oct 23, 2026', 'Call Context cards:\nSettings > Apps > Phone >\nApple Intelligence & Siri >\nShow When Calling', False),
    ('iPhone User Guide', 'Oct 26, 2026', 'Call Context cards:\n"See Exclude apps from\nSiri, Search, and\nsuggestions."', True),
    ('Siri, Dictation &\nPrivacy page', 'Dated Sept 14, 2026', 'Per-app control:\nSettings > Siri > Apps >\n[app name] > Use with\nSiri Requests', False),
]


def doc_changes():
    fig, ax = canvas('Apple\'s own pages caught up at different speeds',
                     'Where each Apple page told you to control Siri\'s access to an app. Only the newest guide points to Excluded Apps.')
    n = len(DOCS)
    gap = 0.03
    w = (1 - gap * (n - 1)) / n
    for i, (doc, date, text, hi) in enumerate(DOCS):
        x = i * (w + gap)
        box(ax, x, 0.04, w, 0.9, cs.SURFACE, edge=cs.ACCENT if hi else cs.BORDER, lw=2.5 if hi else 1)
        ax.text(x + 0.025, 0.84, doc, fontsize=13, color=cs.MUTED, fontweight='semibold', va='center', linespacing=1.3, zorder=2)
        ax.text(x + 0.025, 0.68, date, fontsize=20, fontweight='bold', va='center', zorder=2,
                color=cs.ACCENT if hi else cs.FOREGROUND)
        ax.text(x + 0.025, 0.56, text, fontsize=13, va='top', linespacing=1.6, zorder=2)
    cs.footer(fig, 'Sources: "Turn off and restrict access to Apple Intelligence features" (support.apple.com/guide/iphone/iph3fed3f2c3), saved by ToolProof',
              'on Oct 23 and Oct 26, 2026 (UTC); apple.com/legal/privacy/data/en/ask-siri-dictation, opened Oct 26, 2026.')
    cs.save(fig, f'{OUT}/apple-siri-docs-before-after.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    guide_screenshot()
    sources_table()
    device_table()
    doc_changes()
