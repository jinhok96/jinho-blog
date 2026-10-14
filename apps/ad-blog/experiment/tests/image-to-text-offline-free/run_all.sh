#!/usr/bin/env bash
# 사용: ./run_all.sh <작업 폴더(venv, venv2, imgs 포함)>
# 엔진을 하나씩 순서대로 실행 (동시 실행 시 속도가 섞임). 최대 메모리는 /usr/bin/time -v
set -euo pipefail
W=$1; HERE=$(cd "$(dirname "$0")" && pwd); mkdir -p "$W/results"
for e in tesseract tesseract-psm6 rapidocr rapidocr-medium; do
  /usr/bin/time -v "$W/venv/bin/python" "$HERE/bench.py" $e "$W/imgs" "$W/results/$e.jsonl" 2> "$W/results/$e.time" >/dev/null
done
for e in easyocr doctr doctr-fast; do
  /usr/bin/time -v "$W/venv2/bin/python" "$HERE/bench.py" $e "$W/imgs" "$W/results/$e.jsonl" 2> "$W/results/$e.time" >/dev/null
done
