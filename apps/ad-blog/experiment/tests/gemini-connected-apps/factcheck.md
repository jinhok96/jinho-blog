# gemini-connected-apps — 브리프·사실 확인표

slug: `gemini-connected-apps`

## 작성 전 브리프

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `ai-settings` 뉴스 칼럼 (화제) |
| 주 검색어 | `gemini connected apps` — 자동완성 Google·Bing·YouTube 3곳 (2026-10-22 `demand_check.py suggest`). 하위: list·missing·not working·privacy·settings (Google) |
| 하위 검색어 | gemini connected apps list, gemini connected apps privacy, gemini connected apps settings, gemini connected apps missing, disconnect google apps from gemini, turn off gemini apps activity |
| 검색 의도 | 뉴스 + 정보형 (어디로 옮겨졌나, 무엇을 연결할 수 있나, 끊으면 무엇이 지워지나) |
| 채널 | 피드형 (뉴스 칼럼) |
| 상위 결과 (WebSearch `gemini connected apps customize menu`) | 9to5Google(대형 매체, 9-28 제한 배포 보도), blog.google(공식, 앱 추가 발표), Zapier(대형, 이전 경로 Settings > Personal Intelligence > Connected Apps), digitalcitizen.life(작은 블로그, 설정 가이드), GitHub 목록. 빠진 것: 공식 목록 83행의 지역·나이·계정 제한 집계, 연결 해제가 지우지 않는 데이터, Keep Activity 의존, 자동으로 쓰이는 Google 서비스, 도움말 문서끼리 경로가 다른 점 |
| 차별점 (독창 요소) | Google 공식 Connected Apps 표(support.google.com/gemini/table/17434654) 83행을 파싱해 회사 유형·카테고리·지역·나이·계정 유형별 집계(`parse_apps.py`) + 연결/해제/삭제 시 데이터 흐름 표 + 발표 타임라인 |
| 내부 링크 계획 | 나가는: `turn-off-gemini-in-gmail`(상시, 같은 클러스터)·`gemini-gems-to-skills`(상시, Skills)·`gemini-android-auto-personal-intelligence`(칼럼). 받는: `gemini-gems-to-skills`(색인됨) Skills 문단에 1문장 + `turn-off-gemini-in-gmail` 1문장 |
| 개요 | What happened / Who is affected / What changes for you / What to do now / Our take / What to watch next |
| 이미지 | 대표: 가운데 둥근 말풍선 허브에 여러 앱 타일이 관으로 이어지고 하나는 플러그가 빠진 장면, 연세이지 + 살구·자두색, 약간 높은 측면 시점. 본문: ① 83개 앱 회사 유형·지역 그래픽 ② 연결 해제 시 데이터 표 ③ 웹·모바일 메뉴 경로 그래픽 ④ 발표 타임라인 |

## 뉴스 유형·화제성

- 유형: 화제 (Google Workspace Updates 2026-10-21 "An easier way to customize how Gemini works for you", Gemini 릴리스 노트 2026.10.13 항목, 배포 10-13 시작 최대 15일)
- 화제성 (2026-10-23 06:30 KST): Google News 48시간 `Gemini connected apps` 59건, `Gemini customize connected apps` 21건. 같은 시점 다른 후보: ChatGPT Locked Chats 75건(openai.com·help.openai.com 403 → 1차 출처 확인 불가로 제외), iPhone Duo 출시 100건(같은 주제 칼럼 `iphone-duo-sold-out` 있음, 앱 소개 위주)

## 사실 확인표

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| Customize 허브: Skills + Connected Apps를 한곳에, 웹·모바일·Windows·macOS 데스크톱 앱, 모든 요금제, 전 세계 배포 | workspaceupdates.googleblog.com/2026/10/an-easier-way-to-customize-how-gemini-works-for-you.html (2026-10-21) | curl 본문 |
| 40개 넘는 외부 서비스, 대부분 미국 영어, 일부는 다른 영어권·브라질·인도 | 같은 글 + gemini.google/release-notes 2026.10.13 | curl 본문 |
| 배포: Rapid·Scheduled Release 모두 10-13 시작, 기능 표시까지 최대 15일 | 같은 글 | curl 본문 |
| 개인 계정·Workspace Individual·Workspace 고객 모두 대상, 관리자는 Admin console > Apps > Additional Google services > Gemini | 같은 글 | curl 본문 |
| 메뉴: 사이드바 Customize(없으면 More) → Discover·Connectors·Skills 탭 | support.google.com/gemini/answer/18736938, 13695044 (Computer·Android·iOS 탭) | curl 본문 |
| 연결 해제: Customize > Connectors > 앱의 More options > Disconnect | 13695044 | curl 본문 |
| 18세 이상, 로그인, 지원 언어·지역 | 18736938 | curl 본문 |
| Keep Activity 꺼지면 웹·iOS·워치에서 Connected Apps 사용 불가, Android는 Device assistance·Phone·Messages·WhatsApp만 | 13695044, Privacy Hub 13594961 | curl 본문 |
| 일부 Connected Apps는 자동으로 Gemini와 작동하도록 설계됨, Google Search·Flights·Hotels·Maps·YouTube 공개 정보는 자동 사용(Search는 Keep Activity 꺼도·로그아웃해도) | 13695044 | curl 본문 |
| 공유 데이터: 채팅 정보, 기기·환경설정, 위치, 앱 콘텐츠(이메일·파일·일정·사진·영상) | Privacy Hub #data_exchange | curl 본문 |
| 연결 해제는 Gemini Apps Activity를 지우지 않음, 외부 앱이 받은 데이터는 그 앱 정책대로 보관, Activity를 지워도 외부 앱 데이터는 남음 | Privacy Hub #data_exchange | curl 본문 |
| 사람 검토자가 본 채팅은 활동 삭제 후에도 최대 3년 보관(계정과 분리) | Privacy Hub | curl 본문 |
| Keep Activity 꺼도 72시간 보관 | Privacy Hub | curl 본문 |
| 커스텀 MCP 앱: Google이 감시·보호하지 않음, 18세 이상·미국·개인 계정, 웹에서만 추가 | 17209137, Privacy Hub | curl 본문 |
| 공식 목록 83행 (Productivity 40·Media 8·Design 7·Lifestyle 7·Travel 7·Local 5·Communication 4·Devices 2·Health 2·Finance 1), 미국 전용 28(위치 칸이 정확히 "US only"), 미국 + 일부 지역 3(OpenTable UK·US, Pandora 푸에르토리코·US, iHeartRadio 호주 등), 18세 이상 55, 개인 계정 전용 60 | support.google.com/gemini/table/17434654 (2026-10-23 받은 HTML) | `parse_apps.py` |
| 회사 유형 (우리 분류): Google 12, 휴대폰 기본·제조사 앱 20, 그 밖의 회사 51 (그중 미국 전용 27, 브라질 전용 4, 인도 전용 6, 18세 이상 45) | 같은 표 | `parse_apps.py` (소유 분류는 앱 이름 기준으로 우리가 붙임) |
| Experian(신용 점수)·Zocdoc(진료 예약)·Peloton: 개인 계정·18세 이상·미국 전용 | 같은 표 | `parse_apps.py` |
| 타임라인: 05-19 OpenTable·Canva·Instacart (릴리스 노트), 08-12 Made by Google 발표 묶음, 09-23 Adobe·Experian 등 묶음, 10-13 Customize(릴리스 노트), 10-21 Workspace 블로그 | gemini.google/release-notes, blog.google 2026-08-12·09-23 글 | curl 본문 |
| 도움말 경로 불일치: 커스텀 앱 문서(17209137)는 아직 Settings > Connected Apps(또는 Personal Intelligence > Connected Apps) | 17209137 | curl 본문 |
| 스킬 문서(17094296)는 스킬을 모바일·Mac·웹에서만 지원, Workspace 블로그는 Customize가 Windows 앱에도 | 17094296, Workspace 블로그 | curl 본문 (두 문서가 다름 → 본문에 밝힘) |

직접 실행: Google 계정이 없어 Gemini 앱의 Customize 화면은 직접 열지 못함 (본문에 문서·공식 목록 기반임을 밝힘).
