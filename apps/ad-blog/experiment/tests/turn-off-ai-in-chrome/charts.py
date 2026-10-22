"""Chrome AI 끄기 글 이미지: 끄는 방법 한눈에 보기(대표), 온디바이스 모델 삭제 흐름, 레지스트리 위치, chrome://policy 주석 (1200×675 webp).

내용은 factcheck.md (Chromium 155.0.8059.40·156.0.8078.48 소스) 기준.
chrome://policy 원본 캡처는 policy_screenshot.py로 만든 PNG를 인자로 받음.
실행: python3 -I charts.py <출력 폴더> <policy 캡처 PNG>
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
import chart_style as cs  # noqa: E402
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch  # noqa: E402
from PIL import Image, ImageDraw  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else 'img'
POLICY_PNG = sys.argv[2] if len(sys.argv) > 2 else None
plt = cs.plt

# 기능, Settings에서 할 수 있는 것, 끄기 정도(full/partial/none), 정책 = 값
FEATURES = [
    ('Gemini in Chrome', 'Hide button and shortcut', 'partial', 'GeminiSettings = 1'),
    ('Help me write', 'Stop the pop-up only', 'partial', 'HelpMeWriteSettings = 2'),
    ('AI history search', 'Turn off', 'full', 'HistorySearchSettings = 2'),
    ('AI Mode in address bar', 'No switch', 'none', 'AIModeSettings = 1'),
    ('On-device AI model', 'Turn off (deletes model)', 'full', 'GenAILocalFoundationalModelSettings = 1'),
]


def box(fig, x, y, w, h, face, edge='none', lw=0, r=0.012):
    fig.add_artist(FancyBboxPatch((x, y), w, h, boxstyle=f'round,pad=0,rounding_size={r}',
                                  transform=fig.transFigure, facecolor=face, edgecolor=edge, linewidth=lw))


def off_switches():
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'How to turn off each AI feature in Chrome',
              'Settings > AI innovations covers some of it. A Windows policy is the only full off switch for the rest.')
    cols = [(0.03, 'Feature'), (0.31, 'In Settings'), (0.60, 'Hard off switch (Windows policy)')]
    for x, c in cols:
        fig.text(x, 0.765, c, fontsize=13, fontweight='semibold', color=cs.MUTED)
    fig.add_artist(plt.Line2D([0.03, 0.97], [0.745, 0.745], color=cs.BORDER, lw=1))
    for i, (name, setting, level, policy) in enumerate(FEATURES):
        y = 0.685 - i * 0.112
        fig.text(0.03, y, name, fontsize=15.5, fontweight='bold', va='center')
        if level == 'full':
            box(fig, 0.305, y - 0.03, 0.26, 0.06, cs.ACCENT)
            fig.text(0.315, y, setting, fontsize=13, fontweight='semibold', va='center', color=cs.BACKGROUND)
        elif level == 'partial':
            box(fig, 0.305, y - 0.03, 0.26, 0.06, cs.SURFACE)
            fig.text(0.315, y, setting, fontsize=13, fontweight='semibold', va='center')
        else:
            fig.text(0.315, y, setting, fontsize=13, fontweight='semibold', va='center', color=cs.MUTED)
        fig.text(0.60, y, policy, fontsize=13, fontweight='semibold', va='center', family='DejaVu Sans Mono')
        if i < len(FEATURES) - 1:
            fig.add_artist(plt.Line2D([0.03, 0.97], [y - 0.056, y - 0.056], color=cs.BORDER, lw=1))
    cs.footer(fig, 'Blue: Settings fully turns it off. Gray: Settings only limits it. Policies set this way apply to Chrome for everyone on the PC.',
              'Source: Chromium source code, tags 155.0.8059.40 and 156.0.8078.48 (settings pages and policy definitions), Oct 2026')
    cs.save(fig, f'{OUT}/chrome-ai-off-switches.webp')


def on_device_flow():
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, "Removing Chrome's on-device AI model: switch vs. deleting the folder",
              'Chrome manages the model itself, so how you remove it decides whether it comes back.')

    def card(x, y, w, h, title, body, hi):
        box(fig, x, y, w, h, cs.ACCENT if hi else cs.SURFACE)
        color = cs.BACKGROUND if hi else cs.FOREGROUND
        fig.text(x + 0.02, y + h - 0.055, title, fontsize=15, fontweight='bold', color=color, va='top')
        fig.text(x + 0.02, y + h - 0.115, body, fontsize=12.5, color=color, va='top', linespacing=1.5)

    def arrow(x0, x1, y):
        fig.add_artist(FancyArrowPatch((x0, y), (x1, y), transform=fig.transFigure, arrowstyle='-|>',
                                       mutation_scale=18, color=cs.MUTED, lw=1.6))

    rows = [
        (0.47, True, 'Turn off "On-device AI"', 'In Settings > AI innovations,\nor with the policy set to 1',
         'Chrome uninstalls the model', 'Deletes the model files', 'Not downloaded again', 'while the switch stays off'),
        (0.15, False, 'Delete the folder only', 'The OptGuideOnDeviceModel\nfolder, with the switch still on',
         'Files are gone for now', 'Chrome still manages the\nmodel through its updater', 'Can download it again', 'when a feature asks for it'),
    ]
    for y, hi, t1, b1, t2, b2, t3, b3 in rows:
        card(0.03, y, 0.30, 0.25, t1, b1, hi)
        arrow(0.335, 0.365, y + 0.125)
        card(0.37, y, 0.28, 0.25, t2, b2, False)
        arrow(0.655, 0.685, y + 0.125)
        card(0.69, y, 0.28, 0.25, t3, b3, hi)
    cs.footer(fig, 'Chrome also removes the model on its own if the device can\'t run it or free disk space gets too low.',
              'Source: Chromium manifest_monitor.cc, manifest_asset_manager.cc and on-device model installer (tags 155.0.8059.40, 156.0.8078.48)')
    cs.save(fig, f'{OUT}/chrome-on-device-ai-removal.webp')


def registry_location():
    fig = plt.figure(figsize=cs.FIGSIZE)
    cs.header(fig, 'Where Chrome AI policies go in Registry Editor',
              'Create the Google and Chrome keys if they are missing, then add one DWORD (32-bit) Value per policy.')
    tree = ['HKEY_LOCAL_MACHINE', 'SOFTWARE', 'Policies', 'Google', 'Chrome']
    for i, k in enumerate(tree):
        x = 0.05 + i * 0.03
        y = 0.72 - i * 0.09
        last = i == len(tree) - 1
        if i:
            fig.add_artist(plt.Line2D([x - 0.018, x - 0.018, x - 0.006], [y + 0.07, y, y], color=cs.BORDER, lw=1.6))
        if last:
            box(fig, x - 0.004, y - 0.03, 0.12, 0.06, cs.ACCENT)
        fig.text(x + 0.004, y, k, fontsize=14.5, fontweight='bold' if last else 'semibold', va='center',
                 color=cs.BACKGROUND if last else cs.FOREGROUND)
        if k in ('Google', 'Chrome'):
            fig.text(x + (0.13 if last else 0.09), y, 'create if missing', fontsize=12, color=cs.MUTED, va='center')
    # 값 표
    x0 = 0.47
    box(fig, x0, 0.2, 0.5, 0.56, cs.SURFACE)
    fig.text(x0 + 0.025, 0.71, 'Inside the Chrome key (example)', fontsize=14, fontweight='bold')
    fig.text(x0 + 0.025, 0.645, 'Name', fontsize=12.5, color=cs.MUTED, fontweight='semibold')
    fig.text(x0 + 0.33, 0.645, 'Type', fontsize=12.5, color=cs.MUTED, fontweight='semibold')
    fig.text(x0 + 0.44, 0.645, 'Data', fontsize=12.5, color=cs.MUTED, fontweight='semibold')
    vals = [('GeminiSettings', '1'), ('GenAILocalFoundational-\nModelSettings', '1'), ('HelpMeWriteSettings', '2')]
    for i, (n, d) in enumerate(vals):
        y = 0.56 - i * 0.12
        fig.add_artist(plt.Line2D([x0 + 0.025, x0 + 0.475], [y + 0.055, y + 0.055], color=cs.BORDER, lw=1))
        fig.text(x0 + 0.025, y, n, fontsize=12.5, va='center', family='DejaVu Sans Mono', linespacing=1.3)
        fig.text(x0 + 0.33, y, 'REG_DWORD', fontsize=12, va='center', family='DejaVu Sans Mono')
        fig.text(x0 + 0.45, y, d, fontsize=14, va='center', fontweight='bold', color=cs.ACCENT)
    fig.text(x0 + 0.025, 0.235, 'Value names must match the policy name exactly.', fontsize=12, color=cs.MUTED)
    cs.footer(fig, 'Key: HKEY_LOCAL_MACHINE\\SOFTWARE\\Policies\\Google\\Chrome. Registry Editor changes affect the whole PC.',
              'Source: Chromium policy definitions and Windows policy loader (registry_dict.cc), tags 155.0.8059.40 and 156.0.8078.48')
    cs.save(fig, f'{OUT}/chrome-policy-registry-location.webp')


def policy_page(png):
    # chrome://policy 캡처(1200×675)에 accent 상자로 Reload policies·Status 열 표시
    im = Image.open(png).convert('RGB')
    d = ImageDraw.Draw(im)
    accent = cs.ACCENT
    d.rounded_rectangle((8, 43, 140, 83), radius=8, outline=accent, width=4)
    d.rounded_rectangle((950, 160, 1072, 333), radius=8, outline=accent, width=4)
    im.save(f'{OUT}/chrome-policy-page-status-ok.webp', 'WEBP', quality=90)
    print(f'{OUT}/chrome-policy-page-status-ok.webp', im.size)


if __name__ == '__main__':
    off_switches()
    on_device_flow()
    registry_location()
    if POLICY_PNG:
        policy_page(POLICY_PNG)
