# 사실 확인표: microsoft-365-family-storage-2tb

확인일: 2026-10-18 (한국 18~19시). support.microsoft.com 문서는 curl 정적 HTML로 본문 확인(원문 텍스트: [source-changes-to-microsoft-365-storage.txt](source-changes-to-microsoft-365-storage.txt), [source-microsoft-storage-quotas.txt](source-microsoft-storage-quotas.txt)). microsoft.com 요금 페이지·OneDrive 페이지는 Playwright(Chromium 1194) 렌더링으로 텍스트 추출. 직접 실행 검증 없음(계정·구독 필요) → 문서 기반 뉴스 칼럼.

## 글 설정

- 유형: 뉴스 칼럼 (**영향**, 18시 정기 세션. 새 구독 적용 2026-10-08, 기존 구독 2027-05-02 이후 첫 갱신, Pro 2027-11-01 → 최근 30일 안 발표 + 시행일이 몇 달~1년 이상 이어짐)
- 주 검색어: `microsoft 365 family storage`
- 하위 검색어 (`demand_check.py suggest`): microsoft 365 family additional storage·cloud storage·onedrive storage (Google·Bing), share storage·sharing cloud storage (Bing), increase storage·storage space·outlook storage (Google), onedrive storage full (Google·Bing·YouTube)
- 채널: 피드형 (Discover). 제목 71자, 주 검색어 앞 28자 안
- 독창 요소: 가구 인원별 총 용량 전후 그래프(대표 이미지), **구독 유형·갱신일별 전환 시점 계산**(연간 5월 1일 갱신이면 2028-05-01까지 유지), 전환을 앞당기는 행동 2가지(Premium 업그레이드·만료 후 재구매), **Microsoft 문서끼리의 차이**(할당량 페이지: 초과 시 읽기 전용·Outlook 송수신 중단·3개월 동결·6개월 삭제 vs 변경 안내: 최대 1년 접근), **Microsoft 자사 페이지끼리의 차이**(OneDrive 페이지 "Up to 6 TB (1 TB per person)" vs 요금 비교 페이지 "2 TB shared"), 6TB를 iCloud+로 옮길 때 연 비용 계산
- 이미지 2장 (직접 만든 그래픽 1200×675, [charts.py](charts.py)): `family-storage-by-household-size.webp`(대표, `thumbnail`), `storage-switch-dates.webp`
- 내부 링크: `compress-video-for-discord-email`(용량 줄이기), `windows-10-esu-extended`, `iphone-handoff-verizon-cost` (3개)

## 화제성·영향 신호 (선정 근거)

- Google News RSS 최근 30일 기사 수: `"Microsoft 365" storage shared 2TB` 22 · `"Microsoft 365 Family" storage` 38 (ZDNET·Windows Central·TechRadar·PCWorld·The Verge·Neowin 등 10-08~10-13)
- 자동완성 "microsoft 365 family storage" 31개(Google·Bing·YouTube), "onedrive storage" 23개
- 영향 뉴스 기준: 시행일 있음(2027-05-02, 2027-11-01), 미국 일반 사용자 구독, 공식 1차 출처(Microsoft Support), 독자 행동(계정 대시보드 확인·휴지통 비우기·업그레이드 보류·자동 갱신) 모두 비개발자 가능
- 제외·보류한 후보
  - Windows 11 24H2 Home·Pro 지원 종료(10-13): 이미 지난 날짜, 업데이트 안내형이라 일반 글 후보로 남김
  - Marvel Unlimited 12-07 종료: IT 도구 분야 밖
  - Gemini 앱 Skills 배포(10-13, 11월 중순 완료): 기존 글 `gemini-gems-to-skills` 갱신 대상 (새 글 아님)
  - Edge 업데이트 방식(10-15): 프로토타입·기업 기능 위주, 일반 사용자 마감일 없음
  - Canada 시간대 변경(11-01): 미국 독자 아님
  - 커스텀 GPT 12-11 종료: help.openai.com·openai.com 여전히 403
- Trends 미국 급상승 RSS 10개: 스포츠·연예·날씨 등 → IT 주제 없음

## 주장 → 출처 → 확인 방법

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| Family·Premium 2 TB 공유, Pro 5 TB, 최대 6명(본인 + 5명) | https://support.microsoft.com/en-us/onedrive/changes-to-microsoft-365-storage | 원문 대조 |
| 파일은 공유하지 않는 한 비공개 | 같은 문서 | 원문 대조 |
| 새·업그레이드 구독 2026-10-08부터, 기존 구독은 2027-05-02 이후 첫 갱신 때, 갱신 전 이메일 | 같은 문서 "When does this change go into effect" | 원문 대조 |
| 2027-05-02 전 업그레이드는 즉시 공유 저장 공간(Premium 2 TB), 다운그레이드만으로는 전환 안 됨 | 같은 문서 "upgrade or downgrade" | 원문 대조 |
| 지원 시장의 기존 고객은 갱신 때 보너스 저장 공간 가능(시장·용량 미공개) | 같은 문서 | 원문 대조 |
| 2 TB 초과해도 최대 1년간 파일 접근 가능 | 같은 문서 "What happens if my family uses more than the storage quota" | 원문 대조 |
| 최대 10 TB까지 추가, 추가분은 공유 풀에 합산, 소유자만 추가 가능 | 같은 문서 + https://support.microsoft.com/en-us/onedrive/microsoft-storage-quotas | 원문 대조. 추가 요금은 두 문서 모두 미기재 |
| 기존(2026-10-08 전) Family·Premium·Pro 1 TB per person, 최대 6명 / Basic 100 GB / Personal 1 TB | microsoft-storage-quotas 표 | 원문 대조 |
| 만료 후 재구매도 새 구독(2 TB 공유) | microsoft-storage-quotas Note "including expired subscriptions that you repurchase" | 원문 대조 |
| 기존 Pro는 2027-11-01 5 TB 공유로 자동 전환 | microsoft-storage-quotas Note | 원문 대조 |
| 초과 시 OneDrive 읽기 전용·동기화(카메라 롤 포함) 중단, Outlook.com 송수신 불가, 3개월 후 동결, 6개월 후 삭제 가능 | microsoft-storage-quotas "What happens when you exceed" | 원문 대조. 변경 안내의 "최대 1년"과 다름 → 본문에 두 문서 차이로 표기, 판단은 "2 TB 아래로 유지" |
| 저장 공간 확인: 계정 로그인 후 **Microsoft storage** 섹션 | https://support.microsoft.com/en-us/onedrive/what-is-microsoft-cloud-storage | 원문 대조 |
| OneDrive 휴지통도 용량에 포함, **Empty recycle bin** | 같은 문서 | 원문 대조 |
| 큰 파일 보기 링크 `onedrive.live.com/?qt=search&sp=size` | microsoft-storage-quotas "View the largest files" (go.microsoft.com/fwlink/?linkid=859455 리디렉션) | curl -I로 리디렉션 확인 |
| 구독 관리 주소 account.microsoft.com/services/microsoft365 | changes 문서 "How do I cancel" | 원문 대조 |
| Family $129.99/년, Premium $199.99/년, Personal $99.99/년 (월 $12.99·$19.99·$9.99), Family "2 TB of shared, secure cloud storage", "AI for subscription owner only" | https://www.microsoft.com/en-us/microsoft-365/buy/compare-all-microsoft-365-products | Playwright 렌더링 2026-10-18 |
| OneDrive 페이지는 Family "Up to 6 TB of secure cloud storage (1 TB per person)" 표기 | https://www.microsoft.com/en-us/microsoft-365/onedrive/additional-file-storage | Playwright 렌더링 2026-10-18 |
| iCloud+ 미국 2 TB $9.99·6 TB $29.99·12 TB $59.99/월 (일부 주 세금 추가) | https://support.apple.com/en-us/108047 | curl 정적 HTML |
| 가격 변경 발표 없음 | Microsoft 두 지원 문서·요금 페이지에 가격 변경 언급 없음 | 원문 확인 (보도도 "prices unchanged") |

## 계산

- 인원별 총 용량 차이: 2 TB − N TB → 1명 +1 TB, 2명 0, 3~6명 −1~−4 TB. 감소율 3명 33%, 6명 67%
- 균등 분배 시 1인당: 2,000 GB / N → 1,000·667·500·400·333 GB
- 전환 시점: 기존 구독은 "2027-05-02 이후 첫 갱신". 연간 5-01 갱신 → 2028-05-01, 5-02 갱신 → 2027-05-02, 1-15 갱신 → 2028-01-15 (그래프의 예시 3행). 월간은 2027-05-02~06-01 사이 첫 갱신
- 남은 기간: 2026-10-18 → 2027-05-02 약 6.5개월, → 2028-05-01 약 18.5개월
- iCloud+ 6 TB 연 비용 $29.99×12 = $359.88 = Family $129.99의 2.77배
- 1인 사용 시 Family 2 TB $129.99 vs Personal 1 TB $99.99

## 확인하지 못한 것

- Microsoft 공식 발표문(블로그) 원문: 검색에서 찾지 못함 → 지원 문서 기준으로만 씀. AI 혜택 공유는 보도만 있고 요금 페이지는 "AI for subscription owner only"라 본문에서 다루지 않음
- OneDrive 추가 저장 공간 가격 (로그인 필요)
- Google One 요금: one.google.com/about/plans 렌더링에 요금이 나오지 않음 → 본문 비교에서 제외

## 2026-10-27 재확인 (세션 57 개선 세션: 칼럼 후속 확인 + 본문 그래픽 1장)

- 두 Microsoft 문서를 curl로 다시 받아(`source-changes-to-microsoft-365-storage-2026-10-27.txt`·`source-microsoft-storage-quotas-2026-10-27.txt`) 10-18 저장본과 diff
  - **본문이 인용한 사실은 모두 그대로**: 10-08 신규·재구매 2 TB 공유, 기존 Family·Premium은 2027-05-02 이후 첫 갱신, Pro 2027-11-01 5 TB, 업그레이드 시 즉시 전환·다운그레이드만으로는 전환 안 됨, 10 TB까지 추가, "supported markets" 보너스 저장 공간, 넘으면 "can continue to access your files for up to one year"(변경 문서) vs 읽기 전용·3개월 동결·6개월 삭제 가능(할당량 문서)
  - 바뀐 것: 변경 문서의 요금제 목록이 표로 바뀜(내용 같음), "Why did storage change?" → "What are the benefits of shared storage?", "Why is Microsoft making this change?" 단락 삭제, **"How can I see how much storage my family/group is using?" 단락 추가**: 전환 뒤에는 onedrive.com·Microsoft 계정에서 구성원별 사용 총량(다른 사람은 총량만)을 볼 수 있고, 전환 전에는 구성원에게 직접 물어봐야 함, 한도를 넘으면 알림 → 본문 "What to do now" 1번(각자 확인 후 합산)과 맞음. 할당량 문서 10-18 저장본은 한도 초과 절이 빠진 채 저장돼 있었고(2,249자) 10-27판(5,081자)에 그 절 전체가 있음: OneDrive 업로드·편집·동기화 불가(카메라 롤 포함)·기존 파일 읽기 전용, Outlook.com 송수신 불가, Teams 첨부 메시지 불가, 3개월 동결, 6개월 삭제 가능
  - 추가 저장 공간 가격은 여전히 문서에 없음 → 본문 "Its support pages don't list the add-on price" 그대로
- 판단: 칼럼 내용 갱신 없음(`updatedAt` 그대로)
- 새 본문 그래픽 `microsoft-365-over-2tb-two-answers.webp`(`over_limit_card.py`, 디자인 시스템 라이트 모드): 본문 "The bigger risk" 문단의 두 문서 설명을 나란히. 카드 문장 ↔ 원문
  - Near 2 TB ↔ "If your subscription approaches the 2 TB limit, you'll receive notifications so that you can plan ahead. You can free up space, purchase additional storage…"
  - Over 2 TB ↔ "If your subscription exceeds the limit, you can continue to access your files for up to one year while you manage your storage."
  - Over the limit ↔ "OneDrive: You can't upload, edit, or sync new files, including files from your camera roll. Your existing files remain, but they're read-only." + "Outlook.com: You can't send or receive email if you exceed either your cloud storage quota or mailbox storage quota."
  - After 3 months ↔ "If you remain over your OneDrive storage limit, your OneDrive account is frozen."
  - After 6 months ↔ "If you remain over your OneDrive storage limit, Microsoft might delete your OneDrive and all files in it."
- 대표 이미지를 뺀 본문 이미지 2 → 3장 (writing-guide 본문 이미지 규칙)
