"""Windows 11 AI 끄기: 기능별 끌 수 있는 범위 + 메뉴 경로 + Copilot+ PC 전용 vs 모든 PC + 문서끼리 다른 점 (1200×675 webp).

내용 출처는 factcheck.md (Microsoft Support·Microsoft Learn, 2026-10-24 UTC 확인).
실행: python3 -I charts.py <출력 폴더>
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'
SOURCE = 'Source: Microsoft Support and Microsoft Learn pages on Recall, Click to Do, Copilot, Notepad, Paint and AI components, checked October 24, 2026'


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


# (묶음 제목, 색, 기능 목록)
GROUPS = [
    ('Can be turned off or removed in Settings', cs.ACCENT,
     'Copilot app (uninstall), Ask Copilot on the taskbar, the Copilot key (set it to Search),\nRecall (stop snapshots or remove it), Click to Do, AI actions in File Explorer,\ndownloaded AI models in AI Components'),
    ('Has a switch inside the app', cs.FOREGROUND,
     'Notepad: Rewrite, Summarize and Write can be turned off in Notepad\'s settings,\naccording to Microsoft\'s Notepad guide (another Microsoft page says they can\'t)'),
    ('No switch for home users', cs.MUTED,
     'Paint: Image Creator, Cocreator, generative fill, sticker generator.\nThe agent in Settings. AI components built into Copilot+ PCs.\nOnly IT admins get policies for these'),
]


def what_you_can_turn_off():
    fig, ax = canvas('How much AI you can turn off in Windows 11',
                     'Most Windows AI features have a switch in Settings. Paint and the Settings agent have none for home users.')
    rh = 0.32
    for i, (title, color, body) in enumerate(GROUPS):
        y = 0.84 - i * rh
        box(ax, 0.0, y - rh / 2 + 0.02, 0.012, rh - 0.04, color)
        ax.text(0.035, y + 0.115, title, fontsize=16, fontweight='bold', va='center',
                color=color if color != cs.MUTED else cs.FOREGROUND)
        ax.text(0.035, y - 0.03, body, fontsize=13, va='center', linespacing=1.5)
    cs.footer(fig, 'Experimental agentic features are off by default (Settings > System > AI Components). Only an administrator can turn them on.', SOURCE)
    cs.save(fig, f'{OUT}/windows-11-ai-what-you-can-turn-off.webp')


# (기능, 메뉴 단계)
PATHS = [
    ('Copilot app', ['Apps', 'Installed apps', 'Copilot > More', 'Uninstall']),
    ('Ask Copilot\non the taskbar', ['Personalization', 'Taskbar', 'Ask Copilot off']),
    ('Copilot key', ['Personalization', 'Text input', 'Customize\nCopilot key', 'Search']),
    ('Recall snapshots', ['Privacy &\nsecurity', 'Recall &\nsnapshots', 'Save\nsnapshots off']),
    ('Click to Do', ['Privacy &\nsecurity', 'Click to Do', 'Off']),
    ('AI actions', ['Apps', 'Actions', 'Turn off\neach action']),
    ('AI models', ['System', 'AI Components', 'Remove']),
]


def menu_paths():
    fig, ax = canvas('Where each AI switch is in Windows 11 Settings',
                     'Every path starts in the Settings app (Windows key + I). Recall can also be removed in "Turn Windows features on or off".')
    rh = 0.14
    bw, gap, x0 = 0.18, 0.025, 0.2
    for i, (feature, steps) in enumerate(PATHS):
        y = 0.93 - i * rh
        ax.text(0.0, y, feature, fontsize=13, fontweight='bold', va='center', linespacing=1.2)
        for j, step in enumerate(steps):
            x = x0 + j * (bw + gap)
            last = j == len(steps) - 1
            box(ax, x, y - 0.055, bw, 0.11, cs.ACCENT if last else cs.SURFACE)
            ax.text(x + bw / 2, y, step, fontsize=11, ha='center', va='center', zorder=2, linespacing=1.15,
                    color=cs.BACKGROUND if last else cs.FOREGROUND, fontweight='bold' if last else 'semibold')
            if not last:
                ax.annotate('', xy=(x + bw + gap - 0.003, y), xytext=(x + bw + 0.003, y),
                            arrowprops=dict(arrowstyle='-|>', color=cs.MUTED, lw=1.4), zorder=2)
    cs.footer(fig, 'Microsoft\'s screen reader guide puts the Copilot key option under Bluetooth & devices > Keyboard instead.', SOURCE)
    cs.save(fig, f'{OUT}/windows-11-ai-menu-paths.webp')


# (기능, Copilot+ PC 전용 여부, 비고)
FEATURES = [
    ('Copilot app, Copilot key', 'Every Windows 11 PC', False),
    ('Notepad Rewrite, Summarize, Write', 'Every PC, Microsoft account sign-in', False),
    ('Paint Image Creator', 'Every PC, Microsoft account sign-in', False),
    ('AI actions in File Explorer', 'September 2025 update or later; not in the EEA', False),
    ('Recall', 'Copilot+ PC only', True),
    ('Click to Do', 'Copilot+ PC only', True),
    ('Paint Cocreator, generative fill', 'Copilot+ PC only', True),
    ('Agent in Settings', 'Copilot+ PC only', True),
]


def which_pcs():
    fig, ax = canvas('Which Windows 11 AI features your PC can have',
                     'Recall, Click to Do and the Settings agent need a Copilot+ PC. If yours isn\'t one, there is nothing to turn off.')
    ax.text(0.0, 0.96, 'Feature', fontsize=13, color=cs.MUTED, va='center', fontweight='semibold')
    ax.text(0.5, 0.96, 'Available on', fontsize=13, color=cs.MUTED, va='center', fontweight='semibold')
    rh = 0.112
    for i, (name, where, cplus) in enumerate(FEATURES):
        y = 0.85 - i * rh
        ax.text(0.0, y, name, fontsize=13.5, fontweight='bold', va='center')
        if cplus:
            box(ax, 0.5, y - 0.04, 0.2, 0.08, cs.ACCENT)
            ax.text(0.6, y, where, fontsize=12, ha='center', va='center', color=cs.BACKGROUND, fontweight='bold', zorder=2)
        else:
            ax.text(0.5, y, where, fontsize=12.5, va='center', color=cs.FOREGROUND)
        if i < len(FEATURES) - 1:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1)
    cs.footer(fig, 'Copilot+ PC: a Windows 11 PC with a 40 TOPS NPU (an AI chip), 16 GB RAM and 256 GB storage, per Microsoft\'s Recall and Click to Do requirements.', SOURCE)
    cs.save(fig, f'{OUT}/windows-11-ai-features-by-pc.webp')


# (주제, 문서 A, 문서 B)
CONFLICTS = [
    ('Can you turn off AI\nin Notepad?', 'Yes: "you can turn them off\nin Notepad settings"', 'Notepad guide',
     'No: "You can\'t turn off Copilot\nfeatures in Designer, Notepad, or Paint"', 'Microsoft 365 Copilot FAQ'),
    ('Where is the\nCopilot key option?', 'Personalization > Text input >\nCustomize Copilot key on keyboard', 'Keyboard shortcuts page',
     'Bluetooth & devices > Keyboard >\nCustomise Copilot key on keyboard', 'Screen reader guide'),
]


def doc_conflicts():
    fig, ax = canvas('Where Microsoft\'s own pages disagree',
                     'We checked these against each other on October 24, 2026. The steps in our guide note both answers.')
    rh = 0.42
    for i, (topic, a, a_src, b, b_src) in enumerate(CONFLICTS):
        y = 0.75 - i * rh
        ax.text(0.0, y, topic, fontsize=14, fontweight='bold', va='center', linespacing=1.3)
        for x, text, src in [(0.24, a, a_src), (0.62, b, b_src)]:
            box(ax, x, y - 0.15, 0.36, 0.30, cs.SURFACE)
            ax.text(x + 0.02, y + 0.04, text, fontsize=13.5, va='center', linespacing=1.35, zorder=2, fontweight='semibold')
            ax.text(x + 0.02, y - 0.1, src, fontsize=11.5, va='center', color=cs.MUTED, zorder=2)
    cs.footer(fig, 'Microsoft\'s Notepad guide still describes its AI features as available to Windows Insiders.', SOURCE)
    cs.save(fig, f'{OUT}/windows-11-ai-microsoft-docs-disagree.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    what_you_can_turn_off()
    menu_paths()
    which_pcs()
    doc_conflicts()
