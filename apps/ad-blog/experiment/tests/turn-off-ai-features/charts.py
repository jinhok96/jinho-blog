"""AI 끄기 허브: 제품별 끌 수 있는 범위 + iPhone iOS 27 기능별 스위치 경로 + 제품별 메뉴 경로 (1200×675 webp).

내용 출처는 factcheck.md (Google·Apple·Microsoft 도움말, 상시 글 5편, 2026-10-23 확인).
2026-10-29: Firefox 행 추가(turn-off-ai-in-firefox, Firefox 159), Chrome 메뉴 이름 두 가지(AI innovations / AI in Chrome,
Chrome 156 새 프로필 10개 실행 결과는 factcheck.md "2026-10-29 Chrome 메뉴 이름").
실행: python3 -I charts.py <출력 폴더>
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch  # noqa: E402

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


# (제품·기능, 판정, 설명) 판정: full / part / none
PRODUCTS = [
    ('Chrome: AI history search, on-device AI model', 'full', 'Settings > AI innovations (or AI in Chrome)'),
    ('Chrome: Gemini in Chrome, AI Mode in address bar', 'part', 'Hide only; full off needs a Windows policy'),
    ('Firefox: all AI features', 'full', 'One switch: Block AI enhancements in AI controls'),
    ('Gmail and Google Docs: Gemini', 'full', 'One switch: Smart features in Google Workspace'),
    ('Gemini app: Connected Apps', 'part', 'Disconnect each app; past chats stay'),
    ('Word, Excel and other Microsoft 365 apps', 'full', 'Enable Copilot checkbox in each app (Windows, Mac)'),
    ('Windows 11: Copilot app', 'full', 'Uninstall in Settings > Apps > Installed apps'),
    ('iPhone with iOS 27: Apple Intelligence', 'part', 'One switch per feature, no main switch'),
    ('Google Search: AI Overviews', 'none', 'Can\'t be turned off; use the Web filter'),
]
LABEL = {'full': 'Fully off', 'part': 'Partly', 'none': 'No switch'}


def switch_by_product():
    fig, ax = canvas('How far you can turn off AI in each product',
                     'Some switches remove the AI feature, some only hide a button, and one can\'t be turned off at all.')
    rh = 0.106
    for i, (name, verdict, note) in enumerate(PRODUCTS):
        y = 0.93 - i * rh
        ax.text(0.0, y, name, fontsize=13.5, fontweight='bold', va='center', zorder=2)
        fill = {'full': cs.ACCENT, 'part': cs.SURFACE, 'none': cs.BACKGROUND}[verdict]
        box(ax, 0.445, y - 0.04, 0.13, 0.08, fill, edge=cs.BORDER if verdict != 'full' else None, lw=1)
        ax.text(0.51, y, LABEL[verdict], fontsize=12.5, ha='center', va='center', zorder=2, fontweight='bold',
                color=cs.BACKGROUND if verdict == 'full' else (cs.FOREGROUND if verdict == 'part' else cs.MUTED))
        ax.text(0.6, y, note, fontsize=12.5, va='center', zorder=2, color=cs.MUTED if verdict == 'none' else cs.FOREGROUND)
        if i < len(PRODUCTS) - 1:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1)
    cs.footer(fig, 'Personal accounts. Chrome 156, Firefox 159, iOS 27, Microsoft 365 version 2610. Work and school accounts are set by the IT admin.',
              'Sources: Google Search Help, Apple iPhone User Guide (iOS 27), Microsoft Support and Learn, ToolProof guides, checked October 23 to 29, 2026')
    cs.save(fig, f'{OUT}/ai-off-switch-by-product.webp')


def path_rows(ax, rows, x0, bw, gap, rh, top, fs=11.5):
    for i, (label, steps) in enumerate(rows):
        y = top - i * rh
        ax.text(0.0, y, label, fontsize=13.5, fontweight='bold', va='center', linespacing=1.25)
        for j, step in enumerate(steps):
            x = x0 + j * (bw + gap)
            last = j == len(steps) - 1
            box(ax, x, y - rh * 0.38, bw, rh * 0.76, cs.ACCENT if last else cs.SURFACE)
            ax.text(x + bw / 2, y, step, fontsize=fs, ha='center', va='center', zorder=2, linespacing=1.2,
                    color=cs.BACKGROUND if last else cs.FOREGROUND, fontweight='bold' if last else 'semibold')
            if not last:
                ax.annotate('', xy=(x + bw + gap - 0.003, y), xytext=(x + bw + 0.003, y),
                            arrowprops=dict(arrowstyle='-|>', color=cs.MUTED, lw=1.4), zorder=2)


IPHONE = [
    ('Siri AI', ['Settings', 'Siri', 'Turn Off Siri', 'Turn Off Siri\n(confirm)']),
    ('Message\nsummaries', ['Settings', 'Apps', 'Messages', 'Summarize\nMessages off']),
    ('Email\nsummaries', ['Settings', 'Apps', 'Mail', 'Summarize Message\nPreviews off']),
    ('Notification\nsummaries', ['Settings', 'Notifications', 'Summarize\nNotifications', 'Turn it off']),
    ('Keep Siri AI\noff for good', ['Settings', 'Screen Time', 'Content & Privacy\nRestrictions', 'Siri', 'Siri (Classic\nVersion)']),
]


def iphone_switches():
    fig, ax = canvas('Where to turn off Apple Intelligence on iPhone with iOS 27',
                     'iOS 27 has no main Apple Intelligence switch in Apple\'s guide. Each feature is turned off in its own spot.')
    path_rows(ax, IPHONE, x0=0.165, bw=0.148, gap=0.02, rh=0.195, top=0.89)
    cs.footer(fig, 'Apple Intelligence runs on iPhone 15 Pro, iPhone 15 Pro Max, and iPhone 16 models or later.',
              'Source: Apple iPhone User Guide for iOS 27, "Turn off and restrict access to Apple Intelligence features" and Screen Time, checked October 23, 2026')
    cs.save(fig, f'{OUT}/iphone-ios-27-apple-intelligence-switches.webp')


PATHS = [
    ('Chrome', ['Three-dot menu', 'Settings', 'AI innovations\nor AI in Chrome', 'Turn off each\nswitch']),
    ('Firefox', ['Menu', 'Settings', 'AI controls', 'Block AI\nenhancements']),
    ('Gmail', ['Settings', 'See all settings', 'Manage Workspace\nsmart features', 'Smart features in\nWorkspace off']),
    ('Gemini app', ['Sidebar', 'Customize', 'Connectors', 'Disconnect']),
    ('Word', ['File', 'Options', 'Copilot', 'Clear Enable\nCopilot']),
    ('Windows 11', ['Settings', 'Apps', 'Installed apps', 'Copilot >\nUninstall']),
    ('Google Search', ['Search', 'Web filter', 'Links only']),
]


def menu_paths():
    fig, ax = canvas('Where each AI switch lives',
                     'Every product keeps its AI setting in its own menu. Changing one doesn\'t change the others.')
    path_rows(ax, PATHS, x0=0.165, bw=0.185, gap=0.022, rh=0.142, top=0.93, fs=12)
    cs.footer(fig, 'Personal accounts on a computer. Phone apps use different menus; see each guide.',
              'Sources: Google, Mozilla, Microsoft and ToolProof guides to Chrome, Firefox, Gmail, Gemini, Word and Windows 11, checked October 23 to 29, 2026')
    cs.save(fig, f'{OUT}/where-each-ai-switch-lives.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    switch_by_product()
    iphone_switches()
    menu_paths()
