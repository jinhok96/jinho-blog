# turn-off-gemini-in-gmail · 브리프와 사실 확인표

세션 39 (2026-10-23 00:23 KST, 일반 세션). 모든 출처는 이 세션에서 직접 열어 확인 (원문 발췌는 같은 폴더 `source-*.txt`).

## 작성 전 브리프

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `ai-settings` · 상시 글 (backlog 클러스터 공백 후보 1번) |
| 주 검색어 | `turn off gemini in gmail` — `demand_check.py suggest` 2026-10-22: Google·Bing·YouTube 3곳 모두. 상위 `turn off gemini` Trends 미국 3개월 1.8 (`turn off copilot` 0.5 · `turn off ai overviews` 0.0 · 기준 `remove background` 35.7) |
| 하위 검색어 | `turn off gemini in gmail app` / `android` / `iphone`·`ios` (Google·Bing), `turn off gemini in gmail workspace`, `turn off ai overview in gmail` (Bing·YouTube), `turn off gemini in google docs` (Google·Bing), `how to get rid of help me write` (Gmail 커뮤니티) |
| 검색 의도 | 정보형 How-to (끄는 방법 + 끄면 무엇이 같이 꺼지는지) |
| 채널 | 검색형 |
| 상위 결과 (WebSearch 2026-10-22) | Proton 블로그(경쟁 메일 서비스), Croma·Revolgy(작은 블로그·리셀러), BGR·Android Authority·SlashGear(대형 매체), Make Tech Easier. 공통: Settings > See all settings > Manage Workspace smart feature settings. 빠진 것·충돌: 끄면 맞춤법 검사가 꺼진다(일부) vs Smart Compose·문법만(다른 글) — 출처마다 다름. 무료 계정에 어떤 Gemini 기능이 있는지, 설정 3개가 각각 무엇을 끄는지 기능별 대응표, AI Inbox·Proofread처럼 개별 스위치가 있는 기능, Gemini 앱의 Gmail 연결(Connectors) 끊기, 관리자 계정에서 사용자가 바꿀 수 있는지 |
| 차별점 | Google 도움말 8개 문서를 맞대어 만든 "기능 → 필요한 설정" 대응표(공식 문서 기준, 맞춤법 검사 주장은 공식 목록에 없음), 무료 미국 계정에서 켜져 있는 Gemini 기능(요약·Help me write·Suggested Replies), 일부만 끄는 방법(AI Inbox 체크박스·Proofread=Grammar suggestions), Chrome 156 직접 실행으로 Chrome 쪽 AI 설정 화면 확인(Gmail 설정과 별개) |
| 내부 링크 계획 | 나감: `turn-off-ai-in-chrome`(Chrome Help me write), `gemini-free-flash-lite`(Google AI 요금제), `gemini-android-auto-personal-intelligence`(Personal Intelligence), `gemini-gems-to-skills`(Gems). 받음: `gemini-gems-to-skills`(색인됨) 본문에 1문장, `gemini-free-flash-lite` 1문장. `turn-off-ai-in-chrome`은 V3 판단 기간(11-18)이라 고치지 않음 |
| 개요 | Quick answer(도입) → Which Gemini features are in your Gmail → How to turn off Gemini in Gmail on a computer → On Android → On iPhone or iPad → What else turns off → Turn off one feature and keep the rest → Stop the Gemini app from reading your Gmail → Why "Help me write" can still appear (Chrome) → Work or school accounts → Google Docs → How we checked → FAQ |
| 이미지 | 대표: 봉투 더미 옆 둥근 도우미 로봇이 큰 토글 스위치로 꺼지는 장면, 연분홍 배경 + 민트·남색, 3/4 시점. 본문: ① 설정 3개와 각각 끄는 기능 그래픽 ② 계정 유형별 Gmail Gemini 기능 표 그래픽 ③ 플랫폼별 메뉴 경로 그래픽 ④ Chrome 156 Settings > AI innovations 캡처 |

## 사실 확인표

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| 스마트 기능 설정은 3개: Gmail·Chat·Meet / Google Workspace / other Google products, 서로 독립 | support.google.com/mail/answer/15604322 (`source-gmail-15604322-smart-features-computer.txt`) | 2026-10-22 curl로 열어 본문 추출 |
| Gmail·Chat·Meet 설정을 끄면: 자동 분류(Primary/Social/Promotions), Smart Compose, Smart Reply, 요약 카드(여행·택배 추적) 사용 불가 | 같음 | 같음 |
| Workspace 설정을 끄면: Gmail 이벤트를 Calendar에 표시(항공편·초대), Drive 등 개인화 검색, Gemini 요약·초안·정보 찾기 등 Workspace with Gemini 기능, 개인화 추천 사용 불가 | 같음 | 같음 |
| other Google products 설정을 끄면: Maps 예약·포장 주문, Wallet 티켓·패스·멤버십 카드 제안, Gemini 앱·Search의 Personal Intelligence (개인 계정) | 같음 | 같음 |
| 컴퓨터 경로: Settings > See all settings > General > "Google Workspace smart features" > Manage Workspace smart feature settings > Save. Gmail·Chat·Meet은 General > "Smart features" 체크박스 | 같음 | 같음 |
| Android: Menu > Settings > 계정 > General "Smart features" 체크 / "Google Workspace smart features" | `source-gmail-15604322-android.txt` | 같은 문서 Android 탭 |
| iPhone·iPad: Menu > Settings > General > Data privacy > Smart features / Google Workspace smart features > Done | `source-gmail-15604322-iphone.txt` | 같은 문서 iPhone 탭 |
| 변경은 로그인한 모든 기기에 적용, 일부 컴퓨터 변경은 모바일 앱에 반영 안 될 수 있음 | 같음 | 같음 |
| Calendar·Chat·Drive·Meet·Voice는 웹 브라우저에서만 켤 수 있음(별표) | 같음 | 같음 |
| EEA·일본·스위스·영국은 기본값 꺼짐 | 같음 | 같음 |
| 끄면 이후 기능 개선에 쓰이지 않지만 이미 학습된 내용은 남을 수 있음 | 같음 | 같음 |
| 무료 개인 계정: AI Overview 대화 요약(전 세계, 8개 언어), Help me write(미국만), Suggested Replies(미국·영어). AI Inbox·AI Overview in search·Gmail Live·Proofread는 Google AI Plus/Pro/Ultra 또는 Workspace | support.google.com/mail/answer/16831098 | 같음 |
| AI Overview 대화 요약은 두 설정(Gmail·Chat·Meet + Workspace) 모두 필요, 끄면 AI 작성·교정 도구도 꺼짐 | answer/16561387 | 같음 |
| AI Overview in Gmail search 끄기 = Workspace 설정 끄기, Gemini side panel도 꺼짐. 영어만, AI Plus/Pro/Ultra 필요, 연산자 검색에는 안 나옴 | answer/16789526 | 같음 |
| AI Inbox는 Settings > See all settings > Inbox > "Show AI Inbox" 체크박스로 숨김. 미국·영어, 베타 | answer/16845247 | 같음 |
| Proofread 끄기: General > Grammar > Grammar suggestions off (문법 제안도 꺼짐) | answer/16887555 | 같음 |
| Suggested Replies는 Workspace smart features 필요, 무료 계정은 개인화 없음 | answer/15464729 | 같음 |
| Help me write 개인 계정은 미국만, 다른 이메일·Drive 파일 내용을 가져와 초안 개인화 | answer/13955415 | 같음 |
| Gemini 앱 Connected Apps: gemini.google.com > Customize > Connectors > More options > Disconnect | support.google.com/gemini/answer/13695044 | 같음 |
| Gemini in Docs는 Workspace 또는 Google AI 요금제(또는 Workspace Experiments) 필요 | support.google.com/docs/answer/14206696 | 같음 |
| 관리자는 기본값을 정할 수 있지만 사용자가 개인 설정에서 바꿀 수 있음, EEA 등 외 지역은 기본 켜짐 | support.google.com/a/answer/10095404 (`source-workspace-admin-10095404.txt`) | 같음 |
| 관리자는 Gmail·Calendar·Drive/Docs 등 서비스별로 Gemini 기능·사이드 패널을 켜고 끌 수 있음(Enterprise Standard/Plus 등 일부 에디션), 기본값 켜짐 | support.google.com/a/answer/15698295 → knowledge.workspace.google.com 301 (`source-workspace-admin-gemini-access.txt`) | 2026-10-22 curl |
| Chrome 156.0.8078.47 Settings > AI innovations: 로그인하지 않은 새 프로필에서 "Google Search AI Mode and connected apps"(Search 서비스와 Workspace 앱 연결 관리, 클릭하면 My Activity 로그인 화면) + On-device AI 스위치만 보임. Help me write 항목은 로그인해야 나옴 | 직접 실행 (`chrome-156-ai-innovations-raw.png`) | Google 공식 deb을 풀어 headless 실행, Playwright CDP로 캡처·클릭 (2026-10-22 UTC). 컨테이너 정책 때문에 "managed" 표시가 있어 그 부분은 잘라냄 |
| Chrome Help me write는 Settings > AI innovations > Help me write > Offer writing help (Chrome 156 기준, 로그인 필요) | `turn-off-ai-in-chrome` 글(세션 34 Chrome 156 확인) | 기존 측정 재사용 |
| 상위 글의 "맞춤법 검사까지 꺼진다" 주장 | Google 공식 목록(15604322·16561387)에 맞춤법(spelling) 언급 없음. 16561387은 "AI-assisted writing and proofreading" | 공식 문서에 없는 내용이라 본문에서 단정하지 않음 |

## 직접 확인하지 못한 것

- Gmail 계정 화면(로그인 필요, 컨테이너에 Google 계정 없음) → 메뉴 이름은 모두 Google 도움말 기준으로 쓰고 본문에 밝힘
- 스위치를 끈 뒤 Gemini 아이콘이 남는지 (일부 매체 보도만, 공식 문서에 없음) → 쓰지 않음
