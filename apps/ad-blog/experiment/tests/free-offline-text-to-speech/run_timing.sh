#!/bin/sh
# Timing reruns on an otherwise idle machine: 3 passes at 4 threads, 1 pass at 1 thread.
# Usage: run_timing.sh <python> <models_dir> <work_root>
PY=$1; M=$2; W=$3
KEYS="piper-lessac-low piper-lessac-medium piper-lessac-high piper-amy-medium piper-ryan-high kokoro-v0_19-af kokoro-v1_0-af_heart kitten-nano-v0_8-int8 kitten-mini-v0_8 supertonic-3-int8 matcha-ljspeech"
for r in 1 2 3; do for k in $KEYS; do $PY "$(dirname "$0")/synth.py" $k $M $W/rerun$r 4 2>/dev/null | tail -1; done; done
for k in $KEYS; do $PY "$(dirname "$0")/synth.py" $k $M $W/t1 1 2>/dev/null | tail -1; done
