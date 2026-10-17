#!/bin/sh
# usage: chrome_print.sh <pages> <outfile>  (Chrome 창이 packet.pdf를 연 상태)
export DISPLAY=:99
xdotool mousemove 900 600 click 1; sleep 0.5
xdotool key ctrl+p; sleep 5
xdotool mousemove 1220 228 click 1; sleep 1
xdotool mousemove 1157 332 click 1; sleep 1
xdotool type --delay 50 "$1"; xdotool key Tab; sleep 4
xdotool mousemove 1282 755 click 1; sleep 3
xdotool mousemove 500 26 click 1; xdotool key ctrl+a
xdotool type --delay 30 "$2"; xdotool key Return; sleep 6
