"""Google Gmail·Photos 광고 칼럼 그래픽: 정책 문장 전후 비교 + 스위치별 효과 + 타임라인 + 메뉴 경로 (1200×675 webp).

내용 출처는 factcheck.md, 정책 문장은 policy-sentences.md (policy_diff.py 출력).
실행: python3 -I charts.py <출력 폴더>
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch  # noqa: E402

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


# (주제, 10-01판, 10-16판)
POLICY_ROWS = [
    ('Gmail and Photos\npromise',
     '"We don\'t show you personalized ads\nbased on your content from Drive,\nGmail, or Photos."',
     '...same, then: "unless you choose to make\ndata from these services available to other\nGoogle services that support personalized ads."'),
    ('What ads can\nbe based on',
     '"your interests and activity\nacross Google services"',
     '"your interests, activity, or personalized\ncontent from Google services"'),
    ('Search and\nGemini access',
     '(no sentence)',
     'Search or Gemini Apps may access Photos,\nGmail, and Drive if you allow it. "Search may\nprocess some of the data ... including ads."'),
]


def policy_compare():
    fig, ax = canvas('What Google\'s privacy policy said before and after October 16',
                     'Three passages in the ads section changed between the October 1 and October 16, 2026 versions.')
    for x, c in [(0.015, 'Passage'), (0.2, 'October 1, 2026 version'), (0.575, 'October 16, 2026 version (current)')]:
        ax.text(x, 0.96, c, fontsize=13, color=cs.ACCENT if x > 0.5 else cs.MUTED, va='center', fontweight='semibold')
    rh = 0.29
    for i, (topic, old, new) in enumerate(POLICY_ROWS):
        y = 0.77 - i * rh
        box(ax, 0.565, y - rh / 2 + 0.015, 0.435, rh - 0.03, cs.SURFACE)
        ax.text(0.015, y, topic, fontsize=14.5, fontweight='bold', va='center', linespacing=1.3, zorder=2)
        ax.text(0.2, y, old, fontsize=12, va='center', linespacing=1.45, zorder=2,
                color=cs.MUTED if old.startswith('(') else cs.FOREGROUND)
        ax.text(0.58, y, new, fontsize=12, va='center', linespacing=1.45, zorder=2, fontweight='semibold')
        if i < len(POLICY_ROWS) - 1:
            ax.plot([0, 0.55], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1)
    cs.footer(fig, 'Source: Google Privacy Policy, archived October 1, 2026 version and current version effective October 16, 2026,',
              'policies.google.com, compared October 24, 2026')
    cs.save(fig, f'{OUT}/google-privacy-policy-before-after.webp')


# (스위치, 끄면 무엇이 멈추나, 무엇은 남나)
SWITCH_ROWS = [
    ('Disconnect Gmail and\nPhotos from Search', 'Search, AI Mode, and Maps stop\nreading your email and photos,\nso they can\'t shape ads',
     'Past Search Services History\nstays until you delete it'),
    ('Personalized\nRecommendations off', 'Personal Intelligence stops: Google\nlists this switch as a requirement',
     'Results still use your current\nlocation and recent searches'),
    ('Gmail: Smart features in\nother Google products off', 'Search and the Gemini app can\'t\nuse your email',
     'Gemini features inside\nGmail keep working'),
    ('My Ad Center:\nPersonalized ads off', 'All personalized ads on Google stop,\nnot only those from Gmail or Photos',
     'You still see ads, based on\nthe page and time of day'),
]


def switch_table():
    fig, ax = canvas('Four switches that keep Gmail and Photos out of Google ads',
                     'The first one is enough for most people. The last one turns off ad personalization everywhere on Google.')
    for x, c in [(0.015, 'Switch'), (0.33, 'What it stops'), (0.7, 'What stays')]:
        ax.text(x, 0.96, c, fontsize=13, color=cs.MUTED, va='center', fontweight='semibold')
    rh = 0.225
    for i, (sw, stops, stays) in enumerate(SWITCH_ROWS):
        y = 0.8 - i * rh
        hi = i == 0
        if hi:
            box(ax, 0.0, y - rh / 2 + 0.012, 1.0, rh - 0.024, cs.SURFACE)
        ax.text(0.015, y, sw, fontsize=14, fontweight='bold', va='center', linespacing=1.3, zorder=2,
                color=cs.ACCENT if hi else cs.FOREGROUND)
        ax.text(0.33, y, stops, fontsize=12.5, va='center', linespacing=1.4, zorder=2)
        ax.text(0.7, y, stays, fontsize=12.5, va='center', linespacing=1.4, zorder=2, color=cs.MUTED)
        if 0 < i < len(SWITCH_ROWS) - 1:
            ax.plot([0, 1], [y - rh / 2, y - rh / 2], color=cs.BORDER, lw=1)
    cs.footer(fig, 'Sources: Google Search Help (answers 16859283, 17026260), Gmail Help (15604322), My Ad Center Help (12155656),',
              'checked October 24, 2026')
    cs.save(fig, f'{OUT}/gmail-photos-ads-switches.webp')


EVENTS = [
    ('Jun 23, 2017', 'Google says consumer\nGmail won\'t be scanned\nfor ads personalization'),
    ('Apr 2 to Oct 1, 2026', 'Three policy versions keep\n"no ads based on Drive,\nGmail, or Photos"'),
    ('Oct 16, 2026', 'New policy adds "unless\nyou choose to make data\navailable"; 2017 post updated'),
    ('Oct 19, 2026', 'Search Engine Land reports\nGoogle is testing ads for\nconnected users in AI Mode'),
    ('Oct 23, 2026', 'Wide news coverage\nof the policy change'),
]


def timeline():
    fig, ax = canvas('From "no Gmail ads" to "unless you connect"',
                     'Google\'s 2017 Gmail promise stayed in its privacy policy until the October 16, 2026 update.')
    y = 0.55
    ax.plot([0.04, 0.96], [y, y], color=cs.BORDER, lw=3, zorder=1)
    n = len(EVENTS)
    for i, (d, t) in enumerate(EVENTS):
        x = 0.09 + i * (0.82 / (n - 1))
        cur = i == 2
        ax.scatter([x], [y], s=260, color=cs.ACCENT if cur else cs.MUTED, zorder=3)
        ax.text(x, y + 0.13, d, ha='center', va='center', fontsize=14.5, fontweight='bold',
                color=cs.ACCENT if cur else cs.FOREGROUND)
        ax.text(x, y - 0.2, t, ha='center', va='center', fontsize=12, linespacing=1.45)
    cs.footer(fig, 'Sources: Google Blog (June 23, 2017, updated October 16, 2026), Google Privacy Policy archive,',
              'SE Roundtable citing Search Engine Land (October 19, 2026). The October 19 item is a news report, not a Google announcement.')
    cs.save(fig, f'{OUT}/gmail-ads-promise-timeline.webp')


PATHS = [
    ('Disconnect Gmail\nand Photos', ['Google Account', 'Search Services\nPersonalization', 'Additional Personal\nIntelligence Connected\nContent Apps', 'Disconnect\neach app']),
    ('Turn off\nrecommendations', ['Google Account', 'Data & privacy', 'Personalization\nsettings', 'Personalized\nRecommendations\noff']),
    ('Turn off\npersonalized ads', ['My Ad Center\n(myadcenter.\ngoogle.com)', 'Personalized ads', 'Select Off', 'Confirm']),
]


def menu_paths():
    fig, ax = canvas('Where to find the settings in your Google Account',
                     'Google is rolling out the new Search services settings over several months, so names can differ.')
    rh = 0.31
    bw, gap, x0 = 0.175, 0.03, 0.2
    for i, (task, steps) in enumerate(PATHS):
        y = 0.80 - i * rh
        ax.text(0.0, y, task, fontsize=15, fontweight='bold', va='center', linespacing=1.3)
        for j, step in enumerate(steps):
            x = x0 + j * (bw + gap)
            last = j == len(steps) - 1
            box(ax, x, y - 0.1, bw, 0.2, cs.ACCENT if last else cs.SURFACE)
            ax.text(x + bw / 2, y, step, fontsize=12, ha='center', va='center', zorder=2, linespacing=1.3,
                    color=cs.BACKGROUND if last else cs.FOREGROUND, fontweight='bold' if last else 'semibold')
            if not last:
                ax.annotate('', xy=(x + bw + gap - 0.004, y), xytext=(x + bw + 0.004, y),
                            arrowprops=dict(arrowstyle='-|>', color=cs.MUTED, lw=1.5), zorder=2)
    cs.footer(fig, 'Menu names from Google Search Help (16859283, 17026260) and My Ad Center Help (12155656), checked October 24, 2026.',
              'We could not open these screens without a Google account.')
    cs.save(fig, f'{OUT}/gmail-photos-ads-menu-path.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    policy_compare()
    switch_table()
    timeline()
    menu_paths()
