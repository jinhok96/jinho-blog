#!/bin/sh
# usage: addfile.sh <dialog-title> <path>
export DISPLAY=:99
W=$(xdotool search --name "$1" | head -1)
xdotool windowfocus --sync $W
xdotool type --window $W --delay 30 "$2"
sleep 1
xdotool key --window $W Return
