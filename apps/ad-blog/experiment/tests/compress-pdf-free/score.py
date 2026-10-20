"""압축 결과 채점. 사용: /tmp/pv/bin/python -I score.py IN_DIR OUT_DIR > summary.json
- size: 원본 대비 크기 비율
- ssim: 100dpi 흑백 렌더링에서 원본 대비 쪽별 SSIM (중앙값·최솟값)
- ocr: 스캔·슬라이드는 렌더링(스캔 300dpi, 슬라이드 200dpi) 후 Tesseract 단어 재현율 (정답 = gen.py가 그린 텍스트)
- text: 텍스트 층이 있는 문서는 pdftotext 단어 재현율
- links: URI 링크 주석 수
- img: 첫 이미지 픽셀 크기(pdfimages -list), fonts: 글꼴 수(pdffonts, 0이면 글자가 그림으로 바뀜)
(compress-pdf-offline-free/score.py를 GUI·웹 도구용으로 고침: 시간 측정 제외, 없는 결과 건너뜀)
"""
import json
import os
import statistics
import subprocess
import sys
import tempfile
from collections import Counter
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import numpy as np
import pikepdf
from PIL import Image
from skimage.metrics import structural_similarity

IN, OUT = Path(sys.argv[1]), Path(sys.argv[2])
truth = json.load(open(IN / 'truth.json'))
OCR_DPI = {'scanned-letter': 300, 'slides-screens': 200}


def render(pdf, dpi, fn):
    """쪽마다 렌더링한 PNG 경로에 fn을 적용한 결과 목록 (임시 파일은 바로 지움)"""
    with tempfile.TemporaryDirectory(dir='/tmp/w') as d:
        subprocess.run(['pdftoppm', '-r', str(dpi), '-gray', '-png', str(pdf), d + '/p'], check=True)
        return [fn(p) for p in sorted(Path(d).glob('p-*'))]


def recall(words, ref):
    got, want = Counter(words), Counter(ref)
    return sum(min(got[w], n) for w, n in want.items()) / sum(want.values())


def norm(text):
    return [w.strip('.,:;').lower() for w in text.split() if w.strip('.,:;')]


def ocr_recall(pdf, doc):
    ocr = lambda p: subprocess.run(['tesseract', str(p), '-', '--psm', '6'], capture_output=True, text=True,
                                   env={**os.environ, 'OMP_THREAD_LIMIT': '1'}).stdout
    text = ' '.join(render(pdf, OCR_DPI[doc], ocr))
    return recall(norm(text), truth[doc])


def ssim(orig, out):
    load = lambda p: np.asarray(Image.open(p).convert('L'))
    a, b = render(orig, 100, load), render(out, 100, load)
    vals = []
    for x, y in zip(a, b):
        X, Y = x, y
        h, w = min(X.shape[0], Y.shape[0]), min(X.shape[1], Y.shape[1])
        vals.append(structural_similarity(X[:h, :w], Y[:h, :w], data_range=255))
    return vals


def links(pdf):
    n = 0
    with pikepdf.open(pdf) as p:
        for page in p.pages:
            for a in page.get('/Annots', []):
                if a.get('/A', {}).get('/URI') is not None:
                    n += 1
    return n


def job(args):
    name, doc = args
    orig = IN / f'{doc}.pdf'
    out = orig if name == 'original' else OUT / f'{name}__{doc}.pdf'
    r = {'tool': name, 'doc': doc, 'bytes': out.stat().st_size, 'ratio': out.stat().st_size / orig.stat().st_size, 'links': links(out)}
    if name != 'original':
        v = ssim(orig, out)
        r['ssim_median'], r['ssim_min'] = statistics.median(v), min(v)
    if doc in OCR_DPI:
        r['ocr_recall'] = ocr_recall(out, doc)
    else:
        t = subprocess.run(['pdftotext', str(out), '-'], capture_output=True, text=True).stdout
        r['text_recall'] = recall(norm(t), truth[doc])
    imgs = subprocess.run(['pdfimages', '-list', str(out)], capture_output=True, text=True).stdout.splitlines()[2:]
    if imgs:
        f = imgs[0].split()
        r['img'] = f'{f[3]}x{f[4]} {f[5]} {f[8]}'
        r['n_img'] = len(imgs)
    r['fonts'] = len(subprocess.run(['pdffonts', str(out)], capture_output=True, text=True).stdout.splitlines()[2:])
    return r


tools = sorted({p.name.split('__')[0] for p in OUT.glob('*__*.pdf')})
docs = sorted(truth)
jobs = [('original', d) for d in docs] + [(t, d) for t in tools for d in docs if (OUT / f'{t}__{d}.pdf').exists()]
with ProcessPoolExecutor(4) as ex:
    rows = list(ex.map(job, jobs))
json.dump(rows, sys.stdout, indent=1)
