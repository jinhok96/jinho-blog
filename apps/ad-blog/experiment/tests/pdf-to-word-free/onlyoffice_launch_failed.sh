#!/bin/sh
export DISPLAY=:99 XDG_RUNTIME_DIR=/run/user/0
setsid dbus-run-session -- flatpak run --unset-env=XAUTHORITY --nosocket=wayland --filesystem=/tmp --command=sh org.onlyoffice.desktopeditors -c 'export LD_LIBRARY_PATH=/app/bin/opt/onlyoffice/desktopeditors:$LD_LIBRARY_PATH; cd /app/bin/opt/onlyoffice/desktopeditors; exec ./DesktopEditors --no-sandbox --disable-gpu "$@"' sh "$@" > /tmp/oo.log 2>&1 &
