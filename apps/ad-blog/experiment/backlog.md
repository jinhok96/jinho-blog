# 주제 백로그

후보 주제와 선정 근거를 기록합니다. 기준은 [README.md](README.md)의 "주제 선정 기준". 발행하면 상태를 `발행`으로 바꾸고 slug를 적습니다. 날짜·기능 정보는 조사 시점 기준이므로 **글을 쓰기 전에 1차 출처를 다시 확인**합니다.

- 조사일: 2026-10-11 (WebSearch 미국 결과, 공식 문서 위주. help.openai.com·support.google.com·apple.com·microsoft.com은 WebFetch로 열리지 않아 검색 발췌로만 확인 → 발행 전 재확인 필요)
- 직접 검증: 컨테이너는 npm·PyPI·GitHub만 접속 가능. 모델 파일이 GitHub Releases에 있는 것만 직접 실행 가능 (sherpa-onnx 음성 인식·TTS, rembg). Hugging Face·Ollama 모델은 불가
- 점수: 2×최신성 + 2×문제 구체성 + 2×직접 검증 + 2×광고 가치 + 경쟁 공백 + 수명 + AI 요약 내성 (최대 55)

| 순위 | 주제                                                                                       | 핵심 키워드                                 | 점수 | 직접 검증                 | 수명                  | 상태                                                            |
| ---- | ------------------------------------------------------------------------------------------ | ------------------------------------------- | ---- | ------------------------- | --------------------- | --------------------------------------------------------------- |
| 1    | 커스텀 GPT·Gemini Gems 종료 → 포터블 Skill로 옮기기                                        | custom gpt retirement what to do            | 46   | 일부 (SKILL.md 검증 도구) | ~2027 중반, 이후 상시 | 보류 (도메인 연결 전이라 마감형 효과 낮음)                      |
| 2    | AI 생성 이미지 판별 (SynthID Detector·C2PA) + 출처 정보 제거 테스트                        | how to check if an image is ai generated    | 44   | 예 (C2PA 제거 테스트)     | 상시                  | 발행 `check-if-image-is-ai-generated`                           |
| 3    | 무료 오프라인 받아쓰기 모델 정확도·속도 비교 (ChatGPT 오디오 업로드 유료)                  | transcribe audio to text free offline       | 44   | 예 (전부 오프라인)        | 상시                  | 발행 `transcribe-audio-offline-free`                            |
| 4    | Chrome AI 기능 끄기 + 온디바이스 모델(약 4GB) 삭제, 정책 확인                              | turn off ai in chrome                       | 41   | 일부 (Chromium 소스)      | 12개월+               | 발행 `turn-off-ai-in-chrome`                                    |
| 5    | ChatGPT Finances 무료 확대: 은행 연결 안전한가                                             | chatgpt finances safe                       | 38   | 조사만                    | 12개월+               | 후보 (Free/Go 확대 공식 근거 1건뿐)                             |
| 6    | "내 Copilot 어디 갔지?" 2026년 9월 Copilot 통합 설명                                       | what happened to my copilot                 | 38   | 조사만                    | 6~12개월              | 후보                                                            |
| 7    | Gemini Gems → Skills 전환: 날짜, 옮겨지지 않는 것, 백업                                    | gemini gems to skills                       | 37   | 일부 (SKILL.md 변환 검사) | ~2027-06              | 발행 `gemini-gems-to-skills` (2026-10-14)                       |
| 8    | 커스텀 GPT 2026-12-11 종료 체크리스트                                                      | custom gpts retiring                        | 37   | 조사만                    | ~2027-02              | 후보 (1번과 묶음)                                               |
| 9    | Windows 10 ESU가 2027-10-12까지 연장됨 + 등록 오류 해결                                    | windows 10 esu october 2026                 | 37   | 조사만                    | ~2027-10              | 발행 `windows-10-esu-extended`                                  |
| 10   | 이미지 배경 무료·오프라인 제거 (rembg 모델 비교)                                           | remove background from image free offline   | 37   | 예                        | 상시                  | 발행 `remove-background-from-image-free-offline`                |
| 11   | Gemini Windows 앱 Alt+Space 단축키 충돌 해결                                               | gemini windows app alt space                | 36   | 조사만                    | 6~12개월              | 후보                                                            |
| 12   | iOS 27 Siri AI가 안 보일 때 (대기자 명단·요구 조건·Siri Classic)                           | siri ai not showing ios 27                  | 36   | 조사만                    | 3~9개월               | 후보 (경쟁 심함 → 세부 각도 필요: 국가·언어·기기별 요구 조건 표 등) |
| 13   | ChatGPT for Word 추가 기능: 기능·개인정보·제거 방법                                        | chatgpt for word                            | 36   | 조사만                    | 6~12개월              | 후보                                                            |
| 14   | Windows 11 26H2 AI 기능 끄기                                                               | windows 11 26h2 turn off ai                 | 36   | 조사만                    | ~12개월               | 후보 (경쟁 심함 → 세부 각도 필요: AI 기능별 레지스트리·정책 값 확인 등) |
| 15   | 무료 오프라인 TTS: Piper vs Kokoro 측정                                                    | free text to speech offline                 | 36   | 예                        | 상시                  | 발행 `free-offline-text-to-speech`                              |
| 16   | Meta Muse 개인정보: 볼 수 있는 데이터·옵트아웃                                             | meta muse privacy                           | 35   | 조사만                    | 6~12개월              | 후보                                                            |
| 17   | 공식 ChatGPT 브라우저 확장 vs 유사 확장 권한                                               | chatgpt chrome extension official           | 35   | 대부분 조사만             | 6~12개월              | 후보                                                            |
| 18   | AI 챗봇 학습 데이터 사용 끄기 (ChatGPT·Gemini·Claude·Copilot 등)                           | stop ai from training on my data            | 32   | 조사만                    | 상시 (분기 갱신)      | 후보                                                            |
| 19   | Ollama 0.40 변경 사항                                                                      | ollama 0.40                                 | 32   | 일부                      | 2~4개월               | 후보 (수요 약함)                                                |
| 20   | ChatGPT GPT-6: Sol·Luna·Astra와 요금제별 제공                                              | gpt-6 free                                  | 30   | 조사만                    | 2~4개월               | 후보 (수요 최대, 경쟁·AI 요약 위험 최대)                        |
| 21   | AI 구독 비교 (2026년 10월)                                                                 | chatgpt plus vs google ai pro vs claude pro | 30   | 조사만                    | 월간 갱신 시 상시     | 후보                                                            |
| 22   | ChatGPT 광고 개인화 끄기·Ads-Free                                                          | turn off ads chatgpt                        | 28   | 조사만                    | 6~12개월              | 후보                                                            |
| 23   | Google Assistant → Gemini 전환 후 잃는 기능                                                | gemini replaced google assistant            | 27   | 조사만                    | ~6개월                | 후보                                                            |
| 24   | ChatGPT "Intelligent UI" 끄기 (Simple 레이아웃)                                            | chatgpt intelligent ui turn off             | 27   | 조사만                    | 2~4개월               | 20번의 한 섹션으로                                              |
| 25   | Google Drive·Docs에서 Markdown(.md) 파일 열기·편집 (2026-10-05 Workspace 발표)             | markdown google docs                        | -    | 조사만                    | 6~12개월              | 후보 (2026-10-12 추가, 자동완성 17개: enable·import·code block) |
| 26   | GPT-6·Intelligent UI 전체 제공 (OpenAI 2026-10-07 "GPT-6 and Intelligent UI for everyone") | gpt-6 free                                  | -    | 조사만                    | 2~4개월               | 20·24번과 묶어 재평가 (help.openai.com 403)                     |
| 27   | SynthID 전 세계 확대 (Google 2026-10-07) → `check-if-image-is-ai-generated` 갱신           | synthid detector                            | -    | 일부                      | 상시                  | 기존 글 갱신 후보 (새 글 아님)                                  |
| 28   | 허브: 무료 오프라인 AI 도구 (받아쓰기·TTS·배경 제거 측정 글 3편 연결)                       | free offline ai tools                       | -    | 예 (기존 측정 재사용)     | 상시                  | 발행 `free-offline-ai-tools` (2026-10-14, 오프라인 챗봇 7개 측정 추가) |
| 29   | 2026년 10월 Windows 10 ESU 업데이트(10-13 Patch Tuesday) KB·설치 오류                     | windows 10 october 2026 update              | -    | 조사만                    | ~1개월                | 보류 (KB5126657·19045.7807 확인, KB·오류 자동완성 없음 → ESU 글 빌드 표만 갱신 2026-10-14. 11월 업데이트 때 재확인) |
| 30   | Gemini 4 Argon (2026-10-13 출시): 무료 사용 범위·요금                                      | gemini 4 argon free                         | -    | 조사만                    | 2~4개월               | 보류 (자동완성 16개, 경쟁·AI 요약 위험 큼, 직접 검증 불가)      |
| 31   | 패스키 설정 (Google 계정·iPhone·Windows 11)                                                | how to set up passkey                       | -    | 일부 (Chromium 가상 인증기) | 상시                  | 후보 (2026-10-14 추가, 자동완성 27개 Google·Bing·YouTube. Google·Apple 공식 문서 경쟁 강함) |
| 32   | 허브 확장용: 무료 오프라인 번역·OCR 측정                                                   | image to text (OCR) / offline translator    | -    | 예                        | 상시                  | OCR 발행 `image-to-text-offline-free` (2026-10-15, 허브에 섹션 추가). 번역은 Trends `offline translator` 0.0(기준 `remove background` 35.5)으로 보류 |
| 33   | PDF → Word 무료 오프라인 변환 (LibreOffice·pdf2docx·Calibre 측정)                          | pdf to word offline                         | -    | 예                        | 상시                  | 발행 `convert-pdf-to-word-offline-free` (2026-10-15). Trends `pdf to word` 23.4 (기준 `remove background` 35.3) |
| 34   | HEIC → JPG 변환 (Windows·Mac 내장 + 오프라인 도구 측정)                                    | heic to jpg                                 | -    | 예 (XnConvert·ImageMagick·GIMP) | 상시                  | 발행 `convert-heic-to-jpg-free` (2026-10-16). Trends 8.8 (기준 `remove background` 35.7). Windows·Mac 내장 방법은 문서 기반 |
| 35   | Windows 11 새 Photos 앱 (2026-10-15 Insider 배포: Gallery·Editor·HEIC 편집)               | windows 11 new photos app                   | -    | 조사만                    | 6~12개월              | 보류 (Insider 단계, 직접 검증 불가. 일반 배포 시 재검토) |

## 반복 일정

출시·업데이트 당일이나 다음 날 세션에서 우선 검토합니다 ([traffic-playbook.md](traffic-playbook.md) 4번). 기존 글에 반영할 변경이 있으면 새 글보다 갱신을 먼저 합니다. 2026-10-13 확인.

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
