#!/bin/bash
# usage: run_all.sh <asr dir>; runs every model on the call and the clean set, sequentially
cd "$1"
PY="./venv/bin/python -I"
: > results/summary.jsonl
for m in whisper-tiny.en whisper-base.en whisper-small.en whisper-turbo moonshine-tiny moonshine-base parakeet-v2 parakeet-v3; do
  for set in 4387332 clean; do
    b=$(THREADS=4 $PY scripts/bench.py $m work/$set.wav work/$set.segs.json results/$set.$m.txt)
    w=$($PY scripts/wer.py work/$set.ref.txt results/$set.$m.txt)
    echo "{\"set\":\"$set\",\"bench\":$b,\"wer\":$w}" | tee -a results/summary.jsonl
  done
done
echo ALL_DONE
