#!/bin/sh
export DISPLAY=:99
export XDG_RUNTIME_DIR=/run/user/0
exec dbus-run-session -- flatpak run --filesystem=/tmp com.github.jeromerobert.pdfarranger "$@"
