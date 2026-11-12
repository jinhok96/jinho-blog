"""결과 PDF의 쪽 그림이 원본과 얼마나 같은지 (화질 손실) 비교.

사용: python image_quality.py <원본 폴더> <결과 폴더> <출력 json>
- 각 PDF의 지정한 쪽을 pdftoppm으로 300 ppi 회색조 렌더링해 원본 렌더링과 PSNR(dB) 비교
  (같은 그림이면 inf, 40 dB 이상이면 눈으로 차이를 알기 어려움, 30 dB 아래면 흐려짐이 보이는 수준)
- PDF24는 기본값 'Deskew pages'로 쪽을 곧게 돌려 저장하므로 화소 단위 비교가 맞지 않음 → 'rotated'로 표시하고 PSNR 대신 그림 해상도만 봄
- 섞인 PDF 1쪽(원래 글자 쪽)은 글자가 그림으로 바뀌었는지 보는 용도
"""

import json
import subprocess
import sys
import tempfile
from pathlib import Path

import cv2
import numpy as np

SRC, OUT, DEST = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
CHECK = [("scanned-8-pages.pdf", 1), ("scanned-8-pages.pdf", 7), ("mixed-3-pages.pdf", 1)]


def render(pdf: Path, page: int, tmp: Path) -> np.ndarray:
    base = tmp / f"{pdf.stem}-{page}"
    subprocess.run(["pdftoppm", "-r", "300", "-gray", "-f", str(page), "-l", str(page), "-singlefile", "-png",
                    str(pdf), str(base)], check=True)
    return cv2.imread(str(base) + ".png", cv2.IMREAD_GRAYSCALE)


def psnr(a: np.ndarray, b: np.ndarray) -> float:
    if a.shape != b.shape:
        b = cv2.resize(b, (a.shape[1], a.shape[0]), interpolation=cv2.INTER_AREA)
    mse = np.mean((a.astype(np.float64) - b.astype(np.float64)) ** 2)
    return float("inf") if mse == 0 else round(10 * np.log10(255 ** 2 / mse), 2)


res = {}
with tempfile.TemporaryDirectory() as t:
    tmp = Path(t)
    for src, page in CHECK:
        ref = render(SRC / src, page, tmp)
        for pdf in sorted(OUT.glob(f"*__{src}")):
            tool = pdf.stem.split("__")[0]
            if tool == "original":
                continue
            img = render(pdf, page, tmp)
            key = f"{tool} {src} p{page}"
            res[key] = "rotated" if tool == "pdf24" and src.startswith("scanned") else psnr(ref, img)
            print(key, res[key])
DEST.write_text(json.dumps(res, indent=1))
