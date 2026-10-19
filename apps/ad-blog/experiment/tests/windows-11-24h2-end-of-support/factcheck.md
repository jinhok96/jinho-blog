# windows-11-24h2-end-of-support 사실 확인표

- 주 검색어: `windows 11 24h2 end of support` (자동완성 Google·Bing·YouTube 3곳)
- 하위 검색어: `windows 11 24h2 end of support date`, `windows 11 24h2 end of life`, `windows 11 24h2 end of service`, `windows 11 26h2 update`, `windows 11 26h2 enablement package`
- 채널: 피드형 (뉴스 칼럼). 제목 62자(주 검색어 맨 앞), 설명 152자
- 뉴스 유형: **영향** (18시 세션). 발표 2026-10-13(메시지 센터), 영향: 2026-11-10 첫 누락 업데이트부터 계속
- 화제성 신호 (2026-10-19): Google News RSS 30일 `Windows 11 24H2 end of support` 38건 · `Windows 11 26H2` 100건. 자동완성 "windows 11 24h2 end of support" 17개(3곳), "windows 11 26h2" 25개(download·iso·release date·update 3곳). Trends 미국 1개월: `windows 11 26h2` 4.7 · `windows 11 25h2` 1.7 · `windows 11 24h2` 0.5 · 기준 `remove background` 35.8
- 독창 요소: (1) 버전별 Home·Pro 지원 기간 타임라인(대표 이미지), (2) 오늘 기준 버전별 남은 보안 업데이트 개월 수 계산(24H2 0, 25H2 약 12, 26H2 약 24) + 첫 누락일 11-10, (3) 사용자 유형별 영향 표(Home/Pro·Enterprise/Education·25H2·26H2·26H1·23H2·Windows 10), (4) 같은 KB 번호(KB5127648)가 24H2·25H2·26H2에 함께 나간다는 점으로 enablement package 구조 설명
- 적용한 노하우: 뉴스 칼럼 구조(writing-guide), 피드형 제목 `{바뀐 것}: What It Means for You`, 직접 만든 그래픽 2장(1200×675), 내부 링크 2개(`windows-10-esu-extended`·`microsoft-365-family-storage-2tb`) + 역링크 1개(`windows-10-esu-extended`)
- 직접 실행: Windows는 컨테이너에서 실행 불가 → 단계는 Microsoft 문서 기반(본문에 출처 링크)

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| 24H2 Home·Pro 2026-10-13 업데이트 종료, 10월 보안 업데이트가 마지막, 보안·비보안 미리 보기 업데이트 모두 중단 | learn.microsoft.com/en-us/windows/release-health/windows-message-center (2026-10-13 항목), status-windows-11-24h2 "Current status as of October 13, 2026" | curl 정적 HTML, `source-status-24h2.txt` |
| Microsoft 권장: 26H2 또는 25H2로 업데이트 | 위 두 페이지 | 같음 |
| 24H2 Enterprise·Education 2027-10-12까지 | 메시지 센터, release information 표 | curl, `source-windows11-release-information.txt` |
| 종료일: 25H2 Home/Pro 2027-10-12, 26H2 2028-10-10, 26H1 2028-03-14, 23H2 Home/Pro "End of updates", 26H2 배포일 2026-09-29 | learn.microsoft.com/en-us/windows/release-health/windows11-release-information | curl, 같은 파일 |
| Pro Education·Pro for Workstations는 Home·Pro와 같은 열 | 같은 표 머리글 "End of updates: Home, Pro, Pro Education, and Pro for Workstations" | 같음 |
| 26H1은 새 기기용, 24H2·25H2에서 업데이트로 제공 안 됨 | 같은 페이지 Note | 같음 (본문에는 26H1 사용자는 "Nothing"만 씀) |
| 10월 업데이트 KB5127648이 24H2(26100.9711)·25H2(26200.9711)·26H2(26300.9711)에 같음 | 같은 페이지 버전별 릴리스 기록 | 같음 |
| 24H2·25H2·26H2는 같은 시스템 파일, 26H2 기능은 월간 업데이트에 꺼진 상태로 포함, enablement package 한 번 재시작, 선행 조건 KB5124010(2026-09-22) 이후 누적 업데이트, Windows Update에서 "Windows 11, version 26H2 is available" → Download & install | support.microsoft.com/en-us/servicing/os/windows-11/2026/09/kb5121794-feature-update-to-windows-11-version-26h2 | curl, `source-kb5121794.txt` |
| 26H2 발표 2026-09-29, 단계적 배포, safeguard hold 가능, `Get the latest updates as soon as they're available` | blogs.windows.com/windowsexperience/2026/09/29/how-to-get-windows-11-2026-update/ | curl 정적 HTML |
| 설정을 켜면 준비됐을 때 자동 다운로드·설치, 배포는 "over the next few months" 확대 | learn.microsoft.com/en-us/windows/release-health/status-windows-11-26h2 | curl |
| 26H2 알려진 문제: 가상 데스크톱(AVD·FSLogix) 검은 화면(해결), Administrator protection 원격 데스크톱 0xC000000D(완화), USB 오디오 등. 24H2 상태 페이지에도 같은 문제 | status-windows-11-26h2, status-windows-11-24h2 | curl |
| Safeguard hold 시 Windows Update에 "on its way, but not ready" 메시지, 수동 업데이트 자제 권고 | learn.microsoft.com/en-us/windows/deployment/update/safeguard-holds | curl, `source-safeguard-holds.txt` |
| 버전 확인: Start 우클릭 > Settings > System > About > Windows specifications | support.microsoft.com "Find information about your Windows device" (기존 링크 628bec99…가 리디렉트) | curl -L |
| Installation Assistant 현재 릴리스 26H2, Windows 10/11 라이선스, 관리자, 9GB, x64만(Arm 불가), Windows 10 2004 이상 | microsoft.com/en-us/software-download/windows11 | curl 정적 HTML |
| 지원 종료 OS도 계속 작동하지만 업데이트·보안 수정 없음, Home·Pro 24개월 | learn.microsoft.com/en-us/lifecycle/faq/windows | curl |
| 첫 누락 업데이트 2026-11-10 (둘째 화요일) | Microsoft Learn 릴리스 주기(둘째 화요일) + 날짜 계산 | Python `date` 계산 (11-10·12-08·2027-01-12) |
| 남은 개월 수: 25H2 약 12개월(355일/30.44=11.8), 26H2 약 24개월(722일/30.44=23.7), 2026-10-19 기준 | 위 종료일 | `charts.py` |

## 제외·보류한 정보

- "Windows Update will stop working on unpatched PCs next year"(TechPowerUp 10-11): 1차 출처를 찾지 못해 다루지 않음
- CISA KEV에 10-13 추가된 Windows 명령 주입 취약점(CVE-2026-96951): 영향 버전을 확인하지 못해 본문에서 뺌
- 24H2에서 25H2만 골라 설치하는 방법: Microsoft 문서에서 확인하지 못해 쓰지 않음 (Windows Update는 26H2를 제공)
