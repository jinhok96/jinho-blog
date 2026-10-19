#!/bin/sh
export DISPLAY=:99 XDG_RUNTIME_DIR=/run/user/0
setsid dbus-run-session -- flatpak run --filesystem=/tmp com.sejda.Sejda "$@" > /tmp/sejda.log 2>&1 &
