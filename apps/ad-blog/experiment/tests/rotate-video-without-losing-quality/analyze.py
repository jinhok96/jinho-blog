#!/usr/bin/env python3
"""회전 도구의 결과 파일이 '바르게 서 있는지'와 '원본 화질 그대로인지'를 재는 측정 보조 스크립트.

python3 -I analyze.py LABEL OUT [REF] [--start N]

- REF(기본 /tmp/rv/clips/sideways.mp4)를 회전 표시 없이(-noautorotate) 디코딩한 1920x800 프레임이 '바르게 선 정답'
  (sideways.mp4는 가로 프레임에 회전 표시 -90도만 붙인 파일이라, 표시를 무시하면 원래 가로 장면이 나옴)
- OUT은 재생 프로그램처럼 회전 표시를 적용해(autorotate) 디코딩 → 표시 크기·프레임 MD5를 정답과 비교
  - 같은 프레임 비율: 프레임 MD5가 정답과 비트 단위로 같은 프레임 / 정답 프레임 수 (--start로 출력 첫 프레임이 정답 몇 번인지 지정)
  - 같지 않으면 ffmpeg psnr·ssim 필터 (표시 크기가 다르면 정답 크기로 맞춘 뒤)
- 소리: 코덱·비트레이트, 디코딩한 소리(PCM)가 원본과 같은지
- 회전 표시(display matrix) 값, 촬영 시각(creation_time)·위치(location) 태그
결과는 results.jsonl에 한 줄씩 덧붙임
"""
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def run(args, binary=False):
    r = subprocess.run(args, capture_output=True, check=True)
    return r.stdout if binary else r.stdout.decode()


def probe(path):
    return json.loads(run(['ffprobe', '-v', 'error', '-show_entries',
                           'format=format_name,duration,size,bit_rate:format_tags:'
                           'stream=index,codec_type,codec_name,profile,width,height,r_frame_rate,'
                           'bit_rate,nb_frames,pix_fmt,sample_rate,channels:stream_tags:stream_side_data',
                           '-of', 'json', path]))


def rotation(stream):
    for sd in stream.get('side_data_list', []) or []:
        if 'rotation' in sd:
            return int(sd['rotation'])
    tags = stream.get('tags', {}) or {}
    if 'rotate' in tags:
        return -int(tags['rotate'])
    return None


def frame_md5(path, noautorotate=False):
    args = ['ffmpeg', '-v', 'error']
    if noautorotate:
        args.append('-noautorotate')
    args += ['-i', path, '-map', '0:v:0', '-pix_fmt', 'yuv420p', '-f', 'framemd5', '-']
    return [l.split(',')[-1].strip() for l in run(args).splitlines() if l.strip() and not l.startswith('#')]


def audio_md5(path, rate):
    raw = run(['ffmpeg', '-v', 'error', '-i', path, '-map', '0:a:0', '-ar', str(rate), '-ac', '2',
               '-f', 's16le', '-'], binary=True)
    return hashlib.md5(raw).hexdigest(), len(raw)


def quality(out, ref, w, h, start, n, fps):
    # 출력 프레임 속도가 다르면(예: 24 → 30fps) 시간 기준으로 정답 속도에 맞춘 뒤 비교
    graph = (f'[1:v]trim=start_frame={start}:end_frame={start + n},setpts=PTS-STARTPTS,format=yuv420p[r];'
             f'[0:v]fps={fps},scale={w}:{h}:flags=bicubic,format=yuv420p,trim=end_frame={n},setpts=PTS-STARTPTS[d];'
             '[d]split[d1][d2];[r]split[r1][r2];[d1][r1]psnr[p];[d2][r2]ssim[s]')
    r = subprocess.run(['ffmpeg', '-v', 'info', '-i', out, '-noautorotate', '-i', ref, '-filter_complex', graph,
                        '-map', '[p]', '-f', 'null', '-', '-map', '[s]', '-f', 'null', '-'],
                       capture_output=True, text=True)
    p = re.search(r'PSNR y:([\d.inf]+) .*? average:([\d.inf]+)', r.stderr)
    s = re.search(r'SSIM Y:([\d.]+) .*? All:([\d.]+)', r.stderr)
    return {'psnr_y': p and p.group(1), 'psnr_avg': p and p.group(2),
            'ssim_y': s and s.group(1), 'ssim_all': s and s.group(2)}


def main():
    label, out = sys.argv[1], sys.argv[2]
    ref = sys.argv[3] if len(sys.argv) > 3 and not sys.argv[3].startswith('--') else '/tmp/rv/clips/sideways.mp4'
    start = int(sys.argv[sys.argv.index('--start') + 1]) if '--start' in sys.argv else 0
    po, pr = probe(out), probe(ref)
    vo = next(s for s in po['streams'] if s['codec_type'] == 'video')
    vr = next(s for s in pr['streams'] if s['codec_type'] == 'video')
    ao = next((s for s in po['streams'] if s['codec_type'] == 'audio'), None)
    ar = next(s for s in pr['streams'] if s['codec_type'] == 'audio')
    rot = rotation(vo)
    w, h = vo['width'], vo['height']
    disp = (h, w) if rot is not None and abs(rot) % 180 == 90 else (w, h)
    ref_w, ref_h = vr['width'], vr['height']  # 표시를 무시한 정답 크기 1920x800
    md_ref = frame_md5(ref, noautorotate=True)
    md_out = frame_md5(out)
    pairs = list(zip(md_out, md_ref[start:]))
    same = sum(a == b for a, b in pairs)
    res = {
        'label': label, 'file': Path(out).name, 'size': int(po['format']['size']),
        'format': po['format']['format_name'], 'brand': po['format'].get('tags', {}).get('major_brand'),
        'video': f"{vo['codec_name']} {vo.get('profile', '')}".strip(), 'stored': f'{w}x{h}',
        'rotation': rot, 'displayed': f'{disp[0]}x{disp[1]}', 'upright_shape': disp[0] > disp[1],
        'fps': vo['r_frame_rate'], 'frames': len(md_out), 'ref_frames': len(md_ref),
        'video_kbps': round(int(vo['bit_rate']) / 1000) if vo.get('bit_rate') else None,
        'same_frames': same, 'same_pct': round(100 * same / len(md_ref), 2),
        'audio': ao and f"{ao['codec_name']} {ao.get('sample_rate')}Hz {round(int(ao.get('bit_rate') or 0) / 1000)}k",
        'tags': {k: v for k, v in (po['format'].get('tags') or {}).items() if k in ('creation_time', 'location')},
    }
    if ao:
        rate = int(ar['sample_rate'])
        m_o, l_o = audio_md5(out, rate)
        m_r, l_r = audio_md5(ref, rate)
        res['audio_same'] = m_o == m_r
        res['audio_len_ratio'] = round(l_o / l_r, 4)
    if same < len(md_ref):
        res['quality'] = quality(out, ref, ref_w, ref_h, start, len(md_ref) - start, vr['r_frame_rate'])
    print(json.dumps(res, ensure_ascii=False))
    with open(HERE / 'results.jsonl', 'a') as f:
        f.write(json.dumps(res, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()
