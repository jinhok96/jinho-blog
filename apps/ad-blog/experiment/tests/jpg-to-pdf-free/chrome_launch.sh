#!/bin/sh
export DISPLAY=:99
exec /opt/pw-browsers/chromium-1194/chrome-linux/chrome --no-sandbox --user-data-dir=/tmp/j2p/chprof --no-first-run --window-position=0,0 --window-size=1600,1000 --disable-gpu "$@"
