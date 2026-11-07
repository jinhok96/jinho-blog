"""Gemini 무료 Flash-Lite 전환: 쓰는 방식에 맞는 가장 싼 요금제를 고르는 흐름도 (1200×675 webp, 2026-11-01 추가).

질문·결과의 출처는 factcheck.md "2026-11-01 후속 확인" (Gemini 도움말 17004136·16275805·18648722,
gemini.google/subscriptions·students). 쪽수는 Google 환산(1M 토큰 ≈ 1,500쪽)과 같은 비율. 디자인 시스템 라이트 모드(chart_style).
실행: python3 -I decision_chart.py <출력 폴더>
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else '.'

# (질문, 질문 보조 문구, 오른쪽 화살표 답, 결과 제목, 결과 설명, 결과 강조 여부, 아래 화살표 답)
# 학생 질문을 둘째로 둠: 49~192쪽이 필요한 학생도 AI Plus($4.99)보다 무료 1년 AI Pro가 싸므로
STEPS = [
    ('Do you work with files or chats over about 48 pages?', 'The free plan reads about 32,000 tokens at a time',
     'No', 'Free, with Auto turned on', 'Flash-Lite for most prompts; Auto may pick Flash or Pro', False, 'Yes'),
    ('Are you a U.S. college student, 18 or older?', "Google's student offer on gemini.google/students",
     'Yes', 'Free year of Google AI Pro', 'Redeem by Dec 31, 2026; renews at $19.99 a month', True, 'No'),
    ('Need more than about 192 pages, or Pro on demand?', 'AI Plus keeps Flash but loses Pro on the date in its email',
     'No', 'Google AI Plus, $4.99 a month', 'Flash-Lite and Flash; 128,000 tokens, about 192 pages', False, 'Yes'),
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
    cs.header(fig, 'Which Gemini plan covers how you use it',
              'Answer from the top and follow your answer. Each box on the right is the cheapest plan that fits.')

    q_x, q_w, q_h = 0.36, 5.75, 0.78
    r_x, r_w = 7.0, 4.64
    top = 4.55
    step = 1.12
    for i, (question, hint, right, result, detail, strong, down) in enumerate(STEPS):
        y = top - i * step
        box(ax, q_x, y, q_w, q_h, cs.SURFACE, ec=cs.BORDER, lw=1)
        ax.text(q_x + 0.2, y + q_h * 0.66, question, fontsize=14, fontweight='semibold', va='center', zorder=3)
        ax.text(q_x + 0.2, y + q_h * 0.28, hint, fontsize=11.5, color=cs.MUTED, va='center', zorder=3)
        face, title_color, detail_color = (cs.ACCENT, cs.BACKGROUND, cs.BACKGROUND) if strong else \
            (cs.BACKGROUND, cs.FOREGROUND, cs.MUTED)
        box(ax, r_x, y, r_w, q_h, face, ec='none' if strong else cs.BORDER, lw=0 if strong else 1)
        ax.text(r_x + 0.2, y + q_h * 0.66, result, fontsize=13.5, fontweight='bold', color=title_color,
                va='center', zorder=3)
        ax.text(r_x + 0.2, y + q_h * 0.28, detail, fontsize=10.5, color=detail_color, va='center', zorder=3)
        arrow(ax, (q_x + q_w, y + q_h / 2), (r_x, y + q_h / 2), right, ((q_x + q_w + r_x) / 2, y + q_h / 2 + 0.16))
        arrow(ax, (q_x + 0.9, y), (q_x + 0.9, y - (step - q_h)), down, (q_x + 1.25, y - (step - q_h) / 2))

    # 마지막 "Yes" → Google AI Pro
    y = top - len(STEPS) * step
    box(ax, q_x, y, 11.28, q_h, cs.BACKGROUND, ec=cs.BORDER, lw=1)
    ax.text(q_x + 0.2, y + q_h * 0.66, 'Google AI Pro, $19.99 a month', fontsize=14, fontweight='bold',
            va='center', zorder=3)
    ax.text(q_x + 0.2, y + q_h * 0.28, 'Adds Pro and Argon; 1 million tokens, about 1,500 pages, and 4x the free limits',
            fontsize=11.5, color=cs.MUTED, va='center', zorder=3)

    cs.footer(fig, 'Page counts use Google\'s own ratio (1 million tokens is about 1,500 pages). U.S. prices. '
                   'Ultra, from $99.99 a month, adds higher limits.',
              'Sources: Gemini Apps Help, gemini.google/subscriptions and gemini.google/students, checked Nov 1, 2026')
    cs.save(fig, f'{OUT}/gemini-which-plan-fits.webp')


if __name__ == '__main__':
    main()
