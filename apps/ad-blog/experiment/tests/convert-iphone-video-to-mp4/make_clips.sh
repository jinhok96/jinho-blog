#!/usr/bin/env bash
# 측정용 원본 클립 (Tears of Steel 1080p 3:00~4:00, CC BY 3.0 Blender Foundation)
#  - clip-hevc.mov  : trim-video-without-losing-quality 글과 같은 HEVC + AAC .mov 클립(같은 명령)
#  - iphone-style.mov : 위 클립을 그대로 복사(-c copy)하고 iPhone이 .mov에 넣는 방식의 메타데이터를 더함
#      촬영 시각(mvhd creation_time + com.apple.quicktime.creationdate), 위치(com.apple.quicktime.location.ISO6709)
#  - iphone-portrait.mov : 같은 클립 앞 20초에 세로 회전 표시(-90도, iPhone 세로 영상의 일반 값)를 더함 (세로로 찍은 iPhone 영상처럼 프레임은 가로로 저장, 재생 때 회전)
set -e
cd /tmp/mv
SRC=dl/tears_of_steel_1080p.mov
mkdir -p clips
[ -f clips/clip-hevc.mov ] || ffmpeg -v error -y -ss 180 -i "$SRC" -t 60 -map 0:v:0 -map 0:a:0 \
  -c:v libx265 -preset medium -crf 20 -tag:v hvc1 -pix_fmt yuv420p -x265-params log-level=error \
  -c:a aac -b:a 192k -ac 2 clips/clip-hevc.mov
ffmpeg -v error -y -i clips/clip-hevc.mov -map 0 -c copy \
  -metadata creation_time=2026-06-14T15:30:00Z \
  -metadata com.apple.quicktime.creationdate=2026-06-14T11:30:00-0400 \
  -metadata "com.apple.quicktime.location.ISO6709=+40.6892-074.0445+010.000/" \
  -metadata com.apple.quicktime.make=Apple \
  -movflags use_metadata_tags clips/iphone-style.mov
ffmpeg -v error -y -display_rotation -90 -i clips/clip-hevc.mov -t 20 -map 0 -c copy \
  -metadata creation_time=2026-06-14T15:30:00Z \
  -metadata com.apple.quicktime.creationdate=2026-06-14T11:30:00-0400 \
  -metadata "com.apple.quicktime.location.ISO6709=+40.6892-074.0445+010.000/" \
  -metadata com.apple.quicktime.make=Apple \
  -movflags use_metadata_tags clips/iphone-portrait.mov
ls -la clips
