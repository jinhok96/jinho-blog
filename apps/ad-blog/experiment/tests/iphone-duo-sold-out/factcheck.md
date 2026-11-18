# 사실 확인표: iphone-duo-sold-out

- 검증 유형 (가설 H3): **조사형** — Apple 문서·요금 대조만, 직접 실행 없음 (2026-11-19 통합 뒤에도 같음: 수리비 견적 웹 도구 조회는 실행 측정이 아님)
- 주 검색어 (가설 H6): `iphone duo applecare` — 2026-11-19 통합 브리프 주 검색어 (발행 때 `iphone duo sold out`)

## 작성 전 브리프 — 2026-11-19 통합 + 상시 글 전환 (세션 101, 콘텐츠 정리 6번)

칼럼 2편(`iphone-duo-sold-out` 10-17 화제 · `iphone-duo-cracked-screen` 10-28 화제)을 이 주소 하나의 상시 글로 합침. 남길 글: 이 글이 색인(10-20 크롤링)·28일(10-21~11-18) 웹 노출 59·클릭 2·평균 7.7위, `iphone-duo-cracked-screen`은 `Discovered`·노출 0. 두 글 모두 익명 아닌 검색어 없음(Search Console API 글별 `query` 행 0) → 지운 글 28일 검색어 없음. 지운 글은 `vercel.json` 308 → 이 글. 아래 '유형: 뉴스 칼럼 (**화제**…)' 줄과 '검증 유형'(조사형) 줄은 규칙대로 유지.

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `phones-subscriptions` 상시 글 (카테고리 `news` → `software`). 이 클러스터 첫 상시 글, 허브 없음 |
| 주 검색어 | `iphone duo applecare` — 2026-11-18 `demand_check.py suggest`: Google·Bing·YouTube 3곳, 하위 15개(`iphone duo applecare plus` Google·YouTube, `how much is applecare for iphone duo`·`iphone duo apple care cost`·`… plus price`(Bing), `iphone duo applecare cost`·`coverage`·`deductibles`·`fees`·`one`·`repair cost`·`replacement cost`(Google)) |
| 하위 검색어 | `iphone duo repair cost` Bing·YouTube(19개, `… costs with apple care`·`… without apple care`·`… costs apple`(Google)), `iphone duo screen replacement`·`… cost` Bing·YouTube(`iphone duo inner screen replacement cost`·`iphone dual screen repair price`(Google)), `iphone duo cost` 3곳(`… per month`·`… att`·`… verizon`(Google)) |
| 검색 의도 | 비교·결정형 (AppleCare+가 얼마고 살 가치가 있나, 없으면 수리비가 얼마인가, 균열은 무료인가) |
| 채널 | 검색형 |
| 상위 결과 (WebSearch `iphone duo applecare`, 2026-11-18) | PhoneArena(Crackgate, AppleCare 필수냐)·Digital Trends($1,499)·GadgetReview 2건·Android Headlines·MacRumors(10-14 수리비)·Mac Observer 2건·Macworld($19 커버 층) — **모두 10월 뉴스 기사**. 빈틈: ① **AppleCare One Individual이 Duo 단독 AppleCare+와 같은 $19.99/월**(구매 화면 문구 "Cover multiple products, including this iPhone")이라는 비교가 없음 ② 2년 손익(외부 화면만 깨지면 플랜 없이가 더 쌈)을 계산한 글 없음 ③ 균열 결함 뒤 상황(10-30 매장 메모, 11-18 서비스 프로그램 없음)을 한 글로 묶은 곳 없음 ④ 리스(Klarna 손상 수수료)와 AppleCare 관계 |
| 차별점 | Apple 수리 견적 위젯(보증 외·AppleCare 탭) 직접 조회값 + iPhone 18 Pro·Pro Max 비교, AppleCare 가격 API 응답(페이지가 부른 것), 플랜 3종 비교 표, 2년 손익 그림, 결제 방식 표·그림, 기한 목록, 수리 전 준비(109519 11-18판) |
| 내부 링크 계획 | 나가는: `apple-siri-settlement-claim`(보상금 청구 일련번호, 같은 클러스터), `iphone-handoff-verizon-cost`(번호 공유, 같은 클러스터). 허브 없음. 받는: 색인된 `iphone-handoff-verizon-cost`·`apple-siri-settlement-claim`(둘 다 이미 이 글로 링크, 지운 글 링크는 문장 정리). `check-if-image-is-ai-generated`의 'iPhone Duo 출시 분석' 링크는 통합 글이 SynthID를 다루지 않아 뺌 |
| 개요 | 첫 문단(AppleCare+ 값·내부 화면 $999→$99·AppleCare One 같은 값·균열은 교체) → 수리비 표 → 위젯 캡처 → AppleCare+ 값(플랜 3종 표) → 보증 외 수리비(18 Pro 비교 그림) → 살 가치(2년 손익 그림) → 접힘 균열 → 커버 층 → 구매·할부·리스(표·그림 2장) → 기한 → 수리 전 준비(번호 단계) → 상황별 추천 → How we checked(통합 이력) |
| 이미지 | 대표 이미지 그대로(`iphone-duo-wait-hero.webp`). 본문 5장 재사용(가격이 10월과 모두 같음): `apple-iphone-duo-repair-prices.webp`·`iphone-duo-vs-iphone-18-pro-screen-repair.webp`·`iphone-duo-applecare-two-year-cost.webp`(지운 글에서 옮김), `iphone-duo-cost-by-payment.webp`·`iphone-duo-monthly-cost-with-applecare.webp`. 뺀 그림: 주문 타임라인(뉴스 경과), 기한 타임라인(10월 날짜), 지운 글 대표 이미지 |
| 제목 | `iPhone Duo AppleCare+ Price and What Each Repair Costs` (54자, 주 검색어 앞. 'Without …' 끝맺음 4편과 겹치지 않게) |
| 설명 | 150자 |

### 2026-11-18 UTC 재확인 사실 (Chromium 렌더링 사본 `merge-2026-11-19/source-*-2026-11-19.txt`, `merge-2026-11-19/render.cjs`)

| 주장 | 출처 (사본) | 확인 |
| --- | --- | --- |
| AppleCare+ with Theft and Loss for iPhone Duo $19.99/mo. 또는 $199.99/yr, iPhone 18 Pro·Air $14.99/mo., iPhone 17 $12.99/mo. | `source-apple-applecare-2026-11-19.api.json`(apple.com/applecare 'All model pricing'이 부른 `mcm/product-price` 응답: SHPG3·SHPH3·SHNP3·SX432·SX3Y2) + 구매 화면 | 10월(`../iphone-duo-cracked-screen/api-applecare-product-price.json`)과 같음 |
| AppleCare One Individual $19.99/mo. 최대 3개, 추가 $5.99/mo., Family $49.99/mo. 최대 6명, 도난·분실 Individual 12개월 3회 / AppleCare+ 12개월 2회 | `source-apple-applecare-2026-11-19.txt`, `source-apple-buy-iphone-duo-2026-11-19.txt`("Cover multiple products, including this iPhone with AppleCare One Individual $19.99/mo.") | 원문 |
| 새 Apple 구입 후 60일 안에 설정 앱에서 플랜 추가, AppleCare One은 4년 이하·양호한 기기 추가(진단·점검 필요할 수 있음) | `source-apple-applecare-2026-11-19.txt` FAQ | 원문 |
| 서비스 요금(AppleCare+·Theft and Loss·AppleCare One 공통): 외부 화면·뒷면 $29, 커버 층만 $19, 내부 화면 $99, 기타 사고 $99, 도난·분실 $149 | `source-apple-applecare-fees-2026-11-19.txt` | 10월과 같음 |
| 수리 견적 iPhone Duo 보증 외: 커버 층 $49, 뒷면 $199, 배터리 $229, 후면 카메라 $229, 외부 화면 $379, 외부+뒷면 $509, 내부 화면 $999, 기타 $1,499 / AppleCare: 배터리 $0, 커버 층 $19, 뒷면 $29, 외부 화면 $29, 내부 화면 $99, 기타 사고 $99, 도난·분실 $149 | `source-apple-iphone-screen-repair-oow-2026-11-19.txt`·`source-apple-iphone-screen-repair-applecare-2026-11-19.txt` | 10월과 같음 → 캡처 그림 재사용 |
| iPhone 18 Pro Max 화면 $379, iPhone 18 Pro 화면 $329 (보증 외) | `source-apple-iphone-screen-repair-18pro-2026-11-19.txt` (`prices18.cjs`·`prices18b.cjs`로 기기·모델 선택) | 10월과 같음 → 비교 그림 재사용. 999/379 = 2.64, 999/329 = 3.04 |
| 견적은 점검 뒤 확정, 세금·배송비 추가 가능, 공인 서비스 제공업체는 자체 요금 / AppleCare 대상 수리는 Apple·공인 업체 같은 요금 | 같은 두 사본 | 원문 |
| 배터리 용량 80% 미만이면 추가 요금 없이 교체 | AppleCare 탭 사본 | 원문 |
| "For iPhone Duo, a separate service fee applies for the replacement of the cover layer", "There are no service fees for mechanical failures" | `source-apple-applecare-footnotes-2026-11-19.txt` (curl 원문 HTML 각주 — 렌더링 본문에서 빠짐) | 원문 |
| 가격 $1,999·$2,199·$2,599·$3,199 (256GB·512GB·1TB·2TB), 할부 $83.29/mo. 24개월 0% APR(월 $91.62·$108.29·$133.29로 용량별 대응 확인), 통신사 $55.52/mo. 36개월부터, Apple Card 3% Daily Cash | `source-apple-buy-iphone-duo-2026-11-19.txt` | 10월과 같음 |
| Apple Upgrade iPhone Duo $57.99/mo. 24개월 · $82.99/mo. 12개월 | `source-apple-upgrade-2026-11-19.txt` | 10월과 같음. 합계 1,391.76·995.88, 인수 607.24·1,003.12, AppleCare 포함 월 77.98·102.98·103.28 (계산) |
| 리스: AppleCare 미포함(별도 청구), 가입 60일 안 추가 또는 가입 때 AppleCare One에 추가, AppleCare 없이 손상 반납 시 Klarna 1회 손상 수수료(반납 전 수리 가능), 도난·분실 보장 없으면 계약 가격 − 낸 금액, Klarna 미수락 AMEX·UnionPay·Chase·Capital One·Citibank, 끝나고 아무것도 안 하면 최대 6개월 월 단위 연장 뒤 구매 청구, 정상 반납 시 정가 이상 내지 않음, 받은 뒤 14일 안 반품 | `source-apple-upgrade-2026-11-19.txt` FAQ | 원문 |
| 반품 14일(받은 날부터), 14일 안 가격 인하 시 차액 요청 | `source-apple-returns-2026-11-19.txt` | 원문 |
| 보증: 원래 구매일부터 1년, "damage caused by accident, abuse, misuse" 제외, "protective coatings that are designed to diminish over time" 제외(결함이면 예외), Apple·AASP가 아닌 사람의 서비스로 생긴 손상 제외 | `source-apple-limited-warranty-ios-2026-11-19.txt` | 원문 |
| 서비스 프로그램 목록에 iPhone Duo 없음 (최근 Mac mini 2025-06-13, iPhone 14 Plus 후면 카메라 2024-11-01) | `source-apple-service-programs-2026-11-19.txt` | 원문 (10월과 같음) |
| Apple 성명 전문, AppleCare+ 없어도 교체, 통신사 구입자도 AppleCare에 직접 연락 | `source-9to5mac-2026-10-26-inner-display-statement.txt` | 언론 보도("Apple told 9to5Mac", "9to5Mac reported") |
| 10-30 Apple Store·AASP 메모: 점검 후 표준 절차로 수리 또는 교체, 리콜 없음, 공개 수리 프로그램 아직 없음, 원인 미공개 | `source-macrumors-2026-10-30-store-memo.txt` | 언론 보도("MacRumors reported") |
| 내부 화면 7.6인치 | `source-apple-iphone-duo-page-2026-11-19.txt` | 원문 |
| "should only be serviced by a trained technician", "Don't use iPhone with cracked glass" | `source-iphone-guide-handling-2026-11-19.txt` | 원문 |
| 수리 준비: 백업, Apple Cash 끄기(Settings > Wallet & Apple Pay), Wallet 카드 삭제, iOS 27 Find My > More > Repair or Trade In > Enable, 영수증(가능하면)·신분증, 돌려받은 기기가 지워져 있을 수 있음 — 문서 날짜 **November 18, 2026**(9-15판에서 '늦거나 일정 변경' 한 줄만 추가) | `source-apple-109519-prepare-service-2026-11-19.txt` | 원문, diff 확인 |
| 연락: support.apple.com/repair, Apple Support 앱, 1-800-692-7753, Settings > General > AppleCare & Warranty | `source-apple-applecare-2026-11-19.txt` FAQ | 원문 |

- 쓰지 않은 것: 균열 원인(iFixit·부품 업체 추정 보도, Apple 미확인), Self Service Repair 부품 가격(11-17 판매 시작 보도가 있으나 selfservicerepair.com이 컨테이너에 403 → 1차 출처 확인 불가), 현재 배송 예정일(스토어가 동적으로 불러옴), 28개국 출시·Apple Pencil·Apple Intelligence 요금(구매·수리 비용과 무관해 뺌)
- 계산: 2년 AppleCare+ 연납 399.98 + 내부 화면 99 = 498.98, 월납 479.76 + 99 = 578.76, 외부 화면만 한 번: 플랜 없이 379 vs 연납 2년 + 29 = 428.98, 연납 절약 239.88 − 199.99 = 39.89

확인일: 2026-10-17 (한국 13~15시, 컨테이너에서 `urllib`·Playwright로 직접 받아 텍스트 추출). 직접 실행 검증 없음 → 문서 기반 뉴스 칼럼. 비용 계산은 Apple 공개 가격으로 직접 계산.

## 글 설정

- 유형: 뉴스 칼럼 (**화제**, 사용자 요청 "화제성 높은 주제"로 한국 13시 일반 세션 시각에 작성)
- 주 검색어: `iphone duo sold out`
- 하위 검색어 (자동완성 `demand_check.py suggest "iphone duo"`, 38개): iphone duo pre order·price·release date (Google·Bing), iphone duo delivery date·sold out·review·reddit (Google), iphone dual sold out·pre order (YouTube), iphone duo price 2026·specs·face id (Bing)
- 채널: 피드형 (Discover)
- 독창 요소: 결제 방식별 24개월 비용 계산(일시불·ACMI·Apple Upgrade 리스 반납/인수·12개월 리스·통신사), 사용자 유형별 영향 표, 발표~배송 일정 타임라인(공식/보도 구분), 리스 약관 함정 정리(Klarna 카드 제한·자동 인수·분실 시 잔액)

## 화제성 신호 (선정 근거)

- Google News RSS 최근 48시간 기사 수 (`news_count.py 48h`, 100 = 100건 이상): `"iPhone Duo"` **100+** · `"Gemini 4"` 73 · `Apple TV 4K Siri AI` 71 · `"Windows 11" new features October` 54 · `HomePod mini` 53 · `"Universal Cart" Google` 49 · `"AI Mode" Google Search update` 37 · `"Photos app" "Windows 11"` 28 · `Chrome zero-day update` 17 · `"Microsoft Edge" updates restart` 13 · `"Circle to Search" scam` 10 · `"Gmail" "AI Inbox"` 7
- 배송 지연 관련 3일 기사: `"iPhone Duo" delivery` 100+, `"iPhone Duo" sold out` 100+, `"iPhone Duo" shipping estimates` 57
- Google Trends (미국, 7일, `trends_compare.py --time "now 7-d"`): `chatgpt` 평균 69.9 · **`iphone duo` 평균 8.0, 최고 67, 최근 7지점 14.7** · `gemini 4` 0.6 · `windows 11 update` 0.0 · `universal cart` 0.0
- Trends 미국 급상승 RSS 10개: 연예·스포츠 → IT 주제 없음
- 공통 필수 기준: 미국 일반 사용자 대상 기기(아이폰) + 요금(리스·할부) 영향, Apple 1차 출처 확인 가능, 독자 행동(주문 확인·취소·결제 방식 선택) 모두 웹·앱 화면으로 가능
- 제외한 후보: Windows 11 10월 업데이트·새 Photos 앱(화제성 낮음, Insider 단계 포함), Google Universal Cart·AI Mode(Trends 0), Gemini 4 Argon(10-13 발표로 48시간 밖)

## 주장 → 출처 → 확인 방법

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| 2026-09-09 발표, 시작가 $1,999(256GB), $83.29/월 24개월, 256GB·512GB·1TB·2TB | https://www.apple.com/newsroom/2026/09/apple-unveils-iphone-duo/ | "Pricing and Availability" 원문 |
| 512GB $2,199 · 1TB $2,599 · 2TB $3,199 | https://www.apple.com/shop/buy-iphone/iphone-duo | 페이지 텍스트의 모델별 가격 (Unlocked 행) |
| 사전 주문 10-16 5 a.m. PT, 출시 10-23, 추가 28개국·지역 10-30 | 9월 보도자료 + https://www.apple.com/newsroom/2026/10/open-up-to-new-possibilities-with-iphone-duo/ | 원문 대조. 스토어 페이지 "Available starting 10.23." |
| 내부 7.6인치 접는 화면 | 9월 보도자료, 사양 페이지 | "7.6-inch inner Super Retina XDR display" |
| 8:30 a.m. ET 모든 구성 내년으로 밀림, 1월 25일(일부 1월 29일) 예상 | 9to5Mac "iPhone Duo sells out immediately, now backordered until next year" (2026-10-16) | WebFetch 본문 확인 → 본문에 "9to5Mac reported"로 표기. AppleInsider(RSS 요약 "late January")·MacRumors·The Verge·CNBC 헤드라인 동일 |
| Apple 성명 "working hard to get this revolutionary new product into customers' hands as quickly as possible", 온라인 주문 계속 받음 (CNBC에 제공) | 9to5Mac "Apple calls iPhone Duo pre-order demand 'extraordinary'…" (2026-10-16) | WebFetch 본문의 인용문 |
| Apple이 10-23 매장 재고 여부를 밝히지 않음 | CNBC 헤드라인 "…Apple won't say if stores will have stock next week" (Google News RSS) | 헤드라인만 확인 → "CNBC reported"로 표기 |
| eBay에서 $5,000에 재판매 | MacRumors 헤드라인 "iPhone Duo Resold for $5,000 on eBay After Selling Out" | 헤드라인만 확인 → "MacRumors reported" |
| Apple Upgrade: Klarna 리스(구매·대출 아님), 24개월 $57.99·12개월 $82.99 | https://www.apple.com/shop/apple-upgrade, 10-15 보도자료 각주 | 페이지의 iPhone Duo 행 "Lease from $57.99/mo. for 24 mo. or from $82.99/mo. for 12 mo." |
| 첫 납부는 배송·픽업 가능 후 약 30일 | Apple Upgrade 각주, 보도자료 각주 | 원문 대조 |
| 리스 iPhone은 AT&T·T-Mobile·Verizon 선택 필요, Klarna 계정 필요, 미국 거주자만 | Apple Upgrade FAQ·Eligibility | 원문 대조 |
| Klarna가 AMEX·UnionPay, Chase·Capital One·Citibank 일부 발급사 카드 거부, Apple Pay·PayPal 불가 | Apple Upgrade FAQ "Which forms of payment are accepted" | 원문 대조 |
| 기간 종료 후 무조치 시 최대 6개월 월 단위 연장 → 이후 Klarna가 인수 금액 청구 | Apple Upgrade FAQ "What happens at the end…" | 원문 대조 |
| 인수 금액 = 서명 시 가격 − 납부액 (− 남은 보상 판매 크레딧), 반납 시 정가 초과 지불 없음 | Apple Upgrade FAQ "Purchase Option", "Will I pay more than the full price" | 원문 대조. 계산: 57.99×24 = 1,391.76, 1,999 − 1,391.76 = 607.24 / 82.99×12 = 995.88, 1,999 − 995.88 = 1,003.12 |
| 중도 해지 시 남은 납부액 전부, 손상 반납 시 1회 손상 수수료, 분실·도난(보험 없음) 시 가격 − 납부액 | Apple Upgrade FAQ | 원문 대조 |
| AppleCare 미포함, 등록 후 60일 안에 추가 가능 | Apple Upgrade FAQ "Does my lease include AppleCare coverage?" | 원문 대조 |
| iPhone 18 Pro 리스 $34.99×24 = $839.76, 가격 $1,199 (70.0%) | Apple Upgrade 각주 예시 | 원문 대조 + 계산. Duo는 1,391.76 / 1,999 = 69.6% |
| ACMI: 0% APR, iPhone은 24개월, 통신사 선택 필요, 3% Daily Cash 선지급 | https://support.apple.com/en-us/102730, 10-15 보도자료 "Apple Card Monthly Installments" | 원문 대조. 3% × 1,999 = 59.97 |
| Apple Trade In: iPhone 13 이상 $175~$885 즉시 크레딧 | 10-15 보도자료 "Apple Trade In" | 원문 대조 |
| 통신사 딜: 최대 $1,200 크레딧(AT&T, iPhone 14 Pro Max 이상 보상 판매), 36개월 할부, 서비스 해지 시 크레딧 중단·잔액 청구 | 10-15 보도자료 + 스토어 페이지 각주(AT&T·T-Mobile·Verizon) | 원문 대조 |
| Touch ID(측면 버튼), Face ID 없음 | https://www.apple.com/iphone-duo/specs/ "Touch ID", 18 Pro 사양 페이지 "Face ID" | Duo 사양·제품·보도자료에 "Face ID" 0건, 18 Pro 사양에는 있음 |
| eSIM 전용 | Duo 사양 "Dual eSIM… not compatible with physical SIM cards" | 원문 대조 |
| 무게 254g, 18 Pro Max 249g | Duo 사양, https://www.apple.com/iphone-18-pro/specs/ | 원문 대조 |
| 사진 HEIF·JPEG | Duo 사양 "Image formats captured: HEIF and JPEG" | 원문 대조 |
| Apple Intelligence SynthID 지원 예정 | 9월 보도자료 "with upcoming support for the SynthID standard, users can identify images generated or edited with AI" | 원문 대조 (날짜 없음) |
| Siri AI 베타·영어 우선, EU 초기 미제공, 서버 기능 일일 한도, "Expanded access to such features will be available for a fee in the future." | 9월·10월 보도자료 각주, 스토어 페이지 각주 | 원문 대조 |
| Apple Pencil(USB-C) 지원 연내 | 9월 보도자료 "Later this year, iPhone Duo will support Apple Pencil with USB-C" | 원문 대조 |
| AppleCare: Duo는 커버 레이어 교체에 별도 서비스 수수료 | https://www.apple.com/applecare/ 각주 "For iPhone Duo, a separate service fee applies for the replacement of the cover layer." | 원문 대조 (금액은 동적 로딩이라 미확인 → 금액 안 씀. 2026-10-28: AppleCare 요금 $19를 fees-deductibles 페이지로 확인해 본문에 넣음) |
| 주문 취소: Processing 상태에서 Order Listing → Cancel Item, 배송 주문은 미청구, 픽업 주문은 즉시 환불 시작 | https://www.apple.com/shop/help/viewing_changing_orders "Cancel Your Order" | 원문 대조 |
| 반품 14일(수령일 기준), 14일 안 가격 인하 시 차액(기간 한정 할인 제외), Apple 직접 구매품만 반품, 재판매 의심 주문 취소 가능 | https://www.apple.com/shop/help/returns_refund (Sales Policy 포함) | 원문 대조 |

## 쓰지 않은 것

- Apple Store 배송 예정일 직접 조회: `/shop/fulfillment-messages`가 curl·브라우저 세션 모두 HTTP 541, 스토어 화면에서도 예정일이 렌더링되지 않음 → 보도 기반으로만 씀
- 수리비 $1,499(AppleInsider 헤드라인), AppleCare+ 월 요금: Apple 페이지에서 금액이 동적 로딩이라 확인 못 함
- Bloomberg "Orders Slip Into 2027": 본문 미확인 (헤드라인만), 같은 내용은 9to5Mac 본문으로 확인
- 접는 화면 주름·내구성 평가, 판매량 추정: 1차 출처 없음

## 2026-10-28 후속 갱신 (세션 60, 개선 세션)

칼럼 후속(README 개선 세션 5번): 출시(10-23) 뒤 상황과 세션 59가 찾은 AppleCare+ 요금을 반영. `updatedAt` 2026-10-28. 제목·설명은 그대로(한 글 한 변경). 원문은 이 폴더 `source-*-2026-10-28.txt`·`source-apple-newsroom-2026-10-23-iphone-duo-arrives.txt` (curl로 받은 일반 페이지에서 인용 부분 발췌). Apple Store 배송 예정 API(`/shop/delivery-message`·`/shop/fulfillment-messages`)는 이번 세션에서도 열지 않음(권한 분류기가 막음) → 새 주문 배송 예정일은 여전히 보도 기반

| 주장 | 출처 | 확인 |
| --- | --- | --- |
| 10-23 Apple Store에 출시, 매장·온라인·Apple Store 앱에서 구입 가능, 재고 언급 없음 | https://www.apple.com/newsroom/2026/10/iphone-duo-arrives-at-apple-store-locations-worldwide/ "On Friday, October 23, the highly anticipated iPhone Duo made its debut at Apple Store locations worldwide", "Customers can explore and shop for … iPhone Duo … at Apple Store locations around the world, on apple.com, and in the Apple Store app" | 원문 대조 (`source-apple-newsroom-2026-10-23-iphone-duo-arrives.txt`) |
| 수요가 공급을 넘음, 워크인 고객 빈손, 10-24 미국·캐나다 픽업 재개 때 대부분 매장 픽업 없음 | MacRumors "Where to Buy iPhone Duo: Stores, Pickup, and Wait Times" (Tim Hardwick, 2026-10-25) | 보도 → "MacRumors reported" |
| 일부 예약 주문 배송일 앞당김 (12-01~08 → 11-16~23) | MacRumors "Apple Starts Moving Up iPhone Duo Delivery Dates" (Joe Rossignol, 2026-10-19) | 보도 → "MacRumors reported". 새 주문 예정일은 기사에 없음 |
| AppleCare+ with Theft and Loss for iPhone Duo $19.99/mo (SHPG3LL/A), $199.99/yr (SHPH3LL/A), "for this product only" | https://www.apple.com/shop/buy-iphone/iphone-duo (AppleCare 선택 데이터) | 원문 대조 (`source-apple-buy-iphone-duo-2026-10-28.txt`). 세션 59 API 값과 같음 |
| ACMI $83.29, 리스 $57.99(24개월)·$82.99(12개월) 그대로 | 같은 스토어 페이지, https://www.apple.com/shop/apple-upgrade "Lease from $57.99/mo. … for 24 mo. or from $82.99/mo. … for 12 mo." | 원문 대조 (`source-apple-upgrade-2026-10-28.txt`) |
| AppleCare는 리스와 별도로 Apple이 청구, 가입 후 60일 안 추가, AppleCare 없이 손상 반납 시 Klarna 1회 손상 수수료(금액 없음) | Apple Upgrade FAQ "billed separately from your lease by Apple", "up to 60 days after you enroll", "Klarna will charge you a one-time damage fee" | 원문 대조. 수수료 금액은 페이지에 없음 → "doesn't say how much" |
| AppleCare 포함 월 비용: 19.99 / 83.29+19.99 = 103.28 / 82.99+19.99 = 102.98 / 57.99+19.99 = 77.98, 103.28 − 77.98 = 25.30 | 위 값으로 계산 | 계산 (`applecare_monthly_chart.py`) |
| 커버 층 AppleCare 요금 $19 ("$19 for cover layer-only damage") | https://www.apple.com/legal/applecare/fees-deductibles/ | 원문 대조 (`source-apple-applecare-fees-2026-10-28.txt`). 보증 외 $49는 수리 가격 API(세션 59) 값이라 이번 세션에 다시 열지 않아 쓰지 않음 |
| 반품 14일: 10-23 수령분은 11-06까지 | https://www.apple.com/shop/help/returns_refund "You have 14 calendar days to return an item from the date you received it" | 원문 대조 + 계산 (`source-apple-returns-2026-10-28.txt`) |

- 그래픽: `iphone-duo-monthly-cost-with-applecare.webp` (`applecare_monthly_chart.py`, `chart_style.py` 라이트 모드. 기기 납부액 `muted` + AppleCare+ `accent`). 대표 이미지를 뺀 본문 이미지 2 → 3장
- 지운 것: What to watch next "October 23: first deliveries…"(지난 일정) → 11-06 반품 기한·11월 중하순 앞당긴 배송 추가. Who is affected "Hope to buy in an Apple Store on October 23 | Uncertain…" → 출시 후 보도로 교체
