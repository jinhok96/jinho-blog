# turn-off-apple-intelligence-iphone 사실 확인표

## 작성 전 브리프 (2026-10-23 세션 43, 일반 세션)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `ai-settings` 상시 글 (허브 `turn-off-ai-features`의 iPhone 절을 상시 글로 확장) |
| 주 검색어 | `turn off apple intelligence iphone`. `demand_check.py suggest "turn off apple intelligence"` (2026-10-23) 27개: 본 검색어 `turn off apple intelligence` Google·Bing·YouTube 3곳, `… iphone` Google·Bing + `… on iphone` YouTube, `… ios 27` Google·Bing, `… ipad` Bing·YouTube. Trends 미국 3개월 `turn off apple intelligence` 0.3(최근 7개 지점 1.0) · `turn off meta ai` 0.0 · `turn off ai in windows 11` 0.0 · 기준 `remove background` 35.6 → 같은 클러스터 후보 중 최대, 최근 상승 |
| 하위 검색어 | `turn off apple intelligence ios 27`, `… ipad`, `… mac`/`macbook`, `… summaries`/`summary`, `… message suggestions`, `… in messages`, `turn off apple intelligence reddit`(완전히 끌 수 있는지) |
| 검색 의도 | 정보형 How-to (끄는 방법 + 완전히 꺼지는지) |
| 채널 | 검색형 |
| 상위 결과 (WebSearch `turn off apple intelligence iphone ios 27`) | pandasecurity(보안 회사 블로그), ithinkdiff(작은 블로그), Cult of Mac(매체), analyticsinsight(저품질), feedbagel(집계), nerdschalk(작은 블로그). 공통: iOS 27에 전체 스위치가 없다, Siri 끄기·요약 끄기. 빠진 것: Apple 공식 가이드의 전체 스위치 목록(음성 사서함 제안·Call Context·Journal·Smart Replies), iOS 26 공식 문서와의 비교, Screen Time 경로·암호, 스위치가 없는 기능 정리, iPad·Mac 경로, ChatGPT 확장. 일부 결과는 "Apple Intelligence + OS 16~37GB" 같은 출처 없는 수치 |
| 차별점 | Apple iPhone User Guide iOS 27판과 iOS 26판을 직접 대조(전체 스위치 문단이 26에는 있고 27에는 없음), 27 가이드의 9개 설정 전부 + ChatGPT·Screen Time·Report 경로, 스위치 없는 기능 목록, iPhone·iPad·Mac 경로 표, Apple 공식 저장 공간 수치(8GB/14GB) |
| 내부 링크 계획 | 나가는 링크: 허브 `turn-off-ai-features`, `turn-off-gemini-in-gmail`, `turn-off-copilot-in-word`, `turn-off-ai-in-chrome`, `check-if-image-is-ai-generated`, `apple-siri-settlement-claim`(FAQ). 받는 링크: 색인된 `check-if-image-is-ai-generated` SynthID 문단 끝 1문장, 허브 iPhone 절 끝 1문장 |
| 개요 | 도입(답 + 측정 범위) → 요약 표 → Can you turn off Apple Intelligence completely in iOS 27? → Siri AI → Siri Classic → notification summaries → Messages·Mail → other suggestions → ChatGPT → Screen Time → What you can't turn off → Apple Intelligence Report → iPad and Mac → How we checked → Which settings should you turn off? → FAQ(Siri 합의금, AI 이미지 확인) |
| 이미지 | 대표: 기울어진 스마트폰 + 토글 스위치 줄(일부 꺼짐) + 반짝이, 라벤더 배경 + 민트·탠저린, 3/4 위 시점 (최근 3장: 하늘색 정면·버터 옐로 아이소메트릭·세이지 측면과 겹치지 않음). 본문 그래픽 4장: iOS 26 vs 27, iOS 27 메뉴 경로, 끌 수 있는 범위 3묶음, iPhone·iPad·Mac 경로 표 (`charts.py`) |

## 사실 확인

모든 출처는 2026-10-23(UTC) 이번 세션에서 curl로 직접 받아 본문을 추출해 `source-*.txt`로 저장했다. iPhone·iPad·Mac 실기기가 없어 화면은 직접 실행하지 못함 (본문 How we checked에 밝힘).

| # | 주장 | 출처 | 확인 방법 |
| --- | --- | --- | --- |
| 1 | iOS 27 가이드는 전체 스위치 대신 기능별 설정 9개(Siri AI, Messages·Mail·알림 요약, 우선 알림, Mail Smart Replies, 음성 사서함 제안, Call Context, Journal 프롬프트)와 Screen Time을 나열 | support.apple.com/guide/iphone/turn-restrict-access-apple-intelligence-iph3fed3f2c3/ios | `source-iphone-ios27-turn-off-features.txt` 원문 대조 |
| 2 | 메뉴 경로: Siri > Turn Off Siri(두 번), Turn on Siri > Siri Classic / Apps > Messages > Summarize Messages / Apps > Mail > Summarize Message Previews / Notifications > Summarize Notifications / Notifications > Prioritize Notifications / Apps > Mail > Personalize Smart Replies / Apps > Phone > Suggestions in Voicemail / Apps > Phone > Apple Intelligence & Siri > Show When Calling / Apps > Journal > Get Writing Prompts | 같은 문서 | 원문 대조 |
| 3 | iOS 26 가이드에는 "Go to the Settings app, tap Apple Intelligence & Siri, then tap the button next to Apple Intelligence" 전체 끄기 문단, 켜는 문단("If Apple Intelligence is off, you can turn it on") | support.apple.com/guide/iphone/intro-to-apple-intelligence-iphc28624b81/26/ios/26 | `source-iphone-ios26-intro-turn-off.txt` 원문 대조. iOS 27판(get-started-with-apple-intelligence-iphc28624b81/ios)에는 Turn off 문단 없음 |
| 4 | iOS 27: "integrated deeply into the OS", "automatically available on eligible devices as part of the operating system when you update to the 27.0 software releases" | support.apple.com/en-us/121115 | `source-apple-121115.txt` |
| 5 | 지원 iPhone: iPhone Duo, iPhone 16 이후, 15 Pro·15 Pro Max, iPhone Air. 저장 공간 iPhone Duo·17 Pro 이후·Air 최대 14GB, 그 외 최대 8GB | 같은 문서 | 원문 대조 |
| 6 | Siri AI는 베타, 영어로 시작, EU iOS에서 처음엔 제공 안 됨 | iph3fed3f2c3, 121115 각주 | 원문 대조 |
| 7 | 알림 요약 끄기·Choose Notifications to Summarize·우선 알림(잠금 화면에서 Options > Turn Off Prioritization) | support.apple.com/guide/iphone/summarize-notifications-reduce-interruptions-iph1fbe7d2b9/ios | `source-iphone-ios27-notification-summaries.txt` |
| 8 | ChatGPT 끄기: Siri > ChatGPT > Use ChatGPT, Siri AI는 Extensions > ChatGPT > Use Extension. 로그인 없이 쓰면 요청·시간대·국가·기기 유형·언어 전송, IP 가림, 로그인 시 OpenAI 정책 | support.apple.com/guide/iphone/turn-on-chatgpt-iph00fd3c8c2/ios | `source-iphone-ios27-chatgpt.txt` |
| 9 | Screen Time > Content & Privacy Restrictions > Siri: Don't Allow Siri / Siri (Classic Version) / Siri AI (Beta) + Image Creation·Sensitive Topics·Explicit Language Allow/Block, 표시 항목은 Siri 버전에 따라 다름 | support.apple.com/guide/iphone/block-features-or-content-with-screen-time-iph3ff83f3b1/ios | `source-iphone-ios27-screen-time-siri.txt` |
| 10 | Screen Time 암호: Screen Time > Manage Screen Time > Lock Screen Time Settings, 네 자리 | support.apple.com/guide/iphone/create-change-remove-a-screen-time-passcode-iph272b4c4bd/ios | `source-iphone-ios27-screen-time-passcode.txt` |
| 11 | iOS 26 Screen Time 메뉴 이름 Intelligence & Siri, Writing Tools·Image Creation·Intelligence Extensions 차단 | support.apple.com/guide/iphone/block-access-to-apple-intelligence-features-iph3fed3f2c3/26/ios/26 | `source-iphone-ios26-screen-time.txt` (iOS 27 Screen Time 문서에는 Writing Tools 항목 없음) |
| 12 | 스위치 없는 기능: Writing Tools(자동 교정 포함)·Clean Up·Extend·Reframe·Image Playground·Genmoji·Visual Intelligence | iph3fed3f2c3 목록에 없음 + Writing Tools 문서(`source-iphone-ios27-writing-tools.txt`)에 끄는 설정 없음. 자동 교정·사진 도구 이름은 121115 기능 목록 | "가이드에 스위치가 없다"로만 씀 (기능이 실제로 끌 수 없다고 단정하지 않음) |
| 13 | 끄면 저장 공간이 돌아온다는 언급 없음 | iph3fed3f2c3, 121115 | 두 문서에 해당 문구 없음 → "Apple's guides don't say…"로 씀. 상위 결과의 "16~37GB"는 출처 없어 쓰지 않음 |
| 14 | Apple Intelligence Report: Privacy & Security > Apple Intelligence Report, 15분/7일, off로 끔, Export Activity. PCC 데이터는 저장·Apple 접근 없음 | support.apple.com/guide/iphone/apple-intelligence-and-privacy-iphe3f499e0e/ios | `source-iphone-ios27-privacy-report.txt` |
| 15 | iPad는 iPhone과 같은 Settings 경로, iPad mini (A17 Pro)·M1 이상 | support.apple.com/guide/ipad/turn-restrict-access-apple-intelligence-ipad3b7f1217/ipados | `source-ipad-ipados27-turn-off-features.txt` (문서 본문에 "on your iPhone"이라는 오기가 있음 → 본문엔 Settings 경로만 씀) |
| 16 | Mac: System Settings > Siri, Messages > Settings, Mail > Settings > Viewing/Composing, System Settings > Notifications, 우선 알림 항목 없음 | support.apple.com/guide/mac-help/turn-restrict-access-apple-intelligence-mchlb2e44f94/mac | `source-mac-macos27-turn-off-features.txt` |
| 17 | 버전 확인 Settings > General > About | support.apple.com/guide/iphone/iphone-models-compatible-with-ios-27-iphe3fa5df43/ios | 원문 대조 |
| 18 | SynthID 지원 "will be available in a software update later this year" | apple.com/newsroom/2026/10/open-up-to-new-possibilities-with-iphone-duo/ | curl 본문 대조 (09월 보도자료에는 "upcoming support"만) |
| 19 | Siri 합의금: $250M, 2024-06 ~ 2025-03 미국 구매, 마감 12-21 | 우리 글 `apple-siri-settlement-claim` (해당 글 factcheck) | FAQ에서 그 글로 링크, 새 사실 추가 없음 |

## iOS 27.2 갱신 (2026-10-27 세션 56, 개선 세션)

iOS 27.2(2026-10-26) 뒤 Apple 문서가 바뀌어 같은 글을 갱신(`updatedAt` 2026-10-27). 세션 43이 저장한 10-23판 `source-*.txt`와 이번 세션에 Chromium(`render.cjs`)으로 다시 받은 `source-*-2026-10-27.txt`(2026-10-27 03:2x UTC)를 공백 정규화 후 diff로 대조. 쓴 스킬: `copy-editing` (references/content-refresh.md의 Accuracy pass·Freshness pass, AI-Tell Check)

| # | 바뀐 사실 (10-23판 → 10-27판) | 출처 | 글에 반영한 곳 |
| --- | --- | --- | --- |
| R1 | Call Context cards 행: "Tap Apps, tap Phone, tap Apple Intelligence & Siri, then tap Show When Calling." → "See Exclude apps from Siri, Search, and suggestions." (iPhone·iPad·Mac 모두) | iph3fed3f2c3, ipad3b7f1217, mchlb2e44f94 | "How to turn off other Apple Intelligence suggestions" Call Context 줄 |
| R2 | Excluded Apps 경로: Settings > Siri > Excluded Apps > Add Apps, "Excluded apps aren't available to Siri, Search, or suggestions. All apps are included by default" | iphc28624b81abc (`source-iphone-ios27-change-siri-settings-2026-10-27.txt`) | 같은 줄 |
| R3 | Call Context 설명: "understands when you're speaking to certain businesses and proactively surfaces relevant information from across your apps, like a confirmation code or a reservation number" | 149076 (iOS 27 섹션) | 같은 줄 |
| R4 | Siri AI 언어 "English to start" → "English, French, Japanese, Korean, Portuguese, and Spanish to start", 추가 문장 "Apple Intelligence and Siri AI are not available in China mainland", "Siri AI is not available for users under 13" | iph3fed3f2c3 각주·Screen Time·ChatGPT 문서 각주, 149076 iOS 27.2 "Siri AI is not available in the EU or mainland China" | Siri AI 절 마지막 문단. 13세 미만 제한이 27.2에서 새로 생긴 것인지 문서에 새로 적힌 것인지는 알 수 없어 "Apple's guide, updated for iOS 27.2 … says"로 씀 |
| R5 | iPad mini "(A17 Pro)" → "(A17 Pro or later)" (10-26 새 iPad mini 출시와 같은 날) | ipad3b7f1217 | iPad·Mac 절 |
| R6 | SynthID: "In iOS 27.2 or later, most images created or edited with Apple Intelligence tools include a SynthID hidden watermark … You can use the SynthID Detector to check for this watermark." (SynthID Detector 링크 → synthid.com, 200 확인) / 149076 iOS 27.2 "Support for SynthID watermarking … in Photos and Image Playground" | Clean Up·Extend·Reframe(xy0grrlxue5w), Image Playground(iph0063238b5), 149076 | FAQ "How do I tell if an image was made with Apple Intelligence?" (이전 답 "later this year" 교체) |
| R7 | Mac 목록에서 "Voicemail suggestions in Phone" 행이 빠짐 | mchlb2e44f94 | 글의 Mac 항목은 음성 사서함을 다루지 않아 변경 없음 |
| - | 그대로인 것: Siri Classic 단계, 요약·우선 알림·Smart Replies·음성 사서함·Journal 경로, ChatGPT 끄기·개인정보, Screen Time Siri 선택지, Apple Intelligence Report, 121115의 "integrated deeply"·"automatically available"·저장 공간 8GB/14GB | 위 문서들 | 변경 없음 |
