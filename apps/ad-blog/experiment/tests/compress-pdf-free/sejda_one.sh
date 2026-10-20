#!/bin/sh
# Sejda Desktop Compress에서 PDF 1개를 기본값(Medium, 144ppi)으로 압축 (Xvfb :99). 사용: sejda_one.sh <stem>
export DISPLAY=:99
d=$1; out=/tmp/cp/out/sejda-medium/$d.pdf
xdotool mousemove 40 45 click 1; sleep 2
xdotool mousemove 210 49 click 1; sleep 3
xdotool mousemove 682 369 click 1; sleep 5
W=$(xdotool search --name "Open Files" | head -1); xdotool windowfocus --sync $W
xdotool key ctrl+l; sleep 0.5; xdotool type --delay 30 "/tmp/cp/in/$d.pdf"; sleep 0.5; xdotool key Return; sleep 6
import -window root /tmp/cp/shots/sejda-$d-options.png
xdotool mousemove 627 399 click 1; sleep 5
W=$(xdotool search --name "Select output file" | head -1); xdotool windowfocus --sync $W
xdotool key ctrl+a; xdotool type --delay 20 "$out"; xdotool key Return
t0=$(date +%s.%N)
for i in $(seq 1 300); do sleep 1; [ -s "$out" ] && break; done
sleep 4; echo "$d $(echo "$(date +%s.%N) - $t0" | bc) $(stat -c %s $out 2>/dev/null)"
import -window root /tmp/cp/shots/sejda-$d-done.png
