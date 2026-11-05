# duckduckgo-no-ai 브리프 · 사실 확인표

- 검증 유형 (가설 H3): **검증형** — Chromium 153 새 프로필로 DuckDuckGo AI 설정 4가지와 Duck.ai 끄기를 직접 확인(How we tested)

## 작성 전 브리프 (2026-11-02 KST 세션, 일반 세션)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `ai-settings` (우선순위 1) 상시 글, 카테고리 `software` |
| 주 검색어 | `duckduckgo no ai` — `demand_check.py suggest` 2026-11-01: Google·Bing·YouTube 3곳. 하위 `duckduckgo no ai search`·`browser`·`download`·`search engine`(Google·Bing), `chrome extension`·`extension`·`firefox`·`app`(Google). 같은 의도 변형: `noai duckduckgo` 3곳, `turn off ai in duckduckgo`·`turn off ai duckduckgo` Google·Bing, `how to turn off duck.ai`(Bing), `duckduckgo search assist` Google·Bing. Trends 12개월(미국) 후보끼리 `duckduckgo ai` 43.5 · `edge copilot` 30.9 · `turn off galaxy ai` 6.6 · `brave leo` 5.8 · `turn off gemini on android` 3.9 |
| 하위 검색어 | turn off ai in duckduckgo · how to turn off duck.ai · duckduckgo search assist (does it use ai) · can you turn off ai overview on duckduckgo · duckduckgo no ai chrome extension / firefox · does duckduckgo automatically use ai |
| 검색 의도 | 정보형 How-to (끄는 방법 + 유지되게 하는 방법) |
| 채널 | 검색형 |
| 상위 결과 (WebSearch 2026-11-01) | `duckduckgo no ai`: TechCrunch·MacRumors·Decrypt·Vice(5~6월 트래픽 뉴스), noai.duckduckgo.com(공식), Tom's Guide(활용법), thenewleafjournal(사용자 지정 검색 엔진). `how to turn off AI in DuckDuckGo`: lireo.com(작은 블로그), DuckDuckGo 도움말(공식), Tom's Guide, Vice, devx. 공통: noai 주소·Search Assist Never·Duck.ai 끄기. **빠진 것**: Explore More 설정(도움말에도 없음), 설정별로 실제 사라지는 홈 진입점, 설정이 쿠키에 저장돼 지우면 기본값으로 돌아간다는 직접 확인과 그 경고 창, 홈 AI Settings 창의 Search Only가 Duck.ai를 끄지 않는다는 점, Chrome에서 확장 없이 noai를 기본 검색으로 만드는 화면 |
| 차별점 | 2026-11-01 Chromium 153 새 프로필로 설정 4개·홈 창·noai·Chrome 사이트 검색을 직접 확인(진입점 전후 비교, 쿠키 4개·365일, 새 프로필에서 기본값 복귀), Explore More 발견, 확장 패키지의 검색 주소 확인 |
| 내부 링크 계획 | 나가는 링크: 허브 `turn-off-ai-features`, `turn-off-ai-in-firefox`, `turn-off-copilot-in-edge`, `turn-off-ai-in-chrome`. 받는 링크: 색인된 `gemini-gems-to-skills`(다른 앱 AI 문단의 Firefox 문장 뒤 1문장), 허브(표 행 + 새 절), `turn-off-ai-in-firefox`(검색 엔진 설정의 Perplexity 문단 뒤 1문장). `turn-off-ai-in-chrome`(V3)·`check-if-image-is-ai-generated`(V6)는 판정 전이라 손대지 않음 |
| 개요 | What is noai.duckduckgo.com? · How to make noai.duckduckgo.com your default search (Chrome·Firefox 확장 / Chrome 확장 없이 / 그 밖의 브라우저) · How to turn off AI in DuckDuckGo's search settings · Why do DuckDuckGo's AI settings keep coming back? · What does Search Only on the homepage change? · How to turn off AI in the DuckDuckGo browser · FAQ · Which option should you use? · How we tested |
| 이미지 | 대표: 둥근 검색창 + 돋보기 + 작은 빗자루가 반짝이 별을 쓸어 내는 장면, 연보라 배경 + 머스터드·세이지, 3/4 시점. 본문 5장: AI Features 설정 화면, 홈 위쪽 3상태(기본·Duck.ai 끔·noai), 홈 AI Settings 창 Search Only, 쿠키 초기화 경고 창, Chrome 사이트 검색 추가·기본값 |

## 직접 확인 환경

- Playwright 일반 headless Chromium 153.0.8010.12 (Chrome for Testing), 새 프로필·로그인 없음, 언어 en-US, 1280×900 1배율, 2026-11-01 15:30~16:10 UTC
- **검색 결과 페이지는 확인하지 못함**: `duckduckgo.com/?q=…`가 자동화 브라우저에 `static-pages/home-error/418.html`("Unexpected error")을 돌려줌(probe.cjs). 봇 차단을 우회하지 않고 측정에서 뺌 → Search Assist 답변·Explore More 질문·이미지 탭 필터의 결과 화면은 DuckDuckGo 도움말 문장으로만 씀
- 홈(`/`)·설정(`/settings`)·noai 홈·noai 설정 페이지는 일반 headless로 열림
- DuckDuckGo 브라우저 앱(Windows·Mac·iOS·Android 전용)은 실행하지 않음 → 도움말 문장으로만
- No-AI 확장은 설치하지 않음: Chrome Web Store·Firefox Add-ons 페이지와 Firefox용 패키지(`latest.xpi`)의 `manifest.json`을 읽음

## 사실 확인표

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| noai.duckduckgo.com은 Search Assist·Duck.ai·AI 생성 이미지를 막고 그 밖은 duckduckgo.com과 같음, 새 AI 기능이 생겨도 AI 없는 검색으로 남음 | DuckDuckGo 도움말 About noai.duckduckgo.com (`source-help-about-noai.txt`) | 렌더링 저장본 문장 |
| noai 홈에 Ask AI 토글·Duck.ai 버튼·OPTIONAL 안내·AI Settings 버튼 없음 | 직접 확인 (`run-log.json` step 11, `screens/11-noai-home.webp`) | 진입점 집계 + 캡처 |
| noai 설정 페이지에는 General·Appearance·Privacy 탭만(AI Features 탭 없음), Hide AI-Generated Images 기본 On | 직접 확인 (`source-noai-settings-page.txt`, noai-gen.cjs 출력) | 같은 새 프로필에서 duckduckgo.com은 Off |
| duckduckgo.com Search Settings > AI Features: Duck.ai(On), Search Assist(Never/On demand/Sometimes/Often, 기본 Sometimes), Explore More(Never/Sometimes/Often, 기본 Sometimes, "Anonymously generates follow-up questions…"), Hide AI-Generated Images(Off), Save and Exit, "Deleting cookies will reset these settings." | 직접 확인 (`source-ddg-settings-ai-features-tab.txt`, `run-log.json` step 2, `screens/02-settings-ai-default.webp`) | DOM의 select 옵션·체크 상태 |
| Duck.ai 설명 "Disabling it hides Duck.ai buttons and links, but you can still visit duck.ai directly." | 같은 설정 화면 | 저장본 문장 |
| Duck.ai를 끄고 저장하면 홈에서 Ask AI 토글·Duck.ai 버튼·OPTIONAL 안내·AI Settings 버튼이 사라짐 (페이지 아래쪽 소개 영역과 메뉴의 Duck.ai 링크는 남음) | 직접 확인 (`run-log.json` step 1 vs 4, `screens/01·04`) | 진입점 집계 + 캡처 |
| Search Assist를 Never로 바꾸면 경고 창: "Your settings are saved, but clearing cookies will reset them. Install the DuckDuckGo No AI extension to make it permanent." + Install Now(Chrome Web Store 확장 링크) | 직접 확인 (`run-log.json` step 5a, `screens/noai-modal-search-assist-never.webp`) | 창 글자·링크 주소 |
| 설정은 쿠키 `bg=-1`·`be=0`·`bl=0`·`bj=1`로 저장, 각 365일, httpOnly 아님, 서버 Set-Cookie 없음(페이지 스크립트가 씀). 기본 상태에서는 쿠키 없음 | 직접 확인 (`cookie-attributes.txt`, `run-log.json` step 2·5) | 쿠키 목록 |
| 쿠키 없는 새 프로필에서는 Ask AI 등 진입점과 네 설정이 기본값으로 돌아옴 | 직접 확인 (`run-log.json` step 8·9) | 진입점 집계·설정 상태 |
| 설정 데이터 표시: Settings in JSON `{"kbg":"-1","kbe":"0","kbl":"0","kbj":"1"}`, "Search settings are stored in non-personal browser cookies and local storage…" | 직접 확인 (`run-log.json` step 6) | Show Bookmarklet and Settings Data |
| 쿠키가 지워지면 설정이 지워짐, duckduckgo.com을 쿠키 정리 예외로 두면 됨, DuckDuckGo 브라우저는 설정을 브라우저 안에 백업해 쿠키 삭제·Fire Button으로 지워지지 않음 | DuckDuckGo 도움말 How DuckDuckGo Keeps Your Search Settings Anonymous (`source-help-settings-save.txt`) | 저장본 문장 |
| Cloud Save: 암호 문구로 설정을 저장해 쿠키 삭제 뒤 복원·다른 컴퓨터와 공유, 개인 정보 저장 없음, 암호 문구는 복구 불가 | DuckDuckGo 도움말 Cloud Save (`source-help-cloud-save.txt`) | 저장본 문장 |
| 홈 AI Settings 버튼 → Homepage AI Settings 창: Search Box에서 Search & Duck.ai / Search Only, AI Search Settings 버튼, Apply, "Clearing cookies or browser storage may reset these settings." | 직접 확인 (`run-log.json` step 3, `screens/03·12`) | 캡처 |
| Search Only 적용 뒤 Ask AI 토글만 사라지고 Duck.ai 버튼·AI Settings 버튼은 남음, 설정 페이지의 Duck.ai·Search Assist·Explore More는 기본값 그대로, 쿠키 없음 | 직접 확인 (`homepage-panel-log.json`, `screens/13`) | 진입점 집계 |
| Search Assist: 웹 내용으로 AI가 짧은 답을 만들고 출처 1~2개 링크, More로 펼침, Duck.ai로 이어 묻기, 빈도 often·sometimes(기본)·on-demand·never, 답 오른쪽 위 톱니 아이콘에서도 바꿈, DuckDuckGo 브라우저는 Settings > AI Features > Search Assist Settings | DuckDuckGo 도움말 About DuckDuckGo Search Assist (`source-help-search-assist.txt`) | 저장본 문장 |
| AI 이미지 숨기기: 이미지 탭 AI images 필터 > Hide, 또는 Search Settings > General·AI Features의 Hide AI-Generated Images, 브라우저 Settings > AI Features > Hide AI Images. 공개 차단 목록(uBlockOrigin & uBlacklist Huge AI Blocklist)에 기대며 완전하지 않음. 브라우저 Settings > AI Features의 Use DuckDuckGo Without AI | DuckDuckGo 도움말 How To Filter Out AI Images (`source-help-filter-ai-images.txt`) | 저장본 문장 |
| 브라우저: Settings > AI Features에서 Duck.ai를 끄면 브라우저의 Duck.ai 기능 전체 꺼짐, 검색: Search Settings > AI Features > Duck.ai 끄기, Search Assist Never | DuckDuckGo 도움말 Opting Out of AI Features (`source-help-opting-out-of-ai.txt`) — Explore More는 이 쪽에 없음 | 저장본 문장 |
| 도움말 Hide Duck.ai: 메뉴(줄 세 개) > Settings > AI Features 탭 > Chat 끄기 (설정 화면 이름은 Duck.ai) | `source-help-hide-ai-chat.txt` vs 직접 본 설정 화면 | 이름 차이 |
| DuckDuckGo AI 기능 두 가지(Duck.ai·Search Assist) 모두 무료, 계정 없음, 추적·학습에 쓰지 않는다고 밝힘 | `source-help-approach-to-ai.txt`, `source-help-optional-ai.txt` | 저장본 문장 (회사 주장으로 씀) |
| DuckDuckGo No-AI Search (Chrome): Duck Duck Go, Inc., 사용자 40,000, 평점 4.6(39), 버전 2026.8.19(2026-08-19), "sets your default search engine to DuckDuckGo, but to a version that doesn't use AI tools" | Chrome Web Store (`source-chrome-web-store-no-ai.txt`) | 2026-11-01 저장본 |
| DuckDuckGo No-AI Search (Firefox): by DuckDuckGo, 사용자 39,560, 평점 4(45), 버전 2026.9.25 | Firefox Add-ons (`source-firefox-amo-no-ai.txt`) | 2026-11-01 저장본 |
| Firefox용 패키지가 기본 검색 엔진 "DuckDuckGo (No AI)"(`is_default: true`)를 `https://noai.duckduckgo.com/?t=noaiext&q={searchTerms}&bext=noai`로 설정 | `latest.xpi`의 manifest.json (2026.9.25) | 직접 열어 읽음 |
| 이름에 "video"가 들어간 가짜 DuckDuckGo 확장 경고 | DuckDuckGo 도움말 How do I remove unofficial DuckDuckGo Chrome extensions? (`source-help-remove-unofficial.txt`) | 저장본 문장 |
| Chrome: Settings > Search engine > Manage search engines and site search, Site search 오른쪽 Add → 칸 채우고 Add, More > Make default | Google Chrome 도움말 95426 데스크톱 (`source-google-chrome-default-search.txt`) + 직접 확인(Chromium 153, `chrome-site-search-log.json`, `screens/chrome-*.webp`: 칸 이름 Name·Shortcut·URL with %s in place of query, "DuckDuckGo No AI (Default)") | 저장본 문장 + 캡처 |
| Chrome 도움말 "In some countries, custom site searches aren't able to be set as default for Guest profiles." | 같은 도움말 | 저장본 문장 |

## 쓰지 않은 것

- 검색 결과 화면의 Search Assist·Explore More·이미지 필터 모습 (418, 위 참고)
- No-AI 확장을 설치한 뒤 동작, 설치 때 Chrome이 묻는 확인 창 (설치하지 않음)
- 확장 패키지의 설치 통계 요청(ATB): 글의 독자 행동과 관계없고 의미를 1차 출처로 확인하지 않음
- URL 매개변수로 설정을 북마크하는 방법: Bookmarklet URL 칸이 비어 있었고(`run-log.json` step 6) 매개변수 도움말에 AI 설정이 없음 → 권하지 않음
- Safari·모바일 브라우저의 검색 엔진 목록 동작 (이번 세션 1차 출처 없음) → noai를 북마크하라고만 씀
- MacRumors·TechCrunch의 트래픽 수치 (보도, 독자 행동과 무관)
