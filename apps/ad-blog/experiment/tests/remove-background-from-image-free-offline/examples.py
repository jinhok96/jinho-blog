"""퍼블릭 도메인·CC0 예시 이미지(scikit-image: astronaut·chelsea·coffee)로 모델별 결과 비교 그림 생성."""
import sys, os
import numpy as np
import onnxruntime as ort
from PIL import Image, ImageDraw, ImageFont
from rembg import new_session, remove
import skimage.data as d

MODELS = sys.argv[1].split(',')
OUT = sys.argv[2]
os.makedirs(f'{OUT}/cut', exist_ok=True)
SRC = {'astronaut': d.astronaut(), 'chelsea': d.chelsea(), 'coffee': d.coffee()}
for k, a in SRC.items(): Image.fromarray(a).save(f'{OUT}/cut/{k}.png')
so = ort.SessionOptions(); so.enable_cpu_mem_arena = False; so.enable_mem_pattern = False
for m in MODELS:
    s = new_session(m, sess_opts=so)
    for k, a in SRC.items():
        p = f'{OUT}/cut/{k}.{m}.png'
        if not os.path.exists(p): remove(Image.fromarray(a), session=s).save(p)
    del s
    print(m, 'done', flush=True)
