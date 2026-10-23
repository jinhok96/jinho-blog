# turn-off-ai-features 사실 확인표

## 작성 전 브리프

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `ai-settings` **허브** (상시 글 5편 `turn-off-ai-in-chrome`·`check-if-image-is-ai-generated`·`gemini-gems-to-skills`·`turn-off-gemini-in-gmail`·`turn-off-copilot-in-word` 모두 연결, 칼럼 `gemini-connected-apps`·`gemini-free-flash-lite`·`gemini-android-auto-personal-intelligence`·`chrome-http-warning-default`도 연결). 개선 세션 3번(허브 작성) |
| 주 검색어 | `turn off ai` — `demand_check.py suggest "turn off ai"` (2026-10-23) Google·Bing·YouTube 3곳. Search Console에서 `turn-off-ai-in-chrome`이 `turn off ai` 57위(2026-10-22 분석). 허브는 상위 검색어를 맡음(traffic-playbook 8번). 제목에는 자동완성 하위 검색어의 제품명(Chrome·Gmail·Word)을 넣음 |
| 하위 검색어 | `turn off ai overview google`·`turn off ai mode` (Google·Bing), `turn off ai in gmail` (Bing·YouTube), `turn off ai on iphone` (YouTube), `turn off ai in windows 11`·`turn off ai copilot` (Bing), `how to turn off ai features in chrome/gmail/google docs` (Google·Bing) |
| 검색 의도 | 정보형(How-to) 모음. 제품마다 어디서 끄는지·완전히 꺼지는지 |
| 채널 | 검색형 |
| 상위 결과 (WebSearch `how to turn off ai`, 2026-10-23) | productlift(SaaS 도움말)·seeclickfix 스팸성 페이지·Honor 블로그(Android 제조사 자사)·Croma(인도 쇼핑몰 블로그)·Consumer Reports(유료 회원 전용). 공통: 제품별 토글 나열. 빠진 것: 완전히 꺼지는지 vs 버튼만 숨기는지 구분, iOS 27에서 Apple Intelligence 전체 스위치가 문서에 없고 기능별로 끈다는 점, Google 검색 AI Overviews는 끌 수 없다는 Google 공식 문구, Labs "AI in Search"를 꺼도 AI Overviews는 남는다는 점 |
| 차별점 | 제품별 "완전히 끔 / 일부만 / 끌 수 없음" 판정표 (1차 출처 + 우리 상시 글의 Chrome 소스 코드·Microsoft 문서 확인 결과), iOS 27 기능별 스위치 표, 끄는 것과 지우는 것의 차이 |
| 내부 링크 계획 | 나가는 링크: 상시 글 5편 전부 + 칼럼 4편. 받는 링크: 색인된 같은 클러스터 글 `gemini-gems-to-skills`·`check-if-image-is-ai-generated`에서 각 1문장 + 색인 전 `turn-off-gemini-in-gmail`·`turn-off-copilot-in-word`에서 1문장. `turn-off-ai-in-chrome`은 V3 판단 기간(11-18)이라 판정 후 추가 |
| 개요 | Quick answer 표 → Is there one switch? → Chrome → Gmail·Docs → Gemini app → Google Search → Word·Microsoft 365 → Windows 11 Copilot → iPhone Apple Intelligence → What turning off doesn't do → Spotting AI images → Which to turn off first |
| 이미지 | 대표: 기기 세 대 옆 큰 토글 스위치, 하늘색 배경 + 복숭아·라일락, 정면 시점. 본문 그래픽 3장: 제품별 끌 수 있는 범위 표, iPhone iOS 27 기능별 스위치 경로, 제품별 메뉴 경로 |

## 사실 확인

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| AI Overviews는 핵심 검색 기능이라 끌 수 없음, 검색 후 Web 필터를 고르면 AI Overviews 없는 텍스트 링크만 | Google Search Help 14901683 "Show only web links in Google Search" | curl HTML 본문 (`source-google-ai-overviews-help.txt`) |
| Labs의 "AI in Search"를 끄면 실험 기능 참여만 끔 (새 실험 알림·체험) | 같은 문서 "AI in Search features in Labs" | 같음 |
| AI Mode는 AI Overviews를 확장한 검색 경험 | Google Search Help 16011537 | curl |
| iOS 27 등 27.0에서 Apple Intelligence가 지원 기기에 자동으로 켜짐(OS 일부) | Apple Support 121115 | curl (`source-apple-get-started-apple-intelligence.txt`) |
| iPhone 기능별 끄기: Siri AI(Settings > Siri > Turn Off Siri), Siri Classic 전환, Messages 요약, Mail 요약, 알림 요약, 우선 알림 등 | iPhone User Guide iOS 27 "Turn off and restrict access to Apple Intelligence features on iPhone" (iph3fed3f2c3) | curl (`source-apple-iphone-turn-off-apple-intelligence.txt`). 이 문서에 Apple Intelligence 전체 스위치는 없음 |
| Screen Time > Content & Privacy Restrictions > Siri: Don't Allow Siri / Siri (Classic Version) / Siri AI 기능별 Allow·Block | iPhone User Guide iOS 27 Screen Time (iph3ff83f3b1) | curl (`source-apple-iphone-screen-time-siri.txt`) |
| 새 Windows 11 PC에 Copilot 앱이 기본 설치, Microsoft Store에서 받는 앱 | Microsoft Support "Access Microsoft 365 Copilot on Windows" | curl (`source-ms-access-copilot-on-windows.txt`) |
| Copilot 앱(소비자용)은 Settings > Apps > Installed apps에서 ... > Uninstall로 제거 가능 | Microsoft Learn "Manage Copilot app in Windows" | curl (`source-learn-manage-copilot-app-windows.txt`) |
| Windows 앱 제거 경로 Start > Settings > Apps > Installed apps > More > Uninstall | Microsoft Support uninstall apps | curl (`source-ms-uninstall-apps-windows.txt`) |
| Chrome·Gmail·Word·Gemini·이미지 판별 요약 | 각 상시 글 (각 글 tests/{slug}/factcheck.md에 1차 출처) | 기존 글 본문과 대조 |

## 확인하지 못한 것

- Meta AI(Instagram·WhatsApp·Facebook): meta.com 도움말은 JS 렌더링, WebFetch로 본 알림 설정 문서에 끄는 방법 없음 → 허브에서 방법을 쓰지 않음 (후속 상시 글 후보)
- Samsung Galaxy AI: 1차 출처 미확인 → 쓰지 않음
- Windows 작업 표시줄 Copilot 토글: 공식 문서 미확인 → 쓰지 않음
- 직접 실행: 이번 허브는 문서 기반. Chrome 156 화면은 `turn-off-gemini-in-gmail` 세션 39 캡처 결과를 상시 글에서 인용
