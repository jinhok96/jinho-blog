# chrome-autofill-settings 사실 확인표

## 작성 전 브리프 (2026-10-29 KST 세션 66, 일반 세션)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `ai-settings` 상시 글 (검색형). backlog 클러스터 공백 후보 `chrome autofill settings`(세션 63이 `chrome-enhanced-autofill-gmail` 칼럼 후속으로 올림). 칼럼은 Gmail·Gemini 기능만 다루므로 이 글은 자동 완성 설정 전체 |
| 주 검색어 | `chrome autofill settings` — `demand_check.py suggest` 2026-10-29: 본 검색어 Google·Bing·YouTube 3곳, 하위 18개. `chrome autofill` 하위 21개 중 `chrome autofill settings`·`not working`·`extension`이 3곳. Trends는 이번 세션 429(3회 재시도 실패) → 세션 63 값: 7일 `chrome autofill` 0.4 (기준 `remove background` 66.6) |
| 하위 검색어 | `chrome autofill settings greyed out`·`turn off`·`not working`·`email`·`android`·`iphone`/`ios`(Google), `turn off autofill in chrome`(Google·Bing), `chrome autofill clear data`(Bing), `google autofill settings password`(YouTube) |
| 검색 의도 | 정보형 How-to·설명 (설정이 어디 있고 각 스위치가 무엇을 하는지, 끄기·지우기, 회색일 때) |
| 채널 | 검색형 (제목 = 주 검색어 맨 앞, 60자 이내) |
| 상위 결과 (WebSearch `chrome autofill settings`, 2026-10-29) | ① expressvpn.com 블로그 ② nordvpn.com 블로그 (VPN 회사 블로그) ③ androidcentral.com (대형 매체) ④ dummies.com (오래된 가이드) ⑤ microcenter.com (판매점 가이드). 공통: 설정 경로, 주소·카드 추가·수정·삭제, 인터넷 사용 기록 삭제로 전부 지우기. 빠진 것: Chrome 156의 새 구성(Contact info·Identity docs·Travel 묶음), 스위치를 끄는 것과 지우는 것의 차이(직접 확인), Smarter form understanding이 페이지 주소·내용을 Google에 보낸다는 점, 카드 보안 코드(CVC)가 기본으로 저장됨, 회색 스위치 원인, 보안 연결이 아닌 페이지에서 카드 채우기 차단. 일부 결과는 옛 메뉴(Advanced > Passwords and forms) |
| 차별점 | Chrome 156.0.8078.73을 새 프로필(로그아웃)로 직접 실행해 우리 시험 양식 페이지에서 저장 제안 → 채우기 → 스위치 끄기 → 하나 지우기 → 전부 지우기를 차례로 확인, 관리자 정책으로 회색 스위치 재현, 언어 파일의 Smarter form understanding 고지 문구 3가지 |
| 내부 링크 계획 | 나가는 링크: 허브 `turn-off-ai-features`, `turn-off-ai-in-chrome`(색인), 칼럼 `chrome-enhanced-autofill-gmail`, `remove-phone-number-from-google-account`(Google 계정 개인 정보), `turn-off-gemini-apps-activity`. 받는 링크: 색인된 `gemini-gems-to-skills`(Gemini in Chrome·자동 완성 칼럼 문장 뒤 1문장), 칼럼 `chrome-enhanced-autofill-gmail`(Optional 6단계 뒤), 허브 `turn-off-ai-features`(Chrome 절). `turn-off-ai-in-chrome`은 V3 판정(11-18) 전이라 손대지 않음 |
| 개요 | Where are Chrome's autofill settings? → What each Save and fill switch does → What happens when you turn a switch off (측정) → What Chrome saves when you submit a form (측정) → What smarter form understanding sends to Google → How to delete saved autofill info (측정) → Why are Chrome autofill settings greyed out? (측정) → Chrome autofill settings on Android and iPhone → Which settings to change → How we tested → FAQ |
| 이미지 | 대표: 일반 브라우저 창의 빈 양식 칸 + 토글 패널(2개 켜짐·2개 꺼짐) + 집 모양 태그·열쇠가 점선을 따라 칸으로, 라벤더 배경 + 포레스트 그린·웜 오렌지, 아이소메트릭 (최근 3장: 살구·에메랄드 3/4, 세이지·벽돌 3/4, 레몬·플럼 정면과 겹치지 않음). 본문 5장: 설정 첫 화면 + 묶음 설명, 스위치 켜짐/꺼짐 비교, 저장 제안 말풍선 2개 + CVC saved, 전부 지우기 대화상자 + 결과, 회색 스위치 두 원인 |

## 실행 환경

- Google Chrome 156.0.8078.73 (Linux 안정판, `dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb`를 `dpkg-deb -x`로 풀어 실행). chromiumdash `fetch_releases?channel=Stable&platform=Linux` 2026-10-29: 156.0.8078.73이 최신
- Xvfb 1280×900, 새 프로필, Google 계정 로그인 없음, `--lang=en-US`. Playwright(Python) CDP 연결 + xdotool(브라우저 말풍선·자동 완성 목록 클릭). 실행 기록 `capture-notes.md`, 스크립트 `run.py`·`scenarios/*.py`, 시험 페이지 `test-site/*.html`(우리 컴퓨터의 `http://localhost:8765`)
- 시험 데이터는 모두 만든 값(Alex Sample, 100 Test Street, Springfield IL 62701, 예시 이메일, (555) 010-0199, 카드 번호는 표준 시험 번호 4111 1111 1111 1111)

## 사실 확인

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| 현재 Chrome 안정판은 156.0.8078.73, 157은 2026-11-03 | chromiumdash `fetch_releases`·`fetch_milestone_schedule?offset=-1&n=2` (157 stable_date 2026-11-03) | 2026-10-29 curl |
| 설정 위치 More > Settings > Autofill and passwords, 주소 `chrome://settings/autofill` | Chrome 156 화면 `screens/01-autofill-main.webp`, `source-chrome-156-settings-text.txt` | 직접 실행 |
| 묶음: Google Password Manager(Passwords·Passkeys), Payments(Credit & debit cards·Loyalty cards), Contact info(Addresses), Identity docs(Driver's licenses·Identity cards·Passports), Travel(Travel info·Vehicles), Autofill settings, Related Google services | 같은 파일 | 직접 실행 |
| 로그아웃 새 프로필 스위치 상태: Save and fill addresses·payment methods·Save security codes·Card benefits·Allow sites to check if you have payment methods saved·Automatically verify your email 켜짐 / Save and fill identity docs·travel info·Smarter form understanding 꺼짐+회색 | `source-chrome-156-settings-text.txt` TOGGLES (`cr-toggle` checked/disabled) | 직접 실행 |
| Google Password Manager 설정: Offer to save passwords and passkeys·Automatically create a passkey to sign in faster·Sign in automatically 켜짐 | 같은 파일 `chrome://password-manager/settings` | 직접 실행 |
| 도움말: save and fill은 Google Password Manager·payments·contact info·identity docs·travel에서 기본 켜짐, 자동 완성은 Google 계정 로그인 필요 | `source-help-142893-Desktop.txt` ("Important: The save and fill info setting is on by default…", "To use autofill, make sure you're signed in…") | 2026-10-29 curl |
| 로그아웃 상태에서도 주소·카드 저장·채우기가 됨 (도움말의 로그인 필요와 다름) | `screens/10`·`11`·`12`·`16`·`41`·`42` | 직접 실행 |
| 양식 제출 뒤 "Save address?"(이름·주소·"United States"·+15550100199·이메일), 저장 뒤 "Address saved to this device … This address will be saved in your Google Account after you sign in." | `screens/10-save-address-bubble.webp`, `11-address-saved-to-device.webp` | 직접 실행 |
| 이름 칸 클릭 → 저장 주소 제안, 누르면 7칸 채움(전화 +15550100199), 배송 메모 칸은 채우지 않음 | `screens/12`·`15`·`16`, run 출력 FILLED | 직접 실행 |
| 자유 입력 칸(배송 메모)에 한 번 입력한 값이 다음에 제안됨 | `screens/13-note-suggestion.webp` | 직접 실행 |
| Save and fill addresses를 끄면 이름 칸·배송 메모 칸 모두 제안 없음, 새 주소를 제출해도 저장 제안 없음, 저장 주소는 Contact info에 남고 Add 버튼만 회색, 다시 켜면 배송 메모 제안이 돌아옴(끈 동안 입력한 "Ring the bell"은 제안 안 됨) | `screens/20`~`24` | 직접 실행 |
| 제안 목록에서 항목을 고른 상태로 Shift+Delete → 그 항목만 지워짐 | `screens/30`~`32` | 직접 실행 (Windows·Linux 키. Mac은 확인 못 함 → 글에 Mac 키를 쓰지 않음) |
| http 페이지의 카드 칸: "Automatic payment methods filling is disabled because this form does not use a secure connection." | `screens/40-card-fill-blocked-http.webp` | 직접 실행 |
| 카드 저장 제안 "To pay faster next time, save your card and encrypted security code to your device", 저장 뒤 Payments에 "CVC saved"와 "Delete saved security codes" 링크 | `screens/41`·`42` | 직접 실행 |
| Delete browsing data: 기본 Last hour, Autofill form data는 기본 해제, Show more 아래, 개수 표시 "1 payment method, 1 address, 9 others", "Passwords can be deleted in their management settings" | `screens/50`·`51`, 실행 출력 | 직접 실행 |
| Autofill form data만 지운 뒤 Credit & debit cards (1)→(0), Addresses (1)→(0), 시험 양식 제안 없음 | 실행 출력 COUNTS / COUNTS AFTER, `screens/52`·`53` | 직접 실행 (기간 Last 4 weeks) |
| 도움말: 이 방법은 Google Pay·Google Wallet에 저장된 정보는 지우지 않음 | `source-help-142893-Desktop.txt` | curl |
| 관리 정책 `AutofillAddressEnabled: false` → Save and fill addresses 꺼짐·회색, 건물 아이콘, "This setting is managed by your administrator." / `AutofillCreditCardEnabled: false` → Save and fill payment methods·Save security codes·Card benefits 회색 | `screens/60`·`61`, 실행 출력 | 직접 실행 (`/etc/opt/chrome/policies/managed/`에 시험 파일을 넣었다가 지움) |
| Smarter form understanding 화면 문구 "Chrome understands forms better and can autofill them faster for you", "When on: Chrome can autofill difficult fields that standard autofill might miss", "To offer suggestions and improve this feature, the page's URL and content are shared with Google" | `source-chrome-156-settings-text.txt`, `source-chrome-156-strings.txt` 35520·35524·35526·35528 | 직접 실행 + 언어 파일 |
| 같은 언어 파일의 다른 문구: "The content and URLs of the pages you visit can be processed in a private space in the cloud"(35525), "Help Chrome better understand and fill complex forms by securely processing data on Google's servers. Your info remains private and isn't reviewed by anyone."(35527), 알림 "Smarter autofill, kept private"(35425·35426) | `source-chrome-156-strings.txt` | 언어 파일 (우리 화면에 나온 것은 35524) |
| 도움말: Smarter form understanding은 끄기 전까지 켜짐, 로그인 필요, 모든 사이트에서 되지 않음 | `source-help-142893-Desktop.txt` | curl |
| Verify it's you when filling sensitive info: 기본 켜짐, 화면 잠금·지문 등 | 같은 도움말 "Turn re-authentication on or off" | curl (우리 Linux 사본 화면에는 없음) |
| Enhanced autofill: 미국·18세 이상·Personal Intelligence를 켠 Gemini in Chrome 사용자, Find and fill with Gemini | 같은 도움말 "Use enhanced autofill" | curl |
| Android 경로: More > Settings > Autofill and passwords, 각 항목의 Save and fill, Autofill settings의 Smarter form understanding, "Autofill with Google" vs "Autofill using another service"(Restart Chrome), 도움말 안에 "Passwords and autofill"·"Addresses and more" 같은 다른 이름도 섞임 | `source-help-142893-Android.txt` | curl (기기 없음, 문서 기반) |
| iPhone·iPad 경로: More > Settings > Autofill and passwords, Smarter form understanding·Verify it's you는 Contact info 안, 주소는 왼쪽으로 밀어 Delete, Edit로 여러 개 삭제 | `source-help-142893-iOS.txt` | curl (문서 기반) |
| 비밀번호 저장 끄기: More > Passwords and autofill > Google Password Manager > Settings > Offer to save passwords and passkeys, Sign in automatically | `source-help-95606-Desktop.txt` | curl |

## 쓰지 않은 것

- Google 계정 로그인 상태 화면(Enhanced autofill 항목·Wallet 저장·동기화): 계정 없음 → 도움말 인용만
- Verify it's you when filling sensitive info 스위치: 우리 Linux 사본 화면에 없음(화면 잠금 기능 없음) → 도움말 인용
- Mac에서 제안 하나 지우는 키, 휴대폰에서 제안 하나 지우는 법: 직접 확인 못 함
- HTTPS 페이지에서 카드 채우기: 우리 시험 페이지가 http라 차단 메시지만 확인
- Identity docs·Travel이 로그아웃 상태에서 회색인 정확한 조건: 화면에 설명 없음, 도움말은 로그인 필요라고만 함 → "우리 로그아웃 사본에서 회색"으로만 씀
