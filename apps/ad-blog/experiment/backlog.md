# 주제 백로그

후보 주제와 선정 근거를 기록합니다. 기준은 [README.md](README.md)의 "주제 선정 기준". 발행하면 상태를 `발행`으로 바꾸고 slug를 적습니다. 날짜·기능 정보는 조사 시점 기준이므로 **글을 쓰기 전에 1차 출처를 다시 확인**합니다.

- 조사일: 2026-10-11 (WebSearch 미국 결과, 공식 문서 위주. help.openai.com·support.google.com·apple.com·microsoft.com은 WebFetch로 열리지 않아 검색 발췌로만 확인 → 발행 전 재확인 필요)
- **제외 기준**: 비개발자가 쓸 수 있는 방법(OS 내장 기능·설정 메뉴·무료 GUI 앱·웹 서비스)으로 끝나지 않는 주제는 점수와 상관없이 제외 (README 주제 선정 기준 0번, 2026-10-17 사용자 결정)
- 직접 검증: 독자가 쓸 방법(GUI 앱·웹 화면·설정 메뉴)을 컨테이너에서 실행·확인할 수 있는지. GUI 앱은 Xvfb+xdotool로 조작·캡처 가능 (세션 9). 명령줄 도구만 실행할 수 있으면 직접 검증으로 치지 않음. 받을 수 있는 앱 범위는 README 인프라 상태 참고
- 점수: 2×최신성 + 2×문제 구체성 + 2×직접 검증 + 2×광고 가치 + 경쟁 공백 + 수명 + AI 요약 내성 (최대 55)
- 뉴스 칼럼 후보는 README "[뉴스 칼럼 선정 기준](README.md#뉴스-칼럼-선정-기준)"으로 고르고 아래 [뉴스 칼럼 후보](#뉴스-칼럼-후보) 표에 따로 기록 (2026-10-17)

| 순위 | 주제                                                                                       | 핵심 키워드                                 | 점수 | 직접 검증                 | 수명                  | 상태                                                            |
| ---- | ------------------------------------------------------------------------------------------ | ------------------------------------------- | ---- | ------------------------- | --------------------- | --------------------------------------------------------------- |
| 1    | 커스텀 GPT·Gemini Gems 종료 → 포터블 Skill로 옮기기                                        | custom gpt retirement what to do            | 46   | 일부 (SKILL.md 검증 도구) | ~2027 중반, 이후 상시 | 보류 (도메인 연결 전이라 마감형 효과 낮음)                      |
| 2    | AI 생성 이미지 판별 (SynthID Detector·C2PA) + 출처 정보 제거 테스트                        | how to check if an image is ai generated    | 44   | PDF → JPG 무료 (GUI 앱: GIMP·LibreOffice Draw·Sejda Desktop, 기본값 함정·해상도)   | pdf to jpg                                  | -    | 예 (GUI 3개, PDF 3개)     | 상시                  | 발행 `pdf-to-jpg-free` (2026-10-19 세션 25, GIMP 3.2.6·LibreOffice Draw 26.8.1·Sejda Desktop 7.9.10 무료판을 GUI로 측정, Mac Preview는 문서 기반). 이전 명령줄 글 `pdf-to-jpg-high-quality`는 2026-10-17 삭제. Trends `pdf to jpg` 12.9 (기준 `remove background` 35.2) |
| 3    | 무료 오프라인 받아쓰기 모델 정확도·속도 비교 (ChatGPT 오디오 업로드 유료)                  | transcribe audio to text free offline       | 44   | 예 (전부 오프라인)        | 상시                  | 발행 `transcribe-audio-offline-free`                            |
| 4    | Chrome AI 기능 끄기 + 온디바이스 모델(약 4GB) 삭제, 정책 확인                              | turn off ai in chrome                       | 41   | 일부 (Chromium 소스)      | 12개월+               | 발행 `turn-off-ai-in-chrome`                                    |
| 5    | ChatGPT Finances 무료 확대: 은행 연결 안전한가                                             | chatgpt finances safe                       | 38   | 조사만                    | 12개월+               | 후보 (Free/Go 확대 공식 근거 1건뿐) → 뉴스 칼럼 후보로 이동              |
| 6    | "내 Copilot 어디 갔지?" 2026년 9월 Copilot 통합 설명                                       | what happened to my copilot                 | 38   | 조사만                    | 6~12개월              | 후보 → 뉴스 칼럼 후보로 이동                                             |
| 7    | Gemini Gems → Skills 전환: 날짜, 옮겨지지 않는 것, 백업                                    | gemini gems to skills                       | 37   | 일부 (SKILL.md 변환 검사) | ~2027-06              | 발행 `gemini-gems-to-skills` (2026-10-14)                       |
| 8    | 커스텀 GPT 2026-12-11 종료 체크리스트                                                      | custom gpts retiring                        | 37   | 조사만                    | ~2027-02              | 후보 (1번과 묶음)                                               |
| 9    | Windows 10 ESU가 2027-10-12까지 연장됨 + 등록 오류 해결                                    | windows 10 esu october 2026                 | 37   | 조사만                    | ~2027-10              | 발행 `windows-10-esu-extended`                                  |
| 10   | 이미지 배경 무료 제거 → remove.bg 종료(2026-12-01) 대안 웹 도구 측정                         | remove.bg alternative free                  | 37   | 예 (웹 4개, AIM-500 20장)  | 상시                  | 발행 `remove-bg-alternative-free` (2026-10-21 세션 33, remove.bg·iLoveIMG·removal.ai·Pixlr(3장, 일일 한도)를 Chromium으로 측정, Mac·iPhone·Paint 내장 기능은 문서 기반). 이전 명령줄 글 `remove-background-from-image-free-offline`은 2026-10-17 삭제. Trends `remove background` 40.0 · `background remover` 21.2 · `remove bg` 14.4 |
| 11   | Gemini Windows 앱 Alt+Space 단축키 충돌 해결                                               | gemini windows app alt space                | 36   | 조사만                    | 6~12개월              | 후보                                                            |
| 12   | iOS 27 Siri AI가 안 보일 때 (대기자 명단·요구 조건·Siri Classic)                           | siri ai not showing ios 27                  | 36   | 조사만                    | 3~9개월               | 후보 (경쟁 심함 → 세부 각도 필요: 국가·언어·기기별 요구 조건 표 등) |
| 13   | ChatGPT for Word 추가 기능: 기능·개인정보·제거 방법                                        | chatgpt for word                            | 36   | 조사만                    | 6~12개월              | 후보                                                            |
| 14   | Windows 11 26H2 AI 기능 끄기                                                               | windows 11 26h2 turn off ai                 | 36   | 조사만                    | ~12개월               | 후보 (경쟁 심함 → 세부 각도 필요: AI 기능별 레지스트리·정책 값 확인 등) |
| 15   | 무료 오프라인 TTS: Piper vs Kokoro 측정                                                    | free text to speech offline                 | 36   | 예                        | 상시                  | 삭제 `free-offline-text-to-speech` (2026-10-17 명령줄 방법 → GUI 앱·내장 기능으로 새로 쓸 후보)                              |
| 16   | Meta Muse 개인정보: 볼 수 있는 데이터·옵트아웃                                             | meta muse privacy                           | 35   | 조사만                    | 6~12개월              | 후보 → 뉴스 칼럼 후보로 이동                                             |
| 17   | 공식 ChatGPT 브라우저 확장 vs 유사 확장 권한                                               | chatgpt chrome extension official           | 35   | 대부분 조사만             | 6~12개월              | 후보                                                            |
| 18   | AI 챗봇 학습 데이터 사용 끄기 (ChatGPT·Gemini·Claude·Copilot 등)                           | stop ai from training on my data            | 32   | 조사만                    | 상시 (분기 갱신)      | 후보                                                            |
| 19   | Ollama 0.40 변경 사항                                                                      | ollama 0.40                                 | 32   | 일부                      | 2~4개월               | 제외 (개발자 대상, 2026-10-17 기준 0번)                         |
| 20   | ChatGPT GPT-6: Sol·Luna·Astra와 요금제별 제공                                              | gpt-6 free                                  | 30   | 조사만                    | 2~4개월               | 후보 (수요 최대, 경쟁·AI 요약 위험 최대) → 뉴스 칼럼 후보로 이동         |
| 21   | AI 구독 비교 (2026년 10월)                                                                 | chatgpt plus vs google ai pro vs claude pro | 30   | 조사만                    | 월간 갱신 시 상시     | 후보                                                            |
| 22   | ChatGPT 광고 개인화 끄기·Ads-Free                                                          | turn off ads chatgpt                        | 28   | 조사만                    | 6~12개월              | 후보 → 뉴스 칼럼 후보로 이동                                             |
| 23   | Google Assistant → Gemini 전환 후 잃는 기능                                                | gemini replaced google assistant            | 27   | 조사만                    | ~6개월                | 후보                                                            |
| 24   | ChatGPT "Intelligent UI" 끄기 (Simple 레이아웃)                                            | chatgpt intelligent ui turn off             | 27   | 조사만                    | 2~4개월               | 20번의 한 섹션으로                                              |
| 25   | Google Drive·Docs에서 Markdown(.md) 파일 열기·편집 (2026-10-05 Workspace 발표)             | markdown google docs                        | -    | 조사만                    | 6~12개월              | 후보 (2026-10-12 추가, 자동완성 17개: enable·import·code block) |
| 26   | GPT-6·Intelligent UI 전체 제공 (OpenAI 2026-10-07 "GPT-6 and Intelligent UI for everyone") | gpt-6 free                                  | -    | 조사만                    | 2~4개월               | 20·24번과 묶어 재평가 (help.openai.com 403) → 뉴스 칼럼 후보로 이동      |
| 27   | SynthID 전 세계 확대 (Google 2026-10-07) → `check-if-image-is-ai-generated` 갱신           | synthid detector                            | -    | 일부                      | 상시                  | 기존 글 갱신 후보 (새 글 아님)                                  |
| 28   | 허브: 무료 오프라인 AI 도구 (받아쓰기·TTS·배경 제거 측정 글 3편 연결)                       | free offline ai tools                       | -    | 예 (기존 측정 재사용)     | 상시                  | 발행 `free-offline-ai-tools` (2026-10-14, 오프라인 챗봇 7개 측정 추가) |
| 29   | 2026년 10월 Windows 10 ESU 업데이트(10-13 Patch Tuesday) KB·설치 오류                     | windows 10 october 2026 update              | -    | 조사만                    | ~1개월                | 보류 (KB5126657·19045.7807 확인, KB·오류 자동완성 없음 → ESU 글 빌드 표만 갱신 2026-10-14. 11월 업데이트 때 재확인) |
| 30   | Gemini 4 Argon (2026-10-13 출시): 무료 사용 범위·요금                                      | gemini 4 argon free                         | -    | 조사만                    | 2~4개월               | 보류 (자동완성 16개, 경쟁·AI 요약 위험 큼, 직접 검증 불가) → 뉴스 칼럼 후보로 이동 |
| 31   | 패스키 설정 (Google 계정·iPhone·Windows 11)                                                | how to set up passkey                       | -    | 일부 (Chromium 가상 인증기) | 상시                  | 후보 (2026-10-14 추가, 자동완성 27개 Google·Bing·YouTube. Google·Apple 공식 문서 경쟁 강함) |
| 32   | 허브 확장용: 무료 오프라인 번역·OCR 측정                                                   | image to text (OCR) / offline translator    | -    | 예                        | 상시                  | OCR 발행 `image-to-text-offline-free` (2026-10-15, 허브에 섹션 추가). 번역은 Trends `offline translator` 0.0(기준 `remove background` 35.5)으로 보류 |
| 33   | PDF → Word 무료 (GUI 앱·웹: LibreOffice Writer·Sejda Desktop·iLovePDF, 표·문단·OCR)          | pdf to word free                            | -    | 예 (GUI 2개 + 웹 1개, PDF 11개) | 상시                  | 발행 `pdf-to-word-free` (2026-10-20 세션 27, LibreOffice Writer 26.8.1·Sejda Desktop 7.9.10 무료판(3개)·iLovePDF 웹을 측정, Word·Google Docs는 문서 기반). 이전 명령줄 글 `convert-pdf-to-word-offline-free`는 2026-10-17 삭제. Trends `pdf to word` 23.4 (기준 `remove background` 35.3) |
| 34   | HEIC → JPG 변환 (Windows·Mac 내장 + 오프라인 도구 측정)                                    | heic to jpg                                 | -    | 예 (XnConvert·ImageMagick·GIMP) | 상시                  | 발행 `convert-heic-to-jpg-free` (2026-10-16, 2026-10-17 ImageMagick 내용 삭제 → XnConvert·GIMP 2개). Trends 8.8 (기준 `remove background` 35.7). Windows·Mac 내장 방법은 문서 기반 |
| 35   | Windows 11 새 Photos 앱 (2026-10-15 Insider 배포: Gallery·Editor·HEIC 편집)               | windows 11 new photos app                   | -    | 조사만                    | 6~12개월              | 보류 (Insider 단계, 직접 검증 불가. 일반 배포 시 재검토) → 뉴스 칼럼 후보로 이동 |
| 36   | PDF 압축 무료 (웹·GUI 앱: iLovePDF·PDF24·Sejda Desktop, 해상도·OCR 판독률) | compress pdf                                | -    | 예 (웹 2개 + GUI 1개, PDF 4개) | 상시                  | 발행 `compress-pdf-free` (2026-10-20 세션 29, iLovePDF 3단계·PDF24 기본값/100 DPI·Sejda Desktop 무료판(3개) 측정, Mac Preview는 문서 기반). 이전 명령줄 글 `compress-pdf-offline-free`는 2026-10-17 삭제 |
| 37   | MP4 → MP3 오프라인 변환                                                                    | mp4 to mp3                                  | -    | 예                        | 상시                  | 보류 (Trends 8.7로 수요 큼, 도구 간 차이가 작아 측정 차별점 약함. 2026-10-16) |
| 38   | 영상 → GIF 고화질 변환 (FFmpeg 팔레트·gifski·ImageMagick 측정)                            | video to gif                                | -    | 예 (설정 7개)             | 상시                  | 삭제 `video-to-gif-high-quality-free` (2026-10-17 명령줄 방법 → GUI 앱·내장 기능으로 새로 쓸 후보) (2026-10-16). Trends `video to gif` 7.1 (기준 `remove background` 35.0) |
| 39   | 영상 압축 무료 오프라인 (HandBrake·FFmpeg 측정, 디스코드·이메일 용량)                       | compress video for discord                  | -    | 예 (설정 14개)            | 상시                  | 발행 `compress-video-for-discord-email` (2026-10-16, 2026-10-17 FFmpeg 내용 삭제 → HandBrake 설정 7개). Discord 무료 20MB(2026-08 변경)·Gmail 25MB 공식 문서 확인 |
| 40   | 이미지 목표 용량 압축 (100KB·200KB·1MB, 크기 조정 + JPEG 품질 측정)                        | compress image to 100kb                     | -    | 예 (1,900건)              | 상시                  | 발행 `compress-image-to-100kb` (2026-10-16, 2026-10-17 명령줄 섹션·jpegoptim·cwebp 비교 삭제). Trends 429로 미비교, 자동완성 "compress image" 30개·"reduce image size" 30개 |
| 41   | AI 이미지 업스케일 무료 오프라인 (GUI 앱 CPU 측정)                                          | upscale image ai free                       | -    | 확인 필요 (GUI 앱)        | 상시                  | 후보 (2026-10-16, 자동완성 32개 3곳: ai·free. Trends 1.4 기준 `remove background` 35.0). Real-ESRGAN 명령은 쓸 수 없음 → GUI 앱으로 측정할 수 있을 때만 (2026-10-17) |
| 42   | WebP → JPG 변환 (Windows·Mac 내장 + 오프라인 도구)                                        | webp to jpg                                 | -    | 예                        | 상시                  | 발행 `convert-webp-to-jpg-free` (2026-10-22 세션 35, XnConvert 1.118.0·GIMP 3.2.6·ezgif·CloudConvert·iLoveIMG 기본 설정 측정: WebP 10개(사진 6·투명 3·애니메이션 1). Trends 1개월 2.4·`webp to png` 4.3, 기준 `remove background` 40.3) |
| 43   | JPG → PDF 무료 (GUI 앱·Chrome, 세로 사진 방향·사진 보존·페이지 크기)                      | jpg to pdf                                  | -    | 예 (GUI 3개, 10장)        | 상시                  | 발행 `jpg-to-pdf-free` (2026-10-18 세션 23, PDF Arranger·Sejda Desktop 무료판·Chrome 인쇄를 GUI로 측정, Mac Finder는 문서 기반). 이전 명령줄 글 `jpg-to-pdf-free-offline`은 2026-10-17 삭제. Trends `jpg to pdf` 13.1 · `pdf to jpg` 13.0 · `image to pdf` 7.9 (기준 `remove background` 35.3) |
| 44   | PDF → JPG 고화질 변환 (pdftoppm·PyMuPDF·Ghostscript·ImageMagick·LibreOffice 측정, DPI)   | pdf to jpg                                  | -    | 예 (PDF 3개, 설정 25개)   | 상시                  | 삭제 `pdf-to-jpg-high-quality` (2026-10-17 명령줄 방법 → GUI 앱·내장 기능으로 새로 쓸 후보) (2026-10-16). Trends 429로 미비교, 자동완성 30개(high quality·high resolution). 2026-10-18 Trends `pdf to jpg` 13.0 (`jpg to pdf` 13.1과 같은 수준) → PDF GUI 시리즈 다음 후보 |
| 45   | PDF 합치기 무료 (GUI 앱, 책갈피·링크·양식 보존)                                             | merge pdf files free                        | -    | 예 (GUI 3개)              | 상시                  | 발행 `merge-pdf-files-free` (2026-10-18 세션 21, PDFsam Basic·PDF Arranger·Sejda Desktop 무료판을 GUI로 측정, Mac 미리보기는 문서 기반). 이전 명령줄 글 `merge-pdf-files-free-offline`은 2026-10-17 삭제. Trends `merge pdf` 6.3 · `combine pdf` 6.4 · `split pdf` 6.0 (기준 `remove background` 35.5) |
| 46   | PDF 나누기·페이지 추출 무료 오프라인 (OS 내장 기능·GUI 앱, 책갈피·양식 유지)                | split pdf free                              | -    | 예 (GUI 3개)              | 상시                  | 발행 `split-pdf-free` (2026-10-17 세션 19, PDFsam Basic·PDF Arranger·Chrome 인쇄를 GUI로 측정, Mac 미리보기는 문서 기반). Trends `split pdf` 22.6 · `merge pdf` 23.5 (3개월 평균, 미국) |
| 47   | 허브: 무료 PDF 도구 (나누기·합치기·JPG→PDF·PDF→JPG·PDF→Word·압축 측정 글 6편 연결)              | free pdf tools                              | -    | 예 (기존 측정 재사용)     | 상시                  | 발행 `best-free-pdf-tools` (2026-10-21 세션 31, 자동완성 23개 3곳, Trends 0.7 기준 `remove background` 35.9). 새 PDF 측정 글이 생기면 갱신 |
| 48   | 사진 메타데이터·위치 정보 지우기 무료 (데스크톱 앱·웹·OS 내장, 남는 항목·세로 사진 방향·업로드 여부 측정) | remove metadata from photo | -    | 예 (앱 2·웹 4)            | 상시                  | 발행 `remove-metadata-from-photos` (2026-10-22 세션 37). 자동완성 21개(android·iphone·free·online) + `remove location from photo` 20개, Trends `photo location` 3.4 · `remove metadata` 0.4 (기준 `remove background` 35.4). 후속: Metadata2Go·HEIC·PNG 측정, Windows 11 내장 기능 공식 문서 |

## 뉴스 칼럼 후보

README [뉴스 칼럼 선정 기준](README.md#뉴스-칼럼-선정-기준)으로 고른 후보입니다. 발행하면 상태를 `발행`으로 바꾸고 slug를 적습니다.

- 유형: 화제(06시 세션, 최근 48시간 발표) / 영향(18시 세션, 영향이 몇 주~몇 달 지속)
- 아래 행은 2026-10-17 기존 후보 표에서 옮김. 유형은 원래 행의 수명·발표일로 잠정 분류, 날짜·출처는 원래 행에 적힌 것만 옮김 → 재평가 때 1차 출처로 채움

| 주제 | 유형 | 발표일 | 영향 기간(시행일·마감일) | 1차 출처 | 상태 |
| --- | --- | --- | --- | --- | --- |
| ChatGPT Finances 무료 확대: 은행 연결 안전한가 (기존 5번) | 영향 | 미확인 | 미확인 (기존 수명 12개월+) | 미기록 (Free/Go 확대 공식 근거 1건뿐) | 재평가 필요(최신성 확인) |
| "내 Copilot 어디 갔지?" 2026년 9월 Copilot 통합 (기존 6번) | 영향 | 2026-09 (일자 미확인) | 미확인 (기존 수명 6~12개월) | 미기록 | 재평가 필요(최신성 확인) |
| Meta Muse 개인정보: 볼 수 있는 데이터·옵트아웃 (기존 16번) | 영향 | 미확인 | 미확인 (기존 수명 6~12개월) | 미기록 | 재평가 필요(최신성 확인) |
| ChatGPT GPT-6 요금제별 제공(Sol·Luna·Astra)·Intelligent UI 전체 제공 (기존 20·26번, 24번은 한 섹션) | 영향 | 2026-10-07 (OpenAI "GPT-6 and Intelligent UI for everyone") | 미확인 (기존 수명 2~4개월) | help.openai.com/en/articles/20001354, 20001598, 6825453 (릴리스 노트, help.openai.com 403). Free/Go 모델명 문서 충돌 (아래 미확인·충돌 정보) | 재평가 필요(최신성 확인) |
| ChatGPT 광고 개인화 끄기·Ads-Free (기존 22번) | 영향 | 미확인 | 미확인 (기존 수명 6~12개월) | 미기록 | 재평가 필요(최신성 확인) |
| Gemini 4 Argon: 무료 사용 범위·요금 (기존 30번) | 화제 | 2026-10-13 (출시) | 미확인 (기존 수명 2~4개월) | 미기록 | 재평가 필요(최신성 확인) |
| Windows 11 새 Photos 앱: Gallery·Editor·HEIC 편집 (기존 35번) | 영향 | 2026-10-15 (Insider 배포) | 일반 배포일 미확인 (기존 수명 6~12개월) | 미기록 | 재평가 필요(최신성 확인) |
| iPhone Duo 사전 주문 매진·배송 1월 말 지연: 결제 방식별 비용(일시불·ACMI·Apple Upgrade 리스) | 화제 | 2026-10-16 (사전 주문·매진), 2026-09-09 발표 | 신규 주문 배송 2027-01 말(보도), 10-23 출시·10-30 28개국 | apple.com/newsroom (09-09·10-15), apple.com/shop/apple-upgrade, apple.com/shop/help/viewing_changing_orders | 발행 `iphone-duo-sold-out` (2026-10-17) |
| Windows 11 10월 업데이트(2026-10-15 "Everyday experiences, reimagined") | 화제 | 2026-10-15 | 미확인 | blogs.windows.com/windowsexperience/2026/10/15/ | 후보 (Google News 48시간 54건, Trends `windows 11 update` 0.0 → 화제성 낮음, 2026-10-17) |
| Google Universal Cart (Search·Chrome 쇼핑 카트) | 화제 | 2026-10-15 | 미확인 | blog.google/products-and-platforms/products/shopping/universal-cart-launch/ | 후보 (기사 49건, Trends 0.0, 2026-10-17) |
| Pixel Watch 2·3 LTE Safety Signal 종료: 휴대폰 없이 긴급 SOS·낙상 감지 끊김, 회선 추가·Fi 무료 워치 회선 | 영향 | 2026-10-08 (커뮤니티 공지) | 2026-12-12 종료, 이메일 후 30일 전환 | support.google.com/googlepixelwatch/thread/471984501, answer/13889549·12663810 | 발행 `pixel-watch-safety-signal-ending` (2026-10-17). 12-12 전후 Google 변경(연기·보상)이 있으면 같은 글 갱신 |
| iPhone Handoff 통신사 요금: Verizon $10/월(10-16 발표, 시작일 미정)·T-Mobile $5/월·AT&T 미지원 | 화제 | 2026-10-16 (Verizon), 2026-09-10 (T-Mobile) | Verizon 시작일 미정 | verizon.com/about/news/iphone-duo-verizon-offers, t-mobile.com/news/devices/iphone-18-pro-iphone-duo-apple-watch-release, support.apple.com/en-us/127274 | 발행 `iphone-handoff-verizon-cost` (2026-10-17 세션 20). Verizon 시작·AT&T 지원 발표 시 같은 글 갱신 |
| Microsoft 365 Family·Premium 저장 공간 1인당 1TB → 2TB 공유 (Pro 5TB) | 영향 | 2026-10-08 (새 구독 적용, 보도 10-08~13) | 기존 구독 2027-05-02 이후 첫 갱신, 기존 Pro 2027-11-01 | support.microsoft.com/en-us/onedrive/changes-to-microsoft-365-storage, /microsoft-storage-quotas | 발행 `microsoft-365-family-storage-2tb` (2026-10-18 세션 22). 갱신 전 이메일·보너스 용량·추가 저장 공간 가격 발표 시 같은 글 갱신 |
| 커스텀 GPT 2026-12-11 종료 → 플러그인 이전 (기존 1·8번) | 영향 | 2026-09 (FAQ, 일자 미확인) | 2026-12-11 종료 (검색 발췌) | help.openai.com/en/articles/20001519 | 보류 (2026-10-17 help.openai.com·openai.com·chatgpt.com 모두 403 → 1차 출처 직접 확인 불가. 접근 가능해지면 최우선) |
| Android Auto의 Android 10 지원 종료 | 영향 | 2026-10-05 (보도) | 미확인 | 미확인 (보도는 "could soon") | 보류 (공식 날짜 확인 시 재검토, 기사 66건/30일) |
| Samsung One UI 9 배포 확대 (Galaxy S23 마지막 메이저 업데이트, A 시리즈) | 화제 | 2026-09-16 (공식 배포 시작), 10-15~16 기기별 배포 보도 | 미확인 | news.samsung.com/global (RSS) | 보류 (2026-10-18 Trends 급상승 `one ui 9` 200+, 48시간 기사 30건. 공식 발표가 48시간 밖이고 기기별 일정은 보도 위주) |
| Windows 11 24H2 Home·Pro 지원 종료 (2026-10-13) → 26H2 enablement package | 영향 | 2026-10-13 (Microsoft 메시지 센터) | 2026-10-13 종료, 첫 누락 업데이트 2026-11-10, 25H2 2027-10-12·26H2 2028-10-10 | learn.microsoft.com/en-us/windows/release-health/windows-message-center, windows11-release-information, status-windows-11-24h2·26h2, support.microsoft.com KB5121794 | 발행 `windows-11-24h2-end-of-support` (2026-10-19 세션 26). 11-10 이후 safeguard hold·배포 확대 시 같은 글 갱신 |
| Apple Siri 합의금($250M) 청구: iPhone 15 Pro·16 구매자 $25~$95, 마감 12-21 | 영향 (화제 세션 대체) | 2026-09-21 청구 시작(보도), 07-17 예비 승인 | 2026-12-21 청구·제외·이의 마감, 2027-02-24 최종 승인 심리 | CourtListener RECAP `gov.uscourts.cand.446692` ECF 77·78·94·97, clarksonlawfirm.com/lp/apple-intelligence-false-advertising/ | 발행 `apple-siri-settlement-claim` (2026-10-19 세션 24). 연장·최종 승인·청구 수 공개 시 같은 글 갱신 |
| T-Mobile T-Mix 새 요금제 (Standard·More·Loaded, "picks" 혜택) | 화제 | 미발표 (10월 중순 유출 보도) | 미확인 | 없음 (유출만) | 보류 (공식 발표 시 재검토, 2026-10-19) |
| WhatsApp 게스트 통화 (계정 없이 링크로 참여, 최대 32명) | 화제 | 2026-10-14 (보도) | 상시 기능 | 미확인 (WhatsApp 공식 블로그 미확인) | 보류 (48시간 밖, 사용법 일반 글 후보, 2026-10-19) |
| Spotify Premium Family QR 코드 대면 인증: 7일 안 미인증 시 12개월간 다른 Family·Duo 가입 불가 | 화제 | 지원 문서 수정 2026-10-07, 사용자 알림 보도 2026-10-19 | 알림 후 7일, 12개월 차단 | support.spotify.com/us/article/family-address-verification/, address-verification-duo/, spotify.com/us/premium, Paid Subscription Terms 2.2.1 | 발행 `spotify-family-qr-code-verification` (2026-10-20 세션 28). Duo 확대·연장 절차 발표 시 같은 글 갱신 |
| Office 2021 지원 종료(2026-10-13, 연장·ESU 없음) → 무료 웹·Office Home 2024·Microsoft 365 비용 비교 | 영향 | 2026-10-13 (Microsoft 지원 문서·Lifecycle) | 2026-10-13 종료, 첫 누락 Patch Tuesday 2026-11-10, Office 2024 종료 2029-10-09 | support.microsoft.com/en-us/office/system-requirements/end-of-support-for-office-2021, learn.microsoft.com/en-us/lifecycle/products/office-2021·office-2024, microsoft.com 요금 비교 | 발행 `office-2021-end-of-support` (2026-10-20 세션 30). 가격 변경·Microsoft 후속 공지 시 같은 글 갱신 |
| Google 광고에 Gmail·Photos 정보 사용 (Personal Intelligence 사용자, AI Mode 광고) | 화제/영향 | 2026-10-18~19 (보도) | 미확인 | 미확인 (Techlicious·Search Engine Roundtable·Search Engine Land 보도만) | 보류 (Google 공식 발표 확인 시 재검토, 2026-10-20 세션 28·30, 10-21 세션 32 재확인) |
| Gemini Personal Intelligence가 Android Auto에 (Gmail·Calendar·Photos·Maps 기반 개인 답변, 옵트인, 휴대폰 설정이 차로 따라옴) | 화제 | 2026-10-20 (Google 블로그) | Android Auto 10-20부터 단계 배포, Google built-in 차 수개월 내 | blog.google/.../android-auto-cars-with-google-built-in-gemini-personal-intelligence/, support.google.com/gemini/answer/16598406·16836988·16735982·13278892 | 발행 `gemini-android-auto-personal-intelligence` (2026-10-21 세션 32). built-in 차 배포·차 전용 설정·연결 앱 확대 시 같은 글 갱신 |
| remove.bg 독립 웹사이트 종료(2026-12-01 09:00 CET) → Canva·Leonardo.ai 이전, PAYG 크레딧 만료·구독 환불 | 영향 | 미확인 (보도 2026-09-24~, remove.bg FAQ 게시) | 2026-12-01 종료 | remove.bg/faq | 일반 글로 발행 `remove-bg-alternative-free` (2026-10-21 세션 33). 12-01 전후 Canva 무료 범위 발표 시 같은 글 갱신 |
| Gemini 무료 요금제 Flash-Lite 전환(10-09)·AI Plus Pro 제외(이메일 날짜)·컨텍스트 창 32k/128k/1M | 영향 | 2026-10 (도움말 17004136, 보도 10-03~06) | 무료 2026-10-09 시행, AI Plus 계정별 이메일, 학생 AI Pro 신청 마감 2026-12-31 | support.google.com/gemini/answer/17004136·16275805·18648722, gemini.google/subscriptions·students | 발행 `gemini-free-flash-lite` (2026-10-21 세션 34). AI Plus 시행일 공개·한도 변경 시 같은 글 갱신 |
| Chrome HTTP 경고 기본값(Always use secure connections, 공개 사이트) + Enhanced 전용 사기 경고(suspicious site·서버 Gemini·ClickFix) | 화제 | 2026-10-21 (HTTP), 2026-10-20 (사기 경고) — Google 블로그 | 상시 기본값 | blog.google/security/chrome-now-warns-before-insecure-http-connections/, our-latest-defenses-against-evolving-web-scams/, https-by-defau/, support.google.com/chrome/answer/9890866·10468685 | 발행 `chrome-http-warning-default` (2026-10-22 세션 36, Chrome 156 직접 실행). 다른 브라우저 기본값 변경·Standard에 사기 경고 확대 시 같은 글 갱신 |
| PHP2Shell: PHP 치명적 취약점(OpenAI·Wiz 발견, "Patch the Planet"), 웹사이트 대규모 긴급 패치 | 화제 | 2026-10-21 (openai.com·wiz.io) | 패치 진행 중 | openai.com/index/coordinated-disclosure-of-critical-vulnerabilities (컨테이너 403), wiz.io | 제외 (2026-10-22: Google News 100건+로 화제성 최대지만 웹사이트 운영자·개발자 대상, 일반 독자가 할 행동 없음 → README 0번·개발자 대상) |
| Xbox Cloud Playtime (Game Pass 없이 시간당 클라우드 게임) | 화제 | 2026-10-21 (Xbox Wire, Insider 테스트) | 테스트 단계 | news.xbox.com | 보류 (2026-10-22, 기사 82건. 일반 배포·가격 확정 시 재검토, 분야 경계) |
| Samsung Messages 종료 ("this month", Google Messages로 전환) | 영향 | 미확인 (보도 2026-09-25~10-19) | 미확인 | 미확인 (Samsung 공식 공지 미확인) | 후보 (2026-10-21, 공식 공지 확인 시 다음 뉴스 세션 우선) |
| Xbox Game Pass 개편(à la carte) | 화제 | 미발표 (소식통 보도) | 미확인 | 없음 | 제외 (루머, 2026-10-21. 10-21 Trends 급상승 200+는 신규 게임 추가 소식) |
| OneDrive iOS 18 지원 종료 (iPhone XR·XS) | 영향 | 2026-10 (TestFlight 노트 기반 보도) | 미확인 | 없음 (Microsoft 공식 공지 없음) | 보류 |
| Microsoft Edge 재시작 없는 보안 업데이트 | 영향 | 2026-10-15 (Windows Blog) | 테스트 단계 | blogs.windows.com/msedgedev/2026/10/15/ | 보류 (일반 배포·독자 행동 생기면 재검토, 2026-10-20) |
| Fitbit 클래식 앱 종료 → Google Health 강제 전환 | 영향 | 2026-10-12 (보도) | 미확인 (이미 종료 보도) | blog.google 10-12 글 2편에 종료 언급 없음 | 보류 (2026-10-19, 1차 출처 없음) |
| Windows Update가 패치 안 된 PC에서 2027년 작동 중단 | 영향 | 2026-10-11 (TechPowerUp 보도) | 2027 (미확인) | 미확인 | 보류 (2026-10-19, Microsoft 원문 확인 시 재검토) |

## 반복 일정

출시·업데이트 당일이나 다음 날 세션에서 우선 검토합니다 ([traffic-playbook.md](traffic-playbook.md) 4번). 기존 글에 반영할 변경이 있으면 새 글보다 갱신을 먼저 합니다. 2026-10-13 확인.

영향이 오래 가는 뉴스 칼럼(18시 세션) 소재로도 씁니다: 기능 종료·지원 종료·정책 시행일처럼 사용자 영향이 몇 주 이상 가는 변경은 [뉴스 칼럼 후보](#뉴스-칼럼-후보)에 올림 (2026-10-17).

| 일정                                                       | 날짜                                        | 확인 방법                                                                                                | 관련 글                   |
| ---------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------- |
| Chrome 안정판 156·157·158·159·160                          | 2026-10-20, 11-03, 11-17, 12-08, 2027-01-05 | `https://chromiumdash.appspot.com/fetch_milestone_schedule?offset=-1&n=5`                                | `turn-off-ai-in-chrome`   |
| Windows 월간 보안 업데이트 (둘째 화요일 10:00 태평양 시간) | 2026-10-13, 11-10, 12-08, 2027-01-12        | [Microsoft Learn 릴리스 주기](https://learn.microsoft.com/en-us/windows/deployment/update/release-cycle) | `windows-10-esu-extended` |

## 주요 출처 (재확인용)

- 1·7·8: help.openai.com/en/articles/20001519 (커스텀 GPT 종료 FAQ), support.google.com/gemini/answer/18560919 (Gems → Skills), support.claude.com/en/articles/12512198 (Claude 커스텀 스킬), github.com/agentskills/agentskills (`skills-ref`)
- 2: synthid.com, help.openai.com/en/articles/8912793 (C2PA·SynthID), github.com/contentauth/c2pa-rs
- 3: help.openai.com/en/articles/8555545 (오디오 업로드: 유료 요금제, 512MB), github.com/k2-fsa/sherpa-onnx/releases/tag/asr-models
- 4: github.com/chromium/chromium `components/policy/resources/templates/policy_definitions/GenerativeAI/` (`GenAILocalFoundationalModelSettings`, `GenAiDefaultSettings` 등)
- 9: microsoft.com/en-us/windows/extended-security-updates
- 10·15: github.com/danielgatis/rembg/releases, github.com/k2-fsa/sherpa-onnx/releases/tag/tts-models
- 12: support.apple.com/en-us/148218, apple.com/newsroom/2026/09/…
- 20·24: help.openai.com/en/articles/20001354, 20001598, 6825453 (릴리스 노트)

## 미확인·충돌 정보

- Google Assistant 휴대폰 종료일(2026-09-04)은 제3자 출처뿐
- Free/Go 요금제가 GPT-6 Luna인지 GPT-5.6 Luna인지 OpenAI 문서끼리 다름
- 개인 요금제에서 커스텀 GPT 생성이 이미 막혔는지 불명
- (해결 2026-10-13) Gemini Skills 유료 필요 여부: Google 도움말(17094296) "available without a Google AI subscription" → 무료
- Chrome 설정의 "On-device AI" 토글이 안정 버전에 있는지
- California SB 942 세부 의무는 법령 원문 미확인
