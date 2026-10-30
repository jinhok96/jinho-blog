# turn-off-copilot-in-edge 사실 확인표

## 작성 전 브리프 (2026-10-30, 세션 69 일반 세션)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `ai-settings` 상시 글 (검색형). 카테고리 `software` (브라우저, `turn-off-ai-in-firefox`·`turn-off-ai-in-chrome`과 같은 계열) |
| 주 검색어 | `turn off copilot in edge`. `demand_check.py suggest` 2026-10-30: 본 검색어 Google·Bing, YouTube는 `how to turn off copilot in edge` (3곳). 하위 21개 중 `turn off copilot in edge android`·`mobile`은 Google·Bing 2곳 |
| 수요 비교 | Trends 12개월(미국) 후보끼리: `edge copilot` 65.3 · `turn off gemini on android` 7.6 · `disable copilot in edge` 0.3 · `remove copilot from edge` 0.0 · `turn off copilot in edge` 0.0. 3개월 기준 `remove background` 35.6 대비 본 검색어 0.0. 같은 표현이 여러 변형으로 흩어진 롱테일 (노하우 8: `turn-off-ai-in-chrome`도 Trends 0.0에서 노출 1위) |
| 하위 검색어 | `turn off copilot mode in edge`(Google) → Copilot Mode 폐지 절 · `turn off copilot in edge android/mobile/iphone` → FAQ · `turn off copilot search in edge`·`search bar`(Google·Bing) → 주소창 확인 결과 · `turn off copilot vision in edge`(Google) → Copilot 창 안 기능 · `turn off copilot in edge gpo`·`group policy` → 회색 스위치 절(관리자 정책은 쓰지 않음) · `turn on copilot in edge` → 다시 켜기 |
| 검색 의도 | 정보형 How-to (끄는 방법 + 무엇이 남는지) |
| 채널 | 검색형 |
| 상위 결과 (WebSearch `turn off copilot in edge`, 2026-10-30) | 작은 블로그: Pureinfotech(Windows 11 "모든 AI 끄기"·Copilot Mode 끄기), Techloy, Guiding Tech, geekrewind / 포럼: ElevenForum, Microsoft Q&A / IT 블로그: NinjaOne(정책) / 뉴스: Windows Report. 공통: Copilot 버튼 스위치, 옛 경로 Appearance > Copilot and sidebar, Copilot Mode 스위치, Languages의 "Use Copilot for writing on the web", 그룹 정책·레지스트리. **빠진 것**: Edge 156의 실제 Copilot and AI 화면(Cowork·Preview), 스위치마다 실제로 사라지는 진입점(직접 시험), 버튼을 꺼도 남는 Help me rewrite·Alt+I, 단축키, Copilot Mode 폐지(2026-05-13)와 Preview 탈퇴 시 켜진 기능이 남는다는 점 |
| 차별점 | Microsoft Edge 156.0.4314.56(Linux 안정판, 10-29)을 새 프로필(로그아웃)로 실행해 같은 시험 페이지에서 진입점 6곳을 스위치 전후로 비교. Show Copilot button in toolbar를 끄면 4곳(툴바 Chat 버튼·오른쪽 클릭 Summarize with Copilot·선택 미니 메뉴 Copilot 아이콘·Ctrl+Shift+. 단축키)이 함께 사라지고, Help me rewrite·Alt+I는 Use writing assistance까지 꺼도 남음(로그인 요청 창). 다시 켜면 4곳 모두 돌아옴 |
| 내부 링크 계획 | 나가는 링크: 허브 `turn-off-ai-features`, 같은 클러스터 `turn-off-copilot-in-word`·`turn-off-ai-in-windows-11`·`turn-off-ai-in-chrome`·`turn-off-ai-in-firefox`. 받는 링크: 색인된 `gemini-gems-to-skills`(123행 다른 앱 AI 문단, ai-settings), 색인된 `windows-10-esu-extended`(126행 브라우저 문단), 허브 `turn-off-ai-features`(제품 표 행 + 둘째 문단), `turn-off-ai-in-windows-11`(137행 "Edge has its own Copilot settings") |
| 개요 | 도입(답: Settings > Copilot and AI > Show Copilot button in toolbar 끄기, 무엇이 사라지고 남는지) → 요약 표 → `## How to turn off Copilot in Edge` → `## What the Copilot button switch removes` → `## What stays: Help me rewrite` → `## The other Copilot switches in Edge 156` → `## Where did Copilot Mode go?` → `## Why a Copilot switch is grayed out` → `## How we tested` → `## FAQ` |
| 이미지 | 대표: 일반 브라우저 창 + 오른쪽 패널의 반짝이 말풍선 + 앞쪽 꺼진 큰 스위치 + 커서, 연분홍 배경·청록·짙은 파랑, 아이소메트릭. 본문 5장: ① Copilot and AI 설정 화면(기본값, 주석) ② 끄기 전후 비교(오른쪽 클릭 메뉴·미니 메뉴·단축키) ③ 남는 것(Help me rewrite·로그인 요청) ④ 진입점 × 스위치 결과 표 그래픽 ⑤ Languages > Writing assistance 스위치(끈 뒤 회색 Show writing hints) |

## 직접 실행 (2026-10-30 16:2x~17:0x UTC)

- 앱: Microsoft Edge 156.0.4314.56 (Official build, x86_64, Chromium 156.0.8078.75), packages.microsoft.com `microsoft-edge-stable_156.0.4314.56-1_amd64.deb`를 `dpkg-deb -x`로 풀어 실행 (설치 없음). Learn 릴리스 노트: 156.0.4314.56 = 2026-10-29 Stable Update 2 (`source-relnote-stable.txt`)
- 환경: Xvfb 1280×900, `--no-first-run --lang=en-US`, 새 프로필마다 로그아웃 상태. 조작은 Playwright(CDP)·xdotool, 캡처는 ImageMagick `import`. 시험 페이지 `test-site/index.html`(문단 + 글 입력 칸)을 `http://localhost:8766`으로
- 컨테이너의 인증서 정책 때문에 설정 왼쪽 아래에 "Managed by your organization"이 뜸 (Copilot 관련 정책 없음, `edge://policy`에 CACertificates·CADistrustedCertificates만). 글 이미지는 그 부분을 자름
- 기록: `capture-notes.md`, 최종 실행 로그 `final-run-log.json`, 설정 글자·기본값 `source-edge-156-settings-text.txt`, 언어 파일 문구 `source-edge-156-strings.txt`

## 사실 확인

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| Edge 156에는 Copilot을 한 번에 끄는 스위치가 없고 Settings > Copilot and AI에 스위치 4개(Show Copilot button in toolbar, Allow Copilot to read context clues on the web, Copilot new tab page, Allow Cowork to take actions on your behalf) + Copilot settings(Manage settings) + Copilot in Edge Preview | 직접 실행 `screens/f-s1-ai-default.webp`, `source-edge-156-settings-text.txt` | 새 프로필 `edge://settings/ai` 글자·스위치 상태 |
| 새 프로필(로그아웃) 기본값: 버튼 On, 문맥 단서 Off, Copilot 새 탭 Off, Cowork Off | 같음 | `toggles()` 결과 (`final-run-log.json` ai-default) |
| Microsoft 도움말 경로: More menu (…) > Settings > Copilot and AI | support.microsoft.com getting-started·context-clues (`source-getting-started.txt`, `source-context-clues.txt`) | 렌더링 저장본에서 문장 확인 |
| 버튼을 끄면 툴바 Chat 버튼, 페이지 오른쪽 클릭의 Summarize with Copilot, 텍스트 선택 미니 메뉴의 Copilot 아이콘이 사라지고 Ctrl+Shift+.이 아무것도 열지 않음 | 직접 실행 `screens/f-a-*`(전) vs `f-b-*`(후), 재시작 확인 `61-*` | 같은 시험 페이지·같은 조작 |
| 기본 상태에서 Ctrl+Shift+.이 Copilot 창을 열고("Let's get you signed in"), 한 번 더 누르면 닫힘 | `f-a-3-shortcut`, `f-a-3b-after-close` | 직접 실행. 툴팁 문구 "Copilot (Ctrl+Shift+.)" (`source-edge-156-strings.txt` 21022) |
| 버튼을 끄면 Allow Copilot to read context clues와 Manage settings가 회색이 됨 | `f-s2-ai-button-off`, `final-run-log.json` ai-after-button-off (disabled true) | 직접 실행 |
| 다시 켜면 네 곳이 모두 돌아옴 | `scenarios/s_revert.py`, 캡처 `90-*`(저장 안 함, 실행 기록 capture-notes) | 직접 실행 |
| Help me rewrite(글 입력 칸 오른쪽 클릭, Alt+I)는 버튼을 꺼도, Use writing assistance까지 꺼도 남고, 로그아웃 상태에서는 "Sign in to use Writing assistance for drafting and rewriting in Edge." 창만 뜸 | `f-b-4`·`f-b-5`, `f-c-4`·`f-c-5`, 재시작 확인 `62-*`·`63-*` | 직접 실행 (재시작 후에도 같음) |
| Languages > Writing assistance: Use writing assistance(On), Show writing hints(On, 끄면 회색), Use text prediction(On, "typed characters in certain text boxes on the web are sent to Microsoft Cloud") | `source-edge-156-settings-text.txt`, `f-s3`·`f-s4` | 직접 실행 |
| 주소창 입력 시 로그아웃 상태에서 Copilot 제안 줄 없음 (검색 제안만) | `screens/41-addressbar.webp` | 직접 실행 ("how long is a marathon") |
| Manage settings 버튼은 로그아웃 상태에서 Copilot 창(로그인 요청)을 염 | `screens/80-manage-settings.webp` | 직접 실행 |
| Copilot new tab page를 켜면 새 탭이 "Type a link or ask anything" 화면으로 바뀜, 로그아웃 상태에서 Journeys 스위치는 나타나지 않음 | `81-*`·`82-*` | 직접 실행 |
| Copilot in Edge 사용에는 개인 Microsoft 계정 로그인 필요 | support getting-started FAQ "Do I need to sign in…? Yes." | 저장본 |
| 처음 Copilot을 열 때 지역에 따라 알리거나 권한을 물은 뒤 브라우저 정보를 씀 | getting-started Note | 저장본 |
| 문맥 단서를 끄면 Copilot이 현재 페이지·제목·열린 탭·방문 기록을 쓰지 않음, 공유되는 것은 URL·제목·페이지 내용 또는 스크린샷·방문 기록 | context-clues | 저장본 |
| Copilot Mode는 2026-05-13 폐지, 기존 사용자는 Copilot in Edge Preview로 우선 제공, Settings에서 바꿀 수 있음. Copilot Actions → Browse with Copilot(미국 Microsoft 365 Premium) | blogs.windows.com/msedgedev/2026/05/13 (`source-edge-blog-2026-05-13.txt`) | 저장본 23행·77행 |
| Edge 156 안 문구: "Features that were limited to Copilot Mode are now available under the Copilot and AI Settings page…" | `source-edge-156-strings.txt` 47330 | 언어 파일 (화면에서는 못 봄 → 본문에 쓰지 않거나 Microsoft 블로그로) |
| Preview 설명: "If you opt out, any features that were turned on will stay on and need to be turned off individually." | 설정 화면 글자 | 직접 실행 |
| Preview에 포함: Copilot new tab page, Journeys, Remix | explore.microsoft.com/en-us/edge/copilot/preview (`source-explore-preview.txt`) | 저장본 |
| Browse with Copilot: 미국 Microsoft 365 Premium 소비자에게 배포 중, 스크린샷 최대 30일 보관 | support browse-with-copilot | 저장본 |
| Journeys: 기본 꺼짐, Copilot new tab page 켠 뒤 Journeys 켬, 데스크톱·모바일 모두 More menu > Settings > Copilot and AI, 끄면 수집 멈추고 저장된 정보 삭제 | support copilot-journeys (`source-journeys.txt`) | 저장본 |
| 회사 프로필 정책: Microsoft365CopilotChatIconEnabled(Entra ID 프로필, Windows·macOS 139+, Android·iOS 미지원, MSA 프로필엔 적용 안 됨), CopilotPageContext(Entra ID 프로필만) | learn.microsoft.com 정책 문서 2개 | 저장본 (글에는 "직장·학교 프로필은 관리자가 정할 수 있음"만) |
| Edge 157 안정판: 2026-11-05 주 | learn.microsoft.com release schedule (`source-release-schedule.txt`) | 저장본 |

## 쓰지 않은 것

- 로그인 상태 화면(Copilot 창 대화, Journeys 스위치, Cowork·Browse with Copilot 실제 동작, 로그인 후 Help me rewrite 동작) → 계정 없음. 글에 "로그아웃 상태에서 시험"이라고 밝힘
- Windows·Mac 화면 → Linux판. Microsoft 도움말 경로가 운영체제 구분 없이 같다는 점만 씀
- Edge Android·iPhone 앱 화면 → 받을 수 없음. Journeys 도움말이 모바일도 같은 경로라고 쓴 것만 인용
- 그룹 정책·레지스트리·정책 파일로 끄기 → 독자 기준 0번, 관리자용
- Shopping 스위치(Save time and money with Shopping in Microsoft Edge), AI Theme Generator, 탭 정리 제안 → Copilot 이름이 붙은 기능이 아니라 범위 밖
