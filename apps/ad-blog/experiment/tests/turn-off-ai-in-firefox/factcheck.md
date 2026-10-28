# Firefox에서 AI 끄기 — 브리프·사실 확인표

## 작성 전 브리프 (2026-10-29 01:05 KST, 세션 62 일반 세션)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `ai-settings` 상시 글 (검색형). 허브 `turn-off-ai-features`, 같은 클러스터 상시 글 `turn-off-ai-in-chrome`(브라우저 비교), 칼럼 `arc-browser-shutting-down`(브라우저 이전)로 연결 |
| 주 검색어 | `turn off ai in firefox` — `demand_check.py suggest` 2026-10-28: 본 검색어 Google·Bing, YouTube는 `how to turn off ai in firefox`(3곳), 하위 14개. Trends 미국 12개월 같은 클러스터 후보끼리: `turn off ai in firefox` 평균 1.3·최고 14·최근 0.9 · `firefox smart window` 0.1·0.7 · `turn off gemini on android` 10.8·9.1 · `google personal intelligence` 27.8·6.1 · `turn off galaxy ai` 15.8·16.7 (H6 기준 롱테일) |
| 하위 검색어 | `can you turn off ai in firefox`(Bing), `turn off all ai in firefox`(Google), `turn off ai in firefox mobile`·`app`(Google), `firefox ai controls`(Google·YouTube)·`firefox ai controls android`(Google), `firefox smart window disable`(Google), `turn off ai overview in firefox`(Google·YouTube), `turn on ai in firefox`(Google) |
| 검색 의도 | 정보형 How-to (어디서 끄나 → 전부 끄면 무엇이 사라지나 → 일부만 남기기 → 끄지 못하는 것 → 휴대폰) |
| 채널 | 검색형 (제목은 검색어 그대로) |
| 상위 결과 | WebSearch `turn off ai in firefox`: Mozilla 블로그 "How to turn off AI features in Firefox, or choose the ones you want"(2026-02-24, 공식), pureinfotech(작은 블로그, about:config `browser.ml.enable`), PCWorld(대형 매체, Firefox 148 원클릭), flowingdata·The Register(148 발표 기사), omgubuntu. 공통: Firefox 148의 **Settings > AI Controls > Block AI enhancements**, about:config. 빠진 것: 현재 버전(159, 2026-10-27) 화면, Smart Window(155부터 미국·캐나다·프랑스 순차 배포)가 차단 목록에 들어간 점, 차단 뒤 실제로 사라지는 것(측정), 하나만 남기는 방법의 실제 결과, 차단해도 남는 것(검색 제안·Perplexity 검색 엔진·웹사이트 AI), 주소창 `disable ai` 바로가기, 휴대폰 앱 AI controls(151부터), 159의 챗봇 요약 변경 |
| 차별점 | (1) Firefox 159.0을 컨테이너(Xvfb)에서 새 프로필로 실행해 AI controls 화면·확인 창 캡처, (2) 같은 프랑스어 시험 페이지에서 차단 전후 비교: 오른쪽 클릭 메뉴 "Translate Selection to English"·"Ask an AI Chatbot"과 주소창 번역 아이콘이 사라지고 사이드바 아이콘 5 → 4, (3) Translations만 Available로 되돌리면 번역만 돌아오고 챗봇은 그대로 숨음, (4) 재시작 후에도 유지, (5) 차단 후에도 Show search suggestions·Perplexity 검색 엔진은 켜져 있음, (6) 주소창 `disable ai` → Manage AI controls 빠른 동작, (7) Android 159 앱 문자열로 휴대폰 AI controls 항목 확인 |
| 내부 링크 계획 | 나가는 링크: 허브 `turn-off-ai-features`(Google AI Overviews 절 포함), 상시 글 `turn-off-ai-in-chrome`, 칼럼 `arc-browser-shutting-down`, 상시 글 `turn-off-gemini-apps-activity`(Gemini는 사이드바 챗봇 공급자, 채팅 보관). 받는 링크: 색인된 `gemini-gems-to-skills`(Gemini in Chrome 문단 끝: Firefox 사이드바에도 Gemini) · 색인된 `check-if-image-is-ai-generated`(Chrome 가이드 문장 뒤) 각 1문장, 허브에 Firefox 절·표 행, `arc-browser-shutting-down` 6단계(Chrome으로 옮기면 문장 뒤) 1문장. `turn-off-ai-in-chrome`은 V3 판정(11-18) 전이라 고치지 않음 |
| 개요 | 첫 문단(답) → 요약 표(기능별 무엇을 하나·전부 차단 시) → How to turn off all AI in Firefox → What disappears when you block AI → How to keep one AI feature and block the rest → What Block AI enhancements doesn't turn off → How to turn off Smart Window → How to turn off AI in Firefox on Android and iPhone → What changed in Firefox 159 → FAQ → How we tested |
| 이미지 | 대표 이미지(가운데 일반 브라우저 창 + 옆에 꺼진 큰 토글 + 아래 작은 상자에 반짝이 별 3개를 넣는 장면, 옅은 하늘색 배경 + 탠저린·딥 바이올렛, 정면) + 본문 6장: AI controls 화면 캡처(accent 상자), 확인 창 캡처(Smart Window 표시), 차단 전후 오른쪽 클릭 메뉴·사이드바 비교, Translations만 남긴 설정·메뉴, 주소창 `disable ai` 캡처, 차단 범위(끄는 것·남는 것) 표 |

## 직접 실행 (2026-10-28 15:42~15:55 UTC)

- 환경: Firefox 159.0 Linux x86_64 en-US (`download-installer.cdn.mozilla.net/pub/firefox/releases/159.0/linux-x86_64/en-US/firefox-159.0.tar.xz`, 2026-10-27 출시), Xvfb 1440×960, xdotool, 새 프로필(`user.js`로 첫 실행 환영 화면·기본 브라우저 확인만 끔). 시험 페이지: 프랑스어 문단 2개짜리 로컬 HTML(`lang="fr"`)
- 순서와 결과 (캡처는 `screens/`)
  1. `about:preferences#ai` → AI controls: Block AI enhancements(꺼짐), On-device AI 5개(Translations·Speech recognition·Image alt text in Firefox PDF viewer·Tab group suggestions·Key points in link previews) 모두 Available, AI chatbot providers in sidebar > Chatbot in sidebar Available. **Smart Window 행 없음** (`ai-controls-default`, `-2`)
  2. 시험 페이지: 주소창에 번역 아이콘, 글자 선택 후 오른쪽 클릭 메뉴에 **Translate Selection to English**·**Ask an AI Chatbot (Z)** (`before-context-menu`). 사이드바 아이콘 5개(북마크·**AI 챗봇**·기록·동기화 탭·비밀번호, 두 번째 새 프로필 `before-sidebar`)
  3. Block AI enhancements 켬 → 확인 창 "Block AI enhancements?" 목록 7개(Translations·Speech recognition·Image alt text in Firefox PDF viewer·Tab group suggestions·Key points in link previews·**Smart Window**·Chatbot providers in sidebar) + "Blocking also affects extensions that use AI provided by Firefox." (`block-confirm-dialog`) → **Block**
  4. 설정: 모든 기능 Blocked, 안내 "New and current AI enhancements are blocked by default. To unblock a specific feature, use the controls below." (`after-block-settings-2`)
  5. 시험 페이지 새로 고침: 번역 아이콘 없음, 오른쪽 클릭 메뉴에서 두 항목 사라짐 (`after-context-menu`), 사이드바 아이콘 4개(챗봇 없음, `after-sidebar`)
  6. Translations만 Available(선택지는 Available·Blocked 2개, `translations-available`) → 새로 고침: 번역 아이콘·Translate Selection 돌아옴, Ask an AI Chatbot은 없음 (`selective-context-menu`)
  7. Chatbot in sidebar 선택지: Available·Blocked + Anthropic Claude·ChatGPT·Google Gemini·Mistral Vibe (`chatbot-dropdown`)
  8. 종료 후 다시 실행: Block 켜짐·Translations Available·나머지 Blocked 그대로 (`after-restart`). `prefs.js`에 `browser.ai.control.*` 값과 함께 `browser.ml.chat.enabled false`, `browser.ml.linkPreview.enabled false`, Smart Window 기억 생성 2개 false (`prefs-after-block.txt`)
  9. 새 탭 주소창에 `disable ai` → "Press tab to select: **Manage AI controls**" (`quick-action-disable-ai`)
  10. Settings > Search(차단 상태): **Show search suggestions** 켜짐, 추가 검색 엔진 목록에 **Perplexity**(켜짐)·Google·Bing·DuckDuckGo·Wikipedia (`after-search-settings-2`)
  11. ☰ 메뉴: **Settings** 항목 (`app-menu`)
- 하지 않은 것: Smart Window 실행(우리 사본에 배포되지 않음, 기본값 `browser.smartwindow.enabled false`), 챗봇·링크 미리보기 사용(계정·네트워크 필요), Windows·Mac 화면(같은 Firefox 159지만 직접 확인은 Linux판), Android·iOS 앱 실행

## 사실 확인표

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| Firefox 159.0: 2026-10-27 정식판 배포 | firefox.com 159.0 릴리스 노트 "first offered to Release channel users on October 27, 2026" | `source-firefox-159-release-notes.txt` |
| 159: Smart Window가 가격 하락·재입고 같은 변화를 감시(채팅에 `/watch`), 데스크톱 알림, Tasks 버튼·`about:smartwindowtasks`에서 관리, 순차 배포 | 같은 릴리스 노트 | 원문 |
| 159: AI 챗봇 "Summarize page"가 페이지 글 대신 **페이지 주소**를 챗봇 공급자에게 보냄 | 같은 릴리스 노트 Changed | 원문 인용 |
| AI Controls는 Firefox 148(2026-02-24)에 추가 | 148 릴리스 노트 "Added an AI Controls section to Settings for managing AI-enhanced features." | `source-firefox-148-release-notes.txt` |
| Mozilla 블로그: Block AI enhancements는 현재와 앞으로의 AI 기능을 막음, 기능별 드롭다운 Available·Enabled·Blocked 뜻 | blog.mozilla.org/en/firefox/how-to-use-ai-controls/ (2026-02-24) | `source-mozilla-blog-how-to-use-ai-controls.txt` |
| 154: 주소창 Manage AI 빠른 동작 | 154 릴리스 노트 "The address bar now includes a Manage AI quick action that opens the AI controls in Settings." | `source-firefox-154-release-notes.txt` + 직접 실행 9 |
| 빠른 동작 키워드 `disable ai, off ai, manage ai` | Firefox 159 `browser.ftl` `quickactions-cmd-manageai` | `source-firefox-159-ui-strings.txt` |
| 155: Smart Window를 미국·캐나다·프랑스 모든 사용자가 써 볼 수 있음, 순차 배포 | 155 릴리스 노트 | `source-firefox-155-release-notes.txt` |
| 153: Smart Window에서 AI 모델 선택 / 154: 탭 묶음 제안 / 158: 양식 채우기(열린 탭·저장된 자동 완성 데이터 기반) | 각 릴리스 노트 | 원문 |
| Smart Window: 데스크톱 전용, Mozilla는 채팅 기록을 보관·학습·판매하지 않는다고 밝힘, Memories는 기기에 저장되고 보기·삭제·끄기 가능, 모델 3개 또는 직접 지정, 원할 때 열고 닫음 | firefox.com/en-US/smart-window/ | `source-firefox-smart-window-page.txt` |
| Smart Window를 차단하면 Smart Window 채팅과 기억이 지워진다는 확인 문구 | Firefox 159 `aiFeatures.ftl` `smart-window-block-description-both` | `source-firefox-159-ui-strings.txt` (직접 화면으로는 보지 못함 → 본문에 "Firefox's own text for that step"으로 밝힘) |
| AI controls의 Smart Window 행은 Smart Window가 켜진 사본에서만 보임 | Firefox 159 `aiFeatures.mjs` `smartWindowFieldset` visible: `browser.smartwindow.enabled`, 기본값 false (`firefox.js`) | omni.ja 코드·기본 설정 + 직접 실행 1 |
| Blocked 뜻: "You won't see and can't use the feature. For on-device AI, any models already downloaded are removed." | Firefox 159 `preferences.ftl` | 화면(`ai-controls-default-2`) + 문자열 |
| 회사·학교 PC는 정책(AIControls)으로 설정이 잠길 수 있음 | Firefox 159 `policies-descriptions.ftl` `policy-AIControls = Configure AI controls.`, `aiFeatures.mjs` `disabled()`가 정책 관리 시 true | 문자열·코드 |
| Android·iOS 151(2026-05-19): "AI controls: Keep Firefox AI features on your terms with one place to turn them on, off or customize them individually." | firefox.com Android·iOS 151 릴리스 노트 | `source-firefox-android-151-release-notes.txt`, `source-firefox-ios-151-release-notes.txt` |
| Android: Page summaries(탭하거나 흔들기), 152에 영어 사용자 전체, 155에 흔들기 민감도 | Android 152·155 릴리스 노트 | 원문 |
| Android 159 앱의 AI controls 항목: Settings 항목 이름 "AI controls", Block AI enhancements, Translations("All translations stay private on your device."), Page summaries("Pages and summaries are never stored."), Voice search("Audio is converted to text by Google Speech Services."), More page summary settings > Shake to summarize | Fenix 159.0 APK(archive.mozilla.org) 기본 문자열 | `source-firefox-android-159-strings.txt` (앱을 실행하지 않음 → 본문에 문자열 기준이라고 밝힘) |
| 사이드바 챗봇 공급자는 각 회사의 채팅 웹사이트(claude.ai/new·chatgpt.com·gemini.google.com·chat.mistral.ai/chat)를 사이드바에 여는 것 | Firefox 159 `GenAI.sys.mjs` 공급자 목록, `aiFeatures.mjs`가 드롭다운 값으로 그 주소를 씀 | `source-firefox-159-ui-strings.txt` 끝 |
| iOS 앱 메뉴 위치 | 확인 못 함 | 본문에 릴리스 노트만 확인했다고 밝힘 |

## 쓰지 않은 것

- about:config(`browser.ml.enable` 등): 상위 결과 다수가 권하지만 고급 설정 편집기라 비개발자 기준에서 뺌. 또 Mozilla 문서로 효과를 확인하지 못함
- 기업 정책 설정 방법(policies.json·그룹 정책): 관리자용
- Smart Window 설정 화면 단계(모델·기억 끄기 메뉴 이름): 우리 사본에 배포되지 않아 화면을 보지 못함 → firefox.com 설명("see what's remembered, delete … or turn it off")만 씀
- SUMO 지원 문서(support.mozilla.org/kb/firefox-ai-controls 등): 컨테이너·WebFetch 모두 "Client Challenge"로 막힘 → 블로그·릴리스 노트·앱 화면으로 대신
