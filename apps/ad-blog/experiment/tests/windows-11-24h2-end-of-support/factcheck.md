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

## 2026-10-28 후속 갱신 (세션 61, 개선 세션 5번 칼럼 후속)

- 방법: 세션 이전 저장본(`source-status-24h2.txt` 10-13판)과 이번 세션 curl로 받은 판(`source-*-2026-10-28.txt`, 2026-10-28 09:2x UTC)을 공백 정규화 후 비교. 쓴 스킬: `copy-editing` Content Refresh(Refresh vs. Rewrite → "Core message still valid, details outdated" = Light refresh: Freshness·Accuracy pass만, URL·소제목·목소리 유지), AI-Tell Check
- 바뀐 것
  - R1. 24H2·26H2 상태 페이지 "Current status as of October 21, 2026": "rollout is phased and will expand over the next few months" → "The Windows 11, version 26H2 phased rollout has reached full availability for devices running Windows 11, versions 25H2 and 24H2." 설정 문장도 "If the update is ready for your device, it will download and install automatically" → "If you want updates to be installed as soon as they're available, turn on Get the latest updates as soon as they're available."
  - R2. 2026-10-26 비보안 OOB 업데이트 KB5134133(26300/26200/26100.9725): Applies To "Windows 11 version 24H2, all editions", "intended for devices that do not receive current certificate trust list (CTL) updates … devices in disconnected environments" (eMudhra 인증 기관 키 유출 대응, 메시지 센터 10-26 항목). release information 표 24H2 Home/Pro 열은 여전히 "End of updates"
- 그대로인 것: 메시지 센터 10-13 항목(24H2 Home·Pro 업데이트 종료, 26H2·25H2 권장), release information 종료일(26H2 2028-10-10 · 26H1 2028-03-14 · 25H2 2027-10-12 · 24H2 Enterprise/Education 2027-10-12 · 23H2 End of updates), 10-13 KB5127648 세 버전 공통, KB5121794 "common core … identical set of system files"·"master switch", safeguard holds "on its way, but not ready"·"don't attempt to manually update", 다운로드 페이지 Current release 26H2·9 GB·관리자·라이선스·x64만, lifecycle FAQ "may still work with programs and hardware"
- 알려진 문제(26H2 상태 페이지 10-28): 미해결 2건 모두 Mitigated — Remote Desktop 0xC000000D(Administrator protection, KB5134133 "primarily affects enterprise-managed remote devices"), USB Audio Class 1.0 장치 시작 실패. 24H2 상태 페이지에도 둘 다 있음. "safeguard hold" 문구는 두 페이지 모두 표 머리말에만 있음 → 본문에 "doesn't list any safeguard hold"
- 본문 반영: 첫 문단 "October 2026 security update", 둘째 문단 10-21 전면 배포 1문장, 확인 날짜 10-28 추가, What happened 단계 배포 문장 → 10-21 전면 배포 인용, Who is affected 확인 날짜, What changes for you KB5134133 문단, What to do now 3·5·6단계(설정 설명을 새 문장에 맞춤, 10-28 hold 없음, "by November 10" → "still offers nothing"), Our take 알려진 문제 문장·"three weeks or so" 삭제·단계 배포 반론 삭제, What to watch next "Safeguard holds lifting" → "New known issues or holds". `updatedAt` 2026-10-28. 제목·설명·이미지 그대로
- 쓰지 않은 것: KB5134133의 Smart App Control 알려진 문제(해결 방법이 레지스트리 명령·그룹 정책뿐 → 비개발자 기준 밖, 24H2만의 문제도 아님), eMudhra 인증서 신뢰 목록 변경 자체(Windows가 자동 갱신)
