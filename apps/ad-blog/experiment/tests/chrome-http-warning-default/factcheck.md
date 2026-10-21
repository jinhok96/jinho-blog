# chrome-http-warning-default 사실 확인표

- 주 검색어: `chrome http warning` / 하위: `always use secure connections`, `always use secure connections chrome on or off`, `chrome enhanced protection vs standard`, `chrome enhanced protection turn off`, `chrome insecure site warning`, `chrome disable http warning`
- 채널: 피드형 (뉴스 칼럼)
- 뉴스 유형: **화제** (06시 세션, 2026-10-22 06:15 KST 시작)
- 독창 요소: Chrome 156을 직접 설치해 HTTP 경고 화면·Continue 후 재방문·새 프로필 첫 실행 꺼짐 → 재실행 켜짐 관찰(직접 캡처 3장), Standard vs Enhanced 보호 수준별 기능·전송 데이터 표(대표 이미지), 2022 → 2026-10-21 타임라인
- 적용 노하우: 피드형 제목(`{바뀐 것}: What It Means for You`, 66자), 대표 이미지 1200×675 직접 만든 그래픽, 이미지 5장(그래픽 2 + 직접 캡처 3), 내부 링크 2개(`turn-off-ai-in-chrome`·`windows-10-esu-extended`) + 역링크 1(`windows-10-esu-extended` 마지막, `updatedAt` 변경 없음). `turn-off-ai-in-chrome`은 V3 판단 기간(11-18)이라 본문을 고치지 않음

## 화제성 신호 (2026-10-21 21:00 UTC 전후 측정)

| 신호 | 값 |
| --- | --- |
| 발표 시각 | Google 블로그 2026-10-21 17:00 UTC (HTTP), 2026-10-20 17:00 UTC (scam) — JSON-LD `datePublished`, 세션 시작 기준 48시간 이내 |
| Google News RSS (when:2d) | `Chrome scam protection` 40건, `Chrome insecure HTTP warning` 6건 (blog.google·Android Authority·SecurityWeek·Chrome Unboxed·ZDNET 등) |
| 자동완성 (`demand_check.py suggest`) | `chrome http warning` 7개, `chrome enhanced protection` 17개(vs standard·turn off·reddit, Google·Bing·YouTube), `always use secure connections` 24개(on or off·meaning·android) |
| Trends 미국 7일 | `chrome enhanced protection` 0.1(최고 13) · `always use secure connections` 0.0 · `chrome http warning` 0.0 · 기준 `remove background` 65.6 → 검색량 작음, 피드형 |
| 비교 후보 | PHP2Shell(Google News 100건+, BBC·Reuters) → 웹사이트 운영자·개발자 대상, 일반 독자가 할 행동이 없어 제외(README 0번·개발자 대상). ChatGPT Ads 26개국 확대(미국 사용자 영향 없음·사업 뉴스), Google Maps CarPlay Gemini(18건, 기능 소개), Xbox Cloud Playtime(Insider 테스트 단계), Apple Music 로고(영향 없음) |

## 사실 → 출처 → 확인 방법

| 주장 | 출처 | 확인 |
| --- | --- | --- |
| 10-21 HTTP 연결 전 허락 요청을 모든 사용자 기본값으로, 올해 초 Enhanced 사용자에 먼저 | blog.google/security/chrome-now-warns-before-insecure-http-connections (2026-10-21 17:00 UTC) | curl 정적 HTML, `source-google-blog-2026-10-21-http.txt` |
| 승인 후 2주 이상 방문 안 할 때까지 재경고 없음, 단일 라벨·로컬 IP 제외, 데스크톱 약 95% 주간 경고 0회·1% 미만 3회 이상, 모바일 더 낮음, "first browser" | 같은 글 | 같음 |
| 2025-10-28 발표: Chrome 154(2026-10)에 기본값 예정, Chrome 147(2026-04)에 Enhanced 사용자, 2022 opt-in 출시, 공개 사이트 변형 | blog.google/security/https-by-defau | curl, `source-google-blog-2025-10-28-https-by-default.txt` |
| Chrome 147 안정판 2026-04-07, 154 2026-09-22, 156 2026-10-20 | chromiumdash.appspot.com `fetch_milestone_schedule` | API |
| 현재 안정판 156.0.8078.48(Windows) | versionhistory.googleapis.com | API. 테스트한 Linux deb는 156.0.8078.47 |
| suspicious site 경고·서버 Gemini 스캠 검사·ClickFix 복사 경고는 Enhanced 전용, 페이지 텍스트는 강한 스캠 신호 때만 전송·로그/보관/학습 없음, "ten times safer" | blog.google/security/our-latest-defenses-against-evolving-web-scams (2026-10-20 17:00 UTC) | curl, `source-google-blog-2026-10-20-scams.txt` |
| Standard/Enhanced 전송 데이터 설명 문구 | Chrome 156 설정 화면 (직접 캡처), 도움말 9890866 | `second_settings.png`, `f1_enhanced.png`, `source-help-9890866-safe-browsing.txt` |
| 설정 경로·옵션 이름(Warns you for insecure public sites / public & private sites), Android 경로, iOS는 옵션 없음 | 도움말 10468685 (Desktop·Android·iOS) | curl, `source-help-10468685-*.txt` |
| 경고 창 문구·버튼(Go back 강조), Continue 후 페이지 로드, 재방문 시 경고 없음 | 직접 실행: Chrome 156.0.8078.47 Linux, Xvfb, http.badssl.com | `capture.py`, `e1_warning.png`·`e2_loaded.png`·`e3_revisit.png` |
| NeverSSL은 방문마다 무작위 하위 도메인 → 매번 경고 | 직접 실행 | 주소창에 매번 다른 `*.neverssl.com` 확인 |
| 새 프로필 첫 실행 스위치 꺼짐 → 온라인 후 재실행 시 켜짐(public sites 선택) | 직접 실행: 같은 프로필(prof1)을 플래그 없이(`--no-sandbox --test-type`와 프록시만) 두 번 실행 | `first-launch-settings.png`(꺼짐) → `second_settings.png`(켜짐). 원인(서버 설정 적용)은 추정이라 본문에 원인을 단정하지 않음 |
| 직장·학교 기기는 조직이 설정 변경 가능 | 2025-10-28 글 (관리하는 조직이 경고 방식 설정) | 같음 |

## 측정 메모

- Playwright 기본 실행 인자(`--disable-features=...` 등)로 띄우면 스위치가 꺼진 채 HTTP 경고가 안 나옴 → 결과에서 제외. Chrome을 직접 실행하고 CDP로 붙여 측정(`capture.py`)
- HTTP 경고 창은 페이지 밖 대화상자라 CDP 스크린샷에 안 잡힘 → X 화면 캡처(`import -window root`)와 xdotool 클릭 사용
- HTTPS 업그레이드 시도가 컨테이너 프록시를 타지 않도록 `--proxy-bypass-list=*neverssl.com;*badssl.com`
- 확인 못 한 것: suspicious site 경고·Gemini 검사·ClickFix 경고는 실제 악성 페이지가 필요해 재현하지 않음(문서 기반으로 명시). 사용자가 예전에 직접 끈 경우 기본값이 다시 켜지는지는 확인 안 함
