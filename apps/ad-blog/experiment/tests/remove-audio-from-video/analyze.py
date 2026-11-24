#!/usr/bin/env python3
"""소리를 뺀 결과 파일이 '그림은 원본 그대로이고 소리만 빠졌는지' 재는 측정 보조 스크립트.

python3 -I analyze.py LABEL OUT REF

- 그림: OUT과 REF의 영상을 회전 표시를 적용하지 않고(-noautorotate) 저장된 그대로 디코딩해
  프레임 MD5를 차례로 비교 → 원본과 비트 단위로 같은 프레임 수. 같지 않으면 ffmpeg psnr·ssim
  (크기·프레임 속도가 다르면 원본 크기·속도로 맞춘 뒤)
- 소리: 소리 트랙 수와 코덱. 트랙이 남아 있으면 volumedetect로 최대·평균 음량(dB)을 재서
  '트랙이 아예 없음' / '무음 트랙이 남음' / '소리가 그대로 남음'을 가름
- 회전 표시(display matrix 원값)·보이는 크기, 촬영 시각·위치 태그(MP4 ©xyz, QuickTime Apple 태그)
- 파일 크기·형식·길이·영상 비트레이트
결과는 results.jsonl에 한 줄씩 덧붙임
"""
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
TAG_KEYS = ('creation_time', 'location', 'com.apple.quicktime.creationdate',
            'com.apple.quicktime.location.ISO6709', 'com.apple.quicktime.make', 'encoder')


def run(args):
    return subprocess.run(args, capture_output=True, check=True, text=True).stdout


def probe(path):
    return json.loads(run(['ffprobe', '-v', 'error', '-show_entries',
                           'format=format_name,duration,size,bit_rate:format_tags:'
                           'stream=index,codec_type,codec_name,codec_tag_string,profile,width,height,'
                           'r_frame_rate,avg_frame_rate,bit_rate,nb_frames,sample_rate,channels,duration:'
                           'stream_tags:stream_side_data', '-of', 'json', path]))


def matrix(stream):
    for sd in stream.get('side_data_list', []) or []:
        if sd.get('side_data_type') == 'Display Matrix':
            return {'rotation': sd.get('rotation'), 'matrix': ' '.join(sd.get('displaymatrix', '').split())}
    return None


def frame_md5(path):
    out = run(['ffmpeg', '-v', 'error', '-noautorotate', '-i', path, '-map', '0:v:0',
               '-pix_fmt', 'yuv420p', '-f', 'framemd5', '-'])
    return [l.split(',')[-1].strip() for l in out.splitlines() if l.strip() and not l.startswith('#')]


def loudness(path, idx):
    r = subprocess.run(['ffmpeg', '-v', 'info', '-i', path, '-map', f'0:{idx}', '-af', 'volumedetect',
                        '-f', 'null', '-'], capture_output=True, text=True)
    mx = re.search(r'max_volume: (-?[\d.inf]+) dB', r.stderr)
    mean = re.search(r'mean_volume: (-?[\d.inf]+) dB', r.stderr)
    return {'max_db': mx and mx.group(1), 'mean_db': mean and mean.group(1)}


def quality(out, ref, w, h, n, fps):
    graph = (f'[1:v]trim=end_frame={n},setpts=PTS-STARTPTS,format=yuv420p[r];'
             f'[0:v]fps={fps},scale={w}:{h}:flags=bicubic,format=yuv420p,trim=end_frame={n},setpts=PTS-STARTPTS[d];'
             '[d]split[d1][d2];[r]split[r1][r2];[d1][r1]psnr[p];[d2][r2]ssim[s]')
    r = subprocess.run(['ffmpeg', '-v', 'info', '-noautorotate', '-i', out, '-noautorotate', '-i', ref,
                        '-filter_complex', graph, '-map', '[p]', '-f', 'null', '-', '-map', '[s]', '-f', 'null', '-'],
                       capture_output=True, text=True)
    p = re.search(r'PSNR y:([\d.inf]+) .*? average:([\d.inf]+)', r.stderr)
    s = re.search(r'SSIM Y:([\d.]+) .*? All:([\d.]+)', r.stderr)
    return {'psnr_y': p and p.group(1), 'psnr_avg': p and p.group(2),
            'ssim_y': s and s.group(1), 'ssim_all': s and s.group(2)}


def main():
    label, out, ref = sys.argv[1], sys.argv[2], sys.argv[3]
    po, pr = probe(out), probe(ref)
    vo = next(s for s in po['streams'] if s['codec_type'] == 'video')
    vr = next(s for s in pr['streams'] if s['codec_type'] == 'video')
    auds = [s for s in po['streams'] if s['codec_type'] == 'audio']
    others = [s['codec_type'] for s in po['streams'] if s['codec_type'] not in ('video', 'audio')]
    mo, mr = matrix(vo), matrix(vr)
    w, h = vo['width'], vo['height']
    rot = mo and mo['rotation']
    disp = (h, w) if rot is not None and abs(int(rot)) % 180 == 90 else (w, h)
    md_ref, md_out = frame_md5(ref), frame_md5(out)
    same = sum(a == b for a, b in zip(md_out, md_ref))
    tags = {k: v for k, v in (po['format'].get('tags') or {}).items() if k in TAG_KEYS}
    res = {
        'label': label, 'file': Path(out).name, 'size': int(po['format']['size']),
        'ref_size': int(pr['format']['size']),
        'size_change_pct': round(100 * (int(po['format']['size']) - int(pr['format']['size'])) / int(pr['format']['size']), 2),
        'format': po['format']['format_name'], 'brand': (po['format'].get('tags') or {}).get('major_brand'),
        'duration': round(float(po['format']['duration']), 3),
        'video': f"{vo['codec_name']} {vo.get('profile', '')}".strip(), 'tag': vo.get('codec_tag_string'),
        'stored': f'{w}x{h}', 'displayed': f'{disp[0]}x{disp[1]}', 'matrix': mo, 'ref_matrix': mr,
        'fps': vo['r_frame_rate'], 'avg_fps': vo.get('avg_frame_rate'),
        'frames': len(md_out), 'ref_frames': len(md_ref),
        'video_kbps': round(int(vo['bit_rate']) / 1000) if vo.get('bit_rate') else None,
        'same_frames': same, 'same_pct': round(100 * same / len(md_ref), 2),
        'audio_tracks': len(auds), 'other_streams': others,
        'audio': [{'codec': a['codec_name'], 'rate': a.get('sample_rate'), 'ch': a.get('channels'),
                   'kbps': round(int(a.get('bit_rate') or 0) / 1000), **loudness(out, a['index'])} for a in auds],
        'tags': tags,
    }
    if same < len(md_ref) or len(md_out) != len(md_ref):
        res['quality'] = quality(out, ref, vr['width'], vr['height'], len(md_ref), vr['r_frame_rate'])
    print(json.dumps(res, ensure_ascii=False))
    with open(HERE / 'results.jsonl', 'a') as f:
        f.write(json.dumps(res, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()
