# 사실 확인표: remove-phone-number-from-google-account

## 작성 전 브리프 (2026-10-26 KST, 세션 50 일반 세션)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `ai-settings` 상시 글 (Google 계정 개인정보 옵트아웃. 같은 클러스터 칼럼 `google-phone-number-verification`의 후속 상시 검색, backlog 클러스터 공백 후보) |
| 주 검색어 | `remove phone number from google account` — `demand_check.py suggest` 2026-10-25: 본 검색어 Google·Bing·YouTube 3곳, 하위 23개. 3곳에 나오는 변형 중 가장 구체적(`remove ... from google account iphone`은 Google 1곳뿐). Trends 미국 3개월: 본 검색어 0.0 · `turn off galaxy ai` 0.0 · `turn off ai overviews` 0.0 · `google account phone number` 2.8 · 기준 `remove background` 35.5 |
| 하위 검색어 | `delete phone number from google account`(Google·YouTube), `remove my phone number from google account`·`remove old phone number from google account`(Google·Bing), `can't remove`·`cannot remove`·`unable to remove phone number from google account`(Bing·Google·YouTube 각 1곳), `remove recovery phone number from google account`(Google·YouTube), `remove verified phone number from google account`(Google), `remove phone number from google account iphone`(Google), `remove phone number from gmail account`(YouTube), `remove phone number from google voice account`(Bing) |
| 검색 의도 | 정보형 How-to (+ Fix: 지워지지 않을 때) |
| 채널 | 검색형 (제목 60자 이내) |
| 상위 결과 (WebSearch 2026-10-25 `remove phone number from google account`) | maketecheasier(작은 매체, How-to), analyticsinsight(작은 매체, 웹스토리 포함), oryon.net 지식 베이스(작은 블로그), data.mbrp.com·vserver-backup.adiscon.com·auth.dbr77.com(스팸성, Google Business 혼동). `can't remove ...`: justanswer(포럼), Samsung 커뮤니티(다른 문제), Malwarebytes(보안 업체 칼럼), support.google.com 3463280. 공통: Personal info > Phone > Delete, 복구 전화·2단계 인증을 따로 확인. **빠진 것**: 현재 메뉴 이름(2026-10 Google 도움말은 `Security & sign-in` > `How you sign in to Google`), Personal info에서 지우는 것과 Recovery phone에서 지우는 것의 차이(복구 전화를 지워도 다른 서비스에서 쓰일 수 있음), `Better ads & Google services`로 번호는 두고 광고 사용만 끄기, Android 전화번호 인증이 번호를 다시 붙이는 문제, 지우지 못하는 원인별 해결(평소 기기·위치, 다음 주 재시도, 직장 계정 관리자, Google Voice 번호), 지운 뒤 7일간 이전 번호로 코드가 갈 수 있음 |
| 차별점 | (1) Google 도움말 11개 문서를 2026-10-25 Chromium으로 렌더링해 접힌 단락까지 대조 → 번호가 들어가는 곳 6곳과 각 위치에서 지울 때 효과 표 (2) 지워지지 않는 원인 → 해결 표(Google 문서 문장 근거) (3) 지운 뒤 일정(7일·1주·90일) 그래픽 (4) 도움말 화면 캡처. 직접 계정 화면 실행은 불가(Google 계정 없음) → How we checked에 밝힘 |
| 내부 링크 계획 | 나가는 링크: 허브 `turn-off-ai-features`, 칼럼 `google-phone-number-verification`(번호가 모든 계정에 붙는 이유), 칼럼 `google-gmail-photos-ads`(광고 설정). 받는 링크: `gemini-gems-to-skills`(색인됨, 끝 관련 글 문단의 전화번호 문장에 이어서), `google-phone-number-verification`(What to do now 5번 뒤 "중간 옵션" 문단), 허브 `turn-off-ai-features`(Google 검색 절 광고 문단 끝) |
| 개요 | 도입(답 + 조사 범위) → 요약 표(번호가 있는 곳·지우는 곳·효과) → Before you remove → computer / Android / iPhone 단계 → recovery phone → 2-Step Verification → keep the number but stop ads → stop Android adding it back → Why you can't remove → What happens after → FAQ(숨기기, Google Voice) → Which option → How we checked |
| 이미지 | 대표: 가운데 프로필 배지 + 사슬에 걸린 수화기 모양 장식 3개, 하나가 떨어져 둥근 휴지통으로 (연한 라일락 + 민트·탠저린, 3/4 시점. 최근 4장: 버터 노랑 아이소메트릭·모래 베이지 낮은 정면·세이지 위에서·페리윙클 높은 정면과 겹치지 않음). 본문: ① Google 도움말 "Add, update or remove phone number" 화면 캡처 + accent 상자 ② "Change a recovery phone number" 펼친 단락 캡처(복구 전화를 지워도 다른 서비스에 남을 수 있다는 Tip) ③ 지워지지 않을 때 원인 → 해결 ④ 지운 뒤 일정. 번호가 들어가는 6곳 그래픽은 도입 요약 표와 겹쳐 뺌 |

## 사실 → 출처 → 확인 방법

원문은 모두 2026-10-25(UTC) `render.cjs`로 Chromium 렌더링, 접힌 단락의 숨김 스타일을 풀어 저장 (`source-*.txt`).

| 주장 | 출처 | 확인 |
| --- | --- | --- |
| 컴퓨터: Google Account > Personal info > Phone > 번호 > Delete > Remove number, 상자의 안내를 따름 | accounts/answer/3463280 (Desktop) "Add, update or remove phone number" | `source-accounts-3463280-desktop.txt`, 화면 캡처 `help-3463280-remove-number.png` |
| Android: Settings 앱 > {이름} > Manage your Google Account > Personal info(위) > Phone > 번호 > Delete > Remove number | 3463280 (Android) | `source-accounts-3463280-android.txt` |
| iPhone·iPad: Gmail 앱 > 오른쪽 위 프로필 > Manage your Google Account (Gmail이 없으면 myaccount.google.com) > Personal info > Phone > 번호 > Remove phone number > Remove number | 3463280 (iOS) | `source-accounts-3463280-ios.txt` |
| 계정에서 번호를 바꿔도 일부 서비스에만 영향, 다른 서비스는 각 설정에서 바꿈(2-Step Verification, Calendar, Chrome, Google Pay, Google My Business) | 3463280 "Note: Changing the number ... only affects some Google services", "Other Google services that use phone numbers might not be listed on that page" | 같음 |
| Phone 페이지의 번호 아래 Usage에 그 번호를 쓰는 일부 서비스가 표시 | 3463280 (Android) "Under your phone number, next to 'Usage,' you'll see some services that use your phone number" | 같음 |
| Better ads & Google services: 번호를 Google 서비스 전반의 맞춤 광고에 쓰게 하는 설정, Personal info > Phone > 번호 > Preferences에서 켜고 끔, 켜면 Usage에 Across Google | 3463280 "Turn 'Better ads & Google services' on or off" | 같음 |
| Across Google 그만 쓰기: Phone에서 번호 삭제 → Recovery phone에서 다시 추가 → 다른 서비스는 각자 다시 추가 | 3463280 "Stop using your number across Google" | 같음 |
| 복구 전화는 계정당 1개 | 3463280 "Tip: You can only add one recovery phone number to your account." | 같음 |
| 번호를 바꾸면 비밀번호 변경 같은 민감한 작업 인증에 새 번호를 쓰기까지 1주일 걸릴 수 있음 | 3463280 Important | 같음 |
| Google은 전화번호를 포함한 개인정보를 팔지 않음 | 3463280 끝 | 같음 |
| 번호 공개 범위는 About me에서 (Personal info > Choose what others see > Go to About me > Only you / Anyone) | 3463280 "To change who can view your number, go to About me", accounts/answer/6304920 (Desktop) | `source-accounts-6304920-desktop.txt` |
| 번호로 찾기: Profile discovery, 번호 설정의 "Let people find you by phone number" | 6304920 "To let people find you by phone number, turn on Let people find you by phone number in your phone number settings." | 같음 |
| 복구 전화 삭제: Google Account > Security & sign-in > How you sign in to Google > Recovery phone > 번호 옆 Delete | accounts/answer/183723 (Desktop·Android) "Change a recovery phone number" | `source-accounts-183723-desktop.txt`, `-android.txt` |
| 복구 전화를 지워도 다른 Google 서비스에서 쓰일 수 있음 | 183723 "Tip: If you delete your recovery phone number, it may still be used for other Google services." | 같음 |
| 복구 정보·인증 요소를 바꾸면 7일간 이전 정보로 코드를 보낼 수 있음 | 183723 "Tip: If you change your recovery info or other authentication factors, Google may send codes to your previous info for 7 days." | 같음 |
| 복구 전화 추가·변경은 최대 7일 걸릴 수 있음 | 183723 | 같음 |
| Google Voice 번호를 복구 전화로 쓰지 말 것 (잠길 수 있음) | 183723 Tip, 185834 "Why you shouldn't use Google Voice to get verification codes" | 같음, `source-accounts-185834.txt` |
| 복구 정보를 바꿀 수 없을 때: 로그인 방식이 평소와 다르면 옵션이 없을 수 있음 → 평소 기기·평소 위치에서, 또는 다음 주에 지금 기기로 다시 | 183723 "Can't change recovery info" | 같음 |
| 직장·학교 계정은 이 단계가 안 될 수 있음 → 관리자 | 183723 Important, 185839 Tip | 같음 |
| 의심스러운 로그인 방법은 비활성화·알림, 30일 안에 확인하지 않으면 삭제 | 183723 "Recovery method removed from account", 185839(2SV 번호) | 같음 |
| 복구 이메일은 로그인 주소가 아닌 자주 쓰는 주소 | 183723 "Choose an email address you use regularly but not the one you use to sign in" | 같음 |
| 2단계 인증: Security & sign-in > How you sign in to Google, 두 번째 단계로 Google prompts 권장(SIM 스와프 등 번호 기반 공격 방어), passkey·보안 키·Authenticator·문자/전화 코드·백업 코드 | accounts/answer/185839 (Desktop) | `source-accounts-185839-desktop.txt` |
| 문자·전화 코드는 번호 기반 해킹에 취약할 수 있음 | 185839 Tip | 같음 |
| 2SV 번호 추가 후 신뢰까지 최대 7일 | 185839 | 같음 |
| 휴대폰을 잃었을 때 백업: 로그인된 다른 휴대폰, 2-Step Verification 섹션에 추가한 다른 번호, 백업 코드, 보안 키, 다른 기기의 passkey | accounts/answer/185834 | `source-accounts-185834.txt` |
| 다른 두 번째 단계가 없으면 복구에 3~5영업일 걸릴 수 있음 (보안 키 분실 맥락) | 185834 | 같음 (본문에는 "can take 3 to 5 business days" — 2SV 계정 복구 일반으로만 씀) |
| 로그인 방식이 평소와 다르면(위치 등) 문자로 코드를 못 받을 수 있음 | 185834 "You didn't get a verification code" | 같음 |
| 2단계 인증 끄기: Google Account > Security & sign-in > 2-Step Verification > Turn off > 확인 창 Turn off, 보안 계층을 하나 없앤다는 경고, 백업 코드 폐기·앱 비밀번호 철회 권장 | accounts/answer/1064203 (Desktop·Android) | `source-accounts-1064203-*.txt` |
| 전화번호 로그인: 계정에 추가한 번호로 "Email or phone number" 칸에서 로그인. 설정 경로 Security & sign-in > How you sign in to Google > Use your phone to sign in. 문서는 추가·변경만 설명 | accounts/answer/7222352 (Desktop) | `source-accounts-7222352-desktop.txt` |
| 번호가 연결되지 않았으면 "Couldn't find your Google Account" 오류 → 사용자 이름이나 이메일로 로그인 | 7222352 "You get an error message" | 같음 |
| Android 전화번호 인증: 기본 켜짐, 기기에 로그인한 모든 계정에 번호 추가(현재·앞으로), 주기적 재인증, 끄는 경로 Settings > Google > All services > Privacy & security > Phone number verification, 기기 설정에서만 관리 | android/answer/7521240 | `source-android-7521240.txt` |
| Google Voice 번호 삭제: voice.google.com > Settings > Account > Google Voice number > Delete > Delete number, 삭제 후 90일 안에만 되찾기, Workspace 계정은 다름 | voice/answer/150640 (Desktop) | `source-voice-150640-desktop.txt` |
| 일부 정보(이름·생년월일)는 지울 수 없고 수정만 가능 | 6304920 Important | 같음 (전화번호는 About me에서 Remove 가능한 정보로만 언급, 단정 안 함) |

## 쓰지 않은 것

- 번호를 지우면 계정이 삭제되거나 Gmail이 막힌다는 주장 (근거 없음)
- 2단계 인증의 유일한 수단인 번호를 Google이 지우지 못하게 막는지 (Google 문서에 없음) → "add another second step first"로만 씀
- 2-Step Verification 화면 안의 버튼 이름 (문서에 없음) → 섹션 위치까지만
- "Use your phone to sign in"에서 번호만 끄는 별도 스위치 (7222352는 추가·변경만) → "Google's page only covers adding or changing"
- 기기·통신사별 메뉴 이름 차이 (출처 없음)
- 상위 결과의 "다른 기기에서 먼저 로그아웃하라" 조언 (Google 문서 근거 없음)
- 계정 화면 직접 실행: 컨테이너에 Google 계정·Android 기기 없음 → How we checked에 밝힘

## 2026-11-02 KST 세션 72 (개선 세션): 콘텐츠 정리 2번 통합

`google-phone-number-verification`(news, 2026-10-24 발행)을 이 글에 합치고 308 리디렉트. 두 글 모두 28일(10-04~11-01) 웹·Discover·이미지·뉴스 노출 0, URL 검사 둘 다 `Discovered - currently not indexed` → 규칙(clusters.md 콘텐츠 정리)대로 상시 글(`software`)인 이 글을 남김. 지운 글의 사실 확인표·원문·캡처 스크립트는 `tests/google-phone-number-verification/`에 그대로 둠.

**1차 출처 재확인** (2026-11-01T21:31Z UTC, `render.cjs`로 Chromium 렌더링, `source-*-2026-11-01.txt`): 10-24·25판과 공백만 다르고 문장이 같음 (줄 앞뒤 공백·빈 줄을 지우고 diff)

| 원문 | 이전 판 | 결과 |
| --- | --- | --- |
| android/answer/7521240 | `source-android-7521240.txt`(10-25) | 같음 |
| accounts/answer/3463280 (Android) | `source-accounts-3463280-android.txt`(10-25) | 같음 |
| accounts/answer/3463280 (Desktop) | `source-accounts-3463280-desktop.txt`(10-25) | 같음 |
| accounts/answer/7222352 (Android) | `../google-phone-number-verification/source-accounts-7222352.txt`(10-24) | 같음 (제목·주소 줄, 플랫폼 선택 줄 위치만 다름) |
| accounts/answer/183723 (Desktop) | `source-accounts-183723-desktop.txt`(10-25) | 같음 |

**옮긴 내용 → 출처**

| 주장 (새 절 "Why your number is on every Google account…", 고친 절 "How to stop Android…") | 출처 | 확인 |
| --- | --- | --- |
| 인증 기본 켜짐, 기기에 로그인한 모든 계정에 추가, 현재·앞으로의 계정·번호 모두, 새 계정은 모든 번호에·새 번호는 모든 계정에 | 7521240 "Turn phone number verification on or off" Important | `source-android-7521240-2026-11-01.txt` 28~29행, 캡처 이미지(10-24 캡처, 문장 같음) |
| 기기 설정에서만 관리 | 7521240 "You can only manage phone number verification in device settings." | 같음 |
| 영향 표: 계정 하나·두 번째 개인 계정·두 SIM은 위 문장에서 바로 나옴. 직장·학교 계정은 7521240에 제외 문구 없음 + 183723 "these steps may not work for accounts from work, school"(관리자). 다른 사람 계정은 "all Google Accounts that are signed in on the device" 문구. iPhone·iPad는 Android Help 문서이고 Android 기기 설정 경로뿐 | 7521240, 183723 | 같음. 지운 글의 "Android Authority가 직장 계정 사례를 보도" 문장은 보도라 옮기지 않음 |
| 3463280: verified numbers "can be added to any Google Account that is signed into that device" | 3463280 (Android) "Verify your Android phone's number" Important | `source-accounts-3463280-android-2026-11-01.txt` 129행 |
| 7222352: Use a number that "Belongs only to you", "You don't use on another Google Account to sign in" | 7222352 (Android) | `source-accounts-7222352-android-2026-11-01.txt` 38~39행 |
| 새 Android 기기에서 번호로 계정을 찾아 이메일·비밀번호 없이 로그인 시도, 다른 로그인 기기 승인이나 이전 기기 화면 잠금 필요 | 7222352 (Android) "attempt to identify the Google Accounts associated with the phone number on the new device", "Approve 'Sign in on another signed-in device' or enter the screen lock passcode of your previous Android device" | 같은 파일 61~68행 |
| 주기적 재인증, "Carrier charges may apply" | 7521240 | 21행 |
| 계정별 번호 경로: Settings > Google > 맨 위 계정 선택 > Manage your Google Account > Personal info > Phone | 7521240 "Manage Better sharing on Google" 단계 | 같음 |
| Better sharing on Google: 인증이 켜지면 함께 켜짐, 영상 통화·메시지·사진 등 알림을 Google 서비스로 이 번호에, 여러 계정이면 한 계정만 | 7521240 "Manage Better sharing on Google" | 같음 (두 글 본문에 없던 내용, 지운 글 브리프의 '빠진 것'에 적혀 있었음) |
| Google 항목 이름이 기기에 따라 "Google services and preferences", 스위치 이름 "Verify phone numbers automatically" | Android Authority (2026-10-14) 보도 | 지운 글 사실 확인표 근거 그대로, 본문에 "Android Authority reported"로 출처 표시 |

**옮기지 않은 것**: 보도 일정 타임라인(10-14 Android Authority ~ 10-24 Engadget)·이미지, 2025년 도움말 문구 변경 시점(Android Authority·Kaspersky 보도), Reddit의 "스위치가 다시 켜진다" 보고(Android Authority도 재현 못 함 → 근거 부족), `Our take` 견해(상시 글이라 견해 절 없음), "세 곳 확인" 그래픽(이 글 도입 요약 표와 겹침). 대표 이미지는 이 글 것을 유지

**이미지**: 지운 글의 `google-help-default-all-accounts.webp` → `google-help-verification-default.webp`, `google-help-pages-compared.webp`를 이 글 폴더로 옮김 (그래픽 원본 `../google-phone-number-verification/charts.py`·`shot.cjs`). 본문 이미지 4 → 6장

**링크 교체**: `gemini-gems-to-skills`(끝 관련 글 문단: 두 링크 → 이 글 하나로), `google-gmail-photos-ads`(What to do now 6번). 이 글의 "our article on Android phone number verification" 링크 → "the next section"
