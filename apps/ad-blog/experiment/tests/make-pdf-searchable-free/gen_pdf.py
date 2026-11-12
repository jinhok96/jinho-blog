"""'스캔한 PDF를 검색 가능하게' 시험용 PDF 2개와 페이지별 정답 텍스트 생성.

본문: Project Gutenberg 퍼블릭 도메인 책 (미국 기준)
  https://www.gutenberg.org/cache/epub/1342/pg1342.txt  (Pride and Prejudice)
  https://www.gutenberg.org/cache/epub/84/pg84.txt      (Frankenstein)
  https://www.gutenberg.org/cache/epub/11/pg11.txt      (Alice's Adventures in Wonderland)
표 페이지의 날짜·내역·금액은 이 스크립트가 만든 가상의 시험 데이터 (실제 명세서 아님).

사용: python gen_pdf.py <gutenberg 텍스트 폴더> <출력 폴더>

scanned-8-pages.pdf (그림만 있는 PDF, US Letter, 300 ppi 회색조 JPEG — 사무실 스캐너 기본값과 비슷하게)
  p1~p5 text:   세리프 11pt 본문 한 쪽, 기울기 ±1.2도·흐림·노이즈(σ4)·JPEG 75
  p6   table:   날짜·내역·참조 번호·금액 표 (숫자 판독)
  p7   small:   8pt 작은 글씨
  p8   photo:   휴대폰으로 찍은 쪽 (원근 왜곡·조명 그라데이션)을 Letter 쪽에 붙임
mixed-3-pages.pdf (진짜 글자가 있는 쪽과 스캔 쪽이 섞인 PDF)
  p1 digital:   Chromium으로 만든 글자 PDF (링크 1개 포함)
  p2 scan:      위와 같은 스캔 쪽
  p3 digital:   Chromium으로 만든 글자 PDF
"""

import io
import json
import random
import re
import sys
from pathlib import Path

import cv2
import img2pdf
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from playwright.sync_api import sync_playwright
from pypdf import PdfReader, PdfWriter

SRC, OUT = Path(sys.argv[1]), Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)
rng = random.Random(20261113)
DPI = 300
W, H = int(8.5 * DPI), 11 * DPI
PAPER = 244
SERIF = [
    "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
    "/usr/share/fonts/truetype/crosextra/Caladea-Regular.ttf",
]
SANS = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
SANS_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
MONO = "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf"


def clean(t: str) -> str:
    t = t.replace("_", "").replace("’", "'").replace("‘", "'")
    t = t.replace("“", '"').replace("”", '"').replace("—", " - ")
    return re.sub(r"\s+", " ", t).strip()


def paragraphs():
    out = []
    for f in sorted(SRC.glob("pg*.txt")):
        body = f.read_text(encoding="utf-8").split("*** START")[1].split("*** END")[0]
        for p in re.split(r"\n\s*\n", body):
            p = clean(p)
            n = len(p.split())
            if 40 <= n <= 120 and not p.isupper() and "Illustration" not in p:
                out.append(p)
    rng.shuffle(out)
    return out


PARAS = paragraphs()


def wrap(draw, text, font, width):
    lines = []
    for para in text.split("\n"):
        line = ""
        for w in para.split():
            cand = (line + " " + w).strip()
            if draw.textlength(cand, font=font) <= width:
                line = cand
            else:
                lines.append(line)
                line = w
        lines.append(line)
        lines.append("")  # 문단 사이 빈 줄
    return lines[:-1]


def fill_page(font_path, pt, margin=300, spacing=1.35):
    """Letter 한 쪽을 문단으로 채우고 (그림, 정답 텍스트) 반환."""
    size = round(pt / 72 * DPI)
    font = ImageFont.truetype(font_path, size)
    im = Image.new("L", (W, H), PAPER)
    d = ImageDraw.Draw(im)
    y, used = margin, []
    while True:
        para = PARAS[-1]
        lines = wrap(d, para, font, W - 2 * margin)
        need = len(lines) * size * spacing
        if y + need > H - margin:
            break
        PARAS.pop()
        for ln in lines:
            d.text((margin, y), ln, font=font, fill=22)
            y += int(size * spacing)
        y += int(size * spacing)
        used.append(para)
    return im, " ".join(used)


def jpeg_bytes(im, q):
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=q, dpi=(DPI, DPI))
    return buf.getvalue()


def scanify(im, angle):
    im = im.rotate(angle, resample=Image.BICUBIC, expand=False, fillcolor=PAPER)
    im = im.filter(ImageFilter.GaussianBlur(0.7))
    a = np.array(im).astype(np.float32)
    a += np.random.default_rng(rng.randint(0, 10**6)).normal(0, 4, a.shape)
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def table_page():
    r = random.Random(77)
    title_font = ImageFont.truetype(SANS_BOLD, 58)
    head_font = ImageFont.truetype(SANS_BOLD, 42)
    font = ImageFont.truetype(SANS, 42)
    im = Image.new("L", (W, H), PAPER)
    d = ImageDraw.Draw(im)
    words = []
    title = "Account Activity Statement"
    sub = "Test data for this experiment. Statement period 09/01/2026 to 09/30/2026"
    d.text((300, 300), title, font=title_font, fill=22)
    d.text((300, 400), sub, font=font, fill=60)
    words += [title, sub]
    cols = [300, 640, 1500, 1930]
    heads = ["Date", "Description", "Reference", "Amount"]
    y = 560
    for x, h in zip(cols, heads):
        d.text((x, y), h, font=head_font, fill=22)
    words += heads
    d.line((300, y + 70, W - 300, y + 70), fill=40, width=4)
    y += 110
    payees = ["Grocery Market", "Electric Utility", "Coffee Shop", "Pharmacy", "Gas Station", "Bookstore",
              "Water Service", "Hardware Store", "Bakery", "Streaming Service", "Pet Supplies", "Car Wash",
              "Dry Cleaner", "Phone Bill", "Restaurant", "Parking Garage", "Florist", "Gym Membership"]
    total = 0.0
    for i, payee in enumerate(payees):
        date = f"09/{i + 1:02d}/2026"
        ref = f"{r.randint(100000, 999999)}"
        amt = round(r.uniform(3.5, 240.0), 2)
        total += amt
        amount = f"${amt:,.2f}"
        cells = [date, payee, ref, amount]
        for j, (x, c) in enumerate(zip(cols, cells)):
            if j == 3:
                x = W - 300 - d.textlength(c, font=font)
            d.text((x, y), c, font=font, fill=22)
        words += cells
        y += 108
    d.line((300, y, W - 300, y), fill=40, width=3)
    y += 30
    tot = f"${total:,.2f}"
    d.text((640, y), "Total", font=head_font, fill=22)
    d.text((W - 300 - d.textlength(tot, font=head_font), y), tot, font=head_font, fill=22)
    words += ["Total", tot]
    return im, " ".join(words)


def photo_page():
    page, text = fill_page(SERIF[0], 11, margin=260)
    page = page.resize((W // 2, H // 2), Image.LANCZOS).convert("RGB")
    w, h = page.size
    a = np.array(page)
    src = np.float32([[0, 0], [w, 0], [w, h], [0, h]])
    j = lambda s: rng.uniform(0, s)
    dst = np.float32([[w * 0.07 + j(30), h * 0.05 + j(30)], [w * 0.93 - j(30), h * 0.08 + j(30)],
                      [w * 0.96 - j(20), h * 0.95 - j(20)], [w * 0.04 + j(20), h * 0.92 - j(20)]])
    m = cv2.getPerspectiveTransform(src, dst)
    warped = cv2.warpPerspective(a, m, (w, h), borderValue=(92, 84, 76))
    gx = np.linspace(1.05, 0.65, w)[None, :]
    gy = np.linspace(1.0, 0.86, h)[:, None]
    lit = np.clip(warped.astype(np.float32) * (gx * gy)[..., None] * np.array([1.0, 0.97, 0.9]), 0, 255)
    im = Image.fromarray(lit.astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0))
    im = im.resize((W, H), Image.BICUBIC)
    return im, text


pages, truth = [], []
for i in range(5):
    im, text = fill_page(SERIF[i % 3], 11)
    pages.append(jpeg_bytes(scanify(im, rng.uniform(-1.2, 1.2)), 75))
    truth.append({"pdf": "scanned-8-pages.pdf", "page": i + 1, "kind": "text", "text": text})
im, text = table_page()
pages.append(jpeg_bytes(scanify(im, rng.uniform(-0.8, 0.8)), 75))
truth.append({"pdf": "scanned-8-pages.pdf", "page": 6, "kind": "table", "text": text})
im, text = fill_page(SERIF[0], 8, margin=280)
pages.append(jpeg_bytes(scanify(im, rng.uniform(-1.0, 1.0)), 75))
truth.append({"pdf": "scanned-8-pages.pdf", "page": 7, "kind": "small", "text": text})
im, text = photo_page()
buf = io.BytesIO()
im.save(buf, "JPEG", quality=80, dpi=(DPI, DPI))
pages.append(buf.getvalue())
truth.append({"pdf": "scanned-8-pages.pdf", "page": 8, "kind": "photo", "text": text})
letter = img2pdf.get_layout_fun((img2pdf.in_to_pt(8.5), img2pdf.in_to_pt(11)))
(OUT / "scanned-8-pages.pdf").write_bytes(img2pdf.convert(pages, layout_fun=letter))

# 섞인 PDF: 글자 쪽 2개(Chromium) + 스캔 쪽 1개
digital = []
for _ in range(2):
    paras = [PARAS.pop() for _ in range(4)]
    digital.append(paras)
html = """<!doctype html><html><head><meta charset="utf-8"><style>
@page {{ size: Letter; margin: 1in; }} body {{ font-family: 'Liberation Serif'; font-size: 12pt; line-height: 1.4; color: #111; }}
h1 {{ font-family: 'Liberation Sans'; font-size: 18pt; }} p {{ margin: 0 0 12pt; }}</style></head><body>
<h1>{title}</h1>{body}{link}</body></html>"""
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium-1243/chrome-linux64/chrome")
    pg = b.new_page()
    digital_pdfs = []
    for k, paras in enumerate(digital):
        title = "Chapter Notes, Part %d" % (k + 1)
        link = '<p>Source text: <a href="https://www.gutenberg.org/">Project Gutenberg</a></p>' if k == 0 else ""
        pg.set_content(html.format(title=title, body="".join(f"<p>{p}</p>" for p in paras), link=link))
        digital_pdfs.append(pg.pdf(format="Letter", print_background=True))
        text = title + " " + " ".join(paras) + (" Source text: Project Gutenberg" if k == 0 else "")
        truth.append({"pdf": "mixed-3-pages.pdf", "page": 1 if k == 0 else 3, "kind": "digital", "text": text})
    b.close()
im, text = fill_page(SERIF[1], 11)
scan_pdf = img2pdf.convert([jpeg_bytes(scanify(im, rng.uniform(-1.2, 1.2)), 75)], layout_fun=letter)
truth.append({"pdf": "mixed-3-pages.pdf", "page": 2, "kind": "scan", "text": text})
writer = PdfWriter()
for part in (digital_pdfs[0], scan_pdf, digital_pdfs[1]):
    for p in PdfReader(io.BytesIO(part)).pages[:1]:
        writer.add_page(p)
with open(OUT / "mixed-3-pages.pdf", "wb") as f:
    writer.write(f)

truth.sort(key=lambda t: (t["pdf"], t["page"]))
(OUT / "truth.json").write_text(json.dumps(truth, indent=1, ensure_ascii=False))
for t in truth:
    print(t["pdf"], t["page"], t["kind"], len(t["text"].split()), "words")
