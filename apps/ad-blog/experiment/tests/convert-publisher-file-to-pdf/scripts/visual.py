"""변환된 PDF의 쪽 그림을 Publisher가 직접 만든 PDF(Zamzar 결과, 제작 프로그램 Microsoft Publisher 2010)와 비교.
쪽마다 같은 크기(가로 900px)로 렌더링해 회색조 SSIM을 계산 (1.0 = 같은 그림).
글꼴이 달라 줄바꿈이 조금 달라지는 것도 점수를 낮추므로, 점수는 '얼마나 원본처럼 보이나'의 대략적인 지표로만 씀.
실행: python -I scripts/visual.py out/zamzar/X.pdf out/도구/X.pdf [...]
"""
import json
import sys

import numpy as np
import pypdfium2 as pdfium
from skimage.metrics import structural_similarity

WIDTH = 900


def render(pdf_path):
    pdf = pdfium.PdfDocument(pdf_path)
    pages = []
    for p in pdf:
        w, _ = p.get_size()
        img = p.render(scale=WIDTH / w).to_pil().convert('L')
        pages.append(np.asarray(img, dtype=np.float64) / 255.0)
    return pages


def main():
    ref_path, *others = sys.argv[1:]
    ref = render(ref_path)
    for path in others:
        out = render(path)
        scores = []
        for i, r in enumerate(ref):
            if i >= len(out):
                scores.append(None)
                continue
            o = out[i]
            h = min(r.shape[0], o.shape[0])
            w = min(r.shape[1], o.shape[1])
            scores.append(round(float(structural_similarity(r[:h, :w], o[:h, :w], data_range=1.0)), 3))
        valid = [s for s in scores if s is not None]
        print(json.dumps({'pdf': path, 'pages_ref': len(ref), 'pages_out': len(out), 'ssim_pages': scores,
                          'ssim_mean': round(sum(valid) / len(valid), 3) if valid else None}))


if __name__ == '__main__':
    main()
