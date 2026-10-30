"""Pixel Watch Safety Signal 종료: 12월 12일 전에 할 일이 있는지 고르는 흐름도 (1200×675 webp, 2026-10-30 추가).

질문·결과의 출처는 factcheck.md "2026-10-30 후속 확인". 디자인 시스템 라이트 모드(chart_style).
실행: python3 -I decision_chart.py <출력 폴더>
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else '.'

# (질문, 질문 보조 문구, "No"일 때 결과 제목, 결과 설명)
STEPS = [
    ('Is it a Pixel Watch 2 or 3 LTE model?', None,
     'Not affected', 'Wi-Fi models never had it; Pixel Watch 4 and 5 don\'t use it'),
    ('Does the watch have no carrier plan of its own?', None,
     'No change', 'Your carrier line already handles calls away from your phone'),
    ('Does the Safety signal screen show a watch number?', 'Pixel Watch app > Safety & emergency > Safety signal',
     'No change', 'You never signed up, so nothing ends for you'),
    ('Is the wearer often without a phone nearby?', 'Count time at home on Wi-Fi, too',
     'You can let it end', 'With the phone nearby, SOS and Fall Detection still work'),
]


def box(ax, x, y, w, h, fc, ec='none', lw=0):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0,rounding_size=0.06',
                                fc=fc, ec=ec, lw=lw, zorder=2))


def arrow(ax, start, end, label=None, label_xy=None):
    ax.add_patch(FancyArrowPatch(start, end, arrowstyle='-|>', mutation_scale=16,
                                 color=cs.MUTED, lw=1.6, zorder=1, shrinkA=0, shrinkB=0))
    if label:
        ax.text(*label_xy, label, fontsize=12, fontweight='semibold', color=cs.MUTED,
                ha='center', va='center', zorder=3)


def main():
    fig = plt.figure(figsize=cs.FIGSIZE)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 6.75)
    ax.axis('off')
    cs.header(fig, 'Pixel Watch Safety Signal: do you need to act before Dec 12?',
              'Answer from the top. "Yes" moves down; "No" means nothing ends for you.')

    q_x, q_w, q_h = 0.36, 5.5, 0.68
    r_x, r_w = 6.75, 4.89
    top = 4.77
    step = 0.95
    for i, (question, hint, result, detail) in enumerate(STEPS):
        y = top - i * step
        box(ax, q_x, y, q_w, q_h, cs.SURFACE, ec=cs.BORDER, lw=1)
        if hint:
            ax.text(q_x + 0.2, y + q_h * 0.66, question, fontsize=14, fontweight='semibold', va='center', zorder=3)
            ax.text(q_x + 0.2, y + q_h * 0.27, hint, fontsize=11.5, color=cs.MUTED, va='center', zorder=3)
        else:
            ax.text(q_x + 0.2, y + q_h / 2, question, fontsize=14, fontweight='semibold', va='center', zorder=3)
        box(ax, r_x, y, r_w, q_h, cs.BACKGROUND, ec=cs.BORDER, lw=1)
        ax.text(r_x + 0.2, y + q_h * 0.66, result, fontsize=13.5, fontweight='bold', va='center', zorder=3)
        ax.text(r_x + 0.2, y + q_h * 0.27, detail, fontsize=11, color=cs.MUTED, va='center', zorder=3)
        arrow(ax, (q_x + q_w, y + q_h / 2), (r_x, y + q_h / 2), 'No', ((q_x + q_w + r_x) / 2, y + q_h / 2 + 0.16))
        arrow(ax, (q_x + 0.9, y), (q_x + 0.9, y - (step - q_h)), 'Yes', (q_x + 1.25, y - (step - q_h) / 2))

    # 마지막 "Yes" → 할 일 (accent)
    y = top - len(STEPS) * step
    act_w = 11.28
    box(ax, q_x, y - 0.12, act_w, q_h + 0.12, cs.ACCENT)
    ax.text(q_x + 0.2, y + q_h * 0.66 - 0.06, 'Add a cellular line for the watch before December 12, 2026',
            fontsize=14.5, fontweight='bold', color=cs.BACKGROUND, va='center', zorder=3)
    ax.text(q_x + 0.2, y + q_h * 0.22 - 0.06,
            'Google Fi on an Android phone includes one watch at no extra cost. Other carriers: ask for the monthly price.',
            fontsize=11.5, color=cs.BACKGROUND, va='center', zorder=3)

    cs.footer(fig, 'Sources: Google Pixel Watch Community announcement (Oct 8, 2026), Pixel Watch Help and Google Fi Help, '
                   'checked Oct 30, 2026')
    cs.save(fig, f'{OUT}/safety-signal-who-needs-to-act.webp')


if __name__ == '__main__':
    main()
