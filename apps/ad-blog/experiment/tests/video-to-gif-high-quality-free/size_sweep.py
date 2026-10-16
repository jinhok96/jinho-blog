#!/usr/bin/env python3
"""실사 클립에서 폭(320/480/640)·프레임 수(10/15fps)를 바꿔 FFmpeg 팔레트(small)·gifski Q90 GIF 크기 측정."""
import json, os, subprocess
from pathlib import Path
ROOT = Path("/tmp/v2g")
FF = str(ROOT / "tools/ffmpeg-n9.0-latest-linux64-gpl-9.0/bin/ffmpeg")
GIFSKI = str(ROOT / "tools/linux/gifski")
SRC, START, DUR = ROOT / "src/tears_of_steel_720p.mov", 240, 5
out = ROOT / "sweep"; out.mkdir(exist_ok=True)
rows = []
for fps in (10, 15):
    for w in (320, 480, 640):
        vf = f"fps={fps},scale={w}:-2:flags=lanczos"
        a = out / f"ff-{w}-{fps}.gif"
        subprocess.run([FF, "-v", "error", "-y", "-ss", str(START), "-t", str(DUR), "-i", str(SRC), "-vf",
                        vf + ",split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle", str(a)], check=True)
        b = out / f"gifski-{w}-{fps}.gif"
        p1 = subprocess.Popen([FF, "-v", "error", "-ss", str(START), "-t", str(DUR), "-i", str(SRC), "-vf", vf,
                               "-f", "yuv4mpegpipe", "-"], stdout=subprocess.PIPE)
        subprocess.run([GIFSKI, "-q", "--fps", str(fps), "-o", str(b), "-"], stdin=p1.stdout, check=True)
        p1.wait()
        r = dict(fps=fps, width=w, ffmpeg_small_kb=round(os.path.getsize(a) / 1024), gifski_q90_kb=round(os.path.getsize(b) / 1024))
        print(json.dumps(r)); rows.append(r)
Path("sweep.json").write_text(json.dumps(rows, indent=1))
