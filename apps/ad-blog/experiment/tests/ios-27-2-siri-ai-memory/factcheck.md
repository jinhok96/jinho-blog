# iOS 27.2 Siri AI 기억·개인 데이터 확대 — 브리프·사실 확인표

## 작성 전 브리프 (2026-10-27 06:40 KST, 세션 55 뉴스 세션)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `ai-settings` 뉴스 칼럼 (화제, 피드형). 같은 클러스터 상시 글 `turn-off-apple-intelligence-iphone`, 허브 `turn-off-ai-features`로 연결 |
| 주 검색어 | `ios 27.2` — `demand_check.py suggest` 2026-10-26: 본 검색어·`ios 27.2 features`·`release`·`release date`·`beta` Google·Bing·YouTube 3곳, `ios 27.2 update` 2곳, 하위 20개. Trends 미국 7일: `ios 27.2` 평균 5.9·최근 24.6 · `siri ai` 3.5·3.6 · `ipad mini` 20.4·68.6 · `t-mobile t-mix` 0.1·2.6 · 기준 `remove background` 15.3·17.7 |
| 하위 검색어 | `ios 27.2 siri ai`(Google), `does siri ai have memory`·`siri ai memory`(Google), `siri excluded apps`(Google), `ios 27.2 features`(3곳), `turn off siri ai`(Google·Bing), `turn off siri ai ios 27`(Google) |
| 검색 의도 | 뉴스 (무엇이 바뀌었나) + 개인정보 설정 (Siri가 무엇을 읽고 기억하나, 어떻게 막나) |
| 채널 | 피드형 (뉴스 칼럼) |
| 상위 결과 | Google News 48시간 `iOS 27.2` 89건, `Siri AI` 83건. 상위는 Apple Newsroom(언어 확대)·9to5Mac·MacRumors·Macworld·Mashable·Engadget·ZDNET 등 대형 매체의 "what's new" 목록형. WebSearch `iOS 27.2`는 색인 지연으로 베타·출시일 예상 글(iPhone in Canada·iCulture·작은 블로그). 공통: 새 언어 5개, 기억(과거 대화), 새 데이터 출처, Excluded Apps, Messages 제안, Apple TV 프로필. 빠진 것: 새로 읽는 데이터별로 어떤 설정이 막는지, Excluded Apps가 Search·제안에서도 빠진다는 부작용, 기억을 끄는 별도 스위치가 문서에 없음, Apple 개인정보 페이지(2026-09-14)가 아직 옛 경로(앱별 Use with Siri Requests), 10-23 대비 설명서 변경(Call Context가 Excluded Apps로), 같은 날 iOS 26.7.2·18.7.11(XS·XR, 악용 보고 취약점) |
| 차별점 (독창 요소) | (1) Apple 문서 5종(릴리스 노트 149076·설명서 6쪽·개인정보 페이지 2개·보안 문서 3개)을 문장 단위로 대조, (2) 세션 43(10-23)에 저장한 설명서 원문과 오늘 원문 비교, (3) 새 데이터 출처 → 막는 설정 → 부작용 표, (4) 기기별로 10-26에 받는 업데이트·CVE 수·Siri AI 여부 표, (5) Gemini Memory 스위치와 비교한 견해 |
| 내부 링크 계획 | 나가는 링크: 상시 글 `turn-off-apple-intelligence-iphone`, 허브 `turn-off-ai-features`, 상시 글 `turn-off-gemini-apps-activity`(Gemini 기억 비교), `check-if-image-is-ai-generated`(SynthID). 받는 링크: 색인된 `check-if-image-is-ai-generated`의 "What SynthID Detector can and can't tell you" 절 Apple SynthID 문장 뒤 1문장, 허브 Apple Intelligence 절 마지막 문단 1문장, `turn-off-apple-intelligence-iphone` Siri AI 절 1문장 |
| 개요 | 첫 문단(결론) → 요약 표 → What happened → Who is affected → What changes for you (데이터 출처별 표, Excluded Apps 부작용, 기억 스위치 없음, 문서끼리 다른 점) → What to do now → Our take → What to watch next → How we checked |
| 이미지 | 대표 이미지(가운데 휴대폰 위 빛나는 구슬에서 점선이 앱 타일 4개로, 타일 하나는 체리색 상자로 들어감, 아쿠아 배경 + 체리 레드·해바라기 노랑, 아이소메트릭) + 본문 4장: Apple 설명서 Excluded Apps 화면 캡처(accent 상자), 27.2에서 Siri AI가 새로 쓰는 데이터 → 막는 설정 표, 기기별 10-26 업데이트 표, 10-23 vs 10-27 문서 변경 비교 |

- 화제성 신호 (H5 기록용): 유형 **화제** (발표 2026-10-26 17:00~19:00 UTC, 세션 시점 약 3시간 전). Google News 48시간 `iOS 27.2` 89건 · `Siri AI` 83건 · `iPad mini` 100건 · `GPT-6.1 Terra` 28건 · `Windows 11 update` 49건. 자동완성 `ios 27.2` 3곳 20개
- 제외한 48시간 후보: iPad mini 새 모델(독자 행동이 구매뿐), GPT-6.1 Terra(openai.com 403, 1차 출처 본문 확인 불가), T-Mobile T-Mix 요금제(`phones-subscriptions` 우선순위 6, Trends 0.1), Instagram 90분 영상(테스트, 독자 행동 없음), 스웨덴 정부 ChatGPT 차단(미국 독자 무관)

## 사실 확인표

원문은 이 폴더 `source-*.txt` (`render.cjs`로 Chromium 렌더링, 2026-10-26 21:23~21:35 UTC). 컨테이너에 iPhone이 없어 설정 화면은 직접 열지 못함 → 본문 How we checked에 밝힘.

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| iOS 27.2 출시 2026-10-26 | support.apple.com/100100 (보안 업데이트 목록 "26 Oct 2026"), 149076 "Published Date: October 26, 2026", Apple Newsroom 10-26 | 직접 열어 확인 |
| 27.2 Siri AI 대상: All iPhone 16 models and later, iPhone 15 Pro, iPhone 15 Pro Max | 149076 iOS 27.2 절 | `source-apple-149076-ios27-updates.txt` |
| "Siri AI can recall your past conversations, so you can ask Siri about something it told you before, like the restaurants it recommended last week" | 149076 | 원문 인용 |
| "retain useful context from previous Siri interactions as well as draw from a wider range of personal context" | 149076 27.2 요약 | 원문 인용 |
| 새 출처: "photos attached in Messages, Calendar event attendees, your voicemails, and better results from Safari history and Reading List" (Safari·Reading List는 "better results" = 기존 출처 개선) | 149076 | 원문 인용 |
| Excluded Apps: "lets you choose which apps Siri, Search, and suggestions can access, all from one setting" | 149076 | 원문 인용 |
| Excluded Apps 경로 Settings > Siri > Excluded Apps > Add Apps, "Excluded apps aren't available to Siri, Search, or suggestions. All apps are included by default" | 설명서 Change Siri settings (iphc28624b81abc) | `source-iphone-ios27-change-siri-settings.txt`, 캡처 `guide-exclude-apps.png` |
| 그 밖의 27.2: 텍스트 일부 선택·복사, Siri AI 5개 언어 추가(EU·중국 본토 제외), Messages 제안, Shared Albums, SynthID(Photos·Image Playground), Podcasts, Games, Apple TV Simple Profiles, FaceTime 수어 통역 | 149076 | 원문 |
| Siri AI 켜는 법 "Try Siri AI (Beta)" (옵트인) | 설명서 Get started with Siri AI (iphv6zwrg8jvfgr) | `source-iphone-ios27-get-started-siri-ai.txt` |
| Siri AI 13세 미만 불가, EU iOS 불가, 중국 본토 불가 | 같은 문서 Note | 원문 |
| Siri 앱 대화 기록은 같은 Apple 계정 기기 간 iCloud 동기화, Settings > Siri > Keep Conversations "If you choose 30 days or 1 year, older conversations are permanently deleted", 대화 삭제(길게 눌러 Delete, 여러 개 Select) | 설명서 Siri AI: Use the Siri app (p7ny364ngxlj) | `source-iphone-ios27-siri-app.txt` |
| 기억(과거 대화 회상)만 끄는 스위치: 설명서·릴리스 노트에 없음 (2026-10-27 기준) | 위 설명서 6쪽 + 149076 + 개인정보 페이지 2개 | 원문 전체에서 `memory`·`remember`·`recall`·`past conversation` 검색 → 릴리스 노트 1곳 외 없음 |
| Private Cloud Compute: 데이터 저장·Apple 접근 없음, 요청 처리 후 보관 안 함. Settings > Privacy & Security > Apple Intelligence Report (15분·7일) | 설명서 Apple Intelligence and privacy (iphe3f499e0e) | `source-iphone-ios27-apple-intelligence-privacy.txt` |
| Siri, Dictation & Privacy 페이지(2026-09-14): 앱별 경로 "Settings > Siri > Apps > [app name] > Use with Siri Requests", "Settings > Siri > Talk to Siri"; 요청 기록은 기기에 저장되어 개인화에 쓰일 수 있음; Apple은 무작위 식별자로 최대 2년 보관 가능 | apple.com/legal/privacy/data/en/ask-siri-dictation | `source-apple-privacy-ask-siri-dictation.txt` (설명서 iOS 27은 "Requests", "Excluded Apps") |
| 10-23 → 10-27 설명서 변경: Turn off and restrict access 쪽 "Call Context cards" 행이 "Tap Apps, tap Phone, tap Apple Intelligence & Siri, then tap Show When Calling" → "See Exclude apps from Siri, Search, and suggestions." / Siri AI 언어 "English to start" → 6개 언어 / 13세 미만·중국 본토 문장 추가 | `../turn-off-apple-intelligence-iphone/source-iphone-ios27-turn-off-features.txt`(세션 43, 2026-10-23) vs `source-iphone-ios27-turn-off-features.txt`(2026-10-26 21:24 UTC) | 공백 정규화 후 diff |
| iOS 27.2 보안 문서: CVE 163개(고유), 항목 141개, 구성요소 67개, "exploited" 문구 없음. Apple Intelligence 항목 1개("A remote attacker may be able to access sensitive user data", iPhone 15 Pro and later), Siri 항목 2개 | support.apple.com/en-us/149230 | `source-apple-149230-ios27-2-security.txt`를 정규식으로 집계 |
| iOS 26.7.2 (iPhone 11 and later): CVE 134개, exploited 문구 없음 | 149227 | 같은 방법 |
| iOS 18.7.11 (iPhone XS, XS Max, XR): CVE 3개, CoreGraphics CVE-2026-86950 "Apple is aware of a report that this issue may have been exploited in an extremely sophisticated attack against specific targeted individuals on versions of iOS before iOS 27" | 149225 | 원문 인용 |
| 업데이트 경로 Settings > General > Software Update, Automatic Updates | support.apple.com/en-us/128058 | `source-apple-128058-download-ios27.txt` |
| 일일 사용 한도·"Expanded access to such features will be available for a fee in the future" (iOS 27 출시부터 있던 문구, 27.2 신규 아님) | 설명서 각 쪽 각주, 10-23 저장본에도 같은 문장 | 두 판 비교 |
| Apple Intelligence Usage Terms 게시일 2026-09-09 | support.apple.com/en-us/148587 | 직접 열어 확인 |
| Siri AI 언어: 10-26부터 French·Japanese·Korean·Portuguese·Spanish, 연말까지 Chinese (traditional)·Norwegian·Turkish·Vietnamese | Apple Newsroom 2026-10-26 "Siri AI is available in more languages starting today" | `curl` 원문 |
| Gemini: Settings & help > Personal Intelligence > Memory 끄기/켜기, "Did you use any info from past chats?"로 확인, 기억 지우려면 채팅 삭제 | support.google.com/gemini/answer/16598469 (Computer) | `source-gemini-16598469-memory.txt` (render.cjs, 2026-10-26 21:31 UTC) |

## 쓰지 않은 것

- "App Access에서 Excluded Apps로 이름이 바뀜"(9to5Mac 등 보도): Apple 문서로 이전 이름을 확인하지 못함 (web.archive.org 접속 차단) → 쓰지 않음. 대신 Apple 자체 문서에서 확인한 변화(Call Context 행, 개인정보 페이지의 앱별 경로)만 씀
- Siri AI의 Google Gemini 기반 여부(보도): Apple 1차 출처 없음
- Health 앱 개편 누락(AppleInsider 보도): 독자 행동과 무관, 1차 출처 없음
- Keep Conversations의 세 번째 선택지 이름·기본값: 설명서에 없음
- 대화를 지우면 Siri가 그 대화에서 기억한 것도 지워지는지: Apple 문서에 없음 → "Apple doesn't say"로만 씀
