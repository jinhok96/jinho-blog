# 사실 확인표: spotify-family-qr-code-verification

확인일: 2026-10-19 (UTC 21시, 한국 2026-10-20 06~07시). support.spotify.com 문서는 curl 정적 HTML의 `<main>` 본문과 `__NEXT_DATA__`의 `updatedAt`으로 확인(원문 텍스트: `source-*.txt`). spotify.com 요금·약관 페이지도 curl 정적 HTML. 직접 실행 검증 없음(Spotify 계정·Family 구독·휴대폰 앱 필요) → 문서 기반 뉴스 칼럼.

## 글 설정

- 유형: 뉴스 칼럼 (**화제**, 06시 정기 세션)
- 주 검색어: `spotify family plan` (+ `spotify qr code verification`)
- 하위 검색어 (`demand_check.py suggest "spotify family plan"` 31개): address verification·address verification problem·address not working·different address (YouTube), address doesn't match (Bing), cost·how many members (Google·Bing), not working (YouTube)
- 채널: 피드형 (Discover). 제목 72자, 주 검색어 `Spotify Family` 앞 14자 안. 설명 157자
- 독창 요소: 인증 기한·결과 흐름도(대표 이미지), **요금제별 1인당 월 요금과 Individual로 바뀔 때 연간 추가 비용 계산**(6인 Family $3.67 → $12.99, 연 $111.90), 사용자 유형별 영향 표(관리자·동거 구성원·별거 구성원·Duo·개인), **Spotify 문서끼리의 차이**(주소 인증 실패는 "같은 플랜 재가입 가능" 명시 vs QR 실패 항목에는 그 문구 없음, Duo 문서에는 QR 없음)
- 이미지 2장 (직접 만든 그래픽 1200×675, [charts.py](charts.py)): `qr-verification-timeline.webp`(대표, `thumbnail`), `spotify-cost-per-person.webp`
- 내부 링크: `microsoft-365-family-storage-2tb`, `iphone-handoff-verizon-cost` (2개). 역링크: `microsoft-365-family-storage-2tb` 마지막 문단에 1문장 추가
- 우회 방법(영상 통화 등, 보도·Reddit)은 약관 위반이라 다루지 않음 (AdSense 정책: 유료 기능 우회 금지)

## 화제성 신호 (선정 근거)

- Google News RSS 최근 48시간: `Spotify QR code family` 11건 · `Spotify Premium Family` 37건 (9to5Google·Android Authority·Android Headlines·The Mac Observer·Firstpost 등, 모두 10-19). 7일로 넓혀도 10건 → 10-19에 집중
- Google Trends 미국 7일: `spotify family` 평균 9.9(최고 24) · `spotify qr code` 0.1(최고 11, 최근 상승) · 기준 `remove background` 65.9
- 자동완성 "spotify family plan" 31개(Google·Bing·YouTube), "spotify qr code"는 노래·재생목록 QR 위주(인증 관련 하위 검색어는 아직 없음)
- Trends 미국 급상승 RSS: 스포츠·인물 → IT 주제 없음
- 발표 시점: Spotify 공식 발표·뉴스룸 글 없음(newsroom RSS 10-08~10-16에 관련 글 없음). 지원 문서 `updatedAt` 2026-10-07T11:08:28Z(QR 섹션이 이날 추가됐는지는 확인 불가). 사용자 알림 보도 10-19 → 48시간 기준은 보도·배포 시점으로 판단
- 제외·보류한 후보
  - "Google이 Gmail·Photos 정보로 광고 타기팅"(Techlicious 10-19, Search Engine Roundtable): 48시간 기사 3~4건, Google 공식 발표 미확인 → 다음 세션 후보
  - Windows 11 10월 업데이트 Smart App Control 차단(PCWorld 10-19): 1건, Microsoft 문서 미확인
  - iOS 27.2 RC(10-19): 정식 배포 전
  - Amazon Alexa Tablet(Android 전환): 신제품 소개, 독자 행동 약함
  - Netflix·Spotify 실적: 업계 뉴스 제외

## 주장 → 출처 → 확인 방법

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| "We may ask some Premium Family members to verify they live with the plan manager by scanning a QR code." | https://support.spotify.com/us/article/family-address-verification/ (updatedAt 2026-10-07) | 원문 대조 ([source](source-family-address-verification.txt)) |
| 관리자: profile picture > Your Premium > Manage 에서 QR 열기, 구성원은 휴대폰 카메라로 스캔, 같은 장소 필요 | 같은 문서 | 원문 대조 |
| 모바일 앱에서만, 최신 버전 필요 | 같은 문서 Note | 원문 대조 |
| 알림 후 7일 안에 스캔 | 같은 문서 | 원문 대조 |
| 놓치거나 인증 못 하면 12개월간 다른 Family·Duo 플랜 가입 불가, 다른 플랜은 spotify.com/premium | 같은 문서 | 원문 대조 |
| 문제 해결: 앱 최신·날짜와 시간 확인·앱 재시작·직접 만나서 스캔, 코드는 몇 초마다 바뀜 | 같은 문서 Troubleshooting | 원문 대조 |
| 주소 인증 실패: 7일 안 재인증, 실패·기한 경과 시 플랜 접근 상실·무료 전환, 같은 플랜 재가입 가능, 다른 플랜 12개월 불가 | 같은 문서 "Failed verification" | 원문 대조. QR 항목에는 무료 전환·재가입 문구 없음 → 본문에 차이로 표기 |
| "We don't track your location" (주소 인증 항목) | 같은 문서 | 원문 대조 (본문 미사용) |
| Duo: 주소 인증만 설명, 7일·12개월 동일, QR 언급 없음 | https://support.spotify.com/us/article/address-verification-duo/ (updatedAt 2025-08-07) | 원문 대조 ([source](source-address-verification-duo.txt)) |
| Family는 함께 사는 최대 6명, 관리자는 다른 플랜 가입 불가, 구성원은 12개월에 한 번만 플랜 변경 | https://support.spotify.com/us/article/family-plan/ (updatedAt 2026-10-14) | 원문 대조 |
| 가구 플랜: 같은 주소에 사는 가족, 12개월에 한 번 이동, 가입 시 주소 확인(Kids·관리 계정 제외), 조건 불충족 시 즉시 종료 가능, 재인증 요청 가능 | https://www.spotify.com/us/legal/premium-family-terms/ (Paid Subscription Terms 2.2.1 A·B·C·F로 리디렉트) | 원문 대조 ([source](source-paid-subscription-terms-2.2.txt)) |
| Family·Duo 구성원은 무료로 취소한 뒤 새 플랜 가입 | https://support.spotify.com/us/article/change-premium-plans/ "Member of Family or Duo" | 원문 대조 |
| 미국 요금: Individual $12.99·Student $6.99(인증된 대학생)·Duo $18.99·Family $21.99(최대 6계정) | https://www.spotify.com/us/premium/ | curl 정적 HTML 2026-10-19 ([source](source-spotify-premium-us.txt)) |
| 1인당 월 요금·연간 추가 비용 | 위 요금 ÷ 인원, (12.99 − 1인당) × 12, 반올림 | [charts.py](charts.py) Decimal 계산: 6인 3.67/111.90, 4인 5.50/89.91, 3인 7.33/67.92, Duo 9.50/41.94 |
| 9to5Google 10-19 보도: Reddit 사용자가 알림 확인 | https://9to5google.com/2026/10/19/spotify-qr-code-verification-family-sharing/ | 본문 확인, "reported"로 표기 |
| 지원 문의 페이지 | https://support.spotify.com/us/contact-spotify-support/ | curl: 로그인 페이지로 리디렉트(존재 확인) |
