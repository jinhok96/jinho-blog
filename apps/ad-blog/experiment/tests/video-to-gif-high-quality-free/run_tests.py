#!/usr/bin/env python3
"""Video → GIF 변환 측정: 같은 PNG 프레임을 7개 설정으로 GIF로 만들고 크기·SSIM·PSNR·재생 시간·시간·메모리 측정."""
import json, os, re, subprocess, statistics, sys, time
from pathlib import Path

ROOT = Path("/tmp/v2g")
FFBIN = ROOT / "tools/ffmpeg-n9.0-latest-linux64-gpl-9.0/bin"
FF, FP = str(FFBIN / "ffmpeg"), str(FFBIN / "ffprobe")
GIFSKI = str(ROOT / "tools/linux/gifski")
MAGICK = str(ROOT / "tools/squashfs-root/AppRun")
FPS, DUR = 15, 5

CLIPS = {
    # 이름: (원본, 시작 초, 출력 폭)
    "animation": (ROOT / "src/big_buck_bunny_720p_h264.mov", 170, 480),
    "live-action": (ROOT / "src/tears_of_steel_720p.mov", 240, 480),
    "screen": (ROOT / "screen/screen_raw.mkv", 6, 640),
}

def configs(ref, out):
    pat = str(ref / "%03d.png")
    frames = sorted(str(p) for p in ref.glob("*.png"))
    return {
        "ffmpeg-default": [FF, "-v", "error", "-y", "-framerate", str(FPS), "-i", pat, out],
        "ffmpeg-palette": [FF, "-v", "error", "-y", "-framerate", str(FPS), "-i", pat, "-vf",
                           "split[a][b];[a]palettegen[p];[b][p]paletteuse", out],
        "ffmpeg-palette-small": [FF, "-v", "error", "-y", "-framerate", str(FPS), "-i", pat, "-vf",
                                 "split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle", out],
        "gifski-q90": [GIFSKI, "-q", "--fps", str(FPS), "-o", out] + frames,
        "gifski-q70": [GIFSKI, "-q", "--fps", str(FPS), "--quality", "70", "-o", out] + frames,
        "imagemagick-default": [MAGICK, "-delay", f"1x{FPS}"] + frames + [out],
        "imagemagick-optimize": [MAGICK, "-delay", f"1x{FPS}"] + frames + ["-layers", "Optimize", out],
    }

def timed(cmd):
    # os.wait4로 자식 프로세스의 최대 RSS(KB)를 받음
    t0 = time.perf_counter()
    p = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    _, status, ru = os.wait4(p.pid, 0)
    sec = time.perf_counter() - t0
    if status:
        sys.exit(f"실패: {cmd[:3]} {p.stderr.read()[-500:]}")
    return sec, ru.ru_maxrss / 1024

def decode(gif):
    # GIF 프레임을 지연값과 무관하게 순서대로 PNG로 풀어 원본 프레임과 1:1로 비교
    tmp = Path(gif).with_suffix(".frames")
    if tmp.exists():
        for f in tmp.glob("*.png"):
            f.unlink()
    tmp.mkdir(exist_ok=True)
    subprocess.run([FF, "-v", "error", "-y", "-i", gif, "-fps_mode", "passthrough", "-start_number", "0",
                    "-pix_fmt", "rgb24", str(tmp / "%03d.png")], check=True)
    return tmp

def compare(gif, ref):
    dec = decode(gif)
    cmd = [FF, "-v", "info", "-framerate", str(FPS), "-i", str(dec / "%03d.png"), "-framerate", str(FPS),
           "-i", str(ref / "%03d.png"), "-lavfi",
           "[0:v]format=rgb24,split[a0][a1];[1:v]format=rgb24,split[b0][b1];[a0][b0]ssim=stats_file=ssim.log;[a1][b1]psnr",
           "-f", "null", "-"]
    err = subprocess.run(cmd, capture_output=True, text=True).stderr
    ssim = float(re.search(r"SSIM .*All:([0-9.]+)", err).group(1))
    psnr = float(re.search(r"PSNR .*average:([0-9.inf]+)", err).group(1))
    vals = [float(m) for m in re.findall(r"All:([0-9.]+)", Path("ssim.log").read_text())]
    return ssim, psnr, min(vals), len(vals), len(list(dec.glob("*.png")))

def probe(gif):
    out = subprocess.run([FP, "-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries",
                          "stream=nb_read_frames,width,height:format=duration", "-of", "json", gif],
                         capture_output=True, text=True).stdout
    d = json.loads(out)
    s = d["streams"][0]
    return int(s["nb_read_frames"]), float(d["format"]["duration"]), s["width"], s["height"]

def main():
    results = []
    for clip, (src, start, width) in CLIPS.items():
        ref = ROOT / "ref" / clip
        ref.mkdir(parents=True, exist_ok=True)
        if not any(ref.glob("*.png")):
            subprocess.run([FF, "-v", "error", "-y", "-ss", str(start), "-i", str(src), "-t", str(DUR), "-vf",
                            f"fps={FPS},scale={width}:-2:flags=lanczos,format=rgb24", "-start_number", "0",
                            str(ref / "%03d.png")], check=True)
        nref = len(list(ref.glob("*.png")))
        outdir = ROOT / "out" / clip
        outdir.mkdir(parents=True, exist_ok=True)
        for name, _ in configs(ref, "x").items():
            out = str(outdir / f"{name}.gif")
            runs = [timed(configs(ref, out)[name]) for _ in range(3)]
            ssim, psnr, minssim, ncmp, ndec = compare(out, ref)
            frames, duration, w, h = probe(out)
            row = dict(clip=clip, config=name, size_kb=round(os.path.getsize(out) / 1024, 1),
                       ssim=round(ssim, 4), min_frame_ssim=round(minssim, 4), psnr=round(psnr, 2),
                       frames=frames, decoded=ndec, ref_frames=nref, compared=ncmp, duration=round(duration, 2),
                       width=w, height=h,
                       seconds=round(statistics.median(r[0] for r in runs), 2),
                       peak_mb=round(statistics.median(r[1] for r in runs)))
            print(json.dumps(row), flush=True)
            results.append(row)
    Path(sys.argv[1] if len(sys.argv) > 1 else "results.json").write_text(json.dumps(results, indent=1))

if __name__ == "__main__":
    main()
