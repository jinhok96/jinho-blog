#!/usr/bin/env bash
# 화면 녹화 클립: screen-page.html을 Xvfb(1920x1080)의 Chromium 키오스크로 열고 70초 무손실 녹화 (측정에는 6~66초 사용)
set -e
FF=$(ls -d /tmp/cv/tools/ffmpeg-n9*/bin)/ffmpeg
OUT=/tmp/cv/screen; mkdir -p "$OUT"; cp "$(dirname "$0")/screen-page.html" "$OUT/page.html"
Xvfb :56 -screen 0 1920x1080x24 >/dev/null 2>&1 & XP=$!; sleep 2
export DISPLAY=:56
/opt/pw-browsers/chromium-1194/chrome-linux/chrome --no-sandbox --kiosk --window-size=1920,1080 --window-position=0,0 \
  --no-first-run --disable-gpu --force-device-scale-factor=1.5 "file://$OUT/page.html" >/dev/null 2>&1 & CP=$!
sleep 0.5
"$FF" -v error -y -f x11grab -draw_mouse 0 -framerate 30 -video_size 1920x1080 -i :56 -t 70 -c:v libx264rgb -qp 0 -preset ultrafast "$OUT/screen_raw.mkv"
kill $CP $XP
