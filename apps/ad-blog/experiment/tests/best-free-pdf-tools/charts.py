"""best-free-pdf-tools 허브 글 그래픽 (데이터: PDF 측정 글 6편의 결과 표)

실행: python3 -I charts.py <출력 폴더>
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
from matplotlib.patches import Circle, FancyBboxPatch  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else '.'

TOOLS = ['PDFsam\nBasic', 'PDF\nArranger', 'Sejda\nDesktop', 'Chrome', 'GIMP', 'Libre-\nOffice', 'iLovePDF', 'PDF24']
# 작업별 측정 도구와 추천(P). 출처: 각 글의 요약 표·Which one should you use
JOBS = [
    ('Split a PDF', {'PDFsam\nBasic': 'P', 'PDF\nArranger': 'T', 'Chrome': 'T'}),
    ('Merge PDFs', {'PDFsam\nBasic': 'P', 'PDF\nArranger': 'T', 'Sejda\nDesktop': 'T'}),
    ('JPG to PDF', {'PDF\nArranger': 'P', 'Sejda\nDesktop': 'T', 'Chrome': 'T'}),
    ('PDF to JPG', {'Sejda\nDesktop': 'P', 'GIMP': 'T', 'Libre-\nOffice': 'T'}),
    ('PDF to Word', {'iLovePDF': 'P', 'Sejda\nDesktop': 'T', 'Libre-\nOffice': 'T'}),
    ('Compress PDF', {'iLovePDF': 'P', 'PDF24': 'T', 'Sejda\nDesktop': 'T'}),
]


def matrix():
    fig = cs.plt.figure(figsize=cs.FIGSIZE)
    ax = fig.add_axes([0.03, 0.11, 0.94, 0.68])
    ax.set_xlim(-2.6, len(TOOLS) - 0.5)
    ax.set_ylim(len(JOBS) - 0.5, -1.25)
    ax.axis('off')
    for j, t in enumerate(TOOLS):
        ax.text(j, -0.8, t, ha='center', va='center', fontsize=13, fontweight='semibold', linespacing=1.05)
    for i, (job, cells) in enumerate(JOBS):
        ax.text(-2.5, i, job, ha='left', va='center', fontsize=15, fontweight='semibold')
        ax.plot([-2.55, len(TOOLS) - 0.5], [i + 0.5, i + 0.5], color=cs.BORDER, lw=1, zorder=1)
        for j, t in enumerate(TOOLS):
            mark = cells.get(t)
            if mark == 'P':
                ax.add_patch(FancyBboxPatch((j - 0.4, i - 0.28), 0.8, 0.56, boxstyle='round,pad=0,rounding_size=0.08',
                                            facecolor=cs.ACCENT, edgecolor='none', zorder=3))
                ax.text(j, i, 'Our pick', ha='center', va='center', fontsize=12, fontweight='semibold',
                        color=cs.BACKGROUND, zorder=4)
            elif mark == 'T':
                ax.text(j, i, 'Tested', ha='center', va='center', fontsize=12, color=cs.MUTED, zorder=4)
            else:
                ax.add_patch(Circle((j, i), 0.035, facecolor=cs.BORDER, edgecolor='none', zorder=2))
    cs.header(fig, 'Best free PDF tool for each job, from our tests',
              '8 free tools, 3 per job, clicked through on their own screens (Oct 17-20, 2026)')
    cs.footer(fig, 'Picks are for most people; each linked test has picks for other situations. Dot = not tested for that job.')
    cs.save(fig, f'{OUT}/best-free-pdf-tool-per-job.webp')


def coverage():
    names = [t.replace('\n', ' ').replace('Libre- Office', 'LibreOffice') for t in TOOLS]
    counts = []
    for t in TOOLS:
        p = sum(1 for _, c in JOBS if c.get(t) == 'P')
        n = sum(1 for _, c in JOBS if t in c)
        counts.append((p, n))
    order = sorted(range(len(TOOLS)), key=lambda k: (-counts[k][1], -counts[k][0]))
    fig, ax = cs.figure()
    fig.subplots_adjust(left=0.17, right=0.95, top=0.79, bottom=0.17)
    ax.set_xlim(0, 6)
    ax.set_ylim(-0.6, len(order) - 0.4)
    ys = [len(order) - 1 - y for y in range(len(order))]
    ax.set_yticks(ys)
    ax.set_yticklabels([names[k] for k in order], fontsize=14, fontweight='semibold')
    ax.set_xticks(range(0, 7))
    for y, k in zip(ys, order):
        p, n = counts[k]
        cs.rounded_barh(ax, y, 0, n, 0.56, cs.MUTED)
        if p:
            cs.rounded_barh(ax, y, 0, p, 0.56, cs.ACCENT)
        label = f'{n} tested' + (f', {p} pick' + ('s' if p > 1 else '') if p else '')
        ax.text(n + 0.08, y, label, va='center', fontsize=13, fontweight='semibold')
    cs.header(fig, 'How many PDF jobs each free tool handled in our tests',
              'Number of the 6 PDF jobs we tested each tool on. Blue = our pick for that job, gray = tested but not our pick')
    cs.footer(fig, 'Sejda Desktop did 5 of 6 jobs, but its free version allows 3 tasks a day in total.',
              'Source: ToolProof tests of splitting, merging, JPG to PDF, PDF to JPG, PDF to Word and compressing, Oct 17-20, 2026')
    cs.save(fig, f'{OUT}/free-pdf-tools-jobs-covered.webp')


matrix()
coverage()
