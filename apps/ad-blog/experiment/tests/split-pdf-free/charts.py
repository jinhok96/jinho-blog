"""results.jsonl·GUI 캡처(/tmp/split/*.png) → 글 이미지(webp)
사용: /tmp/pdfs/bin/python -I charts.py <작업 폴더 /tmp/split> <이미지 출력 폴더>
"""
import json
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw, ImageFont

W = Path(sys.argv[1])
OUT = Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)
HERE = Path(__file__).parent
R = [json.loads(l) for l in (HERE / "results.jsonl").read_text().splitlines()]
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 13})
FONT = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
FONT_S = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
GOOD, BAD, INK = "#2a9d8f", "#d1495b", "#222222"


def get(app_prefix, task):
    return next(r["result"] for r in R if r["app"].startswith(app_prefix) and r["task"] == task)


def save_img(im, name, q=86):
    im.convert("RGB").save(OUT / f"{name}.webp", quality=q, method=6)


# 1) 대표: 앱 × 항목 점검표
APPS = [("PDFsam Basic", "PDFsam Basic 6.0.6"), ("PDF Arranger", "PDF Arranger 1.14"), ("Chrome", "Chrome: Print >\nSave as PDF")]
rows = []
for key, _ in APPS:
    a, b = get(key, "pages 1-4"), get(key, "pages 5-10")
    photo = get(key, "page 11") if key == "Chrome" else get(key, "page 11")
    rows.append([
        (f'{a["text_pages_identical"] + b["text_pages_identical"]} of 10', a["text_pages_identical"] + b["text_pages_identical"] == 10),
        ("Same file" if photo["jpeg_identical_to_source"] == 1 else "Re-encoded", photo["jpeg_identical_to_source"] == 1),
        (f'{len(a["bookmarks"])} of 4', len(a["bookmarks"]) == 4),
        (f'{a["internal_links_resolve"]} of 3', a["internal_links_resolve"] == 3),
        ("Yes" if b["form_fields"] or b["widgets_on_pages"] else "No: flattened", bool(b["form_fields"] or b["widgets_on_pages"])),
        ("None" if not b["bookmarks"] else f'{len(b["bookmarks"])} dead ones', not b["bookmarks"]),
    ])
cols = ["Text kept\n(pages)", "Photo kept\nas is", "Bookmarks\nkept", "Contents links\nwork", "Form still\nfillable", "Bookmarks from\nother pages"]
fig, ax = plt.subplots(figsize=(12, 6.75))
ax.set_xlim(0, len(cols))
ax.set_ylim(0, len(APPS))
ax.invert_yaxis()
for r, cells in enumerate(rows):
    for c, (txt, ok) in enumerate(cells):
        ax.add_patch(plt.Rectangle((c + 0.04, r + 0.08), 0.92, 0.84, color=GOOD if ok else BAD, alpha=0.9 if ok else 0.85))
        ax.text(c + 0.5, r + 0.5, txt, ha="center", va="center", color="white", fontsize=14, fontweight="bold")
ax.set_yticks([r + 0.5 for r in range(len(APPS))], [l for _, l in APPS], fontsize=14)
ax.set_xticks([c + 0.5 for c in range(len(cols))], cols, fontsize=12)
ax.xaxis.tick_top()
ax.tick_params(length=0)
for sp in ax.spines.values():
    sp.set_visible(False)
ax.set_title("Splitting one 12-page PDF into a 4-page report and a 6-page W-9 form", loc="left", fontsize=16, pad=58)
fig.text(0.01, 0.015, "Checked in each output file and in Chrome's PDF viewer, October 17, 2026. Green = same as the original.", fontsize=11, color="#555")
fig.tight_layout(rect=(0, 0.03, 1, 1))
p = W / "matrix.png"
fig.savefig(p, dpi=100)
plt.close(fig)
save_img(Image.open(p), "split-pdf-what-each-app-keeps", q=88)


def label(im, text, color=INK):
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, im.width, 40), fill="white")
    d.text((12, 8), text, font=FONT, fill=color)
    return im


# 2) PDFsam Extract 설정 화면 (창 부분만)
save_img(Image.open(W / "shot_pdfsam_extract_settings.png").crop((320, 100, 1280, 900)), "pdfsam-extract-pages-settings")
# 3) PDFsam Split by size 설정
save_img(Image.open(W / "shot_pdfsam_size_settings.png").crop((320, 100, 1280, 620)), "pdfsam-split-by-size-settings")
# 4) PDF Arranger Export 메뉴
save_img(Image.open(W / "shot_pa_export_menu.png"), "pdf-arranger-export-selection-menu")
# 5) Chrome 인쇄 미리 보기: Custom 5-10
save_img(Image.open(W / "shot_chrome_print.png").crop((256, 82, 1342, 800)), "chrome-print-save-as-pdf-custom-pages")
# 6) 양식: PDFsam 추출본(입력됨) vs Chrome 인쇄본(입력 안 됨)
a = Image.open(W / "fs-pdfsam.png").crop((0, 0, 762, 250))
b = Image.open(W / "fs-chrome.png").crop((0, 0, 762, 250))
im = Image.new("RGB", (a.width, 2 * (a.height + 50)), "white")
im.paste(label(Image.new("RGB", (a.width, 40), "white"), 'PDFsam Extract: clicked line 1 and typed " - EDITED"', GOOD), (0, 0))
im.paste(a, (0, 45))
im.paste(label(Image.new("RGB", (a.width, 40), "white"), "Chrome Save as PDF: same click and typing, nothing changed", BAD), (0, a.height + 50))
im.paste(b, (0, a.height + 95))
save_img(im.resize((1200, round(im.height * 1200 / im.width))), "split-w9-form-pdfsam-vs-chrome-print")
# 7) PDF Arranger: W-9만 내보냈는데 보고서 책갈피가 남음
save_img(Image.open(W / "shot_pa_stale_bookmarks.png"), "pdf-arranger-leftover-bookmarks")
print("ok")
