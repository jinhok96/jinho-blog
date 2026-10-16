#!/usr/bin/env python3
"""영상 압축 측정: 클립 3개 × 설정 10개 → 크기·VMAF·시간·최대 메모리.

사용: python3 -I run_tests.py [설정 이름 ...]  (결과는 /tmp/cv/out/results.json에 누적)
"""
import json
import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path('/tmp/cv')
FFDIR = next(ROOT.glob('tools/ffmpeg-n9*/bin'))
FF, FP = str(FFDIR / 'ffmpeg'), str(FFDIR / 'ffprobe')
HB = str(ROOT / 'hb.sh')
SRC = ROOT / 'src_clips'
OUT = ROOT / 'out'
OUT.mkdir(exist_ok=True)
RESULTS = OUT / 'results.json'
CLIPS = ['animation', 'live-action', 'screen']
AUDIO_KBPS = 128


def run_measured(cmd):
    t = time.perf_counter()
    pid = os.fork()
    if pid == 0:
        fd = os.open(os.devnull, os.O_WRONLY)
        os.dup2(fd, 1)
        os.dup2(fd, 2)
        os.execv(cmd[0], cmd)
    _, status, ru = os.wait4(pid, 0)
    el = time.perf_counter() - t
    if os.waitstatus_to_exitcode(status) != 0:
        raise RuntimeError(f'실패: {" ".join(cmd)}')
    return el, ru.ru_maxrss / 1024


def probe(path):
    j = json.loads(subprocess.check_output([FP, '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)]))
    v = next(s for s in j['streams'] if s['codec_type'] == 'video')
    a = next((s for s in j['streams'] if s['codec_type'] == 'audio'), None)
    return {
        'duration': float(j['format']['duration']),
        'codec': v['codec_name'],
        'width': v['width'],
        'height': v['height'],
        'fps': v['r_frame_rate'],
        'audio': a['codec_name'] if a else None,
        'audio_kbps': round(int(a['bit_rate']) / 1000) if a and a.get('bit_rate') else None,
    }


def has_audio(clip):
    return probe(SRC / f'{clip}.mp4')['audio'] is not None


def target_kbps(clip, target_bytes):
    """목표 파일 크기에 맞는 영상 비트레이트 (컨테이너 여유 1%)."""
    dur = probe(SRC / f'{clip}.mp4')['duration']
    total = target_bytes * 8 / dur / 1000 * 0.99
    return int(total - (AUDIO_KBPS if has_audio(clip) else 0))


def audio_args(clip):
    return ['-c:a', 'aac', '-b:a', f'{AUDIO_KBPS}k'] if has_audio(clip) else ['-an']


def hb(preset):
    def f(clip, out):
        return [[HB, '-i', str(SRC / f'{clip}.mp4'), '-o', str(out), '--preset', preset]]
    return f


def hb_target(target_bytes, extra):
    """HandBrake Fast 1080p30 + 평균 비트레이트(2-pass) + AAC 128kbps로 목표 크기 맞춤."""
    def f(clip, out):
        kb = target_kbps(clip, target_bytes)
        return [[HB, '-i', str(SRC / f'{clip}.mp4'), '-o', str(out), '--preset', 'Fast 1080p30',
                 '--vb', str(kb), '--multi-pass', '--turbo', '--ab', str(AUDIO_KBPS), *extra]]
    return f


def ff_crf(codec, extra):
    def f(clip, out):
        return [[FF, '-v', 'error', '-y', '-i', str(SRC / f'{clip}.mp4'), '-c:v', codec, *extra, *audio_args(clip),
                 '-movflags', '+faststart', str(out)]]
    return f


def ff_2pass(codec, target_bytes, height, extra):
    def f(clip, out):
        kb = target_kbps(clip, target_bytes)
        vf = ['-vf', f'scale={height * 16 // 9}:-2:flags=lanczos'] if height else []
        log = str(OUT / f'{out.stem}-pass')
        base = [FF, '-v', 'error', '-y', '-i', str(SRC / f'{clip}.mp4'), *vf, '-c:v', codec, '-b:v', f'{kb}k', *extra]
        if codec == 'libx265':
            p1 = base + ['-x265-params', f'pass=1:stats={log}.log:log-level=error', '-an', '-f', 'null', '/dev/null']
            p2 = base + ['-x265-params', f'pass=2:stats={log}.log:log-level=error', *audio_args(clip), '-movflags', '+faststart', str(out)]
        else:
            p1 = base + ['-pass', '1', '-passlogfile', log, '-an', '-f', 'null', '/dev/null']
            p2 = base + ['-pass', '2', '-passlogfile', log, *audio_args(clip), '-movflags', '+faststart', str(out)]
        return [p1, p2]
    return f


def ff_av1_vbr(target_bytes, height):
    def f(clip, out):
        kb = target_kbps(clip, target_bytes)
        vf = ['-vf', f'scale={height * 16 // 9}:-2:flags=lanczos'] if height else []
        return [[FF, '-v', 'error', '-y', '-i', str(SRC / f'{clip}.mp4'), *vf, '-c:v', 'libsvtav1', '-preset', '6',
                 '-b:v', f'{kb}k', '-svtav1-params', 'rc=1', '-pix_fmt', 'yuv420p', *audio_args(clip),
                 '-movflags', '+faststart', str(out)]]
    return f


MB19 = 19_000_000
MB24 = 24_000_000
SETTINGS = {
    'hb-fast-1080p30': ('HandBrake Fast 1080p30 (default)', hb('Fast 1080p30')),
    'hb-social-10mb-1min': ('HandBrake Social 10 MB 1 Minute 540p60', hb('Social 10 MB 1 Minute 540p60')),
    'hb-social-25mb-1min': ('HandBrake Social 25 MB 1 Minute 720p60', hb('Social 25 MB 1 Minute 720p60')),
    'hb-fast-1080p30-nodecomb': ('HandBrake Fast 1080p30, Interlace Detection and Deinterlace off',
                                 hb_nodecomb := (lambda clip, out: [[HB, '-i', str(SRC / f'{clip}.mp4'), '-o', str(out),
                                     '--preset', 'Fast 1080p30', '--no-comb-detect', '--no-deinterlace']])),
    'hb-19mb-1080p': ('HandBrake Fast 1080p30 + Avg Bitrate for 19 MB', hb_target(MB19, [])),
    'hb-19mb-1080p-slow': ('HandBrake 19 MB + Encoder Preset Slow', hb_target(MB19, ['--encoder-preset', 'slow'])),
    'hb-19mb-1080p-slow-high': ('HandBrake 19 MB + Encoder Preset Slow + Profile High',
                                hb_target(MB19, ['--encoder-preset', 'slow', '--encoder-profile', 'high'])),
    'ff-x264-crf23': ('FFmpeg x264 default (CRF 23)', ff_crf('libx264', [])),
    'ff-x264-19mb-1080p': ('FFmpeg x264 two-pass 19 MB 1080p', ff_2pass('libx264', MB19, None, ['-preset', 'slow'])),
    'ff-x264-19mb-720p': ('FFmpeg x264 two-pass 19 MB 720p', ff_2pass('libx264', MB19, 720, ['-preset', 'slow'])),
    'ff-x265-19mb-1080p': ('FFmpeg x265 two-pass 19 MB 1080p', ff_2pass('libx265', MB19, None, ['-preset', 'medium', '-tag:v', 'hvc1'])),
    'ff-av1-19mb-1080p': ('FFmpeg SVT-AV1 19 MB 1080p', ff_av1_vbr(MB19, None)),
    'ff-x264-24mb-1080p': ('FFmpeg x264 two-pass 24 MB 1080p', ff_2pass('libx264', MB24, None, ['-preset', 'slow'])),
    'ff-x264-9mb-720p': ('FFmpeg x264 two-pass 9.5 MB 720p', ff_2pass('libx264', 9_500_000, 720, ['-preset', 'slow'])),
}


def vmaf(clip, out):
    """출력을 원본 해상도로 키워 원본과 비교 (3프레임마다 1개 샘플)."""
    src = probe(SRC / f'{clip}.mp4')
    w, h = src['width'], src['height']
    fc = (f'[0:v]scale={w}:{h}:flags=bicubic,setpts=PTS-STARTPTS,format=yuv420p[d];'
          f'[1:v]setpts=PTS-STARTPTS,format=yuv420p[r];'
          f'[d][r]libvmaf=n_subsample=3:n_threads=4:log_fmt=json:log_path={OUT / (out.stem + "-vmaf.json")}')
    subprocess.run([FF, '-v', 'error', '-i', str(out), '-i', str(SRC / f'{clip}.mp4'), '-lavfi', fc, '-f', 'null', '-'],
                   check=True)
    j = json.loads((OUT / f'{out.stem}-vmaf.json').read_text())
    frames = [f['metrics']['vmaf'] for f in j['frames']]
    frames.sort()
    return {
        'vmaf_mean': round(j['pooled_metrics']['vmaf']['mean'], 2),
        'vmaf_p5': round(frames[int(len(frames) * 0.05)], 2),
        'vmaf_frames': len(frames),
    }


def main():
    names = sys.argv[1:] or list(SETTINGS)
    res = json.loads(RESULTS.read_text()) if RESULTS.exists() else {}
    for name in names:
        label, fn = SETTINGS[name]
        for clip in CLIPS:
            ext = '.mp4'
            out = OUT / f'{clip}--{name}{ext}'
            total, rss = 0.0, 0.0
            for cmd in fn(clip, out):
                el, r = run_measured(cmd)
                total += el
                rss = max(rss, r)
            p = probe(out)
            row = {'setting': name, 'label': label, 'clip': clip, 'bytes': out.stat().st_size,
                   'seconds': round(total, 1), 'max_rss_mb': round(rss), **p, **vmaf(clip, out)}
            res[f'{clip}--{name}'] = row
            RESULTS.write_text(json.dumps(res, indent=1))
            print(f"{clip:12} {name:22} {row['bytes']/1e6:7.2f}MB vmaf {row['vmaf_mean']:6.2f} p5 {row['vmaf_p5']:6.2f} "
                  f"{row['width']}x{row['height']} {row['codec']} {row['seconds']}s {row['max_rss_mb']}MB", flush=True)


if __name__ == '__main__':
    main()
