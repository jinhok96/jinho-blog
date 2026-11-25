"""windows-10-esu-extended 본문 그래픽 3장 (1200×675 webp, 디자인 시스템 라이트 모드 토큰). 2026-11-26 세션 105 전환

1. windows-10-esu-build-check.webp — Windows 10 22H2 빌드 번호 추이(2025-10 ~ 2026-11)와 '등록 안 됨·밀림·최신' 구간
2. enroll-now-missing-checklist.webp — Enroll now가 안 보일 때 확인 순서
3. esu-enrollment-options-us-europe.webp — 등록 방법 미국 vs 유럽 경제 지역

빌드·날짜: source-windows10-release-information-2026-11-25.txt (Microsoft Learn Windows 10 release information, Version 22H2 표)
규칙·조건: source-esu-page-us-2026-11-25.txt, source-esu-page-ie-2026-11-25.txt, source-kb5126256-2026-11-25.txt, source-kb5071959-2026-11-25.txt
실행: /tmp/charts/bin/python -I charts.py <출력 폴더>
"""
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.dates as mdates  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Ellipse, FancyBboxPatch  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'
CHECKED = date(2026, 11, 25)
HERE = Path(__file__).resolve().parent

# release information 표에서 읽음 (B = 월간 보안 업데이트, OOB = 대역 외)
def builds():
    rows = []
    text = (HERE / 'source-windows10-release-information-2026-11-25.txt').read_text(encoding='utf-8')
    block = text.split('Version 22H2 (OS build 19045)', 1)[1].split('Learn more about your options', 1)[0]
    for line in block.splitlines():
        parts = line.split('\t')
        if len(parts) == 5 and parts[0] == 'General Availability Channel':
            _, kind, day, build, kb = parts
            y, m, d = map(int, day.split('-'))
            rows.append((date(y, m, d), kind.split()[-1], int(build.split('.')[1]), kb))
    return sorted(rows)


def dot(fig, x, y, r, color):
    """그림 좌표의 원 (가로세로 비율 16:9 보정)"""
    w, h = cs.FIGSIZE
    fig.add_artist(Ellipse((x, y), 2 * r * h / w, 2 * r, transform=fig.transFigure, color=color))


def rounded_box(fig, x, y, w, h, color, radius=0.012):
    fig.add_artist(FancyBboxPatch((x, y), w, h, boxstyle=f'round,pad=0,rounding_size={radius}',
                                  transform=fig.transFigure, facecolor=color, edgecolor='none'))


def build_check():
    data = [r for r in builds() if r[0] >= date(2025, 10, 1)]
    monthly = [r for r in data if r[1] == 'B' and r[0] >= date(2025, 11, 1)]
    assert len(monthly) == 13, len(monthly)
    n = mdates.date2num
    fig, ax = cs.figure()
    cs.style_axes(ax, grid_axis='y')
    fig.subplots_adjust(left=0.1, right=0.74, top=0.8, bottom=0.17)
    x0, x1 = n(date(2025, 9, 20)), n(date(2026, 12, 10))
    ax.set_xlim(x0, x1)
    ax.set_ylim(6350, 8000)
    # 구간: 등록 안 됨(≤6466) · 밀림(6575~7811) · 최신(≥7846)
    ax.axhspan(6350, 6520, color=cs.SURFACE, zorder=0)
    ax.axhspan(7828, 8000, color=cs.ACCENT, alpha=0.12, zorder=0)
    xs = [n(r[0]) for r in data]
    ys = [r[2] for r in data]
    ax.step(xs, ys, where='post', color=cs.BORDER, lw=1.5, zorder=2)
    for d, kind, b, kb in data:
        esu = d >= date(2025, 11, 11) and kb != 'KB5071959'
        color = cs.ACCENT if esu and kind == 'B' else (cs.MUTED if not esu else cs.FOREGROUND)
        ax.plot([n(d)], [b], 'o' if kind == 'B' else 'D', ms=8 if kind == 'B' else 6, color=color, zorder=4)
    pts = {kb: (n(d), b) for d, kind, b, kb in data}
    arrow = dict(arrowstyle='-', color=cs.MUTED, lw=1, shrinkA=2, shrinkB=6)
    ax.annotate('Oct 14 and Nov 11, 2025: 19045.6456 (last free update)\nand 19045.6466 (enrollment fix for PCs not enrolled)',
                pts['KB5071959'], xytext=(n(date(2026, 1, 20)), 6435), ha='left', va='center',
                fontsize=11, color=cs.FOREGROUND, linespacing=1.3, arrowprops=arrow)
    ax.annotate('Nov 11, 2025: 19045.6575, the first ESU update', pts['KB5068781'],
                xytext=(n(date(2026, 1, 20)), 6610), ha='left', va='center', fontsize=11, color=cs.FOREGROUND,
                arrowprops=arrow)
    ax.annotate('Nov 10, 2026\n19045.7846', pts['KB5131096'], xytext=(-12, 14), textcoords='offset points',
                ha='right', va='center', fontsize=11, color=cs.FOREGROUND, linespacing=1.3)
    ax.xaxis.set_major_locator(mdates.MonthLocator(bymonth=[1, 4, 7, 10]))
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
    ax.set_yticks([6466, 6575, 7000, 7500, 7846])
    ax.set_yticklabels(['6466', '6575', '7000', '7500', '7846'], fontsize=11, color=cs.MUTED)
    ax.set_ylabel('Number after "19045."', fontsize=11.5, color=cs.MUTED)
    # 오른쪽 범례: 빌드를 보고 판단
    panel = [
        ('19045.7846 or higher', 'Up to date: ESU works', cs.ACCENT),
        ('19045.6575 to 19045.7811', 'Enrolled, but behind:\nCheck for updates', cs.FOREGROUND),
        ('19045.6466 or lower', 'No ESU update yet:\nnot enrolled', cs.MUTED),
    ]
    top = 0.77
    for i, (rng, meaning, color) in enumerate(panel):
        y = top - i * 0.19
        rounded_box(fig, 0.765, y - 0.155, 0.205, 0.165, cs.SURFACE)
        fig.text(0.778, y - 0.03, rng, fontsize=12, fontweight='bold', color=color, va='center')
        fig.text(0.778, y - 0.095, meaning, fontsize=11.5, color=cs.FOREGROUND, va='center', linespacing=1.3)
    cs.header(fig, 'Which Windows 10 build means ESU is working',
              'OS build of each Windows 10 version 22H2 update. Blue dots = the 13 monthly ESU security updates so far')
    cs.footer(fig, 'Source: Microsoft Learn, Windows 10 release information (Version 22H2 table), checked November 25, 2026.',
              'Diamonds = out-of-band fixes. Find your build in Settings > System > About > Windows specifications.')
    cs.save(fig, f'{OUT}/windows-10-esu-build-check.webp')


def checklist():
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Enroll now missing? Check these in order',
              'Microsoft shows the link in Windows Update only when the PC meets every requirement')
    rows = [
        ('Windows 10 version 22H2', 'Settings > System > About. Home, Pro, Pro Education or Pro for Workstations'),
        ('Latest updates + KB5126256', 'Install everything, including the ESU preparation package, then restart'),
        ('Administrator Microsoft account', 'Not a child account. On a child\'s PC, a parent enrolls from their own account'),
        ('No work or school management', 'Not domain or Entra joined, not in MDM, not kiosk mode (Entra registered is OK)'),
        ('No ESU license on the PC yet', 'Already enrolled? Check your build number instead'),
        ('Wizard fails partway', 'Install KB5071959 from Windows Update, restart, select Enroll now again'),
    ]
    top, row_h, left, width = 0.80, 0.112, 0.03, 0.94
    col = 0.33
    for i, (check, how) in enumerate(rows):
        y = top - (i + 1) * row_h
        rounded_box(fig, left, y + 0.01, col, row_h - 0.02, cs.SURFACE)
        rounded_box(fig, left + col + 0.01, y + 0.01, width - col - 0.01, row_h - 0.02, cs.SURFACE)
        cy = y + row_h / 2
        dot(fig, left + 0.03, cy, 0.04, cs.ACCENT)
        fig.text(left + 0.03, cy, str(i + 1), fontsize=13, fontweight='bold', color=cs.BACKGROUND, ha='center', va='center')
        fig.text(left + 0.065, cy, check, fontsize=13.5, fontweight='bold', va='center')
        fig.text(left + col + 0.025, cy, how, fontsize=12.5, va='center', color=cs.FOREGROUND)
    cs.footer(fig, 'Sources: Microsoft consumer ESU page (prerequisites, FAQ), KB5126256 and KB5071959 (Microsoft Support), checked November 25, 2026.',
              'After each fix, open Settings > Update & Security > Windows Update and look for Enroll now again.')
    cs.save(fig, f'{OUT}/enroll-now-missing-checklist.webp')


def options():
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Ways to enroll in Windows 10 ESU, U.S. vs Europe',
              "From Microsoft's U.S. and Irish consumer ESU pages. Every option covers the PC until October 12, 2027")
    cols = [(0.03, 0.22, 'Option'), (0.265, 0.345, 'United States'), (0.625, 0.345, 'European Economic Area')]
    top = 0.78
    for x, w, name in cols:
        fig.text(x + 0.012, top + 0.012, name, fontsize=12, color=cs.MUTED, fontweight='semibold')
    fig.add_artist(plt.Line2D([0.03, 0.97], [top, top], color=cs.BORDER, lw=1))
    rows = [
        ('Free', 'Sync your PC settings to your\nMicrosoft account', True,
         'Keep signing in to Windows with the\nMicrosoft account you enrolled with.\nUpdates stop within up to 60 days if not', True),
        ('1,000 Rewards\npoints', 'Redeem Microsoft Rewards points.\nRewards orders are final', True,
         'Not listed on the Irish page', False),
        ('$30 one time\n(plus tax)', 'Sign in with a Microsoft account\nto enroll', True,
         'Lets you keep a local account\nafter the purchase', True),
    ]
    row_h = 0.205
    for i, (opt, us, us_ok, eu, eu_ok) in enumerate(rows):
        y = top - (i + 1) * row_h
        for x, w, _ in cols:
            rounded_box(fig, x, y + 0.01, w, row_h - 0.02, cs.SURFACE)
        cy = y + row_h / 2
        fig.text(0.042, cy, opt, fontsize=14, fontweight='bold', va='center', linespacing=1.25)
        for (x, w, _), text, ok in [(cols[1], us, us_ok), (cols[2], eu, eu_ok)]:
            color = cs.ACCENT if ok else cs.MUTED
            dot(fig, x + 0.025, cy, 0.016, color)
            fig.text(x + 0.045, cy, text, fontsize=12, va='center', color=cs.FOREGROUND if ok else cs.MUTED, linespacing=1.3)
    cs.footer(fig, 'Sources: microsoft.com/en-us and /en-ie "Windows 10 Consumer Extended Security Updates (ESU)", checked November 25, 2026.',
              'One license covers up to 10 PCs. Every option needs a Microsoft account sign-in at least once.')
    cs.save(fig, f'{OUT}/esu-enrollment-options-us-europe.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    build_check()
    checklist()
    options()
