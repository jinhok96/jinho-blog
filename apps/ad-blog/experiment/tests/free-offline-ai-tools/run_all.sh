#!/bin/sh
# 다운로드가 모두 끝난 뒤 실행 (다운로드와 겹치면 속도가 낮게 나옴). 모델마다 새 프로세스.
set -e
cd "$(dirname "$0")"
lscpu | grep -E "Model name|^CPU\(s\)" > results/env.txt
free -g | head -2 >> results/env.txt
for f in Qwen3.5-0.8B Qwen3.5-2B Llama-3.2-3B-Instruct Phi-4-mini-instruct Qwen3.5-4B gemma-4-E2B-it gemma-4-E4B-it; do
  /tmp/llm/bin/python chat_bench.py "/tmp/models/$f-Q4_K_M.gguf" "results/$f.json"
done
