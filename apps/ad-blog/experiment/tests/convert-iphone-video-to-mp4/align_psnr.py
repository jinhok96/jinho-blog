#!/usr/bin/env python3
"""프레임이 빠지거나 더해진 변환 결과를 원본 프레임에 하나씩 맞춘 뒤 밝기(Y) PSNR을 재는 측정 보조 스크립트.

/tmp/mvenv/bin/python -I align_psnr.py OUT SRC [--json]

analyze_convert.py의 PSNR은 출력 n번 프레임을 원본 n번과 비교하므로, 중간에 프레임이 하나만 빠져도
그 뒤가 모두 한 칸씩 밀려 실제보다 크게 낮게 나옴. 여기서는
1) 두 영상의 작은 회색 축소판(96x40)으로 출력 프레임마다 원본에서 가장 비슷한 프레임(직전 대응 위치 ±4)을 찾고
   (정지 장면에서는 축소판이 거의 같아 빠짐·겹침 번호가 한두 개 틀릴 수 있음 → 프레임 수·속도는 ffprobe 값을 우선)
2) 그 짝끼리 원래 크기 밝기 평면으로 PSNR을 계산해 평균·최저·빠진/겹친 원본 프레임 번호를 출력
"""
import json
import subprocess
import sys

import numpy as np

TW, TH = 96, 40


def dims(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
                          '-show_entries', 'stream_side_data=rotation', '-of', 'json', path],
                         capture_output=True, text=True, check=True).stdout
    s = json.loads(out)['streams'][0]
    w, h = s['width'], s['height']
    rot = 0
    for sd in s.get('side_data_list', []) or []:
        rot = int(sd.get('rotation', 0))
    return (h, w) if abs(rot) % 180 == 90 else (w, h)


def thumbs(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-map', '0:v:0', '-vf',
                          f'scale={TW}:{TH}:flags=area,format=gray', '-f', 'rawvideo', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, TH, TW).astype(np.int16)


def yplanes(path, w, h):
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', path, '-map', '0:v:0', '-vf',
                          f'scale={w}:{h}:flags=bicubic,format=gray', '-f', 'rawvideo', '-'], stdout=subprocess.PIPE)
    size = w * h
    while True:
        buf = p.stdout.read(size)
        if len(buf) < size:
            break
        yield np.frombuffer(buf, np.uint8).reshape(h, w)


def main():
    out, src = sys.argv[1], sys.argv[2]
    w, h = dims(src)
    ts, to = thumbs(src), thumbs(out)
    mapping = []
    prev = -1
    for i in range(len(to)):
        lo, hi = max(0, prev), min(len(ts), prev + 5)
        if i == 0:
            lo, hi = 0, min(len(ts), 48)
        cand = range(lo, hi)
        j = min(cand, key=lambda k: np.abs(to[i] - ts[k]).mean())
        mapping.append(j)
        prev = j
    used = set(mapping)
    skipped = [k for k in range(mapping[0], mapping[-1] + 1) if k not in used]
    repeated = [mapping[i] for i in range(1, len(mapping)) if mapping[i] == mapping[i - 1]]

    # 메모리를 아끼려고 두 영상을 동시에 흘려 읽고 원본은 최근 몇 프레임만 보관 (대응은 거의 단조 증가)
    src_iter = enumerate(yplanes(src, w, h))
    buf = {}
    nxt = 0
    psnrs = []
    for i, y in enumerate(yplanes(out, w, h)):
        if i >= len(mapping):
            break
        j = mapping[i]
        while nxt <= j:
            k, ys = next(src_iter)
            buf[k] = ys
            nxt = k + 1
        for k in [k for k in buf if k < j - 6]:
            del buf[k]
        ref = buf[j].astype(np.float32)
        mse = float(((y.astype(np.float32) - ref) ** 2).mean())
        psnrs.append(99.0 if mse == 0 else 10 * np.log10(255 ** 2 / mse))
    arr = np.array(psnrs)
    res = {
        'file': out, 'frames_out': len(to), 'frames_src': len(ts),
        'first_src_frame': mapping[0], 'last_src_frame': mapping[-1],
        'skipped_src_frames': skipped, 'repeated_src_frames': repeated,
        'y_psnr_mean': round(float(arr[arr < 99].mean()) if (arr < 99).any() else 99.0, 2),
        'y_psnr_min': round(float(arr.min()), 2),
        'identical_y_frames': int((arr >= 99).sum()),
    }
    print(json.dumps(res, ensure_ascii=False) if '--json' in sys.argv else '\n'.join(f'{k}: {v}' for k, v in res.items()))


if __name__ == '__main__':
    main()
