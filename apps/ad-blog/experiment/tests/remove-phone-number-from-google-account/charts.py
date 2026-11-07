"""Google 계정 전화번호 삭제 글 그래픽: 도움말 화면 캡처 2장 + 지워지지 않을 때 + 바꾼 뒤 일정 (1200×675 webp).

내용 출처는 factcheck.md. 캡처 원본 `help-3463280-remove-number.png`·`help-183723-recovery-phone.png`는 shot.cjs로 찍은
support.google.com/accounts/answer/3463280·183723 (Computer) 화면 (1100px 폭, 2배율, 2026-10-25 UTC).
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


def screenshot(src, title, subtitle, rect, source, out):
    """도움말 캡처에서 좌우 회색 테두리를 잘라 넣고, rect(자른 뒤 픽셀 기준 x, y, w, h)를 accent 상자로 표시"""
    img = Image.open(HERE / src).convert('RGB')
    img = img.crop((40, 0, 1485, img.height))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, title, subtitle)
    h_px = 470
    w_px = h_px * img.width / img.height
    left = (1200 - w_px) / 2
    ax = fig.add_axes([left / 1200, 0.115, w_px / 1200, h_px / 675])
    ax.imshow(img)
    ax.axis('off')
    ax.add_patch(Rectangle(rect[:2], rect[2], rect[3], fill=False, edgecolor=cs.ACCENT, lw=3, zorder=3))
    cs.footer(fig, f'Source: {source}, captured in Chromium on October 25, 2026. Box added by ToolProof.')
    cs.save(fig, f'{OUT}/{out}')


def help_screenshots():
    # 'Delete your phone number' 항목: 자른 뒤 기준 약 x 160~1260, y 592~697
    screenshot('help-3463280-remove-number.png', 'Google\'s steps: Personal info > Phone > Delete',
               'Google Account Help, "Change the phone number on your account & how it\'s used" (Computer), October 25, 2026.',
               (150, 588, 1120, 112), 'support.google.com/accounts/answer/3463280', 'google-help-remove-phone-number.webp')
    # 'Tip: If you delete your recovery phone number...' 문단: 자른 뒤 기준 약 x 155~1265, y 620~715
    screenshot('help-183723-recovery-phone.png', 'Deleting your recovery phone doesn\'t remove the number everywhere',
               'Google Account Help, "Set up recovery options" (Computer), expanded section, October 25, 2026.',
               (145, 612, 1130, 112), 'support.google.com/accounts/answer/183723', 'google-help-recovery-phone-tip.webp')


# (증상·원인, 해결, 출처)
FIXES = [
    ('Google won\'t let you change recovery info',
     'Something about this sign-in looks different. Try from a device\nand place you normally use, or from this device the next week', '183723'),
    ('It\'s a work or school account',
     'Your administrator may control these settings. Ask them', '183723'),
    ('The number comes back on Android',
     'Turn off Phone number verification in your phone\'s Settings,\nthen delete the number again', '7521240'),
    ('Another Google service still shows it',
     'Change it in that service: 2-Step Verification, Calendar,\nChrome, Google Pay or Google My Business', '3463280'),
    ('It\'s a Google Voice number',
     'Delete it in Google Voice under Settings > Account.\nYou can reclaim it for 90 days', 'Voice 150640'),
]


def fixes_table():
    fig, ax = canvas('Can\'t remove the number? Match the cause',
                     'Each fix comes from Google\'s own help pages. The last column names the page.')
    for x, c in [(0.0, 'What you see'), (0.36, 'What to do'), (0.86, 'Google page')]:
        ax.text(x + 0.012, 0.975, c, fontsize=12.5, color=cs.MUTED, va='center', fontweight='semibold')
    rh = 0.185
    for i, (cause, fix, src) in enumerate(FIXES):
        y = 0.85 - i * rh
        hi = i == 0
        if hi:
            box(ax, 0.0, y - rh / 2 + 0.01, 1.0, rh - 0.02, cs.SURFACE)
        ax.text(0.012, y, cause, fontsize=13, fontweight='bold', va='center', zorder=2,
                color=cs.ACCENT if hi else cs.FOREGROUND)
        ax.text(0.372, y, fix, fontsize=12, va='center', linespacing=1.4, zorder=2)
        ax.text(0.872, y, src, fontsize=12, va='center', zorder=2, color=cs.MUTED)
        if i < len(FIXES) - 1:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1)
    cs.footer(fig, 'Sources: support.google.com/accounts/answer/183723, 3463280, /android/answer/7521240 and /voice/answer/150640,',
              'opened October 25, 2026. Numbers are Google help article IDs.')
    cs.save(fig, f'{OUT}/cant-remove-phone-number-fixes.webp')


# (시점, 설명)
EVENTS = [
    ('Day 0', 'You delete or change\nthe number'),
    ('First 7 days', 'Google may still send codes\nto your previous info, and a\nnew recovery or 2-Step\nVerification number isn\'t\nfully trusted yet'),
    ('About 1 week', 'A new number may not work\nfor sensitive actions, like\nchanging your password,\nbefore this'),
    ('90 days', 'Last day to reclaim a\ndeleted Google Voice\nnumber'),
]


def timeline():
    fig, ax = canvas('What to expect after you remove or change a number',
                     'Google says the wait lets you quickly secure your account if someone else changed your settings.')
    y = 0.62
    ax.plot([0.04, 0.96], [y, y], color=cs.BORDER, lw=3, zorder=1)
    n = len(EVENTS)
    for i, (d, t) in enumerate(EVENTS):
        x = 0.11 + i * (0.78 / (n - 1))
        cur = i == 1
        ax.scatter([x], [y], s=260, color=cs.ACCENT if cur else cs.MUTED, zorder=3)
        ax.text(x, y + 0.13, d, ha='center', va='center', fontsize=15, fontweight='bold',
                color=cs.ACCENT if cur else cs.FOREGROUND)
        ax.text(x, y - 0.1, t, ha='center', va='top', fontsize=12.5, linespacing=1.45)
    cs.footer(fig, 'Sources: Google Account Help 183723 (codes to previous info, recovery phone), 185839 (2-Step Verification phone), 3463280',
              '(sensitive actions) and Google Voice Help 150640 (reclaim), opened October 25, 2026. Google\'s pages say "may" and "up to."')
    cs.save(fig, f'{OUT}/phone-number-change-waiting-period.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    help_screenshots()
    fixes_table()
    timeline()
