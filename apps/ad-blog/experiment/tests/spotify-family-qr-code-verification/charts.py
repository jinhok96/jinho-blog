"""Spotify Premium Family QR 인증: 인증 기한·결과 타임라인 + 요금제별 1인당 월 요금 (1200×675 webp).

요금·기한 출처는 factcheck.md. 실행: python charts.py <출력 폴더>
"""
import io
import sys
from decimal import ROUND_HALF_UP, Decimal

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
from PIL import Image

OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'
SURF, INK, INK2, GRID, BLUE, ORANGE = '#fcfcfb', '#0b0b0b', '#52514e', '#e4e3df', '#2a78d6', '#c2560f'
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 15, 'text.color': INK, 'xtick.color': INK2, 'ytick.color': INK2})

# spotify.com/us/premium (2026-10-19)
INDIVIDUAL, STUDENT, DUO, FAMILY = (Decimal(p) for p in ('12.99', '6.99', '18.99', '21.99'))


def money(v):
    return Decimal(v).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


def save(fig, name):
    b = io.BytesIO()
    fig.savefig(b, format='png', dpi=100, facecolor=SURF)
    path = f'{OUT}/{name}'
    Image.open(b).convert('RGB').save(path, 'WEBP', quality=90)
    print(path, Image.open(path).size)


def box(ax, x, y, w, h, color, title, body, title_color='white', body_color='white'):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0,rounding_size=0.12', fc=color, ec='none'))
    ax.text(x + 0.22, y + h - 0.32, title, fontsize=17, fontweight='bold', color=title_color, va='top')
    ax.text(x + 0.22, y + h - 0.95, body, fontsize=13.5, color=body_color, va='top', linespacing=1.45)


def verification_timeline():
    fig, ax = plt.subplots(figsize=(12, 6.75))
    ax.set_facecolor(SURF)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 6.75)
    ax.axis('off')

    # 기한 막대: 알림 → 7일
    ax.add_patch(FancyBboxPatch((0.4, 3.95), 4.6, 0.5, boxstyle='round,pad=0,rounding_size=0.1', fc=BLUE, ec='none'))
    ax.text(2.7, 4.2, '7 days to scan', ha='center', va='center', fontsize=16, fontweight='bold', color='white')
    ax.text(0.4, 4.62, 'Day 0: prompt appears on\nthe member\'s phone', fontsize=12.5, color=INK2, va='bottom')
    ax.text(5.0, 4.62, 'Day 7: window\ncloses', fontsize=12.5, color=INK2, va='bottom', ha='right')

    # 결과 두 갈래
    ax.annotate('', xy=(5.75, 5.2), xytext=(5.1, 4.35), arrowprops=dict(arrowstyle='-|>', color=INK2, lw=1.6))
    ax.annotate('', xy=(5.75, 2.75), xytext=(5.1, 4.05), arrowprops=dict(arrowstyle='-|>', color=INK2, lw=1.6))
    box(ax, 5.8, 4.45, 5.85, 1.75, BLUE, 'Scanned in person in time',
        'Member stays on Premium Family.\nNothing else changes.')
    box(ax, 5.8, 0.75, 5.85, 3.45, ORANGE, 'Missed or couldn\'t scan',
        'Member loses the Family plan (Spotify\'s\naddress-check rules say they go to Free).\n'
        'Can\'t join a different Family or Duo plan\nfor 12 months.\n'
        'Can still buy Individual ($12.99/mo)\nor Student ($6.99/mo, if eligible).')

    ax.text(0.4, 3.35, 'How the scan works', fontsize=15, fontweight='bold', color=INK, va='top')
    ax.text(0.4, 2.85, '1. Plan manager opens the QR code:\n    profile picture > Your Premium > Manage\n'
                       '2. Member scans it with their phone camera\n'
                       '3. Both must be in the same place;\n    the code changes every few seconds\n'
                       '4. Mobile app only, latest version',
            fontsize=13, color=INK2, va='top', linespacing=1.45)

    fig.suptitle('Spotify Family QR check: 7 days, then a 12-month lockout',
                 x=0.012, ha='left', fontsize=21, fontweight='bold', y=0.965)
    fig.text(0.012, 0.015, 'Source: Spotify Support, "Address and verification for Family plan," checked Oct 19, 2026. Prices: spotify.com/us/premium',
             fontsize=11, color=INK2)
    fig.subplots_adjust(left=0, right=1, top=0.9, bottom=0.05)
    save(fig, 'qr-verification-timeline.webp')


def cost_per_person():
    rows = [
        ('Family, 6 people', FAMILY / 6, BLUE),
        ('Family, 4 people', FAMILY / 4, BLUE),
        ('Family, 3 people', FAMILY / 3, BLUE),
        ('Duo, 2 people', DUO / 2, BLUE),
        ('Student (if eligible)', STUDENT, ORANGE),
        ('Individual', INDIVIDUAL, ORANGE),
    ]
    fig, ax = plt.subplots(figsize=(12, 6.75))
    ax.set_facecolor(SURF)
    ys = list(range(len(rows)))[::-1]
    for y, (label, v, c) in zip(ys, rows):
        ax.barh(y, float(v), height=0.62, color=c)
        ax.text(float(v) + 0.18, y, f'${money(v)}/mo', va='center', fontsize=15, fontweight='bold', color=INK)
        yearly = money((INDIVIDUAL - v) * 12)
        if c == BLUE:
            ax.text(15.5, y, f'+${yearly}/yr', va='center', ha='right', fontsize=14, color=ORANGE, fontweight='bold')
    ax.text(15.5, len(rows) - 0.35, 'Extra per year on\nIndividual instead', ha='right', va='bottom', fontsize=12.5, color=INK2)
    ax.set_yticks(ys)
    ax.set_yticklabels([r[0] for r in rows], fontsize=14.5, color=INK)
    ax.set_xlim(0, 15.6)
    ax.set_xticks([0, 2, 4, 6, 8, 10, 12])
    ax.set_xticklabels([f'${t}' for t in [0, 2, 4, 6, 8, 10, 12]])
    ax.xaxis.grid(True, color=GRID)
    ax.set_axisbelow(True)
    for s in ['top', 'right', 'left']:
        ax.spines[s].set_visible(False)
    ax.spines['bottom'].set_color(GRID)
    ax.tick_params(axis='y', length=0)
    fig.suptitle('What each person pays per month on Spotify Premium (U.S.)',
                 x=0.012, ha='left', fontsize=21, fontweight='bold', y=0.965)
    fig.text(0.012, 0.885, 'Shared plans split evenly. A member who fails verification falls to Free and can buy one of the orange plans.',
             fontsize=13, color=INK2)
    fig.text(0.012, 0.015, 'Prices: spotify.com/us/premium, checked Oct 19, 2026 (before tax). Family \\$21.99, Duo \\$18.99, Individual \\$12.99, Student \\$6.99.',
             fontsize=11, color=INK2)
    fig.subplots_adjust(left=0.2, right=0.98, top=0.83, bottom=0.1)
    save(fig, 'spotify-cost-per-person.webp')


if __name__ == '__main__':
    verification_timeline()
    cost_per_person()
