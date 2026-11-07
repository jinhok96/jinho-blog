"""Windows 11 오른쪽 클릭 메뉴(KB5127936) 칼럼 그래픽: 버전별 대상 + KB 문서 캡처(주석) + 타임라인 + 지금 설치 vs 11-10 (webp).

캡처 원본은 `screens/kb5127936-context-menu.png` (capture_kb.cjs: Playwright + Chromium 153, 1280px, 접힌 Gradual rollout 단락을 펼쳐
2026-10-29 21:38 UTC 캡처). 내용 출처는 factcheck.md.
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


def box(ax, x, y, w, h, fill, edge=None, lw=0, r=0.012):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle=f'round,pad=0,rounding_size={r}',
                                facecolor=fill, edgecolor=edge or fill, lw=lw, zorder=1))


def canvas(fig, rect=(0.03, 0.12, 0.94, 0.71)):
    ax = fig.add_axes(rect)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    return ax


def who_gets_it():
    """버전별로 새 메뉴를 받는지: 25H2·26H2만 지금 (단계 배포)"""
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Which Windows PCs get the new right-click menu',
              'Based on Microsoft release information and update notes as of October 29, 2026.')
    ax = canvas(fig)
    rows = [
        ('Windows 11, version 25H2 or 26H2', 'Rolling out', True,
         'Optional update KB5127936 since Oct 28. The menu turns on\ngradually, so it can show up later than the update.'),
        ('Windows 11, version 26H1', 'Not listed', False,
         'Comes only on some PCs sold since early 2026. Its\nOctober preview, KB5127653, does not list the menu.'),
        ('Windows 11 Home or Pro, 24H2 or 23H2', 'No', False,
         'Updates have ended (24H2 on Oct 13, 2026). Move to\n25H2 or 26H2 first; both are free.'),
        ('Windows 10', 'No', False,
         'Extended Security Updates bring security fixes only,\nno new features.'),
        ('Work or school PC', 'Later', False,
         'For Windows Update for Business, Microsoft says these\nchanges come with the next security update.'),
    ]
    row_h, gap = 0.172, 0.028
    for i, (name, verdict, yes, note) in enumerate(rows):
        y = 1 - (i + 1) * row_h - i * gap
        box(ax, 0.0, y, 1.0, row_h, cs.SURFACE)
        ax.text(0.02, y + row_h / 2, name, fontsize=14, fontweight='bold', va='center')
        pill_c = cs.ACCENT if yes else cs.MUTED
        box(ax, 0.405, y + row_h * 0.27, 0.13, row_h * 0.46, pill_c, r=0.02)
        ax.text(0.47, y + row_h / 2, verdict, fontsize=12.5, fontweight='semibold', color=cs.BACKGROUND,
                ha='center', va='center')
        ax.text(0.56, y + row_h / 2, note, fontsize=12, va='center', linespacing=1.35)
    cs.footer(fig, 'Sources: Microsoft Windows 11 release information, Windows message center, KB5127936 and KB5127653 (read October 29, 2026),',
              'Microsoft Extended Security Updates page as quoted in our Windows 10 ESU article.')
    cs.save(fig, f'{OUT}/windows-11-right-click-menu-who-gets-it.webp')


def kb_screenshot():
    """KB5127936 문서의 Gradual rollout 단락 캡처 + 주석 상자 2개 + 오른쪽 요약"""
    img = Image.open(SCREENS / 'kb5127936-context-menu.png').convert('RGB')
    # 위 'Highlights' 제목을 빼고 단계 배포 설명 ~ Shift 문장까지
    img = img.crop((0, 70, img.width, img.height))
    fig = plt.figure(figsize=(12, 8))
    fig.text(0.03, 0.93, "Microsoft's own notes: the new menu rolls out gradually", fontsize=22, fontweight='bold')
    fig.text(0.03, 0.89, 'KB5127936 release notes, "Gradual rollout" section expanded. Boxes added by ToolProof.',
             fontsize=13.5, color=cs.MUTED)
    h = 800 * 0.77
    w = h * img.width / img.height
    ax = fig.add_axes([36 / 1200, 0.095, w / 1200, h / 800])
    ax.imshow(img)
    ax.axis('off')
    # 주석 1: 단계 배포 정의 문장 (원본 y 0~90 → crop 후 -70)
    ax.add_patch(Rectangle((8, 2), img.width - 16, 104, fill=False, edgecolor=cs.ACCENT, lw=3, zorder=3))
    # 주석 2: Customize menu로 할 수 있는 일 목록
    ax.add_patch(Rectangle((100, 420), img.width - 110, 322, fill=False, edgecolor=cs.ACCENT, lw=3, zorder=3))

    left = (36 + w + 28) / 1200
    side = fig.add_axes([left, 0.1, 0.97 - left, 0.76])
    side.set_xlim(0, 1)
    side.set_ylim(0, 1)
    side.axis('off')
    box(side, 0.0, 0.0, 1.0, 1.0, cs.SURFACE)
    side.text(0.07, 0.93, 'What this says', fontsize=15, fontweight='bold', color=cs.ACCENT)
    notes = [
        ('Installing is not enough', 'Features "reach devices over\ntime," so availability varies\nby PC.'),
        ('Customize menu', 'A new entry at the bottom of\nthe right-click menu opens the\nmenu\'s Settings page.'),
        ('Five kinds of changes', 'Built-in commands, Print, app\nitems, text labels instead of\nicons, Properties at the bottom.'),
        ('More options', 'Hold Shift while you right-\nclick on the desktop.'),
    ]
    y = 0.84
    for head, body in notes:
        side.text(0.07, y, head, fontsize=13.5, fontweight='bold', va='top')
        side.text(0.07, y - 0.05, body, fontsize=12, va='top', linespacing=1.35)
        y -= 0.06 + 0.045 * (body.count('\n') + 1) + 0.035
    fig.add_artist(plt.Line2D([0.03, 0.97], [0.065, 0.065], color=cs.BORDER, lw=1))
    fig.text(0.03, 0.025, 'Screenshot: support.microsoft.com KB5127936 page, captured October 29, 2026 (Chromium, 1280 px wide).',
             fontsize=10.5, color=cs.MUTED)
    fig.text(0.97, 0.025, cs.SITE_NAME, fontsize=13, fontweight='bold', ha='right')
    cs.save(fig, f'{OUT}/kb5127936-context-menu-release-notes.webp')


def timeline():
    """08-17 Insider 발표 → 09-11 → 10-16 Release Preview → 10-28 미리 보기 → 11-10 보안 업데이트"""
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'From Insider test to your PC: the right-click menu timeline',
              'Dates from Microsoft blog posts, release notes and its monthly update schedule.')
    ax = canvas(fig, (0.03, 0.14, 0.94, 0.66))
    ax.plot([0.05, 0.95], [0.62, 0.62], color=cs.BORDER, lw=3, zorder=0)
    events = [
        (0.09, 'Aug 17', 'Microsoft announces\nthe redesign to\nWindows Insiders', cs.MUTED),
        (0.29, 'Sep 11', 'Insider builds add a\nswitch to hide the\nCustomize menu entry', cs.MUTED),
        (0.50, 'Oct 16', 'Release Preview\ntesters get the\nsame notes', cs.MUTED),
        (0.71, 'Oct 28', 'Optional update\nKB5127936 for\n25H2 and 26H2', cs.ACCENT),
        (0.91, 'Nov 10', 'Monthly security\nupdate, which carries\nthe October changes', cs.FOREGROUND),
    ]
    for x, date, text, color in events:
        ax.scatter([x], [0.62], s=260, color=color, zorder=3)
        ax.text(x, 0.8, date, fontsize=16, fontweight='bold', ha='center',
                color=cs.ACCENT if color == cs.ACCENT else cs.FOREGROUND)
        ax.text(x, 0.47, text, fontsize=12, ha='center', va='top', linespacing=1.4)
    ax.text(0.5, 0.02, 'All dates 2026. The September switch is not mentioned in the October 28 release notes.',
            fontsize=11.5, color=cs.MUTED, ha='center')
    cs.footer(fig, 'Sources: Windows Insider Blog (Aug 17 and Sep 11, 2026), Release Preview build 26200.9807 notes (Oct 16), KB5127936 (Oct 28),',
              'Microsoft Learn "Windows monthly updates" release cycle page (security update on the second Tuesday).')
    cs.save(fig, f'{OUT}/windows-11-right-click-menu-timeline.webp')


def now_or_wait():
    """지금 선택 업데이트 설치 vs 11-10 보안 업데이트 기다리기 (사실만)"""
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Install the optional update now, or wait for November 10?',
              'What each choice gets you on Windows 11, version 25H2 or 26H2.')
    ax = canvas(fig)
    cols = [
        (0.0, 'Install KB5127936 now', cs.ACCENT, [
            ('How', 'Settings > Windows Update > Advanced\noptions > Optional updates'),
            ('Fixes you get now', 'Remote Desktop with Administrator protection,\nSmart App Control stuck off, HDMI and\nDisplayPort audio on some AMD graphics cards'),
            ('The new menu', 'Turns on gradually; may not appear\nright after you restart'),
        ]),
        (0.51, 'Wait for November 10', cs.MUTED, [
            ('How', 'Nothing to do; the security update\ninstalls automatically'),
            ('Fixes you get', 'The same October changes plus\nNovember security fixes'),
            ('The new menu', 'Microsoft has not said whether it turns\non for every PC that day'),
        ]),
    ]
    for x0, title, color, items in cols:
        box(ax, x0, 0.0, 0.49, 1.0, cs.SURFACE)
        box(ax, x0, 0.86, 0.49, 0.14, color)
        ax.text(x0 + 0.03, 0.93, title, fontsize=16, fontweight='bold', color=cs.BACKGROUND, va='center')
        y = 0.78
        for head, body in items:
            ax.text(x0 + 0.03, y, head, fontsize=13, fontweight='bold', va='top', color=cs.ACCENT if color == cs.ACCENT else cs.FOREGROUND)
            ax.text(x0 + 0.03, y - 0.06, body, fontsize=12.5, va='top', linespacing=1.35)
            y -= 0.1 + 0.07 * (body.count('\n') + 1)
    cs.footer(fig, 'Both ways: an open known issue from the September 8 update can stop some USB Audio Class 1.0 devices (Code 10).',
              'Sources: KB5127936 release notes and Microsoft Learn release cycle page, read October 29, 2026.')
    cs.save(fig, f'{OUT}/kb5127936-install-now-or-wait.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    who_gets_it()
    kb_screenshot()
    timeline()
    now_or_wait()
