# 사실 확인표 — free-offline-text-to-speech

확인일: 2026-10-12 (컨테이너에서 curl로 원문 확인)

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| Kokoro v1.0: 8200만 파라미터, Apache 라이선스, 2025-01-27 공개, 8개 언어·54개 음성 | huggingface.co/hexgrad/Kokoro-82M README | raw README |
| "kokoro"가 루트 도메인에 들어간 사이트는 모델 저자와 무관 (사기 의심 사이트 경고) | 같은 README의 CAUTION | raw README |
| Piper 개발은 OHF-Voice/piper1-gpl로 이전, `pip install piper-tts`, `python3 -m piper.download_voices`, `python3 -m piper -m … -f …` | github.com/rhasspy/piper README ("Development has moved"), OHF-Voice/piper1-gpl README·docs/CLI.md | raw README, 컨테이너에서 직접 설치·실행 (`piper_cli.log`) |
| Piper 음성마다 데이터셋 라이선스가 다름 (ryan: CC BY-NC-SA 4.0, lessac: Blizzard 2013 라이선스, amy: mimic3-voices) | huggingface.co/rhasspy/piper-voices `MODEL_CARD` | raw MODEL_CARD |
| KittenTTS: Apache 2.0, nano 15M(int8 25MB), mini 80M | github.com/KittenML/KittenTTS README | raw README |
| Supertonic 저장소 보관(archived), 지원 종료, 약 9900만 파라미터, 31개 언어 | github.com/supertone-inc/supertonic README | raw README |
| sherpa-onnx 1.13.8 Android TTS 엔진 APK에 테스트한 11개 모델이 모두 있음 | k2-fsa.github.io/sherpa/onnx/tts/apk-engine.html | 페이지의 APK 파일명 목록 |
| 브라우저에서 모델을 바로 들어볼 수 있는 Hugging Face Space (k2-fsa/text-to-speech) | 같은 페이지 | 페이지 본문 |
| Windows용 sherpa-onnx TTS 앱(Flutter)은 Piper·coqui VITS 모델만 (최신 1.12.23) | k2-fsa.github.io/sherpa/onnx/flutter/tts-win.html | 파일명 목록 (Kokoro·Kitten 없음) |
| Android: Settings > Accessibility > Text-to-speech output에서 엔진 선택 | support.google.com/accessibility/android/answer/6006983 | 페이지 본문 |
| Windows 내레이터 자연 음성: 기기 내 TTS, 한 번 받으면 인터넷 없이 동작. 미국 영어 Guy·Jenny·Aria. Ctrl+Win+N → Add natural voices | support.microsoft.com Narrator Appendix J, Appendix A | 페이지 본문 |
| Mac: System Settings > Accessibility > Read & Speak > System voice, 음성은 Apple에서 다운로드(인터넷 필요) | support.apple.com/guide/mac-help/mchlp2290/mac (macOS 27) | 페이지 본문 |

## 측정 (직접 실행)

- 엔진: sherpa-onnx 1.13.8 (Python), Linux, Intel Xeon 2.8GHz 4코어, GPU 없음
- 문장: Harvard 문장 30개(목록 1~3) + 숫자·날짜·약어가 들어간 문장 10개 (`sentences.py`)
- 속도: `run_timing.sh` — 4스레드 3회 중앙값, 1스레드 1회 (`summary.json`)
- 명료도: Parakeet TDT 0.6B v2(int8)로 받아써서 WER (`asr_eval.py`), 숫자 문장은 Whisper small.en으로 교차 확인 (`asr_crosscheck.py`)
- 자연스러움 예측: UTMOS22 strong (SpeechMOS v1.2.0) — 사람 청취 평가 아님 (`mos.py`)
- 결과: `summary.json`, `transcripts.json`
