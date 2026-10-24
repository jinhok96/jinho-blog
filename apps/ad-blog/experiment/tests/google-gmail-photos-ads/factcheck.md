# google-gmail-photos-ads — 브리프·사실 확인표

slug: `google-gmail-photos-ads`

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
