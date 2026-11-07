"""2 TB 공유 저장 공간을 넘으면: Microsoft 문서 두 곳의 다른 설명 비교 카드 (1200×675 webp, 디자인 시스템 라이트 모드).

내용 출처: support.microsoft.com/en-us/onedrive/changes-to-microsoft-365-storage ·
support.microsoft.com/en-us/onedrive/microsoft-storage-quotas, 2026-10-27에 받은 원문
`source-*-2026-10-27.txt`. 문장 대조는 factcheck.md "2026-10-27 재확인".
실행: python -I over_limit_card.py <출력 폴더>  (matplotlib·Pillow가 있는 python)
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'

# (문서 이름, 주소, [(시점, 설명)], 강조 여부). 더 엄격한 쪽을 강조
DOCS = [
    ('"Changes to Microsoft 365 storage"', 'support.microsoft.com/…/changes-to-microsoft-365-storage', [
        ('Near 2 TB', 'You get notifications so you can\nfree up space or buy more'),
        ('Over 2 TB', 'You can keep accessing your files\nfor up to one year while you\nmanage your storage'),
    ], False),
    ('"Microsoft storage quotas"', 'support.microsoft.com/…/microsoft-storage-quotas', [
        ('Over the limit', 'OneDrive turns read-only and new\nfiles stop syncing, camera roll too.\nOutlook.com can\'t send or receive'),
        ('After 3 months', 'Your OneDrive account is frozen'),
        ('After 6 months', 'Microsoft might delete your\nOneDrive and all files in it'),
    ], True),
]


def box(ax, x, y, w, h, fill, edge, lw):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0,rounding_size=0.012',
                                facecolor=fill, edgecolor=edge, lw=lw, zorder=1))


def over_limit_card():
    fig = plt.figure(figsize=cs.FIGSIZE)
    ax = fig.add_axes([0.03, 0.11, 0.94, 0.72])
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    cs.header(fig, 'What happens if your family goes over 2 TB',
              'Two Microsoft support pages give different answers, and neither says which applies to a shared pool')
    gap = 0.03
    w = (1 - gap) / 2
    for i, (name, url, steps, hi) in enumerate(DOCS):
        x = i * (w + gap)
        color = cs.ACCENT if hi else cs.MUTED
        box(ax, x, 0, w, 1, cs.SURFACE, cs.ACCENT if hi else cs.BORDER, 2.5 if hi else 1)
        ax.text(x + 0.025, 0.93, name, fontsize=16, fontweight='bold', va='top', zorder=2)
        ax.text(x + 0.025, 0.85, url, fontsize=11, color=cs.MUTED, va='top', zorder=2)
        row_h = 0.74 / 3
        top = 0.74
        # 시점을 잇는 세로선
        ax.plot([x + 0.04, x + 0.04], [top - 0.03, top - row_h * (len(steps) - 1) - 0.03],
                color=color, lw=2, zorder=2, solid_capstyle='round')
        for j, (when, text) in enumerate(steps):
            y = top - j * row_h
            ax.scatter([x + 0.04], [y - 0.03], s=150, color=color, zorder=3, linewidths=0)
            ax.text(x + 0.07, y - 0.03, when, fontsize=14, fontweight='semibold', va='center',
                    color=cs.ACCENT if hi else cs.FOREGROUND, zorder=2)
            ax.text(x + 0.205, y, text, fontsize=12, va='top', linespacing=1.45, zorder=2)
    cs.footer(fig, 'Sources: Microsoft Support, "Changes to Microsoft 365 storage" and "Microsoft storage quotas", opened Oct 27, 2026.')
    cs.save(fig, f'{OUT}/microsoft-365-over-2tb-two-answers.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    over_limit_card()
