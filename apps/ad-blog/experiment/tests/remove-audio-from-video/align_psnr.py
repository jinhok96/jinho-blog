#!/usr/bin/env python3
"""출력 프레임마다 원본에서 가장 비슷한 프레임을 찾아 짝을 맞춘 뒤 밝기(Y) PSNR을 재는 측정 보조 스크립트.

/tmp/charts/bin/python -I align_psnr.py OUT REF [OUT_VF]

- REF는 회전 표시를 무시하고(-noautorotate) 디코딩한 '바르게 선 정답' (sideways.mp4의 저장 프레임 1920x800)
- OUT_VF가 없으면 OUT을 재생 프로그램처럼 회전 표시를 적용해 디코딩(ffmpeg autorotate)
  OUT_VF가 있으면 회전 표시를 무시하고 그 필터를 적용 (예: VLC 결과의 저장 프레임을 'transpose=1'로 세워 실제 화질만 봄)
- 출력 프레임 수가 원본과 다르거나 시간 표시가 고르지 않아 n번끼리 비교하면 값이 크게 떨어지는 경우(VLC 718프레임)용
  1) 96x40 회색 축소판으로 출력 프레임마다 원본에서 가장 비슷한 프레임(직전 대응 위치 -2 ~ +4)을 찾고
  2) 그 짝끼리 1920x800 밝기 평면으로 PSNR 계산 → 평균·중앙값·최저, 짝이 안 된 원본 프레임·두 번 쓰인 원본 프레임 수
"""
import json
import subprocess
import sys

import numpy as np

W, H = 1920, 800
TW, TH = 96, 40


def decode(path, vf, noauto, size, gray=True):
    args = ['ffmpeg', '-v', 'error']
    if noauto:
        args.append('-noautorotate')
    chain = (vf + ',' if vf else '') + f'scale={size[0]}:{size[1]}:flags={"area" if size[0] < 200 else "bicubic"},format=gray'
    args += ['-i', path, '-map', '0:v:0', '-vf', chain, '-f', 'rawvideo', '-']
    return subprocess.Popen(args, stdout=subprocess.PIPE)


def read_all(proc, w, h):
    raw = proc.stdout.read()
    proc.wait()
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w)


def main():
    out, ref = sys.argv[1], sys.argv[2]
    vf = sys.argv[3] if len(sys.argv) > 3 else ''
    noauto_out = bool(vf)
    rt = read_all(decode(ref, '', True, (TW, TH)), TW, TH).astype(np.int16)
    ot = read_all(decode(out, vf, noauto_out, (TW, TH)), TW, TH).astype(np.int16)
    pairs, pos = [], 0
    for i, t in enumerate(ot):
        lo, hi = max(0, pos - 2), min(len(rt), pos + 5)
        d = [np.abs(rt[j] - t).mean() for j in range(lo, hi)]
        j = lo + int(np.argmin(d))
        pairs.append(j)
        pos = j + 1
    ry = read_all(decode(ref, '', True, (W, H)), W, H)
    proc = decode(out, vf, noauto_out, (W, H))
    ps = []
    for i, j in enumerate(pairs):
        buf = proc.stdout.read(W * H)
        if len(buf) < W * H:
            break
        o = np.frombuffer(buf, np.uint8).reshape(H, W).astype(np.float64)
        mse = ((o - ry[j].astype(np.float64)) ** 2).mean()
        ps.append(99.0 if mse == 0 else 10 * np.log10(255 ** 2 / mse))
    proc.wait()
    used = set(pairs)
    res = {'out': out, 'vf': vf or 'autorotate', 'frames_out': len(ot), 'frames_ref': len(rt),
           'psnr_y_mean': round(float(np.mean(ps)), 2), 'psnr_y_median': round(float(np.median(ps)), 2),
           'psnr_y_min': round(float(np.min(ps)), 2),
           'ref_unmatched': [j for j in range(len(rt)) if j not in used][:20],
           'ref_unmatched_count': len(rt) - len(used),
           'ref_used_twice': len(pairs) - len(used)}
    print(json.dumps(res))


if __name__ == '__main__':
    main()
