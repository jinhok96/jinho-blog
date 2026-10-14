"""OCR 테스트 이미지 50장 생성 (5개 조건 x 10장, 정답 텍스트 포함).

본문 텍스트: Project Gutenberg 퍼블릭 도메인 책 (미국 기준)
  https://www.gutenberg.org/cache/epub/1342/pg1342.txt  (Pride and Prejudice)
  https://www.gutenberg.org/cache/epub/84/pg84.txt      (Frankenstein)
  https://www.gutenberg.org/cache/epub/11/pg11.txt      (Alice's Adventures in Wonderland)
영수증은 이 스크립트가 만든 가상의 품목·가격 (테스트 데이터, 실제 영수증 아님).

사용: python gen.py <gutenberg 텍스트 폴더> <출력 폴더>
조건
  screenshot: Chromium으로 렌더링한 웹 페이지 문단 (16px)
  small:      같은 방식, 11px 글자
  scan:       세리프 문서를 회전(±2도)·노이즈·흐림·JPEG 60으로 스캔처럼
  photo:      원근 왜곡·조명 그라데이션·흐림·축소로 휴대폰 사진처럼
  receipt:    고정폭 글꼴 영수증 (품목·가격·날짜·전화번호), 흐림·감열지 바램
"""

import json
import random
import re
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from playwright.sync_api import sync_playwright

SRC, OUT = Path(sys.argv[1]), Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)
rng = random.Random(20261015)

FONTS = {
    "serif": [
        "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
        "/usr/share/fonts/truetype/crosextra/Caladea-Regular.ttf",
    ],
    "sans": [
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/crosextra/Carlito-Regular.ttf",
    ],
    "mono": [
        "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    ],
}
WEB_FONTS = ["Inter", "Liberation Sans", "DejaVu Sans", "Carlito", "Liberation Serif"]


def clean(t: str) -> str:
    t = t.replace("_", "").replace("’", "'").replace("‘", "'")
    t = t.replace("“", '"').replace("”", '"').replace("—", " - ")
    return re.sub(r"\s+", " ", t).strip()


def paragraphs():
    out = []
    for f in sorted(SRC.glob("pg*.txt")):
        body = f.read_text(encoding="utf-8")
        body = body.split("*** START")[1].split("*** END")[0]
        for p in re.split(r"\n\s*\n", body):
            p = clean(p)
            words = p.split()
            if 45 <= len(words) <= 110 and not p.isupper() and "Illustration" not in p:
                out.append(p)
    rng.shuffle(out)
    return out


PARAS = paragraphs()


def take(n_words_min: int) -> str:
    """문단을 이어 붙여 n_words_min 단어 이상 텍스트를 만듦 (문단 구분은 줄바꿈)."""
    parts, count = [], 0
    while count < n_words_min:
        p = PARAS.pop()
        parts.append(p)
        count += len(p.split())
    return "\n".join(parts)


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
    return lines


def render_page(text, font_path, size, width, margin, bg=(255, 255, 255), fg=(20, 20, 20), spacing=1.45):
    font = ImageFont.truetype(font_path, size)
    tmp = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    lines = wrap(tmp, text, font, width - 2 * margin)
    h = int(2 * margin + len(lines) * size * spacing)
    im = Image.new("RGB", (width, h), bg)
    d = ImageDraw.Draw(im)
    y = margin
    for ln in lines:
        d.text((margin, y), ln, font=font, fill=fg)
        y += int(size * spacing)
    return im


def jpeg(im, q):
    ok, buf = cv2.imencode(".jpg", cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, q])
    return Image.fromarray(cv2.cvtColor(cv2.imdecode(buf, cv2.IMREAD_COLOR), cv2.COLOR_BGR2RGB))


def noise(im, sigma):
    a = np.array(im).astype(np.float32)
    a += np.random.default_rng(rng.randint(0, 10**6)).normal(0, sigma, a.shape[:2])[..., None]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def make_scan(text, i):
    im = render_page(text, FONTS["serif"][i % 3], 34, 1700, 140, bg=(246, 243, 236))
    im = im.rotate(rng.uniform(-2, 2), resample=Image.BICUBIC, expand=True, fillcolor=(246, 243, 236))
    im = im.filter(ImageFilter.GaussianBlur(0.8))
    im = noise(im, 10)
    return jpeg(im, 60)


def make_photo(text, i):
    page = render_page(text, FONTS["sans" if i % 2 else "serif"][i % 3], 34, 1600, 120)
    w, h = page.size
    canvas_w, canvas_h = int(w * 1.25), int(h * 1.25)
    a = np.array(page)
    src = np.float32([[0, 0], [w, 0], [w, h], [0, h]])
    j = lambda s: rng.uniform(0, s)
    dst = np.float32([
        [canvas_w * 0.08 + j(60), canvas_h * 0.06 + j(60)],
        [canvas_w * 0.92 - j(60), canvas_h * 0.10 + j(60)],
        [canvas_w * 0.95 - j(40), canvas_h * 0.94 - j(40)],
        [canvas_w * 0.05 + j(40), canvas_h * 0.90 - j(40)],
    ])
    m = cv2.getPerspectiveTransform(src, dst)
    warped = cv2.warpPerspective(a, m, (canvas_w, canvas_h), borderValue=(92, 84, 76))
    # 왼쪽 위 → 오른쪽 아래로 어두워지는 조명
    gx = np.linspace(1.05, 0.62, canvas_w)[None, :]
    gy = np.linspace(1.0, 0.85, canvas_h)[:, None]
    lit = np.clip(warped.astype(np.float32) * (gx * gy)[..., None] * np.array([1.0, 0.97, 0.9]), 0, 255)
    im = Image.fromarray(lit.astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    im = im.resize((1400, int(1400 * canvas_h / canvas_w)), Image.LANCZOS)
    im = noise(im, 6)
    return jpeg(im, 75)


ITEMS = [
    "Whole Milk 1gal", "Large Eggs 12ct", "Sourdough Bread", "Bananas 2.3lb", "Cheddar Cheese",
    "Greek Yogurt", "Coffee Beans 12oz", "Olive Oil 500ml", "Spinach Bag", "Chicken Thighs",
    "Pasta Penne", "Tomato Sauce", "Paper Towels 6pk", "Dish Soap", "Apples Gala 3lb",
    "Orange Juice", "Butter Salted", "Rice Jasmine 5lb", "Black Beans", "Peanut Butter",
    "Frozen Peas", "Ground Coffee", "Trash Bags 30ct", "Shampoo 12oz", "AA Batteries 8pk",
]


def receipt_text(i):
    r = random.Random(1000 + i)
    n = r.randint(7, 12)
    items = r.sample(ITEMS, n)
    lines = ["FRESHWAY MARKET #%04d" % r.randint(100, 9999), "%d Main St, Springfield" % r.randint(10, 999),
             "Tel (555) %03d-%04d" % (r.randint(100, 999), r.randint(0, 9999)),
             "%02d/%02d/2026  %02d:%02d" % (r.randint(1, 12), r.randint(1, 28), r.randint(8, 21), r.randint(0, 59)), ""]
    total = 0.0
    for it in items:
        p = round(r.uniform(0.79, 18.99), 2)
        total += p
        lines.append(f"{it:<22}{p:>8.2f}")
    tax = round(total * 0.0625, 2)
    lines += ["", f"{'SUBTOTAL':<22}{total:>8.2f}", f"{'TAX 6.25%':<22}{tax:>8.2f}", f"{'TOTAL':<22}{total + tax:>8.2f}",
              f"{'VISA ****' + str(r.randint(1000, 9999)):<22}{total + tax:>8.2f}", "", "THANK YOU FOR SHOPPING"]
    return lines


def make_receipt(lines, i):
    font = ImageFont.truetype(FONTS["mono"][i % 2], 30)
    w = 680
    h = 80 + len(lines) * 42 + 60
    im = Image.new("RGB", (w, h), (250, 250, 247))
    d = ImageDraw.Draw(im)
    y = 60
    for ln in lines:
        d.text((40, y), ln, font=font, fill=(60, 60, 64))
        y += 42
    # 감열지 바램: 아래로 갈수록 옅어짐
    a = np.array(im).astype(np.float32)
    fade = np.linspace(0.0, 0.45 + 0.03 * (i % 5), h)[:, None, None]
    a = a + (250 - a) * fade
    im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.9))
    im = im.rotate(rng.uniform(-3, 3), resample=Image.BICUBIC, expand=True, fillcolor=(70, 70, 75))
    return jpeg(noise(im, 5), 70)


def html_page(text, font, size, width):
    paras = "".join(f"<p>{p}</p>" for p in text.split("\n"))
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
    body{{margin:0;background:#fff}} main{{width:{width}px;padding:28px 32px;font-family:'{font}';font-size:{size}px;
    line-height:1.55;color:#1f2328;hyphens:none}} p{{margin:0 0 {size}px}}</style></head><body><main>{paras}</main></body></html>"""


meta = []
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    pg = b.new_page(viewport={"width": 1000, "height": 400}, device_scale_factor=1)
    for cond, size, words in (("screenshot", 16, 150), ("small", 11, 150)):
        for i in range(10):
            text = take(words)
            pg.set_content(html_page(text, WEB_FONTS[i % 5], size, 860 if cond == "screenshot" else 640))
            path = OUT / f"{cond}_{i:02d}.png"
            pg.locator("main").screenshot(path=str(path))
            meta.append({"file": path.name, "cond": cond, "text": clean(text)})
    b.close()

for i in range(10):
    text = take(110)
    path = OUT / f"scan_{i:02d}.jpg"
    make_scan(text, i).save(path, quality=95)
    meta.append({"file": path.name, "cond": "scan", "text": clean(text)})
for i in range(10):
    text = take(110)
    path = OUT / f"photo_{i:02d}.jpg"
    make_photo(text, i).save(path, quality=95)
    meta.append({"file": path.name, "cond": "photo", "text": clean(text)})
for i in range(10):
    lines = receipt_text(i)
    path = OUT / f"receipt_{i:02d}.jpg"
    make_receipt(lines, i).save(path, quality=95)
    meta.append({"file": path.name, "cond": "receipt", "text": clean(" ".join(lines))})

(OUT / "truth.json").write_text(json.dumps(meta, indent=1, ensure_ascii=False))
print(len(meta), "images")
