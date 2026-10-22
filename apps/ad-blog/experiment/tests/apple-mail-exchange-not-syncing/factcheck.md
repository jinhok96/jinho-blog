# apple-mail-exchange-not-syncing 사실 확인표

- 주 검색어: `apple mail exchange` (하위: apple mail exchange account not syncing, apple mail exchange not working, apple mail exchange web services, exchange online apple mail app not syncing, apple mail unable to verify exchange account, mac mail outlook not working)
- 채널: 피드형 (뉴스 칼럼)
- 뉴스 유형: **영향** (2026-10-22 18:10 KST 영향 뉴스 세션). 시행 2026-10-01(단계적 차단 시작), Apple 공지 2026-10-13, 최종 차단 2027-04-01 → 영향 기간 약 5개월
- 화제성 신호 (2026-10-22): Google News 30일 `Apple Mail Exchange Web Services` 23건·`Apple Mail Microsoft 365 sync` 26건·`EWS retirement` 36건. 자동완성 `apple mail exchange` 22개(Google·Bing·YouTube, not syncing·not working·exchange web services 포함), `mac mail outlook` 25개. Trends 미국 1개월 `apple mail exchange` 0.0 · `outlook for mac` 4.7 · 기준 `remove background` 72.0 (절대량 작음, 피드형)
- 독창 요소: (1) Apple의 해결책이 macOS 27 전용 + macOS 27은 Apple silicon 전용(Apple 보안 업데이트 목록) → Intel Mac은 해결 계획이 없다는 점을 두 Apple 문서를 맞대어 확인, (2) 앱·계정별 영향 표, (3) Mac 종류별(Apple silicon / Intel macOS 14~26 / macOS 13 이하) 선택지 그래픽(Outlook for Mac 최소 macOS 14.0), (4) Microsoft·Apple 일정 타임라인
- 적용 노하우: 1(피드형 제목 71자, 주 검색어 `Apple Mail Exchange` 앞), 5(그래서 할 일), 7(대표 이미지 + 본문 그래픽 3장). 직접 실행: 없음(Microsoft 365 업무 계정·macOS 환경 없음 → 문서 기반임을 본문에 밝힘)
- 다른 후보 (이번 세션): Samsung Messages 종료(보도상 2026-07 종료, 이미 지남 → 제외), ChatGPT Atlas 종료(2026-08-09, 30일 밖), Samsung SmartThings Tracker 종료(10월, 대상 적음), Marvel Unlimited(분야 밖), Windows 11 23H2 Enterprise 종료 11-10(기업)

## 주장 → 출처 → 확인

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| EWS는 약 20년 된 연결 방식, 2026-10-01부터 조직(tenant)별로 차단, 앱 허용 목록으로 유지 가능 | Microsoft Exchange 팀 블로그 "Exchange Online EWS, Your Time is Almost Up" (2026-02-05) | curl로 HTML 받아 본문 추출 `source-techcommunity-2026-02-05.txt` (Playwright는 "request is blocked") |
| 2027-04-01 완전 차단, 관리자가 EWSEnabled를 더 바꿀 수 없음 | 같은 블로그 | 같음 |
| Microsoft 365·Exchange Online에만 적용, Exchange Server(자체 서버)는 변경 없음 | 같은 블로그, Microsoft Learn "Deprecation of Exchange Web Services in Exchange Online" | `source-learn-ews-deprecation.txt` |
| 2023년에 2026년 10월 비활성화를 발표 | Microsoft Learn | 같음 |
| 조직별 허용 목록을 실제 사용 기반으로 미리 채움, 차단 후 관리자가 다시 켤 수 있음(서비스 중단 있음), "scream tests" 가능 | Exchange 팀 블로그 | `source-techcommunity-2026-02-05.txt` |
| Message Center MC1227454 (2026-02-05 게시): 10-01 단계적 차단, 2027-04-01 완전 종료 | mc.merill.net 미러 (Message Center 원문은 관리자 로그인 필요) | `source-mc1227454-mirror.txt` (보조, 본문에는 블로그를 인용) |
| Apple 공지(2026-10-13): Mail·Calendar·Contacts·Notes·Reminders가 Exchange와 동기화·로그인 안 되면 관리자에게 문의, 관리자는 EWS 허용 + Apple Internet Accounts 앱 ID 추가, macOS 27 향후 업데이트에서 Graph API로 | support.apple.com/en-us/149092 | curl `source-apple-149092.txt` |
| legacy Outlook for Mac은 2026년 10월부터 Exchange Online에서 작동 중지, Legacy Outlook 스위치 끄기, Help > Check for Updates 또는 App Store, 자체 서버는 2029-10-09까지 | support.microsoft.com/en-us/outlook/end-of-support-for-legacy-outlook-for-mac | curl `source-microsoft-legacy-outlook-mac.txt` |
| iPhone·iPad의 Exchange 계정은 Exchange ActiveSync | support.apple.com/en-us/105128 | curl `source-apple-105128-ios-activesync.txt` |
| macOS 27 지원 기기 = Apple silicon Mac + MacBook Neo | support.apple.com/en-us/100100 (보안 업데이트 목록, macOS Golden Gate 27 행 2026-09-14) | curl `source-apple-security-releases.txt` |
| About This Mac에 Apple silicon은 Chip, Intel은 Processor | support.apple.com/en-us/116943 | curl `source-apple-116943-apple-silicon.txt` |
| Outlook for Mac: App Store 무료(앱 내 구입), "Now free with your personal email accounts", macOS 14.0 이상, 버전 16.114 (10-14) | apps.apple.com/us/app/microsoft-outlook/id985367838 | curl `source-mac-app-store-outlook.txt` |
| 계정 제거 시 Mac의 메시지는 지워지고 서버에 사본 유지, On My Mac 메일함으로 옮겨 보관, 경로 System Settings > Internet Accounts | support.apple.com/guide/mail/add-email-accounts-mail35803/mac | curl `source-apple-mail-guide-accounts.txt` |
| Intel Mac의 최신 macOS는 Tahoe 26 | 위 macOS 27 지원 기기 목록에서 추론 (27이 Apple silicon 전용) | 본문은 "Intel Macs cannot install macOS 27"로 씀 |

## 확인하지 못한 것 (본문에 단정하지 않음)

- 개인 Outlook.com·Hotmail 계정이 Mac Mail에서 영향을 받는지: Microsoft·Apple 문서 모두 언급 없음 → 표에 넣지 않음
- 업무 계정으로 Outlook for Mac을 쓸 때의 라이선스 조건: App Store 문구는 개인 계정만 언급 → "IT에 문의"로 씀
- macOS 27.1 이후 업데이트에 Graph 지원이 들어갔는지: 2026-10-22 기준 Apple 공지 갱신 없음
- outlook.office.com은 컨테이너에서 417 → 본문에 주소를 쓰지 않음

## 이미지

- 대표 이미지 `mail-exchange-sync-hero.webp`: `hero-image.md` 참고 (연보라 배경 + 하늘색·복숭아색, 정면 시점. 최근 대표 이미지 `remove-metadata-from-photos`는 연노랑 + 청록·코랄, 아이소메트릭)
- 본문 그래픽 3장 (`charts.py`, `chart_style.py` 라이트 모드): `ews-shutdown-timeline.webp`, `ews-who-is-affected.webp`, `ews-options-by-mac.webp`
