#!/usr/bin/env bash
# 도구별 변환 결과를 analyze_convert.py(그릇·코덱·같은 프레임·회전·메타데이터)와
# align_psnr.py(프레임을 맞춘 밝기 PSNR)로 재서 results.jsonl에 한 줄씩 기록
# 결과 파일은 /tmp/mv/out/{도구}/ (저장소에 넣지 않음), 원본은 make_clips.sh
set -e
cd "$(dirname "$0")"
OUT=results.jsonl; : > $OUT
S=/tmp/mv/clips/iphone-style.mov; P=/tmp/mv/clips/iphone-portrait.mov
row() {
  local f=$1 src=$2 tool=$3 setting=$4
  local a b
  a=$(python3 -I analyze_convert.py "$f" "$src" --json)
  b=$(/tmp/mvenv/bin/python -I align_psnr.py "$f" "$src" --json)
  python3 -I -c "import sys,json; a=json.loads(sys.argv[1]); b=json.loads(sys.argv[2]); a['aligned']=b; a['tool']=sys.argv[3]; a['setting']=sys.argv[4]; a['clip']=sys.argv[5]; print(json.dumps(a,ensure_ascii=False))" "$a" "$b" "$tool" "$setting" "$(basename $src)" >> $OUT
}
row /tmp/mv/out/cloudconvert/iphone-style.mp4 $S "CloudConvert" "default (H.264 CRF 23, AAC 128k)"
row /tmp/mv/out/123apps/iphone-style-default.mp4 $S "123apps Video Converter" "default (mp4, H.264, AAC)"
row /tmp/mv/out/123apps/iphone-portrait-default.mp4 $P "123apps Video Converter" "default (mp4, H.264, AAC)"
row /tmp/mv/out/vlc/iphone-style-default.mp4 $S "VLC 3.0.20" "Video - H.264 + MP3 (MP4) profile"
row /tmp/mv/out/vlc/iphone-style-keep.mp4 $S "VLC 3.0.20" "same profile + Keep original video/audio track"
row /tmp/mv/out/vlc/iphone-portrait-default.mp4 $P "VLC 3.0.20" "Video - H.264 + MP3 (MP4) profile"
row /tmp/mv/out/handbrake/iphone-style-default.mp4 $S "HandBrake 1.7.2" "Fast 1080p30 (default preset)"
row /tmp/mv/out/handbrake/iphone-portrait.mp4 $P "HandBrake 1.7.2" "Fast 1080p30 (default preset)"
row /tmp/mv/out/losslesscut/iphone-style-default.mp4 $S "LosslessCut 3.69.0" "Output format mp4, defaults"
row /tmp/mv/out/losslesscut/iphone-style-preserve.mp4 $S "LosslessCut 3.69.0" "mp4 + Preserve all MP4/MOV metadata"
row /tmp/mv/out/losslesscut/iphone-portrait-default.mp4 $P "LosslessCut 3.69.0" "Output format mp4, defaults"
wc -l $OUT
