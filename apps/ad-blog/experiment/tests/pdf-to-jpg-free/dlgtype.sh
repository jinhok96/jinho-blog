#!/bin/sh
# usage: dlgtype.sh "<window name>" <x> <y> <text> : 해당 창에 포커스 후 입력 칸 클릭, 전체 선택, 입력, Enter
export DISPLAY=:99
W=$(xdotool search --onlyvisible --name "$1" | head -1)
xdotool windowfocus --sync $W; sleep 0.4
xdotool mousemove $2 $3 click 1; sleep 0.3; xdotool key --window $W ctrl+a; sleep 0.2
xdotool type --window $W --delay 30 "$4"; sleep 0.8; xdotool key --window $W Return
