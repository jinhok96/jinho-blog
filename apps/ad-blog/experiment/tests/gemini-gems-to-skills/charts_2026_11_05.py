"""2026-11-05 갱신 그래픽: Gems → skills 일정(개인 계정 + 업무·학교 계정) + 예시 Gem 변환 결과(10-13 규칙 vs 11-05 규칙). 1200×675 webp.

내용 출처는 facts.md '2026-11-05 재확인'. 변환 결과는 results/convert-report-2026-10-13.json·convert-report-2026-11-05.json,
검사 결과는 results/validate-2026-11-05.txt (gem_to_skill.py·skills-ref 0.1.1로 직접 실행한 값).
실행: python3 -I charts_2026_11_05.py <출력 폴더>
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch  # noqa: E402

HERE = Path(__file__).resolve().parent
OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'


def box(ax, x, y, w, h, fill, edge=None, lw=0):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0,rounding_size=0.012',
                                facecolor=fill, edgecolor=edge or fill, lw=lw, zorder=1))


def canvas(title, subtitle):
    fig = plt.figure(figsize=cs.FIGSIZE)
    ax = fig.add_axes([0.03, 0.12, 0.94, 0.71])
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    cs.header(fig, title, subtitle)
    return fig, ax


# (날짜, 설명, 강조)
PERSONAL = [
    ('Oct 13', 'Skills start\nrolling out in\nthe Gemini app', False),
    ('Mid-Nov', 'Skills rollout\nexpected\nto finish', False),
    ('Nov 17', 'Gems recreated\nas skills. Gems\nturn read-only:\nno using or editing', True),
    ('Dec 17', 'Gems removed.\nLast day to save\nfiles that didn\'t\ncarry over', True),
]
WORK_SCHOOL = [
    ('Nov 17, 2026', 'Gems move to Settings.\nStill usable and editable'),
    ('Mar 1, 2027 or later', 'Work accounts: Gems stop\nworking, turn into draft skills'),
    ('Jun 1, 2027 or later', 'School accounts: same, and\nGems leave Google Classroom'),
]


def timeline():
    fig, ax = canvas('When Gemini Gems stop working, by account',
                     'Personal Google accounts (18 and over) lose Gems first. Work and school accounts keep them into 2027.')
    box(ax, 0.0, 0.0, 0.64, 1.0, cs.BACKGROUND, edge=cs.BORDER, lw=1)
    ax.text(0.03, 0.92, 'Personal Google account, 2026', fontsize=15, fontweight='bold', va='center', zorder=2)
    y = 0.60
    ax.plot([0.05, 0.61], [y, y], color=cs.BORDER, lw=3, zorder=1)
    n = len(PERSONAL)
    for i, (d, t, hi) in enumerate(PERSONAL):
        x = 0.09 + i * (0.48 / (n - 1))
        ax.scatter([x], [y], s=260, color=cs.ACCENT if hi else cs.MUTED, zorder=3)
        ax.text(x, y + 0.12, d, ha='center', va='center', fontsize=16, fontweight='bold',
                color=cs.ACCENT if hi else cs.FOREGROUND, zorder=2)
        ax.text(x, y - 0.08, t, ha='center', va='top', fontsize=12, linespacing=1.45, zorder=2)
    box(ax, 0.67, 0.0, 0.33, 1.0, cs.SURFACE)
    ax.text(0.695, 0.92, 'Work and school accounts', fontsize=15, fontweight='bold', va='center', zorder=2)
    yy = 0.77
    for d, t in WORK_SCHOOL:
        ax.text(0.695, yy, d, fontsize=13.5, fontweight='bold', va='top', zorder=2)
        ax.text(0.695, yy - 0.07, t, fontsize=12, va='top', linespacing=1.45, zorder=2)
        yy -= 0.255
    cs.footer(fig, 'Sources: Gemini Apps Help, "About the transition from Gems to skills" (checked November 5, 2026), and Google Workspace',
              'Admin Help, "About the transition from Gems to skills" (last updated September 30, 2026). Under-18 personal accounts: later, no date yet.')
    cs.save(fig, f'{OUT}/gems-to-skills-timeline.webp')


LABEL = {'.DS_Store': 'Hidden Mac system file', 'event-calendar.csv': 'Spreadsheet data (.csv)',
         'past-issue.md': 'Text file (.md)', 'style-guide.docx': 'Word document (.docx)'}


def verdict_text(v):
    if v == 'ok':
        return 'Keep', True
    if v.startswith('remove (hidden'):
        return 'Remove before upload', False
    if v.startswith('convert'):
        return 'Convert first (not accepted)', False
    return v, False


def conversion():
    old = json.loads((HERE / 'results/convert-report-2026-10-13.json').read_text())
    new = json.loads((HERE / 'results/convert-report-2026-11-05.json').read_text())
    valid = (HERE / 'results/validate-2026-11-05.txt').read_text().strip().startswith('Valid skill')
    fig, ax = canvas('Our sample Gem as a skill: the Word file now goes along',
                     'Same Gem and four knowledge files, sorted by Google\'s upload rules as listed on October 13 and on November 5, 2026.')
    cols = [(0.015, 'Gem knowledge file'), (0.36, 'Rules on Oct 13'), (0.66, 'Rules on Nov 5')]
    for x, c in cols:
        ax.text(x, 0.965, c, fontsize=13, color=cs.MUTED, va='center', fontweight='semibold')
    olds = {f['file']: f['verdict'] for f in old['files']}
    order = ['style-guide.docx', 'event-calendar.csv', 'past-issue.md', '.DS_Store']
    rh = 0.135
    for i, name in enumerate(order):
        y = 0.86 - i * rh
        nv = next(f['verdict'] for f in new['files'] if f['file'] == name)
        changed = olds[name] != nv
        if changed:
            box(ax, 0.0, y - rh / 2 + 0.01, 1.0, rh - 0.02, cs.SURFACE)
        ax.text(0.015, y + 0.02, name, fontsize=13.5, fontweight='bold', va='center', zorder=2)
        ax.text(0.015, y - 0.03, LABEL[name], fontsize=11.5, color=cs.MUTED, va='center', zorder=2)
        for x, v in [(0.36, olds[name]), (0.66, nv)]:
            t, keep = verdict_text(v)
            ax.text(x, y, t, fontsize=13, va='center', zorder=2,
                    color=cs.ACCENT if keep else cs.MUTED, fontweight='semibold' if keep else 'normal')
        if i < len(order) - 1 and not changed:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1)
    kept = sum(1 for f in new['files'] if f['verdict'] == 'ok')
    checks = [
        f'{kept} of 4 files kept on November 5 (2 on October 13)',
        f'Skill folder size: {new["total_bytes"] / 1024:.0f} KB of the 100 MB limit',
        'SKILL.md sits in the main folder of the .zip file' if new['zip_root_has_skill_md'] else 'SKILL.md missing from the .zip',
        'Agent Skills checker (skills-ref 0.1.1): valid skill' if valid else 'Agent Skills checker: failed',
    ]
    box(ax, 0.0, 0.0, 1.0, 0.27, cs.SURFACE)
    ax.text(0.015, 0.22, 'Result with the November 5 rules', fontsize=13.5, fontweight='bold', va='center', zorder=2)
    for i, c in enumerate(checks):
        ax.text(0.015 + (i % 2) * 0.5, 0.135 - (i // 2) * 0.075, c, fontsize=12.5, va='center', zorder=2)
    cs.footer(fig, 'ToolProof test on Linux, November 5, 2026: our own sample Gem, sorted with a script that follows Gemini Apps Help, "Create & manage',
              'skills for Gemini Apps" (upload requirements), then checked with skills-ref 0.1.1. We could not sign in to Gemini, so this checks the files only.')
    cs.save(fig, f'{OUT}/gem-converted-to-skill.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    timeline()
    conversion()
