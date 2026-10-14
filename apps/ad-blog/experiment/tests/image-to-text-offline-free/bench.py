"""OCR 엔진 1개로 이미지 폴더 전체를 읽어 결과를 JSONL로 저장.

사용: python bench.py <엔진> <이미지 폴더> <출력.jsonl>
엔진: tesseract | tesseract-psm6 | rapidocr | rapidocr-medium | easyocr | doctr | doctr-fast
- 모델 로드 시간(load_s)은 첫 줄, 이미지별 처리 시간(sec)은 로드 이후만 측정
- 최대 메모리는 run_all.sh에서 /usr/bin/time -v로 측정
설치
  venv (tesseract, rapidocr): apt install tesseract-ocr / pip install rapidocr onnxruntime pytesseract
  venv2 (easyocr, doctr): pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
                          pip install easyocr "python-doctr[torch]"
"""

import json
import subprocess
import sys
import time
from pathlib import Path

engine, img_dir, out_path = sys.argv[1], Path(sys.argv[2]), Path(sys.argv[3])
truth = json.loads((img_dir / "truth.json").read_text())

t0 = time.perf_counter()
if engine.startswith("tesseract"):
    # 기본 설정: LSTM 엔진(--oem 1), 자동 페이지 분할(--psm 3). psm6 = 한 덩어리 텍스트로 가정
    psm = "6" if engine == "tesseract-psm6" else "3"

    def run(p):
        r = subprocess.run(["tesseract", str(p), "-", "--oem", "1", "--psm", psm, "-l", "eng"],
                           capture_output=True, text=True, check=True)
        return r.stdout
elif engine.startswith("rapidocr"):
    from rapidocr import RapidOCR
    from rapidocr.utils.typings import ModelType
    params = {"Global.log_level": "error"}
    if engine == "rapidocr-medium":
        params.update({"Det.model_type": ModelType.MEDIUM, "Rec.model_type": ModelType.MEDIUM})
    ocr = RapidOCR(params=params)

    def run(p):
        r = ocr(str(p))
        return "\n".join(r.txts or [])
elif engine == "easyocr":
    import easyocr
    reader = easyocr.Reader(["en"], gpu=False, verbose=False)

    def run(p):
        return "\n".join(reader.readtext(str(p), detail=0))
elif engine.startswith("doctr"):
    from doctr.io import DocumentFile
    from doctr.models import ocr_predictor
    det = "fast_base" if engine == "doctr" else "db_mobilenet_v3_large"
    reco = "crnn_vgg16_bn" if engine == "doctr" else "crnn_mobilenet_v3_small"
    model = ocr_predictor(det_arch=det, reco_arch=reco, pretrained=True)

    def run(p):
        return model(DocumentFile.from_images([str(p)])).render()
else:
    raise SystemExit(f"unknown engine {engine}")

# 첫 실행 지연(그래프 컴파일 등)을 로드 시간에 포함
run(img_dir / truth[0]["file"])
load_s = time.perf_counter() - t0

with out_path.open("w") as f:
    f.write(json.dumps({"engine": engine, "load_s": round(load_s, 2)}) + "\n")
    for item in truth:
        p = img_dir / item["file"]
        t = time.perf_counter()
        text = run(p)
        sec = time.perf_counter() - t
        f.write(json.dumps({"file": item["file"], "cond": item["cond"], "sec": round(sec, 3), "text": text}) + "\n")
        print(engine, item["file"], f"{sec:.2f}s", flush=True)
