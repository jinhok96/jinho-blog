# google-gmail-photos-ads — 브리프·사실 확인표

- 검증 유형 (가설 H3): **조사형** — 개인정보처리방침 판 비교·도움말 대조(How we checked). 설정 화면 확인 못 함
- 주 검색어 (가설 H6): `google personal intelligence` — 브리프 주 검색어

slug: `google-gmail-photos-ads`

## 2026-11-14 통합 + 상시 글 전환 (세션 97, 콘텐츠 정리 3번)

칼럼 2편(`google-gmail-photos-ads` 10-24 화제 · `gemini-android-auto-personal-intelligence` 10-20 화제)을 이 주소 하나의 상시 글로 합침. 남길 글: 두 글 모두 28일(10-17~11-14) 웹·Discover·뉴스·이미지 노출 0 → URL 검사 상태가 나은 이 글(`Discovered`, sitemap.xml) + AI 대표 이미지가 있는 쪽. 지운 글은 `vercel.json` 308 → 이 글. 아래 '뉴스 유형'(화제)·'검증 유형'(조사형) 줄은 규칙대로 유지(직접 실행한 내용 추가 없음 → 조사형 그대로).

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `ai-settings` 상시 글 (카테고리 `news` → `ai-tools`) |
| 주 검색어 | `google personal intelligence` 그대로 — 2026-11-14 `demand_check.py suggest`: Google·Bing·YouTube 3곳. 하위: `google personal intelligence settings`·`android auto`·`uk`·`europe`·`features`(Google), `google gemini personal intelligence`(Bing·YouTube), `what is google personal intelligence`(Bing). `turn off personal intelligence`·`turn off personal intelligence gemini`·`google`(Google만) |
| 검색 의도 | 정보형 + 설정 (어디서 끄나, Search와 Gemini가 같은 설정인가, 광고에 쓰이나, 차에서는) |
| 채널 | 검색형 |
| 상위 결과 (WebSearch `google personal intelligence settings turn off disconnect Gmail Photos`, 2026-11-14) | Google 도움말 16598406(공식)·Proton 블로그(경쟁 서비스)·techpp·itechify·memx·emelia(작은 블로그)·Android Authority(대형). 빈틈: ① Search와 Gemini 설정을 한 표로 나눈 글이 드묾(가이드마다 경로가 다름) ② 여러 글이 Gemini 웹의 옛 경로(**Settings & help**·스위치)를 그대로 씀 — 11-14 도움말은 **Settings** + **More options > Disconnect** ③ Android Auto로 설정이 따라가는 점·차 안 누구나 들음 ④ 지원 국가 수 |
| 차별점 | Search vs Gemini 설정 비교 표(연결 위치·앱·필수 설정·광고·학습·지워지지 않는 기록), 메뉴 경로 그림 4줄(Search 2 + Gemini + My Ad Center), 정책 4판 비교(10-24, 11-14 재실행 동일), 10-21 → 11-14 도움말 변화(웹 경로·Contacts 조건 삭제), 지원 국가 191곳(기존 194 오류 정정) |
| 제목 | `Google Personal Intelligence Settings in Search and Gemini` (57자, 주 검색어 앞, 하위 `settings` 포함. `How to Turn Off …` 10편·`… Settings and What …` 틀과 겹치지 않게) |
| 설명 | 154자 |
| 내부 링크 | 나가는: 허브 `turn-off-ai-features`, 상시 `turn-off-gemini-apps-activity`·`turn-off-gemini-on-android-phone`·`turn-off-gemini-in-gmail`·`remove-phone-number-from-google-account`·`chrome-autofill-settings`, 칼럼 `gemini-connected-apps`. 받는(교체): `gemini-connected-apps`·`gemini-free-flash-lite`·`gemini-gems-to-skills`(색인됨, 같은 문단 두 링크 → 하나)·`turn-off-gemini-on-android-phone`·`turn-off-gemini-apps-activity`. 같은 글로 두 번 가던 링크 정리: 허브 `turn-off-ai-features` 84행·`turn-off-gemini-in-gmail` 112행의 Android Auto 문장 삭제(같은 문단에 이 글 링크가 이미 있음) |
| 소제목 | 두 설정 비교(표·메뉴 그림) → Search에서 끊기 → Gemini 앱에서 끄기(설정별 효과 그림) → 광고에 쓰이나(정책 비교 그림·스위치 그림) → 연결 데이터로 하는 일 → Android Auto(데이터 흐름 그림) → 누가 쓸 수 있나 → 상황별 추천 → How we checked(통합 이력·정정) |
| 이미지 | 대표 이미지 그대로(`gmail-photos-ads-hero.webp`). 본문 5장: `personal-intelligence-menu-paths.webp`(새, Gemini 줄 추가), `gemini-settings-what-they-do.webp`·`gemini-car-data-flow.webp`(옮겨 다시 그림, `charts_gemini.py`: Contacts 조건 삭제·배포 문구 날짜·확인일), `google-privacy-policy-before-after.webp`·`gmail-photos-ads-switches.webp`(확인일만). 뺀 그림: 타임라인(뉴스 경과), 옛 메뉴 경로 |
| 지운 글 28일 검색어 | 없음 (`gemini-android-auto-personal-intelligence` 웹·Discover·뉴스·이미지 노출 0, URL 검사 `URL is unknown`) |

### 2026-11-14 재확인 사실 (Chromium 렌더링 사본 `source-*-2026-11-14.txt`)

| 주장 | 출처 (사본) | 확인 |
| --- | --- | --- |
| 개인정보처리방침 시행일 2026-10-16 그대로, 'unless you choose…' 문장·'Search may process … including ads' 문장 그대로. 판 4개 비교 결과 10-24와 같음 | `source-privacy-policy-2026-11-14.txt`, `policy_diff.py` 재실행 diff 0 | 일치 |
| Search 지원 국가·지역 **191곳**(10-24 목록과 차이 0). 10-24 글의 '194'는 지역 머리글 3줄(Americas·Asia-Pacific·Europe, the Middle East & Africa)을 함께 센 오류 → 본문 정정 | `source-websearch-16859283-…`, `search-pi-countries-2026-10-24.txt` | 정정 |
| UK·EEA 30개국·스위스·나이지리아 모두 Search 목록에 없음 | 같은 사본 | 확인 |
| Search 조건: 개인 계정·Personalized Recommendations 켬·앱 연결, 18세 이상. Calendar 미국 영어만, Photos 일부 지역. Photos는 Face Groups(내 얼굴 선택)·Estimate missing locations 필요 | 16859283 | 확인 |
| Ask Maps: 영어(미국·캐나다·인도·호주) + 힌디(인도)·일본어(일본)·인도네시아어·스페인어(멕시코)·포르투갈어(브라질)·프랑스어(캐나다), 연결 앱은 Gmail만 | 16859283 | 확인 |
| 학습: 받은편지함 직접 학습 안 함, 요약·발췌·추론으로 학습, 짧은 메일은 요약이 곧 메일. 사람 검토: 상호작용·요약·발췌, 계정 분리·개인정보 축소, Photos 미디어는 남용·피드백 때만. 광고 FAQ 문장 3개·민감 범주·광고주 접근 없음 | 16859283 | 확인 |
| 연결 해제는 Search Services History를 지우지 않고 그 데이터는 학습에 계속 쓰일 수 있음, activity.google.com | 16859283 | 확인 |
| 새 Search 설정은 'rolling out gradually over the next few months', 안 보이면 Web & App Activity. Personalized Recommendations 끄기 경로·google.com/search-personalization, 꺼도 Search Services History는 꺼지지·지워지지 않음 | 17026260·17025248 | 확인 |
| Gemini 조건: 18세 이상, 개인 계정(업무·학교·감독 계정 불가), Keep Activity 켬. EEA·나이지리아·스위스·영국 불가, Gems 등 일부 기능 불가, 앱·웹·Chrome·스마트워치 | 16598406 (Android) | 확인 |
| Gemini 연결 앱 6개(Contacts·Photos·Wallet 미국·Workspace·Search services·YouTube). **Contacts의 '미국·영어·AI Ultra' 조건은 16836988 11-14판에 없음**(세션 90 11-08 발견과 같음) | 16598406·16836988 | 변경 반영 |
| Gemini 웹 경로: Menu > **Settings** > Personal Intelligence > Connected Apps, 끊기 **More options > Disconnect**, 연결 **Add** (10-21 사본: Settings & help, 스위치). 앱 경로: Menu > 프로필 > Personal Intelligence > Connected Apps, 스위치 | 16598406 (Android, 10-21 사본과 diff) | 변경 반영 |
| 채팅별 끄기: Tools > Personal Intelligence, 채팅마다 기억·새 채팅은 켜짐, Activity 저장은 계속(임시 채팅). 삭제는 두 단계 모두 필요. 예전 연결은 'have been reset with the launch of Personal Intelligence with Connected Apps'. 공개 정보는 계속 사용 | 16598406 | 확인 |
| Photos 데이터로 관심사·사진 속 사람과의 관계·간 곳을 추론, 얼굴을 위치·시각과 연결. 새로 추가된 데이터도 접근. 연결 해제·앱 데이터 삭제는 Gemini Apps Activity를 지우지 않음, 반영까지 며칠 | 16836988 | 확인 |
| Keep Activity 기본 켜짐(18세 이상), 꺼도 72시간 보관, 기본 18개월 자동 삭제(3·18·36개월), myactivity.google.com/product/gemini, 'Turn off and delete activity' | 13278892 (데스크톱) | 확인 (데스크톱 판은 아직 'Settings & help > Activity' 표기 → 본문은 주소로 안내) |
| Gemini 채팅은 광고에 쓰이지 않음, 바뀌면 알림 | 13594961 | 확인 |
| Android Auto: 'rolling out starting today'(10-20)·Google built-in 차 'in the coming months'·'it comes with you into the car'·'only share personal responses when you're in the car with your phone connected'. 예시 3개(항공 게이트·병원 예약·사진 속 세차장) | `source-blog-android-auto-2026-10-20.txt` (11-14 렌더링) | 확인 |
| 차 안 누구나(어린이 포함) 사용, 환각 경고 문장, Android 11·RAM 2 GB·Gemini 기본 어시스턴트 | 16735982 | 확인 |
| Gemini가 대부분 모바일 기기에서 Assistant를 대체(2026) | androidauto 6348083 | 확인 |
| Gmail 'Smart features in other Google products'를 켜야 하는 기능 목록에 Gemini 앱·Search services의 Personal Intelligence, EEA·일본·스위스·영국 기본 꺼짐 | 15604322 | 확인 |
| My Ad Center 끄기 단계·끄면 맥락 광고(시간대·사이트 주제·현재 위치)·맞춤 주제·브랜드 삭제·로그인한 모든 기기의 Google 서비스 광고 | 12155656 | 확인 |
| 2017 블로그 'will not be used or scanned for any ads personalization' + 'Update, October 16, 2026' 문단 'that same subset of data can also be used to show ads' | `source-blog-gmail-2017-2026-11-14.txt`(본문)·`source-blog-gmail-2017-update-note-2026-11-14.txt`(curl 원문, 렌더링 본문에는 접혀 빠짐) | 확인 |
| 뺀 내용: SE Roundtable·Search Engine Land 보도(AI Mode 광고 테스트) — Google 발표가 아니고 날짜 지난 화제라 상시 글에서 뺌. 'Our take'·'What to watch next' → 상황별 추천 | - | 편집 |


## 작성 전 브리프

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `ai-settings` 뉴스 칼럼 (화제, Personal Intelligence = AI 개인화 설정) |
| 주 검색어 | `google personal intelligence` — 자동완성 Google·Bing·YouTube 3곳 (2026-10-23 `demand_check.py suggest`). 하위: settings·features·review·reddit (Google), what is (Bing). 뉴스 표현 `google gmail ads`(Google)·`google email ads`(Google·YouTube) |
| 하위 검색어 | google personal intelligence settings, google gmail ads, google email ads, google privacy policy gmail, google personal intelligence ads, disconnect gmail from google search |
| 검색 의도 | 뉴스 + 정보형 (무엇이 바뀌었나, 내 Gmail·사진이 광고에 쓰이나, 어떻게 막나) |
| 채널 | 피드형 (뉴스 칼럼) |
| 상위 결과 (WebSearch `Google Gmail Photos data ads Personal Intelligence how to opt out`, 2026-10-24) | techlicious(작은 매체)·Fast Company(대형)·relevantaudience(마케팅 블로그)·thekeyword(작은 매체)·SE Roundtable(업계 매체). 공통: "Gmail·Photos 데이터가 광고에 쓰일 수 있다", Google 답변 인용. 빠진 것: 개인정보처리방침 10-01판과 10-16판 문장 대조(바뀐 문장 4곳), 2017 Gmail 약속 글에 붙은 10-16 갱신 문단, 어떤 스위치가 무엇을 막는지(연결 앱 해제 / Personalized Recommendations / Gmail "Smart features in other Google products" / My Ad Center), Gemini 앱 채팅은 광고에 안 쓰인다는 Gemini 개인정보 허브 문장, 지원 국가 194곳(영국·EU 없음), 단계별 해제 경로 |
| 차별점 (독창 요소) | 정책 버전 4개(04-02·05-26·10-01·10-16) 문장 비교(`policy_diff.py`) + 스위치별 효과 표 + 지원 국가 집계 + 2017 → 2026 타임라인 |
| 내부 링크 계획 | 나가는: 허브 `turn-off-ai-features`, 상시 `turn-off-gemini-in-gmail`(Smart features in other Google products), 칼럼 `gemini-connected-apps`·`gemini-android-auto-personal-intelligence`. 받는: `gemini-gems-to-skills`(색인됨) 마지막 관련 글 문단 1문장, `turn-off-gemini-in-gmail` "How to stop the Gemini app from reading your Gmail" 끝 1문장, 허브 Google 검색 절 끝 1문장 |
| 개요 | What happened / Who is affected / What changes for you / What to do now / Our take / What to watch next |
| 이미지 | 대표: 봉투·사진 더미에서 빛나는 리본이 가격표 모양으로 모이고 옆에 큰 토글, 연한 페리윙클 배경 + 코랄·올리브, 약간 높은 정면 시점. 본문: ① 정책 문장 전후 비교 ② 스위치별 효과 표 ③ 타임라인(2017 → 2026-10) ④ 메뉴 경로 |

## 뉴스 유형·화제성

- 유형: 화제 (정책 시행 2026-10-16, 보도는 10-23에 집중. Google 2017 블로그 글 갱신 문단 날짜 2026-10-16)
- 화제성 (2026-10-24 06:30 KST): Google News 48시간 `Google Gmail Photos ads privacy policy` 25건(Android Authority·Ars Technica·9to5Google·The Verge·How-To Geek 등 10-23 보도). 같은 시점 다른 후보: iOS 27.1(iPhone Duo 전용, 47건, 독자 행동 없음), Chrome 오디오 음소거(Mashable 단독, 1차 출처 미확인), ChatGPT Ads 26개국 확대(openai.com 403, 미국 독자 영향 적음), Gemini Notebook 앱 연동(36건, 주로 Workspace)
- backlog 기존 보류 행 "Google 광고에 Gmail·Photos 정보 사용"(10-20 보도만) → 10-16 정책 원문·Google 도움말 FAQ·2017 블로그 갱신으로 1차 출처 확보

## 사실 확인표

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| 현재 개인정보처리방침 시행일 2026-10-16, 직전 판 2026-10-01 | policies.google.com/privacy?hl=en-US, /privacy/archive (목록) | curl 본문 |
| 10-01판: "We don't show you personalized ads based on your content from Drive, Gmail, or Photos." | policies.google.com/privacy/archive/20261001 | curl, `policy_diff.py` |
| 10-16판: 같은 문장 + "unless you choose to make data from these services available to other Google services that support personalized ads." | 현재 판 | curl, `policy_diff.py` |
| 10-16판: 광고 근거 "interests and activity across Google services" → "interests, activity, or personalized content from Google services" | 두 판 | `policy_diff.py` |
| 10-16판 새 문장: Search·Gemini Apps 등이 Photos·Gmail·Drive 데이터에 접근하도록 허용할 수 있음, "Search may process some of the data that you allow Search to access to personalize content, including ads." | 현재 판 | `policy_diff.py` |
| 04-02·05-26·10-01판은 Gmail·Photos 약속 문장 동일, Personal Intelligence 언급 0회. 10-16판 2회 | 각 보관본 | `policy_diff.py` → `policy-sentences.md` |
| 2017-06-23 Google 블로그: 소비자 Gmail 콘텐츠를 광고 개인화에 쓰거나 스캔하지 않음. 2026-10-16 갱신 문단: 연결 기능을 켜면 Workspace 앱 데이터 일부가 설정에 따라 광고에도 쓰일 수 있음 | blog.google/products-and-platforms/products/gmail/g-suite-gains-traction-in-the-enterprise-g-suites-gmail-and-consumer-gmail-to-more-closely-align/ | curl 본문 |
| Google FAQ: "Ads will not be based directly on your Gmail inbox or your Google Photos library." 요약·발췌·추론이 광고에 쓰일 수 있음, 민감 범주 광고 없음, 광고주는 Gmail·Photos에 접근 못 함 | support.google.com/websearch/answer/16859283 (Common questions) | curl 본문 |
| 연결 앱: Workspace(현재 Gmail·Calendar)·Google Photos. Calendar는 미국 영어만, Photos는 일부 지역 미지원 | 16859283 | curl 본문 |
| 연결하면 모든 Search services(Search·AI Mode·Discover·Maps·Ask Maps·Shopping·Flights·Hotels·Translate·News)가 접근 | 16859283 Note | curl 본문 |
| 조건: 개인 Google 계정, 18세 이상, Personalized Recommendations 켬, 앱 연결 | 16859283 What you need·Availability | curl 본문 |
| 지원 국가·지역 194곳 (미국·캐나다·인도·일본·한국·호주·브라질·멕시코 포함, 영국·아일랜드·독일·프랑스·스페인·이탈리아·폴란드·노르웨이·스위스 없음) | 16859283 Supported countries & territories | curl 파싱 → `search-pi-countries-2026-10-24.txt` |
| 연결 경로: Google Account > Search Services Personalization > Additional Personal Intelligence Connected Content Apps > Connect | 16859283 | curl 본문 |
| Gmail "Smart features in other Google products"를 켜야 개인화 응답 (Gmail Settings > See all settings > General > Manage Workspace smart feature settings) | 16859283 | curl 본문 |
| 연결 해제·앱 데이터 삭제는 Search Services History를 지우지 않음, 그 데이터는 AI 학습 등에 계속 쓰일 수 있음 (activity.google.com에서 삭제) | 16859283 | curl 본문 |
| 연결하면 사람 검토자가 일부 상호작용·요약을 봄 | 16859283 | curl 본문 |
| Personalized Recommendations 끄기: Google Account > Data & privacy > Personalization settings > Personalized Recommendations in Search services (또는 google.com/search-personalization). 새 설정은 몇 달에 걸쳐 배포, 안 보이면 Web & App Activity가 제어 | support.google.com/websearch/answer/17026260, 17025248 | curl 본문 |
| Search services에 Chrome·Gemini Apps·Assistant·YouTube는 포함 안 됨 | 17025248 | curl 본문 |
| My Ad Center: Personalized ads On/Off. 끄면 Google 서비스 광고는 맥락 기반, 맞춤 주제·브랜드 설정 삭제, 로그인한 모든 기기에 적용 | support.google.com/My-Ad-Center-Help/answer/12155656 | curl 본문 |
| Gemini Apps 채팅은 광고에 쓰이지 않음, 바뀌면 알림 | support.google.com/gemini/answer/13594961 | curl 본문 |
| (보도) Google이 Personal Intelligence로 앱을 연결한 사용자 대상 AI Mode 광고 테스트 시작, 3월엔 광고 없다고 함 | Search Engine Land 보도 인용 SE Roundtable 2026-10-19 | WebFetch (보도로만 표기) |
| Gmail 끄기 경로 상세 | 기존 글 `turn-off-gemini-in-gmail` factcheck (support.google.com/mail/answer/15604322) | 상시 글 요약 |

## 직접 실행하지 못한 것

- Google 계정이 없어 Search Services Personalization·My Ad Center 화면을 직접 열지 못함 → 단계는 Google 도움말 기준으로 쓰고 본문 How we checked에 밝힘

## 갱신 2026-11-26 (세션 105, 주간 SEO 점검 11-22 우선순위 1: Gemini 'History' 개정)

`source_diff.cjs --slug google-gmail-photos-ads --save` (2026-11-25 UTC): 출처 15개 중 바뀜 6 · 그대로 9. 바뀐 6개 중 내용 변화는 4개(13278892·13594961·16836988·16859283). `privacy-policy`는 머리 메뉴 이름만('Privacy & Terms' → 'Privacy Policy'), `blog-gmail-2017-update-note`는 비교가 렌더링 본문을 받아 생긴 차이(원문 HTML에 'Update, October 16, 2026' 문단 그대로 → 새 사본을 curl 원문 추출본으로 바꿈). 그대로: 16598406(Android·컴퓨터, 'Have Keep Activity on' 옛 이름 유지)·16735982·androidauto 6348083·gmail 15604322·myadcenter 12155656·websearch 17025248·17026260·blog android auto

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| Keep Activity → **History**, 웹 경로 Settings > History(또는 myactivity.google.com/product/gemini), 끄기 On > Turn off / Turn off and delete history, 18세 이상 기본 켜짐 | https://support.google.com/gemini/answer/13278892?hl=en&co=GENIE.Platform%3DDesktop | [source](source-gemini-13278892-activity-desktop-2026-11-26.txt) 'Turn off History' 절 |
| History를 꺼도 대화는 계정에 **약 2개월** 저장(이전 72시간) | 같은 페이지 | "Even when History is off, your conversations will be saved with your account for around two months" |
| History가 꺼지면 쓸 수 있는 앱은 Device assistance·Gemini Notebook·Messages·Phone·WhatsApp뿐 | 같은 페이지 'When History is off' | 원문 대조 |
| Privacy Hub 'Last updated: November 24, 2026', History 꺼짐 시 '약 2개월'·'Some Connected Apps are unavailable', 기본 18개월 자동 삭제 | https://support.google.com/gemini/answer/13594961?hl=en | [source](source-gemini-13594961-privacy-hub-2026-11-26.txt) 'What does the History setting control?' |
| 연결 앱 데이터 페이지: 'Gemini History', 'if your History setting is on' | https://support.google.com/gemini/answer/16836988?hl=en | [source](source-gemini-16836988-connected-apps-data-2026-11-26.txt) |
| Personal Intelligence는 Keep Activity(=History)가 꺼지면 쓸 수 없음 — 16598406은 아직 옛 이름 | https://support.google.com/gemini/answer/16598406?hl=en | 11-14 사본 "Have Keep Activity on. This feature isn’t available when this setting is off." + source_diff 11-25 '바뀌지 않음' |
| Search 연결 앱: Workspace(Gmail·Calendar·**Drive**), Photos, **Google Wallet**, Gemini Apps(coming soon). Calendar·Drive는 미국 영어만, Photos·Wallet은 일부 지역 불가, Personalized Recommendations 필요, 연결 위치 그대로 | https://support.google.com/websearch/answer/16859283?hl=en | [source](source-websearch-16859283-personal-intelligence-2026-11-26.txt) 326~373행 |
| Search 지원 국가·지역 목록은 11-14와 같음(191곳) | 같은 페이지 | 11-14·11-26 사본 20~224행 diff 0 |
| 2017 Gmail 글 'Update, October 16, 2026' 문단 유지 | blog.google 2017 글 | curl 원문 HTML 추출 [source](source-blog-gmail-2017-update-note-2026-11-26.txt) |

- 바꾼 곳 (한 가지 변경 = 정확성 갱신, 검증 기록 없음): 둘째 문단 재확인 날짜·이유, 비교 표 3칸(Search 앱 목록·Gemini 필수 설정·지워지지 않는 기록), Search 단계 2(Wallet·Gemini chats coming soon), Gemini 절 머리말·단계 3·5(새 경로·약 2개월·꺼지면 남는 앱·옛 이름 안내), 그림 2장 다시 그림(`charts_gemini.py`: 'Saved to your Gemini History', 표 'Turn off History'·footer 약 2개월) + alt 2곳, Deleting 줄, 연결 글 문장, 추천 '아무것도 원하지 않음', 이용 조건 Search 줄(Drive·Wallet), How we checked 11-25 줄. `updatedAt` 2026-11-14T17:50Z → 2026-11-25T19:10Z
- 쓰지 않은 것: Google 11-23 'A more tailored Google Search' 발표 — blog.google에서 원문을 찾지 못해(WebSearch 1회) 날짜·내용을 쓰지 않고 도움말 현재 문구만 씀. Gemini chats 연결은 'coming soon'이라 단계로 쓰지 않음
