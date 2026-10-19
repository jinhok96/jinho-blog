"""summary.json·렌더링·GUI/웹 캡처(/tmp/p2w) → 글 이미지(webp)
사용: /tmp/pv/bin/python -I charts.py <작업 폴더 /tmp/p2w> <이미지 출력 폴더>
"""
import json
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from PIL import Image

W = Path(sys.argv[1])
S = W / "shots"
OUT = Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)
SUM = json.loads((W / "out" / "summary.json").read_text())
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 13})
GOOD, BAD, WARN = "#2a9d8f", "#d1495b", "#e09f3e"


def save_img(im, name, q=86):
    im.convert("RGB").save(OUT / f"{name}.webp", quality=q, method=6)


def pct(x):
    return f"{round(x * 100)}%"


lo, sj, il = (SUM[t] for t in ["libreoffice", "sejda", "ilovepdf"])
lt, st, it = lo["overall_text"], sj["overall_text"], il["overall_text"]

# 1) 대표: 도구 × 항목 점검표 (숫자는 summary.json에서)
APPS = ["LibreOffice Writer\n26.8.1", "Sejda PDF Desktop\n7.9.10 (free)", "iLovePDF\n(web, free)"]
rows = [
    [(f"{pct(lt['para_intact'])}\n(every line is\na text box)", False), (f"{lt['tables_ok']} of {lt['tables_expected']}", False),
     ("Yes", True), ("Picture only", False), ("None", True)],
    [(f"{pct(st['para_intact'])}\n(3 files)", True), (f"{st['tables_ok']} of {st['tables_expected']}\n(rows become\nplain lines)", False),
     ("No: 1 column,\n9 pt text", False), ("Refused", False), ("1 file per task,\n3 tasks a day", None)],
    [(f"{pct(it['para_intact'])}\n(some split\nin two)", None), (f"{it['tables_ok']} of {it['tables_expected']}", True),
     ("Yes, columns\nkept", True), (f"OCR: {il['scanned_ocr_word_recall'] * 100:.1f}%\nof words", True), ("1 file per task,\n15 MB, uploads", None)],
]
cols = ["Paragraphs you\ncan edit normally", "Tables rebuilt\nas Word tables", "Looks like\nthe PDF", "Scanned PDF", "Free-version\nlimit"]
fig, ax = plt.subplots(figsize=(12, 6.75))
ax.set_xlim(0, len(cols))
ax.set_ylim(0, len(APPS))
ax.invert_yaxis()
for r, cells in enumerate(rows):
    for c, (txt, ok) in enumerate(cells):
        color = WARN if ok is None else (GOOD if ok else BAD)
        ax.add_patch(plt.Rectangle((c + 0.04, r + 0.08), 0.92, 0.84, color=color, alpha=0.92))
        ax.text(c + 0.5, r + 0.5, txt, ha="center", va="center", color="white", fontsize=12.5, fontweight="bold")
ax.set_xticks([c + 0.5 for c in range(len(cols))], cols, fontsize=12)
ax.xaxis.tick_top()
ax.set_yticks([r + 0.5 for r in range(len(APPS))], APPS, fontsize=13)
ax.tick_params(length=0)
for s in ax.spines.values():
    s.set_visible(False)
fig.text(0.5, 0.025, "ToolProof test, October 2026: 10 text PDFs + 1 scanned PDF with known answers (Sejda free: 3 files a day)",
         ha="center", fontsize=11, color="#555555")
fig.tight_layout(rect=(0, 0.05, 1, 1))
fig.savefig(W / "scorecard.png", dpi=100)
save_img(Image.open(W / "scorecard.png"), "pdf-to-word-results")


# 2) 송장 표 비교: 원본 | LibreOffice | Sejda | iLovePDF (각각 LibreOffice 24.2로 렌더링, 위쪽 절반)
def panel(png, label):
    im = Image.open(png).convert("RGB")
    im = im.crop((0, 30, im.width, int(im.height * 0.48)))
    fig2, a = plt.subplots(figsize=(im.width / 100, im.height / 100 + 0.45), dpi=100)
    a.imshow(im)
    a.set_title(label, fontsize=13, fontweight="bold")
    a.axis("off")
    fig2.tight_layout(pad=0.2)
    p = W / f"panel-{Path(png).parent.name}-{Path(png).stem}.png"
    fig2.savefig(p)
    plt.close(fig2)
    return Image.open(p)


def strip(files, name):
    ps = [panel(W / "render" / f, l) for f, l in files]
    # 2×2 격자
    cw, ch = max(p.width for p in ps), max(p.height for p in ps)
    canvas = Image.new("RGB", (cw * 2 + 12, ch * 2 + 12), "white")
    for i, p in enumerate(ps):
        canvas.paste(p, ((i % 2) * (cw + 12), (i // 2) * (ch + 12)))
    save_img(canvas, name)


strip([("orig-03-1.png", "Original PDF"), ("libreoffice/03-invoice-1.png", "LibreOffice Writer"),
       ("sejda/03-invoice-1.png", "Sejda Desktop"), ("ilovepdf/03-invoice-1.png", "iLovePDF")], "pdf-to-word-invoice-table")

# 3) 편집 테스트: 첫 문단에 문장 추가 후 렌더링 (세로로 3개)
eds = []
for t, label in [("libreoffice", "LibreOffice Writer: the new sentence is cut off after one word"),
                 ("sejda", "Sejda Desktop: reflows, in one small-type column"),
                 ("ilovepdf", "iLovePDF: the paragraph reflows inside its column")]:
    im = Image.open(W / "edit" / f"{t}-05-newsletter-edited-1.png").convert("RGB")
    im = im.crop((60, 40, 680, 300))
    fig3, a = plt.subplots(figsize=(6.2, 2.95), dpi=130)
    a.imshow(im)
    a.set_title(label, fontsize=10, fontweight="bold", loc="left")
    a.axis("off")
    fig3.tight_layout(pad=0.2)
    p = W / f"edit-{t}.png"
    fig3.savefig(p)
    plt.close(fig3)
    eds.append(Image.open(p))
canvas = Image.new("RGB", (max(e.width for e in eds), sum(e.height for e in eds) + 20), "white")
y = 0
for e in eds:
    canvas.paste(e, (0, y))
    y += e.height + 10
save_img(canvas, "pdf-to-word-editing-test")

# 4) 화면 캡처 (Xvfb 1600×1000, iLovePDF는 Playwright 1366×900)
save_img(Image.open(S / "lo3.png").crop((57, 50, 1542, 950)), "libreoffice-pdf-opens-in-draw")
save_img(Image.open(S / "lo-filter.png").crop((237, 0, 1361, 1000)), "libreoffice-writer-pdf-import-filter")
save_img(Image.open(S / "lo9.png").crop((57, 50, 1542, 950)), "libreoffice-writer-zero-words")
save_img(Image.open(S / "sejda-ready.png").crop((200, 100, 1400, 900)), "sejda-pdf-to-word")
save_img(Image.open(S / "s10.png").crop((200, 100, 1400, 900)), "sejda-free-daily-limit")
save_img(Image.open(S / "sejda-scanned.png").crop((200, 100, 1400, 900)), "sejda-scanned-not-supported")
save_img(Image.open(S / "ilove-01-options.png"), "ilovepdf-ocr-premium-option")
save_img(Image.open(S / "ilove-scan-prompt.png").crop((200, 120, 1166, 600)), "ilovepdf-scanned-pdf-prompt")
print(sorted(p.name for p in OUT.glob("*.webp")))
