#!/usr/bin/env bash
# 측정용 원본 클립 2개 (Tears of Steel 1080p 3:00~4:00, 60초, CC BY 3.0 Blender Foundation)
#  - clip-h264-1s.mp4 : H.264 + AAC, 키프레임 1초(24프레임)마다
#  - clip-hevc.mov    : HEVC + AAC, x265 기본 키프레임(장면 전환마다, 최대 250프레임 ≈ 10.4초)
set -e
cd /tmp/tv
SRC=dl/tears_of_steel_1080p.mov
mkdir -p clips
ffmpeg -v error -y -ss 180 -i "$SRC" -t 60 -map 0:v:0 -map 0:a:0 \
  -c:v libx264 -preset slow -crf 18 -g 24 -keyint_min 24 -sc_threshold 0 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -ac 2 -movflags +faststart clips/clip-h264-1s.mp4
ffmpeg -v error -y -ss 180 -i "$SRC" -t 60 -map 0:v:0 -map 0:a:0 \
  -c:v libx265 -preset medium -crf 20 -tag:v hvc1 -pix_fmt yuv420p -x265-params log-level=error \
  -c:a aac -b:a 192k -ac 2 clips/clip-hevc.mov
