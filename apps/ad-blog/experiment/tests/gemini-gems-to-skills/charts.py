"""Gems → skills 일정 타임라인 (1200×675 webp). 날짜 출처는 facts.md."""
import io
from datetime import date

import matplotlib
matplotlib.use('Agg')
import matplotlib.dates as mdates
import matplotlib.pyplot as plt
from PIL import Image

SURF, INK, INK2, GRID, BLUE, ORANGE = '#fcfcfb', '#0b0b0b', '#52514e', '#e4e3df', '#2a78d6', '#c2560f'
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 15, 'text.color': INK, 'xtick.color': INK2, 'ytick.color': INK})
lanes = ['Personal Google account', 'Workspace business,\nenterprise, nonprofit', 'Workspace education']
y = {l: i for i, l in enumerate(lanes[::-1])}
fig, ax = plt.subplots(figsize=(12, 6.75))
ax.set_facecolor(SURF)
# 스킬 배포 (Gemini 앱): 10-13 시작, 11월 중순 완료 예정
L = lanes[0]
ax.barh(y[L] + 0.13, mdates.date2num(date(2026, 11, 15)) - mdates.date2num(date(2026, 10, 13)), left=mdates.date2num(date(2026, 10, 13)), height=0.2, color=BLUE)
ax.text(mdates.date2num(date(2026, 10, 13)), y[L] + 0.3, 'Skills roll out in the Gemini app\nOct 13 to mid-Nov 2026', fontsize=13, color=INK, va='bottom')
# 개인 계정 Gems 종료: 11월 (일자 미공개) → 11월 구간 표시
ax.barh(y[L] - 0.13, 29, left=mdates.date2num(date(2026, 11, 1)), height=0.2, color=ORANGE)
ax.text(mdates.date2num(date(2026, 12, 6)), y[L] - 0.13, 'Gems go away: November 2026\n(exact day not announced)', fontsize=13, va='center')


def mark(lane, d, text, right=False):
    x = mdates.date2num(d)
    ax.plot([x], [y[lane]], 'o', ms=12, color=ORANGE, mec=SURF, mew=2)
    ax.text(x - 6 if right else x + 6, y[lane] - 0.32, text, fontsize=13, va='top', ha='right' if right else 'left')


for lane in lanes[1:]:
    ax.plot([mdates.date2num(date(2026, 11, 17))], [y[lane]], 'o', ms=10, color=INK2, mec=SURF, mew=2)
    ax.text(mdates.date2num(date(2026, 11, 17)) + 6, y[lane] + 0.3, 'Nov 17: Gems move to Settings', fontsize=12, color=INK2, va='bottom')
mark(lanes[1], date(2027, 3, 1), 'Gems stop working,\nno sooner than Mar 1, 2027')
mark(lanes[2], date(2027, 6, 1), 'Gems stop working,\nno sooner than Jun 1, 2027', right=True)
ax.set_yticks(list(y.values()))
ax.set_yticklabels(list(y.keys()))
ax.set_ylim(-0.9, 2.9)
ax.set_xlim(mdates.date2num(date(2026, 10, 1)), mdates.date2num(date(2027, 7, 20)))
ax.xaxis.set_major_locator(mdates.MonthLocator())
ax.xaxis.set_major_formatter(mdates.DateFormatter('%b\n%Y'))
ax.grid(axis='x', color=GRID, lw=1)
ax.set_axisbelow(True)
for s in ['top', 'right', 'left']:
    ax.spines[s].set_visible(False)
ax.spines['bottom'].set_color(GRID)
ax.tick_params(axis='y', length=0)
fig.suptitle('When Gemini Gems become skills, by account type', x=0.012, ha='left', fontsize=20, fontweight='bold', y=0.97)
fig.text(0.012, 0.015, "Source: Google Gemini Help and Workspace Updates, checked Oct 13, 2026 · Workspace skills rollout is delayed", fontsize=12, color=INK2)
fig.subplots_adjust(left=0.235, right=0.985, top=0.87, bottom=0.14)
b = io.BytesIO()
fig.savefig(b, format='png', dpi=100, facecolor=SURF)
Image.open(b).convert('RGB').save('img/gems-to-skills-timeline.webp', 'WEBP', quality=90)
print(Image.open('img/gems-to-skills-timeline.webp').size)
