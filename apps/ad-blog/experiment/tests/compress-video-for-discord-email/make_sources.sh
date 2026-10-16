#!/usr/bin/env bash
# 측정용 원본 클립 3개(60초, 1080p, 높은 비트레이트 x264 CRF 14) 생성
set -e
FF=$(ls -d /tmp/cv/tools/ffmpeg-n9*/bin)/ffmpeg
cd /tmp/cv; mkdir -p src_clips
"$FF" -v error -y -ss 90 -i dl/bbb_sunflower_2160p_30fps_normal.mp4 -t 60 -map 0:v:0 -map 0:a:0 -vf scale=1920:1080:flags=lanczos \
  -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p -c:a aac -b:a 256k -ac 2 src_clips/animation.mp4 &
"$FF" -v error -y -ss 180 -i dl/ToS-4k-1920.mov -t 60 -map 0:v:0 -map 0:a:0 \
  -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p -c:a aac -b:a 256k -ac 2 src_clips/live-action.mp4 &
"$FF" -v error -y -ss 6 -i screen/screen_raw.mkv -t 60 -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p -an src_clips/screen.mp4 &
wait
