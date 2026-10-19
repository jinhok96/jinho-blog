# 글별 검증 자료

글에 쓴 측정값을 다시 확인하거나 글을 갱신할 때 쓰는 재현 스크립트·결과·사실 확인표입니다. 폴더 이름은 글 slug와 같습니다. 다운로드한 모델·이미지 등 큰 파일은 커밋하지 않습니다 (스크립트 주석의 URL에서 다시 받음).

| 폴더                                                                 | 내용                                                                                       |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [transcribe-audio-offline-free](transcribe-audio-offline-free)       | 음성 인식 8개 모델 벤치마크 (sherpa-onnx 1.13.8, Earnings-21 `4387332` 통화 + 짧은 낭독 음성) |
| [check-if-image-is-ai-generated](check-if-image-is-ai-generated)     | C2PA 출처 정보 제거 테스트 스크립트, 결과, 사실 확인표                                      |
| [turn-off-ai-in-chrome](turn-off-ai-in-chrome)                       | Chromium 155 소스 기준 사실 확인표 (파일·줄 번호)                                          |
| [windows-10-esu-extended](windows-10-esu-extended)                   | Microsoft ESU 페이지·KB 문서 기준 사실 확인표 (문서 기반, 실행 검증 없음)                  |
| [free-offline-text-to-speech](free-offline-text-to-speech)           | 오프라인 TTS 11개 음성 측정 (sherpa-onnx 1.13.8: 속도·Parakeet 받아쓰기 WER·UTMOS), piper-tts CLI 실행 기록, 사실 확인표 **(글 삭제 2026-10-17: 명령줄 방법, 측정 자료만 보관)** |
| [remove-background-from-image-free-offline](remove-background-from-image-free-offline) | rembg 2.0.85 배경 제거 8개 모델 측정 (AIM-500 50장 IoU·속도·CLI 메모리), 예시 그림·그래프·웹 UI 스크린샷 스크립트, 사실 확인표 (재현 절차는 facts.md 하단) **(글 삭제 2026-10-17: 명령줄 방법, 측정 자료만 보관)** |
| [free-offline-ai-tools](free-offline-ai-tools)                       | 오프라인 챗봇 7개 모델 측정 (llama-cpp-python 0.3.36: 속도·RAM·20문항·이메일 요약), 그래프, 사실 확인표 |
| [image-to-text-offline-free](image-to-text-offline-free)             | 오프라인 OCR 4개 엔진(7개 설정) 측정: 직접 만든 50장(스크린샷·작은 글자·스캔·사진·영수증) 정확도·속도·메모리, 그래프·출력 비교 이미지, 사실 확인표 |
| [convert-pdf-to-word-offline-free](convert-pdf-to-word-offline-free) | PDF→Word 오프라인 변환 3개 도구(LibreOffice 26.8.1·pdf2docx 0.5.13·Calibre 7.6) 측정: 직접 만든 PDF 11개 문단·표·텍스트 상자·속도, 편집 테스트, OCR 후 재변환, 사실 확인표 **(글 삭제 2026-10-17: 명령줄 방법, 측정 자료만 보관)** |
| [convert-heic-to-jpg-free](convert-heic-to-jpg-free) | HEIC→JPG 오프라인 변환 3개 도구(XnConvert 1.118·ImageMagick 7.1.2·GIMP 3.2.6) 측정: 직접 만든 HEIC 24장(Display P3·GPS·날짜·세로 4장) 색 차이(ΔE2000)·메타데이터·회전·속도·메모리, 기본/설정 변경 비교, 그래프·스크린샷, 사실 확인표 (재현: `build_set.sh` → `run_tools.py` → `analyze.py` → `charts.py`) |
| [video-to-gif-high-quality-free](video-to-gif-high-quality-free) | 영상→GIF 오프라인 변환 3개 도구 7개 설정(FFmpeg 9.0.2·gifski 1.34.0·ImageMagick 7.1.2-34) 측정: 클립 3개(애니메이션·실사·화면 녹화, 75프레임) 크기·SSIM·재생 시간·속도·메모리, 폭·fps별 크기, 확대 비교 이미지, 사실 확인표 (재현: facts.md 하단) **(글 삭제 2026-10-17: 명령줄 방법, 측정 자료만 보관)** |
| [jpg-to-pdf-free-offline](jpg-to-pdf-free-offline) | JPG→PDF 오프라인 변환 5개 도구(img2pdf 0.6.3·ImageMagick 7.1.2-34·Pillow 12.3.0·LibreOffice 26.8.1·Chromium 141) 측정: 12MP 사진 24장(세로 4장 EXIF Orientation=6) PDF 크기·픽셀 동일 여부·SSIMULACRA2·세로 사진 방향·속도·메모리, LibreOffice 무손실 설정 비교, 그래프·스크린샷, 사실 확인표 (재현: `build_set.sh` → `run_tests.py` → `analyze.py` → `summarize.py` → `charts.py`) **(글 삭제 2026-10-17: 명령줄 방법, 측정 자료만 보관)** |
| [merge-pdf-files-free-offline](merge-pdf-files-free-offline) | PDF 합치기 6개 도구(qpdf 12.4.2·pdfunite 26.10·Ghostscript 10.08·pdftk-java 3.3.3·pypdf 6.21·PyMuPDF 1.28.2) 측정: 책갈피·목차 링크·W-9 양식 2부·사진 보존, Chrome 141 PDF 뷰어 입력·클릭 테스트, 사실 확인표 **(글 삭제 2026-10-17: 명령줄 방법, 측정 자료만 보관)** |
| [iphone-duo-sold-out](iphone-duo-sold-out) | 뉴스 칼럼(화제) 사실 확인표: Apple 보도자료·스토어·Apple Upgrade·반품 정책 대조, 화제성 신호(Google News 기사 수·Trends), 결제 방식별 비용 계산, 그래프 스크립트(`charts.py <출력 폴더>`), 기사 수 집계 스크립트(`news_count.py`) |
| [pixel-watch-safety-signal-ending](pixel-watch-safety-signal-ending) | 뉴스 칼럼(영향) 사실 확인표: Google 커뮤니티 공지·Pixel Watch·Google Fi·Google Health 도움말 대조(Playwright 렌더링), 후보별 기사 수, 공지 원문(`source-announcement.txt`), 그래픽 스크립트(`charts.py <출력 폴더>`) |
| [split-pdf-free](split-pdf-free) | PDF 나누기 GUI 방법 3개(PDFsam Basic 6.0.6·PDF Arranger 1.14.0·Chromium 141 인쇄 Save as PDF) 측정: 12쪽 입력(보고서 책갈피·목차 링크, W-9 양식, 사진) 텍스트·사진·책갈피·링크·양식 보존, 한 쪽씩·크기별 나누기, Chrome 뷰어 입력 테스트, GUI 캡처, 사실 확인표 (재현: 아래 절차) |
| [merge-pdf-files-free](merge-pdf-files-free) | PDF 합치기 GUI 앱 3개(PDFsam Basic 6.0.6·PDF Arranger 1.14.0·Sejda PDF Desktop 7.9.10 무료판) 측정: 보고서(책갈피·목차 링크)+W-9+사진 3파일 합치기, 순서 바꾸기(W-9 먼저), W-9 2부 양식 이름 충돌(PDFsam 양식 옵션 3개), Sejda 무료 한도(50쪽·하루 3회), Chrome 뷰어 입력 테스트, GUI 캡처, 사실 확인표 (재현: 아래 절차) |
| [jpg-to-pdf-free](jpg-to-pdf-free) | JPG→PDF GUI 방법 3개(PDF Arranger 1.14.0·Sejda PDF Desktop 7.9.10 무료판·Chromium 141 인쇄 Save as PDF) 측정: 12MP 사진 10장(세로 2장 EXIF Orientation=6) 세로 사진 방향·사진 바이트 보존·페이지 크기·파일 크기, PDF Arranger Page Size(US Letter), Sejda 페이지 옵션·하루 3회 한도, Chrome 머리글·Landscape 2쪽 넘침, GUI 캡처, 사실 확인표 (재현: 아래 절차) |
| [pdf-to-jpg-free](pdf-to-jpg-free) | PDF→JPG GUI 앱 3개(GIMP 3.2.6·LibreOffice Draw 26.8.1·Sejda PDF Desktop 7.9.10 무료판) 측정: IRS 1040(2쪽)·보고서(흰 배경 없음, 7pt 각주)·사진 3쪽, 기본값으로 저장되는 쪽·픽셀 크기·파일 크기·OCR 판독률, GIMP Layers/Images, LibreOffice 해상도 함정·해결, Sejda 해상도·하루 3회 한도, GUI 캡처, 사실 확인표 (재현: 아래 절차) |
| [pdf-to-word-free](pdf-to-word-free) | PDF→Word 무료 도구 3개(LibreOffice Writer 26.8.1 GUI·Sejda PDF Desktop 7.9.10 무료판 GUI·iLovePDF 웹) 측정: 정답을 아는 PDF 11개(`../convert-pdf-to-word-offline-free/gen.py`) 단어 보존·편집 가능한 문단·실제 Word 표·텍스트 상자·스캔 PDF OCR, 편집 테스트, LibreOffice Draw/Writer 필터 함정, Sejda 작업당 1파일·하루 3회, GUI·웹 캡처, 사실 확인표 (재현: `gen.py` → `convert_libreoffice.sh`·Sejda GUI·`ilove_one.py`·`ilove_scan.py` → `score.py` → `edit_test.py` → `charts.py`) |

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

## 영상 압축(Discord·이메일) 측정 재현

1. FFmpeg: BtbN `releases/download/latest/ffmpeg-n9.0-latest-linux64-gpl-9.0.tar.xz`를 `/tmp/cv/tools`에 풀기. HandBrake: `apt-get install flatpak` → `flatpak install HandBrake-1.11.2-x86_64.flatpak`(GitHub Releases 1.11.2, Flathub 런타임 자동 설치) → `hb.sh`를 `/tmp/cv/hb.sh`로 복사 (flatpak run은 D-Bus 없이 실패해 런타임 ld-linux로 직접 실행)
2. download.blender.org에서 `bbb_sunflower_2160p_30fps_normal.mp4.zip`·`ToS-4k-1920.mov.zip`을 `/tmp/cv/dl`에 풀고 `record_screen.sh` → `make_sources.sh`로 60초 클립 3개
3. `python3 -I run_tests.py [설정 …]` → `/tmp/cv/out/results.json` (다른 작업이 없을 때 실행해야 시간이 정확함)
4. `results.json`을 이 폴더로 복사 후 venv(matplotlib·pillow)에서 `python -I charts.py /tmp/cv <출력 폴더>` → 글 이미지 5장. HandBrake 원본 차이 확인은 `hb_psnr_check.sh`

## PDF 나누기(GUI) 측정 재현

1. venv(`/tmp/pdfs`)에 `pypdf pikepdf pymupdf playwright pillow img2pdf matplotlib` 설치. `apt-get install xdotool imagemagick flatpak`, PDFsam Basic은 `github.com/torakiki/pdfsam/releases/download/v6.0.6/pdfsam-basic_6.0.6-1_amd64.deb`를 `dpkg -i`, PDF Arranger는 `flatpak install flathub com.github.jeromerobert.pdfarranger` (시스템 D-Bus 필요: `dbus-daemon --system --fork`)
2. `/tmp/split/src/fw9.pdf`(IRS)와 `/tmp/split/photos/14.jpg`·`15.jpg`(convert-heic-to-jpg-free/sources.json의 PD12M URL)를 받은 뒤 `/tmp/pdfs/bin/python -I build_input.py` → `/tmp/split/in/packet.pdf`
3. `Xvfb :99 -screen 0 1600x1000x24` 위에서 각 앱을 화면 조작(xdotool)으로 실행: PDFsam Extract `1-4,5-10`(각 범위 별도 파일)·Split Every page·Split by size 1MB, PDF Arranger(`pa_launch.sh`, `XDG_RUNTIME_DIR` 필요) Ctrl+E로 1~4·5~10쪽·Shift+Ctrl+E로 한 쪽씩, Chromium(`chrome_launch.sh`) Ctrl+P → Save as PDF → Custom `1-4`·`5-10`·`11` (드롭다운은 클릭 후 방향키로 Custom 선택). 결과는 `run_analyze.sh`의 경로에 저장
4. `./run_analyze.sh` → `results.jsonl`, `chrome_form_shot.py`로 양식 입력 캡처, `/tmp/pdfs/bin/python -I charts.py /tmp/split <출력 폴더>` → 글 이미지 7장

## PDF 합치기(GUI) 측정 재현

1. "PDF 나누기(GUI) 측정 재현" 1단계와 같은 venv·apt·PDFsam Basic 설치 + `flatpak install flathub com.github.jeromerobert.pdfarranger com.sejda.Sejda`. Sejda(Electron)는 root에서 `--no-sandbox`가 필요 (`sejda_launch.sh --no-sandbox`)
2. `/tmp/merge/src/fw9.pdf`(IRS)·`/tmp/merge/photos/14.jpg`·`15.jpg`를 받은 뒤 `build_input.py /tmp/merge` → `/tmp/merge/parts/{report,w9,photos}.pdf`(+ 비교용 `in/packet.pdf`). 두 번째 W-9 `w9-vendor2.pdf`는 1번 칸 값만 `TEST VENDOR TWO INC`로 바꿔 같은 방식으로 만듦 (factcheck.md)
3. `Xvfb :99` 위에서 화면 조작: PDFsam Merge(Add → `addfile.sh`로 경로 입력, Run), PDF Arranger(`pa_launch.sh 파일들`, 툴바 Save As), Sejda(Merge → Choose PDF & image files → Files view에서 끌어 순서 맞춤 → Merge PDF files). PDFsam 양식 옵션은 JavaFX 드롭다운을 클릭으로 고르면 적용되지 않을 때가 있어 클릭 후 방향키 + Enter. Sejda 무료판은 하루 3회라 시험 순서를 미리 정함
4. `./run_analyze.sh` → `results.jsonl`, `chrome_shared_check.py`로 W-9 2부 입력 캡처, `/tmp/pdfs/bin/python -I charts.py /tmp/merge <출력 폴더>` → 글 이미지 8장

## JPG→PDF(GUI) 측정 재현

1. "PDF 나누기(GUI) 측정 재현" 1단계와 같은 venv(`/tmp/pdfs`)·apt(`xvfb xdotool imagemagick flatpak poppler-utils`) + `flatpak install flathub com.github.jeromerobert.pdfarranger com.sejda.Sejda`. Sejda는 `sejda_launch.sh --no-sandbox`
2. `convert-heic-to-jpg-free/sources.json`의 01~08 URL을 `/tmp/j2p/orig/NN.jpg`로 받은 뒤 `/tmp/pdfs/bin/python -I build_set.py /tmp/j2p` → `in/01~10.jpg`(09·10은 세로, EXIF Orientation=6)·`ref/*.png`
3. `Xvfb :99` 위에서 화면 조작(`shot.sh`로 캡처, 저장 대화상자는 `typepath.sh <x> <y> <경로>`로 이름 칸에 경로 입력): PDF Arranger(`pa_launch.sh /tmp/j2p/in/*.jpg` → Ctrl+Shift+S, Page Size는 Ctrl+A 후 S → Fit to paper·US Letter), Sejda(All Tools > JPG to PDF > Choose image files, 기본값·Letter+Small margin·Fit to image 3회, 4번째는 한도 화면), Chromium(`chrome_launch.sh file:///tmp/j2p/in/09.jpg` → Ctrl+P → Save, 01은 기본·Landscape·Margins None+Scale 90). 저장 경로는 `/tmp/j2p/out/*.pdf`
4. `/tmp/pdfs/bin/python -I analyze.py /tmp/j2p /tmp/j2p/out/*.pdf > results.jsonl`, `sejda_portrait_diff.py`, `/tmp/pdfs/bin/python -I charts.py /tmp/j2p <출력 폴더>` → 글 이미지 8장

## PDF→JPG(GUI) 측정 재현

1. apt(`xvfb xdotool imagemagick flatpak poppler-utils tesseract-ocr img2pdf`), venv(`/tmp/pdfs`)에 `matplotlib pillow`. GIMP는 `download.gimp.org/gimp/v3.2/linux/GIMP-3.2.6-x86_64.AppImage`를 `--appimage-extract`(`gimp_launch.sh`), LibreOffice는 `download.documentfoundation.org/libreoffice/stable/26.8.1/deb/x86_64/LibreOffice_26.8.1_Linux_x86-64_deb.tar.gz`의 deb를 `dpkg -i`(`/opt/libreoffice26.8`), Sejda는 `flatpak install flathub com.sejda.Sejda`(`sejda_launch.sh --no-sandbox`, 시스템 D-Bus 필요)
2. `./build_inputs.sh` → `/tmp/p2j/in/{irs-1040,mixed,photos}.pdf`, 기준 렌더 `/tmp/p2j/ref/*.png`
3. `Xvfb :99 -screen 0 1600x1000x24` 위에서 화면 조작(`shot.sh`로 캡처). 저장·열기 대화상자는 `dlgtype.sh "<창 이름>" <x> <y> <경로>`로 그 창에 포커스를 준 뒤 입력 (포커스 없이 입력하면 GIMP 본 창 단축키로 들어감). GIMP: 열기 → Open → Shift+Ctrl+E → `out/gimp/*.jpg` → Export, Images 모드는 드롭다운에서 선택. LibreOffice: File > Export → JPG Options(기본 / Modify resolution 300 / 300 입력 후 Modify dimensions 8.5), LibreOffice 대화상자에는 `xdotool key --window`가 안 먹어 포커스 후 일반 입력. Sejda: All Tools > PDF to JPG > Choose PDF files(대화상자 Ctrl+L로 경로) → 해상도 → Convert → Select output folder(Ctrl+L) → Continue. 하루 3회라 순서를 미리 정함
4. `python3 -I analyze.py /tmp/p2j > results.jsonl`, `/tmp/pdfs/bin/python -I charts.py /tmp/p2j <출력 폴더>` → 글 이미지 9장
5. 주의: `pkill -f`·`pgrep -f`로 앱을 끄면 Bash 호출 자체가 걸려 끊김(exit 144) → `pgrep -x soffice.bin`·`flatpak kill`
