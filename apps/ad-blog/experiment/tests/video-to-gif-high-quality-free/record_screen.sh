#!/usr/bin/env bash
# 화면 녹화 클립 생성: screen-page.html을 Xvfb(1280x720)의 Chromium 키오스크로 열고 16초 무손실 녹화.
# 페이지는 로드 4초 뒤부터 16ms마다 2px씩 스크롤. 측정에는 6~11초 구간 사용 (run_tests.py CLIPS).
set -e
FF=/tmp/v2g/tools/ffmpeg-n9.0-latest-linux64-gpl-9.0/bin/ffmpeg
OUT=/tmp/v2g/screen; mkdir -p "$OUT"; cp "$(dirname "$0")/screen-page.html" "$OUT/page.html"
Xvfb :55 -screen 0 1280x720x24 >/dev/null 2>&1 & sleep 2
export DISPLAY=:55
/opt/pw-browsers/chromium-1194/chrome-linux/chrome --no-sandbox --kiosk --window-size=1280,720 --window-position=0,0 \
  --no-first-run --disable-gpu "file://$OUT/page.html" >/dev/null 2>&1 &
sleep 0.5
"$FF" -v error -y -f x11grab -draw_mouse 0 -framerate 30 -video_size 1280x720 -i :55 -t 16 -c:v libx264rgb -qp 0 -preset ultrafast "$OUT/screen_raw.mkv"
pkill -x chrome; pkill -x Xvfb
