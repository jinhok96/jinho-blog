"""Gemini 무료 Flash-Lite 전환: 요금제별 모델·한도 매트릭스 + 컨텍스트 창(쪽수 환산) 비교 (1200×675 webp).

출처는 factcheck.md (Gemini 도움말 17004136·16275805·18648722, gemini.google/subscriptions, 2026-10-21 확인).
실행: python3 -I charts.py <출력 폴더>
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
from matplotlib.patches import FancyBboxPatch  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'

# 요금제, 월 가격, 모델(Flash-Lite, Flash, Pro), 사용 한도, 컨텍스트 창
# 무료: Auto가 대부분 Flash-Lite, 추론이 필요한 질문만 Flash·Pro (17004136). AI Plus: 변경 후 Pro 제외
PLANS = [
    ('Free', '$0', ('yes', 'auto', 'auto'), 'Standard', '32k tokens'),
    ('Google AI Plus', '$4.99/mo', ('yes', 'yes', 'no'), '2x Free', '128k tokens'),
    ('Google AI Pro', '$19.99/mo', ('yes', 'yes', 'yes'), '4x Free', '1M tokens'),
    ('Google AI Ultra', 'from $99.99/mo', ('yes', 'yes', 'yes'), '5x or 20x Pro', '1M tokens'),
]
COLUMNS = ['Flash-Lite', 'Flash', 'Pro', 'Usage limit', 'Context window']


def pill(fig, x, y, w, h, text, face, color):
    fig.add_artist(FancyBboxPatch((x - w / 2, y - h / 2), w, h, boxstyle='round,pad=0,rounding_size=0.012',
                                  transform=fig.transFigure, facecolor=face, edgecolor='none'))
    fig.text(x, y, text, ha='center', va='center', fontsize=13, fontweight='semibold', color=color)


def plan_matrix():
    fig = cs.plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Which Gemini models each plan gets after the October 2026 change',
              'Free accounts moved to Flash-Lite on Oct 9. AI Plus loses Pro on a date Google sends by email.')
    col_x = [0.385, 0.5, 0.615, 0.745, 0.89]
    for x, c in zip(col_x, COLUMNS):
        fig.text(x, 0.76, c, ha='center', fontsize=13, fontweight='semibold', color=cs.MUTED)
    fig.add_artist(cs.plt.Line2D([0.03, 0.97], [0.735, 0.735], color=cs.BORDER, lw=1))
    for i, (name, price, models, limit, ctx) in enumerate(PLANS):
        y = 0.655 - i * 0.135
        fig.text(0.03, y + 0.018, name, fontsize=16, fontweight='bold', va='center')
        fig.text(0.03, y - 0.03, price, fontsize=13, color=cs.MUTED, va='center')
        for x, m in zip(col_x, models):
            if m == 'yes':
                pill(fig, x, y, 0.085, 0.06, 'Yes', cs.ACCENT, cs.BACKGROUND)
            elif m == 'auto':
                pill(fig, x, y, 0.085, 0.06, 'Auto only', cs.SURFACE, cs.FOREGROUND)
            else:
                fig.text(x, y, 'No', ha='center', va='center', fontsize=13, fontweight='semibold', color=cs.MUTED)
        fig.text(col_x[3], y, limit, ha='center', va='center', fontsize=13.5, fontweight='semibold')
        fig.text(col_x[4], y, ctx, ha='center', va='center', fontsize=13.5, fontweight='semibold')
        if i < len(PLANS) - 1:
            fig.add_artist(cs.plt.Line2D([0.03, 0.97], [y - 0.0675, y - 0.0675], color=cs.BORDER, lw=1))
    cs.footer(fig, '"Auto only": with auto model selection on, most free prompts use Flash-Lite and harder ones may use Flash or Pro.',
              'AI Pro and Ultra also get Gemini 4 Argon. U.S. prices. Source: Gemini Apps Help, gemini.google/subscriptions, Oct 21, 2026')
    cs.save(fig, f'{OUT}/gemini-plans-models-limits.webp')


def context_pages():
    # Google: 1M 토큰 ≈ 1,500쪽 (16275805) → 같은 비율로 환산
    rows = [
        ('Free', 32_000, cs.MUTED),
        ('Google AI Plus', 128_000, cs.MUTED),
        ('Google AI Pro / Ultra', 1_000_000, cs.ACCENT),
    ]
    fig, ax = cs.figure()
    fig.subplots_adjust(left=0.22, right=0.95, top=0.8, bottom=0.2)
    ax.set_xlim(0, 1700)
    ax.set_ylim(-0.6, len(rows) - 0.4)
    ys = list(range(len(rows)))[::-1]
    for y, (name, tokens, color) in zip(ys, rows):
        pages = tokens * 1500 / 1_000_000
        cs.rounded_barh(ax, y, 0, pages, 0.5, color)
        tok = f'{tokens // 1000}k' if tokens < 1_000_000 else '1M'
        label = f'about {pages:,.0f} pages ({tok} tokens)'
        if pages > 1000:  # 긴 막대는 라벨을 막대 안쪽 오른쪽에
            ax.text(pages - 20, y, label, va='center', ha='right', fontsize=14, fontweight='semibold',
                    color=cs.BACKGROUND)
        else:
            ax.text(pages + 15, y, label, va='center', fontsize=14, fontweight='semibold')
    ax.set_yticks(ys)
    ax.set_yticklabels([r[0] for r in rows], fontsize=15, fontweight='semibold')
    ax.set_xticks(range(0, 1501, 250))
    ax.set_xticklabels([f'{t:,}' for t in range(0, 1501, 250)])
    cs.header(fig, 'How much text Gemini can read at once, by plan',
              'Context window converted to pages with Google\'s own figure: 1M tokens is about 1,500 pages.')
    cs.footer(fig, 'Page counts are our estimate at the same ratio; real documents vary with layout, tables and images.',
              'Source: Gemini Apps Help, "Gemini Apps limits & feature availability", checked Oct 21, 2026')
    cs.save(fig, f'{OUT}/gemini-context-window-pages.webp')


if __name__ == '__main__':
    plan_matrix()
    context_pages()
