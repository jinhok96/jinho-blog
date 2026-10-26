# turn-off-gemini-apps-activity — 브리프·사실 확인표

slug: `turn-off-gemini-apps-activity`

## 작성 전 브리프

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `ai-settings` 상시 글 (backlog 클러스터 공백 후보, `gemini-connected-apps` 칼럼 후속) |
| 주 검색어 | `turn off gemini apps activity` — 2026-10-26 `demand_check.py suggest`: Google·Bing에 본 검색어, YouTube에 `how to turn off gemini apps activity` (3곳). 하위 26개 |
| 하위 검색어 | `what happens if i turn off gemini apps activity`·`what does turning off gemini apps activity do`·`should i turn off gemini apps activity`(Google), `turn off gemini apps activity android`(Google), `can t turn on gemini apps activity`(Google), `gemini apps activity settings`(Bing) |
| 수요 비교 (Trends, 미국) | 3개월 기준 `remove background` 35.5 대비 `turn off galaxy ai`·`gemini apps activity`·`turn off ai overviews`·`turn off ai in acrobat` 모두 0.0. 후보끼리 12개월: `gemini apps activity` 평균 36.3(최근 6.6) · `turn off galaxy ai` 35.1(최근 21.0) · `turn off ai in chrome` 26.8(33.4, 우리 노출 1위 글) · `turn off ai overviews` 0.9 · `turn off ai in acrobat` 0.2 |
| 고른 이유 | Galaxy AI가 최근 수요는 더 크지만 상위 결과가 Tom's Guide·Android Central·AOL·Android Authority 같은 대형 매체로 차 있고 기기가 없어 One UI 9 메뉴를 확인할 수 없음. Gemini 활동은 상위 결과가 공식 도움말 + 작은 블로그 위주이고, 컨테이너 Chromium으로 Google 도움말 원문(접힌 단락 포함)을 모두 받을 수 있음. 이미 색인된 같은 클러스터 글 `gemini-gems-to-skills`에서 링크를 받을 수 있음 |
| 검색 의도 | 정보형 How-to + 설명 (끄는 법 + 끄면 무엇이 달라지나) |
| 채널 | 검색형 |
| 상위 결과 (WebSearch `turn off gemini apps activity what happens`, 2026-10-26) | support.google.com 13278892(공식), redact.dev(작은 블로그, 2026-09-21, 72시간·Memory·3년 보관·이름 변경까지 다룸), reclaimthenet.org(작은 매체), techlicious.com(2025-06-27, "끄면 사람 검토 안 함"이라고 씀 → Google은 꺼도 보호 목적 사람 검토가 있다고 함), PCWorld(대형 매체). 빠진 것: 끄면 멈추는 기능 전체(최근 채팅 목록·Memory·Personal Intelligence·skills·Tasks·Connected Apps·지도/YouTube 정보·Gem 채팅), Android와 웹의 Connected Apps 차이와 문서끼리 다른 앱 목록(Gemini Notebook), 피드백을 보내면 최근 24시간 대화가 함께 가서 3년 보관, Turn off vs Turn off and delete vs 자동 삭제 3개월 vs 임시 채팅, 회사·학교 계정은 관리자만 |
| 차별점 | Google 도움말 13개 + Google 블로그 1개를 2026-10-26에 Chromium으로 렌더링해 접힌 단락까지 대조한 "켜짐 vs 꺼짐" 기능 표, 문서 충돌(앱 목록)을 그대로 밝힘, 보관 기간 4가지 그래픽 |
| 내부 링크 계획 | 나가는: 허브 `turn-off-ai-features`, 상시 `gemini-gems-to-skills`(skills), `turn-off-gemini-in-gmail`(Gmail·Docs의 Gemini는 별도 설정), 칼럼 `gemini-connected-apps`(Connected Apps), `gemini-android-auto-personal-intelligence`(차). 받는: `gemini-gems-to-skills`(색인됨) skills 요구 조건 목록 뒤 1문장, 허브 `turn-off-ai-features` Gemini 절 1문장, 칼럼 `gemini-connected-apps` Keep Activity 줄 뒤 1문장 |
| 개요 | 도입(답: 메뉴 경로 + 끄면 생기는 일 요약) → 요약 표 → `## How to turn off Gemini Apps Activity on a computer` → `## How to turn it off in the Gemini app on Android or iPhone` → `## Turn off or Turn off and delete activity?` → `## What stops working when Keep Activity is off` → `## What Google still keeps after you turn it off` → `## Middle options: auto-delete and temporary chats` → `## Work and school accounts` → `## FAQ`(can't turn on) → `## Which setting should you use?` → `## How we checked` |
| 이미지 | 대표: 꺼진 토글 스위치 + 말풍선 카드가 든 서류함(새 말풍선은 닿기 전에 사라짐) + 자물쇠, 세이지 그린 배경 + 네이비·라즈베리, 눈높이 정면. 본문: ① Google 도움말 "Turn off Keep Activity" 화면 캡처 + accent 상자 ② 켜짐 vs 꺼짐 기능 표 ③ 보관 기간 4가지 카드 |

## 사실 확인표

원문은 이 폴더의 `source-*.txt` (2026-10-26 15:34~15:41 UTC, `render.cjs`로 Chromium 렌더링, 접힌 단락 펼침). Google 계정이 없어 Gemini 앱 화면은 직접 열지 못함 → 본문 How we checked에 밝힘.

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| 컴퓨터: gemini.google.com → Settings & help > Activity → 위쪽 On > Turn off 또는 Turn off and delete activity. myactivity.google.com/product/gemini로도 감 | support.google.com/gemini/answer/13278892 (Computer) | `source-gemini-13278892-desktop.txt`, 화면 캡처 `help-13278892-turn-off.png` |
| Android·iPhone Gemini 앱: 왼쪽 위 Menu > 프로필 사진(또는 이니셜) > Gemini Apps Activity → 위쪽 On > Turn off 또는 Turn off and delete activity. 휴대폰 브라우저의 gemini.google.com은 Menu > Settings & help > Activity | 13278892 (Android·iPhone 탭) | `source-gemini-13278892-android.txt`, `-ios.txt` |
| 18세 이상이면 Keep Activity 기본 켜짐 | 13278892 | 같은 원문 |
| 꺼도 Gem은 계정에 저장, Gem으로 한 채팅은 저장 안 됨 | 13278892 | 같은 원문 |
| 꺼도 대화는 최대 72시간 계정에 저장(서비스 제공·피드백 처리), Activity에는 안 보임 | 13278892, Privacy Hub 13594961 #retention | 원문 |
| 꺼진 상태에서 쓸 수 있는 앱: Device assistance·Gemini Notebook·Messages·Phone·WhatsApp (13278892) vs Android에서만 Device assistance·Phone·Messages·WhatsApp, 웹·iOS·스마트워치는 Connected Apps 없음 (13695044) vs Android에서 Phone·Messages·WhatsApp·Device assistance (Privacy Hub) → **문서끼리 Gemini Notebook 포함 여부가 다름** | 13278892, 13695044, 13594961 | 원문 대조 |
| 스마트워치에서는 꺼지면 통화·메시지 앱도 안 됨 | 13594961 | 원문 |
| Keep Activity를 다시 켜면 이전에 연결한 앱 접근이 돌아옴 | 13594961 | 원문 |
| Google Flights·Hotels·Maps·YouTube 공개 정보는 Keep Activity가 켜져 있어야 씀, Google Search 공개 정보는 꺼져도·로그아웃해도 씀 | 13695044 | `source-gemini-13695044-desktop.txt` |
| 최근 채팅 찾기·검색·고정·이름 바꾸기·분기는 개인 계정에서 Keep Activity가 켜져 있을 때만 | 13666746 | `source-gemini-13666746-desktop.txt` |
| 과거 채팅 기억(Memory): 18세 이상, 개인 계정, Keep Activity 켜짐 필요 (꺼지면 사용 불가). 경로 Settings & help > Personal Intelligence > Memory | 16598469 | `source-gemini-16598469-desktop.txt` |
| Google 앱 연결 개인화(Personal Intelligence): Keep Activity 켜짐 필요 | 16598406 | `source-gemini-16598406-desktop.txt` |
| skills 만들기·쓰기: Keep Activity 켜짐 필요 | 17094296 | `source-gemini-17094296-desktop.txt` |
| Tasks(원격 브라우저·컴퓨터)는 Keep Activity가 켜져 있을 때만 | 13594961 #agent_browser_data | 원문 |
| Gem에 Drive 파일을 넣으려면 Keep Activity 켜짐 + Google Workspace 연결 | 15146780 | `source-gemini-p-pn_gems.txt` |
| 켜짐: 채팅·업로드·화면, 오디오·Live 영상·화면 공유, 피드백, Gemini로 방문한 웹사이트 정보, 사용 정보, 위치 정보 저장. AI 학습 포함 서비스 개선에 쓰이고 사람 검토, 검토된 데이터는 계정과 분리돼 3년 보관. 18개월 자동 삭제(3·36개월·안 지움 선택) | 13594961 #keep_activity_setting | 원문 |
| 꺼짐: 앞으로의 채팅은 Activity에 안 보이고 피드백을 보내지 않으면 AI 학습에 안 쓰임. 72시간 보관 | 13594961 | 원문 |
| 꺼도 Google은 채팅을 응답·보호(사람 검토 포함)에 씀. Gemini 설정은 익명화 데이터 생성 처리를 통제하지 않음 | 13594961 #pn_config_settings, #human_review | 원문 |
| 72시간 보관 중 최근 24시간 대화를 맥락으로 응답에 씀 | 13594961 #retention | 원문 |
| 꺼진 상태에서 피드백을 보내면 피드백 + 최근 24시간 채팅 + 그 안의 업로드·Connected Apps 데이터를 수집, 전문 팀이 검토, 계정과 분리해 최대 3년 보관 | 13594961 #retention, #feedback | 원문 |
| 활동을 지워도 사람 검토자가 본 채팅(언어·기기·위치·피드백 포함)은 최대 3년 보관 | 13594961 #pn_retain_data, #keep_activity_setting | 원문 |
| Keep Activity를 끄거나 활동을 지워도 다른 Google 서비스 데이터는 안 지워짐. Search Services History·Web & App Activity·Timeline 같은 설정은 그대로 | 13594961 | 원문 |
| Gem 대화를 지워도 Gem은 안 지워짐, 공유한 채팅을 지워도 공개 링크는 남음, Live 활동을 지우면 오디오·영상·화면 공유도 지워짐 | 13278892 | 원문 |
| 자동 삭제 기본 18개월, 3·18·36개월 또는 Don't auto-delete activity. 경로 Activity 위쪽 "Deleting activity older than … months" 또는 "Choose an auto-delete option" | 13278892 | 원문 |
| 오디오·Live 영상·화면 공유로 서비스 개선 설정은 기본 꺼짐, 켜려면 Keep Activity가 켜져 있어야 함 | 13278892, 13594961 #audio_live | 원문 |
| 임시 채팅: Activity·최근 채팅에 안 남음, 72시간 보관, AI 학습에 안 쓰임. 개인 계정·웹/모바일 앱만(Chrome의 Gemini·Messages의 Gemini 불가). 임시 채팅에서는 Gems·Keep Activity가 필요한 Connected Apps·개인화·피드백 불가. 웹: New chat 옆 Temporary chat | 13275745, 13594961 #retention | `source-gemini-13275745-desktop.txt` |
| 회사·학교 계정: Keep Activity 기본 켜짐, Workspace 관리자만 끌 수 있음, 기본 18개월 | 14620100 | `source-gemini-14620100.txt` |
| 앱 연결 해제·연결 앱 데이터 삭제는 Gemini Apps Activity를 지우지 않음, 그 데이터는 검토 전이면 활동 삭제로 앞으로의 개선 사용을 막을 수 있음 | 16836988 | `source-gemini-p-pn_pi_consent.txt` |
| 2025-08-13 Google 블로그: "In the coming weeks, your 'Gemini Apps Activity' setting will be renamed 'Keep Activity.'" | blog.google/products-and-platforms/products/gemini/temporary-chats-privacy-controls/ | `source-blog-google-2025-08-13-temporary-chats.txt` (curl, datePublished 2025-08-13) |
| 현재 도움말이 두 이름을 같이 씀 (설정 이름 Keep Activity, 메뉴·페이지 이름 Gemini Apps Activity, Android 단계 한 곳은 "Gemini App Activity") | 13278892 | 원문 |
| 피드백: 응답 아래 Good response·Bad response, 선택 사항으로 이유·추가 의견·업로드 파일 첨부 후 Submit. 피드백을 보내면 관련 대화·업로드·Connected Apps 개인 콘텐츠가 함께 수집됨 | support.google.com/gemini/answer/13275746 (Computer) | `source-gemini-13275746-desktop.txt` |
| Android에서 Gemini가 열리지 않게: Gemini 앱 Menu > 프로필 > Settings > Talk to Gemini hands-free에서 "Hey Google" 끄기, 휴대폰 Settings > System > Gestures > Press & hold power button, Settings > Apps > Default apps > Digital assistant app (기기마다 다름). 앱을 지워도 기본 어시스턴트는 그대로. Workspace 앱의 Gemini는 Workspace smart features 설정 | support.google.com/gemini/answer/16938321 | `source-gemini-16938321.txt` |
| Privacy Hub 마지막 갱신 2026-10-23 | 13594961 | 원문 머리말 "Last updated: October 23, 2026" |

쓰지 않은 것: 18세 미만·Family Link 계정의 기본값(공식 문장 확인 못 함), Gemini 앱 화면 안의 정확한 버튼 위치(계정 없음, 도움말 문장만 씀), Keep Activity 끄기가 Saved info(Instructions)에 주는 영향(문서에 없음).
