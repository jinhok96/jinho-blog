# free-offline-ai-tools 사실 확인표

- 주 검색어: `free offline ai tools` (Google·Bing) / `offline ai tools` (Google·Bing·YouTube)
- 하위 검색어: offline ai tools for pc, best free offline ai tools, is there an offline ai, ai that works offline, offline ai for windows, offline ai software for pc, what ai can be used offline (2026-10-14 `demand_check.py suggest`)
- 채널: **검색형** (허브 글, 상시 수요). 제목 53자, 연도 표기 (traffic-playbook 3: 허브는 연도·`updatedAt` 함께 갱신)
- 차별점: 오프라인 챗봇 7개 모델 직접 측정(속도·RAM·20문항) + 기존 측정 글 3편(받아쓰기·TTS·배경 제거) 결과를 한 표로. RAM 요구량을 작업별로 비교
- 적용한 노하우: 허브 글(노하우 3, 첫 허브), 검색형 제목(노하우 1), 이미지 5장(노하우 7: 대표 그래프 1200×675 + 그래프 2 + 실제 출력 비교 1 + 기존 rembg 웹 UI 스크린샷 재사용 1), 요약 표, 내부 링크 4개(측정 글 3 + Chrome AI), 측정 글 3편에서 역링크
- 측정 환경: Linux, Intel Xeon 2.30GHz 4코어, RAM 16GB, GPU 없음, 2026-10-14 (`results/env.txt`). 기존 3편은 2.8GHz 서버 → 글에 행 간 비교 금지 명시

## 측정 (직접 실행)

| 주장 | 근거 |
| --- | --- |
| 모델 7개 점수·속도·RAM·요약 결과 | `chat_bench.py` → `results/*.json`, `summarize.py` → `summary.json` |
| 채점 기준 수정: 분수 답(1 7/8, 15/8)과 "225 minutes" 정답 처리 | 실행 후 오답을 직접 검토해 채점 함수 수정, 저장된 답으로 재채점 (`score_20_at_run` = 수정 전) |
| Qwen3.5 0.8B: Sydney, 13 bullets, 수학 6/8 오답 | `results/Qwen3.5-0.8B.json` |
| Gemma 4 E4B: 물 끓는점 32°F | `results/gemma-4-E4B-it.json` |
| Thinking 기본 꺼짐 | Qwen3.5(unsloth) 템플릿 `enable_thinking` 미정의 시 `<think>\n\n</think>`, Gemma 4 템플릿 `enable_thinking | default(false)` (GGUF 메타데이터 직접 확인) |
| 그래프 4장 | `charts.py` (그래프 3의 받아쓰기·TTS·배경 제거 값은 각 글의 summary·본문 표) |

속도 편차: Qwen3.5 0.8B 3회 16.4·19.2·25.5 tok/s로 편차 큼 (공유 클라우드 CPU). 나머지는 3회 차이 10% 이내 → 중앙값 사용.

## 문서 (2026-10-14 직접 열어 확인)

| 주장 | 출처 |
| --- | --- |
| Ollama: Windows 10 22H2+, macOS 14(Sonoma)+, Linux | docs.ollama.com/windows, /macos, ollama.com/download |
| Ollama MIT | raw.githubusercontent.com/ollama/ollama/main/LICENSE |
| Ollama 로컬 실행 시 프롬프트를 보지 않음, `OLLAMA_NO_CLOUD=1`로 로컬 전용 | docs.ollama.com/faq |
| Ollama 모델 이름 qwen3.5:0.8b/2b/4b, gemma4:e2b/e4b, llama3.2:3b, phi4-mini | ollama.com/library/{name}/tags |
| `ollama run` 명령 | docs.ollama.com/cli |
| LM Studio 요구 사항 (macOS 14+, Apple Silicon, Intel Mac 미지원, Windows x64 AVX2/ARM, 16GB 권장) | lmstudio.ai/docs/app/system-requirements |
| LM Studio 오프라인 동작·인용문 | lmstudio.ai/docs/app/offline |
| LM Studio Discover·Chat 탭 단계 | lmstudio.ai/docs/app/basics |
| LM Studio "MLX and llama.cpp under the hood", Bionic | lmstudio.ai, lmstudio.ai/download (0.4.26) |
| LM Studio 무료 플랜 로컬 모델, 유료 Bionic+ $20·Pro $100 클라우드 | lmstudio.ai/pricing |
| Jan 무료·오픈소스, Apache 2.0, Mac·Windows·Linux, "full offline support" | jan.ai, jan.ai/download, jan.ai/docs/desktop, raw.githubusercontent.com/janhq/jan/main/LICENSE |
| GPT4All MIT, "no cloud required" | raw.githubusercontent.com/nomic-ai/gpt4all/main/LICENSE.txt, nomic.ai/gpt4all |
| 모델 라이선스 (Qwen3.5·Gemma 4 Apache 2.0, Phi-4-mini MIT, Llama 3.2 커뮤니티 라이선스) | Hugging Face API cardData (google/gemma-4-E2B-it 등 공식 저장소) |
| Gemma 4 E2B 2.3B effective / 5.1B with embeddings | huggingface.co/google/gemma-4-E2B-it README |
| Chrome 온디바이스 모델 약 4GB | 기존 글 `turn-off-ai-in-chrome` (언론 보도 기준으로 표기) |

## 네트워크

- huggingface.co GGUF 다운로드 가능 (7개 약 17GB, 약 6분)
- github.com/ggml-org/llama.cpp/releases/latest 403 → llama.cpp 사전 빌드 대신 PyPI `llama-cpp-python` 소스 빌드(약 5분)
- ollama.com·docs.ollama.com·lmstudio.ai·jan.ai·nomic.ai 접속 가능
