# apple-siri-settlement-claim 사실 확인표

- 주 검색어: `apple siri settlement claim`
- 하위 검색어: `apple siri settlement` · `apple siri settlement claim form` · `apple siri settlement payout` · `apple siri settlement payout date` · `apple siri settlement claim form legit` · `apple siri settlement website` · `apple siri settlement canada` (`demand_check.py suggest`, 2026-10-18, 22개)
- 채널: 피드형 (뉴스 칼럼)
- 뉴스 유형: **영향** (화제 세션 대체. 48시간 안 발표 중 기준 통과 후보 없음 → 영향 뉴스로 대체, README 대체 순서)
  - 48시간 후보 제외 사유: T-Mobile T-Mix 요금제(유출만, 공식 발표 없음), WhatsApp 게스트 통화(10-14 출시, 48시간 밖), Fitbit Edge(10-15 발표), Meta 10-30 약관(사업자·웹사이트 대상), ChatGPT Chrome 탭 제어(openai.com 403), Gemini 이름 변경(Android Police 1건, 공식 출처 없음). Mashable 10-18 09:00 기사 다수(YouTube Video Editor 종료 등)는 2017년 등 과거 소식 재게시
- 화제성 신호 (2026-10-19 06:20 KST, Google News RSS `when:2d`): `"$250 million" Apple claim` **9**, `Apple settlement Siri claim` 6 (CNET 10-18 "File a Claim Now…", 10-17 Apple HomeView 연계 기사들). Trends 7일 `apple settlement`·`siri settlement` 0.0 (`iphone duo` 13.3 기준) → 검색량 신호는 약함
- 영향 기간: 청구 시작 2026-09-21(보도), 청구·제외·이의 마감 12-21, 최종 승인 심리 2027-02-24, 지급은 Effective Date 후 60일
- 독창 요소: (1) 법원 문서 수치로 계산한 청구율별 기기당 지급액 그래프(대표 이미지): 순액 약 $174.4M, $25 유지에 약 18.9% 청구 필요, 약 4.96% 이하면 $95 상한, 신청서가 비교 사례로 든 과거 청구율 2.57~3.6%(18% 1건) 표시. (2) 일정 타임라인(지급일 미정 점선). (3) 대상 여부 표(모델·구매 기간·선물·중고·다수 기기·캐나다)
- 적용한 노하우: 뉴스 칼럼 제목 패턴 변형(결론 금액·마감일을 제목에, 68자·`<title>` 80자), 설명 159자, 이미지 2장(직접 만든 1200×675), 내부 링크 2개(`iphone-duo-sold-out`·`iphone-handoff-verizon-cost`) + 역링크 1개(`iphone-duo-sold-out` 보상 판매 문단)
- 직접 확인 불가: SmartphoneAISettlement.com은 curl·Playwright 모두 Cloudflare 403("Just a moment"), web.archive.org 연결 차단, archive.ph 429 → 청구 사이트 화면·최종 청구서 양식은 확인 못 함. 법원에 제출된 청구서 양식(ECF 78-1 Exhibit) 기준으로 씀

## 주장 → 출처 → 확인 방법

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| 대상: 미국 거주·미국 구매, 재판매 목적 제외, iPhone 16·16e·16 Plus·16 Pro·16 Pro Max·15 Pro·15 Pro Max, 2024-06-10~2025-03-29 구매 | ECF 94 예비 승인 명령 ¶4 | CourtListener RECAP PDF → `source-ecf94-preliminary-approval-order.txt` |
| 총액 $250,000,000, 비환원(남은 돈 Apple 반환 없음) | ECF 78-1 합의서 정의 34·¶B.4.b | `source-ecf78-1-settlement-excerpts.txt` |
| 기기당 추정 $25, 청구가 많으면 비례 감액, 적으면 $95까지 증액, 상한 후 남은 돈은 당사자 협의·불가하면 cy pres | ECF 78-1 ¶B.4.a·b, ECF 94 ¶22 인용 | 위 파일 |
| 청구서 확인 항목: 구매 기간·구매 확인 정보(시리얼·Apple 계정 ID·전화번호)·Siri 기능 기대, 위증 서약 아님 | ECF 78-1 ¶B.5 | 위 파일 |
| 청구서 양식: 시리얼은 Settings > General > About·포장 바코드·영수증, 없으면 Apple 계정 이메일·전화번호, 디지털 지급(온라인 제출 시) 또는 우편 수표 | ECF 78-1 Exhibit(청구서 양식, 96·97쪽 등) | 위 파일 (줄 2240-2300) |
| 디지털 지급 예: Venmo·PayPal | ECF 77 신청서 Guidance 1 | `source-ecf77-motion-excerpts.txt` |
| 지급 시점: Effective Date 후 60일, Effective Date = 최종 승인·판결 후 항소 기간 만료 | ECF 78-1 ¶B.8, 정의 10 | `source-ecf78-1-settlement-excerpts.txt`(¶B.8) + 원문 78-1 줄 87-95 |
| 수표 120일 후 무효 | ECF 78-1 ¶B.10 | 위 파일 |
| Apple은 책임 부인, "delivered more than 20 Apple Intelligence features", 추가 Siri 기능 무료 제공 예정 | ECF 78-1 전문(WHEREAS) | 위 파일 (줄 300-320) |
| 예비 승인 2026-07-17, Verita Global 관리자 지정, 제외는 서면(우편·이메일), 이의는 법원에 서면, 청구·제외·이의 마감 모두 통지일 후 90일 | ECF 94 ¶12-19 | `source-ecf94-preliminary-approval-order.txt` |
| 판사가 $95 상한 도달 가능성 "low probability"로 이해 | ECF 94 ¶22 | 위 파일 |
| 최종 승인 심리 2027-02-24 (원래 2027-09-29에서 앞당김) | ECF 97 명령(08-13 서명), ECF 96 신청 | `source-ecf97-final-hearing-order.txt` |
| 최종 승인 신청은 심리 35일 전, 청구 수·제외 수 포함 | ECF 96 신청서 | CourtListener PDF (요약은 log) |
| 청구 마감 2026-12-21 ("before December 21, 2026"), 사이트 SmartphoneAISettlement.com | 원고 측 변호인(Clarkson Law Firm) 페이지 | WebFetch (curl은 403). 예비 승인 명령 계산(07-17+45+90=11-29)과 다름 → 통지일 연장(08-28 연장 신청, SettlementInsight 보도)으로 판단, 법원 연장 명령 원문은 RECAP에 없음 |
| 청구 시작 9월 (9-21) | 9to5Mac·AppleInsider 2026-09-21 보도 | 글에는 "Claims opened in September"로만, 타임라인은 "as reported" 표기 |
| 변호사 보수·비용 최대 28%($70M) 신청 예정 | ECF 77·78 | `source-ecf77-motion-excerpts.txt` |
| 관리 비용 상한 $5,444,056 | ECF 78-2 ¶41 | `source-ecf78-2-administrator-cost.txt` |
| 대표 원고 서비스 보상 1인 $2,000, 합계 $130,000 (65명) | ECF 77 | `source-ecf77-motion-excerpts.txt` |
| 대상 기기 약 3,700만 대 | ECF 77 (줄 542) | 위 파일 |
| 비교 청구율: Lopez v. Apple(Siri 개인정보) 2.57%, Smith v. Apple(Watch) 3.35%, Apple 성능 저하 3.6%, Nexus 6P 18% | ECF 77 Guidance 11 표 | 위 파일 |
| Apple이 직접 통지 정보 보유: 등록 사용자 최대 99% | ECF 78 공동 진술서 ¶48 | 원문 78.0 줄 735-745 |
| 시리얼 찾기: Settings > General > About, 길게 눌러 복사, account.apple.com Devices | Apple 지원 108037 (2026-05-12 게시) | curl 정적 HTML → `source-apple-108037.txt` |

## 계산

- 순액 = 250,000,000 − 70,000,000 − 5,444,056 − 130,000 = **174,425,944** (보수가 최대일 때, 실제 보수는 최종 승인 때 판사가 정함)
- $25 유지 청구 기기 수 = 174,425,944 / 25 ≈ 6.98M → 37M의 **18.86%**
- $95 상한 도달 = 174,425,944 / 95 ≈ 1.84M → **4.96%**
- 과거 청구율 2.57%·3.35%·3.6% → $95(상한), 18% → $26.19
- 재현: `python charts.py <출력 폴더>` (matplotlib·Pillow)
