# 사실 확인표: google-phone-number-verification

## 작성 전 브리프 (2026-10-25 KST, 세션 48 뉴스 세션)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `ai-settings` 뉴스 칼럼 (Google 계정 개인정보 옵트아웃. 같은 클러스터 `google-gmail-photos-ads`와 같은 Google 계정 데이터·광고 축) |
| 뉴스 유형 | **영향** (화제 48시간 기준 미달: Google 발표가 아니라 기본값 발견 보도. 첫 보도 2026-10-14 Android Authority, 10-18~24 보도 이어짐, 기본값은 계속 유지 → 영향 기간 상시) |
| 주 검색어 | `phone number verification google` — `demand_check.py suggest` Google·Bing·YouTube 3곳 (하위 28개: `google phone number verification settings`(YouTube), `phone number verification google settings`·`google account`·`services`·`pixel`·`reddit`(Google)). Trends 미국 7일 `phone number verification` 평균 12.8 · `google account phone number` 5.2 · `remove phone number from google account` 0.0 · 기준 `remove background` 67.5 |
| 하위 검색어 | `google automatically verify phone numbers` (Google), `verify phone numbers automatically` (Google·YouTube), `remove phone number from google account` (3곳), `remove verified phone number from google account`, `can't remove phone number from google account`, `google accounts linked to my phone number` (Bing) |
| 검색 의도 | 뉴스 + 정보형 (무슨 일인지, 끄는 법, 이미 연결된 번호 지우는 법) |
| 채널 | 피드형 |
| 상위 결과 (WebSearch `phone number verification google settings android turn off`) | Kaspersky 블로그(보안 업체, 2026-07-22), Slashdot(요약), Android Authority(매체, 10-14), support.google.com/android/answer/7521240(공식), Malwarebytes(보안 업체, 10-20), Cyber Security News(작은 매체). 공통: 스위치 경로, 이미 연결된 번호는 계정마다 지워야 함. **빠진 것**: Google Account 도움말의 번호별 `Better ads and Google services`(광고 사용) 스위치, 번호를 지우면 복구 전화도 빠지니 다시 넣으라는 Google 절차, `Better sharing on Google` 자동 켜짐(한 계정만), Google 문서끼리 다른 표현(7521240 "add them to all" vs 3463280 "can be added" vs 7222352 "다른 계정에 쓰지 않는 번호를 쓰라"), 사용자 유형별 영향 |
| 독창 요소 | (1) Google 도움말 4개(7521240·3463280 Android판·7222352·183723) 문장 대조: 같은 Google 문서끼리 다른 말 (2) 스위치 3곳(기기 스위치·계정별 번호 삭제·번호별 광고 스위치) 효과 표 (3) 사용자 유형별 영향 표 (4) Google 도움말 화면 직접 캡처 (5) 보도 타임라인 |
| 내부 링크 계획 | 나가는 링크: 허브 `turn-off-ai-features`, 칼럼 `google-gmail-photos-ads`(같은 Google 계정 광고 설정). 받는 링크: `gemini-gems-to-skills`(색인됨, 개인·업무 계정 차이 문단 근처 → 끝 관련 글 문단에 1문장), `google-gmail-photos-ads`(My Ad Center 절에 번호별 광고 스위치 1문장) |
| 개요 | 첫 문단(결론) → What happened → Who is affected(표) → What changes for you → What to do now(번호 목록) → Our take → What to watch next → How we checked |
| 이미지 | 대표: 가운데 휴대폰 + 위에 SIM 칩 + 사람 실루엣 배지 3개가 빛나는 실로 연결, 둥근 가위가 실 하나를 자름 (모래 베이지 + 틸·베리 레드, 약간 낮은 정면). 본문: ① Google Android 도움말 "Turn phone number verification on or off" 화면 캡처 ② Google 문서 3곳 문장 대조 ③ 스위치 3곳 효과 ④ 보도 타임라인 |

### 화제성 신호 (2026-10-24 UTC 기준, H5 비교용)

- Google News RSS 30일 `Google "phone number" accounts Android linking` 60건 (10-14 Android Authority·SammyGuru → 10-15 NewsBytes·Windows Central 계열 → 10-16 CyberSecurityNews·Digit → 10-18 Android Central·Firstpost → 10-19 Android Police·BGR → 10-20 gHacks·Malwarebytes → 10-21 SlashGear → 10-22 Lifehacker → 10-24 Engadget), 같은 검색어 48시간 15건
- 48시간 화제 후보 비교: ChatGPT Locked Chats(48시간 38건, openai.com·help.openai.com 403 → 1차 출처 불가로 제외), iOS 27 사칭 위험 감지(3건, 9월 출시 기능), Verizon iPhone Duo 지연 $100 상품권(Verizon 사전 주문자만), Texas AG의 OpenAI 소송(소송 자체 → 제외), Gemini 4 Argon 가격(개발자 API → 제외), ChromeOS 156(Chromebook Plus 기능, 3건). Trends 급상승 RSS 10개는 스포츠·연예
- Google 공식 발표 없음. 2026-10-24까지 Google 공개 입장 찾지 못함 (Android Authority는 "reached out to Google")

## 사실 → 출처 → 확인 방법

| 주장 | 출처 | 확인 |
| --- | --- | --- |
| Android 기기를 설정하면 Google이 전화번호를 자동 인증 (번호가 여러 개면 모두) | support.google.com/android/answer/7521240 "When you set up an Android device, Google automatically verifies your phone number or numbers if you have more than one." | 2026-10-24 curl 원문 `source-android-7521240.txt` + Chromium 화면 캡처 |
| 기본값 켜짐, 인증한 번호를 기기에 로그인한 모든 Google 계정에 추가, 지금·앞으로의 계정과 번호 모두 | 7521240 Important: "phone number verification is turned on by default. We verify the phone number and add them to all Google Accounts that are signed in on the device. This applies to both current and future accounts and phone numbers." 예: 새 계정 → 기기의 모든 번호, 새 번호 → 모든 계정 | 같음 |
| 기기 설정에서만 관리 가능 | 7521240 "You can only manage phone number verification in device settings." | 같음 |
| 끄는 경로: Settings > Google > All services > Privacy & security > Phone number verification | 7521240 단계 | 같음. 스위치 이름 "Verify phone numbers automatically"는 Android Authority 보도(10-14)에만 있음 → 본문에 "Android Authority reported" |
| 주기적 재인증, 통신사 요금 발생 가능, 새 번호도 인증될 수 있음 | 7521240 "Google and your carrier will try to periodically reverify them. Carrier charges may apply." | 같음 |
| 인증이 돕는 기능: 전화번호 로그인, 계정 복구, 긴급 위치 서비스(Pixel 9 이후 위성), 기기 찾기·원격 잠금, RCS 메시지·영상 통화, Quick Share | 7521240 목록 | 같음. 끄면 어느 기능이 멈추는지는 문서에 없음 |
| 인증이 켜지면 Better sharing on Google도 켜짐, 여러 계정이면 한 계정만 | 7521240 "Manage Better sharing on Google" | 같음 |
| 계정별 번호 삭제 경로: Settings > Google > Manage your Google Account > Personal info > Phone > 번호 > Delete > Remove number | support.google.com/accounts/answer/3463280 (Android판) | `source-accounts-3463280-android.txt` |
| 번호별 "Better ads and Google services" 스위치: 번호를 Google 서비스 전반에서 관련성 높은 광고에 쓰게 함, 켜져 있으면 Usage에 "Across Google" 표시 | 3463280 "This setting lets your phone number to be used across Google services to show you ads more relevant to you." | 같음. 자동 추가된 번호의 기본값은 문서에 없음 → 본문에 "doesn't say" |
| "Across Google" 그만 쓰기: 번호 삭제 → Security > Recovery phone에서 다시 추가, 다른 서비스는 각자 다시 추가 | 3463280 "Stop using your number across Google" | 같음 |
| 3463280은 "can be added to any Google Account" (가능) | 3463280 "Any verified phone numbers for an Android device can be added to any Google Account that is signed into that device." | 같음. 7521240의 "add them to all"과 표현이 다름 |
| 3463280은 계정을 만들 때 번호를 알려 줄지 선택하는 것처럼 씀 | 3463280 "When you set up a Google Account, you can let Google know your phone's number. If you do, we'll verify..." | 같음 |
| 전화번호 로그인 도움말은 "나만 쓰는 번호, 다른 Google 계정 로그인에 쓰지 않는 번호, Photos 등에서 다른 사람과 연결에 쓰지 않는 번호"를 쓰라고 함 | support.google.com/accounts/answer/7222352 (Android판) | `source-accounts-7222352.txt` |
| 새 Android 기기에서 이메일·비밀번호 없이 로그인: 새 기기의 전화번호로 연결된 Google 계정을 찾아 보여 줌 (Skip password when possible 켜짐, 이전 기기 승인 또는 화면 잠금 암호 필요, 14일 이내 로그인) | 7222352 "You can't access the device you used to sign in" | 같음. "번호가 모든 계정에 붙으면 이 목록에 모두 나올 것"은 추론 → 본문은 "likely" |
| 복구 전화는 계정당 1개, 바꾸면 최대 7일 걸릴 수 있음, Google Voice 번호 쓰지 말 것 | 3463280 Tip, support.google.com/accounts/answer/183723 | `source-accounts-183723.txt` |
| 번호를 새로 넣으면 민감한 작업(비밀번호 변경) 인증에 쓰기까지 일주일 걸릴 수 있음 | 3463280 Important | 같음 |
| Google은 전화번호를 포함한 개인정보를 팔지 않음 | 3463280 끝 문장 | 같음 |
| RCS(Google 제공)는 전화번호·기기 식별자·SIM 번호를 쓰고 약 한 달 보관, SIM을 빼도 약 8일 작동 | support.google.com/messages/answer/9592174 | `source-messages-9592174.txt` |
| (보도) 2025년 8~10월 사이 도움말에 기본값·모든 계정 추가 문장이 추가됨 | Android Authority 2026-10-14 (Aamir Siddiqui) | 기사 원문 확인. web.archive.org는 컨테이너에서 연결 끊김(ws_closed_mid_exchange) → 보관본으로 직접 확인 못 함, 본문에 밝힘 |
| (보도) noreply-phone-verification@google.com 확인 메일, 끄면 앞으로의 연결만 멈춤, 스위치가 다시 켜진다는 Reddit 보고(AA는 재현 못 함), Google에 문의 | Android Authority 2026-10-14 | 기사 원문 |
| (보도) 2025년 9월 Google 시스템 업데이트 후 설정 중 기본 인증·주기적 재인증이 널리 보임, SMS 방식과 통신사 API 방식 | Kaspersky 블로그 2026-07-22 (Stan Kaminsky) | 기사 원문. 본문에는 "Kaspersky wrote"로만 |
| 2026-10-14 ~ 10-24 보도 이어짐 (Android Central 10-18, BGR 10-19, Malwarebytes 10-20, Lifehacker 10-22, Engadget 10-24) | Google News RSS 30일 | `gnews.py` 출력 (화제성 신호 위) |
| Google 공개 입장 없음 (2026-10-24 기준) | Google News RSS 14일 `Google statement phone number verification accounts` 등 | 찾지 못함 → "we found no public statement" |

## 쓰지 않은 것

- Google Play Services가 SIM 식별자·기기 메타데이터를 공유한다는 Reddit 주장 (BGR이 Reddit 사용자 주장으로 소개, 1차 출처 없음)
- 직장 계정 관리자가 개인 번호를 볼 수 있는지 (Workspace 관리자 도움말에서 확인 못 함)
- 기기별(Samsung 등) 메뉴 이름 차이: Malwarebytes 보도(검색 요약)만 → "menu names can differ by phone maker"로만, 출처 없이 단정하지 않음 → 본문에서 "Google services" 표기 가능성은 Android Authority 보도("Google (or Google services and preferences)")로 밝힘
- 사기 전화 차단 효과(Kaspersky가 "Google also recently confirmed"라고 씀, Google 원문 확인 못 함). Google 블로그 2026-06-02 fake call detection은 RCS·Phone by Google 기반이고 전화번호 인증 언급 없음
- 앱 화면 직접 실행: 컨테이너에 Android 기기·Google 계정이 없음 → How we checked에 밝힘
