#!/usr/bin/env bash
# 각 도구 결과 파일을 analyze.py로 재서 results.jsonl에 한 줄씩 기록 (요청 구간 12.5~30.0초, 키프레임 정렬 시험만 12.0~30.0초)
set -e
cd "$(dirname "$0")"
OUT=results.jsonl; : > $OUT
row() { python3 -I analyze.py "$1" "$2" "$3" "$4" --json | python3 -c "import sys,json; d=json.loads(sys.stdin.read()); d['tool']='$5'; d['clip']='$(basename $2)'; print(json.dumps(d,ensure_ascii=False))" >> $OUT; }
H=/tmp/tv/clips/clip-h264-1s.mp4; V=/tmp/tv/clips/clip-hevc.mov
row /tmp/tv/out/ezgif/h264-copy.mp4 $H 12.5 30 "ezgif Copy original"
row /tmp/tv/out/ezgif/hevc-copy.mov $V 12.5 30 "ezgif Copy original"
row /tmp/tv/out/ezgif/h264-mp4.mp4 $H 12.5 30 "ezgif MP4 (h264/aac)"
row /tmp/tv/out/ezgif/hevc-mp4.mp4 $V 12.5 30 "ezgif MP4 (h264/aac)"
row /tmp/tv/out/123apps/h264-default.mp4 $H 12.5 30 "123apps default"
row /tmp/tv/out/123apps/hevc-0.mp4 $V 12.5 30 "123apps default"
row /tmp/tv/out/123apps/h264-noreenc.mp4 $H 12.5 30 "123apps No re-encoding"
row /tmp/tv/out/123apps/hevc-1.mp4 $V 12.5 30 "123apps No re-encoding"
row /tmp/tv/out/storrito/h264.mp4 $H 12.5 30 "Storrito"
row /tmp/tv/out/storrito/h264-kf.mp4 $H 12 30 "Storrito (keyframe-aligned 12.0)"
