# 사실 확인표: windows-10-esu-extended

확인일: 2026-10-11 (컨테이너에서 `curl`로 직접 받아 텍스트 추출). 직접 실행 검증 없음 (Windows 환경 없음) → 문서 기반 글.

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| 소비자 ESU 종료일 2027-10-12, 기존 등록자는 자동 연장·조치 불필요 | https://www.microsoft.com/en-us/windows/extended-security-updates | 본문 "You can enroll in ESU any time until the program ends on October 12, 2027… no action needed" |
| ESU는 보안 업데이트만, 기술 지원 없음 | 같은 페이지 | "does not provide other types of fixes… does not come with technical support" |
| 요건: 22H2 Home/Pro/Pro Education/Workstations, 최신 업데이트, KB5126256, 관리자 MSA, 자녀 계정 불가 | 같은 페이지 "Windows 10 ESU prerequisites" | 원문 대조 |
| 키오스크·AD/Entra 가입·MDM 제외, Entra registered는 가능 | 같은 페이지 | 원문 대조 |
| 등록 방법 3가지(설정 백업 무료 / Rewards 1,000점 / $30+세금), 최대 10대, Add device | 같은 페이지 "How much does Windows 10 ESU cost?", "How to get" | 원문 대조 |
| 환불: 국가별 디지털 구매 정책, Rewards 주문은 최종 | 같은 페이지 FAQ | 원문 대조 |
| 한 사용자가 등록하면 같은 PC의 다른 사용자도 보호 | 같은 페이지 FAQ | 원문 대조 |
| 자녀 PC: 부모가 관리자 사용자로 추가돼 본인 계정으로 등록 | 같은 페이지 FAQ | 원문 대조 |
| 상태 확인: Settings > Update & Security > Windows Update, 구매 시 Order History | 같은 페이지 FAQ | 원문 대조 |
| Windows 11 업그레이드 가능 | 같은 페이지 FAQ | 원문 대조 |
| EEA: MSA 로그인 유지 시 무료, 미로그인 최대 60일 후 중단·재등록, $30은 로컬 계정 가능 | https://www.microsoft.com/en-ie/windows/extended-security-updates | 원문 대조. 미국 페이지에는 60일 문구 없음 (diff로 확인) |
| KB5126256 2026-09-08 게시, 미등록 기기용, 2025-10-14 이후 보안 업데이트(KB5066791 등) 다음 설치, 자동 재시작, 업데이트 기록 표시명 | https://support.microsoft.com/en-us/help/5126256 | 원문 대조 |
| KB5071959(2025-11-11, 19045.6466): 등록 마법사 실패 해결, 미등록 소비자 기기에 제공 | https://support.microsoft.com/en-us/help/5071959 | 원문 대조 |
| 2025-10 이후 월간 업데이트 "Applies to: Windows 10 ESU" | KB5068781, KB5122878, KB5129236 페이지 | "Applies to" 항목 |
| 빌드: KB5066791 19045.6456, KB5068781 19045.6575, KB5120249 19045.7663, KB5122878 19045.7725, KB5129236 19045.7727 | 업데이트 기록 목록·각 KB 제목 | KB5122878 목록 표기가 7720/7725로 페이지마다 다름 → 해당 KB 페이지 제목(7725) 채택 |
| 버전 확인: Settings > System > About > Windows specifications | https://support.microsoft.com/en-us/windows/which-version-of-windows-operating-system-am-i-running-628bec99-476a-2c13-5296-9dd081cdd808 | 원문 대조 |

## 쓰지 않은 것

- 연장 발표 시점(2026-06-25 편집자 주) — 1차 출처(blogs.windows.com) 미확인, 언론 보도만 있음
- `winver` 방법, Access work or school 경로 — 이번 세션에 Microsoft 문서로 확인 못 함
- 상업용 ESU 2년차 가격·시작일 — 출처 간 충돌
