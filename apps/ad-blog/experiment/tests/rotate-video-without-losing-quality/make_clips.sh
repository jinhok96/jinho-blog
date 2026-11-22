#!/usr/bin/env bash
# 측정용 원본 클립 (Tears of Steel 1080p 3:00~3:30, CC BY 3.0 Blender Foundation)
#  - clip-h264.mp4   : H.264 High(CRF 18) + AAC 192k, 30초 720프레임, 1920x800 가로 프레임, 회전 표시 없음
#  - sideways.mp4    : 위 파일을 다시 인코딩 없이 복사하고 회전 표시(display matrix -90도)를 더함
#                      → 휴대폰을 눕혀 찍기 시작해 '세로'로 잘못 기록된 영상처럼 재생 때 옆으로 누워 보임 (800x1920)
#                      촬영 시각(creation_time)·위치(©xyz, Android 휴대폰 MP4 방식) 태그 포함
#  - baked-sideways.mp4 : 프레임 자체를 시계 방향 90도로 돌려 다시 인코딩(CRF 18), 회전 표시 없음
#                      → 다른 앱을 거치며 회전이 프레임에 굳어 버린 영상
set -e
cd /tmp/rv
SRC=dl/tears_of_steel_1080p.mov
mkdir -p clips
ffmpeg -v error -y -ss 180 -i "$SRC" -t 30 -map 0:v:0 -map 0:a:0 \
  -c:v libx264 -preset slow -crf 18 -g 48 -keyint_min 48 -sc_threshold 0 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -ac 2 -movflags +faststart clips/clip-h264.mp4
ffmpeg -v error -y -display_rotation -90 -i clips/clip-h264.mp4 -map 0 -c copy \
  -metadata creation_time=2026-06-14T15:30:00Z \
  -metadata "location=+40.6892-074.0445/" \
  -movflags +faststart clips/sideways.mp4
ffmpeg -v error -y -i clips/clip-h264.mp4 -map 0 -vf transpose=1 \
  -c:v libx264 -preset slow -crf 18 -g 48 -keyint_min 48 -sc_threshold 0 -pix_fmt yuv420p \
  -c:a copy -metadata creation_time=2026-06-14T15:30:00Z -metadata "location=+40.6892-074.0445/" \
  -movflags +faststart clips/baked-sideways.mp4
ls -la clips
