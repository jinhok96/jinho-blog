# chrome-autofill-settings 사실 확인표

- 검증 유형 (가설 H3): **검증형** — Google Chrome 156.0.8078.73(Linux) 새 프로필로 자동 완성 설정 화면을 직접 기록(How we tested)

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

## 콘텐츠 정리 통합 (2026-11-04 세션 78, `chrome-enhanced-autofill-gmail` → 이 글)

AdSense 거절 대응 [콘텐츠 정리](../../clusters.md#콘텐츠-정리-2026-11-01) 1번. 두 글 모두 28일(10-06~11-03) 웹·이미지·Discover·News 노출 0, URL 검사 `Discovered - currently not indexed` → 규칙대로 상시 글(이 글)을 남기고 칼럼은 308 리디렉트(`vercel.json`). 지우기 전 28일 검색어 없음.

| 옮긴 내용 | 1차 출처 (2026-11-03 UTC 다시 엶) | 확인 결과 |
| --- | --- | --- |
| 새 절 "How do you stop Chrome from filling forms with your Gmail?": 경로 Settings > Autofill and passwords > Autofill settings > Enhanced autofill > Find and fill with Gemini (컴퓨터·Android·iPhone 같음) | support.google.com/chrome/answer/142893 Desktop·Android·iOS (curl → `help_text.py`) | 10-28·10-29 사본(`../chrome-enhanced-autofill-gmail/source-help-142893-*.txt`)과 본문 줄 차이 없음 (제목·피드백 줄만 파서 차이) |
| 발표: "information pulled directly from Gmail", 주문 번호·배송 추적·항공 예약, 미국 데스크톱·Android·iOS, Gemini 스파크 아이콘 | blog.google 2026-10-28 글 (datePublished 10-28T17:00Z, dateModified 10-28T20:21Z) · 도움말 "Use enhanced autofill" | 같은 문장 그대로 |
| 조건: 미국·18세 이상·Gemini in Chrome·Chrome 로그인, 개인 계정(직장·학교·관리 계정 불가), EEA·나이지리아·스위스·영국 불가, Keep Activity, Personal Intelligence + Google Workspace 연결(Gmail Smart features in other Google products 필요) | 도움말 142893 ("To use autofill, make sure you're signed in"), support.google.com/gemini/answer/16598406 | 그대로. 조건 그래픽 `chrome-gmail-autofill-requirements.webp`는 칼럼에서 옮김(10-28 출처 표기, 내용 변화 없음) |
| 검토 안내 "Your requests, page titles, and URLs may be reviewed to improve enhanced autofill", 관리 브라우저용 "Your content will not be used to improve AI", 스위치 설명 "Autofill info from apps such as Gmail and Photos" | Chrome 156 언어 파일(칼럼 사본) + Chrome for Testing 157 언어 파일 | 157에도 그대로 (`source-chrome-157-strings-check.txt`) |
| 소비자 기본값 "Allow feature and improve AI models" | support.google.com/chrome/a/answer/16278400 | 그대로 (표 줄바꿈만 다름) |
| 출처 보기(컴퓨터 마우스 올리고 링크, 휴대폰 길게 눌러 View sources)·제안 하나 숨기기(Remove from Chrome / Remove suggestion / Remove)·Gmail에서 메일 지우면 제안도 사라짐·Chrome에서 고칠 수 없음 | 도움말 142893 3개 플랫폼 | 그대로 |
| Connected Apps: 웹 gemini.google.com 아래 Settings & help > Personal Intelligence > Connected Apps, 앱 Menu > 프로필 사진 > Personal Intelligence > Connected Apps, Google Workspace 끄기, 변경이 "until days later" | Gemini 도움말 16598406 (이번에는 컴퓨터판이 열림, 앱 경로는 10-28 사본) | 웹 경로에 칼럼의 `Menu`가 없음 → 본문은 "click Settings & help at the bottom"으로 고침 |
| FAQ "Why is enhanced autofill missing from Chrome settings?" | Chrome 156(10-28)·157(11-03) 로그아웃 화면 | 두 판 모두 Autofill settings에 Smarter form understanding만 |

**Chrome 157 확인** (2026-11-03 21:50 UTC): Chrome 157은 11-03 안정판 승격(chromereleases.googleblog.com "Stable Channel Update for Desktop", Linux 157.0.8103.38·Windows/Mac .38/.39)이지만 dl.google.com Linux 저장소 `Packages`·versionhistory API Linux 안정판은 아직 156.0.8078.79 (157 deb 404) → Google이 공개하는 Chrome for Testing 157.0.8103.38 linux64로 확인. `survey157.cjs`(Node Playwright, Xvfb, 새 프로필) → `source-chrome-157-settings-text.txt`: Autofill and passwords·Contact info·Payments·Identity docs·Travel·Password Manager 설정의 스위치 이름·켜짐/꺼짐/회색이 156 기록(`source-chrome-156-settings-text.txt`)과 같음. 언어 파일(`../chrome-enhanced-autofill-gmail/pak_strings.py`) 비교: 이 글이 인용한 Chrome 문구는 157에 모두 있음(일부는 Chrome for Testing이라 "Chromium" 표기), 바뀐 문구는 단축키 줄 "Press Ctrl twice anywhere on the web to find and fill more info" 등 3개 (`source-chrome-157-strings-check.txt`)

**옮기지 않은 것**: 칼럼의 `Our take`(편집 정책상 견해는 칼럼에만 → 상시 글은 상황별 추천 1줄로), 타임라인 그래픽(11-03 Chrome 157 예정 등 지난 일정), 설정 화면 캡처(이 글의 설정 화면 캡처와 겹침), 스위치별 효과 그래픽(본문 목록과 겹침), "What to watch next"(Photos 문구는 본문 1문장으로)
