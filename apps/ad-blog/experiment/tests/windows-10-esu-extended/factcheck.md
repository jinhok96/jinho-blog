# 사실 확인표: windows-10-esu-extended

- 검증 유형 (가설 H3): **조사형** — Microsoft ESU·KB 문서 대조만, Windows 환경 없음
- 주 검색어 (가설 H6): `windows 10 esu enroll option missing` — 2026-11-26 전환 때 바꿈(자동완성 Google·Bing·YouTube 3곳). 발행 때(2026-10-11)는 `windows 10 esu october 2026`(backlog.md 핵심 키워드, 브리프 없음)

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
| Enroll now 링크는 요건 충족 시에만 표시 | https://www.microsoft.com/en-us/windows/extended-security-updates "How to get" | "If your device meets the prerequisites, you'll see a link to enroll in ESU" |
| 로컬 계정: 등록 시 MSA 로그인 필요, 라이선스는 MSA에 연결. EEA에서 $30 구매는 이후 로컬 계정 사용 가능 | 미국판 "How to get" + en-ie 페이지 | en-ie 원문 "Allows continued use of a local account (no sign in with a Microsoft account required other than to make the purchase)". 미국판에는 등록 후 로컬 계정 전환 언급 없음 |
| 버전 확인: Settings > System > About > Windows specifications | https://support.microsoft.com/en-us/windows/which-version-of-windows-operating-system-am-i-running-628bec99-476a-2c13-5296-9dd081cdd808 | 원문 대조 |

## 쓰지 않은 것

- 연장 발표 시점(2026-06-25 편집자 주) — 1차 출처(blogs.windows.com) 미확인, 언론 보도만 있음
- `winver` 방법, Access work or school 경로 — 이번 세션에 Microsoft 문서로 확인 못 함
- 상업용 ESU 2년차 가격·시작일 — 출처 간 충돌

## 갱신 2026-10-14 (세션 5)

- 빌드 표 최신 행을 10월 업데이트로 교체: `KB5126657` (2026-10-13, OS Build 19045.7807·19044.7807), 9월 KB5122878(7725)·9월 14일 OOB KB5129236(7727)은 "최신 아님" 범위로 이동
- 출처: support.microsoft.com/en-us/topic/windows-10-update-history-8127c2c6-6edf-4fdf-8b9f-0f7be1ef3562 (좌측 목록 첫 항목), support.microsoft.com/en-us/help/5126657 → servicing/os/windows-10/2026/10/kb5126657-windows-10-21h2-22h2-security-update (Applies to: Windows 10 ESU, 알려진 문제: USB Audio Class 1.0 Code 10 — 9월 업데이트부터 이어짐, 부분 해결)
- KB5126657 자동완성(Google·Bing·YouTube)에서 하위 검색어 없음 → 사용자 지침대로 새 Fix형 글 대신 빌드 표만 갱신

## 전환 2026-11-26 (세션 105, 콘텐츠 정리 9번)

**왜**: 10-12부터 색인돼 있던 글이 11-21 20:22 UTC 재크롤링 뒤 `Crawled - currently not indexed`로 빠짐(대시보드 `first-seen.json` indexedAt 2026-10-12, URL 검사 11-22 회차부터). 10-26~11-22 웹 노출 24·클릭 2(CTR 8.3%, 평균 12.7위 — 사이트에서 클릭이 나는 몇 안 되는 글). 제목·첫 문단·'What changed and when' 절이 '10-13에 끝나지 않는다'는 소식 중심이었고 10-13이 지나 낡음, 빌드 표는 10월 업데이트가 최신, 본문 이미지 0장 → '지금 할 일'(상태 확인·등록·Enroll now가 안 보일 때) 중심 상시 글로 다시 씀 (같은 주소·카테고리 `software` 그대로)

### 작성 전 브리프 (2026-11-26 전환)
| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `windows-microsoft` 상시 글 (허브 `microsoft-end-of-support-dates`) |
| 주 검색어 | `windows 10 esu enroll option missing` (자동완성 Google·Bing·YouTube 3곳, 2026-11-25 `demand_check.py suggest`). 제목에는 Microsoft 화면 이름 'Enroll now'를 써서 'option'이 빠짐(동의어 대신 실제 링크 이름, prepublish WARN 감수) |
| 하위 검색어 | `windows 10 esu enrollment not showing`·`windows 10 esu enrollment`·`windows 10 esu free`·`windows 10 esu 2027`(모두 3곳), `how to check windows 10 esu enrollment status`(Google), `windows 10 esu without microsoft account`(Google) |
| 검색 의도 | 등록하고 싶은데 Windows Update에 Enroll now가 없음 / 등록됐는지 확인 / 무료인지·2027까지인지 |
| 상위 결과 (WebSearch 2026-11-25 `windows 10 esu enrollment not showing`·`windows 10 esu 2027 how to enroll`) | Microsoft Q&A·Tech Community 스레드(대부분 2025년, 옛 마법사·KB5068781 기준), Pureinfotech 2025 글, Microsoft 지역별 ESU 페이지. **빈틈**: 2026-09 준비 패키지 KB5126256·'이미 라이선스 있는 기기 제외' 같은 지금 요건을 순서대로 확인하는 글, 빌드 번호로 등록 여부를 판단하는 표(11월 업데이트까지) 없음 |
| 채널 | 검색형 |
| 차별점 | Microsoft release information 표로 만든 빌드 구간(등록 안 됨 ≤6466 · 밀림 6575~7811 · 최신 ≥7846)과 그래픽, Enroll now 누락 확인 순서 7단계, 미국·유럽 등록 방법 비교 |
| 내부 링크 계획 | 허브 `microsoft-end-of-support-dates`, `windows-11-24h2-end-of-support`, `office-2021-end-of-support`(새로), `customize-right-click-menu-windows-11`, 브라우저 글 2편·Pixel Watch 문장 유지(Pixel Watch 글이 받는 링크 2개를 지키려고 — 뺐다가 link_audit '받는 링크 2개 미만'이 떠서 1차 출처 다시 확인 후 되살림) |
| 개요 | 결론(지금 등록 가능·무료·링크가 없으면 요건 미충족) → 등록 여부 확인(빌드 표·그래픽) → Enroll now가 없을 때(확인 순서·그래픽) → 등록 방법·방법 고르기·로컬 계정·유럽(그래픽) → Windows 11로 옮길지 → FAQ → How we checked |
| 이미지 | 대표 이미지 그대로(10-11 생성, 주제 같음) + 본문 그래픽 3장(`charts.py`, 라이트 모드 토큰) |

**사실 확인 (2026-11-25 UTC Chromium `render-main.cjs`, `source-*-2026-11-25.txt`)**

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| 등록은 프로그램이 끝나는 2027-10-12까지 언제든, 이미 등록됐으면 자동 연장·조치 불필요 | https://www.microsoft.com/en-us/windows/extended-security-updates | [source](source-esu-page-us-2026-11-25.txt) "You can enroll in ESU any time until the program ends on October 12, 2027. If you’re already enrolled, your coverage will automatically continue through that date—no action needed." |
| 요건: 22H2 Home/Professional/Pro Education/Workstations, 최신 업데이트, KB5126256, 로그인 계정이 관리자 MSA, 자녀 계정 불가, 로컬 계정이면 MSA 로그인 요청 | 같은 페이지 'Windows 10 ESU prerequisites' | 원문 대조 |
| 제외: 키오스크, AD 도메인·Entra 가입·MDM, **이미 ESU 라이선스가 있는 기기**(새로 보임), Entra registered는 가능 | 같은 페이지 | 원문 대조 ("Devices that already have an ESU license.") |
| 소비자 등록 뒤 상업용 시나리오에 들면 소비자 등록 중지(상업용으로 쓰지 않을 때까지) | 같은 페이지 | 원문 대조 |
| 등록 방법 3가지: PC 설정 동기화 무료·Rewards 1,000점·$30+세금 1회, 최대 10대, Add device | 같은 페이지 'How much…', 'How to get…' | 원문 대조 |
| Enroll now 링크는 요건 충족 시에만, 로컬 계정이면 MSA 로그인 요청, 이미 설정 백업 중이면 등록 확인 창만 | 같은 페이지 'How to get Windows 10 ESU' | 원문 대조 ("If your device meets the prerequisites, you’ll see a link to enroll in ESU") |
| 등록 전에는 더 취약, 등록 뒤 2025-10-14 이후 나온 중요 업데이트를 모두 받음 | 같은 페이지 FAQ 'When can I enroll' | 원문 대조 ("more vulnerable and susceptible to viruses and malware before enrollment", "all critical and important updates released after Windows 10 end of support on October 14, 2025") |
| Windows 11 업그레이드 가능, 환불 정책·Rewards 주문 최종, 한 사용자 등록 시 같은 PC 모든 사용자 보호, 자녀 PC는 부모가 관리자 사용자로 등록, 상태 확인 Settings > Update & Security > Windows Update·구매 시 Order History | 같은 페이지 FAQ | 원문 대조 |
| ESU는 보안 업데이트만, 기능 개선·기술 지원 없음 | 같은 페이지 'What is Windows ESU?' | 원문 대조 |
| 유럽: MSA 로그인 유지 시 무료, 로그인 안 하면 최대 60일 뒤 중단·재등록, $30 구매는 로컬 계정 계속 사용, **Rewards는 목록에 없음** | https://www.microsoft.com/en-ie/windows/extended-security-updates | [source](source-esu-page-ie-2026-11-25.txt), 미국판과 diff (Rewards 줄이 en-ie 'How much' 절에 없음) |
| 빌드: 2025-10-14 KB5066791 19045.6456 / 2025-11-11 KB5071959 6466(OOB) / 2025-11-11 KB5068781 6575 / … / 2026-10-13 KB5126657 7807 / 2026-10-26 KB5134125 7811(OOB) / 2026-11-10 KB5131096 7846 / 2026-11-13 KB5136493 7850(OOB). 2025-11 ~ 2026-11 월간(B) 13개 | https://learn.microsoft.com/en-us/windows/release-health/release-information Version 22H2 표 | [source](source-windows10-release-information-2026-11-25.txt) 76~96행, `charts.py` `builds()`가 같은 파일을 읽고 B 13개를 assert |
| KB5131096·KB5136493·KB5126657·KB5068781 Applies To에 'Windows 10 ESU' | 각 KB 페이지 | [source](source-kb5131096-2026-11-25.txt) 등 'Applies To' 줄 |
| KB5136493은 비보안 OOB, KB5131096 포함 | https://support.microsoft.com/en-us/help/5136493 | 원문 대조 |
| KB5126256: 2026-09-08 게시, 미등록 기기에만, 2025-10-14 이후 보안 업데이트(KB5066791 등) 다음 설치, 자동 재시작, 등록·보안 업데이트 설치는 하지 않음 | https://support.microsoft.com/en-us/help/5126256 | [source](source-kb5126256-2026-11-25.txt) 원문 대조 |
| KB5071959(2025-11-11, 19045.6466): 등록 마법사 실패 해결, 미등록 소비자 기기에 제공 | https://support.microsoft.com/en-us/help/5071959 | [source](source-kb5071959-2026-11-25.txt) "the enrollment wizard may fail during enrollment" |
| 버전 확인: 시작 오른쪽 클릭 > Settings > System > About | https://support.microsoft.com/en-us/windows/experience/find-information-about-your-windows-device | [source](source-find-windows-device-info-2026-11-25.txt) 원문 대조 |
| Windows 10 Home·Pro 22H2 지원 종료 2025-10-14 | https://learn.microsoft.com/en-us/lifecycle/products/windows-10-home-and-pro | [source](source-lifecycle-windows-10-home-pro-2026-11-25.txt) |
| Windows 11 Home·Pro 24H2 종료 2026-10-13, 25H2 2027-10-12(ESU와 같은 날) | https://learn.microsoft.com/en-us/lifecycle/products/windows-11-home-and-pro | [source](source-lifecycle-windows-11-home-pro-2026-11-25.txt) 'Releases' 표 |
| Pixel Watch 2 (LTE)·3 (LTE) Safety Signal 12-12 종료 (기존 문장 유지) | https://support.google.com/googlepixelwatch/thread/471984501 | [source](source-pixel-watch-safety-signal-announcement-2026-11-25.txt) "we will be ending Safety Signal on Dec 12", 대상 모델 2개 |
| 빌드 19044 = 21H2 → 소비자 ESU 대상 아님 | release information 표(19044 = 21H2 LTSC) + ESU 요건(22H2만) | 두 출처를 합친 추론. 본문은 "the consumer program doesn't cover"로만 씀 |

- 쓰지 않은 것: 커뮤니티 해결책(서비스 재시작·레지스트리 등, WebSearch 결과의 Q&A·Pureinfotech) — 1차 출처가 아니고 비개발자 기준(레지스트리·명령) 위반 가능. 'gradual rollout' 설명 — 현재 Microsoft ESU 페이지에 없음. 상업용 ESU 2년차 가격 — 가정용 독자 대상 아님. 다음 월간 업데이트 날짜 — 이번 세션 1차 출처로 확인하지 않음
- 직접 실행: 없음 (Windows 10 PC 없음) → 검증 유형 **조사형** 그대로. 본문 'How we checked'에 밝힘
- 바꾼 문장: 제목 `Windows 10 ESU Now Runs to October 2027` → `How to Enroll in Windows 10 ESU When Enroll Now Is Missing`(58자), 설명 155자. 'What changed and when' 절 삭제(10-13 소식 → 첫 문단 한 줄과 How we checked로), 빌드 표 11월 기준(7811 OOB 반영), Enroll now 누락 절을 등록 절 앞으로 옮기고 '이미 라이선스 있는 기기'·준비 패키지가 등록은 안 한다는 점 추가, FAQ 'Can I still enroll after October 13, 2026?' → 'Is it too late…', 'business' 답에 소비자 등록 중지 규칙. `updatedAt` 2026-11-25T19:00Z
