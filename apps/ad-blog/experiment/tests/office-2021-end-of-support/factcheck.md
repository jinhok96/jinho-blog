# office-2021-end-of-support 사실 확인표

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
