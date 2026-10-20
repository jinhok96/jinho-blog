"""Gemini Personal Intelligence on Android Auto: 데이터 흐름도 + 설정별 효과 표 (1200×675 webp).

내용 출처는 factcheck.md (Google 블로그 2026-10-20, Gemini 도움말 16836988·16598406·16735982·13278892, 2026-10-21 확인).
실행: python3 -I charts.py <출력 폴더>
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'

# Connected Apps (도움말 16598406 "What Google apps work with Personal Intelligence")
SOURCES = [
    ('Gmail, Calendar, Drive', 'Google Workspace'),
    ('Photos and videos', 'Google Photos'),
    ('Saved places, searches', 'Search services, Maps'),
    ('Watch history', 'YouTube'),
    ('Payment info, receipts', 'Google Wallet (US)'),
    ('Contacts', 'Contacts (US, AI Ultra plan)'),
]


def box(ax, x, y, w, h, fill, edge=None, lw=0):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0,rounding_size=0.012',
                                facecolor=fill, edgecolor=edge or fill, lw=lw, zorder=2))


def arrow(ax, p, q):
    ax.add_patch(FancyArrowPatch(p, q, arrowstyle='-|>', mutation_scale=16, color=cs.MUTED, lw=1.6, zorder=1))


def data_flow():
    fig = plt.figure(figsize=cs.FIGSIZE)
    ax = fig.add_axes([0.03, 0.11, 0.94, 0.72])
    ax.set_xlim(-0.005, 1.005)
    ax.set_ylim(-0.02, 1.02)
    ax.axis('off')
    cs.header(fig, 'What Gemini can draw on when you ask in the car',
              'Only after you opt in to Personal Intelligence. The setting follows your account from phone to car.')

    # 왼쪽: 연결 앱
    ax.text(0.0, 1.0, 'Connected Apps you choose', fontsize=13, color=cs.MUTED, fontweight='semibold')
    h, gap = 0.12, 0.03
    for i, (what, app) in enumerate(SOURCES):
        y = 0.93 - i * (h + gap) - h
        box(ax, 0.0, y, 0.33, h, cs.SURFACE, cs.BORDER, 1)
        ax.text(0.02, y + h * 0.62, what, fontsize=14, fontweight='semibold', va='center')
        ax.text(0.02, y + h * 0.27, app, fontsize=11.5, color=cs.MUTED, va='center')
        arrow(ax, (0.335, y + h / 2), (0.425, 0.4 + 0.2 * (len(SOURCES) - 1 - i) / (len(SOURCES) - 1)))

    # 가운데: Gemini
    box(ax, 0.43, 0.36, 0.2, 0.28, cs.ACCENT)
    ax.text(0.53, 0.53, 'Gemini', fontsize=20, fontweight='bold', color=cs.BACKGROUND, ha='center', va='center')
    ax.text(0.53, 0.44, 'Personal Intelligence', fontsize=12, color=cs.BACKGROUND, ha='center', va='center')

    # 오른쪽 위: 차 안 음성 답변
    arrow(ax, (0.635, 0.56), (0.685, 0.7))
    box(ax, 0.685, 0.58, 0.31, 0.27, cs.BACKGROUND, cs.ACCENT, 2)
    ax.text(0.705, 0.785, 'Spoken answer in the car', fontsize=14.5, fontweight='bold', va='center')
    ax.text(0.705, 0.71, 'Android Auto: rolling out now', fontsize=12, color=cs.MUTED, va='center')
    ax.text(0.705, 0.65, 'Google built-in cars: coming months', fontsize=12, color=cs.MUTED, va='center')

    # 오른쪽 아래: 저장
    arrow(ax, (0.635, 0.44), (0.685, 0.3))
    box(ax, 0.685, 0.15, 0.31, 0.27, cs.BACKGROUND, cs.BORDER, 1.5)
    ax.text(0.705, 0.355, 'Saved to Gemini Apps Activity', fontsize=14.5, fontweight='bold', va='center')
    ax.text(0.705, 0.28, 'Auto-deleted after 18 months by default', fontsize=12, color=cs.MUTED, va='center')
    ax.text(0.705, 0.22, 'Summaries can be used to train AI', fontsize=12, color=cs.MUTED, va='center')

    cs.footer(fig, 'Source: Google blog (Oct 20, 2026), Gemini Apps Help: Connected Apps, Gemini Apps Activity. Checked Oct 21, 2026.')
    cs.save(fig, f'{OUT}/gemini-car-data-flow.webp')


# 설정별 효과 (도움말 16598406 "Delete something Gemini knows about you", 13278892 Keep Activity)
ROWS = [
    ('Disconnect an app', 'Connected Apps settings', 'yes', 'no'),
    ('Delete Gemini chats', 'Gemini Apps Activity', 'no', 'yes'),
    ('Turn off Keep Activity', 'Gemini Apps Activity', 'yes', 'opt'),
    ('Disconnect and delete', 'Both of the above', 'yes', 'yes'),
]
COLS = ['Stops Gemini from using\nthat app from now on', 'Removes what Gemini\nalready has in past chats']


def settings_matrix():
    fig = plt.figure(figsize=cs.FIGSIZE)
    ax = fig.add_axes([0.03, 0.11, 0.94, 0.72])
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    cs.header(fig, 'Which Gemini setting does what',
              'Google says you need both steps to fully remove something Gemini learned from a connected app.')
    xs = [0.6, 0.85]
    for x, c in zip(xs, COLS):
        ax.text(x, 0.93, c, fontsize=12.5, color=cs.MUTED, ha='center', va='center', fontweight='semibold')
    rh = 0.19
    for i, (name, where, a, b) in enumerate(ROWS):
        y = 0.72 - i * rh
        if i == len(ROWS) - 1:
            box(ax, 0.0, y - rh / 2 + 0.01, 1.0, rh - 0.02, cs.SURFACE)
        ax.text(0.02, y + 0.025, name, fontsize=16, fontweight='bold', va='center')
        ax.text(0.02, y - 0.04, where, fontsize=12, color=cs.MUTED, va='center')
        for x, v in zip(xs, (a, b)):
            if v == 'yes':
                ax.text(x, y, 'Yes', fontsize=16, fontweight='bold', color=cs.ACCENT, ha='center', va='center')
            elif v == 'no':
                ax.text(x, y, 'No', fontsize=15, fontweight='semibold', color=cs.MUTED, ha='center', va='center')
            else:
                ax.text(x, y, 'Only with "Turn off\nand delete activity"', fontsize=11.5, color=cs.FOREGROUND,
                        ha='center', va='center', fontweight='semibold')
        if i < len(ROWS) - 1:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1)
    cs.footer(fig, 'Turning off Keep Activity turns off Personal Intelligence, which requires it. Chats are still kept up to 72 hours.',
              'Source: Gemini Apps Help, "Connect your Google apps" and "Manage & delete your activity". Checked Oct 21, 2026.')
    cs.save(fig, f'{OUT}/gemini-settings-what-they-do.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    data_flow()
    settings_matrix()
