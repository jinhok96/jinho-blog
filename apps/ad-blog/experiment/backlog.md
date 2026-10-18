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
| 2    | AI 생성 이미지 판별 (SynthID Detector·C2PA) + 출처 정보 제거 테스트                        | how to check if an image is ai generated    | 44   | 예 (C2PA 제거 테스트)     | 상시                  | 발행 `check-if-image-is-ai-generated`                           |
| 3    | 무료 오프라인 받아쓰기 모델 정확도·속도 비교 (ChatGPT 오디오 업로드 유료)                  | transcribe audio to text free offline       | 44   | 예 (전부 오프라인)        | 상시                  | 발행 `transcribe-audio-offline-free`                            |
| 4    | Chrome AI 기능 끄기 + 온디바이스 모델(약 4GB) 삭제, 정책 확인                              | turn off ai in chrome                       | 41   | 일부 (Chromium 소스)      | 12개월+               | 발행 `turn-off-ai-in-chrome`                                    |
| 5    | ChatGPT Finances 무료 확대: 은행 연결 안전한가                                             | chatgpt finances safe                       | 38   | 조사만                    | 12개월+               | 후보 (Free/Go 확대 공식 근거 1건뿐) → 뉴스 칼럼 후보로 이동              |
| 6    | "내 Copilot 어디 갔지?" 2026년 9월 Copilot 통합 설명                                       | what happened to my copilot                 | 38   | 조사만                    | 6~12개월              | 후보 → 뉴스 칼럼 후보로 이동                                             |
| 7    | Gemini Gems → Skills 전환: 날짜, 옮겨지지 않는 것, 백업                                    | gemini gems to skills                       | 37   | 일부 (SKILL.md 변환 검사) | ~2027-06              | 발행 `gemini-gems-to-skills` (2026-10-14)                       |
| 8    | 커스텀 GPT 2026-12-11 종료 체크리스트                                                      | custom gpts retiring                        | 37   | 조사만                    | ~2027-02              | 후보 (1번과 묶음)                                               |
| 9    | Windows 10 ESU가 2027-10-12까지 연장됨 + 등록 오류 해결                                    | windows 10 esu october 2026                 | 37   | 조사만                    | ~2027-10              | 발행 `windows-10-esu-extended`                                  |
| 10   | 이미지 배경 무료·오프라인 제거 (rembg 모델 비교)                                           | remove background from image free offline   | 37   | 예                        | 상시                  | 삭제 `remove-background-from-image-free-offline` (2026-10-17 명령줄 방법 → GUI 앱·내장 기능으로 새로 쓸 후보)                |
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
| 33   | PDF → Word 무료 오프라인 변환 (LibreOffice·pdf2docx·Calibre 측정)                          | pdf to word offline                         | -    | 예                        | 상시                  | 삭제 `convert-pdf-to-word-offline-free` (2026-10-17 명령줄 방법 → GUI 앱·내장 기능으로 새로 쓸 후보) (2026-10-15). Trends `pdf to word` 23.4 (기준 `remove background` 35.3) |
| 34   | HEIC → JPG 변환 (Windows·Mac 내장 + 오프라인 도구 측정)                                    | heic to jpg                                 | -    | 예 (XnConvert·ImageMagick·GIMP) | 상시                  | 발행 `convert-heic-to-jpg-free` (2026-10-16, 2026-10-17 ImageMagick 내용 삭제 → XnConvert·GIMP 2개). Trends 8.8 (기준 `remove background` 35.7). Windows·Mac 내장 방법은 문서 기반 |
| 35   | Windows 11 새 Photos 앱 (2026-10-15 Insider 배포: Gallery·Editor·HEIC 편집)               | windows 11 new photos app                   | -    | 조사만                    | 6~12개월              | 보류 (Insider 단계, 직접 검증 불가. 일반 배포 시 재검토) → 뉴스 칼럼 후보로 이동 |
| 36   | PDF 압축 무료 오프라인 (Ghostscript·OCRmyPDF·qpdf 측정)                                    | compress pdf offline                        | -    | 예 (설정 10개)            | 상시                  | 삭제 `compress-pdf-offline-free` (2026-10-17 명령줄 방법 → GUI 앱·내장 기능으로 새로 쓸 후보) (2026-10-16). Trends `compress pdf` 4.8 (기준 `remove background` 34.9) |
| 37   | MP4 → MP3 오프라인 변환                                                                    | mp4 to mp3                                  | -    | 예                        | 상시                  | 보류 (Trends 8.7로 수요 큼, 도구 간 차이가 작아 측정 차별점 약함. 2026-10-16) |
| 38   | 영상 → GIF 고화질 변환 (FFmpeg 팔레트·gifski·ImageMagick 측정)                            | video to gif                                | -    | 예 (설정 7개)             | 상시                  | 삭제 `video-to-gif-high-quality-free` (2026-10-17 명령줄 방법 → GUI 앱·내장 기능으로 새로 쓸 후보) (2026-10-16). Trends `video to gif` 7.1 (기준 `remove background` 35.0) |
| 39   | 영상 압축 무료 오프라인 (HandBrake·FFmpeg 측정, 디스코드·이메일 용량)                       | compress video for discord                  | -    | 예 (설정 14개)            | 상시                  | 발행 `compress-video-for-discord-email` (2026-10-16, 2026-10-17 FFmpeg 내용 삭제 → HandBrake 설정 7개). Discord 무료 20MB(2026-08 변경)·Gmail 25MB 공식 문서 확인 |
| 40   | 이미지 목표 용량 압축 (100KB·200KB·1MB, 크기 조정 + JPEG 품질 측정)                        | compress image to 100kb                     | -    | 예 (1,900건)              | 상시                  | 발행 `compress-image-to-100kb` (2026-10-16, 2026-10-17 명령줄 섹션·jpegoptim·cwebp 비교 삭제). Trends 429로 미비교, 자동완성 "compress image" 30개·"reduce image size" 30개 |
| 41   | AI 이미지 업스케일 무료 오프라인 (GUI 앱 CPU 측정)                                          | upscale image ai free                       | -    | 확인 필요 (GUI 앱)        | 상시                  | 후보 (2026-10-16, 자동완성 32개 3곳: ai·free. Trends 1.4 기준 `remove background` 35.0). Real-ESRGAN 명령은 쓸 수 없음 → GUI 앱으로 측정할 수 있을 때만 (2026-10-17) |
| 42   | WebP → JPG 변환 (Windows·Mac 내장 + 오프라인 도구)                                        | webp to jpg                                 | -    | 예                        | 상시                  | 후보 (2026-10-16, 자동완성 22개: converter·free·bulk·mac. Trends 1.8) |
| 43   | JPG → PDF 무료 오프라인 변환 (img2pdf·ImageMagick·Pillow·LibreOffice·Chromium 측정)       | jpg to pdf                                  | -    | 예 (24장, 세로 4장)       | 상시                  | 삭제 `jpg-to-pdf-free-offline` (2026-10-17 명령줄 방법 → GUI 앱·내장 기능으로 새로 쓸 후보) (2026-10-16). Trends `jpg to pdf` 13.1 · `image to pdf` 8.1 · `png to jpg` 3.9 (기준 `remove background` 35.4) |
| 44   | PDF → JPG 고화질 변환 (pdftoppm·PyMuPDF·Ghostscript·ImageMagick·LibreOffice 측정, DPI)   | pdf to jpg                                  | -    | 예 (PDF 3개, 설정 25개)   | 상시                  | 삭제 `pdf-to-jpg-high-quality` (2026-10-17 명령줄 방법 → GUI 앱·내장 기능으로 새로 쓸 후보) (2026-10-16). Trends 429로 미비교, 자동완성 30개(high quality·high resolution) |
| 45   | PDF 합치기 무료 (GUI 앱, 책갈피·링크·양식 보존)                                             | merge pdf files free                        | -    | 예 (GUI 3개)              | 상시                  | 발행 `merge-pdf-files-free` (2026-10-18 세션 21, PDFsam Basic·PDF Arranger·Sejda Desktop 무료판을 GUI로 측정, Mac 미리보기는 문서 기반). 이전 명령줄 글 `merge-pdf-files-free-offline`은 2026-10-17 삭제. Trends `merge pdf` 6.3 · `combine pdf` 6.4 · `split pdf` 6.0 (기준 `remove background` 35.5) |
| 46   | PDF 나누기·페이지 추출 무료 오프라인 (OS 내장 기능·GUI 앱, 책갈피·양식 유지)                | split pdf free                              | -    | 예 (GUI 3개)              | 상시                  | 발행 `split-pdf-free` (2026-10-17 세션 19, PDFsam Basic·PDF Arranger·Chrome 인쇄를 GUI로 측정, Mac 미리보기는 문서 기반). Trends `split pdf` 22.6 · `merge pdf` 23.5 (3개월 평균, 미국) |

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
| 커스텀 GPT 2026-12-11 종료 → 플러그인 이전 (기존 1·8번) | 영향 | 2026-09 (FAQ, 일자 미확인) | 2026-12-11 종료 (검색 발췌) | help.openai.com/en/articles/20001519 | 보류 (2026-10-17 help.openai.com·openai.com·chatgpt.com 모두 403 → 1차 출처 직접 확인 불가. 접근 가능해지면 최우선) |
| Android Auto의 Android 10 지원 종료 | 영향 | 2026-10-05 (보도) | 미확인 | 미확인 (보도는 "could soon") | 보류 (공식 날짜 확인 시 재검토, 기사 66건/30일) |
| Samsung One UI 9 배포 확대 (Galaxy S23 마지막 메이저 업데이트, A 시리즈) | 화제 | 2026-09-16 (공식 배포 시작), 10-15~16 기기별 배포 보도 | 미확인 | news.samsung.com/global (RSS) | 보류 (2026-10-18 Trends 급상승 `one ui 9` 200+, 48시간 기사 30건. 공식 발표가 48시간 밖이고 기기별 일정은 보도 위주) |
| OneDrive iOS 18 지원 종료 (iPhone XR·XS) | 영향 | 2026-10 (TestFlight 노트 기반 보도) | 미확인 | 없음 (Microsoft 공식 공지 없음) | 보류 |

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
