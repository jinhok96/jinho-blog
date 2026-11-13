# office-2021-end-of-support 사실 확인표

- 검증 유형 (가설 H3): **조사형** — Microsoft 수명 주기 문서 대조만, 직접 실행 없음
- 주 검색어 (가설 H6): `office 2021 end of support` — 브리프 주 검색어

- 확인일: 2026-10-20 (세션 30, 영향 뉴스 세션 18:16 KST)
- 주 검색어: `office 2021 end of support`
- 하위 검색어: `office 2021 end of support date`, `office 2021 end of life`, `office 2021 end of life mac`, `office 2021 end of support on mac`, `microsoft office 2021 end of support`, `office ltsc 2021 end of support`
- 채널: 피드형 (뉴스 칼럼)
- 뉴스 유형: **영향** (종료일 10-13 이후 영향 지속, 다음 날짜 11-10 첫 Patch Tuesday, Office 2024 종료 2029-10-09)
- 독창 요소: 지금부터 Office 2024 종료(2029-10)까지 3년 비용 비교(무료 웹·Office Home 2024 1대/3대·Personal·Family), 가구 PC 대수별 손익분기(2대 $359.98 vs Family $389.97, 3대부터 Family가 쌈), Office Home 2024 가격 출시 $149.99 → 현재 $179.99(+$30) 비교, 일회성 구매 Office 버전별 지원 타임라인(대표 이미지), 사용자 유형별 영향 표
- 이미지: 2장 (직접 만든 그래픽 1200×675, `chart_style.py` 라이트 모드): 버전별 지원 타임라인(`thumbnail`), 3년 비용 비교

## 화제성 신호 (선정 때 확인)

- Google News RSS 30일: `"Office 2021"` 34건, `"Office 2024"` 44건, `"Office 2021 end of support"` 1건(정확 문구). 14일 `end of support` 검색 상위에 ZDNET "Office 2021 support ends this month – you have 5 options"(10-13), EIN Presswire(10-20)
- 자동완성 `office 2021 end of support` 13개 (Google·Bing: end of support·date, Google: end of life·mac·ltsc, YouTube: office 2021 free)
- Trends 미국 1개월: `office 2021` 3.3(최고 9) · `office 2024` 9.1(최고 27) · `microsoft 365` 64.3 · 기준 `remove background` 35.3

## 후보 비교 (제외·보류)

- Google 광고에 Gmail·Photos 정보 사용(Personal Intelligence AI Mode 광고 테스트): 보도 6건(Search Engine Land·Search Engine Roundtable·Techlicious), Google 공식 발표 미확인 → 보류 유지
- Microsoft Edge 재시작 없는 업데이트(Windows Blog 10-15): 테스트 단계, 독자 행동 없음 → 제외
- Discovery+ 가격 인상(10-13): 스트리밍(분야 밖) → 제외
- Pixel 6 지원 종료 임박(보도): 공식 날짜 미확인 → 이번 세션 미검토
- Marvel Unlimited 종료, Squad Busters 종료: 분야 밖

## 주장 → 출처 → 확인 방법

| 주장 | 출처 | 확인 |
| --- | --- | --- |
| Office 2021 지원 2026-10-13 종료, 연장·ESU 없음, 앱은 계속 작동할 수 있지만 보안 위험 | support.microsoft.com/en-us/office/system-requirements/end-of-support-for-office-2021 | curl 정적 HTML (`source-end-of-support-office-2021.txt`) |
| 종료 후 기술 지원·버그·보안 수정·업데이트·전화·채팅 지원 없음, 도움말 대부분 폐기 | 같은 문서 | 같음 |
| 회사·학교 관리 사본은 IT 헬프데스크에 문의 | 같은 문서 | 같음 |
| 대상 에디션: Home and Business(·Mac), Home and Student(·Mac), Professional. 시작 2021-10-05 | learn.microsoft.com/en-us/lifecycle/products/office-2021 (Retirement 10/14/2026 6:59:59 AM 표기 = 10-13 종료) | curl (`source-lifecycle-office-2021.txt`) |
| Office LTSC 2021 같은 날(10-13) 종료 | learn.microsoft.com/en-us/lifecycle/end-of-support/end-of-support-2026 | curl |
| Office 2016·2019 2025-10-14 종료, Office 2019 시작 2018-09-24 | end-of-support-2025, lifecycle/products/microsoft-office-2019 (Extended End 10/15/2025 6:59:59 AM) | curl (`source-lifecycle-office-2019.txt`) |
| Office 2024 지원 2029-10-09까지 (Retirement 10/10/2029 6:59:59 AM 표기, 2021·2019 표기 규칙과 같게 하루 전으로 해석) | learn.microsoft.com/en-us/lifecycle/products/office-2024 | curl (`source-lifecycle-office-2024.txt`) |
| Office Home 2024 $179.99 일회성, 1 PC or Mac / Personal $99.99/년 / Family $129.99/년 1~6명 2TB 공유 / Premium $199.99 | microsoft.com/en-us/microsoft-365/buy/compare-all-microsoft-365-products | curl(브라우저 UA) 정적 HTML (`source-compare-plans-excerpt.txt`), WebFetch 교차 확인 |
| 일회성 구매는 업그레이드 옵션 없음, 다음 버전은 정가 | 같은 페이지 FAQ | 같음 |
| Office Home & Business 2024 = Word·Excel·PowerPoint·Outlook·OneNote, 현재 가격은 페이지에 없음 | 같은 페이지 | 같음 |
| 출시가: Office Home 2024 $149.99(Word·Excel·PowerPoint·OneNote, Outlook 없음), Home & Business 2024 $249.99 | microsoft.com/en-us/microsoft-365/blog/2024/09/30/office-2024-for-consumers-available-october-1/ | curl |
| 무료 웹: Word·Excel·PowerPoint, Outlook 웹, OneDrive 5GB, Microsoft 계정 | microsoft.com/en-us/microsoft-365/free-office-online-for-the-web | curl |
| 버전 확인: Windows File > Account > Product Information, Mac Word > About Word | support.microsoft.com/en-us/office/lifecycle/lc-account/about-office-what-version-of-office-am-i-using | curl |
| LibreOffice Windows·macOS 다운로드, 최신 26.8.1 | libreoffice.org/download/download-libreoffice/ | curl |
| LibreOffice Writer 26.8.1이 .docx 저장, PDF 변환 시 줄마다 텍스트 상자 | 자체 측정 `tests/pdf-to-word-free/` (2026-10-20 세션 27) | 기존 측정 재사용 |
| 11-10 첫 Patch Tuesday (매월 둘째 화요일) | learn.microsoft.com/en-us/windows/deployment/update/release-cycle | backlog 반복 일정(2026-10-13 확인) |
| 3년 비용: Personal 99.99×3=299.97, Family 129.99×3=389.97, Home 2024 ×2=359.98, ×3=539.97 | 위 가격 계산 | `charts.py` |

## 쓰지 않은 것

- Office 2021 Outlook의 Microsoft 365 서비스 연결 지원 종료 여부: 1차 출처 못 찾음
- 연말 할인·구형 키 판매: 출처 없음 → 삭제
- 컨테이너에서 Office를 실행할 수 없어 직접 실행 표현 없음 (모두 문서 기반)

## 2026-10-29 후속 확인 (세션 64 개선 세션)

- 종료 10-13 뒤 변경 여부를 같은 1차 출처로 다시 받음(curl, 브라우저 UA): support.microsoft.com end-of-support-for-office-2021 본문은 `source-end-of-support-office-2021.txt`와 공백 정규화 후 **같음**("ended on October 13, 2026 … no extension and no extended security updates" 그대로), Lifecycle office-2021(Retirement 10/14/2026 6:59:59 AM)·office-2024(10/10/2029 6:59:59 AM) **같음**, 요금 비교 페이지 Office Home 2024 $179.99 · Personal $99.99/년 · Family $129.99/년 · Premium $199.99/년 **같음**
- → 글 변경 없음. 다음 확인: 11-10 첫 누락 Patch Tuesday 뒤 (Microsoft가 Office 2021 관련 공지·보안 권고를 내는지)

## 2026-11-13 상시 글 전환 (세션 96 개선 세션, 콘텐츠 정리 4번)

- 카테고리 `news` → `software`, 제목 `Office 2021 Support Has Ended With No Paid Extension` → **`Office 2021 End of Support on Home PCs and Macs`**(47자, 24H2 글 `… End of Support and the Free Update to 26H2`와 다른 끝맺음), 설명 158자, `thumbnail` 지우고 AI 대표 이미지(`hero-image.md`), 본문 이미지 2 → 3장(타임라인·비용 그림 11-13 기준으로 다시 + 새 그림 `office-security-notes-by-month.webp`), `updatedAt` 2026-11-13T19:30Z
- 검색 의도: 종료 전 '언제 끝나나' → 종료 뒤 '아직 업데이트되나·계속 써도 되나·무엇으로 바꾸나'. 자동완성(2026-11-13): `office 2021 end of support`(Google·Bing) 하위 12개, `does office 2021 still get updates`·`is office 2021 still being updated`·`office 2021 still supported`(Google·Bing)·`does office 2021 still work`·`office 2021 security updates`(Google·Bing)·`office 2021 end of life mac`·`update office 2021 to 2024`
- 상위 결과(WebSearch 2026-11-13 `office 2021 end of support still get updates november 2026`): Microsoft 지원 문서·ManageEngine·WPS·Office Watch·heise·Windows Latest 등 종료일을 옮긴 글뿐 → **11-10 보안 릴리스 노트·MSRC 데이터에 Office 2021이 있다는 내용은 없음**(빈틈). Mac 'disabled' 문제는 Microsoft Q&A 커뮤니티 글만(`lost use of 2021 office (home student version)` 등), 공식 수정 문구를 옮긴 글 없음
- 검증 유형 (가설 H3): **조사형** 그대로 (Office를 컨테이너에서 실행하지 않음, 문서·데이터 대조만)
- 뉴스 유형 줄(영향)은 그대로 둠 (가설 H5는 발행 때 유형)

| 주장 | 출처 (사본) | 확인 |
| --- | --- | --- |
| 지원 10-13 종료, 연장·ESU 없음, 앱은 "may continue to function", 기술 지원·버그·보안 수정·업데이트·전화·채팅 없음, 도움말 대부분 폐기, 회사·학교는 IT 헬프데스크 | support.microsoft.com end-of-support-for-office-2021 (`source-end-of-support-office-2021-2026-11-13.txt`) | Chromium, 10-20·10-29 사본과 같은 문장 |
| 대상 에디션 Home and Business(·Mac)·Home and Student(·Mac)·Professional, Oct 5, 2021 ~ Oct 13, 2026 | Lifecycle office-2021 (`source-lifecycle-office-2021-2026-11-13.txt`) — 이번 판은 Retirement Date를 Oct 13, 2026으로 직접 표기 | Chromium |
| Office LTSC 2021 같은 날 종료 | end-of-support-2026 (`source-eos-2026-2026-11-13.txt`), plan-upgrade-older-versions 표 (`source-plan-upgrade-older-versions-2026-11-13.txt`) | Chromium |
| Office 2024 Oct 1, 2024 ~ Oct 9, 2029, Home & Business·Home (Windows & Mac) | Lifecycle office-2024 (`source-lifecycle-office-2024-2026-11-13.txt`) | Chromium |
| **11-10 보안 릴리스 노트에 "Office 2021 Retail: Version 2610 (Build 20527.20196)", "Office LTSC 2021 Volume Licensed: Version 2108 (Build 14334.21048)"** | learn.microsoft.com/en-us/officeupdates/microsoft365-apps-security-updates (`source-m365-apps-security-updates-2026-11-13.txt`) | Chromium, 달별 표 `security-notes-presence.md`(`security_notes_presence.py`) |
| Office 2016·2019 Retail은 2025-10-14까지 있고 2025-11-11부터 없음, Office 2019 Volume Licensed는 2025-11 ~ 2026-11 13개월 모두 있음, Office 2019에만 "at Microsoft's sole discretion, we may choose to issue one or more updates to Office 2019" 안내 | 같은 사본 19행·달별 표 | 같음 |
| **MSRC November 2026 Security Updates: Office LTSC 2021 32·64비트 각 173 CVE(그중 172개 FixedBuild 16.0.14334.21048), Office LTSC for Mac 2021 141 CVE(FixedBuild 16.115.26110837), 2021 제품 고유 CVE 177, 제품 목록에 Office 2016·2019 이름 없음** | api.msrc.microsoft.com/cvrf/v3.0/cvrf/2026-Nov (JSON 약 18 MB, 발췌 `source-msrc-cvrf-2026-nov-office.txt`, `msrc_cvrf_office.py`) | curl 200 + 스크립트 |
| 업데이트 기록 페이지에도 LTSC 2021 Nov 10 Build 14334.21048, Retail Office 2021 Nov 10 Version 2610 (Build 20527.20196) | update-history-office-2021 (`source-update-history-ltsc-2021-2026-11-13.txt`) | Chromium. 같은 날 10-13 Retail은 업데이트 기록 2609(20430.20182), 보안 노트 2608(20326.20232)로 두 문서가 다름 → 본문은 11-10 빌드만 |
| Mac 16.114.3(10-27)·16.114.4(11-04): "A previous update inadvertently disabled Office 2021 for existing users. This update resolves the issue and fully restores functionality for affected customers." / 11-10 16.115 보안 업데이트 / 노트가 Office 2021에도 적용 / Help > Check for Updates(MAU) / macOS 14 이상이어야 업데이트 | release-notes-office-for-mac (`source-release-notes-office-for-mac-2026-11-13.txt`) | Chromium |
| 버전 확인: Windows Account(문서가 열려 있으면 File > Account), Product Information의 제품 이름 / Mac Word > About Word(버전·라이선스 종류) | 버전 안내 Windows 탭(`source-version-guide-2026-11-13.txt`)·Mac 탭(`source-version-guide-mac-2026-11-13.txt`, `render-tab.cjs`) | Chromium |
| Windows 업데이트 단계: Word 새 문서 → File > Account → Update Options > Update Now(안 보이면 Enable Updates), 창 닫기 / Update Options 없이 About만 있으면 볼륨 라이선스·회사 관리 | install-office-updates (`source-install-office-updates-2026-11-13.txt`) | Chromium, Applies To에 Word 2021 등 |
| 가격(미국, 11-13): Personal $99.99/년(첫해 $69.99 할인, 이후 정가 자동 갱신)·Family $129.99/년 1~6명 2 TB 공유·Premium $199.99, Office Home 2024 $179.99(Outlook은 "Free version only (includes ads)"), 일회성은 "no upgrade options", 구독은 "always have the latest features, fixes, and security updates" | compare-all-microsoft-365-products (`source-compare-plans-2026-11-13.txt`) | Chromium |
| Office Home 2024 $179.99(Word·Excel·PowerPoint·OneNote, 1 PC or Mac), Office Home & Business 2024 **$249.99** | 제품 페이지 (`source-office-home-2024-2026-11-13.txt`, `source-office-home-business-2024-2026-11-13.txt`, `render-body.cjs`) | Chromium (10-20에는 Home & Business 현재 가격을 못 찾았음) |
| 출시가 Home $149.99, Home & Business $249.99 + Outlook·상업적 사용 권리 | Office 2024 출시 블로그 (`source-office-2024-launch-blog-2026-11-13.txt`, 주소가 microsoft-365/blog → copilot/blog로 리디렉트) | Chromium |
| 무료 웹: Word·Excel·PowerPoint 웹, Outlook·OneDrive 웹·모바일, 5 GB | free-office-online-for-the-web (`source-free-web-2026-11-13.txt`) | Chromium |
| LibreOffice 26.8.3 Windows·macOS 다운로드 | libreoffice.org 다운로드 (`source-libreoffice-download-2026-11-13.txt`) | Chromium |
| 월간 보안 업데이트 = 매월 둘째 화요일 → 2026-12-08 | release-cycle (`source-release-cycle-2026-11-13.txt`) + 달력 계산 | Chromium |
| 3년 비용 299.97·389.97·359.98·539.97 | 위 정가 × 3 (`charts.py`) | 계산 |

- 쓰지 않은 것: Microsoft가 11월에 Office 2021을 고친 이유(공식 설명 없음 → 본문은 '설명 없음'만), 12월 이후 계속될지(추측 안 함), Mac 문제 커뮤니티 해결책(옛 빌드 설치·라이선스 제거 도구: 공식 문서 아님), Office 2019 볼륨 라이선스판이 MSRC 제품 목록에는 없는 이유
- 다음 확인: **2026-12-08 보안 릴리스 노트에 Office 2021 Retail·LTSC 2021이 있는지** → 있으면 그 달 빌드를 같은 절에, 없으면 '11월이 마지막'으로 고침 (반복 일정 Windows 월간 업데이트와 같은 세션)
