"""summary.json → 정확도·속도 나란히 막대 그래프, 메모리 그래프 (webp)."""
import json, io
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image
S = json.load(open('summary.json'))
ORDER = ['bria-rmbg', 'birefnet-general', 'birefnet-general-lite', 'isnet-general-use', 'u2netp', 'u2net', 'silueta', 'u2net_human_seg']
LAB = {'bria-rmbg': 'bria-rmbg (default)'}
SURF, INK, INK2, GRID, BLUE = '#fcfcfb', '#0b0b0b', '#52514e', '#e4e3df', '#2a78d6'
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 15, 'text.color': INK, 'axes.labelcolor': INK2, 'xtick.color': INK2, 'ytick.color': INK})
def save(fig, path):
    b = io.BytesIO(); fig.savefig(b, format='png', dpi=100, facecolor=SURF); Image.open(b).convert('RGB').save(path, 'WEBP', quality=90); print(path)
def bars(ax, vals, fmt, title, xmax):
    y = list(range(len(ORDER)))[::-1]
    ax.barh(y, vals, color=BLUE, height=0.62)
    for yi, v in zip(y, vals): ax.text(v + xmax * 0.015, yi, fmt(v), va='center', fontsize=14, color=INK)
    ax.set_yticks(y); ax.set_xlim(0, xmax); ax.set_title(title, loc='left', fontsize=17, color=INK, pad=12)
    ax.set_facecolor(SURF); ax.grid(axis='x', color=GRID, lw=1); ax.set_axisbelow(True)
    for s in ['top', 'right', 'left']: ax.spines[s].set_visible(False)
    ax.spines['bottom'].set_color(GRID); ax.tick_params(axis='y', length=0)
fig, (a, b) = plt.subplots(1, 2, figsize=(12, 6.75), sharey=True, gridspec_kw={'wspace': 0.08})
bars(a, [S[m]['non_transparent']['clean_rate'] * 100 for m in ORDER], lambda v: f'{v:.0f}%', 'Clean cutouts (IoU ≥ 0.95, 44 photos)', 112)
a.set_yticklabels([LAB.get(m, m) for m in ORDER])
bars(b, [S[m]['median_sec'] for m in ORDER], lambda v: f'{v:.1f} s' if v < 10 else f'{v:.0f} s', 'Seconds per image (4-core CPU)', 54)
fig.suptitle('Free offline background removal: 8 rembg models tested', x=0.012, ha='left', fontsize=20, fontweight='bold', color=INK, y=0.985)
fig.text(0.012, 0.015, 'ToolProof test, Oct 2026 · rembg 2.0.85 · AIM-500 sample · no GPU', fontsize=12, color=INK2)
fig.subplots_adjust(left=0.2, right=0.98, top=0.83, bottom=0.08)
save(fig, 'img/background-removal-accuracy-speed.webp')
fig, ax = plt.subplots(figsize=(12, 6))
bars(ax, [S[m]['cli_one_image']['peak_rss_gb'] for m in ORDER], lambda v: f'{v:.1f} GB', 'Peak RAM to cut out one photo (rembg command line)', 11.5)
ax.set_yticklabels([LAB.get(m, m) for m in ORDER])
fig.text(0.012, 0.02, 'ToolProof test, Oct 2026 · rembg 2.0.85, default settings · 512×512 photo · Linux, no GPU', fontsize=12, color=INK2)
fig.subplots_adjust(left=0.2, right=0.97, top=0.88, bottom=0.12)
save(fig, 'img/background-removal-memory.webp')
