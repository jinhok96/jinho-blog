"""iPhone Handoff를 켜면 달라지는 6가지 카드 그래픽 (1200×675 webp, 디자인 시스템 라이트 모드).

내용 출처: Apple "Set up iPhone Handoff" (support.apple.com/en-us/127274, 2026-10-19 개정판),
2026-10-27 09:34 UTC에 받은 원문 `source-apple-127274-2026-10-27.txt`. 문장 대조는 factcheck.md "2026-10-27 재확인".
실행: python -I rules_card.py <출력 폴더>  (matplotlib·Pillow가 있는 python)
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'

# (제목, 설명, 강조 여부). 강조는 돈이 계속 나가는 함정 1개만
RULES = [
    ('One main iPhone', 'Call Forwarding, Caller ID and\ncarrier account settings can only\nbe managed on the main iPhone.', False),
    ('One active at a time', 'Your number is active only on the\niPhone you unlocked. It shows\n"Switched to this iPhone."', False),
    ('Apple Watch stays put', 'Handoff doesn\'t switch your watch\nto the other iPhone. Pair it to the\none you use most.', False),
    ('Some Wallet items stay', 'Payment cards work on both. Some\ntransit passes, IDs and badges\nmight work on one at a time.', False),
    ('Some apps ask again', 'Banking apps may need you to\napprove the second iPhone from\nthe first one.', False),
    ('Deleting the eSIM\nisn\'t enough', 'You must contact your carrier to\nturn it off, or it may keep\ncharging you.', True),
]


def box(ax, x, y, w, h, fill, edge, lw):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0,rounding_size=0.012',
                                facecolor=fill, edgecolor=edge, lw=lw, zorder=1))


def rules_card():
    fig = plt.figure(figsize=cs.FIGSIZE)
    ax = fig.add_axes([0.03, 0.11, 0.94, 0.72])
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    cs.header(fig, 'What changes once two iPhones share one number',
              'Six rules from Apple\'s iPhone Handoff guide, beyond the monthly carrier fee')
    cols, rows, gap = 3, 2, 0.025
    w = (1 - gap * (cols - 1)) / cols
    h = (1 - gap * (rows - 1)) / rows
    for i, (title, text, hi) in enumerate(RULES):
        c, r = i % cols, i // cols
        x, y = c * (w + gap), 1 - (r + 1) * h - r * gap
        box(ax, x, y, w, h, cs.SURFACE, cs.ACCENT if hi else cs.BORDER, 2.5 if hi else 1)
        ax.text(x + 0.022, y + h - 0.07, title, fontsize=17, fontweight='bold', va='top', linespacing=1.15,
                color=cs.ACCENT if hi else cs.FOREGROUND, zorder=2)
        ax.text(x + 0.022, y + 0.05, text, fontsize=12.5, va='bottom', linespacing=1.5, zorder=2)
    cs.footer(fig, 'Source: Apple, "Set up iPhone Handoff" (support.apple.com/en-us/127274, updated Oct 19, 2026), opened Oct 27, 2026.')
    cs.save(fig, f'{OUT}/iphone-handoff-what-changes.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    rules_card()
