#!/usr/bin/env python3
"""출력 프레임 MD5를 원본 프레임 MD5 목록과 맞춰 '원본 몇 번 프레임이 빠졌는지'를 찾는 측정 보조 스크립트.

python3 -I frame_map.py OUT REF  → 출력 프레임 중 원본에 있는 프레임 수, 빠진 원본 프레임 번호(0부터)
(원본 프레임은 MD5가 서로 모두 달라야 함 — 같은 MD5가 있으면 알림)
"""
import json
import subprocess
import sys


def md5s(path):
    out = subprocess.run(['ffmpeg', '-v', 'error', '-noautorotate', '-i', path, '-map', '0:v:0',
                          '-pix_fmt', 'yuv420p', '-f', 'framemd5', '-'], capture_output=True, text=True, check=True).stdout
    return [l.split(',')[-1].strip() for l in out.splitlines() if l.strip() and not l.startswith('#')]


out, ref = md5s(sys.argv[1]), md5s(sys.argv[2])
idx = {m: i for i, m in enumerate(ref)}
found = [idx.get(m) for m in out]
missing = sorted(set(range(len(ref))) - {f for f in found if f is not None})
print(json.dumps({'out': sys.argv[1].split('/')[-1], 'out_frames': len(out), 'ref_frames': len(ref),
                  'ref_unique': len(idx) == len(ref), 'out_in_ref': sum(f is not None for f in found),
                  'missing_ref_frames': missing, 'order_ok': all(a < b for a, b in zip([f for f in found if f is not None], [f for f in found if f is not None][1:]))}))
