#!/usr/bin/env bash
# HandBrake 출력이 거의 무손실(RF 5)에서도 원본과 다른지 확인 (애니메이션 5초, PSNR)
# 결과(2026-10-16): HandBrake RF 5 = 40.8 dB, FFmpeg x264 CRF 5 = 60.9 dB, 화면 녹화 HandBrake RF 5 = 50.8 dB
# 태그 제거(bt709 → unspecified)·--crop 0:0:0:0·interlace detection 끄기 모두 결과 같음
set -e
FF=$(ls -d /tmp/cv/tools/ffmpeg-n9*/bin)/ffmpeg; cd /tmp/cv; mkdir -p dbg
psnr() { "$FF" -hide_banner -i "$1" -i "$2" -lavfi "[0:v]setpts=PTS-STARTPTS[d];[1:v]setpts=PTS-STARTPTS[r];[d][r]psnr" -f null - 2>&1 | grep -o "PSNR y.*"; }
"$FF" -v error -y -i src_clips/animation.mp4 -t 5 -c:v copy -an dbg/tag.mp4
./hb.sh -i dbg/tag.mp4 -o dbg/tag_q5.mp4 --preset "Fast 1080p30" -q 5 >/dev/null 2>&1
"$FF" -v error -y -i dbg/tag.mp4 -c:v libx264 -crf 5 -an dbg/ffq5.mp4
echo "HandBrake RF5: $(psnr dbg/tag_q5.mp4 dbg/tag.mp4)"
echo "FFmpeg CRF5:   $(psnr dbg/ffq5.mp4 dbg/tag.mp4)"
"$FF" -v error -y -i src_clips/screen.mp4 -t 5 -c copy dbg/scr.mp4
./hb.sh -i dbg/scr.mp4 -o dbg/scr_q5.mp4 --preset "Fast 1080p30" -q 5 >/dev/null 2>&1
echo "HandBrake RF5 screen: $(psnr dbg/scr_q5.mp4 dbg/scr.mp4)"
