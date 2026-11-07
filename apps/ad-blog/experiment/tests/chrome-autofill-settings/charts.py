"""Chrome 자동 완성 설정 글 그래픽: Chrome 156 직접 실행 캡처에 주석·설명을 붙인 이미지 5장 (1200×675 webp).

캡처 원본은 `screens/*.webp` (Google Chrome 156.0.8078.73 Linux, 새 프로필, 로그아웃, Xvfb 1280×900,
2026-10-29 15:55~16:40 UTC, 시나리오·결과는 capture-notes.md). 카드 회사 로고는 회색 상자로 가림.
실행: python3 -I charts.py <출력 폴더>
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch, Rectangle  # noqa: E402
from PIL import Image, ImageDraw  # noqa: E402

HERE = Path(__file__).resolve().parent
SCREENS = HERE / 'screens'
OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'
SHOT = 'Screenshots: Google Chrome 156.0.8078.73 for Linux, new profile, signed out, October 29, 2026.'


def shot(name, crop, masks=()):
    """캡처를 잘라 오고, 카드 회사 로고 같은 부분을 회색 상자로 가림 (좌표는 원본 1280×900 기준)"""
    img = Image.open(SCREENS / f'{name}.webp').convert('RGB')
    draw = ImageDraw.Draw(img)
    for x0, y0, x1, y1 in masks:
        draw.rounded_rectangle((x0, y0, x1, y1), radius=4, fill=cs.BORDER)
    return img.crop(crop)


def place(fig, img, left_px, bottom_px, height_px):
    """그림을 픽셀 위치(왼쪽 아래 기준)에 높이를 맞춰 놓고 축을 돌려줌"""
    w = height_px * img.width / img.height
    ax = fig.add_axes([left_px / 1200, bottom_px / 675, w / 1200, height_px / 675])
    ax.imshow(img)
    ax.axis('off')
    return ax, w


def outline(ax, img_w, img_h):
    ax.add_patch(Rectangle((0, 0), img_w - 1, img_h - 1, fill=False, edgecolor=cs.BORDER, lw=1.5))


def box(ax, x, y, w, h, fill, r=0.012):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle=f'round,pad=0,rounding_size={r}',
                                facecolor=fill, edgecolor=fill, lw=0, zorder=1))


def panel(fig, left_px, bottom_px, width_px, height_px):
    ax = fig.add_axes([left_px / 1200, bottom_px / 675, width_px / 1200, height_px / 675])
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    return ax


def settings_page():
    """Autofill and passwords 첫 화면 + 묶음별 설명"""
    img = shot('01-autofill-main', (340, 370, 1050, 900))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Where Chrome keeps its autofill settings',
              'Settings > Autofill and passwords splits your saved info into five groups, each with its own switch.')
    ax, w = place(fig, img, 36, 80, 485)
    outline(ax, img.width, img.height)

    left = 36 + w + 28
    side = panel(fig, left, 80, 1200 - left - 36, 485)
    box(side, 0, 0, 1, 1, cs.SURFACE)
    rows = [
        ('Google Password Manager', 'Passwords and passkeys. Opens its own page'),
        ('Payments', 'Cards, saved security codes, loyalty cards'),
        ('Contact info', 'Addresses, phone numbers and email addresses'),
        ('Identity docs', "Driver's licenses, ID cards and passports"),
        ('Travel', 'Travel info and vehicles'),
        ('Autofill settings', 'Smarter form understanding, further down'),
    ]
    y = 0.9
    for title, note in rows:
        side.text(0.06, y, title, fontsize=14.5, fontweight='bold', color=cs.FOREGROUND, va='center')
        side.text(0.06, y - 0.065, note, fontsize=12, color=cs.MUTED, va='center')
        y -= 0.158
    cs.footer(fig, SHOT + ' Address: chrome://settings/autofill.')
    cs.save(fig, f'{OUT}/chrome-autofill-settings-page.webp')


def switch_off_test():
    """Save and fill addresses 켜짐 vs 꺼짐: 이름 칸·배송 메모 칸 제안"""
    on_name = shot('12-name-suggestion', (30, 165, 620, 345))
    on_note = shot('13-note-suggestion', (30, 498, 620, 610))
    off_name = shot('21-off-name-no-suggestion', (30, 165, 620, 345))
    off_note = shot('22-off-note-no-suggestion', (30, 498, 620, 610))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Turning off Save and fill addresses stopped every suggestion',
              'Same test form, same saved address. With the switch off, neither the name field nor a free-text field offered anything.')
    scale = 0.93
    cols = [(36, 'Switch on', cs.ACCENT, on_name, on_note), (615, 'Switch off', cs.MUTED, off_name, off_note)]
    for x, label, color, name_img, note_img in cols:
        fig.text(x / 1200, 545 / 675, label, fontsize=16, fontweight='bold', color=color)
        ax, _ = place(fig, name_img, x, 366, name_img.height * scale)
        outline(ax, name_img.width, name_img.height)
        ax, _ = place(fig, note_img, x, 250, note_img.height * scale)
        outline(ax, note_img.width, note_img.height)
    fig.text(36 / 1200, 205 / 675, 'Name field: the saved address appears only while the switch is on.', fontsize=12.5, color=cs.FOREGROUND)
    fig.text(36 / 1200, 178 / 675, 'Delivery note: an entry we typed once ("Leave at the side door") is also hidden when the switch is off.',
             fontsize=12.5, color=cs.FOREGROUND)
    fig.text(36 / 1200, 151 / 675, 'The saved address stayed in Contact info, and the suggestions came back when we switched it on again.',
             fontsize=12.5, color=cs.FOREGROUND)
    cs.footer(fig, SHOT + ' Our own test page, made-up data.')
    cs.save(fig, f'{OUT}/save-and-fill-addresses-off-test.webp')


def save_prompts():
    """주소 저장 말풍선 + 카드 저장 말풍선(보안 코드 포함) + Payments 목록의 CVC saved"""
    addr = shot('10-save-address-bubble', (875, 85, 1195, 480))
    card = shot('41-save-card-bubble', (875, 85, 1240, 440), masks=[(894, 330, 943, 363)])
    pay = shot('42-payments-cvc-saved', (352, 537, 760, 634), masks=[(372, 591, 422, 625)])
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'What Chrome asks to save after you submit a form',
              'Signed out, Chrome 156 offered to save the address and the card, and the card prompt included its security code.')
    ax, w1 = place(fig, addr, 36, 80, 470)
    outline(ax, addr.width, addr.height)
    ax, w2 = place(fig, card, 36 + w1 + 24, 190, 360)
    outline(ax, card.width, card.height)
    ax, _ = place(fig, pay, 36 + w1 + 24, 80, w2 * pay.height / pay.width)
    outline(ax, pay.width, pay.height)

    left = 36 + w1 + 24 + w2 + 24
    side = panel(fig, left, 80, 1200 - left - 36, 470)
    box(side, 0, 0, 1, 1, cs.SURFACE)
    notes = [
        ('Address', 'Chrome added "United States"\nand reformatted the phone\nnumber we typed'),
        ('Card', '"save your card and encrypted\nsecurity code to your device"'),
        ('After saving', 'Payments lists the card with\n"CVC saved." The Save security\ncodes switch is on by default'),
    ]
    y = 0.9
    for title, note in notes:
        side.text(0.08, y, title, fontsize=14.5, fontweight='bold', color=cs.ACCENT, va='top')
        side.text(0.08, y - 0.065, note, fontsize=12, color=cs.FOREGROUND, va='top', linespacing=1.35)
        y -= 0.3
    cs.footer(fig, SHOT, 'Made-up address and a standard test card number. Card logo hidden by ToolProof.')
    cs.save(fig, f'{OUT}/chrome-save-address-card-prompts.webp')


def delete_dialog():
    """Delete browsing data에서 Autofill form data만 고른 화면 + 지운 결과"""
    img = shot('51-delete-autofill-form-data', (384, 202, 896, 784))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Deleting all saved autofill data in one step',
              'Delete browsing data > Show more > Autofill form data. It is not ticked by default.')
    ax, w = place(fig, img, 36, 80, 480)
    outline(ax, img.width, img.height)
    ax.add_patch(Rectangle((24, 274), 456, 50, fill=False, edgecolor=cs.ACCENT, lw=3, zorder=3))

    left = 36 + w + 28
    side = panel(fig, left, 80, 1200 - left - 36, 480)
    box(side, 0, 0, 1, 1, cs.SURFACE)
    side.text(0.05, 0.9, 'Before', fontsize=15, fontweight='bold', color=cs.ACCENT, va='top')
    side.text(0.05, 0.83, '1 payment method, 1 address and 9 typed entries\n(counted by Chrome in this dialog)', fontsize=12.5,
              color=cs.FOREGROUND, va='top', linespacing=1.35)
    side.text(0.05, 0.64, 'After deleting', fontsize=15, fontweight='bold', color=cs.ACCENT, va='top')
    side.text(0.05, 0.57, 'Cards 0, addresses 0 in Autofill and passwords.\nNo suggestions on our test form.', fontsize=12.5,
              color=cs.FOREGROUND, va='top', linespacing=1.35)
    side.text(0.05, 0.38, 'Not covered', fontsize=15, fontweight='bold', color=cs.MUTED, va='top')
    side.text(0.05, 0.31, "Passwords: delete them in Google Password\nManager. Info stored in Google Wallet or your\nGoogle Account, per Google's help page.",
              fontsize=12.5, color=cs.FOREGROUND, va='top', linespacing=1.35)
    cs.footer(fig, SHOT, 'Time range in this run: Last 4 weeks. Pick All time to cover everything.')
    cs.save(fig, f'{OUT}/delete-autofill-form-data.webp')


def greyed_out():
    """회색 스위치 두 경우: 로그아웃(Identity docs) vs 관리자 정책(Contact info, 건물 아이콘)"""
    signed_out = shot('04-identity-docs-signed-out', (352, 150, 1035, 420))
    managed = shot('60-policy-addresses-greyed', (352, 150, 1035, 420))
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Two reasons a Chrome autofill switch is greyed out',
              'Neither switch can be clicked. The building icon is the clue that tells them apart.')
    scale = 0.8
    for x, title, note, img in [
        (36, 'Not signed in to Chrome', 'Identity docs, Travel and Smarter form understanding\nwere off and greyed out in our signed-out copy.', signed_out),
        (618, 'Managed by an organization', 'A building icon appears next to the switch, labeled\n"This setting is managed by your administrator."', managed),
    ]:
        fig.text(x / 1200, 520 / 675, title, fontsize=16, fontweight='bold', color=cs.ACCENT)
        ax, _ = place(fig, img, x, 520 - 18 - img.height * scale, img.height * scale)
        outline(ax, img.width, img.height)
        fig.text(x / 1200, (520 - 18 - img.height * scale - 26) / 675, note, fontsize=13, color=cs.FOREGROUND, va='top', linespacing=1.4)
    band = panel(fig, 36, 72, 1128, 92)
    box(band, 0, 0, 1, 1, cs.SURFACE)
    band.text(0.025, 0.66, 'Not a lock: switches you turned off yourself', fontsize=14.5, fontweight='bold', color=cs.MUTED, va='center')
    band.text(0.025, 0.3, 'Turning off a Save and fill switch greys out only the Add button. The switch still works, and your saved info stays listed.',
              fontsize=12.5, color=cs.FOREGROUND, va='center')
    cs.footer(fig, SHOT, 'Right: we turned off the AutofillAddressEnabled policy, the way a workplace would.')
    cs.save(fig, f'{OUT}/chrome-autofill-greyed-out.webp')


if __name__ == '__main__':
    Path(OUT).mkdir(parents=True, exist_ok=True)
    settings_page()
    switch_off_test()
    save_prompts()
    delete_dialog()
    greyed_out()
