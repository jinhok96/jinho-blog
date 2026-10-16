#!/usr/bin/env python3
"""GIF 프레임 지연값(ms) 분포와 총 재생 시간 출력 (Pillow로 블록 구조를 따라 읽음)."""
import sys, collections
from PIL import Image
for p in sys.argv[1:]:
    im = Image.open(p)
    d = []
    for i in range(im.n_frames):
        im.seek(i)
        d.append(im.info.get("duration", 0))
    print(p.split("/")[-2], p.split("/")[-1], len(d), sum(d), dict(collections.Counter(d)))
