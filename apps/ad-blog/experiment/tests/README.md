# 글별 검증 자료

글에 쓴 측정값을 다시 확인하거나 글을 갱신할 때 쓰는 재현 스크립트·결과·사실 확인표입니다. 폴더 이름은 글 slug와 같습니다. 다운로드한 모델·이미지 등 큰 파일은 커밋하지 않습니다 (스크립트 주석의 URL에서 다시 받음).

| 폴더                                                                 | 내용                                                                                       |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [transcribe-audio-offline-free](transcribe-audio-offline-free)       | 음성 인식 8개 모델 벤치마크 (sherpa-onnx 1.13.8, Earnings-21 `4387332` 통화 + 짧은 낭독 음성) |
| [check-if-image-is-ai-generated](check-if-image-is-ai-generated)     | C2PA 출처 정보 제거 테스트 스크립트, 결과, 사실 확인표                                      |
| [turn-off-ai-in-chrome](turn-off-ai-in-chrome)                       | Chromium 155 소스 기준 사실 확인표 (파일·줄 번호)                                          |
| [windows-10-esu-extended](windows-10-esu-extended)                   | Microsoft ESU 페이지·KB 문서 기준 사실 확인표 (문서 기반, 실행 검증 없음)                  |
| [free-offline-text-to-speech](free-offline-text-to-speech)           | 오프라인 TTS 11개 음성 측정 (sherpa-onnx 1.13.8: 속도·Parakeet 받아쓰기 WER·UTMOS), piper-tts CLI 실행 기록, 사실 확인표 |
| [remove-background-from-image-free-offline](remove-background-from-image-free-offline) | rembg 2.0.85 배경 제거 8개 모델 측정 (AIM-500 50장 IoU·속도·CLI 메모리), 예시 그림·그래프·웹 UI 스크린샷 스크립트, 사실 확인표 (재현 절차는 facts.md 하단) |
| [free-offline-ai-tools](free-offline-ai-tools)                       | 오프라인 챗봇 7개 모델 측정 (llama-cpp-python 0.3.36: 속도·RAM·20문항·이메일 요약), 그래프, 사실 확인표 |
| [image-to-text-offline-free](image-to-text-offline-free)             | 오프라인 OCR 4개 엔진(7개 설정) 측정: 직접 만든 50장(스크린샷·작은 글자·스캔·사진·영수증) 정확도·속도·메모리, 그래프·출력 비교 이미지, 사실 확인표 |
| [convert-pdf-to-word-offline-free](convert-pdf-to-word-offline-free) | PDF→Word 오프라인 변환 3개 도구(LibreOffice 26.8.1·pdf2docx 0.5.13·Calibre 7.6) 측정: 직접 만든 PDF 11개 문단·표·텍스트 상자·속도, 편집 테스트, OCR 후 재변환, 사실 확인표 |
| [convert-heic-to-jpg-free](convert-heic-to-jpg-free) | HEIC→JPG 오프라인 변환 3개 도구(XnConvert 1.118·ImageMagick 7.1.2·GIMP 3.2.6) 측정: 직접 만든 HEIC 24장(Display P3·GPS·날짜·세로 4장) 색 차이(ΔE2000)·메타데이터·회전·속도·메모리, 기본/설정 변경 비교, 그래프·스크린샷, 사실 확인표 (재현: `build_set.sh` → `run_tools.py` → `analyze.py` → `charts.py`) |

## 받아쓰기 벤치마크 재현

1. `python3 -m venv venv && ./venv/bin/pip install sherpa-onnx soundfile jiwer whisper-normalizer numpy av`
2. 모델: `https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/{이름}.tar.bz2`를 `models/`에 풀기 (`bench.py`의 `MODELS` 참고) + `silero_vad.onnx`
3. 음성: `revdotcom/speech-datasets`의 `earnings21` (sparse checkout) → `prep.py`로 16 kHz WAV·정답 대본 생성 → `segment.py`로 VAD 구간 생성. 짧은 낭독 음성은 `clean_set.py`
4. `run_all.sh <작업 폴더>` → `results/summary.jsonl`
5. 속도는 다른 작업이 없는 상태에서 측정 (`results-timing-rerun.jsonl`이 글에 쓴 속도)

## C2PA 테스트 재현

`run_all.sh` 상단의 설치 안내대로 c2pa-python·c2patool·테스트 이미지를 받은 뒤 `W=<작업 폴더> ./run_all.sh`. `edit_manifest.json`의 `WORKDIR`는 작업 폴더 경로로 바꿉니다. 서명에는 c2patool에 포함된 **테스트 인증서**만 사용합니다.

## 오프라인 TTS 측정 재현

1. `python3 -m venv venv && ./venv/bin/pip install sherpa-onnx soundfile jiwer whisper-normalizer numpy`
2. 모델: `synth.py` 상단 주석의 URL에서 11개 음성 + `asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8`, `sherpa-onnx-whisper-small.en`을 `models/`에 풀기
3. `synth.py <모델> models out 4`로 음성 생성 → `asr_eval.py`, `asr_crosscheck.py`로 명료도
4. UTMOS: 별도 venv에 torch(CPU, download.pytorch.org)·soundfile 설치, SpeechMOS v1.2.0 코드는 raw.githubusercontent.com에서 받음 (torch.hub는 api.github.com 403으로 실패) → `mos.py`
5. 속도: 다른 작업이 없는 상태에서 `run_timing.sh` → `summarize.py`로 `summary.json`

## 오프라인 OCR 측정 재현

1. `bench.py` 상단 설치 안내대로 venv(Tesseract·RapidOCR)·venv2(EasyOCR·docTR) 준비, Gutenberg 텍스트 3권(`gen.py` 상단 URL)을 `src/`에 받기
2. `python gen.py src imgs` → 50장 + `truth.json`
3. `./run_all.sh <작업 폴더>` (엔진을 하나씩 실행, 다른 작업이 없을 때) → `results/*.jsonl`·`*.time`
4. `python score.py imgs results` → `summary.json`, `python charts.py <작업 폴더>` → 글 이미지 5장

## PDF→Word 변환 측정 재현

1. venv에 `pdf2docx python-docx reportlab pymupdf matplotlib lxml ocrmypdf` 설치, `apt-get install calibre tesseract-ocr ghostscript`, LibreOffice 최신판은 `download.documentfoundation.org`의 deb tar.gz를 `dpkg -x`로 풀어 사용 (시스템 LibreOffice 24.2는 09·10 PDF 생성과 렌더링용)
2. Gutenberg 텍스트 3권(`gen.py` 상단 URL)을 받아 `python gen.py <텍스트 폴더> pdfs /usr/bin/soffice` → PDF 11개 + `truth.json`
3. `bash bench.sh pdfs out <LibreOffice 26.8 soffice> <venv>/bin/pdf2docx` → `python score.py pdfs out` → `summary.json`
4. 렌더링: 각 `out/{도구}/*.docx`를 시스템 LibreOffice 24.2로 `render/{도구}/`에 PDF 저장 (26.8 압축 해제본은 글꼴 대체가 달라 쓰지 않음). `python edit_test.py out edited` 후 같은 방식으로 렌더링, `pdftoppm -r 60`으로 `edited/{도구}-1.png`
5. `python charts.py <작업 폴더> <출력 폴더>` → 글 이미지 5장. OCR: `ocr_test.py` 상단 명령 실행 후 `python ocr_test.py <작업 폴더>`
