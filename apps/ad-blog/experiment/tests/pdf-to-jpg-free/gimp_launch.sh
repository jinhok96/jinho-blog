#!/bin/sh
export DISPLAY=:99 XDG_RUNTIME_DIR=/run/user/0
setsid /tmp/gimpdl/squashfs-root/AppRun "$@" > /tmp/gimp.log 2>&1 &
