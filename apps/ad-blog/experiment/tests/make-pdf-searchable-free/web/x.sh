#!/bin/bash
# 사용: x.sh shot NAME | click X Y | key KEYS | type TEXT
export DISPLAY=:99
S=/tmp/claude-0/-home-user-jinho-blog/80cf8223-00dd-5c81-995f-f6763fdc1ec5/scratchpad
case "$1" in
  shot) import -window root "$S/$2.png" ;;
  click) xdotool mousemove "$2" "$3" click 1 ;;
  dclick) xdotool mousemove "$2" "$3" click --repeat 2 1 ;;
  key) shift; xdotool key "$@" ;;
  type) xdotool type --delay 20 "$2" ;;
esac
