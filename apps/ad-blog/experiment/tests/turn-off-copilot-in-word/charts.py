"""Word Copilot 끄기: 기기·계정별 방법 표 + 두 방법 비교 + 메뉴 경로 + 같이 꺼지는 Word 기능 (1200×675 webp).

내용 출처는 factcheck.md (Microsoft 지원 문서·Learn, 2026-10-23 확인).
실행: python3 -I charts.py <출력 폴더>
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'
SOURCE = 'Source: Microsoft Support, "Turn off Copilot in Microsoft 365 apps" and "Access your Account Privacy Settings", checked October 23, 2026'


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


# (어디서 Word를 쓰나, Enable Copilot 체크박스, 개인정보 설정)
WHERE = [
    ('Word on Windows', 'Yes, version 2412 or later', 'Yes'),
    ('Word on a Mac', 'Yes, version 16.93 or later', 'Yes'),
    ('Word for the web', 'No', 'Yes'),
    ('Word on iPhone or iPad', 'No', 'Yes'),
    ('Word on Android', 'No', 'Yes'),
    ('Work or school account', 'No', 'Set by your IT admin'),
]


def methods_by_device():
    fig, ax = canvas('Which way to turn off Copilot works where you use Word',
                     'Only the Windows and Mac apps have an off switch for Copilot alone. Everywhere else, it is the privacy setting.')
    cols = [(0.55, 'Enable Copilot\ncheckbox'), (0.84, 'Privacy setting')]
    for x, c in cols:
        ax.text(x, 0.95, c, fontsize=13, color=cs.MUTED, ha='center', va='center', fontweight='semibold', linespacing=1.3)
    rh = 0.14
    for i, (name, box_ok, privacy) in enumerate(WHERE):
        y = 0.79 - i * rh
        has_box = box_ok.startswith('Yes')
        if has_box:
            box(ax, 0.0, y - rh / 2 + 0.008, 1.0, rh - 0.016, cs.SURFACE)
        ax.text(0.015, y, name, fontsize=15, fontweight='bold', va='center', zorder=2)
        ax.text(0.55, y, box_ok, fontsize=13.5, ha='center', va='center', zorder=2,
                color=cs.ACCENT if has_box else cs.MUTED, fontweight='bold' if has_box else 'normal')
        ax.text(0.84, y, privacy, fontsize=13.5, ha='center', va='center', zorder=2,
                color=cs.FOREGROUND if privacy == 'Yes' else cs.MUTED)
        if i >= 2 and i < len(WHERE) - 1:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1)
    cs.footer(fig, 'Personal Microsoft accounts (Microsoft 365 Personal, Family, Premium, Pro). Versions as of October 23, 2026.', SOURCE)
    cs.save(fig, f'{OUT}/word-copilot-off-by-device.webp')


# (항목, 체크박스, 개인정보 설정)
COMPARE = [
    ('What turns off', 'Copilot only', 'Copilot plus dictation, Translator,\ntext predictions and more'),
    ('Which apps', 'Only the app you change\n(Word, not Excel)', 'Word, Excel, PowerPoint,\nOutlook and OneNote'),
    ('Which devices', 'Only this computer,\nfor everyone who uses it', 'Every device signed in\nwith your account'),
    ('Where it exists', 'Word on Windows and Mac', 'Windows, Mac, web,\niPhone, iPad and Android'),
]


def checkbox_vs_privacy():
    fig, ax = canvas('Enable Copilot checkbox vs. privacy setting',
                     'The checkbox is narrow and stays on one computer. The privacy setting is broad and follows your account.')
    for x, c in [(0.30, 'Enable Copilot checkbox'), (0.68, 'Privacy setting')]:
        ax.text(x, 0.95, c, fontsize=14, color=cs.ACCENT if x < 0.5 else cs.FOREGROUND, va='center', fontweight='bold')
    rh = 0.215
    for i, (row, a, b) in enumerate(COMPARE):
        y = 0.77 - i * rh
        ax.text(0.015, y, row, fontsize=14.5, fontweight='bold', va='center', color=cs.MUTED)
        ax.text(0.30, y, a, fontsize=13.5, va='center', linespacing=1.4, fontweight='semibold')
        ax.text(0.68, y, b, fontsize=13.5, va='center', linespacing=1.4)
        if i < len(COMPARE) - 1:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1)
    cs.footer(fig, 'Privacy setting = "Turn on experiences that analyze your content" under Connected experiences.', SOURCE)
    cs.save(fig, f'{OUT}/copilot-checkbox-vs-privacy-setting.webp')


# (기기, 메뉴 단계)
PATHS = [
    ('Windows', ['File', 'Options', 'Copilot', 'Clear\nEnable Copilot']),
    ('Mac', ['Word menu', 'Preferences', 'Authoring and\nProofing Tools', 'Copilot', 'Clear\nEnable Copilot']),
    ('Web', ['File', 'About', 'Privacy Settings', 'Experiences that\nanalyze content']),
    ('iPhone, iPad', ['Settings', 'Privacy Settings', 'Experiences that\nanalyze content']),
    ('Android', ['Account picture', 'Privacy Settings', 'Experiences that\nanalyze content']),
]


def menu_paths():
    fig, ax = canvas('Where to turn off Copilot in Word on each device',
                     'Restart Word after the change. On the web and phones, turning off the privacy option is the only way.')
    rh = 0.195
    bw, gap, x0 = 0.148, 0.022, 0.155
    for i, (device, steps) in enumerate(PATHS):
        y = 0.88 - i * rh
        ax.text(0.0, y, device, fontsize=15, fontweight='bold', va='center')
        for j, step in enumerate(steps):
            x = x0 + j * (bw + gap)
            last = j == len(steps) - 1
            box(ax, x, y - 0.075, bw, 0.15, cs.ACCENT if last else cs.SURFACE)
            ax.text(x + bw / 2, y, step, fontsize=11.5, ha='center', va='center', zorder=2, linespacing=1.25,
                    color=cs.BACKGROUND if last else cs.FOREGROUND, fontweight='bold' if last else 'semibold')
            if not last:
                ax.annotate('', xy=(x + bw + gap - 0.003, y), xytext=(x + bw + 0.003, y),
                            arrowprops=dict(arrowstyle='-|>', color=cs.MUTED, lw=1.4), zorder=2)
    cs.footer(fig, 'Menu names from Microsoft Support for each platform. Personal Microsoft accounts only.', SOURCE)
    cs.save(fig, f'{OUT}/word-copilot-off-menu-paths.webp')


# (기능, 끄면 어떻게 되나, 계속 되는 부분이 있나)
LOST = [
    ('Copilot', 'Off', False),
    ('Dictate', 'Off', False),
    ('Translator', 'Off', False),
    ('Text predictions', 'Off (basic predictions stay in Word for Mac)', True),
    ('Editor', 'Advanced suggestions off, basic spelling and grammar stay', True),
    ('Read Aloud', 'Listed; offline it uses your device voice', True),
    ('Automatic alt text', 'Off', False),
    ('Smart Lookup, Research, Learning Tools', 'Off', False),
]


def features_lost():
    fig, ax = canvas('What else stops working in Word with the privacy setting',
                     'Microsoft lists these "experiences that analyze your content." Basic spelling and grammar checks stay on.')
    rh = 0.112
    for i, (name, effect, partial) in enumerate(LOST):
        y = 0.92 - i * rh
        if i == 0:
            box(ax, 0.0, y - rh / 2 + 0.008, 1.0, rh - 0.016, cs.SURFACE)
        ax.text(0.015, y, name, fontsize=14.5, fontweight='bold', va='center', zorder=2,
                color=cs.ACCENT if i == 0 else cs.FOREGROUND)
        ax.text(0.45, y, effect, fontsize=13.5, va='center', zorder=2,
                color=cs.FOREGROUND if partial else cs.MUTED, fontweight='semibold' if partial else 'normal')
        if 0 < i < len(LOST) - 1:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1)
    cs.footer(fig, 'Source: Microsoft Learn, "Connected experiences in Microsoft 365 Apps," features that apply to Word, checked October 23, 2026')
    cs.save(fig, f'{OUT}/word-features-off-with-privacy-setting.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    methods_by_device()
    checkbox_vs_privacy()
    menu_paths()
    features_lost()
