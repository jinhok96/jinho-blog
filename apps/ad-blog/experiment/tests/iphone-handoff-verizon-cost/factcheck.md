# 사실 확인표: iphone-handoff-verizon-cost

확인일: 2026-10-18 06~07시 KST (미국 2026-10-17). Apple·Verizon·T-Mobile 페이지는 curl 정적 HTML로 본문 추출. 직접 실행 검증 없음(iPhone 2대 + 지원 통신사 필요) → 문서 기반 뉴스 칼럼. 원문 발췌: [source-apple-127274.txt](source-apple-127274.txt), [source-verizon.txt](source-verizon.txt), [source-tmobile.txt](source-tmobile.txt).

## 글 설정

- 유형: 뉴스 칼럼 (**화제**, 06시 정기 세션. Verizon 발표 2026-10-16 → 최근 48시간 안)
- 주 검색어: `iphone handoff verizon`
- 하위 검색어 (자동완성 `demand_check.py suggest "iphone handoff"`, 22개): iphone handoff feature·ios 27 (Google·Bing·YouTube), iphone handoff setting, iphone handoff not working, iphone handoff att / at&t, iphone handoff use cases, iphone handoff why
- 채널: 피드형 (Discover). 제목 66자, 주 검색어 단어(iPhone Handoff·Verizon) 앞 40자 안
- 독창 요소: 통신사별 12·24개월 누적 요금 계산(대표 이미지 + 표), 사용자 유형별 영향 표(통신사·계정 종류·Dual SIM·iPad/Mac), 발표 일정 타임라인(미정 구간은 점선), **Apple 문서와 통신사 발표 차이**(Apple 지원 통신사 목록은 미국 T-Mobile만, Verizon은 발표만), **eSIM 삭제로는 요금이 멈추지 않는다는 Apple 문서 경고**, iPad·Mac은 Handoff 없이 무료로 번호 사용 가능
- 이미지 2장 (직접 만든 그래픽 1200×675, [charts.py](charts.py)): `iphone-handoff-cost-by-carrier.webp`(대표, `thumbnail`), `iphone-handoff-timeline.webp`
- 내부 링크: `iphone-duo-sold-out`(결제 방식), `pixel-watch-safety-signal-ending`(기기 부가 통신 서비스 변경)

## 화제성 신호 (선정 근거)

- Google News RSS 최근 48시간 기사 수: `"iPhone Handoff"` **32** (Verizon $10 기사가 대부분, 10-16 23:37 MacRumors ~ 10-17 19:15 Digital Trends) · `"One UI 9"` 30 · `"Universal Cart"` 21 · ChatGPT Chrome 확장 29 · `"App Store" guidelines nudify` 12 · `"Gmail" "AI Inbox"` 8 · `"AI Pro" trial Pixel` 7. 48시간 밖: `"Apple TV" 4K` 87·`"HomePod mini"` 42(10-13 발표), `"earthquake alerts" Android` 47·`"Windows 11" Photos` 38(10-15 발표)
- Trends 미국 급상승 RSS: `one ui 9`(200+)만 IT 주제. 그러나 One UI 9 공식 배포 발표는 2026-09-16(Samsung Newsroom) → 48시간 기준 밖, 최근 기사는 기기별 배포·QuickStar 아이콘 문제(Samsung 커뮤니티 403)라 제외
- Trends 7일(미국): `iphone duo` 평균 12.5 · `iphone handoff` 0.3(최고 5) · `one ui 9` 0.2
- 자동완성 "iphone handoff" 22개, `iphone handoff verizon`·`iphone handoff att`가 Google·Bing에 있음
- 선정 기준: 미국 일반 사용자 요금(통신비) 직접 영향, 1차 출처(Verizon·T-Mobile 발표, Apple 지원 문서) 확인, 독자 행동(가입 여부 판단·설정·해지 요청)이 설정 메뉴·통신사 문의로 끝남 (0번 통과)

## 주장 → 출처 → 확인 방법

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| Verizon: iPhone Handoff "coming soon", "$10/month on compatible iPhones models running iOS 27", 시작일 없음 | https://www.verizon.com/about/news/iphone-duo-verizon-offers (Published Oct 16, 2026) | 원문 대조 (source-verizon.txt) |
| iPhone Duo 매장 출시 10-23 | 같은 Verizon 글 "iPhone Duo hits stores on Friday, October 23" | 원문 대조 |
| T-Mobile $5/month, 9-10 발표 | https://www.t-mobile.com/news/devices/iphone-18-pro-iphone-duo-apple-watch-release (September 10, 2026) | 원문 대조 |
| T-Mobile: 보조 iPhone 미국 내 무제한 + 프리미엄 데이터 50GB, 무제한 3G 핫스팟 / postpaid consumer·sole proprietor만 / 번호·eSIM 1개만 / 2FA·암호·Face ID / 보조 폰에 다른 서비스 없어야 함 / 스마트워치처럼 별도 청구 번호 / 태블릿 불가 / "Plus taxes and fees" | https://www.t-mobile.com/devices/new-apple-iphone-release (FAQ) | 원문 대조 (source-tmobile.txt) |
| Apple: 한 번호를 두 기기에서, 통화·음성사서함·메시지·Find My 위치가 사용 중인 iPhone으로 이동, 한 번에 한 대만 활성, 잠금 해제로 전환, "Switched to this iPhone" | https://support.apple.com/en-us/127274 (Published September 09, 2026) | 원문 대조 (source-apple-127274.txt) |
| Apple 지원 통신사: USA T-Mobile, Germany Telekom / "Carrier fees might apply" | 127274 | 원문 대조 (2026-10-17 기준 Verizon 없음) |
| 요구 조건: iOS 27 이상, Wi-Fi, 같은 Apple Account, Messages in iCloud, FaceTime·iMessage 같은 계정, 지원 통신사 eSIM | 127274 | 원문 대조 |
| 주 iPhone에서만 Call Forwarding·Caller ID·통신사 계정 관리 / Apple Watch는 따라가지 않음, 많이 쓰는 iPhone에 페어링 권장 / 일부 Wallet 항목 한 기기만 / 은행 앱 등 승인 필요 | 127274 | 원문 대조 |
| 해지는 통신사 문의 필요, eSIM 삭제해도 "your carrier may continue to charge you" | 127274 "Turning off iPhone Handoff" | 원문 대조 |
| Dual SIM: 두 eSIM 모두 지원 통신사면 작동 | 127274 "Using Dual SIM" | 원문 대조 (T-Mobile FAQ는 출시 시 1개만 → 표에 둘 다 표기) |
| 설정 경로: Settings > Cellular > Set Up Cellular 또는 Add eSIM > Use Number on This iPhone and Another > Continue | 127274 "Set up iPhone Handoff in the Settings app after new iPhone setup" | 원문 대조 |
| iPad·Mac에서 iPhone 번호로 Messages·FaceTime: Settings > Apps > Messages > Send & Receive, Settings > Apps > FaceTime | https://support.apple.com/en-us/108758 | 원문 대조 |
| AT&T 미지원 | Apple 127274 지원 목록에 없음 + Google News RSS 7일 `"AT&T" "iPhone Handoff"` 결과에 AT&T 발표 없음, att.com 홈 본문에 Handoff 없음 | "we found no AT&T announcement"로 표현 |
| Apple Upgrade iPhone Duo 24개월 리스 최저 $57.99/월 | https://www.apple.com/newsroom/2026/10/open-up-to-new-possibilities-with-iphone-duo/ | 원문 대조 |
| 누적 요금: T-Mobile $60(12개월)·$120(24개월), Verizon $120·$240 / Verizon 2년 $240 > 리스 4개월 $231.96 | 계산 (월 요금 × 개월) | charts.py |

## 쓰지 않은 것

- EE(영국 £5/월) 발표: 미국 독자 대상이라 생략
- Verizon 요금에 포함되는 데이터·조건: 발표에 없음 → "hasn't said yet"으로만 표기
- 두 번째 회선 요금 비교: 통신사·요금제별로 달라 1차 출처로 일반화 불가 → `Our take` 반대 관점에서 "compare with what your second line costs"로만 씀
- iOS 27 출시일(보도 9-14): Apple 1차 출처 미확인 → 본문에 날짜 쓰지 않음
