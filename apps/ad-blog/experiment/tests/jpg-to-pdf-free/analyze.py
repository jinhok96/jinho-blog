# usage: analyze.py <작업 폴더> <PDF>... → 쪽마다 JSON 1줄 (stdout)
# - 페이지 크기(pt)·/Rotate, 쪽 안 이미지의 필터·픽셀 크기
# - 사진 바이트 동일: PDF 안 JPEG 스트림이 입력 JPEG의 압축 데이터(SOS 이후)와 같은가 (다시 압축하지 않고 그대로 넣었는가)
# - 방향: 쪽을 렌더링해 사진 영역을 기준 이미지(ref, 바로 선 모습)와 비교. 0·90·180·270° 중 가장 가까운 각도
# - 여백: 렌더링한 쪽에서 사진이 차지하는 비율
import json, sys, io
from pathlib import Path
import pymupdf as fitz, numpy as np
from PIL import Image

W = Path(sys.argv[1])
def scan_data(b):
    i = b.find(b'\xff\xda'); return b[i:] if i >= 0 else b
ins = {n: scan_data((W / f'in/{n:02d}.jpg').read_bytes()) for n in range(1, 11)}
refs = {n: Image.open(W / f'ref/{n:02d}.png').convert('L').resize((96, 96)) for n in range(1, 11)}

# PDF 안 이미지를 입력 JPEG(저장된 픽셀 그대로, 0·90·180·270° 중 맞는 각도)와 비교한 PSNR(dB). 다시 압축한 경우에만 계산
dec = {}
def psnr_vs_input(pix):
    if pix.n - pix.alpha != 3: pix = fitz.Pixmap(fitz.csRGB, pix)
    a = np.frombuffer(pix.samples, np.uint8).reshape(pix.h, pix.w, pix.n)[:, :, :3].astype(float)
    best = None
    for n in range(1, 11):
        if n not in dec: dec[n] = Image.open(W / f'in/{n:02d}.jpg').convert('RGB')
        for ang in (0, 90, 180, 270):
            b = dec[n].rotate(ang, expand=True)
            if b.size != (pix.w, pix.h): continue
            mse = ((a - np.asarray(b, float)) ** 2).mean()
            p = 99.0 if mse == 0 else 10 * np.log10(255 ** 2 / mse)
            if best is None or p > best: best = p
    return None if best is None else round(best, 2)

def best_match(img):
    best = None
    for n, r in refs.items():
        rr = np.asarray(r, float)
        for ang in (0, 90, 180, 270):
            a = np.asarray(img.rotate(ang, expand=True).convert('L').resize((96, 96)), float)
            d = np.abs(a - rr).mean()
            if best is None or d < best[0]: best = (d, n, ang)
    return best

for path in sys.argv[2:]:
    doc = fitz.open(path)
    for pno, page in enumerate(doc):
        info = {'pdf': Path(path).name, 'size_bytes': Path(path).stat().st_size, 'page': pno + 1,
                'mediabox_pt': [round(page.mediabox.width, 1), round(page.mediabox.height, 1)],
                'rotate': page.rotation, 'images': []}
        for img in page.get_images(full=True):
            xref = img[0]
            raw = doc.xref_stream_raw(xref)
            filt = doc.xref_get_key(xref, 'Filter')[1]
            same = filt == '/DCTDecode' and any(scan_data(raw) == v for v in ins.values())
            entry = {'w': img[2], 'h': img[3], 'filter': filt, 'bytes': len(raw), 'jpeg_bytes_identical': same}
            if not same:
                entry['psnr_vs_input'] = psnr_vs_input(fitz.Pixmap(doc, xref))
            info['images'].append(entry)
        pix = page.get_pixmap(dpi=24)
        im = Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB')
        a = np.asarray(im.convert('L'), float)
        bg = np.abs(a - 255) > 6
        # 머리글·바닥글 글자 줄은 빼고 사진 영역만: 흰색이 아닌 픽셀이 30% 이상인 행·열
        rows = np.where(bg.mean(axis=1) > 0.3)[0]; cols = np.where(bg.mean(axis=0) > 0.3)[0]
        if len(rows) and len(cols):
            box = (cols.min(), rows.min(), cols.max() + 1, rows.max() + 1)
            info['photo_area_ratio'] = round((box[2] - box[0]) * (box[3] - box[1]) / (im.width * im.height), 3)
            d, n, ang = best_match(im.crop(box))
            info.update(match_photo=n, rotate_needed=ang, match_diff=round(d, 1),
                        displayed='portrait' if box[3] - box[1] > box[2] - box[0] else 'landscape')
        print(json.dumps(info))
