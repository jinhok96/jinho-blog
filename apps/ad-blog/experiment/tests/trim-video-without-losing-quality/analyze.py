#!/usr/bin/env python3
"""잘라 낸 영상이 원본 프레임을 그대로 담았는지(무손실) 재는 측정 보조 스크립트.

python3 -I analyze.py OUT SRC START END [--json]

- 프레임 MD5(framemd5): 출력 프레임을 디코딩한 결과가 원본의 어느 프레임과 비트 단위로 같은지
- 표시 시작점: 편집 목록(edit list)을 따르는 디코딩(일반 플레이어 동작)의 첫 프레임이 원본 몇 초인지
- 저장 시작점: 편집 목록을 무시한 디코딩의 첫 프레임(파일 안에 실제로 들어 있는 첫 프레임)
- 비트 단위로 같지 않으면 작은 회색 축소판(96x40)으로 원본에서 가장 비슷한 프레임을 찾아 맞춘 뒤
  ffmpeg psnr·ssim 필터로 원본 대비 화질(PSNR dB, SSIM)을 계산
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
               'format=duration,size,bit_rate:stream=index,codec_type,codec_name,width,height,r_frame_rate,avg_frame_rate,bit_rate,nb_frames,profile,pix_fmt',
               '-of', 'json', path])
    return json.loads(out)


def frame_md5(path, ignore_editlist=False):
    args = ['ffmpeg', '-v', 'error']
    if ignore_editlist:
        args += ['-ignore_editlist', '1']
    args += ['-i', path, '-map', '0:v:0', '-pix_fmt', 'yuv420p', '-f', 'framemd5', '-']
    md5s = []
    for line in run(args).splitlines():
        if line.startswith('#') or not line.strip():
            continue
        parts = [p.strip() for p in line.split(',')]
        md5s.append(parts[-1])
    return md5s


def thumbs(path, ignore_editlist=False):
    args = ['ffmpeg', '-v', 'error']
    if ignore_editlist:
        args += ['-ignore_editlist', '1']
    args += ['-i', path, '-map', '0:v:0', '-vf', f'scale={TW}:{TH}:flags=area,format=gray', '-f', 'rawvideo', '-']
    raw = run(args, binary=True)
    return [raw[i:i + TSIZE] for i in range(0, len(raw) - TSIZE + 1, TSIZE)]


def sad(a, b):
    return sum(abs(x - y) for x, y in zip(a, b)) / TSIZE


def best_match(frame, src_thumbs, lo, hi):
    best = None
    for i in range(max(0, lo), min(len(src_thumbs), hi)):
        d = sad(frame, src_thumbs[i])
        if best is None or d < best[1]:
            best = (i, d)
    return best


def quality(out, src, src_start_frame, n_frames, fps, src_w, src_h):
    graph = (f'[1:v]trim=start_frame={src_start_frame}:end_frame={src_start_frame + n_frames},setpts=PTS-STARTPTS[r];'
             f'[0:v]fps={fps},scale={src_w}:{src_h}:flags=bicubic,format=yuv420p,trim=end_frame={n_frames},setpts=PTS-STARTPTS[d];'
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


def main():
    out, src, start, end = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
    p_src, p_out = probe(src), probe(out)
    vs = next(s for s in p_src['streams'] if s['codec_type'] == 'video')
    num, den = map(int, vs['r_frame_rate'].split('/'))
    fps = num / den
    src_md5 = frame_md5(src)
    idx = {}
    for i, m in enumerate(src_md5):
        idx.setdefault(m, i)

    res = {'file': out, 'requested': [start, end], 'probe': p_out}
    shown = frame_md5(out)
    stored = frame_md5(out, ignore_editlist=True)
    res['frames_shown'] = len(shown)
    res['frames_stored'] = len(stored)
    hits = [idx.get(m) for m in shown]
    res['identical_frames'] = sum(1 for h in hits if h is not None)
    res['identical_pct'] = round(100 * res['identical_frames'] / max(1, len(shown)), 2)
    stored_hits = [idx.get(m) for m in stored]
    res['stored_identical_pct'] = round(100 * sum(1 for h in stored_hits if h is not None) / max(1, len(stored)), 2)

    req_frames = round((end - start) * fps)
    res['requested_frames'] = req_frames
    if hits and hits[0] is not None:
        res['match'] = 'exact'
        res['shown_start_s'] = round(hits[0] / fps, 3)
        last = next((h for h in reversed(hits) if h is not None), None)
        res['shown_end_s'] = round((last + 1) / fps, 3) if last is not None else None
        sh = next((h for h in stored_hits if h is not None), None)
        res['stored_start_s'] = round(sh / fps, 3) if sh is not None else None
        res['psnr'] = 'inf' if res['identical_pct'] == 100 else None
        res['ssim'] = '1.000000' if res['identical_pct'] == 100 else None
    else:
        res['match'] = 'approx'
        src_t = thumbs(src)
        out_t = thumbs(out)
        lo, hi = int((start - 6) * fps), int((start + 6) * fps)
        first = best_match(out_t[0], src_t, lo, hi)
        res['shown_start_s'] = round(first[0] / fps, 3)
        res['first_frame_sad'] = round(first[1], 2)
        last = best_match(out_t[-1], src_t, int((end - 6) * fps), int((end + 6) * fps))
        res['shown_end_s'] = round((last[0] + 1) / fps, 3)
        res['last_frame_sad'] = round(last[1], 2)
        st = thumbs(out, ignore_editlist=True)
        sf = best_match(st[0], src_t, lo, hi)
        res['stored_start_s'] = round(sf[0] / fps, 3)
        n = min(len(shown), len(src_md5) - first[0])
        res['psnr'], res['ssim'] = quality(out, src, first[0], n, vs['r_frame_rate'], vs['width'], vs['height'])
    res['start_offset_s'] = round(res['shown_start_s'] - start, 3)
    res['end_offset_s'] = round(res['shown_end_s'] - end, 3) if res.get('shown_end_s') is not None else None
    if '--json' in sys.argv:
        print(json.dumps(res, ensure_ascii=False))
    else:
        for k, v in res.items():
            if k != 'probe':
                print(f'{k}: {v}')
        for s in p_out['streams']:
            print('stream:', {k: s.get(k) for k in ('codec_name', 'width', 'height', 'r_frame_rate', 'bit_rate', 'nb_frames')})
        print('format:', p_out['format'])


if __name__ == '__main__':
    main()
