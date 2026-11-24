#!/usr/bin/env bash
# 측정용 원본 클립 (Tears of Steel 1080p 3:00~, CC BY 3.0 Blender Foundation)
#  - landscape.mp4 : H.264 High(CRF 18) + AAC 192k, 30초 720프레임, 1920x800, 키프레임 2초마다
#                    촬영 시각(creation_time)·위치(©xyz, Android 휴대폰 MP4 방식) 태그
#                    (rotate-video-without-losing-quality의 clip-h264.mp4와 같은 인코딩 명령)
#  - portrait.mov  : HEVC(x265 CRF 20, hvc1) + AAC 192k, 20초 480프레임, 프레임은 1920x800로 저장하고
#                    세로 회전 표시(display matrix -90도)를 붙임 → iPhone 세로 영상처럼 재생 때 800x1920
#                    iPhone이 .mov에 넣는 촬영 시각·위치·제조사 태그 (convert-iphone-video-to-mp4와 같은 방식)
#  실제 휴대폰으로 찍은 영상이 아니라 휴대폰 파일의 저장 방식을 흉내 낸 시험 파일
set -e
mkdir -p /tmp/ra/clips && cd /tmp/ra
SRC=dl/tears_of_steel_1080p.mov
ffmpeg -v error -y -ss 180 -i "$SRC" -t 30 -map 0:v:0 -map 0:a:0 \
  -c:v libx264 -preset slow -crf 18 -g 48 -keyint_min 48 -sc_threshold 0 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -ac 2 -movflags +faststart clips/clip-h264.mp4
ffmpeg -v error -y -i clips/clip-h264.mp4 -map 0 -c copy \
  -metadata creation_time=2026-06-14T15:30:00Z \
  -metadata "location=+40.6892-074.0445/" \
  -movflags +faststart clips/landscape.mp4
ffmpeg -v error -y -ss 180 -i "$SRC" -t 20 -map 0:v:0 -map 0:a:0 \
  -c:v libx265 -preset medium -crf 20 -tag:v hvc1 -pix_fmt yuv420p -x265-params log-level=error \
  -c:a aac -b:a 192k -ac 2 clips/clip-hevc.mov
ffmpeg -v error -y -display_rotation -90 -i clips/clip-hevc.mov -map 0 -c copy \
  -metadata creation_time=2026-06-14T15:30:00Z \
  -metadata com.apple.quicktime.creationdate=2026-06-14T11:30:00-0400 \
  -metadata "com.apple.quicktime.location.ISO6709=+40.6892-074.0445+010.000/" \
  -metadata com.apple.quicktime.make=Apple \
  -movflags use_metadata_tags clips/portrait.mov
ls -la clips
md5sum clips/landscape.mp4 clips/portrait.mov
