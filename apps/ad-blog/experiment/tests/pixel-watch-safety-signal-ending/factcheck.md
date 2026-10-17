# 사실 확인표: pixel-watch-safety-signal-ending

확인일: 2026-10-17 (한국 18~20시). Google 도움말·커뮤니티 페이지는 본문이 JS로 로딩돼 Playwright(Chromium 1194)로 렌더링해 텍스트 추출. 직접 실행 검증 없음(기기 필요) → 문서 기반 뉴스 칼럼. 원문 공지 텍스트는 [source-announcement.txt](source-announcement.txt).

## 글 설정

- 유형: 뉴스 칼럼 (**영향**, 18시 정기 세션. 시행일 2026-12-12, 발표 2026-10-08로 최근 30일 안)
- 주 검색어: `pixel watch safety signal`
- 하위 검색어 (자동완성 `demand_check.py suggest`): pixel watch fall detection·google pixel watch fall detection (YouTube), pixel watch 4 safety feature (Bing), pixel watch lte plan·pixel watch lte without phone·pixel watch lte vs wifi (Google·Bing·YouTube)
- 채널: 피드형 (Discover). 제목 65자, 주 검색어 앞 30자 안
- 독창 요소: 연결 상황별 전후 비교 표(대표 이미지), **Google 문서끼리의 차이 지적**(공지 "Wi-Fi에서 계속 작동" vs 안전 기능 도움말 "LTE 워치는 휴대폰 없이 긴급 전화하려면 LTE 연결 필요"), 사용자 유형별 영향 표(구매처·모델·Fi 가입 여부), 종료 일정 타임라인(확정/추정 구분), Fi 2년 무료 데이터 혜택은 통화 미포함이라 대체 수단이 아니라는 점
- 이미지 2장 (직접 만든 그래픽 1200×675, [charts.py](charts.py)): `safety-signal-before-after.webp`(대표, `thumbnail`), `safety-signal-timeline.webp`
- 내부 링크: `windows-10-esu-extended`, `iphone-duo-sold-out` (관련 주제 글이 없어 2개)

## 화제성·영향 신호 (선정 근거)

- Google News RSS 최근 30일 기사 수(100 = 100건 이상): `"Safety Signal" "Pixel Watch"` 24 · `Fitbit app Google Health` 100+ · `Android Auto Android 10` 66 · `"Custom GPTs" retire` 8 · `OneDrive iOS 18` 5
- 영향 뉴스 기준: 마감일 있음(12-12), 미국 일반 사용자 기기, 공식 1차 출처(Google 커뮤니티 관리자 공지·도움말), 독자 행동(앱 화면에서 회선 추가·연락처 변경·구독 해지) 모두 비개발자 가능
- 제외·보류한 후보
  - 커스텀 GPT 2026-12-11 종료 (backlog 1·8번): help.openai.com·openai.com·chatgpt.com 모두 403 → 1차 출처를 이번 세션에서 열 수 없어 보류
  - Fitbit 앱 종료·Google Health 강제 전환: 기사 수 최대지만 우회 방법이 이미 막혀(The Verge 10-12) 마감일이 없음
  - Android Auto의 Android 10 지원 종료: "could soon"(APK·추정 보도) 위주, 공식 날짜 미확인
  - Google Messages SMS 전용 토글 제거: APK 분석 기반 → 루머로 제외
  - OneDrive iOS 18 지원 종료: Microsoft 공식 날짜 없음(TestFlight 노트 기반 보도)
- Trends 미국 급상승 RSS 10개: 스포츠·연예·날씨 → IT 주제 없음

## 주장 → 출처 → 확인 방법

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| 2026-10-08 공지, Safety Signal 12-12 종료, 대상 Pixel Watch 2 (LTE)·3 (LTE) | https://support.google.com/googlepixelwatch/thread/471984501 (Community Manager, Announcement, 10-09 수정) | Playwright 렌더링 원문 |
| 이메일·푸시 사전 통지, 이메일 날짜부터 30일 전환 기간, 12-12 이후 접근 종료 | 같은 공지 | 원문 대조. 타임라인의 "About Nov 12 or earlier"는 12-12에서 30일 역산한 **추정**(그래픽에 hollow dot·"our estimate"로 표기) |
| Wi-Fi·Bluetooth 페어링·활성 회선이면 Emergency SOS·Fall Detection·Safety Check 계속 작동 | 같은 공지 | 원문 대조 |
| 회선 대안: 지원 통신사 모바일 요금제·eSIM | 같은 공지 | 원문 대조 |
| Safety Signal = Google Health Premium 구독 서비스, 안전 기능용 LTE 연결 | https://support.google.com/googlepixelwatch/answer/13889549 | 원문 대조 |
| 지원 기능: 긴급 연락처 통화, Safety Check, Emergency Sharing, Emergency SOS, Fall Detection | 13889549 | 원문 목록 |
| 미국·캐나다·영국·독일만 | 13889549 "Is Safety Signal available in my region" | 원문 대조 |
| 워치에 통신사 서비스가 있으면 Safety Signal 사용 안 함 | 13889549 "You won't have access to Safety Signal when you already have carrier services" | 원문 대조 |
| AT&T·Verizon에서 산 새 Pixel Watch 2·3은 사용 불가 | 13889549 Requirements | 원문 대조 ("Pixel Watch 2 previously purchased… hasn't activated" 포함 → 본문 "No change for most") |
| 설정 경로 Google Pixel Watch 앱 > Safety & emergency > Safety signal, 워치 번호 표시 | 13889549 Sign up·Find your number | 원문 대조 |
| 워치 번호는 다른 통신사로 이전 불가, eSIM 지우면 초기화 | 13889549 "It can't be transferred to another carrier" | 원문 대조 |
| Wi-Fi 모델은 휴대폰이 있어야 긴급 서비스 통화, LTE 워치는 휴대폰 없이 긴급 통화하려면 활성 LTE 연결 필요 | https://support.google.com/googlepixelwatch/answer/12663810 | 원문 "Your Google Pixel Watch LTE doesn't need a phone to call emergency services. However, it needs an active LTE connection on your watch to call emergency services." |
| Pixel Watch 4·5 LTE Satellite SOS (미국 + 여러 나라) | https://support.google.com/googlepixelwatch/answer/16407554 | 원문 국가 목록. 12663810 각주는 "US except Alaska and Hawaii" → 본문은 "in the U.S. and some other countries"로 씀 |
| 회선 추가 경로 Pixel Watch 앱 > Connectivity > Mobile network > your carrier | https://support.google.com/googlepixelwatch/answer/13541778 | 원문 대조 |
| Google Fi: 모든 요금제에 워치 통화·문자·데이터 추가 비용 없음, 계정당 워치 1개, Android 13 이상, iPhone 불가 | https://support.google.com/fi/answer/12812644 | 원문 대조 |
| Fi 2년 데이터·문자 혜택은 통화 미포함 | 12812644 비교표 "Includes text and data, but no calls" + https://support.google.com/googlepixelwatch/answer/15273704 (Pixel Watch 3 LTE 2024-08-13~2025-08-19 Google Store 구매분) | 원문 대조 |
| Google Health Premium "From $9.99" | https://store.google.com/us/product/google_health_premium | 렌더링 텍스트. 결제 주기는 페이지에 표기 없음 → 본문에 "from $9.99"만 씀 |
| Premium 해지 경로, 결제 기간 끝까지 유지, Google Play 대부분 환불 없음 | https://support.google.com/googlehealth/answer/18072871 | 원문 대조 |
| Windows 10 ESU 2027-10까지 연장 (내부 링크 문장) | 기존 글 `windows-10-esu-extended` | 기존 글 내용 |

## 확인하지 못한 것

- 통신사별 워치 회선 월 요금: Verizon 워치 페이지는 기기 할부만, T-Mobile·AT&T 요금 페이지는 404/렌더링 실패 → 본문에 금액을 쓰지 않고 "Ask your carrier"로 안내
- 플랜 없는 LTE 워치가 Wi-Fi만으로 911 통화를 걸 수 있는지: Google 문서에 명시 없음 → 본문에서 "Google doesn't say"로 표기하고 Our take 근거로 사용
