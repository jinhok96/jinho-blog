"""Chrome 강화 자동 완성(Gmail) 칼럼 그래픽: Chrome 156 설정 캡처(주석) + 자격 조건 + 스위치별 효과 + 타임라인 (1200×675 webp).

캡처 원본은 `screens/*.webp` (Chrome 156.0.8078.73 Linux, 새 프로필, 로그아웃, Xvfb 1280×900, 2026-10-28 21:35 UTC,
조작 순서는 capture.py 아래 주석). 내용 출처는 factcheck.md.
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
HELP = 'Sources: Chrome Help "Fill out forms automatically in Chrome" and Gemini Apps Help "Connect your Google apps", read October 28, 2026.'


def box(ax, x, y, w, h, fill, edge=None, lw=0, r=0.012):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle=f'round,pad=0,rounding_size={r}',
                                facecolor=fill, edgecolor=edge or fill, lw=lw, zorder=1))


def canvas(fig, rect=(0.03, 0.12, 0.94, 0.71)):
    ax = fig.add_axes(rect)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    return ax


def settings_page():
    """Autofill settings를 펼친 화면: Smarter form understanding 줄을 표시, 오른쪽에 자격이 있을 때 생기는 항목"""
    img = Image.open(SCREENS / 'chrome-156-autofill-settings.webp').convert('RGB').crop((340, 145, 1050, 700))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, "Chrome's AI autofill switches sit under Autofill settings",
              'Chrome 156 signed out: Smarter form understanding is greyed out and there is no Enhanced autofill item.')
    h = 480
    w = h * img.width / img.height
    ax = fig.add_axes([36 / 1200, 0.115, w / 1200, h / 675])
    ax.imshow(img)
    ax.axis('off')
    ax.add_patch(Rectangle((10, 350), 686, 200, fill=False, edgecolor=cs.ACCENT, lw=3, zorder=3))

    left = (36 + w + 30) / 1200
    side = fig.add_axes([left, 0.12, 0.97 - left, 0.71])
    side.set_xlim(0, 1)
    side.set_ylim(0, 1)
    side.axis('off')
    box(side, 0.0, -0.02, 1.0, 0.99, cs.SURFACE)
    side.text(0.06, 0.88, 'When your account qualifies', fontsize=15, fontweight='bold', color=cs.ACCENT)
    rows = [
        ('Enhanced autofill', 'A new item under Autofill settings\nfor US users 18+ who turned on\nPersonal Intelligence'),
        ('Find and fill with Gemini', 'The switch for Gmail suggestions.\nChrome\'s text says "apps such as\nGmail and Photos"'),
        ('Smarter form understanding', 'On unless you turn it off. Shares\nthe page\'s URL and content\nwith Google'),
    ]
    y = 0.79
    for head, body in rows:
        side.text(0.06, y, head, fontsize=13.5, fontweight='bold', va='top')
        side.text(0.06, y - 0.06, body, fontsize=12, va='top', linespacing=1.35)
        y -= 0.065 + 0.056 * (body.count('\n') + 1) + 0.04
    cs.footer(fig, 'Screenshot: Google Chrome 156.0.8078.73 for Linux, new profile, signed out, October 28, 2026. Box added by ToolProof.',
              'Side notes: Chrome Help and the interface text inside Chrome 156.')
    cs.save(fig, f'{OUT}/chrome-autofill-settings-chrome-156.webp')


def requirements():
    """Gmail 정보가 Chrome 양식에 나오기까지 필요한 조건 6개 → 결과"""
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Six conditions before Chrome fills forms from your Gmail',
              "Miss any one and you won't see Gmail suggestions in Chrome.")
    ax = canvas(fig)
    steps = [
        ('Live in the US, age 18 or older', 'Chrome Help'),
        ('Personal Google account', 'Not work, school or supervised accounts'),
        ('Signed in to Chrome, using Gemini in Chrome', 'Chrome Help'),
        ('Keep Activity is on', 'Gemini saves your chats (Gemini Apps Activity)'),
        ('Personal Intelligence on, Google Workspace connected', 'Needs Gmail\'s "Smart features in other Google products"'),
        ('"Find and fill with Gemini" is on', 'Chrome > Settings > Autofill and passwords > Enhanced autofill'),
    ]
    top, step_h, gap = 0.98, 0.135, 0.032
    for i, (head, note) in enumerate(steps):
        y = top - (i + 1) * step_h - i * gap
        box(ax, 0.0, y, 0.6, step_h, cs.SURFACE)
        ax.text(0.03, y + step_h / 2, str(i + 1), fontsize=17, fontweight='bold', color=cs.ACCENT, va='center')
        ax.text(0.075, y + step_h * 0.66, head, fontsize=14, fontweight='bold', va='center')
        ax.text(0.075, y + step_h * 0.3, note, fontsize=11.5, color=cs.MUTED, va='center')
    # 결과 카드
    box(ax, 0.68, 0.3, 0.32, 0.4, cs.ACCENT)
    ax.text(0.84, 0.58, 'Chrome can suggest', fontsize=15, fontweight='bold', color=cs.BACKGROUND, ha='center')
    ax.text(0.84, 0.5, 'order numbers, tracking', fontsize=13, color=cs.BACKGROUND, ha='center')
    ax.text(0.84, 0.44, 'and flight details', fontsize=13, color=cs.BACKGROUND, ha='center')
    ax.text(0.84, 0.38, 'from Gmail in forms', fontsize=13, color=cs.BACKGROUND, ha='center')
    ax.annotate('', xy=(0.675, 0.5), xytext=(0.615, 0.5),
                arrowprops=dict(arrowstyle='-|>', color=cs.ACCENT, lw=2.5, mutation_scale=22))
    cs.footer(fig, HELP)
    cs.save(fig, f'{OUT}/chrome-gmail-autofill-requirements.webp')


def switches():
    """할 수 있는 일 5가지와 각각 멈추는 것"""
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'What each switch actually stops',
              'Five ways to limit what Chrome autofill takes from Gmail and the pages you visit.')
    ax = canvas(fig)
    rows = [
        ('Turn off "Find and fill with Gemini"', 'Chrome',
         'Chrome stops suggesting details from Gmail. Saved addresses, cards and\npasswords have their own switches and keep working.'),
        ('Remove one suggestion', 'Chrome',
         'Hides that suggestion only. The original email stays in Gmail.'),
        ('Delete the email in Gmail', 'Gmail',
         'Chrome Help says the suggestion goes away too. Gemini Help says changes\nin connected apps can take days to reach Gemini.'),
        ('Disconnect Google Workspace', 'Gemini Connected Apps',
         "Gemini stops using Gmail, Calendar and Drive for Personal Intelligence.\nChrome's Enhanced autofill page links to these same settings."),
        ('Turn off Smarter form understanding', 'Chrome',
         "Chrome stops sending the page's URL and content to Google to read forms.\nFilling saved IDs and vehicle info depends on it."),
    ]
    row_h, gap = 0.172, 0.028
    for i, (action, where, effect) in enumerate(rows):
        y = 1 - (i + 1) * row_h - i * gap
        box(ax, 0.0, y, 1.0, row_h, cs.SURFACE)
        ax.text(0.02, y + row_h * 0.64, action, fontsize=14, fontweight='bold', va='center')
        ax.text(0.02, y + row_h * 0.28, where, fontsize=11.5, color=cs.ACCENT, fontweight='semibold', va='center')
        ax.text(0.37, y + row_h / 2, effect, fontsize=12, va='center', linespacing=1.35)
    cs.footer(fig, HELP, 'Smarter form understanding: Google blog, November 3, 2025, and Chrome 156 settings text.')
    cs.save(fig, f'{OUT}/chrome-gmail-autofill-switches.webp')


def timeline():
    """2025-11-03 → 2026-10-28 → 2026-11-03, 날짜 없는 Photos"""
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'How Chrome autofill moved from saved info to your inbox',
              'Dates from Google announcements and the Chrome release schedule.')
    ax = canvas(fig, (0.03, 0.14, 0.94, 0.66))
    ax.plot([0.05, 0.95], [0.62, 0.62], color=cs.BORDER, lw=3, zorder=0)
    events = [
        (0.11, 'Nov 3, 2025', 'Smarter form understanding\nfills passports, licenses and\nvehicle info you saved', cs.MUTED),
        (0.38, 'Oct 28, 2026', 'Enhanced autofill pulls order,\ntracking and flight details\nfrom Gmail (US first)', cs.ACCENT),
        (0.65, 'Nov 3, 2026', 'Chrome 157 reaches the\nstable channel', cs.MUTED),
        (0.885, 'No date', "Photos: named in Chrome's\nsetting text, not yet in\nGoogle's announcement", cs.MUTED),
    ]
    for x, date, text, color in events:
        ax.scatter([x], [0.62], s=260, color=color, zorder=3)
        ax.text(x, 0.8, date, fontsize=15, fontweight='bold', ha='center', color=cs.ACCENT if color == cs.ACCENT else cs.FOREGROUND)
        ax.text(x, 0.47, text, fontsize=12, ha='center', va='top', linespacing=1.4)
    cs.footer(fig, 'Sources: Google blog posts of November 3, 2025 and October 28, 2026; chromiumdash.appspot.com schedule; Chrome 156 interface text.')
    cs.save(fig, f'{OUT}/chrome-autofill-gmail-timeline.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    settings_page()
    requirements()
    switches()
    timeline()
