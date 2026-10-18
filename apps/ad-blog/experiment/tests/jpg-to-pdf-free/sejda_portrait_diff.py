# Sejda가 다시 저장한 세로 사진 2장(PDF 9·10쪽)을 입력 JPEG(저장 픽셀을 90° 돌린 것)와 픽셀 단위로 비교 → 평균 절대 차이(0~255)
# 사용: /tmp/pdfs/bin/python -I sejda_portrait_diff.py /tmp/j2p/out/sejda-default.pdf /tmp/j2p/in
# 2026-10-18 결과: 09 평균 1.325 (0.52%), 최대 28, 99백분위 5 / 10 평균 1.304 (0.51%), 최대 28, 99백분위 5
import sys
import numpy as np, pymupdf
from PIL import Image
doc = pymupdf.open(sys.argv[1])
for pno, n in ((8, 9), (9, 10)):
    pix = pymupdf.Pixmap(doc, doc[pno].get_images(full=True)[0][0])
    a = np.frombuffer(pix.samples, np.uint8).reshape(pix.h, pix.w, pix.n)[:, :, :3].astype(float)
    src = Image.open(f'{sys.argv[2]}/{n:02d}.jpg').convert('RGB')
    b = next(np.asarray(src.rotate(r, expand=True), float) for r in (-90, 90) if src.rotate(r, expand=True).size == (pix.w, pix.h))
    d = np.abs(a - b)
    print(n, 'mean', d.mean().round(3), 'pct', (d.mean() / 255 * 100).round(2), 'max', d.max(), 'p99', np.percentile(d, 99))
