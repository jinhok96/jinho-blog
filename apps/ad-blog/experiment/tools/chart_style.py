"""ToolProof 글 이미지(차트·비교 그래픽) 공통 스타일: ad-blog 디자인 시스템 라이트 모드

색은 `src/styles/globals.css`의 `@theme` 라이트 모드 토큰을 읽어 쓴다 (사이트 색을 바꾸면 이미지도 따라감).
글꼴은 사이트가 OS 기본 글꼴(SF Pro·Segoe UI·Roboto)을 쓰므로 컨테이너에서 가장 가까운 Inter로 대신한다.
규칙은 writing-guide.md 이미지 섹션. 필요 패키지: matplotlib, Pillow.

사용 (`tests/{slug}/charts.py`, 실행: `python3 -I charts.py <출력 폴더>`):
  import sys
  from pathlib import Path
  sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
  import chart_style as cs

  fig, ax = cs.figure()                      # 1200×675 (토큰·글꼴은 import 시 적용)
  fig.subplots_adjust(left=0.15, right=0.97, top=0.8, bottom=0.19)
  ax.set_xlim(...); ax.set_ylim(...)         # rounded_barh 전에 배치·축 범위 확정
  cs.rounded_barh(ax, y, left, width, 0.46, cs.ACCENT)
  cs.header(fig, 'Title', 'Subtitle')
  cs.footer(fig, 'Source: ...')
  cs.save(fig, f'{OUT}/name.webp')
"""

import io
import re
import sys
from pathlib import Path

import matplotlib

matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.patches import FancyBboxPatch
from PIL import Image

GLOBALS_CSS = Path(__file__).resolve().parents[2] / 'src/styles/globals.css'
SITE_NAME = 'ToolProof'
FIGSIZE = (12, 6.75)  # dpi 100 → 1200×675 (16:9)
RADIUS_PX = 6  # rounded-md


def _light_tokens() -> dict[str, str]:
    css = GLOBALS_CSS.read_text(encoding='utf-8')
    # 라이트 값은 @theme 블록, 다크 값은 그 뒤 @media 블록
    theme = css.split('@theme', 1)[-1].split('@media', 1)[0]
    tokens = dict(re.findall(r'--color-([a-z-]+):\s*(#[0-9a-fA-F]{6})', theme))
    missing = {'background', 'foreground', 'muted', 'surface', 'border', 'accent'} - tokens.keys()
    if missing:
        raise SystemExit(f'{GLOBALS_CSS}에서 토큰을 찾지 못함: {", ".join(sorted(missing))}')
    return tokens


_TOKENS = _light_tokens()
BACKGROUND = _TOKENS['background']  # 이미지 배경
FOREGROUND = _TOKENS['foreground']  # 제목·행 이름·값 라벨
MUTED = _TOKENS['muted']  # 부제·눈금·출처, 비교 대상·종료·기준 계열
SURFACE = _TOKENS['surface']  # 여러 이미지를 붙인 캔버스·패널 배경
BORDER = _TOKENS['border']  # 격자선·축선·구분선
ACCENT = _TOKENS['accent']  # 강조 계열 (추천·현재·지원 중), 스크린샷 주석

# 대체 글꼴을 목록으로 두면 굵기마다 findfont 경고가 나므로 하나만 지정
FONT = 'Inter' if any(f.name == 'Inter' for f in font_manager.fontManager.ttflist) else 'DejaVu Sans'
if FONT != 'Inter':
    print('chart_style: Inter 글꼴이 없어 DejaVu Sans로 그림', file=sys.stderr)

plt.rcParams.update({
    'font.family': FONT,
    'font.size': 14,
    'text.color': FOREGROUND,
    'axes.edgecolor': BORDER,
    'xtick.color': MUTED,
    'ytick.color': FOREGROUND,
    'xtick.labelsize': 13,
    'figure.facecolor': BACKGROUND,
    'axes.facecolor': BACKGROUND,
})


def figure(figsize=FIGSIZE):
    fig, ax = plt.subplots(figsize=figsize)
    style_axes(ax)
    return fig, ax


def style_axes(ax, grid_axis='x'):
    """테두리 없이 아래 축선과 격자선만 (border 색)"""
    ax.grid(True, axis=grid_axis, color=BORDER, lw=1)
    ax.set_axisbelow(True)
    for s in ['top', 'right', 'left']:
        ax.spines[s].set_visible(False)
    ax.spines['bottom'].set_color(BORDER)
    ax.tick_params(axis='x', length=0, pad=10)
    ax.tick_params(axis='y', length=0, pad=14)


def header(fig, title, subtitle=None):
    """제목(bold, foreground) + 부제(muted)"""
    fig.text(0.03, 0.915, title, fontsize=22, fontweight='bold')
    if subtitle:
        fig.text(0.03, 0.865, subtitle, fontsize=13.5, color=MUTED)


def footer(fig, *lines):
    """구분선 + 출처·주석(muted, 아래에서 위로 쌓음) + 오른쪽 아래 사이트 이름"""
    fig.add_artist(plt.Line2D([0.03, 0.97], [0.085, 0.085], color=BORDER, lw=1))
    for i, line in enumerate(reversed(lines)):
        fig.text(0.03, 0.03 + i * 0.03, line, fontsize=10.5, color=MUTED)
    fig.text(0.97, 0.03, SITE_NAME, fontsize=13, fontweight='bold', ha='right')


def rounded_barh(ax, y, left, width, height, color):
    """모서리를 픽셀 기준(RADIUS_PX)으로 둥글게 한 가로 막대

    축 비율로 모서리를 보정하므로 subplots_adjust·축 범위를 정한 뒤 호출한다.
    """
    if width == 0:
        return
    if width < 0:
        left, width = left + width, -width
    bbox = ax.get_window_extent()
    x0, x1 = ax.get_xlim()
    y0, y1 = ax.get_ylim()
    x_per_px = (x1 - x0) / bbox.width
    y_per_px = (y1 - y0) / bbox.height
    r = min(RADIUS_PX * x_per_px, width / 2)
    ax.add_patch(FancyBboxPatch(
        (left, y - height / 2), width, height,
        boxstyle=f'round,pad=0,rounding_size={r}',
        mutation_aspect=y_per_px / x_per_px,
        facecolor=color, edgecolor='none', zorder=3,
    ))


def save(fig, path, quality=90):
    """WebP로 저장하고 경로·크기 출력"""
    b = io.BytesIO()
    fig.savefig(b, format='png', dpi=100, facecolor=BACKGROUND)
    plt.close(fig)
    Image.open(b).convert('RGB').save(path, 'WEBP', quality=quality)
    print(path, Image.open(path).size)
