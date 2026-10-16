#!/bin/sh
A=/var/lib/flatpak/app/fr.handbrake.ghb/current/active/files; R=/var/lib/flatpak/runtime/org.gnome.Platform/x86_64/49/active/files
LD_LIBRARY_PATH=$A/lib:$R/lib/x86_64-linux-gnu:$R/lib exec $R/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2 $A/bin/HandBrakeCLI "$@"
