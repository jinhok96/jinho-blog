# customize-right-click-menu-windows-11 사실 확인표

## 작성 전 브리프 (2026-10-30 KST 세션 67, 뉴스 세션)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `windows-microsoft` (우선순위 5) 뉴스 칼럼. 같은 클러스터 상시 글 `windows-10-esu-extended`, 칼럼 `windows-11-24h2-end-of-support`로 링크 |
| 뉴스 유형 | **화제** (48시간 안 발표): KB5127936 2026-10-28 (Microsoft 메시지 센터 10:00 PT, release information 최신 수정 2026-10-28T17:55Z). 세션 시각 2026-10-29 21:16 UTC → 약 27시간 |
| 화제성 신호 | Google News 48시간 `KB5127936` 17건, `Windows 11 right-click menu` 29건(PCWorld·Ars Technica·How-To Geek·TechRadar·Windows Central·Digital Trends). 같은 시점 다른 후보: Chrome 156·Firefox 159 보안 수정 `Chrome security update` 51건(발표 10-27, 48시간 경계·`ai-settings` 맞지 않음), Gemini 파일 편집 21건(독자 행동 없음), Edge Accelerated App Launches 9건(자동 적용). Trends 7일(미국): `windows 11 right click menu` 0.1(최고 3) · `customize right click menu` 0.0 · `chrome update` 16.2 · 기준 `remove background` 66.4. Trends 급상승 RSS에 IT 항목 없음 |
| 주 검색어 | `customize right click menu windows 11` — `demand_check.py suggest` 2026-10-29: Google·Bing·YouTube 3곳(`change right click menu windows 11`도 3곳). 상위 `windows 11 right click menu`도 3곳(하위 22개) |
| 하위 검색어 | `windows 11 right click menu show more options`(Google) · `windows 11 right click menu always show more`(Google·Bing) · `windows 11 right click menu not showing`(YouTube) · `windows 11 context menu settings`(Bing) · `kb5127936`(Bing) · `windows 11 classic right click menu`(YouTube) · `windows 11 right click menu slow`(3곳) |
| 검색 의도 | 뉴스(무엇이 바뀌었나) + How-to(어떻게 받고 바꾸나) |
| 채널 | 피드형 (뉴스 칼럼) |
| 상위 결과 (WebSearch `customize right click menu windows 11`, 2026-10-29) | WindowsDigitals·Guiding Tech·HelpDeskGeek(작은 블로그, 레지스트리 명령·타사 앱 위주), 스팸성 복제 페이지 2개, Yahoo Tech(무료 앱), Pureinfotech(ViVeTool 강제 활성화). 뉴스는 PCWorld·TechRadar·Windows Central·Ars. **빠진 것**: 버전별로 누가 받는지(25H2·26H2만, 26H1 10월 미리 보기에는 없음, 24H2 Home·Pro는 업데이트 종료), 설치해도 단계 배포라 메뉴가 안 보일 수 있다는 점, Get the latest updates 스위치, 11-10 보안 업데이트와의 관계, 같은 업데이트가 고친 문제·남은 알려진 문제 |
| 차별점 | ① Microsoft release information·KB 두 개(25H2·26H2 / 26H1) 대조로 만든 버전별 대상 표 ② Insider 발표(08-17) → Insider 설정(09-11) → Release Preview(10-16) → 미리 보기(10-28) → 11-10 보안 업데이트 타임라인 ③ 지금 설치 vs 11-10 기다리기 비교(고친 문제·남은 문제) ④ KB 문서 화면 캡처(접힌 Gradual rollout 단락을 펼쳐 문구 확인). 명령줄·레지스트리·ViVeTool 방법은 쓰지 않음(독자 기준 0번) |
| 내부 링크 계획 | 나가는 링크: `windows-11-24h2-end-of-support`(24H2 사용자 → 26H2로), `windows-10-esu-extended`(Windows 10은 보안 수정만), `turn-off-ai-in-windows-11`(같은 업데이트의 AI 구성 요소 → Windows AI 끄기). 받는 링크: 색인된 `windows-11-24h2-end-of-support`(26H2로 올려야 하는 이유 문단 뒤 1문장), 색인된 `windows-10-esu-extended`(ESU는 기능 개선 없음 문장 뒤 1문장), `turn-off-ai-in-windows-11`(AI actions 항목이 메뉴에서 빠지는지 문서에 없다는 문장 뒤 1문장, seo-audit "Shipping a new page" 받는 링크 3곳 항목으로 추가). 새 글 → `turn-off-ai-in-windows-11` 링크는 Copilot+ AI 구성 요소 문장 대신 AI actions 문장으로 |
| 개요 | 첫 문단(결론) → What happened → Who is affected(표) → What changes for you → What to do now(단계) → Our take → What to watch next → FAQ(`show more options`·`not showing`) → How we checked |
| 이미지 | 대표: 둥근 마우스(오른쪽 버튼 빛남) + 빈 막대 메뉴 패널(막대 2개를 빼내고 나머지에 토글) + 톱니, 연민트 배경 + 코랄·네이비, 3/4 시점. 본문 4장: ① 버전별 대상 그래픽 ② KB5127936 문서 캡처 + 주석 ③ 타임라인 ④ 지금 설치 vs 11-10 비교 |

## 사실 확인

| 주장 | 출처 (이번 세션 직접 열람, 원문 파일) | 확인 |
| --- | --- | --- |
| KB5127936은 2026-10-28 미리 보기(Preview) 업데이트, OS 빌드 26300.9818(26H2)·26200.9818(25H2), "Applies To" 26H2·25H2 all editions | support.microsoft.com KB5127936 (`source-kb5127936.txt`), release information 표 (`source-windows11-release-information.txt`, 2026-10 D) | 일치 |
| 새 메뉴는 "Gradual rollout" 단락: "faster, simpler, and more customizable", 맨 아래 **Customize menu**로 설정 페이지, 기본 명령(Send to·Create shortcut) 켜고 끄기, Print 추가, 앱 확장을 기본 메뉴/하위 메뉴/하위 메뉴 숨김, Cut·Copy·Paste·Rename·Delete·Share를 아이콘 줄 대신 글자로, Properties 맨 아래로. "No action is required to use the default configuration. To see more options, hold down Shift and right-click on your desktop." | `source-kb5127936.txt` Gradual rollout, 캡처 `screens/kb5127936-context-menu.png` (Playwright로 접힌 단락을 펼쳐 캡처) | 일치 |
| 단계 배포 정의: "features reach devices over time instead of all at once, meaning availability varies by device" | `source-kb5127936.txt` Highlights | 일치 |
| 설치 경로: Start > Settings > Windows Update > Advanced options > Optional updates | `source-kb5127936.txt` How to get this update | 일치 |
| "These changes will appear in the next security update to Windows Update for Business." | `source-kb5127936.txt` (Business 행) | 일치 |
| 월간 보안 업데이트는 직전 달 미리 보기의 비보안 내용을 포함, 새 기능은 미리 보기에서 먼저 나오고 관리되지 않는 PC에 단계 배포된 뒤 보안 업데이트로 출시, 미리 보기는 넷째 주·보안 업데이트는 둘째 화요일 10:00 PT | learn.microsoft.com release-cycle (`source-release-cycle.txt`, ms.date 2026-09-29) | 일치 |
| 11월 보안 업데이트 2026-11-10 | 둘째 화요일 계산(2026-11-01 일요일) + backlog 반복 일정 + `windows-11-24h2-end-of-support` 사실 확인표 | 일치 |
| Get the latest updates as soon as they're available: Settings > Windows Update에서 켜면 비보안 업데이트·기능을 먼저 받고 "prioritized for future updates", 보안 업데이트는 켜든 끄든 그대로 | support.microsoft.com (`source-get-updates-asap.txt`) | 일치 |
| 26H1 10월 미리 보기 KB5127653(28000.3365)에는 새 메뉴 항목 없음 (File Explorer 항목은 미리 보기 창·Home·세부 정보 창) | `source-kb5127653-26h1.txt` | 일치 (본문은 "doesn't list"로만 씀) |
| 26H1은 2026년 초 출시된 새 기기 전용, 24H2·25H2에서 업데이트로 받을 수 없음 | release information (`source-windows11-release-information.txt` 10행) | 일치 |
| 24H2 Home·Pro는 2026-10-13 업데이트 종료, 미리 보기도 받지 못함 / 23H2 Home·Pro "End of updates" | 메시지 센터 (`source-windows-message-center.txt`), release information 표 | 일치 |
| 메시지 센터 2026-10-28: 10월 비보안 미리 보기가 26H2·26H1·25H2에 나옴, 26H2 하이라이트 첫 줄이 컨텍스트 메뉴 | `source-windows-message-center.txt` | 일치 |
| Insider 블로그 2026-08-17: 새 메뉴 발표, 설정 앱 **Personalization** 아래 Context Menu 페이지, 맨 위 기본 명령(Print는 원래 Windows 11 메뉴에 없던 것), 앱 확장 위치, Windows 10 습관을 위한 글자 명령·Properties 맨 아래, "full set of options just a click away in Settings", 앱이 넣는 항목이 메뉴를 느리게 함 | blogs.windows.com (`source-insider-blog-2026-08-17.txt`) | 일치 |
| Insider 2026-09-11 (Experimental): 첫 사용 안내 팁, 설정에서 Customize menu 항목 끄기, Send To 문제 수정 | `source-insider-builds-2026-09-11.txt` | 일치 (10월 KB에는 Customize menu 끄기 언급 없음) |
| Release Preview 2026-10-16 빌드 26200.9807/26300.9807에 같은 문구 | learn.microsoft.com Insider 릴리스 노트 (`source-release-preview-26200-9807.txt`) | 일치 |
| KB5127936이 고친 문제: Administrator protection 켠 PC로 원격 데스크톱 연결 실패(0xC000000D), Smart App Control 다시 켜기 회색, AMD 일부 그래픽 카드 HDMI·DisplayPort 소리 | `source-kb5127936.txt` Normal rollout | 일치 |
| 남은 알려진 문제: 2026-09-08 보안 업데이트 뒤 일부 USB Audio Class 1.0 장치 Code 10·소리 없음, 해결 중 | `source-kb5127936.txt` Known issues | 일치 |
| 같은 업데이트의 다른 변경: Cloud rebuild(Settings > System > Recovery > Rebuild PC, 파일 삭제 선택), Privacy & security 페이지 카메라·마이크·위치 묶음, 메모리 무결성(HVCI)을 업데이트 중 켤 수 있음(사용자·관리자 선택은 존중), Copilot+ PC AI 구성 요소 1.2610.1063.0 | `source-kb5127936.txt` | 일치 |
| Windows 버전 확인: Settings > System > About > Windows specifications | support.microsoft.com (`source-find-windows-version.txt`) | 일치 |
| Windows 10 ESU는 보안만, 기능 개선 없음 | `windows-10-esu-extended` 본문 인용(Microsoft ESU 페이지 "does not provide other types of fixes, feature improvements, or product enhancements") | 기존 글 사실 확인 |

## 쓰지 않은 것

- 직접 실행: 컨테이너에 Windows가 없어 새 메뉴·설정 화면을 직접 보지 못함 → 본문은 "According to Microsoft" 기반, How we checked에 밝힘. 설정 페이지 이름은 Insider 블로그 캡션("The new Context Menu page in the Settings app, under Personalization")만 근거
- 새 메뉴에 **Show more options** 항목이 남는지: Microsoft 문서에 없음 → 쓰지 않고 KB의 Shift + 오른쪽 클릭 문장만 인용
- 앱 확장의 기본 위치(하위 메뉴로 가는지): 문서에 기본값 없음 → "선택할 수 있다"로만
- ViVeTool·레지스트리로 강제 활성화·옛 메뉴 복원: 명령줄·개발 도구 → 독자 기준 0번으로 제외
- 2026-10-23 Beta 채널 배포(검색 요약에만 있고 10-23 Insider 글에서 확인 못 함)
- techcommunity "Understanding Windows monthly updates"는 컨테이너에서 "The request is blocked" → learn.microsoft.com release-cycle 문서로 대신 확인
