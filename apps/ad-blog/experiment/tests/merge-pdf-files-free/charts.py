"""results.jsonl·GUI 캡처(/tmp/merge/*.png) → 글 이미지(webp)
사용: /tmp/pdfs/bin/python -I charts.py <작업 폴더 /tmp/merge> <이미지 출력 폴더>
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
GOOD, BAD, NA, INK = "#2a9d8f", "#d1495b", "#8d99ae", "#222222"


def get(app, test):
    return next(r for r in R if r["app"] == app and r["test"] == test)


def save_img(im, name, q=86):
    im.convert("RGB").save(OUT / f"{name}.webp", quality=q, method=6)


# 1) 대표: 앱 × 항목 점검표
APPS = [("pdfsam", "PDFsam Basic 6.0.6"), ("pa", "PDF Arranger 1.14"), ("sejda", "Sejda PDF Desktop\n7.9.10 (free)")]
second = {"pdfsam": get("pdfsam/w9-first", "W-9 first, report second")["result"],
          "pa": get("pa/w9-first", "W-9 first, report second")["result"], "sejda": None}
rows = []
for key, _ in APPS:
    p = get(key, "packet (report+W-9+photos)")["result"]
    f = get(key, "two W-9 forms")
    s = second[key]
    rows.append([
        (f'{p["text_pages_identical"]} of 12', p["text_pages_identical"] == 12),
        ("Same files" if p["jpeg_identical_to_source"] == 2 else "Re-encoded", p["jpeg_identical_to_source"] == 2),
        (f'{len(p["bookmarks"])} of 4 / {p["internal_links_resolve"]} of 3', len(p["bookmarks"]) == 4 and p["internal_links_resolve"] == 3),
        (("Not tested", None) if s is None else
         (f'{len(s["bookmarks"])} of 4 / {s["internal_links_resolve"]} of 3', len(s["bookmarks"]) == 4 and s["internal_links_resolve"] == 3)),
        ("Yes" if f["shared"]["shared_fields"] == 0 and f["result"]["unique_fields"] == 46 else "No", f["shared"]["shared_fields"] == 0),
        ("50 pages,\n3 tasks a day", False) if key == "sejda" else ("None", True),
    ])
cols = ["Text kept\n(pages)", "Photos kept\nas is", "Bookmarks / links\n(report first)", "Bookmarks / links\n(report second)", "Two W-9s stay\nseparate", "Free-version\nlimit"]
fig, ax = plt.subplots(figsize=(12, 6.75))
ax.set_xlim(0, len(cols))
ax.set_ylim(0, len(APPS))
ax.invert_yaxis()
for r, cells in enumerate(rows):
    for c, (txt, ok) in enumerate(cells):
        color = NA if ok is None else (GOOD if ok else BAD)
        ax.add_patch(plt.Rectangle((c + 0.04, r + 0.08), 0.92, 0.84, color=color, alpha=0.9))
        ax.text(c + 0.5, r + 0.5, txt, ha="center", va="center", color="white", fontsize=13, fontweight="bold")
ax.set_yticks([r + 0.5 for r in range(len(APPS))], [l for _, l in APPS], fontsize=13)
ax.set_xticks([c + 0.5 for c in range(len(cols))], cols, fontsize=11.5)
ax.xaxis.tick_top()
ax.tick_params(length=0)
for sp in ax.spines.values():
    sp.set_visible(False)
fig.text(0.5, 0.035, "Merging a 4-page report (4 bookmarks, 3 contents links), a fillable IRS W-9 and 2 photo pages. Tested October 18, 2026.",
         ha="center", fontsize=11, color="#555555")
fig.subplots_adjust(left=0.17, right=0.985, top=0.83, bottom=0.09)
fig.savefig(W / "hero.png", dpi=100)
save_img(Image.open(W / "hero.png"), "merge-pdf-what-each-app-keeps")


# 2) W-9 두 장: Merge fields(공유) vs 기본값(이름 바꾸기)
def strip(png, y):
    return Image.open(png).crop((240, y, 1000, y + 62))


def labeled(img, text, color):
    bar = Image.new("RGB", (img.width, 40), color)
    ImageDraw.Draw(bar).text((12, 7), text, font=FONT, fill="white")
    out = Image.new("RGB", (img.width, img.height + 40), "white")
    out.paste(bar, (0, 0))
    out.paste(img, (0, 40))
    return out


blocks = [
    labeled(strip(W / "mf-p1.png", 155), "PDFsam \"Merge fields\": typed into the first W-9", "#555555"),
    labeled(strip(W / "mf-p7.png", 149), "...and the same words appear on the second W-9", BAD),
    labeled(strip(W / "pdfsam-def-p7.png", 149), "Default (rename fields): second W-9 stays empty", GOOD),
]
gap = 14
canvas = Image.new("RGB", (1200, 675), "white")
y = (675 - sum(b.height for b in blocks) - gap * 2) // 2
for b in blocks:
    canvas.paste(b.resize((1120, round(b.height * 1120 / b.width))), (40, y))
    y += round(b.height * 1120 / b.width) + gap
save_img(canvas, "merge-two-w9-forms-shared-fields")

# 3) 앱 화면 캡처
save_img(Image.open(W / "pdfsam-done.png").crop((320, 100, 1280, 900)), "pdfsam-merge-three-files")
save_img(Image.open(W / "pdfsam-forms-menu.png").crop((577, 430, 1262, 690)), "pdfsam-merge-form-options")
save_img(Image.open(W / "pa-prefs.png").crop((77, 380, 632, 450)).resize((1110, 140)), "pdf-arranger-preserve-first-file-setting")
save_img(Image.open(W / "s9.png").crop((0, 0, 708, 608)), "pdf-arranger-merged-pages")
save_img(Image.open(W / "sejda-files.png").crop((200, 127, 1385, 900)), "sejda-merge-files-view")
a = Image.open(W / "sejda-limit-50.png").crop((340, 190, 1265, 510))
b = Image.open(W / "sejda-limit-3tasks.png").crop((340, 190, 1265, 510))
both = Image.new("RGB", (925, 660), "white")
both.paste(a, (0, 0))
both.paste(b, (0, 340))
save_img(both, "sejda-free-limits-upgrade-screens")
print(sorted(p.name for p in OUT.iterdir()))
