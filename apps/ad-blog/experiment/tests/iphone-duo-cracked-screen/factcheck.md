# iPhone Duo 내부 화면 균열 — 브리프·사실 확인표

## 작성 전 브리프 (2026-10-28 06:50 KST, 세션 59 뉴스 세션)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `phones-subscriptions` 뉴스 칼럼 (화제, 피드형). 같은 클러스터에 상시 글·허브가 없음 → 같은 클러스터 칼럼 `iphone-duo-sold-out`(색인)·`iphone-handoff-verizon-cost`(색인)로 연결하고, 다음 날 생길 상시 검색(iOS 27 수리 준비, iPhone Duo 화면 보호 필름·커버 층)을 backlog 클러스터 공백 후보로 올림 (clusters.md 6순위 "새 칼럼은 상시 글로 이어질 때만" → 상시 글 후보 2개를 함께 올림) |
| 주 검색어 | `iphone duo cracked screen` — `demand_check.py suggest` 2026-10-27: `iphone duo cracked`·`iphone duo cracked screen` Google·YouTube, 하위 `cause`·`issue`·`reddit`·`iphone duo cracked display`(Google). `iphone duo screen` 3곳 28개 중 `iphone duo screen crack`·`crack issue`·`breaking`·`failure`·`screen gate`(YouTube), `iphone duo screen cracking`·`screen replacement`(Bing), `iphone dual screen crack`·`repair cost`(Google). Trends 미국 7일: `iphone duo` 평균 44.7(최고 100, 최근 25.9) · `iphone duo screen` 2.2 · `macbook pro m6` 0.2(최근 3.7) · `t-mobile t-mix` 0.0 · 기준 `remove background` 2.9 |
| 하위 검색어 | `iphone duo screen replacement`(Bing·YouTube), `iphone dual screen repair cost`(Google), `iphone duo cracked screen cause`(Google), `iphone duo inner display damage`(Bing), `iphone duo screen protector removal`(YouTube), `iphone duo applecare`(보도 다수) |
| 검색 의도 | 뉴스 (무슨 일이고 Apple이 뭐라고 했나) + 내 휴대폰은 어떻게 하나 (공짜인가, 얼마인가, 어디에 연락하나, 반품·AppleCare+ 기한) |
| 채널 | 피드형 (뉴스 칼럼) |
| 상위 결과 | Google News 48시간 `iPhone Duo display crack` 100건(상한). 상위: Reuters·BBC·CNBC·Bloomberg·The Verge·MacRumors·9to5Mac·AppleInsider·USA Today·Guardian·FT 등 대형 매체의 Apple 성명 보도, 원인 추정(CNET·Fortune·Notebookcheck 분해·벤드 테스트), 수리비 글(shattered.io·tech-insider "Warranty vs $999", idevice "$999 without AppleCare+", KCENTV "What to do if your iPhone Duo screen breaks"). WebSearch `iphone duo cracked screen` 상위 5: PhoneArena(가짜 사진 논란), TechSpot(L자 균열), Android Authority, Cult of Mac, Tom's Guide. 공통: Apple 성명 "small number", AppleCare 연락, $999·$99. 빠진 것: Apple 가격 API로 본 iPhone 18 Pro·Pro Max 화면 수리비와 비교(내부 화면이 2.6배), 커버 층(보증 제외 "protective coatings") vs 내부 화면 구분, iOS 27 수리 준비(Find My "Repair or Trade In"), 반품 14일·AppleCare+ 60일·보증 1년 날짜, Apple Upgrade 리스 반납 손상 수수료, Apple 서비스 프로그램 페이지에 iPhone Duo 항목 없음 |
| 차별점 (독창 요소) | (1) Apple 수리 가격 API(OOW·AC+)를 직접 받아 iPhone Duo와 iPhone 18 Pro·Pro Max 비교 그래프, (2) Apple 수리 가격 화면 캡처(보증 외·AppleCare 두 탭, 내부 화면 줄 accent 상자), (3) 상황별 누가 얼마 내나 표(결함·사고·커버 층·리스·통신사 구매), (4) 기한 타임라인(10-23 첫 배송 → 11-06 반품 14일 → 12-15/12-22 AppleCare+ 60일 → 2027-10 보증 1년), (5) iOS 27 수리 준비 단계(Apple 109519, 2026-09-15판), (6) Apple 보증서 문구로 본 결함 vs 사고 판정 기준과 견해 |
| 내부 링크 계획 | 나가는 링크: `iphone-duo-sold-out`(결제 방식·리스), `iphone-handoff-verizon-cost`(번호 공유, 수리 중 다른 iPhone), `ios-27-2-siri-ai-memory`(27.2 업데이트 — 백업 전 최신 iOS), `apple-siri-settlement-claim`(같은 클러스터 Apple). 받는 링크: 색인된 `iphone-duo-sold-out` "Our take" 커버 층 문단 끝 1문장, 색인된 `iphone-handoff-verizon-cost` 관련 문단 1문장 |
| 개요 | 첫 문단(결론: 균열 결함은 Apple이 교체, 사고는 $999/$99) → 요약 표 → What happened → Who is affected(상황별 표) → What changes for you(가격 비교·결함 vs 사고·커버 층·기한) → What to do now(번호 단계) → Our take → What to watch next → How we checked |
| 이미지 | 대표 이미지(펼친 일반 폴더블 휴대폰, 가운데 접힘을 따라 가는 균열 선, 옆에 보호 방패와 작은 드라이버·핀셋, 버터 옐로 배경 + 딥 네이비·로즈 핑크, 위에서 내려다본 시점) + 본문 4장: Apple 수리 가격 화면 캡처 2탭(accent 상자), iPhone Duo 내부 화면 vs iPhone 18 Pro·Pro Max 화면 수리비 막대(보증 외·AppleCare+), 상황별 비용 카드, 기한 타임라인 |

- 화제성 신호 (H5 기록용): 유형 **화제** (Apple 성명 2026-10-26 17:14 UTC 9to5Mac 보도, 세션 시점 약 29시간 전). Google News 48시간 `iPhone Duo display crack` 100건(상한) · `MacBook Pro M6` 100건 · `Instagram Features long-form` 100건 · `T-Mobile T-Mix` 68건 · `Apple Creator Studio` 61건 · `Genie 4` 61건 · `Fitbit Edge` 50건 · `Gemini Live` 23건 · `Firefox Smart Window` 10건 · `ChatGPT iCloud` 9건 · `iOS 27.2 age verification` 9건 · `Copilot Edge sidebar` 3건. 자동완성 `iphone duo screen` 3곳 28개
- 제외한 48시간 후보: MacBook Pro·iMac M6(독자 행동이 구매뿐), Instagram 긴 영상(테스트, 독자 행동 없음), T-Mobile T-Mix(`phones-subscriptions`, Trends 7일 0.0, 요금제 비교는 통신사 페이지 위주), Apple Creator Studio AI(구독자 한정), Genie 4(연구 모델), Fitbit Edge(기기 출시), ChatGPT iCloud 메일·캘린더 연결(`ai-settings`에 맞지만 기사 9건, openai.com·help.openai.com 컨테이너 403 → 1차 출처 확인 불가. 다음 뉴스 세션 후보), Firefox Smart Window AI(10건, 직접 검증 가능 → backlog), Edge 사이드바 Copilot 이전(3건, Microsoft 공식 설명 없음)

## 사실 확인표

원문은 이 폴더 `source-*.txt` (`render.cjs`·`render2.cjs`·`faq.cjs`로 Chromium 렌더링, 2026-10-27 21:35~21:45 UTC), 가격은 `api-pricing-OOW.json`·`api-pricing-AC2B.json`(Apple 수리 가격 위젯이 부르는 `support.apple.com/ols/api/pricing/...` 응답), AppleCare+ 요금은 `api-applecare-product-price.json`(apple.com/applecare "All model pricing"이 부르는 `apple.com/us/shop/mcm/product-price` 응답). 컨테이너에 iPhone Duo가 없어 기기·설정 화면은 직접 열지 못함 → 본문 How we checked에 밝힘.

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| Apple 성명 전문: "We are aware of an issue impacting the inner display on a small number of iPhone Duo units. If users experience issues with their iPhone Duo display, they should contact AppleCare for a replacement." | 9to5Mac 2026-10-26 10:14 PT (Apple이 9to5Mac에 준 성명) | 기사 원문 (언론 보도 → "Apple told 9to5Mac"로 씀). CNBC·Reuters·BBC 등 같은 날 같은 성명 보도(Google News 제목) |
| AppleCare+가 없어도 교체 대상, 통신사에서 샀어도 통신사가 아니라 Apple(AppleCare)에 연락 | 9to5Mac 같은 기사 | "9to5Mac reported"로 씀 (Apple 문서에 없음) |
| 균열은 힌지(접힘) 중앙선을 따라 생김, 빨리 나타남, 대부분 기기는 영향 없음 | 9to5Mac 같은 기사 | 보도로 씀. 원인은 Apple이 밝히지 않음 (분해·벤드 테스트 추정은 쓰지 않음) |
| iPhone Duo 보증 외 예상 비용: 커버 층 $49, 뒷면 유리 $199, 배터리 $229, 후면 카메라 $229, 외부 화면 $379, 외부 화면+뒷면 $509, **내부 화면 $999**, 기타 손상 $1,499 | support.apple.com/iphone/repair/screen-replacement (iPhone Duo 선택) | `source-apple-iphone-screen-repair.txt`, `api-pricing-OOW.json`, 캡처 `price-widget-service.png` |
| AppleCare 요금(iPhone Duo): 배터리 $0, 커버 층 $19, 뒷면 $29, 외부 화면 $29, **내부 화면 $99**, 기타 사고 $99, 도난·분실 $149 | 같은 페이지 AppleCare service options 탭, apple.com/legal/applecare/fees-deductibles ("$19 for cover layer-only damage", "$99 for inner display damage") | `source-apple-iphone-repair-applecare-tab.txt`, `api-pricing-AC2B.json`, `source-apple-applecare-fees.txt`, 캡처 `price-widget-applecare.png` |
| iPhone 18 Pro Max 화면 $379 (AppleCare $29), iPhone 18 Pro 화면 $329 (AppleCare $29) | 같은 API, iPhone 18 Pro 항목 | `api-pricing-*.json` → 내부 화면 $999는 18 Pro Max 화면의 2.64배 |
| "Estimated fees are for out-of-warranty service from Apple and may be subject to tax", "We'll need to inspect your product to provide a personalized estimate", 공인 서비스 제공업체는 자체 요금 | 수리 페이지 | 원문 |
| Apple Limited Warranty: 제조 결함 1년 (구입일부터), 사고(accident)·남용·외부 원인 제외, "protective coatings that are designed to diminish over time" 제외(결함이 아니면), Apple·공인 업체가 아닌 사람의 수리로 생긴 손상 제외, 보증 서비스는 수리 또는 같은 모델로 교체 | apple.com/legal/warranty/products/ios-warranty-document-us.html | `source-apple-limited-warranty-ios.txt` |
| AppleCare: 기계적 고장에 서비스 요금 없음("There are no service fees for mechanical failures"), 사고마다 서비스 요금, "For iPhone Duo, a separate service fee applies for the replacement of the cover layer" | apple.com/applecare 각주 | `source-apple-applecare.txt` |
| AppleCare+ 구입: 새 제품 구입 후 60일 안에 기기 설정 앱에서 가능, 보장 범위 확인 Settings > General > AppleCare & Warranty | apple.com/applecare FAQ | `source-apple-applecare.txt` |
| AppleCare+ with Theft and Loss for iPhone Duo $19.99/mo. 또는 $199.99/yr (iPhone 18 Pro $14.99/$149.99, iPhone 17 $12.99/$129.99) | apple.com/applecare "All model pricing"이 부르는 가격 API | `api-applecare-product-price.json` (SHPG3·SHPH3) |
| 반품: 받은 날부터 14일, 원래 상태·구성품·포장 | apple.com/shop/help/returns_refund | `source-apple-returns-refund.txt` |
| Apple Upgrade 리스: AppleCare 미포함(가입 후 60일 안에 추가), AppleCare 없이 good working condition이 아니면 Klarna가 손상 수수료 1회 청구, 반납 전 수리 가능, AppleCare가 있으면 서비스 요금. 가입 14일 안 반품 가능 | apple.com/shop/apple-upgrade FAQ | `source-apple-upgrade.txt` |
| iPhone Duo 출시: 2026-10-23 Apple Store 판매 시작 | Apple Newsroom 2026-10-23 "iPhone Duo arrives at Apple Store locations worldwide" | `source-apple-newsroom-2026-10-23-iphone-duo-arrives.txt` |
| 사전 주문 2026-10-16, 첫 배송 10-23 | Apple Newsroom (세션 20 `iphone-duo-sold-out` 확인) + 이번 세션 10-23 Newsroom | 10-23 판매 시작은 이번 세션 원문, 10-16은 기존 글 인용 |
| 가격 $1,999부터 | apple.com/iphone-duo | `source-apple-iphone-duo-page.txt` "From $1999" |
| 내부 화면: 10겹 이상 초박형 층 + 나노 텍스처 마감, 내부 화면에 긁힘 방지 코팅, 광학 투명 접착제가 접힐 때 층이 미끄러지게 해 스트레스·주름을 줄임 | apple.com/iphone-duo 본문·FAQ (Is iPhone Duo a durable foldable phone?, Does the inner display show a crease?) | `source-apple-iphone-duo-page-full.txt` |
| 수리 준비: 백업, iCloud 동기화 확인, Apple Cash 끄기, Wallet 카드 삭제, Parts and Service History 확인, **iOS 27 이상은 Find My 앱 > 기기 > More > Repair or Trade In > Enable**(iOS 26 이하는 Find My 끄기), 영수증·신분증 지참, 돌려받은 기기는 지워져 있을 수 있음 | support.apple.com/en-us/109519 (Published Date: September 15, 2026) | `source-apple-109519-prepare-service.txt` |
| 금 간 유리로 쓰지 말 것("Don't use iPhone with cracked glass, as it may cause injury"), 손상 의심 시 사용 중단, 수리는 Apple·공인 업체 | iPhone User Guide Important safety information (iph301fc905) | `source-iphone-guide-handling.txt` |
| 연락: support.apple.com/repair, Apple Support 앱, 1-800-692-7753 | apple.com/applecare FAQ "How can I get my device repaired?" | `source-apple-applecare.txt` |
| Apple 서비스 프로그램 목록에 iPhone Duo 없음 (최근 항목 Mac mini 2025-06-13, iPhone 14 Plus 후면 카메라 2024-11-01) | support.apple.com/service-programs | `source-apple-service-programs.txt` (2026-10-27 21:37 UTC) |

- 쓰지 않은 것: 원인(CNET·Fortune·Notebookcheck의 분해·부품 압력 추정, Apple 미확인), 영향받은 대수, 가짜 AI 사진 논란, 커버 층을 직접 떼도 되는지(Apple 임원 인터뷰 보도뿐 → Apple 문서는 "수리는 Apple·공인 업체", 보증은 비공인 수리 손상 제외로만 씀), 증상(밝은 픽셀 줄 등, 보도마다 다름), 28개국 10-30 출시(이번 세션 재확인 안 함)
