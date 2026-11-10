#!/usr/bin/env python3
"""MOV → MP4 변환 결과가 원본을 얼마나 그대로 담았는지 재는 측정 보조 스크립트.

python3 -I analyze_convert.py OUT SRC [--json]

- 그릇(컨테이너): ffprobe format_name·major_brand (MP4인지 .mov인지)
- 영상·소리: 코덱, 해상도, 프레임 수·속도, 비트레이트, 파일 크기
- 프레임 MD5(framemd5): 재생 방향을 적용해 디코딩한 출력 프레임이 원본 프레임과 비트 단위로 같은 비율
- 같지 않으면 작은 회색 축소판(96x40)으로 첫 프레임을 원본에 맞춘 뒤 ffmpeg psnr·ssim 필터로 화질(PSNR dB, SSIM)
- 회전 표시(display matrix)와 재생 방향(가로·세로)이 원본과 같은지
- 촬영 시각(creation_time, com.apple.quicktime.creationdate)·위치(ISO6709/location) 태그가 남았는지
"""
import hashlib
import json
import subprocess
import sys

TW, TH = 96, 40
TSIZE = TW * TH


def run(args, binary=False):
    r = subprocess.run(args, capture_output=True, check=True)
    return r.stdout if binary else r.stdout.decode()


def probe(path):
    out = run(['ffprobe', '-v', 'error', '-show_entries',
               'format=format_name,duration,size,bit_rate:format_tags:'
               'stream=index,codec_type,codec_name,codec_tag_string,profile,width,height,r_frame_rate,avg_frame_rate,'
               'bit_rate,nb_frames,pix_fmt,sample_rate,channels:stream_tags:stream_side_data',
               '-of', 'json', path])
    return json.loads(out)


def rotation(stream):
    for sd in stream.get('side_data_list', []) or []:
        if 'rotation' in sd:
            return int(sd['rotation'])
    tags = stream.get('tags', {}) or {}
    if 'rotate' in tags:
        return -int(tags['rotate'])
    return 0


def frame_md5(path):
    md5s = []
    out = run(['ffmpeg', '-v', 'error', '-i', path, '-map', '0:v:0', '-pix_fmt', 'yuv420p', '-f', 'framemd5', '-'])
    for line in out.splitlines():
        if line.startswith('#') or not line.strip():
            continue
        md5s.append(line.split(',')[-1].strip())
    return md5s


def thumbs(path, n=None):
    args = ['ffmpeg', '-v', 'error', '-i', path, '-map', '0:v:0']
    if n:
        args += ['-frames:v', str(n)]
    args += ['-vf', f'scale={TW}:{TH}:flags=area,format=gray', '-f', 'rawvideo', '-']
    raw = run(args, binary=True)
    return [raw[i:i + TSIZE] for i in range(0, len(raw) - TSIZE + 1, TSIZE)]


def sad(a, b):
    return sum(abs(x - y) for x, y in zip(a, b)) / TSIZE


def displayed_size(stream):
    w, h = stream['width'], stream['height']
    return (h, w) if abs(rotation(stream)) % 180 == 90 else (w, h)


def quality(out, src, src_start, n, fps, w, h):
    graph = (f'[1:v]trim=start_frame={src_start}:end_frame={src_start + n},setpts=PTS-STARTPTS[r];'
             f'[0:v]fps={fps},scale={w}:{h}:flags=bicubic,format=yuv420p,trim=end_frame={n},setpts=PTS-STARTPTS[d];'
             '[d]split[d1][d2];[r]split[r1][r2];[d1][r1]psnr[p];[d2][r2]ssim[s]')
    r = subprocess.run(['ffmpeg', '-v', 'info', '-i', out, '-i', src, '-filter_complex', graph,
                        '-map', '[p]', '-f', 'null', '-', '-map', '[s]', '-f', 'null', '-'],
                       capture_output=True, text=True)
    psnr = ssim = None
    for line in r.stderr.splitlines():
        if 'PSNR' in line and 'average:' in line:
            psnr = line.split('average:')[1].split()[0]
        if 'SSIM' in line and 'All:' in line:
            ssim = line.split('All:')[1].split()[0]
    return psnr, ssim


def tag_summary(fmt_tags, stream_tags):
    tags = {**(stream_tags or {}), **(fmt_tags or {})}
    low = {k.lower(): v for k, v in tags.items()}
    date = low.get('com.apple.quicktime.creationdate') or None
    ctime = low.get('creation_time') or None
    loc = next((v for k, v in low.items() if 'location' in k or 'iso6709' in k or k.endswith('xyz')), None)
    return {'creation_time': ctime, 'apple_creationdate': date, 'location': loc}


def main():
    out, src = sys.argv[1], sys.argv[2]
    p_src, p_out = probe(src), probe(out)
    vs_src = next(s for s in p_src['streams'] if s['codec_type'] == 'video')
    vs = next(s for s in p_out['streams'] if s['codec_type'] == 'video')
    aus = next((s for s in p_out['streams'] if s['codec_type'] == 'audio'), None)
    fmt = p_out['format']
    res = {
        'file': out,
        'size_bytes': int(fmt.get('size', 0)),
        'container': fmt.get('format_name'),
        'major_brand': (fmt.get('tags') or {}).get('major_brand', '').strip(),
        'duration_s': round(float(fmt.get('duration', 0)), 3),
        'video': {k: vs.get(k) for k in ('codec_name', 'codec_tag_string', 'profile', 'width', 'height', 'r_frame_rate',
                                         'avg_frame_rate', 'bit_rate', 'nb_frames', 'pix_fmt')},
        'audio': ({k: aus.get(k) for k in ('codec_name', 'bit_rate', 'sample_rate', 'channels')} if aus else None),
        'rotation_src': rotation(vs_src),
        'rotation_out': rotation(vs),
        'displayed_src': displayed_size(vs_src),
        'displayed_out': displayed_size(vs),
        'tags_src': tag_summary((p_src['format'].get('tags')), vs_src.get('tags')),
        'tags_out': tag_summary(fmt.get('tags'), vs.get('tags')),
    }
    res['orientation_kept'] = (res['displayed_out'][0] > res['displayed_out'][1]) == (res['displayed_src'][0] > res['displayed_src'][1])

    src_md5 = frame_md5(src)
    out_md5 = frame_md5(out)
    idx = {}
    for i, m in enumerate(src_md5):
        idx.setdefault(m, i)
    hits = [idx.get(m) for m in out_md5]
    res['frames_src'] = len(src_md5)
    res['frames_out'] = len(out_md5)
    res['identical_frames'] = sum(1 for h in hits if h is not None)
    res['identical_pct'] = round(100 * res['identical_frames'] / max(1, len(out_md5)), 2)
    if res['identical_pct'] == 100 and len(out_md5) == len(src_md5):
        res['psnr'], res['ssim'] = 'inf', '1.000000'
    elif res['orientation_kept']:
        src_t = thumbs(src, 72)
        out_t = thumbs(out, 1)
        best = min(range(len(src_t)), key=lambda i: sad(out_t[0], src_t[i]))
        res['first_frame_src_index'] = best
        n = min(len(out_md5), len(src_md5) - best)
        w, h = res['displayed_src']
        res['psnr'], res['ssim'] = quality(out, src, best, n, vs_src['r_frame_rate'], w, h)
    else:
        res['psnr'] = res['ssim'] = None
        res['note'] = 'orientation differs from source (played sideways)'
    if '--json' in sys.argv:
        print(json.dumps(res, ensure_ascii=False))
    else:
        for k, v in res.items():
            print(f'{k}: {v}')


if __name__ == '__main__':
    main()
