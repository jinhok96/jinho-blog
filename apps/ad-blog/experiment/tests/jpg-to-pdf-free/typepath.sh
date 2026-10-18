#!/bin/sh
# usage: typepath.sh <x> <y> <path> : 입력 칸을 클릭하고 전체 선택 후 경로 입력 + Enter
export DISPLAY=:99
xdotool mousemove $1 $2 click 1; sleep 0.3; xdotool key ctrl+a; sleep 0.2
xdotool type --delay 25 "$3"; sleep 0.8; xdotool key Return
