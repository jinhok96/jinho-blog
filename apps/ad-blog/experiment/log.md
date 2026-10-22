# 운영 로그

최신 세션이 위에 오도록 기록합니다. 형식: 날짜 · 한 일 · 측정값(있으면) · 다음 할 일.

## 2026-10-23 · 세션 40 (정기 실행, 뉴스 세션 · 화제): Gemini Connected Apps가 Customize 메뉴로

세션 시각: 2026-10-23 06:15 KST → 뉴스 세션. 열린 PR 없음. 작업 브랜치를 `origin/main`(8d2dfb4)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-24 ~ 10-22, 세션 39 이후 바뀐 값만)**

- 노출 325 → **351**, 클릭 8, CTR 2.5% → 2.3%, 평균 순위 22.6 → 22.7
  - `image-to-text-offline-free` 51 → 55 (9.1) / `spotify-family-qr-code-verification` 30 → 34 (26.6) / `iphone-duo-sold-out` 10 → 13 (9.4) / `transcribe-audio-offline-free` 42 (48.3)
- URL 검사: 색인 17편 그대로. `URL is unknown` 16편 = 세션 39의 15편 + `turn-off-gemini-in-gmail`
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12, V3 11-18) → 노하우 상태·writing-guide 변경 없음
- `link_audit.py --only-problems`: 세션 39와 같은 8건(같은 클러스터 링크 1·칼럼 → 상시 글 1·받는 링크 2개 미만 6). 새 글 문제 없음
- 주간 SEO 점검 보고: 아직 없음

**발행한 글**

| slug | 카테고리 | 클러스터·역할 | 독창 요소 |
| --- | --- | --- | --- |
| `gemini-connected-apps` | `news` | `ai-settings` 뉴스 칼럼 (화제, 피드형) | Google 공식 Connected Apps 표(table/17434654) 83행을 파싱(`parse_apps.py`)해 회사 유형(Google 12·휴대폰 20·그 밖의 회사 51)·지역(그 밖의 회사 중 미국 전용 27, 브라질·인도 전용 10)·나이(18세 이상 55)·계정 유형(업무·학교 가능 23) 집계, 연결/해제/활동 삭제/Keep Activity 끄기별로 남는 데이터 표, 5월 ~ 10월 앱 추가 타임라인 |

- 선정 근거 (48시간): Google Workspace Updates 2026-10-21 "An easier way to customize how Gemini works for you"(릴리스 노트 2026.10.13, 10-13부터 최대 15일 배포). Google News 48시간 `Gemini connected apps` 59건·`Gemini customize connected apps` 21건, 자동완성 `gemini connected apps` 3곳(list·missing·privacy·settings)
- 제외: ChatGPT Locked Chats(3일 75건으로 화제성 최대, openai.com·help.openai.com 403 → 1차 출처 확인 불가, 백로그 보류), iPhone Duo 출시(앱 소개 위주, 같은 주제 칼럼 있음), Outlook Copilot 우선순위 기능 종료(보도만), Meet 번역 63개 언어(독자 행동 없음)
- `Our take`: 연결은 휴대폰 앱 권한처럼 — 민감한 데이터 앱(신용·진료)은 작업할 때만 연결하고 끝나면 해제. 근거: 해제해도 Gemini 활동·외부 앱이 받은 데이터·검토된 채팅(3년)은 남음, @로 고르면 연결 요청이 다시 뜸. 반대 관점: 매주 장보기·예약에 쓰면 연결 유지가 핵심, 미국 밖은 대부분 앱이 아직 없음
- 1차 출처: Workspace Updates 2026-10-21, Gemini 릴리스 노트, Gemini 도움말 18736938·13695044(컴퓨터·Android·iOS)·14959807·17209137·17094296, Privacy Hub 13594961, Connected Apps 표 17434654, Google 블로그 2026-08-12·09-23. Gemini 계정이 없어 Customize 화면은 직접 실행 못 함(본문에 밝힘)
- 도움말끼리 다른 점: 커스텀 앱 문서는 아직 Settings > Connected Apps 경로, 스킬 문서는 Windows 앱 미지원(Workspace 글은 Windows 포함) → 본문 How we checked에 밝힘
- 이미지: 대표 이미지(Z-Image-Turbo 시드 566492349, 49.5분, 세이지 그린 + 살구·자두색, 약간 높은 측면 시점. 관 다섯 개 대신 케이블 하나지만 주제·화풍이 맞아 그대로 사용, `hero-image.md`) + 본문 그래픽 4장(회사 유형·지역 막대, 해제 시 남는 데이터 표, 메뉴 경로, 타임라인, `chart_style.py` 라이트 모드)
- 내부 링크: 새 글 → `turn-off-gemini-in-gmail`·`gemini-gems-to-skills`·`gemini-android-auto-personal-intelligence`·`turn-off-ai-in-chrome` (4개). 역링크: `gemini-gems-to-skills`(색인됨) "What's the difference" 목록 뒤, `turn-off-gemini-in-gmail` Connected Apps 단계 뒤에 각 1문장 (`updatedAt` 변경 없음, V 기록 대상 아님)
- 빌드 HTML 확인: title 62자(접미사 포함, 본제목 50자)·description 160자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 8개, `<pre>`·`<code>` 0개, 본문 첫 이미지가 대표 이미지 + 본문 그래픽 4장, og 이미지 1200×630이 대표 이미지에서 만들어짐, sitemap 포함
- searchfit-seo 스킬은 이번 세션에 없어 문서 체크리스트로 점검
- lint·test(33파일 241개)·build 통과

**알게 된 것**

- 백그라운드 Bash 실행은 `timeout`을 주지 않으면 30분에 종료됨 → 대표 이미지 생성(약 50분)은 `timeout: 7200000`으로 실행해야 함 (첫 시도가 30분에 중단되어 1회 다시 생성)
- Google 도움말 표(support.google.com/gemini/table/…)는 `<tr data-category="…">` 행 구조라 curl HTML로 카테고리·요구 조건을 그대로 파싱 가능
- `next build`가 처음 실행에서 "SecurityFatalError: Your version of Next.js is affected by a known security vulnerability"로 멈추고 `next upgrade --agent=security …` 실행을 권함(다시 실행하면 통과). 의존성 업그레이드는 사용자 결정이라 실행하지 않음
- openai.com·help.openai.com·chatgpt.com은 계속 403 (WebFetch도 403) → OpenAI 뉴스는 1차 출처 확인 불가

**다음 할 일**

- **사용자: Next.js 보안 업그레이드 검토** — 빌드가 `next@^16.4.0`에 알려진 취약점이 있다며 업그레이드를 권함 (2026-10-23). 업그레이드 여부·시점은 사용자 결정
- **사용자: Search Console 색인 요청** — `URL is unknown` 16편 중 우선 `best-free-pdf-tools`·`remove-bg-alternative-free`·`convert-webp-to-jpg-free`·`remove-metadata-from-photos`·`compress-pdf-free`, 새 글 `turn-off-gemini-in-gmail`·`gemini-connected-apps`
- Claude(다음 일반 세션): `ai-settings` 공백 후보 `turn off copilot in word` (상시 글 5편째가 되면 허브 `turn off ai`)
- Claude(다음 개선 세션): `photo-video` 허브, `link_audit` 문제 8건
- Claude: Customize 배포 완료(약 10-28)·외부 앱 국가 확대·도움말 경로 정리 시 `gemini-connected-apps` 갱신(`updatedAt`). H4 판정(11-20 이후): `gsc_report.py --compare /posts/gemini-connected-apps --changed 2026-10-23 --metric impressions --type discover`. H5 화제 칼럼 6편째(영향 7편)
- Claude: ChatGPT Locked Chats — OpenAI 1차 출처에 접근 가능해지면 뉴스 칼럼 후보로 재검토
- Claude: Chrome 157(11-03) 출시 후 `turn-off-ai-in-chrome`·`chrome-http-warning-default` 확인, 검증 기록 V1(11-11)·V2(11-12)·V3(11-18) 판정, 11-10 Patch Tuesday 후 Windows 글 갱신 검토
- Claude: 발행 34편
- 대시보드: `stats` 7개 문서 갱신 성공(batch, 세션 40 반영). 비로그인용 `data.js`는 정기 세션 규칙대로 미갱신
- 배포: PR #246 머지 (auto-merge, CI 통과 후)

## 2026-10-23 · 세션 39 (정기 실행, 일반 세션): Gmail에서 Gemini 끄기

세션 시각: 2026-10-23 00:23 KST → 일반 세션(`ai-tools`·`software`). 전략 개편 후 첫 일반 세션. 열린 PR 없음. 작업 브랜치를 `origin/main`(11799ae)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-24 ~ 10-22, 세션 38 이후 바뀐 값만)**

- 노출 310 → **325**, 클릭 8, CTR 2.6% → 2.5%, 평균 순위 23.1 → 22.6 (전략 개편 기록과 같은 기간·같은 값)
  - `turn-off-ai-in-chrome` 103 (12.9) / `image-to-text-offline-free` 51 (9.4) / `gemini-gems-to-skills` 27 (7.6) / `iphone-duo-sold-out` 10 (9.6, 클릭 1)
- URL 검사: 색인 17편 그대로. `URL is unknown` 15편 = 세션 38의 14편 + `apple-mail-exchange-not-syncing`
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12, V3 11-18) → 노하우 상태·writing-guide 변경 없음
- `link_audit.py --only-problems` (발행 전): 같은 클러스터 링크 없음 1(`check-if-image-is-ai-generated`), 칼럼 → 상시 글 링크 없음 1(`apple-mail-exchange-not-syncing`), 받는 링크 2개 미만 7 → 발행 후 6 (`gemini-free-flash-lite` 해결). 새 글 문제 없음
- 주간 SEO 점검 보고: 아직 없음

**발행한 글**

| slug | 카테고리 | 클러스터·역할 | 독창 요소 |
| --- | --- | --- | --- |
| `turn-off-gemini-in-gmail` | `ai-tools` | `ai-settings` 상시 글 (검색형) | Gmail·Gemini·Workspace 도움말 12개 문서를 맞대어 Gmail Gemini 기능 7개 → 계정 유형별 제공 범위 → 끄는 설정 대응표, 설정 3개가 각각 끄는 기능(Gemini와 무관한 받은편지함 탭·Smart Compose 포함), 개별로 끌 수 있는 기능(AI Inbox 체크박스·Proofread = Grammar suggestions off), Chrome 156 직접 실행으로 Chrome 쪽 AI 설정 화면 확인 |

- 선정 근거: [클러스터 공백 후보](backlog.md#클러스터-공백-후보) `ai-settings` 1번. 자동완성 `turn off gemini in gmail` 16개 (Google·Bing·YouTube 3곳, app·android·iphone·workspace), `turn off gemini in google docs` 17개. Trends 미국 3개월 `turn off gemini` 1.8 · `turn off copilot` 0.5 · `turn off ai overviews` 0.0 · 기준 `remove background` 35.7 → 같은 클러스터 후보 중 최대
- 상위 결과(WebSearch): Proton·Croma·Revolgy·BGR·Android Authority·SlashGear 등. 경로는 같고, "맞춤법 검사까지 꺼진다" 주장이 출처마다 다름 → 공식 목록에 맞춤법 언급이 없음을 본문에 밝힘
- 1차 출처: Gmail 도움말 15604322(컴퓨터·Android·iPhone 탭)·16831098·16561387·16789526·16845247·16887555·15464729·13955415, Gemini 13695044, Docs 14206696, Workspace 관리자 10095404·15698295(→ knowledge.workspace.google.com 301). Gmail 계정이 없어 Gmail 화면은 직접 실행 못 함(본문에 밝힘)
- 직접 실행: Google Chrome 156.0.8078.47(공식 deb, headless + Playwright CDP), 로그인 안 한 새 프로필의 Settings > AI innovations에는 "Google Search AI Mode and connected apps"(클릭 시 My Activity 로그인)와 On-device AI만 있고 Help me write는 로그인 후에만 보임
- 이미지: 대표 이미지(Z-Image-Turbo 시드 94700673, 57.3분, 연분홍 배경 + 민트·남색, 3/4 시점. 토글 스위치는 안 그려졌지만 주제·화풍이 맞아 그대로 사용, `hero-image.md`) + 본문 4장(계정별 기능 표·설정 3개 대응표·플랫폼별 메뉴 경로 그래픽 `chart_style.py` 라이트 모드 + Chrome 156 AI innovations 캡처)
- 내부 링크: 새 글 → `gemini-android-auto-personal-intelligence`·`turn-off-ai-in-chrome`·`gemini-free-flash-lite`·`gemini-gems-to-skills` (4개). 역링크: `gemini-gems-to-skills`(색인됨) 마지막 관련 글 문단, `gemini-free-flash-lite` "Most features are still free" 문단 끝에 각 1문장 (`updatedAt` 변경 없음, V 기록 대상 아님). `turn-off-ai-in-chrome`은 V3 판단 기간이라 고치지 않음
- 빌드 HTML 확인: title 43자(접미사 포함, 본제목 31자)·description 154자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 14개, `<pre>`·`<code>` 0개, 본문 첫 이미지가 대표 이미지 + 본문 이미지 4장 width·height 지정, og 이미지 1200×630이 대표 이미지에서 만들어짐, sitemap 포함
- searchfit-seo 스킬은 이번 세션에 없어 문서 체크리스트로 점검
- lint·test(32파일 239개)·build 통과

**알게 된 것**

- Google 도움말은 `?hl=en&co=GENIE.Platform%3DAndroid`(또는 `iOS`)로 플랫폼 탭별 본문을 curl로 받을 수 있음
- Workspace 관리자 도움말(support.google.com/a/answer/…)은 일부가 knowledge.workspace.google.com으로 301, 본문은 curl HTML에 그대로 있음
- 컨테이너의 `/etc/chromium/policies/managed` 정책 때문에 Chrome 설정에 "Your browser is managed by your organization"이 표시됨 → 캡처할 때 그 부분을 잘라야 함
- 시스템 python3에 Playwright가 없음 → `python3 -m venv /tmp/pw && /tmp/pw/bin/pip install playwright`(Chromium은 `/opt/pw-browsers`가 아니라 Google Chrome deb을 직접 실행해 CDP 연결)
- `pnpm install`이 `packages/nextjs-routes/dist/cli.js`를 바꿈 → 커밋 전 되돌림

**다음 할 일**

- **사용자: Search Console 색인 요청** — `URL is unknown` 15편 중 우선 `best-free-pdf-tools`·`remove-bg-alternative-free`·`convert-webp-to-jpg-free`·`remove-metadata-from-photos`·`compress-pdf-free`, 새 글 `turn-off-gemini-in-gmail`
- Claude(다음 일반 세션): `ai-settings` 공백 후보 다음 `turn off copilot in word` → 상시 글 5편째가 되면 허브 `turn off ai` (개선 세션)
- Claude(다음 개선 세션): `photo-video` 허브, `link_audit` 문제 8건(받는 링크 2개 미만 6·`check-if-image-is-ai-generated` 같은 클러스터 링크·`apple-mail-exchange-not-syncing` → 상시 글)
- Claude: Gmail Gemini 기능 제공 범위(무료 계정 Help me write·Suggested Replies 국가 확대, AI Inbox 정식 출시)가 바뀌면 `turn-off-gemini-in-gmail` 표 갱신(`updatedAt`)
- Claude: Chrome 157(11-03) 출시 후 `turn-off-ai-in-chrome`·`chrome-http-warning-default` 확인, 검증 기록 V1(11-11)·V2(11-12)·V3(11-18) 판정, 11-10 Patch Tuesday 후 Windows 글 갱신 검토
- Claude: 발행 33편
- 대시보드: `stats` 7개 문서 갱신 성공(batch, 세션 39 반영). 비로그인용 `data.js`는 정기 세션 규칙대로 미갱신

## 2026-10-22 · 결정: AdSense 자동 광고 (사용자 요청)

- 사용자 결정: 광고 위치를 직접 관리하지 않고 AdSense 자동 광고를 씀. 수동 슬롯 4곳(`AD_SLOTS`)은 ID를 비워 두어 렌더링 안 함
- AdSense 사이트 설정(사용자가 승인 후 적용): 자동 광고 켜기, 본문 내·하단 고정(anchor)·사이드 레일 켜기, 전면 광고(vignette) 끄기, 자동 최적화 켜기 + 실험 차단에 vignette. Google 도움말 기준 자동 최적화는 새 사이트에 기본으로 켜져 있고 트래픽 50%에 실험·승자 자동 적용 (vignette·anchor 실험도 포함)
- 코드: 자동 광고는 스크립트를 로드한 페이지 어디에나 광고를 넣으므로, 404·정적 페이지에 `<NoAds />` 표시를 두고 `AdSenseScript`가 그 페이지에서 스크립트를 로드하지 않게 함 (AdSense 정책: 오류 페이지 광고 금지, 기존 규칙 "정적 페이지·404에는 광고 없음" 유지). 그래서 AdSense 페이지 제외 설정은 필요 없음
- 포기한 것: 첫 화면 광고 없음·광고 삽입 시 CLS 최소화는 자동 광고에서 보장되지 않음 → 주간 SEO 점검·개선 세션에서 페이지 경험이 나빠지면 광고 양 조정을 사용자에게 제안
- 반영: README 결정사항·인프라 상태, `apps/ad-blog/README.md` 광고 절, `.claude/ad-blog.md` 광고 규칙, writing-guide·traffic-playbook의 "첫 소제목 앞 광고" 문구 제거

## 2026-10-22 · 전략 개편: SEO 플러그인 분석 → 클러스터·개선 세션·주간 SEO 점검 (사용자 요청)

사용자가 설치한 searchfit-seo 플러그인 스킬(`content-strategy`·`keyword-clustering`·`internal-linking`·`technical-seo`·`ai-visibility`·`content-brief`)로 전략을 다시 짜고, 정기 글 작성 루틴과 주간 SEO 점검 루틴을 새 전략에 맞춰 갱신함.

**분석 (Search Console 2026-09-24 ~ 10-22, 글 32편, 라이브 사이트)**

- 웹 노출 328·클릭 8·평균 순위 22.6. Discover·Google News 노출 0, 이미지 검색 16. 미국 노출 97(30%), 데스크톱 80%
- 노출 상위: `turn-off-ai-in-chrome` 103(12.9위)·`image-to-text-offline-free` 51(9.4)·`transcribe-audio-offline-free` 38(47.3)·`spotify-family-qr-code-verification` 30(28.8)·`gemini-gems-to-skills` 27(7.6)·`check-if-image-is-ai-generated` 26(70.5)
- 10위 안 비브랜드 검색어 11개는 모두 구체적 롱테일 (`google ai gone` 3·`optguideondevicemodel disable` 3·`offline ocr tools` 5·`where did gems go in gemini` 6·`chrome disable ai` 7). 상위 검색어를 노린 PDF 글 7편은 4편 색인 전, `merge-pdf-files-free`는 99위
- 뉴스 칼럼 12편: Discover 0, 웹 노출 합계 약 50(15%)
- 색인 17/32. `URL is unknown` 15편 (PDF 4편·허브 `best-free-pdf-tools` 포함). sitemap 10-21 다운로드, 오류 0
- 기술 SEO: robots·sitemap(39 URL)·HSTS·HTTP→HTTPS 308 정상. **삭제 글 8개 URL 404**(`free-offline-text-to-speech`는 아직 노출 12·클릭 1). `www.tool-proof.com` → 307(임시). JSON-LD는 WebSite·BlogPosting·BreadcrumbList 정상
- 내부 링크(`link_audit.py` 첫 실행): 글당 나가는/받는 링크 평균 3.9개, 깨진 링크 0. 허브 필요 클러스터 2개(`ai-settings`·`photo-video`), 받는 링크 1개뿐인 글 7편, 비슷한 태그 `Chrome`·`Google Chrome`
- 수요 확인 (자동완성 3곳): `turn off gemini`(25개, in gmail·in chrome)·`turn off copilot`(24개, in word·outlook·excel·windows 11)·`turn off meta ai`(22개)·`turn off apple intelligence`(26개)·`turn off galaxy ai`(21개). Trends 3개월(기준 `remove background` 35.4): `turn off gemini` 1.8·`turn off copilot` 0.5·나머지 0.0~0.2, `pdf to word` 23.2·`heic to jpg` 8.5

**사용자 결정**

- 정기 실행 구성: 06시 뉴스 칼럼 1편(화제 → 영향 → 클러스터 글), 00·12시 클러스터 일반 글, **18시 개선 세션**(기존 글 보강·허브·내부 링크·색인, 허브·공백 글 1편 허용)
- 삭제 글 URL 301 리디렉트를 이번 PR에 포함
- 주간 SEO 점검: searchfit-seo 스킬로 점검하고 결과를 log.md에 보고 섹션 PR로 기록 (글·코드는 수정하지 않음), 개선 세션이 이어받음

**바꾼 것**

- 새 문서 [clusters.md](clusters.md): 클러스터 6개(`ai-settings`·`photo-video`·`pdf`·`offline-ai`·`windows-microsoft`·`phones-subscriptions`)에 32편 배정, 우선순위 매트릭스, 허브·스포크 링크 규칙, 삭제 규칙
- 새 도구 [tools/link_audit.py](tools/link_audit.py): 클러스터 맵과 본문 내부 링크를 대조 (허브 누락·받는 링크 2개 미만·칼럼 → 상시 글·깨진 링크·비슷한 태그)
- README: 데이터로 본 현재 상태, 결정사항(정기 실행·주제 클러스터·삭제 글), 주제 선정 기준 3번 강화(가장 구체적인 롱테일)·7번 추가(클러스터), 뉴스 칼럼 06시 1편, 세션 워크플로우(브리프·link_audit), 개선 세션, SEO 플러그인 사용표, 주간 SEO 점검, 가설 H6, 목표 지표
- writing-guide: 작성 전 브리프(content-brief 형식 축약), AI 답변 인용 규칙, 클러스터 링크 규칙, 태그 표기 통일, 체크리스트 3항목
- traffic-playbook: 노하우 8(가장 구체적인 롱테일)·9(클러스터 링크로 발견) 가설 추가, 허브는 클러스터 기준, 따르지 않는 SEO 스킬 조언
- backlog: [클러스터 공백 후보](backlog.md#클러스터-공백-후보) 표 (`ai-settings` 상시 글 6·허브 1, `photo-video` 허브)
- 리디렉트: `vercel.json` 7개 (TTS → `free-offline-ai-tools`, PDF 4개·배경 제거는 같은 주제 GUI 글), 테스트 `scripts/lib/vercel-redirects.test.ts`. `video-to-gif-high-quality-free`는 대체 글이 없어 404
- 루틴: "ToolProof 정기 글 작성" 프롬프트 갱신 완료. "주간 SEO 점검"은 루틴이 게시하는 스레드에서만 프롬프트를 바꿀 수 있어(플랫폼 제약) 새 프롬프트만 준비

**다음 할 일**

- **사용자: Search Console 색인 요청** — `URL is unknown` 15편 중 우선 `best-free-pdf-tools`·`remove-bg-alternative-free`·`convert-webp-to-jpg-free`·`remove-metadata-from-photos`·`compress-pdf-free` (URL 검사 → 색인 생성 요청, API로는 불가)
- **사용자: 주간 SEO 점검 루틴 프롬프트 적용** — 루틴이 게시하는 스레드에서 새 프롬프트(README [주간 SEO 점검](README.md#주간-seo-점검) 내용, 이번 세션에서 전달)로 바꿔 달라고 요청
- (완료) 사용자: Vercel 도메인 — `www.tool-proof.com` 리디렉트 307 → 308(영구), 2026-10-22 `https://www.tool-proof.com/posts/…` → 308 → `tool-proof.com` 확인
- 사용자: AdSense 신청 — 2026-10-22 신청, 게시자 ID 입력·`ads.txt` 배포(README 인프라 상태). 승인 후 광고 단위 ID 전달·EEA 동의 메시지 켜기
- Claude(다음 개선 세션): `photo-video` 허브 작성 → `link_audit.py` 문제 7건(받는 링크 2개 미만)·`check-if-image-is-ai-generated` 같은 클러스터 링크·`apple-mail-exchange-not-syncing` → `windows-10-esu-extended` 링크·`Google Chrome` 태그를 `Chrome`으로 통일
- Claude(일반 세션): [클러스터 공백 후보](backlog.md#클러스터-공백-후보)의 `ai-settings` 상시 글부터. 3편이 모이면 허브 `turn off ai`
- Claude: 리디렉트 배포 후 `curl -sI https://tool-proof.com/posts/pdf-to-jpg-high-quality`가 308·대상 글인지 확인

## 2026-10-22 · 규칙 변경: 제목 꼬리표 금지 (사용자 요청)

- 사용자 결정: 제목은 주제만 씀. `: What It Means for You` 같은 콜론·대시 부제, `(6 Tools Tested)` 같은 괄호 꼬리표를 붙이지 않음. 새 글부터 적용하고 기존 글 제목은 바꾸지 않음
- 반영: [writing-guide.md](writing-guide.md) 글 유형별 제목 패턴·제목 규칙·뉴스 칼럼 제목·frontmatter 예시·허브 글·체크리스트, [traffic-playbook.md](traffic-playbook.md) 노하우 1·2·3·5 적용과 "따르지 않는 것"(노하우 2는 "결과를 설명·첫 문단에서 내세운다"로 변경), [README.md](README.md) 결정사항
- 측정 규모·차별점은 설명(description)과 첫 문단에 씀

## 2026-10-22 · 세션 38 (정기 실행, 영향 뉴스 세션): Apple Mail × Microsoft 365 EWS 종료

세션 시각: 2026-10-22 18:10 KST → 영향이 오래 가는 뉴스 칼럼 세션. 열린 PR 없음. 작업 브랜치를 `origin/main`(8c5cf9d)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-24 ~ 10-22, 세션 37 이후 바뀐 값만)**

- 노출 298 → **310**, 클릭 8, CTR 2.7% → 2.6%, 평균 순위 23.4 → 23.1
  - `image-to-text-offline-free` 43 → 45 (9.7) / `spotify-family-qr-code-verification` 25 → 29 (28.4) / `gemini-gems-to-skills` 23 → 26 (7.5) / `iphone-duo-sold-out` 5 → 7 (10.4, 클릭 1)
- URL 검사: 색인 17편 그대로. `URL is unknown` 14편 = 세션 37의 13편 + `remove-metadata-from-photos`
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12, V3 11-18) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug | 카테고리 | 유형 | 독창 요소 |
| --- | --- | --- | --- |
| `apple-mail-exchange-not-syncing` | `news` | 뉴스 칼럼 (영향) | Apple 공지(해결책은 macOS 27 향후 업데이트)와 Apple 보안 업데이트 목록(macOS 27은 Apple silicon 전용)을 맞대어 Intel Mac은 해결 계획이 없음을 확인, 앱·계정별 영향 표, Mac 종류별 선택지(Outlook for Mac 최소 macOS 14.0), Microsoft·Apple 일정 타임라인 |

- 선정 근거 (최근 30일 시행·마감 있음): Microsoft가 2026-10-01부터 Exchange Online EWS를 조직별로 차단 시작, 2027-04-01 완전 종료(Exchange 팀 블로그 2026-02-05). Apple 지원 문서 149092(2026-10-13): Mac Mail·Calendar·Contacts·Notes·Reminders 동기화 중단 시 관리자 문의, Graph 전환은 "future update to macOS 27". Microsoft legacy Outlook for Mac도 2026년 10월부터 작동 중지. Google News 30일 `EWS retirement` 36건·`Apple Mail Microsoft 365 sync` 26건, 자동완성 `apple mail exchange` 22개(not syncing·not working·exchange web services). Trends 미국 1개월 `apple mail exchange` 0.0 · `outlook for mac` 4.7 · 기준 `remove background` 72.0 → 피드형
- 제외: Samsung Messages 종료(보도상 2026-07 종료로 이미 지남, Samsung 공지는 직접 미확인), ChatGPT Atlas 종료(2026-08-09, 30일 밖), Samsung SmartThings Tracker 종료(대상 적음), Marvel Unlimited(분야 밖), Windows 11 23H2 Enterprise 종료(기업)
- `Our take`: Intel Mac은 지금 업무 메일을 Outlook for Mac으로 옮기고, Apple silicon Mac은 Outlook을 백업으로 설정해 두고 Apple 업데이트를 기다림. 근거: Microsoft는 2023년부터 2026년 10월을 예고했는데 Apple 공지는 차단 시작 12일 뒤, 해결책은 날짜 없음·macOS 27 전용. 반대 관점: Microsoft가 실제 사용 기반으로 허용 목록을 미리 채우고 IT가 다시 켤 수 있어, 많은 사용자는 몇 달간 변화가 없을 것
- 1차 출처: Microsoft Exchange 팀 블로그(2026-02-05, Playwright는 차단 → curl HTML에서 본문 추출), Microsoft Learn EWS 중단 문서, Microsoft 지원 legacy Outlook for Mac 종료, Apple 지원 149092·105128·116943·100100, Apple Mail 사용 설명서(계정 추가·제거), Mac App Store Outlook 페이지. Microsoft 365 업무 계정·macOS가 없어 직접 실행은 없음(본문에 문서 기반임을 밝힘)
- 이미지: 대표 이미지(Z-Image-Turbo, 연보라 배경 + 하늘색·복숭아색, 정면 시점, `hero-image.md`) + 본문 그래픽 3장(일정 타임라인·영향 표·Mac 종류별 선택지, `chart_style.py` 라이트 모드)
- 내부 링크: 새 글 → `office-2021-end-of-support`·`microsoft-365-family-storage-2tb` (2개). 역링크: `office-2021-end-of-support` "What happened" 둘째 문단 끝에 1문장 (`updatedAt` 변경 없음, V 기록 대상 아님)
- (도구 수정) `hero_image.py`: 시스템 python3로 생성 명령을 실행하면 `/tmp/hero` venv로 다시 실행하지 않고 Pillow 오류로 끝나던 문제 수정. venv의 python이 시스템 python 링크라 `Path(sys.executable).resolve()` 비교가 항상 같아 `raise`로 빠졌음 → `sys.prefix`로 venv 여부 판단. `--setup`만 성공했던 이유는 venv가 아직 없을 때만 통과했기 때문으로 보임. `python3 -I hero_image.py --help`로 재실행 확인
- 대표 이미지: 시드 310306084, 55.7분(lint·test·그래픽 생성과 겹침). 노트북·닫힌 문·봉투·구름 사이 다리, 새 다리 짓는 장면·연락처 카드는 빠졌지만 주제·화풍이 맞아 그대로 사용, alt를 실제 그림에 맞춤
- 빌드 HTML 확인: title 83자(접미사 포함, 본제목 71자)·description 152자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 7개, `<pre>`·`<code>` 0개, 본문 첫 이미지가 대표 이미지 + 본문 그래픽 3장 width·height 지정, og 이미지 1200×630이 대표 이미지에서 만들어짐, sitemap 포함
- lint·test(31파일 233개)·build 통과

**알게 된 것**

- Microsoft Tech Community 블로그는 Playwright 접속이 "The request is blocked"지만, curl(`-A "Mozilla/5.0" --compressed`)로 받은 HTML 안에 본문이 JSON 문자열로 들어 있어 추출 가능. 발행일은 JSON-LD `datePublished`
- Apple 보안 업데이트 목록(support.apple.com/100100)의 OS 행에 지원 기기 목록이 있어, macOS 버전별 지원 Mac 확인에 쓸 수 있음
- 대기 루프에 `pgrep -f "hero_image.py …"`를 쓰면 루프 자신의 명령 문자열이 걸려 끝나지 않음(세션 37의 `pkill -f`와 같은 원인) → `pgrep -x sd-cli`나 출력 파일 존재로 판단할 것
- outlook.office.com은 컨테이너에서 HTTP 417

**다음 할 일**

- **사용자: AdSense 신청** — 발행 글 32편. Search Console 색인 17편, 14편 `URL is unknown`. 승인 후 `src/core/config/internal/ads.ts`에 ID 입력은 Claude가 진행
- Claude: Apple의 macOS 27 Graph 업데이트 출시·macOS Tahoe 26 지원 발표·Microsoft 일정 변경 시 `apple-mail-exchange-not-syncing` 갱신(`updatedAt`). H4 판정(11-19 이후): `gsc_report.py --compare /posts/apple-mail-exchange-not-syncing --changed 2026-10-22 --metric impressions --type discover`. H5 영향 칼럼 7편째(화제 5편)
- Claude: Chrome 157(11-03) 출시 후 `turn-off-ai-in-chrome`·`chrome-http-warning-default` 확인, 검증 기록 V1(11-11)·V2(11-12)·V3(11-18) 판정, 11-10 Patch Tuesday 후 Windows 글 갱신 검토, 칼럼 H4 판정(11-16 이후)
- Claude: Google 광고에 Gmail·Photos 정보 사용 공식 발표 확인 (뉴스 세션 후보)
- Claude: 발행 32편
- 대시보드: `stats` 7개 문서 갱신 성공(batch, 세션 38 반영). 비로그인용 `data.js`는 정기 세션 규칙대로 미갱신

## 2026-10-22 · 세션 37 (정기 실행, 일반 세션): 사진 메타데이터 지우기 무료 도구 6개 측정

세션 시각: 2026-10-22 12:16 KST → 일반 세션(`ai-tools`·`software`). 열린 PR 없음. 작업 브랜치를 `origin/main`(47182a4)에서 다시 시작. 대표 이미지 규칙(2026-10-22) 적용 첫 글.

**지표 (`gsc_report.py`, 2026-09-24 ~ 10-22, 세션 36 이후 바뀐 값만)**

- 노출 281 → **298**, 클릭 7 → **8**, CTR 2.5% → 2.7%, 평균 순위 23.6 → 23.4
  - `turn-off-ai-in-chrome` 97 → 101 (13.0, 클릭 2) / `image-to-text-offline-free` 42 → 43 (9.2) / `spotify-family-qr-code-verification` 21 → 25 (28.8) / `iphone-duo-sold-out` 노출 5·클릭 1 (11.8) / 홈 클릭 2
- URL 검사: 색인 17편 그대로. `URL is unknown` 13편 = 세션 36의 12편 + `chrome-http-warning-default`
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12, V3 11-18) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug | 카테고리 | 유형 | 직접 검증 |
| --- | --- | --- | --- |
| `remove-metadata-from-photos` | `software` | 비교 + How-to (측정형, 검색형) | 직접 만든 테스트 사진 8장(CC0, GPS·카메라·일련번호·작성자·썸네일 등 기록, 세로 2장은 회전 태그 방식)을 ExifCleaner 4.6.0·XnConvert 1.118.0(Xvfb GUI)과 ExifRemove·Jimpl·Verexif·IMGonline(Chromium 자동 조작, 4장씩)으로 처리 → ExifTool로 남은 항목, 세로 사진 방향, 픽셀 동일 여부, 브라우저가 보낸 요청 크기(CDP)로 업로드 여부 측정 |

- 선정 근거: 반복 일정 없음(Chrome 157은 11-03, Patch Tuesday 11-10). 자동완성 `remove metadata from photo` 21개(android·iphone·free·online, 3곳), `remove location from photo` 20개. Trends 미국 3개월 `photo location` 3.4 · `remove metadata` 0.4 · 기준 `remove background` 35.4. 개인정보 주제(광고 가치), 무료 GUI 앱·웹으로 해결, 컨테이너에서 직접 검증 가능
- 결과: 6개 모두 개인 정보 제거(XnConvert는 기본값이 유지 → Preserve Metadata 해제 시). Jimpl·Verexif·IMGonline은 회전 태그까지 지워 세로 사진 2/2가 옆으로 눕고, 사진 전체를 서버로 업로드. ExifRemove는 업로드 없음·세로 사진은 고화질로 다시 저장(+20%)해 정상 방향. ExifCleaner 4.6.0은 회전·색 프로필·DPI만 남기고 픽셀 동일. 단 기본 "Save as copy"가 우리 Linux 환경에서 8장 모두 "Couldn't verify cleaned output"으로 실패 → 끄면 성공. 구버전 3.6.0은 회전 태그까지 지워 세로 사진이 누움. XnConvert는 전부 재압축(5.9~18.9% 감소, SSIM 0.98~0.996)
- OS 내장 방법(직접 실행 못 함, 문서 기반): iPhone Share > Options > Location, Mac Photos Image > Location > Hide Location, Google Photos는 카메라가 넣은 위치를 못 지움(Pixel "Save location"·Samsung "Location tags" 끄기), Windows Properties > Details > Remove Properties and Personal Information(Windows 7 보관 문서뿐)
- 이미지: 대표 이미지(Z-Image-Turbo 시드 7, 51.5분, 1280×720, 연노랑 배경 + 청록·코랄, 아이소메트릭. 지우개는 안 그려졌지만 주제·화풍이 맞아 그대로 사용, og:image가 이 그림에서 생성됨) + 본문 6장(결과 표·세로 사진 비교 그래픽 2 + ExifCleaner 설정·XnConvert Output 탭·ExifRemove·Jimpl 화면 캡처 4)
- 내부 링크: 새 글 → `convert-heic-to-jpg-free`·`convert-webp-to-jpg-free`·`compress-image-to-100kb`·`check-if-image-is-ai-generated` (4개). 역링크: `convert-heic-to-jpg-free` GPS 문단 끝에 1문장 (`updatedAt` 변경 없음, V 기록 대상 아님)
- 빌드 HTML 확인: title 72자(접미사 포함, 본제목 60자)·description 158자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 10개, `<pre>`·`<code>` 0개, 본문 첫 이미지가 대표 이미지 + 본문 이미지 6장 width·height 지정, og 이미지 1200×630이 대표 이미지에서 만들어짐, sitemap 포함
- lint·test(31파일 233개)·build 통과

**알게 된 것**

- 시스템 python3의 Pillow가 깨져 있음(`cannot import name '_imaging'`) → `hero_image.py --setup`이 바로 실패. `python3 -m venv /tmp/hero && /tmp/hero/bin/pip install pillow` 후 그 python으로 실행해야 함 (스크립트 docstring에 있음, 세션 프롬프트의 `python3 -I`로는 안 됨)
- XnConvert 실행에 `libxcb-cursor0` 외에 `libxcb-icccm4`·`libxcb-image0`·`libxcb-keysyms1`·`libxcb-render-util0`·`libxkbcommon-x11-0` 등이 필요(apt). 원인은 `QT_DEBUG_PLUGINS=1`로 확인
- Playwright `request.post_data_buffer`는 multipart 파일 업로드 본문을 비워서 보여 줌 → 업로드 여부는 CDP `Network.requestWillBeSentExtraInfo`의 `content-length`로 판정
- GitHub Releases 최신 태그는 `releases/download/v{버전}/…` 주소에 HEAD 요청(302 = 있음, 404 = 없음)으로 찾을 수 있음 (api.github.com 403). 처음 받은 ExifCleaner 3.6.0이 최신이 아니었음 → 측정 도구는 버전 확인 후 측정
- `pkill -f`는 같은 문자열이 든 내 셸까지 종료(exit 144) → PID(`pgrep -x`)로 종료
- 메타데이터를 지우는 도구는 회전 태그도 함께 지우는 경우가 많음 → 이미지 처리 측정에 세로 사진(회전 태그)을 기본으로 넣을 것

**다음 할 일**

- **사용자: AdSense 신청** — 발행 글 31편. Search Console 색인 17편, 13편 `URL is unknown`. 승인 후 `src/core/config/internal/ads.ts`에 ID 입력은 Claude가 진행
- Claude: `remove-metadata-from-photos` 후속: Metadata2Go 측정, HEIC·PNG, Windows 11 내장 기능 최신 공식 문서가 있으면 반영. ExifCleaner "Save as copy" 오류가 새 버전에서 고쳐지면 문단 수정
- Claude: Chrome 157(11-03) 출시 후 `turn-off-ai-in-chrome`·`chrome-http-warning-default` 확인, 검증 기록 V1(11-11)·V2(11-12)·V3(11-18) 판정, 11-10 Patch Tuesday 후 Windows 글 갱신 검토, 칼럼 H4 판정(11-16 이후)
- Claude: Samsung Messages 종료 공식 공지 확인, Google 광고에 Gmail·Photos 정보 사용 공식 발표 확인 (뉴스 세션 후보)
- Claude: 발행 31편
- 대시보드: `stats` 7개 문서 갱신 성공(batch, 세션 37 반영). 비로그인용 `data.js`는 정기 세션 규칙대로 미갱신
- (해결) 정기 실행 프롬프트 1번의 `python3 -I …hero_image.py --setup`이 컨테이너 기본 Pillow 고장으로 실패하던 문제 → 프롬프트 대신 `hero_image.py`를 고침: Pillow를 못 불러오면 `/tmp/hero` venv에 설치하고 그 python으로 자동 재실행 (같은 날 사용자 요청, 시스템 python3로 `--setup` 실행 확인)

## 2026-10-22 · 규칙 보완: 대표 이미지를 무료 로컬 생성 + 2.5D 공통 화풍으로 (사용자 요청)

- 사용자 결정
  - 이미지 생성에 비용을 쓰지 않음 → Gemini·OpenAI 이미지 API 대신 무료 오픈 모델을 컨테이너에서 실행. 두 API 모두 이미지 모델에 무료 등급 없음 (Gemini 가격표: `gemini-nano-banana-2.1`·`gemini-3.1-flash-image`·`gemini-3.1-flash-lite-image`·`gemini-2.5-flash-image` 모두 Free Tier "Not available")
  - 화풍: 모든 글 공통 2.5D 일러스트 (일관성)
  - 화풍 보완: 화풍은 그리는 방식만 고정하고 색은 고정하지 않음 ("파스텔 톤"은 화풍, "연노란색"은 아님). 같은 사람이 그린 것처럼 보이되 결과물은 글마다 다양하게 → `STYLE`에서 특정 색(밝은 배경·파랑 강조) 삭제, 색 조합·시점은 장면 설명에서 글마다 정하고 최근 3장과 겹치지 않게
  - 생성 결과 판단: 주제·화풍이 맞으면 장면 설명과 조금 다른 점(사물 누락 등)은 그대로 쓰고, 금지 사항·주제 불명·화풍 이탈·깨진 형태일 때만 다시 생성
  - 예시 생성 (같은 시드 42, 이전 `STYLE`): Office 2021 칼럼 48.0분, PDF→Word 글 47.0분, 둘 다 1280×720·글자 없음. 세 번째(Chrome 칼럼)는 컨테이너 재시작으로 중단, 사용자 요청으로 추가 생성 안 함
  - 모델: Z-Image-Turbo (사용자가 시험 결과를 보고 FLUX.2 klein 4B보다 낫다고 판단. 1장 약 47분으로 klein(약 16분)의 3배지만 품질 우선)
- [tools/hero_image.py](tools/hero_image.py) 교체: Z-Image-Turbo(Q8_0, 8단계) + stable-diffusion.cpp `master-987-a77d362` CPU 실행, `--setup`(엔진 빌드·모델 약 10GB 다운로드, `/tmp/hero-image`), 1280×720·4단계·`--vae-tiling`, 공통 화풍·금지 조건 문구(`STYLE`)를 장면 설명 뒤에 자동으로 붙임, 시드·소요 시간 기록. API 코드는 삭제, `--from-file` 유지
- 문서: writing-guide 대표 이미지(만드는 법·화풍·장면·확인·실패 처리), README 결정사항·세션 워크플로우 5번·인프라 상태(이미지 생성 설정됨), tests/README
- 정기 실행 프롬프트 1번(시작 직후 `--setup` 백그라운드)·6번(2.5D 공통 화풍, 약 47분·측정과 겹치지 않게)·제약(유료 API 금지) 수정

## 2026-10-22 · 규칙 변경: AI 생성 대표 이미지 + 본문 이미지 3장 이상 (사용자 요청)

- 사용자 결정
  - 모든 글 본문 맨 앞에 글 내용을 대표하는 AI 생성 그림 1장. 제목 글자로 만드는 자동 썸네일 대신 썸네일·OG 이미지로 씀 (`thumbnail` 비움)
  - 대표 이미지를 뺀 본문 이미지 최소 3장 (모든 유형, 뉴스 칼럼 2장 → 3장). 필요하면 본문에도 AI 그림을 넣고 3장에 셈
  - 생성 수단: Gemini·ChatGPT 이미지 모델 (로컬 오픈 모델 시험 결과를 본 뒤 결정)
- 추가: [tools/hero_image.py](tools/hero_image.py) (Gemini `gemini-nano-banana-2.1` 또는 OpenAI `gpt-image-2.5-flare` 호출 → 16:9 자르기 → 가로 1600px 이하 WebP → `tests/{slug}/hero-image.md` 기록, `--from-file`로 웹 화면에서 받은 파일 변환). 키 없이 요청 형식·인증 오류 처리·자르기를 확인. 실제 생성은 키 등록 후 첫 세션에서 확인
- 문서: writing-guide 이미지 섹션(대표 이미지·본문 이미지) 재작성·구조·frontmatter·체크리스트, README 결정사항·세션 워크플로우 5번·인프라 상태, traffic-playbook 7번, tests/README
- 정기 실행 프롬프트("ToolProof 정기 글 작성") 6번(작성)·7번(검증)을 새 이미지 규칙으로 수정 ("직접 만든 그래프·스크린샷으로 채움" → 대표 이미지 + 본문 3장, 생성 실패 처리)
- 로컬 오픈 모델 시험 (stable-diffusion.cpp `a77d362` CPU 빌드, 4코어·15GB, 1280×720, 같은 프롬프트·시드 42, Windows 11 24H2 칼럼용 장면)
  - FLUX.2 klein 4B (Q8_0, 4단계): 959초(16분), 단계당 약 200초. 반실사 느낌, 지시한 물건은 모두 그림
  - Z-Image-Turbo (Q8_0, 8단계): 2,797초(47분), 단계당 약 330초. 일러스트 느낌. 첫 시도는 VAE 디코딩에서 메모리 초과로 종료 → `--vae-tiling`으로 해결
  - FLUX.1-schnell은 공식 저장소가 로그인 필요(401), GGUF 사본은 받을 수 있지만 klein보다 연산량이 커서 시험 생략
  - 두 모델 모두 프롬프트에 "no text"가 있어도 달력에 깨진 숫자가 생김 → 글자가 생기기 쉬운 물건은 프롬프트에서 빼는 규칙 추가
- 확인한 출처: Gemini API 이미지 생성 문서(Interactions API, 16:9 2K = 2752×1536)·가격표(2K 장당 $0.0504, 무료 등급 없음), OpenAI 이미지 생성 가이드(크기 16의 배수, `1536x864` 가능), Google 생성형 AI 콘텐츠 문서(AI 이미지 IPTC 표시는 전자상거래 상품 이미지만 요구)·Discover 문서(가로 1200px 이상, 16:9, 일반 이미지·글자 위주 이미지 피함)

**다음 할 일**

- (취소) API 키 등록·API 생성 확인: 같은 날 사용자가 비용을 쓰지 않기로 해 무료 로컬 생성으로 바꿈 (위 기록)
- 기존 글 소급 적용은 하지 않음 (요청 범위: 이후 세션)

## 2026-10-22 · 세션 36 (정기 실행, 화제 뉴스 세션): Chrome HTTP 경고 기본값 + Enhanced 전용 사기 경고

세션 시각: 2026-10-22 06:15 KST → 화제 뉴스 칼럼 세션. 열린 PR 없음. 작업 브랜치를 `origin/main`(11396d2)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-23 ~ 10-21, 세션 35 이후 바뀐 값만)**

- 노출 258 → **281**, 클릭 7, CTR 2.7% → 2.5%, 평균 순위 23.7 → 23.6
  - `turn-off-ai-in-chrome` 94 → 97 (13.2) / `image-to-text-offline-free` 34 → 42 (9.3) / `spotify-family-qr-code-verification` 17 → 21 (25.9) / `gemini-gems-to-skills` 22 → 23 (7.4) / `transcribe-audio-offline-free` 36 → 37
- URL 검사: 색인 17편 그대로. `URL is unknown` 12편 = 세션 35의 11편 + `convert-webp-to-jpg-free`
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12, V3 11-18) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                          | 카테고리 | 유형             | 독창 요소 |
| ----------------------------- | -------- | ---------------- | --------- |
| `chrome-http-warning-default` | `news`   | 뉴스 칼럼 (화제) | Chrome 156(Google 공식 Linux deb)을 컨테이너에서 직접 실행: HTTP 경고 창·Continue 후 재방문 무경고·새 프로필 첫 실행 스위치 꺼짐 → 재실행 시 켜짐 관찰(캡처 3장). Standard vs Enhanced 보호 수준별 기능·전송 데이터 표(대표 이미지), 2022 → 2026-10-21 타임라인 |

- 선정 근거 (48시간): Google 블로그 2026-10-21 17:00 UTC "Chrome Now Warns Before Insecure HTTP Connections"(모든 사용자 기본값) + 2026-10-20 17:00 UTC "Our latest defenses against evolving web scams"(suspicious site·서버 Gemini 검사·ClickFix 경고는 Enhanced 전용). Google News 48시간 `Chrome scam protection` 40건·`Chrome insecure HTTP warning` 6건, 자동완성 `chrome enhanced protection` 17개(vs standard·turn off)·`always use secure connections` 24개. Trends 미국 7일 `chrome enhanced protection` 0.1 · 기준 `remove background` 65.6 → 피드형
- 제외: PHP2Shell(기사 100건+로 화제성 최대지만 웹사이트 운영자·개발자 대상, 일반 독자 행동 없음), ChatGPT Ads 26개국 확대(미국 영향 없음·사업 뉴스), Google Maps CarPlay Gemini(기능 소개), Xbox Cloud Playtime(Insider 테스트), Apple Music 로고
- `Our take`: HTTP 경고 기본값은 옳고 비용이 거의 없음(Google 수치 95%는 주간 0회, 승인한 사이트는 유지, 우리 테스트도 사이트당 1회). 약점은 가장 새로운 사기 방어가 Enhanced 뒤에 있다는 것 → 사기에 취약한 가족 Chrome은 Enhanced로. 반대 관점: Enhanced는 전체 URL을 계정에 연결해 Google에 보냄, 링크에 신중하면 Standard + HTTP 경고로 충분
- 1차 출처: Google 블로그 3건(2025-10-28 HTTPS by default·2026-10-20·10-21, JSON-LD 발표 시각), Chrome 도움말 9890866·10468685(Desktop·Android·iOS), Chromium Dash(147: 04-07, 154: 09-22, 156: 10-20), VersionHistory API
- 이미지 5장: 직접 만든 그래픽 2(보호 수준 표 `thumbnail`, 타임라인, `chart_style.py` 라이트 모드) + Chrome 156 직접 캡처 3(경고 창, 설정 스위치·옵션, Enhanced 설명)
- 내부 링크: 새 글 → `turn-off-ai-in-chrome`·`windows-10-esu-extended` (2개). 역링크: `windows-10-esu-extended` "Should you enroll…" 마지막에 1문장 (`updatedAt` 변경 없음, V 기록 대상 아님). `turn-off-ai-in-chrome`은 V3 판단 기간이라 고치지 않음
- 빌드 HTML 확인: title 78자(접미사 포함, 본제목 66자)·description 158자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 8개, `<pre>`·`<code>` 0개, 본문 이미지 5장 width·height 지정, sitemap 포함
- lint·test(31파일 233개)·build 통과

**알게 된 것**

- `dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb` 다운로드 가능 → `dpkg -x`로 풀면 설치 없이 Google Chrome 안정판 실행 가능(root라 `--no-sandbox` 필요). Chromium과 달리 Google 서버 설정(variations)이 적용되어 실제 기본값을 볼 수 있음
- Playwright `launch`의 기본 인자(`--disable-features`·`--disable-field-trial-config` 등)는 Chrome 기본 동작을 바꿈 → 기본값 확인은 Chrome을 직접 실행하고 `connect_over_cdp`로 붙여야 함
- 새 프로필 첫 실행에는 서버 설정이 아직 없어 단계적 기본값이 꺼져 보일 수 있음 → 두 번째 실행에서 확인
- Chrome의 HTTP 경고 창은 페이지 밖 대화상자라 CDP 스크린샷에 안 나옴 → `import -window root`(Xvfb 화면) + xdotool 클릭
- blog.google 보안 글은 `blog.google/security/` 아래에 있고 Chrome RSS에는 안 나옴 → 관련 글 링크·WebSearch로 주소 확인

**다음 할 일**

- **사용자: AdSense 신청** — 발행 글 30편. Search Console 색인 17편, 12편 `URL is unknown`. 승인 후 `src/core/config/internal/ads.ts`에 ID 입력은 Claude가 진행
- Claude: Edge·Safari·Firefox의 같은 기본값 변경, Standard 보호에 사기 경고 확대가 발표되면 `chrome-http-warning-default` 갱신(`updatedAt`). H4 판정(11-18 이후): `gsc_report.py --compare /posts/chrome-http-warning-default --changed 2026-10-21 --metric impressions --type discover`. H5 화제 칼럼 5편째(영향 6편)
- Claude: Chrome 157(11-03) 출시 후 `turn-off-ai-in-chrome`(V3 판정 뒤 Enhanced 서버 Gemini 전환 문장 추가 검토)·`chrome-http-warning-default` 확인, 검증 기록 V1(11-11)·V2(11-12)·V3(11-18) 판정, 11-10 Patch Tuesday 후 Windows 글 갱신 검토, 칼럼 H4 판정(11-16 이후)
- Claude: Samsung Messages 종료 공식 공지 확인, Google 광고에 Gmail·Photos 정보 사용 공식 발표 확인 (뉴스 세션 후보)
- Claude: 발행 30편
- 대시보드: `stats` 7개 문서 갱신 성공(batch, 세션 36 반영). 비로그인용 `data.js`는 정기 세션 규칙대로 미갱신

## 2026-10-22 · 세션 35 (정기 실행, 일반 세션): WebP → JPG 무료 변환 5개 도구 측정

세션 시각: 2026-10-22 00:16 KST → 일반 세션(`ai-tools`·`software`). 열린 PR 없음. 작업 브랜치를 `origin/main`(d38fc84)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-23 ~ 10-21, 세션 34 이후 바뀐 값만)**

- 노출 233 → **258**, 클릭 7, CTR 3.0% → 2.7%, 평균 순위 23.5 → 23.7
  - `turn-off-ai-in-chrome` 89 → 94 (13.4) / `image-to-text-offline-free` 31 → 34 (9.5) / `gemini-gems-to-skills` 19 → 22 (7.5) / `spotify-family-qr-code-verification` 10 → 17 (25.2) / `transcribe-audio-offline-free` 35 → 36
- URL 검사: 색인 17편 그대로. `URL is unknown` 11편 = 세션 34의 10편 + `gemini-free-flash-lite`
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12, V3 11-18) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                       | 카테고리   | 유형                | 직접 검증 |
| -------------------------- | ---------- | ------------------- | --------- |
| `convert-webp-to-jpg-free` | `software` | 비교 (측정, 검색형) | 직접 만든 WebP 10개(CC0 사진 6·투명 그래픽 3·12프레임 애니메이션 1)를 XnConvert 1.118.0(Xvfb GUI)·GIMP 3.2.6(기본 내보내기)·ezgif·CloudConvert·iLoveIMG(Chromium 자동 조작, 계정 없음) 기본 설정으로 변환 → 크기·SSIM·투명 영역 채움색·애니메이션 처리 측정 |

- 선정 근거: backlog 42번(WebP → JPG). 자동완성 `webp to jpg` 22개(converter·free·bulk·mac·cloudconvert·ezgif), `convert webp` 28개. Trends 미국 1개월 `webp to jpg` 2.4 · `webp to png` 4.3 · `heic to jpg` 9.3 · 기준 `remove background` 40.3. 반복 일정: Chrome 156은 세션 34에서 반영 완료, 다음은 157(11-03)
- 결과: 사진은 모든 도구가 해상도 유지·SSIM 0.973 이상. JPG 크기는 WebP의 1.66배(XnConvert, 품질 85)~2.23배(iLoveIMG, 92). 투명 영역은 4개 도구가 흰색(흰 스티커 사라짐), iLoveIMG만 검은색(검은 로고 사라짐, 잘라내기 사진은 녹색 줄무늬). 배경색 선택은 ezgif만. 애니메이션: XnConvert 첫 프레임, GIMP 마지막 프레임, iLoveIMG·CloudConvert는 프레임별 JPG지만 8~9개가 잘린 조각, ezgif 서버 변환 실패(3회). iLoveIMG·CloudConvert 사진 JPG는 바이트 단위로 동일. CloudConvert는 무료 하루 10크레딧 한도에 걸려 사진 5장만
- 이미지 5장: 투명 결과 비교(`thumbnail`)·크기 그래프·애니메이션 결과(직접 만든 그래픽, `chart_style.py`) + XnConvert JPG 설정·CloudConvert Options 화면 캡처
- 내부 링크: 새 글 → `compress-image-to-100kb`·`convert-heic-to-jpg-free`·`remove-bg-alternative-free`·`jpg-to-pdf-free` (4개). 역링크: `convert-heic-to-jpg-free`·`compress-image-to-100kb` 마지막에 각 1문장 (`updatedAt` 변경 없음, V 기록 대상 아님)
- 빌드 HTML 확인: title 64자(접미사 포함, 본제목 52자)·description 155자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 12개, `<pre>`·`<code>` 0개, 본문 이미지 5장 width·height 지정, sitemap·RSS 포함
- lint·test(31파일 233개)·build 통과

**알게 된 것**

- 애니메이션 WebP는 보통 바뀐 부분만 프레임에 저장하므로, 프레임을 그대로 꺼내는 변환기(iLoveIMG·CloudConvert)는 잘린 조각을 돌려줌 → 애니메이션 변환 측정에는 libwebp 기본 인코더로 만든 파일이 현실적인 시험 재료
- 손실 WebP의 투명 영역 아래 RGB는 인코더가 남긴 값이라, 알파를 버리는 변환기(iLoveIMG)는 그 값을 그대로 드러냄. `cwebp -exact`로 만들면 원본 사진이 그대로 보여 비현실적 → 기본 옵션으로 다시 만듦
- XnConvert 첫 실행은 Startup Wizard가 뜨고, Qt xcb 플러그인에 `libxcb-cursor0`가 필요(apt 설치). 창 관리자(openbox) 없이도 xdotool 클릭은 동작
- ezgif 서버 변환은 시간 초과가 잦아 2~3회 재시도 필요. 페이지 스크린샷은 웹 폰트 대기로 시간 초과 → 폰트 요청을 막으면 진행
- CloudConvert 무료 한도(하루 10크레딧)는 애니메이션 1개가 여러 크레딧을 쓰는 것으로 보여, 측정 순서를 정할 때 애니메이션을 마지막에 둘 것

**다음 할 일**

- **사용자: AdSense 신청** — 발행 글 29편. Search Console 색인 17편, 11편 `URL is unknown`. 승인 후 `src/core/config/internal/ads.ts`에 ID 입력은 Claude가 진행
- Claude: `convert-webp-to-jpg-free` 후속 후보: `webp to png`(Trends 4.3으로 더 큼) 수요가 Search Console에 보이면 PNG 섹션 보강 또는 별도 글 검토. Windows Paint·Photos 공식 문서가 생기면 반영
- Claude: Chrome 157(11-03) 출시 후 `turn-off-ai-in-chrome` 소스 비교, 검증 기록 V1(11-11)·V2(11-12)·V3(11-18) 판정, 11-10 Patch Tuesday 후 Windows 글 갱신 검토, 칼럼 H4 판정(11-16 이후)
- Claude: Samsung Messages 종료 공식 공지 확인, Google 광고에 Gmail·Photos 정보 사용 공식 발표 확인 (뉴스 세션 후보)
- Claude: 발행 29편
- 대시보드 갱신 실패: `ArtifactData` `list`(stats)가 auto mode 권한 분류기에 거부됨([PII Data Handling]) → 이번 세션 데이터 미반영. 다음 세션에서 다시 시도

## 2026-10-21 · 세션 34 (정기 실행, 영향 뉴스 세션): Gemini 무료 요금제 Flash-Lite 전환

세션 시각: 2026-10-21 18:15 KST → 영향이 오래 가는 뉴스 칼럼 세션. 열린 PR 없음. 작업 브랜치를 `origin/main`(400dba8)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-23 ~ 10-21, 세션 33 이후 바뀐 값만)**

- 노출 212 → **233**, 클릭 7, CTR 3.3% → 3.0%, 평균 순위 22.9 → 23.5
  - `spotify-family-qr-code-verification` 3 → **10** (21.5, `spotify family qr code` 26~30위) / `image-to-text-offline-free` 27 → 31 (9.9) / `gemini-gems-to-skills` 18 → 19 (7.5) / `check-if-image-is-ai-generated` 26 (70.5)
- URL 검사: 색인 17편 그대로. `URL is unknown` 10편 = 세션 33의 9편 + `remove-bg-alternative-free`
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                     | 카테고리 | 유형             | 독창 요소 |
| ------------------------ | -------- | ---------------- | --------- |
| `gemini-free-flash-lite` | `news`   | 뉴스 칼럼 (영향) | 요금제별 모델·사용 한도·컨텍스트 창 매트릭스(Google 문서 4곳을 한 표로, 대표 이미지), 컨텍스트 창 쪽수 환산(Google 자체 비율 1M ≈ 1,500쪽 → 무료 약 48쪽·Plus 약 192쪽, 추정임을 표시), Google 문서 간 충돌(About Gemini models는 AI Plus에 Pro 표시 vs 변경 공지·요금 페이지 미포함), 무료 사용자가 Flash·Pro에 닿는 유일한 경로(Auto) 설정 위치·응답 모델 확인법 |

- 선정 근거 (최근 30일 발표·영향 지속): Gemini 도움말 17004136 "Changes to Gemini model access and limits" — 무료 10-09 시행, AI Plus는 계정별 이메일 날짜(진행 중). Google News 30일 `Gemini free Flash-Lite` 51건, 자동완성 `gemini free` 약 45개(free tier limits·free vs pro·for students), Trends 미국 1개월 `gemini free` 14.5 · 기준 `remove background` 40.0
- 제외·보류: Samsung Messages 종료(보도 10-19, Samsung 공식 공지 미확인 → 다음 후보), WhatsApp 구형 Android 지원 종료(공식 날짜 미확인), Mac Developer ID 인증서(개발자), Windows 11 23H2 Enterprise 종료(기업), Marvel Unlimited·Discovery+(분야 밖)
- `Our take`: 대부분 무료로 충분하지만 Auto는 켜 둘 것(끄면 전부 Flash-Lite). 진짜 손실은 긴 문서(약 48쪽) → 그 용도면 AI Plus $4.99가 가장 싼 해결(128k), Pro는 Pro·Argon·1M이 필요할 때만. AI Plus 구독자가 가장 손해(이메일로 날짜 통보, 문서끼리 충돌) → Google은 요금 페이지에 날짜를 둬야 함. 반대 관점: 무료에도 Deep Research·Canvas·연결 앱이 남아 여전히 넉넉하고, 짧은 질문은 더 빨라질 것
- 1차 출처: Gemini 도움말 17004136·16275805(한도·컨텍스트·기능 표)·18648722(모델·Auto·thinking level)·14517446(요금제 변경), gemini.google/subscriptions(미국 가격), gemini.google/release-notes(Argon 10-13), gemini.google/students(학생 AI Pro 1년, 12-31 마감). 표의 체크 아이콘은 Playwright로 셀 이미지 alt를 읽어 확인. Gemini 앱은 로그인 불가로 실행하지 않음(문서 기반)
- 이미지 2장 (직접 만든 그래픽 1200×675, `chart_style.py` 라이트 모드): 요금제 매트릭스(`thumbnail`), 컨텍스트 창 쪽수 비교
- 내부 링크: 새 글 → `split-pdf-free`·`free-offline-ai-tools`·`gemini-gems-to-skills`·`gemini-android-auto-personal-intelligence` (4개). 역링크: `gemini-gems-to-skills` "Should you move your Gems now?" 마지막에 1문장 (`updatedAt` 변경 없음, V 기록 대상 아님)
- 빌드 HTML 확인: title 71자(접미사 포함, 본제목 59자)·description 158자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 7개, `<pre>`·`<code>` 0개, 본문 이미지 2장 width·height 지정, sitemap·RSS 포함
- lint·test(31파일 233개)·build 통과

**추가 작업 (사용자 요청): `turn-off-ai-in-chrome` Chrome 156 재검증**

- Chrome 156(10-20 안정판, VersionHistory API 156.0.8078.48)과 글의 기준 155.0.8059.40을 소스로 비교: 글에 쓴 정책 10개 + `BuiltInAIAPIsEnabled` 정의 파일 완전히 동일, 설정 문구(`settings_strings`·`compose_strings`) 변화 없음, 설정 페이지는 Polymer → Lit 이전(코드만, 토글·pref 동일), 페이지 제목 "AI innovations" 유지. 바뀐 것은 글에 없는 Gemini Spark 원격 브라우징 문구·단축키 범위 옵션, 기본 꺼진 Gemini Enterprise 하위 페이지뿐
- 글 수정: 설명·첫 문단의 현재 버전 155 → 156, 재검증 문단 1개, How we checked에 156 비교. 단계·라벨·정책 변경 없음 → `updatedAt` 유지. 근거는 `tests/turn-off-ai-in-chrome/factcheck.md` "Chrome 156 recheck"
- traffic-playbook 검증 기록 V3 추가(노하우 4, position, 판단 2026-11-18). Chrome 157(11-03)은 출시 후 같은 방법으로 비교
- (사용자 요청) 같은 글에 이미지 0 → 4장: 끄는 방법 한눈에 보기(`thumbnail`), 온디바이스 모델 삭제 흐름, 레지스트리 위치(직접 만든 그래픽 3장, `chart_style.py`) + Chromium 141 `chrome://policy`에 예시 정책 3개를 실제로 넣고 찍은 캡처(모두 Status OK). 같은 배포라 V3에 함께 기록. 대표 이미지가 생겨 Discover·이미지 검색 노출 조건(가로 1200px 대표 이미지)도 충족

**알게 된 것**

- support.google.com 도움말의 체크 표시 표는 이미지 아이콘이라 정적 텍스트로는 안 보임 → Playwright로 셀 `img`의 `alt`("Checkmark" vs 빈 alt)를 읽으면 요금제별 제공 여부를 확인할 수 있음
- 언론 기사가 출처로 든 도움말 번호(Engadget → `answer/17004136`)를 직접 열면 보도만 있던 시행일을 1차 출처로 확인할 수 있음
- Google 도움말끼리도 갱신 시점이 달라 내용이 충돌할 수 있음(18648722 vs 17004136) → 충돌은 숨기지 않고 본문에 밝힘
- web.archive.org는 프록시에서 연결 리셋(사용 불가), one.google.com 요금 페이지는 Chromium 렌더링에서도 가격이 나오지 않음

**다음 할 일**

- **사용자: AdSense 신청** — 발행 글 28편. Search Console 색인 17편, 10편 `URL is unknown`. 승인 후 `src/core/config/internal/ads.ts`에 ID 입력은 Claude가 진행
- Claude: AI Plus 시행일 공개·한도 변경·문서 충돌 해소 시 `gemini-free-flash-lite` 갱신(`updatedAt`). H4 판정(11-18 이후): `gsc_report.py --compare /posts/gemini-free-flash-lite --changed 2026-10-21 --metric impressions --type discover`. H5 영향 칼럼 6편째(화제 4편)
- Claude: Samsung Messages 종료 공식 공지 확인 (다음 뉴스 세션 후보)
- Claude: Chrome 157(11-03) 출시 후 `turn-off-ai-in-chrome` 소스 비교(156 재검증 완료, 같은 방법), 검증 기록 V1(11-11)·V2(11-12)·V3(11-18) 판정, 11-10 Patch Tuesday 후 Windows 글 갱신 검토, 칼럼 H4 판정(11-16 이후)
- Claude: Google 광고에 Gmail·Photos 정보 사용 공식 발표 확인 (세션 28부터 이월)
- Claude: 발행 28편

## 2026-10-21 · 세션 33 (정기 실행, 일반 세션): remove.bg 종료 → 무료 대안 측정

세션 시각: 2026-10-21 12:16 KST → 일반 세션(`ai-tools`·`software`). 열린 PR 없음. 작업 브랜치를 `origin/main`(ddbfbd0)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-23 ~ 10-21, 세션 32 이후 바뀐 값만)**

- 노출 198 → **212**, 클릭 7, CTR 3.5% → 3.3%, 평균 순위 23.5 → 22.9
  - `turn-off-ai-in-chrome` 노출 85 → 89, **클릭 1 → 2** (12.2) / `image-to-text-offline-free` 23 → 27 (10.3) / `transcribe-audio-offline-free` 34 → 35 / `gemini-gems-to-skills` 16 → 18 (7.6) / `spotify-family-qr-code-verification` 1 → 3 (29.7)
- URL 검사: **색인 16 → 17편** (`merge-pdf-files-free` 새로 색인, 크롤링 10-20 21:59 UTC). `URL is unknown` 9편 = 세션 32의 9편 − `merge-pdf-files-free` + `gemini-android-auto-personal-intelligence`
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                         | 카테고리   | 유형                    | 직접 검증 |
| ---------------------------- | ---------- | ----------------------- | --------- |
| `remove-bg-alternative-free` | `software` | 비교 (측정, 검색형) | 웹 도구 4개(remove.bg·iLoveIMG·removal.ai·Pixlr)를 Chromium으로 직접 조작해 AIM-500 20장(정답 알파 매트) 처리 → 정확도(IoU)·경계 오차·무료 다운로드 해상도 측정. Pixlr는 하루 무료 저장 3회 한도에 걸림(우회 안 함) |

- 선정 근거: backlog 10번(배경 제거, 2026-10-17 명령줄 글 삭제 후 GUI·웹으로 새로 쓸 후보). 조사 중 remove.bg 업로드 화면에서 **독립 웹사이트 2026-12-01 09:00 CET 종료**(Canva로 이전) 공지를 발견 → 대체 수요 각도로 정함. Trends 미국 1개월 `remove background` 40.0 · `background remover` 21.2 · `remove bg` 14.4 (기준 키워드 자체가 최대 수요군). 자동완성 `remove.bg alternative` 14개(free·hd·reddit), `remove bg free` 28개(hd·high quality·no sign up). Google News 30일 `"remove.bg" Canva` 2건 → 경쟁 공백
- 결과: 깨끗한 컷아웃(IoU ≥ 0.95) remove.bg 19/20 · removal.ai 18 · iLoveIMG 17, 실패는 모두 식물. 무료 다운로드는 iLoveIMG만 원본 크기(1.75MP)·무가입, remove.bg·removal.ai는 약 0.25MP 미리보기, Pixlr는 원본이지만 하루 3회. 경계 오차는 iLoveIMG가 가장 큼(8.4% vs 5.5~6.2%)
- 반복 일정: Chrome 156(10-20) `turn-off-ai-in-chrome` 반영 검토는 이번에도 새 글 우선으로 이월
- 이미지 6장: 그래프 2(무료 다운로드 크기 `thumbnail`, 정확도) + 퍼블릭 도메인 사진 결과 비교 1 + 사이트 화면 3(remove.bg 종료 배너·미리보기 메뉴, removal.ai 다운로드 버튼, Pixlr 한도 팝업). AIM-500 사진은 저작권 때문에 공개하지 않고 수치만 씀
- 내부 링크: 새 글 → `convert-heic-to-jpg-free`·`compress-image-to-100kb`·`best-free-pdf-tools`·`free-offline-ai-tools`·`check-if-image-is-ai-generated` (5개). 역링크: `compress-image-to-100kb`·`convert-heic-to-jpg-free` 마지막에 각 1문장 (`updatedAt` 변경 없음, V 기록 대상 아님)
- 빌드 HTML 확인: title 68자(접미사 포함, 본제목 56자)·description 160자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 11개, `<pre>`·`<code>` 0개, 본문 이미지 6장 width·height 지정, sitemap·RSS 포함
- lint·test(31파일 233개)·build 통과

**알게 된 것**

- remove.bg·iLoveIMG·removal.ai·Pixlr 웹 화면은 Playwright(Python) + `/opt/pw-browsers/chromium-1194`로 업로드·다운로드까지 자동 조작 가능. Photoroom은 업로드 버튼이 반응하지 않았고(파일 선택 창 안 열림), canva.com은 curl·Chromium·WebFetch 모두 403/차단 페이지 → Canva 무료 요금제 포함 여부는 확인 불가로 씀
- 정답 마스크가 있는 공개 데이터셋(AIM-500, MIT)으로 웹 도구 출력도 점수화할 수 있음. 단 사진 저작권은 원저작자라 글에는 퍼블릭 도메인 예시(scikit-image)만 사용
- 웹 도구의 무료 한도는 직접 돌려 봐야 드러남(Pixlr 하루 3회는 가격 페이지에 없음). 한도에 걸리면 우회하지 않고 그 자체를 결과로 씀
- `pip install playwright pyarrow`는 `/tmp/gsc` venv에서 수 분 걸림 → 백그라운드 타임아웃 주의

**다음 할 일**

- **사용자: AdSense 신청** — 발행 글 27편. Search Console 색인 17편, 9편 `URL is unknown`. 승인 후 `src/core/config/internal/ads.ts`에 ID 입력은 Claude가 진행
- Claude: remove.bg 종료(12-01) 전후 변화(Canva 무료 제공 범위 발표, 일정 변경)가 있으면 `remove-bg-alternative-free` 갱신(`updatedAt`). canva.com 접근이 되면 무료 요금제 포함 여부 확인. 12-01 이후 remove.bg 화면 스크린샷·설명 갱신
- Claude: Chrome 156(10-20)·157(11-03) 반영 여부 검토 (`turn-off-ai-in-chrome`, 3세션 이월), 검증 기록 V1(11-11)·V2(11-12) 판정, 11-10 Patch Tuesday 후 Windows 글 갱신 검토, 칼럼 H4 판정(11-16 이후)
- Claude: Google 광고에 Gmail·Photos 정보 사용 공식 발표 확인 (세션 28부터 이월)
- Claude: 발행 27편

## 2026-10-21 · 세션 32 (정기 실행, 화제 뉴스 세션): Android Auto Gemini Personal Intelligence

세션 시각: 2026-10-21 06:15 KST → 화제 뉴스 칼럼 세션. 열린 PR 없음. 작업 브랜치를 `origin/main`(c37cdc1)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-22 ~ 10-20, 세션 31 이후 바뀐 값만)**

- 노출 189 → **198**, 클릭 7, CTR 3.7% → 3.5%, 평균 순위 24.0 → 23.5
  - `turn-off-ai-in-chrome` 노출 84 → 85 (12.5) / `image-to-text-offline-free` 21 → 23 (11.0) / `transcribe-audio-offline-free` 32 → 34 (45.6) / `gemini-gems-to-skills` 15 → 16 (7.9)
  - 첫 노출: `spotify-family-qr-code-verification` 1회(2.0), `/categories/news` 1회(2.0)
- URL 검사: 색인 16편 그대로. `URL is unknown` 9편 = 세션 31의 8편 + `best-free-pdf-tools`
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                                        | 카테고리 | 유형             | 독창 요소 |
| ------------------------------------------- | -------- | ---------------- | --------- |
| `gemini-android-auto-personal-intelligence` | `news`   | 뉴스 칼럼 (화제) | 차 안 답변 데이터 흐름도(연결 앱 6종 → 음성 답변·활동 기록, 대표 이미지), 설정별 효과 표(앱 연결 해제·채팅 삭제·Keep Activity 끄기: "앞으로 사용 중지" vs "이미 가진 정보 삭제"), 사용자 유형별 영향 표, Google 문서끼리 연결한 분석(설정이 계정 전체로 차에 따라옴 + 차 안 누구나 Gemini 사용 가능 → 동승자 위험, 차 전용 스위치 없음) |

- 선정 근거 (48시간): Google 공식 블로그 2026-10-20 20:00 UTC 발표. Google News RSS `Gemini Android Auto` 47건 · `"Personal Intelligence"` 18건. 자동완성 `gemini android auto` 22개(update·rollout·settings·not working), `gemini personal intelligence` 19개(privacy·settings). Trends 미국 7일 `gemini android auto` 0.1 · 기준 `remove background` 68.1 → 검색량은 작음, 피드형
- 제외: Xbox Game Pass(Trends 급상승 200+, 기사 100건이지만 신규 게임 소식 + 개편은 소식통 보도), CISA(정치), iOS 27.2 RC(정식 전), Walmart+ 번들(분야 밖), Google 금융 광고 인증(광고주 대상). Google 광고에 Gmail·Photos 정보 사용은 여전히 공식 발표 없음 → 보류 유지
- `Our take`: 기본값(옵트인)은 괜찮지만 설정이 계정 전체 하나라 차에 그대로 따라오고, Google 도움말상 차 안 누구나 Gemini를 쓸 수 있음 → 동승자 위험. Workspace·Search services만 연결하고 Wallet·Contacts·Photos는 빼라. Google은 차 전용 스위치를 둬야 함. 반대 관점: 혼자 운전하면 휴대폰을 집는 것보다 안전하고, 학습·검토 규칙은 휴대폰과 같음
- 1차 출처: Google 블로그(10-20), Gemini 도움말 16598406(연결·관리·삭제)·16836988(데이터 사용·학습·사람 검토)·16735982(차 안 Gemini)·13278892(활동 기록·자동 삭제 18개월·72시간), Android Auto 도움말 6348083, gemini.google Personal Intelligence 페이지. 모두 curl 정적 HTML. Android Auto는 컨테이너에서 실행할 수 없어 문서 기반(본문에 밝힘)
- 이미지 2장 (직접 만든 그래픽 1200×675, `chart_style.py` 라이트 모드): 데이터 흐름도(`thumbnail`), 설정별 효과 표
- 내부 링크: 새 글 → `gemini-gems-to-skills`·`turn-off-ai-in-chrome` (2개). 역링크: `gemini-gems-to-skills` "Should you move your Gems now?" 마지막 문단에 1문장 (`updatedAt` 변경 없음, V 기록 대상 아님)
- 빌드 HTML 확인: title 86자(접미사 포함, 본제목 74자)·description 160자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 7개, `<pre>`·`<code>` 0개, 본문 이미지 2장 width·height 지정, sitemap·RSS 포함
- lint·test(31파일 233개)·build 통과

**알게 된 것**

- support.google.com 도움말은 curl(브라우저 UA)로 본문 전체가 열림. `?p=b_pi_ca` 같은 단축 링크는 `answer/16836988`로 리디렉트
- blog.google 글은 정적 HTML의 JSON-LD `datePublished`로 발표 시각(UTC)을 확인할 수 있음 → 화제 세션 48시간 판단에 사용
- Google News RSS 기사 수는 `<item>` 개수로 세야 함 (한 줄짜리 XML이라 `grep -c`는 1이 나옴)

**다음 할 일**

- **사용자: AdSense 신청** — 발행 글 26편. Search Console 색인 16편, 9편 `URL is unknown`. 승인 후 `src/core/config/internal/ads.ts`에 ID 입력은 Claude가 진행
- Claude: Google built-in 차 배포·차 전용 설정 추가·연결 앱 확대가 발표되면 `gemini-android-auto-personal-intelligence` 갱신(`updatedAt`). H4 판정(11-18 이후): `gsc_report.py --compare /posts/gemini-android-auto-personal-intelligence --changed 2026-10-20 --metric impressions --type discover`. H5 화제 칼럼 4편째(영향 5편)
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`), 검증 기록 V1(11-11)·V2(11-12) 판정, 11-10 Patch Tuesday 후 Windows 글 갱신 검토, 칼럼 H4 판정(11-16 이후), PDF 글 색인 여부 확인
- Claude: Google 광고에 Gmail·Photos 정보 사용 공식 발표 확인 (세션 28부터 이월, 이번 글과 같은 Personal Intelligence 주제 → 확인되면 이 글 갱신 또는 새 칼럼)
- Claude: 발행 26편

## 2026-10-21 · 세션 31 (정기 실행, 일반 세션): PDF 허브 글

세션 시각: 2026-10-21 00:17 KST → 일반 세션(`ai-tools`·`software`). 열린 PR 없음. 작업 브랜치를 `origin/main`(7971743)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-22 ~ 10-20, 세션 30 이후 바뀐 값만)**

- 노출 184 → **189**, 클릭 7, CTR 3.8% → 3.7%, 평균 순위 24.6 → 24.0
  - `turn-off-ai-in-chrome` 노출 83 → 84 (12.5) / `image-to-text-offline-free` 20 → 21 (10.0)
- URL 검사: 색인 16편 그대로. `URL is unknown` 8편 = 세션 30의 7편 + `office-2021-end-of-support`(PDF 글 5편 `compress-pdf-free`·`merge-pdf-files-free`·`pdf-to-jpg-free`·`pdf-to-word-free`·`split-pdf-free` 포함)
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                  | 카테고리   | 유형                       | 독창 요소 |
| --------------------- | ---------- | -------------------------- | --------- |
| `best-free-pdf-tools` | `software` | 허브 (비교, 검색형) | PDF 측정 글 6편(나누기·합치기·JPG→PDF·PDF→JPG·PDF→Word·압축)의 결과를 모은 작업별 추천 매트릭스(대표 이미지), 도구별 담당 작업 수 그래프, 기본값 함정 7개 표, 무료판 한도·업로드 여부 표, Sejda 3회/일이 앱 전체 공유라는 점에서 나온 설치 조합 추천(Windows: PDFsam + PDF Arranger + iLovePDF) |

- 선정 근거: traffic-playbook 3번(같은 분야 측정 글 3편 이상 → 허브) + 세션 27·29·30 다음 할 일 "PDF 허브 글 우선 검토". 자동완성 `free pdf tools` 23개(Google·Bing·YouTube: for windows·online·download), `best free pdf` 27개(editor·reader·converter·compressor·merger·software). Trends 미국 1개월 `free pdf tools` 0.7 · `pdf editor free` 4.8 · `compress pdf` 5.2 · 기준 `remove background` 35.9 → 허브 자체 수요는 작지만, 미색인 PDF 글 5편으로 가는 내부 링크 경로를 늘리는 목적을 겸함
- 반복 일정: Chrome 156(10-20 미국 시간) → 이번 세션은 새 글 우선, `turn-off-ai-in-chrome` 반영 검토는 다음 일반 세션으로 이월
- 새 측정 없음(개별 글 측정 재사용). 이번 세션 1차 출처로 현재 버전·무료 한도 재확인: PDFsam Basic 6.0.6, GIMP 3.2.6, LibreOffice 26.8.1, PDF Arranger 1.14.0(Flathub), Sejda Desktop 무료 한도(3 tasks/day·50MB·200쪽·합치기 30개 50쪽·압축 100MB·변환 1개씩), iLovePDF 무료 파일 크기(Word 15MB·JPG 25MB·합치기/나누기 100MB·압축 200MB, Premium 연 $60), PDF24 "No artificial limits"·1시간 후 삭제
- 이미지 6장: 새 그래픽 2장(작업별 추천 매트릭스 `thumbnail`, 도구별 작업 수, `chart_style.py` 라이트 모드) + 개별 글 측정 이미지 4장 재사용(`./images/{다른 slug}/…` 경로도 빌드에서 width·height 정상)
- 내부 링크: 새 글 → PDF 글 6편 + `image-to-text-offline-free` (7개). 역링크: PDF 글 6편 마지막 문단 뒤 각 1문장 (`updatedAt` 변경 없음, V 기록 대상 아님)
- 빌드 HTML 확인: title 61자(접미사 포함, 본제목 49자)·description 156자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 12개, `<pre>`·`<code>` 0개, 본문 이미지 6장 width·height 지정, sitemap 포함
- lint·test(31파일 233개)·build 통과

**알게 된 것**

- 다른 글 폴더의 이미지(`./images/split-pdf-free/…`)를 새 글에서 그대로 참조해도 `/_static/mdx/posts/images/…`로 해석되고 크기도 지정됨 → 허브 글은 측정 이미지를 복사하지 않고 재사용 가능
- matplotlib 막대(`rounded_barh`)는 y축을 `set_ylim(큰 값, 작은 값)`으로 뒤집으면 모서리 보정이 깨져 흰 사각형이 생김 → 축은 정방향으로 두고 y 위치를 거꾸로 배치
- 컨테이너 기본 python에는 matplotlib이 없음 → `/tmp/gsc` venv에 `matplotlib pillow` 설치 후 실행

**다음 할 일**

- **사용자: AdSense 신청** — 발행 글 25편. Search Console 색인 16편, 8편 `URL is unknown`. 승인 후 `src/core/config/internal/ads.ts`에 ID 입력은 Claude가 진행
- Claude: 허브 글은 새 PDF 측정 글이 생기면 섹션·매트릭스를 갱신하고 `updatedAt`·제목 시점 표기 검토. PDF 글 5편 색인 여부 다음 세션에서 확인(허브 링크 효과 참고용)
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`), 검증 기록 V1(11-11)·V2(11-12) 판정, 11-10 Patch Tuesday 후 Windows 글 갱신 검토, 칼럼 H4 판정(11-16 이후)
- Claude: Google 광고에 Gmail·Photos 정보 사용 공식 발표 확인 (세션 28부터 이월)
- Claude: 발행 25편

## 2026-10-20 · 세션 30 (정기 실행, 영향 뉴스 세션): Office 2021 지원 종료

세션 시각: 2026-10-20 18:16 KST → 영향이 오래 가는 뉴스 칼럼 세션. 열린 PR 없음. 작업 브랜치를 `origin/main`(d50d0ab)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-22 ~ 10-20, 세션 29 이후 바뀐 값만)**

- 노출 166 → **184**, 클릭 6 → **7**, CTR 3.6% → 3.8%, 평균 순위 24.8 → 24.6
  - `turn-off-ai-in-chrome` 노출 75 → 83 (12.6) / `image-to-text-offline-free` 14 → 20 (10.2), **클릭 1** / `check-if-image-is-ai-generated` 20 → 22 (70.7) / `transcribe-audio-offline-free` 31 → 32 (47.5)
  - 새 검색어: `free ocr offline`(7.0), `image to text offline`(6.0)
- URL 검사: 색인 16편 그대로. `URL is unknown` 7편(세션 29의 6편 + `compress-pdf-free`)
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                         | 카테고리 | 유형             | 독창 요소 |
| ---------------------------- | -------- | ---------------- | --------- |
| `office-2021-end-of-support` | `news`   | 뉴스 칼럼 (영향) | 일회성 구매 Office 버전별 지원 타임라인(대표 이미지), Office 2024 종료(2029-10-09)까지 3년 비용 비교(무료 웹 $0·Home 2024 1대 $179.99·Personal $299.97·Family $389.97·Home 2024 3대 $539.97)와 PC 대수별 손익분기(2대 $359.98 vs Family $389.97), Office Home 2024 가격 출시 $149.99 → 현재 $179.99, 사용자 유형별 영향 표 |

- 선정 근거 (최근 30일 발표·영향 지속): Microsoft 지원 문서 "Support for Office 2021 ended on October 13, 2026… no extension and no extended security updates". Google News 30일 `"Office 2021"` 34건·`"Office 2024"` 44건, 자동완성 `office 2021 end of support` 13개(Google·Bing·YouTube: date·end of life·mac·ltsc), Trends 미국 1개월 `office 2021` 3.3 · `office 2024` 9.1 · 기준 `remove background` 35.3
- 제외·보류: Google 광고 Gmail·Photos 정보 사용(여전히 보도만, 공식 발표 없음 → 보류 유지), Edge 재시작 없는 업데이트(테스트 단계), Discovery+ 가격 인상(분야 밖), Pixel 6 지원 종료(공식 날짜 미확인)
- `Our take`: PC 1대·데스크톱 앱이 꼭 필요하면 Office Home 2024가 3년 기준 가장 쌈(연 약 $60 vs Personal $99.99)이지만 Outlook 없음·출시 대비 $30 인상·2029년 같은 상황 반복. 3대 이상 가구는 Family가 쌈. 가끔 쓰는 사람은 무료 웹 앱부터. 반대 관점: 오프라인에서 자기 문서만 편집하는 PC는 당분간 써도 위험이 낮음(Outlook 2021이 메일함이면 해당 없음)
- 1차 출처: Microsoft Support "End of support for Office 2021"·버전 확인 문서, Microsoft Learn Lifecycle(Office 2021·2024·2019, 2025·2026 종료 목록), Microsoft 365 요금 비교 페이지(curl 브라우저 UA로 정적 HTML 확인, WebFetch 교차 확인), Microsoft 365 블로그 Office 2024 출시 글(2024-09-30), 무료 웹 앱 페이지, libreoffice.org 다운로드. Office는 컨테이너에서 실행할 수 없어 문서 기반(직접 실행 표현 없음), LibreOffice는 세션 27 측정 재사용
- 이미지 2장 (직접 만든 그래픽 1200×675, `chart_style.py` 라이트 모드): 버전별 지원 타임라인(`thumbnail`), 3년 비용 비교
- 내부 링크: 새 글 → `pdf-to-word-free`·`microsoft-365-family-storage-2tb`·`windows-10-esu-extended`·`windows-11-24h2-end-of-support` (4개). 역링크: `windows-11-24h2-end-of-support` 마지막 문단에 1문장 추가 (`updatedAt` 변경 없음, V 기록 대상 아님)
- 빌드 HTML 확인: title 70자(접미사 포함, 본제목 58자)·description 152자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 7개, `<pre>`·`<code>` 0개, 본문 이미지 2장 width·height 지정, sitemap·RSS 포함
- lint·test(31파일 233개)·build 통과

**알게 된 것**

- Microsoft Learn Lifecycle 표의 종료 시각은 `다음 날 06:59:59 AM`으로 적혀 있음(예: Office 2021 `10/14/2026 6:59:59 AM` = 공지상 10-13 종료) → 날짜는 하루 전으로 읽어야 함. 제품 페이지 주소는 `office-2021`·`office-2024`·`microsoft-office-2019`처럼 버전마다 다름(`office-2019`는 404)
- microsoft.com 요금 페이지는 기본 curl UA는 403이지만 브라우저 UA + `--compressed`로 정적 HTML(가격 포함)을 받을 수 있음. 제품 상세 페이지(`/p/office-home-2024/…`)는 가격이 스크립트로 그려져 정적 HTML에 없음
- 컨테이너에 pnpm 의존성이 설치되어 있지 않을 수 있음 → `pnpm install --frozen-lockfile` 후 lint

**다음 할 일**

- **사용자: AdSense 신청** — 발행 글 24편. Search Console 색인 16편, 7편 `URL is unknown`. 승인 후 `src/core/config/internal/ads.ts`에 ID 입력은 Claude가 진행
- Claude: Office Home 2024·Microsoft 365 가격 변경이나 Office 2021 관련 Microsoft 공지가 있으면 `office-2021-end-of-support` 갱신(`updatedAt`). H4 판정(11-17 이후): `gsc_report.py --compare /posts/office-2021-end-of-support --changed 2026-10-20 --metric impressions --type discover`. H5 영향 칼럼 5편째(화제 3편)
- Claude: Google 광고에 Gmail·Photos 정보 사용 공식 발표 확인 (세션 28부터 이월)
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`), 검증 기록 V1(11-11)·V2(11-12) 판정, PDF 허브 글 검토, 11-10 Patch Tuesday 후 Windows 글 갱신 검토, 칼럼 H4 판정(11-16 이후)
- (완료) 대시보드: README 절차대로 `stats` DB 7개 문서 갱신(버전 22·19·20 → 23·20·21). 첫 `dashboard_data.py` 실행에서 URL 검사 API 500(일시 오류) → 재실행으로 해결. `ArtifactData` list·batch 모두 권한 분류기 거부 없음. 비로그인용 `data.js`는 정기 세션 규칙대로 건너뜀
- Claude: 발행 24편

## 2026-10-20 · 세션 29 (정기 실행, 일반 세션): PDF 압축 무료 도구 3개 측정

세션 시각: 2026-10-20 12:15 KST → 일반 세션(`ai-tools`·`software`). 열린 PR 없음. 작업 브랜치를 `origin/main`(a9b2a5d)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-22 ~ 10-20, 세션 28 이후 바뀐 값만)**

- 노출 157 → **166**, 클릭 5 → **6**, CTR 3.2% → 3.6%, 평균 순위 25.1 → 24.8
  - `turn-off-ai-in-chrome` 노출 72 → 75 (11.3) / `gemini-gems-to-skills` 14 → 15 (7.8), **클릭 1** / `check-if-image-is-ai-generated` 17 → 20 (69.8) / `image-to-text-offline-free` 13 → 14 (12.6) / `transcribe-audio-offline-free` 30 → 31 (48.8)
- URL 검사: **색인 12 → 16편** (새로 색인: `apple-siri-settlement-claim`·`iphone-duo-sold-out`·`spotify-family-qr-code-verification`·`windows-11-24h2-end-of-support`, 크롤링 10-19 22시~10-20 01시 UTC). `URL is unknown` 6편: `compress-video-for-discord-email`·`merge-pdf-files-free`·`pdf-to-jpg-free`·`pdf-to-word-free`·`pixel-watch-safety-signal-ending`·`split-pdf-free`
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                | 카테고리   | 유형                           | 직접 검증 |
| ------------------- | ---------- | ------------------------------ | --------- |
| `compress-pdf-free` | `software` | 비교 + How-to (측정형, 검색형) | 삭제한 명령줄 글과 같은 PDF 4개(사진 39.6MB·스캔 7.1MB·스크린샷 슬라이드 1.4MB·텍스트 86KB)를 **iLovePDF 웹 3단계·PDF24 웹(기본값 + DPI 100·품질 60)·Sejda PDF Desktop 7.9.10 무료판(GUI, 기본값, 3개)**으로 압축해 크기·남은 해상도·OCR 판독률·링크·텍스트 층 확인 |

- 선정 근거: backlog 36번(PDF 압축, 2026-10-17 명령줄 글 삭제 후 GUI로 새로 쓸 후보), Trends `compress pdf` 4.8(10-16 기록, PDF 남은 후보 중 최대). 자동완성 "compress pdf" 31개(file·free·online·on mac·i love pdf·pdf24·extreme·to 1mb·without losing quality)
- 반복 일정: Chrome 156은 10-20(미국 시간, 세션 시점 미출시), Windows 11-10 → 해당 없음
- 결과: 사진 PDF는 세 도구 기본값 모두 1MB 미만(iLovePDF Recommended 0.80·Sejda 0.94·PDF24 0.99MB, 사진 약 150ppi). 스캔은 Recommended 1.23MB(150ppi)·PDF24 1.41·Sejda 1.43MB(144ppi), OCR 모두 100%. 스크린샷 슬라이드는 Sejda 99%("already very well compressed")·PDF24 89%·Recommended 74%. Extreme은 72ppi로 스캔 0.44MB(OCR 99.1%)·슬라이드 0.39MB(작은 글자 OCR 93.1%). PDF24 DPI 100·품질 60은 스캔 0.75MB(OCR 100%)·슬라이드 0.62MB(98.7%). iLovePDF Less는 JPEG 2000으로 저장, 스캔 61%. 링크·텍스트 층은 모두 유지
- 추천: 대부분 iLovePDF Recommended, 크기 제한 맞추기는 PDF24(DPI·품질 입력), 업로드하기 싫으면 Sejda Desktop(작업당 1개·하루 3회). Mac Preview는 Apple 문서 기반(요약 표 "Not tested")
- 이미지 9장(대표 크기 그래프 1200×675 + 스캔·작은 글자 확대 비교 2 + iLovePDF·PDF24·Sejda 화면 각 2), 요약 표·결과 표. 디자인 시스템 라이트 모드(`chart_style.py`) 첫 측정 글 적용
- 내부 링크: 새 글 → `split-pdf-free`·`merge-pdf-files-free`·`pdf-to-word-free`·`pdf-to-jpg-free`·`compress-image-to-100kb` (5개). 역링크: `merge-pdf-files-free`·`split-pdf-free` 각 1문장 (`updatedAt` 변경 없음, V 기록 대상 아님)
- 빌드 HTML 확인: title 59자(접미사 포함, 본제목 47자)·description 155자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 11개, `<pre>`·`<code>` 0개, 본문 이미지 9장 width·height 지정, sitemap 포함
- lint·test(31파일 233개)·build 통과

**알게 된 것**

- Sejda Desktop 무료판은 압축에서도 작업당 파일 1개(여러 개 선택 시 처리 후 업그레이드 화면, 작업 횟수는 안 깎인 것으로 보임: 그 뒤 3개 성공 후 4번째에 한도 화면). 저장 대화상자 이름 칸에 전체 경로를 입력하면 원하는 폴더에 저장됨
- iLovePDF 압축 화면은 옵션 패널 마크업이 요청마다 달라짐(`li[data-value]` 대문자 화면 / 소문자 문구 화면) → 문구(`get_by_text`)로 고르면 안정적. 결과 화면 크기는 이진 MB(37.73 MB = 39.6 MB)
- PDF24 Tools 웹은 결과·Download 버튼이 `job-monitor` iframe 안에 있음 → `frame_locator("iframe[src*=job-monitor]")`. 업로드 중에는 Compress 버튼이 비활성이라 활성화까지 기다려야 함. 페이지에 광고가 있어 화면 캡처는 광고 영역을 잘라냄
- 네트워크: tools.pdf24.org·ilovepdf.com·smallpdf.com·adobe.com·support.apple.com 가능, sejda.com은 curl 403·WebFetch 가능, pd12m S3·dl.flathub.org 가능

**다음 할 일**

- **사용자: AdSense 신청** — 발행 글 23편. Search Console 색인 16편(이번 세션 4편 증가), 6편 `URL is unknown`. 승인 후 `src/core/config/internal/ads.ts`에 ID 입력은 Claude가 진행
- Claude: 새 글 노출 검색어 확인 (`compress pdf free`, `compress pdf to 1mb`, `compress pdf without losing quality`). Sejda 텍스트 보고서·Good/Best는 하루 3회 제한으로 미측정
- Claude: PDF GUI 글 6편(나누기·합치기·JPG→PDF·PDF→JPG·PDF→Word·압축)이 모였으므로 PDF 허브 글(`Best Free PDF Tools (Tested)`) 우선 검토 (traffic-playbook 3번)
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`), 검증 기록 V1(11-11)·V2(11-12) 판정, 11-10 Patch Tuesday 후 Windows 글 갱신 검토, 칼럼 H4 판정(11-16 이후)
- Claude: Google 광고에 Gmail·Photos 정보 사용 공식 발표 확인 (세션 28에서 이월)
- (완료) 대시보드: README 절차대로 `stats` DB 7개 문서 갱신(버전 21·18·19 → 22·19·20). `ArtifactData` list·batch 모두 권한 분류기 거부 없음. 비로그인용 `data.js`는 정기 세션 규칙대로 건너뜀
- Claude: 발행 23편

## 2026-10-20 · 세션 28 (정기 실행, 화제 뉴스 세션): Spotify Family QR 코드 인증

세션 시각: 2026-10-20 06:15 KST → 화제 뉴스 칼럼 세션. 열린 PR 없음. 작업 브랜치를 `origin/main`(f33bc6e)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-21 ~ 10-19, 세션 27 이후 바뀐 값만)**

- 노출 152 → **157**, 클릭 5, CTR 3.3% → 3.2%, 평균 순위 25.2 → 25.1
  - `turn-off-ai-in-chrome` 노출 69 → 72 (11.4) / `check-if-image-is-ai-generated` 15 → 17 (76.9) / `image-to-text-offline-free` 12 → 13 (13.0) / `transcribe-audio-offline-free` 29 → 30 (48.7)
- URL 검사: **색인 8 → 12편** (새로 색인: `convert-heic-to-jpg-free`·`iphone-handoff-verizon-cost`·`jpg-to-pdf-free`·`microsoft-365-family-storage-2tb`, 크롤링 10-19 17~20시 UTC). `URL is unknown` 9편: `apple-siri-settlement-claim`·`compress-video-for-discord-email`·`iphone-duo-sold-out`·`merge-pdf-files-free`·`pdf-to-jpg-free`·`pdf-to-word-free`·`pixel-watch-safety-signal-ending`·`split-pdf-free`·`windows-11-24h2-end-of-support`
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                                  | 카테고리 | 유형             | 독창 요소 |
| ------------------------------------- | -------- | ---------------- | --------- |
| `spotify-family-qr-code-verification` | `news`   | 뉴스 칼럼 (화제) | QR 인증 기한·결과 흐름도(대표 이미지), 요금제별 1인당 월 요금과 Individual 전환 시 연간 추가 비용(6인 Family $3.67 → $12.99, 연 $111.90), 사용자 유형별 영향 표, Spotify 문서끼리의 차이(주소 인증 실패는 같은 플랜 재가입 가능 명시 vs QR 항목엔 없음, Duo 문서엔 QR 없음) |

- 선정 근거 (48시간, Google News RSS): `Spotify QR code family` 11 · `Spotify Premium Family` 37 (모두 10-19). Trends 미국 7일 `spotify family` 9.9(최고 24) · `spotify qr code` 0.1(최고 11) · 기준 `remove background` 65.9. 자동완성 "spotify family plan" 31개(address verification·different address·not working 등)
- 발표 시점: Spotify 공식 발표 없음. 지원 문서 `updatedAt` 10-07, 사용자 알림 보도 10-19(9to5Google, Reddit 인용) → 보도·배포 시점으로 48시간 판단
- 제외·보류: "Google이 Gmail·Photos 정보로 광고 타기팅"(Techlicious 10-19, 기사 3~4건, Google 공식 발표 미확인 → 다음 뉴스 세션에서 재확인), Windows 11 10월 업데이트 Smart App Control 차단(1건, Microsoft 문서 미확인), iOS 27.2 RC(정식 배포 전), Amazon Alexa Tablet(신제품 소개), Netflix·Spotify 실적(업계 뉴스)
- `Our take`: 규칙(같은 주소)은 그대로지만 증명 방식이 "주소 입력 → 7일 안 대면 스캔"으로 바뀌어 놓쳤을 때 12개월 차단을 피하기 어려워짐. 함께 사는 가구는 알림 즉시 스캔, 떨어져 사는 구성원(대학생 등)은 알림 전에 Student·Individual로 옮기는 편이 안전. Spotify는 연장·이의 절차를 공개해야 함. 반대 관점: "일부" 구성원만 대상이고 실제 가구에는 몇 초짜리 확인
- 우회 방법(영상 통화 등 보도)은 약관 위반이라 다루지 않음
- 1차 출처: Spotify 지원 문서(Family 주소·인증, Family plan, Duo 주소·인증, 플랜 변경), Paid Subscription Terms 2.2.1, spotify.com/us/premium 요금. 모두 curl 정적 HTML(지원 문서는 `__NEXT_DATA__`의 `updatedAt`까지 확인)
- 이미지 2장 (직접 만든 그래픽 1200×675): 인증 흐름도(`thumbnail`), 1인당 요금·연간 추가 비용. 팔레트는 기존 글과 같은 파랑·주황
- 내부 링크: 새 글 → `microsoft-365-family-storage-2tb`·`iphone-handoff-verizon-cost`. 역링크: `microsoft-365-family-storage-2tb` 마지막 문단에 1문장 추가 (`updatedAt` 변경 없음, V 기록 대상 아님)
- 빌드 HTML 확인: title 84자(접미사 포함, 본제목 72자)·description 157자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 7개, `<pre>`·`<code>` 0개, 본문 이미지 2장 width·height 지정, sitemap 포함
- lint·test(31파일 233개)·build 통과

**알게 된 것**

- support.spotify.com 문서는 curl로 열리고, `__NEXT_DATA__` JSON의 `article.updatedAt`으로 문서 수정일을 확인할 수 있음. spotify.com/us/premium 요금도 정적 HTML에 있음. `premium-family-terms`는 Paid Subscription Terms로 리디렉트
- 공식 발표 없이 지원 문서만 바뀌고 보도로 화제가 되는 경우가 있음 → 화제 세션의 "48시간 발표"는 보도·배포 시점으로 판단하고 사실 확인표에 문서 수정일을 함께 적음

**다음 할 일**

- **사용자: AdSense 신청** — 발행 글 22편. Search Console 색인 12편(이번 세션 4편 증가), 9편 `URL is unknown`. 승인 후 `src/core/config/internal/ads.ts`에 ID 입력은 Claude가 진행
- Claude: Spotify가 Duo로 QR 확대·연장/이의 절차·공식 발표를 내면 `spotify-family-qr-code-verification` 갱신(`updatedAt`). H4 판정(11-16 이후): `gsc_report.py --compare /posts/spotify-family-qr-code-verification --changed 2026-10-19 --metric impressions --type discover`. H5 화제 칼럼 3편째(영향 4편)
- Claude: Google 광고에 Gmail·Photos 정보 사용(Personal Intelligence) 공식 발표 확인 → 사실이면 영향/화제 칼럼 후보
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`), 검증 기록 V1(11-11)·V2(11-12) 판정, PDF 허브 글 검토, 11-10 Patch Tuesday 후 Windows 글 갱신 검토
- (완료) 대시보드: README 절차대로 `stats` DB 7개 문서 갱신(버전 20·17·18 → 21·18·19). `ArtifactData` list·batch 모두 권한 분류기 거부 없음. 비로그인용 `data.js`는 정기 세션 규칙대로 건너뜀
- Claude: 발행 22편

## 2026-10-20 · 세션 27 (정기 실행, 일반 세션): PDF→Word 무료 도구 3개 측정

세션 시각: 2026-10-20 00:16 KST → 일반 세션(`ai-tools`·`software`). 열린 PR 없음. 작업 브랜치를 `origin/main`(6ca54ff)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-21 ~ 10-19, 세션 26 이후 바뀐 값만)**

- 노출 142 → **152**, 클릭 5, CTR 3.5% → 3.3%, 평균 순위 24.5 → 25.2
  - `turn-off-ai-in-chrome` 노출 67 → 69 (11.6) / `gemini-gems-to-skills` 12 → 14 (8.1) / `image-to-text-offline-free` 9 → 12 (13.4) / `transcribe-audio-offline-free` 28 → 29 (47.9)
- sitemap 마지막 다운로드 10-17 10:45 → **10-19 10:59 UTC**. `rss.xml`이 10-19 11:24 UTC에 피드로 제출됨(Claude 세션 기록 없음 → 사용자가 제출한 것으로 보임), 같은 시각 다운로드·오류 0
- URL 검사: `compress-image-to-100kb`가 **색인됨**(크롤링 10-19 12:27 UTC) → 8편 색인, 12편 `URL is unknown`(세션 26의 12편 중 `compress-image-to-100kb` 제외 + `windows-11-24h2-end-of-support`)
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug               | 카테고리   | 유형                           | 직접 검증 |
| ------------------ | ---------- | ------------------------------ | --------- |
| `pdf-to-word-free` | `software` | 비교 + How-to (측정형, 검색형) | 정답을 아는 PDF 11개(삭제한 명령줄 글의 `gen.py` 재사용)를 **LibreOffice Writer 26.8.1(GUI)·Sejda PDF Desktop 7.9.10 무료판(GUI, 3개)·iLovePDF 웹(Playwright, 로그인 안 함)**으로 변환해 채점: 편집 가능한 문단·실제 Word 표·텍스트 상자·단어 보존·OCR, 편집 테스트(문장 추가 후 재배치) |

- 선정 근거: backlog 33번(PDF→Word, 2026-10-17 명령줄 글 삭제 후 GUI로 새로 쓸 후보), Trends `pdf to word` 23.4(기준 `remove background` 35.3, PDF 주제 중 최대). 자동완성 "pdf to word free" 32개(converter·no sign up·ocr·ilovepdf·smallpdf)
- 반복 일정: Chrome 156은 10-20(미국 시간, 세션 시점 미출시), Windows 11-10 → 해당 없음
- 결과: 단어는 세 도구 모두 거의 100%. LibreOffice는 문단 0%(모든 줄이 텍스트 상자, 상태 표시줄 0 words), 표 0/5, 송장 머리글 행이 음영에 가려짐. Sejda는 문단 100%지만 표 0/2(행이 텍스트 줄), 1단·본문 9pt(원본 11pt), 2쪽 → 1쪽. iLovePDF는 표 4/5, 2단 구역·제목 스타일·글머리표 목록 유지, 문단 82%(일부가 두 문단으로 나뉨). 스캔 PDF: LibreOffice 그림, Sejda 거부("Scanned documents are not supported"), iLovePDF는 OCR 안내 → Apply OCR(로그인 안 함)로 단어 99.7%(요금표상 OCR은 Premium)
- 기본값 함정: LibreOffice에서 PDF를 그냥 열면 Draw로 열리고 Draw는 Word로 저장 불가 → Writer 열기 창 파일 형식 "PDF - Portable Document Format (Writer)" 선택 필요
- Word·Google Docs는 공식 문서 기반(요약 표 "Not tested")
- 이미지 11장(대표 점검표 1200×675 + 송장 표 2×2 비교 + 편집 테스트 + LibreOffice 화면 3 + Sejda 화면 3 + iLovePDF 화면 2), 요약 표·결과 표
- 내부 링크: 새 글 → `image-to-text-offline-free`·`pdf-to-jpg-free`·`jpg-to-pdf-free`·`split-pdf-free`·`merge-pdf-files-free` (5개). 역링크: `pdf-to-jpg-free` 마지막 문단 뒤 1문장 추가 (`updatedAt` 변경 없음, V 기록 대상 아님)
- 빌드 HTML 확인: title 64자(접미사 포함, 본제목 52자)·description 153자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 10개, `<pre>`·`<code>` 0개, 본문 이미지 11장 width·height 지정, sitemap 포함
- lint·test(31파일 233개)·build 통과

**알게 된 것**

- 웹 서비스(iLovePDF)도 Playwright로 직접 측정 가능: `input[type=file]`에 파일 지정 → `#processTask` 클릭 → 다운로드 이벤트. 스캔 PDF는 OCR 안내 화면이 뜨고 같은 문구 버튼이 숨김 요소로 2개 있어 `button:visible`로 골라야 함
- Sejda Desktop 무료판은 변환 도구에서 "작업당 파일 1개"라 여러 파일 선택 시 업그레이드 화면. 단일 파일 작업은 출력 폴더 대신 저장 파일 대화상자가 뜸. flatpak 문서 포털 경로 때문에 첫 결과 파일 이름이 `.docx`(이름 없음)로 저장된 적 있음(환경 문제로 판단, 글에는 안 씀)
- ONLYOFFICE Desktop Editors flatpak(10.0.0)은 이 컨테이너에서 `Gtk-ERROR: Can't create a GtkStyleContext without a display connection`으로 실행 실패 (Sejda flatpak은 `--no-sandbox`로 정상). 시스템 dbus(`dbus-daemon --system --fork`)는 필요 없었음
- `flatpak run --command=sh … -c env`처럼 샌드박스 환경 변수를 출력하면 컨테이너의 비밀 환경 변수까지 찍힘 → 필요한 변수만 `echo`

**다음 할 일**

- **사용자: AdSense 신청** — 발행 글 21편(세션 26에서 20편 도달). Search Console 색인 8편, 12편 `URL is unknown`. 승인 후 `src/core/config/internal/ads.ts`에 ID 입력은 Claude가 진행
- Claude: 새 글 노출 검색어 확인 (`pdf to word free`, `pdf to word free no sign up`, `pdf to word ocr free`). Sejda 나머지 7개 파일은 하루 3회 제한으로 미측정 → 필요하면 다음 날 세션에서 보강(같은 글 갱신, `updatedAt`)
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`), 검증 기록 V1(11-11)·V2(11-12) 판정, PDF 허브 글 검토(PDF GUI 글 5편: 나누기·합치기·JPG→PDF·PDF→JPG·PDF→Word). 남은 후보 PDF 압축(36번)
- Claude: 11-10 Patch Tuesday 후 `windows-11-24h2-end-of-support`·`windows-10-esu-extended` 갱신 검토, 칼럼 H4 판정(11-16)
- (완료) 대시보드: README 절차대로 `stats` DB 7개 문서 갱신(버전 19·16·17 → 20·17·18). `ArtifactData` list·batch 모두 권한 분류기 거부 없음. 비로그인용 `data.js`는 정기 세션 규칙대로 건너뜀
- Claude: 발행 21편

## 2026-10-19 · 세션 26 (정기 실행, 영향 뉴스 세션): Windows 11 24H2 Home·Pro 업데이트 종료

세션 시각: 2026-10-19 18:15 KST → 영향이 오래 가는 뉴스 칼럼 세션. 열린 PR 없음. 작업 브랜치를 `origin/main`(8790289)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-21 ~ 10-19, 세션 25 이후 바뀐 값만)**

- 노출 138 → **142**, 클릭 5, CTR 3.6% → 3.5%, 평균 순위 24.6 → 24.5
  - `transcribe-audio-offline-free` 노출 26 → 28 (46.6) / `gemini-gems-to-skills` 11 → 12 (8.1) / 나머지 변화 없음
  - 새 검색어 없음
- sitemap 마지막 다운로드 10-17 10:45 UTC 그대로. URL 검사 변화 없음: 12편 `URL is unknown`(세션 25의 11편 + `pdf-to-jpg-free`), 7편 색인
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                             | 카테고리 | 유형             | 독창 요소 |
| -------------------------------- | -------- | ---------------- | --------- |
| `windows-11-24h2-end-of-support` | `news`   | 뉴스 칼럼 (영향) | 버전별 Home·Pro 지원 기간 타임라인(대표 이미지), 오늘 기준 남은 보안 업데이트 개월 수(24H2 0·25H2 약 12·26H2 약 24)와 첫 누락 업데이트일(11-10), 사용자 유형별 영향 표(Home/Pro·Enterprise/Education·25H2·26H2·26H1·23H2·Windows 10), 같은 KB(KB5127648)가 24H2·25H2·26H2에 함께 나가는 점으로 enablement package 설명 |

- 선정 근거 (최근 30일 발표, Google News RSS): `Windows 11 24H2 end of support` 38 · `Windows 11 26H2` 100. 자동완성 "windows 11 24h2 end of support" 17개(Google·Bing·YouTube: date·end of life·end of service), "windows 11 26h2" 25개(download·iso·release date·update 3곳). Trends 미국 1개월 `windows 11 26h2` 4.7 · `25h2` 1.7 · `24h2` 0.5 (기준 `remove background` 35.8). backlog 뉴스 칼럼 후보("날짜가 지나 업데이트 방법 일반 글로 검토")를 영향 칼럼으로 씀: 종료일은 지났지만 첫 누락 업데이트(11-10)부터 영향이 계속됨
- 제외·보류: Fitbit 클래식 앱 → Google Health 강제 전환(10-12 보도 100건, Google 공식 블로그 2편에 종료 언급 없음·이미 종료된 상태), "Windows Update가 패치 안 된 PC에서 내년 작동 중단"(TechPowerUp 10-11, 1차 출처 못 찾음·techpowerup.com 403), Windows 11 23H2 Enterprise 11-10 종료(기업 대상), Disney+·Amazon Prime 가격 인상(분야 밖), Samsung SmartThings Tracker 종료(보도만)
- `Our take`: 25H2가 아니라 26H2로 지금 업데이트. 근거: 같은 작은 다운로드·재시작 1회로 지원 2년(25H2는 1년), Microsoft 문서상 26H2 파일이 이미 최신 24H2 PC에 있음, 26H2 알려진 문제는 주로 기업 환경이고 24H2에도 같음. safeguard hold는 강제로 넘지 않음(11-10 전까지 비용 없음). 반대 관점: 기능 업데이트는 몇 달 기다리는 사람도 있음 → 11월 초까지는 합리적
- 1차 출처: Microsoft Learn Windows 메시지 센터·Windows 11 release information·24H2/26H2 상태 페이지·safeguard holds·lifecycle FAQ, Microsoft Support KB5121794·기기 정보 확인 문서, Windows Experience Blog 26H2 발표, Windows 11 다운로드 페이지(Installation Assistant). 모두 curl 정적 HTML로 확인
- Windows는 컨테이너에서 실행할 수 없어 단계는 Microsoft 문서 기반(본문에 출처 링크, 직접 실행 표현 없음)
- 이미지 2장 (직접 만든 그래픽 1200×675): 버전별 지원 기간 타임라인(`thumbnail`), 버전별 남은 업데이트 개월 수. 팔레트는 기존 글과 같은 파랑·주황
- 내부 링크: 새 글 → `windows-10-esu-extended`(2회)·`microsoft-365-family-storage-2tb`. 역링크: `windows-10-esu-extended` "Should you enroll or move to Windows 11?" 문단에 1문장 추가 (`updatedAt` 변경 없음, V 기록 대상 아님)
- 빌드 HTML 확인: title 74자(접미사 포함, 본제목 62자)·description 152자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 7개, `<pre>`·`<code>` 0개, 본문 이미지 2장 width·height 지정, sitemap 포함
- lint·test(31파일 233개)·build 통과

**알게 된 것**

- Microsoft Learn release information 표의 버전별 릴리스 기록은 24H2·25H2·26H2가 같은 KB 번호를 씀 → enablement package 구조를 독자에게 보여 주는 근거로 쓸 수 있음
- support.microsoft.com의 예전 문서 주소(628bec99…)는 "Find information about your Windows device"로 리디렉트됨(curl `-L` 필요). blog.google 글은 `<article>` 안만 뽑아야 본문이 나옴
- 종료일이 지난 변경도 "다음 누락 업데이트일"처럼 앞으로 올 날짜가 있으면 영향 칼럼이 됨

**다음 할 일**

- **사용자: AdSense 신청** — 발행 글이 이번 세션으로 **20편**에 도달 (README 기준: 글 20편 도달 즉시). 단, Search Console에서 12편이 아직 `URL is unknown`이고 sitemap 마지막 다운로드가 10-17이라 색인은 7편뿐. 승인 후 `src/core/config/internal/ads.ts`에 ID 입력은 Claude가 진행
- Claude: 11-10 Patch Tuesday 후 26H2 safeguard hold·배포 확대 상황을 `windows-11-24h2-end-of-support`에 반영 검토 (`updatedAt` 갱신). 같은 날 `windows-10-esu-extended` 빌드 표 갱신 검토
- Claude: 칼럼 발행 4주 후(11-16) H4 판정 자료: `gsc_report.py --compare /posts/windows-11-24h2-end-of-support --changed 2026-10-19 --metric impressions --type discover`(웹은 `--type web`). H5 영향 칼럼 4편째(화제 2편)
- Claude: 검증 기록 V1(11-11)·V2(11-12) 판정, Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`), PDF 허브 글 검토
- (완료) 대시보드: README 절차대로 `stats` DB 7개 문서 갱신(버전 17·14 → 18·15). `ArtifactData` list·batch 모두 권한 분류기 거부 없음 (세션 25 실패 해소). 비로그인용 `data.js`는 정기 세션 규칙대로 건너뜀
- Claude: 발행 20편 / AdSense 신청 기준 20편 도달

## 2026-10-19 · 세션 25 (정기 실행, 일반 세션): PDF→JPG GUI 앱 3개 측정

세션 시각: 2026-10-19 12:16 KST → 일반 세션(`ai-tools`·`software`). 열린 PR 없음. 작업 브랜치를 `origin/main`(027c2f2)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-21 ~ 10-19, 세션 24 이후 바뀐 값만)**

- 노출 134 → **138**, 클릭 5, CTR 3.7% → 3.6%, 평균 순위 25.3 → 24.6
  - `turn-off-ai-in-chrome` 노출 64 → 67 (11.7) / `image-to-text-offline-free` 8 → 9 (9.7) / 나머지 변화 없음
  - 새 검색어 없음
- sitemap 마지막 다운로드 10-17 10:45 UTC 그대로. URL 검사 변화 없음: 11편 `URL is unknown`(세션 24의 10편 + `apple-siri-settlement-claim`), 7편 색인
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug              | 카테고리   | 유형                           | 직접 검증 |
| ----------------- | ---------- | ------------------------------ | --------- |
| `pdf-to-jpg-free` | `software` | 비교 + How-to (측정형, 검색형) | IRS Form 1040(2쪽)·보고서(흰 배경 없음, 7pt 각주)·사진 3쪽 PDF를 **GUI 앱 3개로 직접 변환**: GIMP 3.2.6(기본 Layers·Images), LibreOffice Draw 26.8.1(기본·해상도 300 입력·해결 설정), Sejda PDF Desktop 7.9.10 무료판(Medium 150·Large 220 dpi, 4번째 작업 한도). 저장된 쪽·픽셀 크기·파일 크기·OCR 판독률 점검 |

- 선정 근거: 자동완성 "pdf to jpg" 31개(converter·converter free·free 3곳, canva·high quality·iphone 2곳, mac·windows·high resolution). Trends(미국 3개월) `pdf to jpg` 12.9 · `compress pdf` 4.8 · `webp to jpg` 1.8 · 기준 `remove background` 35.2. backlog 44번 + 세션 23 다음 할 일 "PDF GUI 시리즈"
- 반복 일정: Chrome 156은 10-20(내일), Windows 11-10 → 해당 없음. discover의 새 소식(Circle to Search 문자 사기 확인 10-15 등)은 직접 검증 불가로 제외
- 차별점: 기본값의 함정 → (1) GIMP는 기본 `Open pages as: Layers`라 2쪽 PDF에서 **2쪽(마지막 쪽)만** JPG로 저장(300 ppi, 2550×3301). `Images`로 바꾸면 쪽마다 따로 열림. (2) LibreOffice Draw는 기본 96 ppi(816×1056, OCR 52%), **Modify resolution에 300을 넣어도 픽셀 그대로**(인치만 2.72×3.52로 줄어듦) → 300 입력 후 Modify dimensions에서 8.50인치로 되돌리면 2550×3300(OCR 82%). 해상도는 다음 내보내기에서 96으로 초기화, 글꼴이 바뀌어 "Digital Assets"가 옆 글과 붙음. (3) Sejda는 모든 쪽을 따로 저장하지만 기본 150 dpi·최대 220 dpi, 품질 추정 100이라 150 dpi 쪽이 GIMP 300 ppi 쪽만큼 큼(1.21 vs 1.28MB), 무료 20쪽·하루 3회
- Mac Preview는 Apple 문서 기반(요약 표 "Not tested")
- 적용한 노하우: 검색형 제목 50자·설명 158자, 측정 규모 제목 표기 `(3 Apps Tested)`, 이미지 9장(대표 점검표 1200×675 + 해상도 확대 비교 + LibreOffice 글꼴 비교 + GIMP 화면 2 + LibreOffice 화면 2 + Sejda 화면 2), 요약 표·결과 표 → 사실 확인표에 기록
- 내부 링크: 새 글 → `jpg-to-pdf-free`·`split-pdf-free`·`merge-pdf-files-free`·`compress-image-to-100kb`·`image-to-text-offline-free` (5개). 역링크: `jpg-to-pdf-free` 다른 도구 문단에 1문장 추가 (`updatedAt` 변경 없음, V 기록 대상 아님)
- 빌드 HTML 확인: title 62자(접미사 포함)·description 158자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 10개, `<pre>`·`<code>` 0개, 본문 이미지 9장 width·height 지정, sitemap·RSS 포함
- lint·test(31파일 233개)·build 통과

**알게 된 것**

- GIMP 3.2.6 AppImage의 저장 대화상자는 `xdotool windowfocus --sync <창>` 후 입력해야 들어감 (세션 9·이전 PDF→JPG 측정에서 막혔던 원인). 포커스 없이 입력하면 본 창 단축키로 들어가 도구·확대가 바뀜
- LibreOffice 대화상자는 `xdotool key --window`(XSendEvent)를 무시함 → 창에 포커스를 준 뒤 일반 `xdotool key`·`type`
- `pkill -f`뿐 아니라 `pgrep -f` 패턴을 `kill`에 넘겨도 Bash 호출이 같이 죽음(exit 144) → `pgrep -x`
- Sejda 웹사이트 무료 한도("Docs up to 50MB and 200 pages")와 앱 PDF to JPG 화면("up to 20 pages or 50 MB")이 다름 → 앱 화면 기준
- 네트워크: download.gimp.org·download.documentfoundation.org·gimp.org·libreoffice.org·support.apple.com·irs.gov·pd12m S3·dl.flathub.org 가능, sejda.com은 curl 403·WebFetch 가능

**다음 할 일**

- Claude: 새 글 노출 검색어 확인 (`pdf to jpg free`, `pdf to jpg high quality`, `pdf to jpg on mac`), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: PDF GUI 시리즈 4편(나누기·합치기·JPG→PDF·PDF→JPG)이 모였으므로 PDF 허브 글(`Best Free PDF Tools (Tested)` 등) 검토 (traffic-playbook 3번). 남은 후보 PDF 압축(36번)
- (실패) 대시보드: `ArtifactData` list가 권한 분류기(auto mode)에 거부되어 `stats` DB를 갱신하지 못함 (세션 21~24는 거부 없음). 다음 세션에서 README 절차대로 다시 시도
- Claude: 발행 19편 / AdSense 신청 기준 20편 (다음 세션에서 20편 도달 예정 → 그 세션 '다음 할 일'에 사용자용 AdSense 신청 항목)

## 2026-10-19 · 세션 24 (정기 실행, 화제 뉴스 세션 → 영향 뉴스로 대체): Apple Siri 합의금 청구

세션 시각: 2026-10-19 06:15 KST → 화제 뉴스 칼럼 세션. 48시간 안 발표 중 기준을 통과한 후보가 없어 README 대체 순서대로 영향 뉴스로 씀. 열린 PR 없음. 작업 브랜치를 `origin/main`(090761d)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-20 ~ 10-18, 세션 23 이후 바뀐 값만)**

- 노출 130 → **134**, 클릭 4 → **5**, CTR 3.1% → 3.7%, 평균 순위 25.8 → 25.3
  - `turn-off-ai-in-chrome` 노출 63 → 64 (12.2) / `gemini-gems-to-skills` 10 → 11 (8.2) / 나머지 변화 없음
  - 페이지별 클릭: 홈 2·`turn-off-ai-in-chrome` 2·`free-offline-text-to-speech`(10-17 삭제한 글) 1. 검색어 `where did gems go in gemini` 2 (6.0)
- sitemap 마지막 다운로드 10-17 10:45 UTC 그대로. URL 검사 변화 없음: 10편 `URL is unknown`(세션 23의 9편 + `jpg-to-pdf-free`), 7편 색인
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                          | 카테고리 | 유형                             | 독창 요소 |
| ----------------------------- | -------- | -------------------------------- | --------- |
| `apple-siri-settlement-claim` | `news`   | 뉴스 칼럼 (영향, 화제 세션 대체) | 법원 문서 수치로 계산한 청구율별 기기당 지급액 그래프(대표 이미지): 최대 보수·비용을 뺀 순액 약 $174.4M ÷ 청구 기기 → $25 유지에 약 19% 청구 필요, 약 5% 이하면 $95 상한. 원고 측이 비교로 든 과거 청구율(2.57~3.6%, Nexus 6P 18%) 표시. 일정 타임라인(지급일 미정 점선), 대상 여부 표(모델·기간·선물·중고·여러 대·캐나다) |

- 화제 뉴스 후보 (48시간, Google News RSS): 기준 통과 없음. T-Mobile T-Mix 요금제(유출만), WhatsApp 게스트 통화(10-14)·Fitbit Edge(10-15)는 48시간 밖, Meta 10-30 약관은 사업자·웹사이트 대상, ChatGPT Chrome 탭 제어는 openai.com 403, Gemini 이름 변경은 Android Police 1건뿐. Trends 급상승 RSS는 스포츠만. Mashable 10-18 09:00 기사 다수(YouTube Video Editor 종료·Bluesky 인증 등)는 과거 소식 재게시라 제외
- 선정 근거: 청구 시작 9-21(보도, 최근 30일), 마감 12-21. Google News 48시간 `"$250 million" Apple claim` 9 · `Apple settlement Siri claim` 6 (CNET 10-18 등 재보도). 자동완성 "apple siri settlement" 22개(claim·claim form·payout·payout date·legit·website·canada). Trends 7일 0.0 → 검색량 신호는 약함
- `Our take`: 청구할 것. 근거: 순액 약 $174M을 청구자끼리 나누고 상한 $95, $25는 약 19% 청구를 가정, 과거 청구율 2.6~3.6%면 모두 상한. 반대 관점: 이번엔 Apple이 등록 사용자 최대 99%에게 직접 통지 → 청구율이 훨씬 높을 수 있고 18%면 약 $26
- 1차 출처: CourtListener RECAP의 법원 문서 PDF(ECF 77 신청서·78 공동 진술서·78-1 합의서·78-2 관리자 진술서·94 예비 승인 명령·96·97 최종 심리 일정), Apple 지원 108037(시리얼 찾기), 원고 측 변호인 Clarkson Law Firm 페이지(12-21 마감, WebFetch)
- 청구 마감 충돌: 예비 승인 명령대로 계산하면 07-17 + 45 + 90 = 11-29인데 변호인 페이지·보도는 12-21 → 통지일 연장(08-28 연장 신청 보도)으로 판단. 연장 명령 원문은 RECAP에 없음. 글은 변호인 페이지 문구("before December 21") 기준 + "well before" 권고
- 이미지 2장 (직접 만든 그래픽 1200×675): 청구율별 지급액(`thumbnail`), 일정 타임라인. 팔레트는 기존 글과 같은 파랑·주황
- 내부 링크: 새 글 → `iphone-duo-sold-out`·`iphone-handoff-verizon-cost`. 역링크: `iphone-duo-sold-out` 보상 판매 문단에 "보상 판매 전 시리얼 번호 복사" 1문장 추가 (`updatedAt` 변경 없음, V 기록 대상 아님)
- 빌드 HTML 확인: title 80자(접미사 포함, 본제목 68자)·description 159자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 7개, `<pre>`·`<code>` 0개, 본문 이미지 2장 width·height 지정, sitemap·RSS 포함
- lint·test(30파일 230개)·build 통과

**알게 된 것**

- CourtListener: 검색 API는 비로그인 하루 125회 제한(이번 세션에 소진), RECAP PDF는 `storage.courtlistener.com/recap/gov.uscourts.{법원}.{pacer_case_id}.{번호}.{첨부}.pdf`로 직접 받을 수 있음(없는 번호는 404 → 번호를 훑어 보관된 문서만 찾음). 집단소송 합의 뉴스는 법원 문서가 1차 출처가 됨
- 합의 공식 사이트(Verita 운영 SmartphoneAISettlement.com)는 Cloudflare 봇 확인으로 curl·Playwright 모두 차단, web.archive.org는 프록시 연결 끊김(이전 기록 없음), archive.ph 429, clarksonlawfirm.com은 curl 403·WebFetch 가능
- 주말(미국 토·일) 화제 세션은 48시간 안 공식 발표가 거의 없음 → 영향 뉴스 대체가 잦을 것

**다음 할 일**

- Claude: 청구 기간 연장·최종 승인(2027-02-24)·보수 결정·청구 수 공개(2027-01 최종 승인 신청서)가 나오면 `apple-siri-settlement-claim`에 반영하고 `updatedAt` 갱신. 공식 사이트에 접근되면 12-21 마감·지급 방식을 직접 확인
- Claude: 칼럼 발행 4주 후(11-16) H4 판정 자료: `gsc_report.py --compare /posts/apple-siri-settlement-claim --changed 2026-10-18 --metric impressions --type discover`(웹은 `--type web`). H5 영향 칼럼 3편째(화제 2편)
- Claude: 새 글 노출 검색어 확인 (`jpg to pdf free` 등), 검증 기록 V1(11-11)·V2(11-12) 판정, Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: T-Mobile T-Mix 요금제가 공식 발표되면 화제/영향 칼럼 후보 (현재 유출만)
- (완료) 대시보드: README 절차대로 `stats` DB 7개 문서 갱신(버전 16·13 → 17·14). `ArtifactData` list·batch 모두 권한 분류기 거부 없음. 비로그인용 `data.js`는 정기 세션 규칙대로 건너뜀
- Claude: 발행 18편 / AdSense 신청 기준 20편

## 2026-10-19 · 세션 23 (정기 실행, 일반 세션): JPG→PDF GUI 3가지 측정

세션 시각: 2026-10-19 00:15 KST → 일반 세션(`ai-tools`·`software`). 열린 PR 없음. 작업 브랜치를 `origin/main`(a057f71)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-20 ~ 10-18, 세션 22 이후 바뀐 값만)**

- 노출 123 → **130**, 클릭 4, CTR 3.3% → 3.1%, 평균 순위 25.1 → 25.8
  - `turn-off-ai-in-chrome` 노출 61 → 63 (12.2) / `check-if-image-is-ai-generated` 14 → 15 (75.8) / `transcribe-audio-offline-free` 25 → 26 (47.8) / `gemini-gems-to-skills` 9 → 10 (8.0) / `image-to-text-offline-free` 7 → 8 (9.9) / 나머지 변화 없음
  - 검색어: `synthid checker` 5 → 6 (87.5), `offline transcription software` 2 → 3. 새 검색어 없음
- sitemap 마지막 다운로드 10-17 10:45 UTC 그대로. URL 검사 변화 없음: 9편 `URL is unknown`(세션 22의 8편 + `microsoft-365-family-storage-2tb`), 7편 색인
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug              | 카테고리   | 유형                           | 직접 검증 |
| ----------------- | ---------- | ------------------------------ | --------- |
| `jpg-to-pdf-free` | `software` | 비교 + How-to (측정형, 검색형) | 12MP 사진 10장(22.6MB, 세로 2장은 휴대폰처럼 EXIF Orientation=6)을 **GUI 3가지로 직접 변환**: PDF Arranger 1.14.0(이미지 가져오기·Page Size US Letter), Sejda PDF Desktop 7.9.10 무료판(JPG to PDF, 기본값·Letter+Small margin·Fit to image), Chromium 141 인쇄 → Save as PDF(기본·Landscape·Margins None+Scale 90). 쪽마다 방향·사진 바이트 보존·페이지 크기·파일 크기 점검 |

- 선정 근거: 자동완성 "jpg to pdf" 32개(converter·free 3곳, merge·free online 2곳, on mac·windows 11·high quality). Trends(미국 3개월) `jpg to pdf` 13.1 · `pdf to jpg` 13.0 · `image to pdf` 7.9 · `compress pdf` 4.8 · 기준 `remove background` 35.3. backlog 43번 + 세션 21 다음 할 일 "PDF GUI 시리즈"
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음
- 차별점: 세로 사진은 3곳 모두 바로 섰지만 처리 방식이 다름 → (1) PDF Arranger는 10/10 사진 바이트 그대로(페이지 회전), 대신 기본 페이지가 사진 크기 56×42인치 → Page Size > Fit to paper > US Letter로 해결(사진 그대로 유지). (2) Sejda는 세로 2장을 돌려서 다시 저장(1.85 → 0.91MB, 평균 픽셀 차이 0.5%), 기본 A4, 무료 "5 MB" 표기에도 22.6MB 변환 성공, 4번째 작업에서 하루 3회 한도. (3) Chrome은 사진 1장당 PDF 1개, 세로 사진을 무압축 저장해 1.85MB → **21.6MB**(11.6배), 기본으로 날짜·파일 경로 머리글 인쇄, Landscape로 바꾸면 2쪽으로 넘침(Margins None + Scale 90으로 1쪽), Layout 설정이 다음 인쇄에 남음
- Mac Finder Create PDF는 Apple 문서 기반(요약 표 "Not tested"), Windows Microsoft Print to PDF는 공식 Microsoft 단계 문서를 찾지 못해 단계 없이 언급만
- 적용한 노하우: 검색형 제목 50자·설명 160자, 측정 규모 제목 표기 `(3 Ways Tested)`, 이미지 8장(대표 점검표 1200×675 + 사진 크기 그래프 + PDF Arranger 화면 2 + Sejda 화면 2 + Chrome 화면 2), 요약 표 → 사실 확인표에 기록
- 내부 링크: 새 글 → `merge-pdf-files-free`·`convert-heic-to-jpg-free`·`compress-image-to-100kb`·`split-pdf-free` (4개). 역링크: `merge-pdf-files-free` 입력 파일 설명에 1문장 추가 (`updatedAt` 변경 없음, V 기록 대상 아님)
- 빌드 HTML 확인: title 62자(접미사 포함)·description 160자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 10개, `<pre>`·`<code>` 0개, 본문 이미지 8장 width·height 지정, sitemap 포함
- lint·test(30파일 230개)·build 통과

**알게 된 것**

- PDF Arranger는 JPG를 바로 열어 페이지로 가져옴(열기 대화상자 "All supported files"). EXIF 세로 사진은 사진 데이터를 바꾸지 않고 페이지 회전(/Rotate 90)으로 세움
- Chrome 인쇄 미리 보기는 Margins를 None으로 바꾸면 Headers and footers 옵션이 사라짐. Layout·Margins 설정은 다음 인쇄에 유지됨
- Sejda 무료판 한도는 앱 화면 문구(30쪽 또는 5MB)·웹사이트 문구(Images up to 5MB)와 실제 동작(22.6MB 변환 성공)이 다를 수 있음 → 앱 화면 문구 대신 실제 변환 결과를 씀. 하루 3회 한도는 JPG to PDF에서도 같음(새 설치에서 3회 성공 후 4번째 차단)
- `pkill -f`로 앱을 끄면 Bash 호출이 끊김(세션 19 기록 재발, exit 144) → Flatpak 앱은 `flatpak kill`
- 네트워크: support.google.com(Chrome·Gmail 도움말, curl 정적 HTML)·support.apple.com·raw.githubusercontent.com(PDF Arranger README·wiki)·pd12m S3·dl.flathub.org 가능. sejda.com은 WebFetch로 열림

**다음 할 일**

- Claude: 새 글 노출 검색어 확인 (`jpg to pdf free`, `jpg to pdf on mac`, `jpg to pdf windows 11`), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: PDF GUI 시리즈 남은 후보 — PDF→JPG(44번, Trends 13.0)·PDF 압축(36번). JPG→PDF 측정 절차는 tests/README "JPG→PDF(GUI) 측정 재현". 합치기·나누기·JPG→PDF 3편이 모였으므로 PDF 허브 글(`Best Free PDF Tools (Tested)` 등) 검토 (traffic-playbook 3번)
- (완료) 대시보드: README 절차대로 `stats` DB 7개 문서 갱신(버전 15·12 → 16·13). `ArtifactData` list·batch 모두 권한 분류기 거부 없음. 비로그인용 `data.js`는 정기 세션 규칙대로 건너뜀
- Claude: 발행 17편 / AdSense 신청 기준 20편

## 2026-10-18 · 세션 22 (정기 실행, 영향 뉴스 세션): Microsoft 365 Family 저장 공간 2TB 공유 전환

세션 시각: 2026-10-18 18:16 KST → 영향이 오래 가는 뉴스 칼럼 세션. 열린 PR 없음. 작업 브랜치를 `origin/main`(175324c)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-20 ~ 10-18, 세션 21 이후 바뀐 값만)**

- 노출 118 → **123**, 클릭 4, CTR 3.4% → 3.3%, 평균 순위 25.8 → 25.1
  - `turn-off-ai-in-chrome` 노출 59 → 61 (11.5) / `image-to-text-offline-free` 5 → 7 (7.9) / `gemini-gems-to-skills` 8 → 9 (8.0) / 나머지 변화 없음
  - 새 검색어 없음
- sitemap 마지막 다운로드 10-17 10:45 UTC 그대로. URL 검사 변화 없음: 8편 `URL is unknown`(세션 21의 7편 + `merge-pdf-files-free`), 7편 색인
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                               | 카테고리 | 유형             | 독창 요소 |
| ---------------------------------- | -------- | ---------------- | --------- |
| `microsoft-365-family-storage-2tb` | `news`   | 뉴스 칼럼 (영향) | 가구 인원별 총 용량 전후 그래프(대표 이미지), 구독 유형·갱신일별 전환 시점 계산(연간 5-01 갱신이면 2028-05-01까지 유지), 전환을 앞당기는 행동 2가지(Premium 업그레이드·만료 후 재구매), Microsoft 문서끼리의 차이(초과 시 3개월 동결·6개월 삭제 vs 최대 1년 접근), 자사 페이지끼리의 차이(OneDrive 페이지 "Up to 6 TB" vs 요금 페이지 "2 TB shared"), 6TB를 iCloud+로 옮길 때 연 $359.88 |

- 선정 근거 (최근 30일 발표, Google News RSS 기사 수): `"Microsoft 365 Family" storage` **38** · `"Microsoft 365" storage shared 2TB` 22 (10-08~13 ZDNET·Windows Central·TechRadar·The Verge 등). 자동완성 "microsoft 365 family storage" 31개(additional storage·onedrive storage·share storage·increase storage). 시행일: 새 구독 10-08, 기존 구독 2027-05-02 이후 첫 갱신, 기존 Pro 2027-11-01
- 제외·보류: Windows 11 24H2 Home·Pro 지원 종료(10-13, 이미 지남 → 일반 글 후보로 backlog 추가), Gemini 앱 Skills 배포(기존 글 갱신 대상), Edge 업데이트 방식(프로토타입·기업 기능), Canada 시간대 변경(미국 독자 아님), Marvel Unlimited 종료(분야 밖), 커스텀 GPT 12-11 종료(help.openai.com·openai.com 여전히 403)
- `Our take`: 기존 구독자 대부분은 유지하고 지금 사용량만 확인, 갱신 전 이메일 때 다시 판단(최소 6개월, 연간이면 최대 약 18개월 여유). 이미 합계 2TB 근처인 가구만 정리 필요. 근거: 6인 가구 67% 감소에 가격 동일, 다른 곳으로 6TB를 옮기면 iCloud+ 기준 연 $359.88. 반대 관점: 1TB를 채우는 사람은 적고, 1~2인은 오히려 이득
- 1차 출처: Microsoft Support "Changes to Microsoft 365 storage"·"Microsoft storage quotas"·"What is Microsoft cloud storage"(curl 정적 HTML), Microsoft 요금 비교·OneDrive 페이지(Playwright 렌더링), Apple 지원 108047(iCloud+ 요금). Microsoft 공식 발표 블로그는 찾지 못함 → 지원 문서 기준, AI 혜택 공유는 보도만 있고 요금 페이지가 "AI for subscription owner only"라 다루지 않음
- 이미지 2장 (직접 만든 그래픽 1200×675): 인원별 총 용량(`thumbnail`), 전환 시점 타임라인. 팔레트는 기존 글과 같은 파랑·주황
- 내부 링크: 새 글 → `compress-video-for-discord-email`·`windows-10-esu-extended`·`iphone-handoff-verizon-cost`. 기존 글 역링크는 맞는 문맥이 없어 추가하지 않음
- 빌드 HTML 확인: title 83자(접미사 포함, 본제목 71자)·description 159자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 7개, `<pre>`·`<code>` 0개, 본문 이미지 2장 width·height 지정, sitemap·RSS 포함
- lint·test(30파일 230개)·build 통과

**알게 된 것**

- support.microsoft.com 문서는 curl 정적 HTML로 본문 전체를 받을 수 있음. microsoft.com 요금·제품 페이지는 JS 로딩이라 Playwright 렌더링 필요(가격 텍스트 확인 가능). zdnet.com은 WebFetch 차단
- one.google.com/about/plans는 렌더링해도 요금 카드가 나오지 않음(15GB만) → Google One 요금은 이번 세션에서 확인 불가
- 같은 회사의 페이지끼리 표기가 엇갈리는 경우(제품 페이지 미갱신)는 칼럼의 독창 요소가 됨 (세션 18 Google 도움말 차이와 같은 방식)

**다음 할 일**

- Claude: Microsoft가 갱신 전 이메일 내용·보너스 저장 공간·추가 저장 공간 가격을 발표하거나 OneDrive 페이지 표기를 고치면 `microsoft-365-family-storage-2tb`에 반영하고 `updatedAt` 갱신
- Claude: 칼럼 발행 4주 후(11-15) H4 판정 자료: `gsc_report.py --compare /posts/microsoft-365-family-storage-2tb --changed 2026-10-18 --metric impressions --type discover`(웹은 `--type web`). H5 영향 칼럼 2편째(화제 2편: `iphone-duo-sold-out`·`iphone-handoff-verizon-cost`)
- Claude: 검증 기록 V1(11-11)·V2(11-12) 판정, Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`), Gemini 앱 Skills 배포(10-13 시작, 11월 중순 완료)·Workspace 연기를 `gemini-gems-to-skills`에 반영 검토
- (완료) 대시보드: README 절차대로 `stats` DB 7개 문서 갱신(버전 14·11 → 15·12). `ArtifactData` list·batch 모두 권한 분류기 거부 없음. 비로그인용 `data.js`는 정기 세션 규칙대로 건너뜀
- Claude: 발행 16편 / AdSense 신청 기준 20편

## 2026-10-18 · 세션 21 (정기 실행, 일반 세션): PDF 합치기 GUI 앱 3개 측정

세션 시각: 2026-10-18 12:15 KST → 일반 세션(`ai-tools`·`software`). 열린 PR 없음. 작업 브랜치를 `origin/main`(8d93123)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-20 ~ 10-18, 세션 20 이후 바뀐 값만)**

- 노출 114 → **118**, 클릭 4, CTR 3.5% → 3.4%, 평균 순위 25.3 → 25.8
  - `turn-off-ai-in-chrome` 노출 58 → 59 (11.7) / `transcribe-audio-offline-free` 23 → 25 (46.6) / `image-to-text-offline-free` 4 → 5 (8.4) / 나머지 변화 없음
  - 새 검색어 없음 (`offline transcription software` 2·`speech to text offline` 2 등 기존 검색어 노출 증가)
- sitemap 마지막 다운로드 10-17 10:45 UTC 그대로. URL 검사 변화 없음: 7편 `URL is unknown`(`compress-image-to-100kb`·`compress-video-for-discord-email`·`convert-heic-to-jpg-free`·`iphone-duo-sold-out`·`iphone-handoff-verizon-cost`·`pixel-watch-safety-signal-ending`·`split-pdf-free`), 7편 색인
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                   | 카테고리   | 유형                           | 직접 검증 |
| ---------------------- | ---------- | ------------------------------ | --------- |
| `merge-pdf-files-free` | `software` | 비교 + How-to (측정형, 검색형) | 보고서(책갈피 4·목차 링크 3)·IRS W-9(양식 23칸)·사진 2쪽 3파일을 **GUI 앱 3개로 직접 합침**: PDFsam Basic 6.0.6·PDF Arranger 1.14.0·Sejda PDF Desktop 7.9.10 무료판. 순서 바꾸기(W-9 먼저), 같은 양식 2부(이름 충돌, PDFsam 양식 옵션 3개), Sejda 무료 한도(64쪽·4번째 작업)까지 시험하고 Chrome 141 뷰어에서 입력 확인 |

- 선정 근거: 자동완성 "merge pdf" 28개(Google·Bing·YouTube: files free·free·offline·mac·free download). Trends(미국 3개월) `merge pdf` 6.3 · `combine pdf` 6.4 · `split pdf` 6.0 · 기준 `remove background` 35.5. backlog 45번(명령줄 글 삭제 후 GUI로 새로 쓸 후보) + 세션 19 다음 할 일 "PDF 글 GUI 시리즈"(나누기 글의 짝)
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음
- 차별점: 세 앱 모두 기본 조건(책갈피 파일 먼저)에서는 텍스트·사진·책갈피·링크·양식을 다 지킴 → 결과가 갈리는 조건을 찾음. (1) PDF Arranger는 책갈피 파일이 두 번째면 책갈피 0/4·링크 0/3(기본으로 켜진 "Preserve document information from the first file opened", 끄면 책갈피 4/4지만 링크 0/3), PDFsam은 4/4·3/3. (2) W-9 2부를 PDFsam "Merge fields"로 합치면 23칸 중 22칸 공유 → 첫 W-9에 입력한 글자가 두 번째에도 나타남(Chrome 캡처), 기본값은 독립. (3) Sejda 무료판은 64쪽 합치기를 "50 pages per merge"로 거부(횟수 미포함), 성공 3회 뒤 "3 tasks per day"로 거부(약 24시간 카운트다운). PDFsam은 64쪽도 제한 없음
- Mac 미리보기는 Apple 사용자 가이드 기반, 요약 표 "Not tested"
- 적용한 노하우: 검색형 제목 47자·설명 160자, 측정 규모 제목 표기 `(3 Apps Tested)`, 이미지 8장(대표 점검표 1200×675 + W-9 2부 입력 비교 + PDF Arranger 설정 + PDFsam 양식 옵션 + Sejda 한도 화면 + 앱 3개 합치기 화면), 요약 표 → 사실 확인표에 기록
- 내부 링크: 새 글 → `split-pdf-free`·`compress-video-for-discord-email`·`compress-image-to-100kb`·`image-to-text-offline-free` (4개). 역링크: `split-pdf-free` PDF Arranger 설정 문단에 1문장 추가 (`updatedAt` 변경 없음, V 기록 대상 아님)
- 빌드 HTML 확인: title 59자(접미사 포함)·description 160자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 10개, `<pre>`·`<code>` 0개, 본문 이미지 8장 width·height 지정, sitemap·RSS 포함
- lint·test(30파일 229개)·build 통과

**알게 된 것**

- Sejda PDF Desktop(Flathub `com.sejda.Sejda`, Electron)은 root에서 `--no-sandbox`를 붙여야 실행됨. 무료판 한도·업그레이드 문구가 앱 화면에 그대로 나와 1차 출처로 쓸 수 있음. sejda.com은 curl로는 프록시 차단(403 "Access blocked … VPN or proxy"), WebFetch로는 열림
- NAPS2는 Flathub에 없음(`flatpak search naps2` 결과 없음)
- PDFsam(JavaFX) 드롭다운은 펼친 목록을 클릭해도 선택이 안 될 때가 있음 → 드롭다운 클릭 후 방향키 + Enter. 확인 대화상자(Clear 등)가 떠 있으면 다음 클릭이 모두 무시되므로 화면 캡처로 확인
- 창 관리자 없는 Xvfb에서는 `xdotool windowminimize`가 동작하지 않음 → 겹친 창은 `windowmove`로 화면 밖으로 옮김
- 네트워크: pdfsam.org·raw.githubusercontent.com(README·wiki)·support.apple.com(curl 정적 HTML)·irs.gov·GitHub Releases(pdfsam v6.0.6)·dl.flathub.org 가능

**다음 할 일**

- Claude: 새 글 노출 검색어 확인 (`merge pdf files free`, `merge pdf offline`, `merge pdf on mac`), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: PDF GUI 시리즈 남은 후보 — JPG→PDF(43번)·PDF→JPG(44번)·PDF 압축(36번)을 GUI 앱(PDFsam·PDF Arranger·Sejda 무료판·Mac 미리보기·Windows 사진 앱 인쇄)으로 측정. 이번 세션 절차는 tests/README "PDF 합치기(GUI) 측정 재현". 3편이 모이면 PDF 허브 글 검토 (traffic-playbook 3번)
- (완료) 대시보드: README 절차대로 `stats` DB 7개 문서 갱신(버전 13·10 → 14·11). `ArtifactData` list·batch 모두 권한 분류기 거부 없음. 비로그인용 `data.js`는 정기 세션 규칙대로 건너뜀
- Claude: 발행 15편 / AdSense 신청 기준 20편

## 2026-10-18 · 세션 20 (정기 실행, 화제 뉴스 세션): iPhone Handoff 통신사 요금

세션 시각: 2026-10-18 06:16 KST → 화제 뉴스 칼럼 세션. 열린 PR 없음. 작업 브랜치를 `origin/main`(9efd2e0)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-19 ~ 10-17, 세션 19 이후 바뀐 값만)**

- 노출 109 → **114**, 클릭 4, CTR 3.7% → 3.5%, 평균 순위 24.9 → 25.3
  - `turn-off-ai-in-chrome` 노출 56 → 58 (11.8) / `check-if-image-is-ai-generated` 12 → 14 (74.6) / `transcribe-audio-offline-free` 22 → 23 (43.7) / 나머지 변화 없음
  - 검색어: `synthid checker` 4 → 5 (86.4), 새 검색어 `synthid check` 1 (84), `360converter offline transcriber` 1 (97)
- sitemap 마지막 다운로드 10-17 10:45 UTC 그대로. URL 검사 변화 없음: 6편 `URL is unknown`(`compress-image-to-100kb`·`compress-video-for-discord-email`·`convert-heic-to-jpg-free`·`iphone-duo-sold-out`·`pixel-watch-safety-signal-ending`·`split-pdf-free`), 7편 색인
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                          | 카테고리 | 유형             | 독창 요소 |
| ----------------------------- | -------- | ---------------- | --------- |
| `iphone-handoff-verizon-cost` | `news`   | 뉴스 칼럼 (화제) | 통신사별 12·24개월 누적 요금 그래프(대표 이미지)·표, 사용자 유형별 영향 표, 발표 일정 타임라인(미정 구간 점선), Apple 지원 통신사 목록(미국 T-Mobile만)과 Verizon 발표의 차이, eSIM을 지워도 요금이 계속될 수 있다는 Apple 문서 경고, iPad·Mac은 Handoff 없이 무료로 번호 사용 |

- 선정 근거 (최근 48시간 발표, Google News RSS 기사 수): `"iPhone Handoff"` **32**(10-16 Verizon $10 발표 기사) · `"One UI 9"` 30 · ChatGPT Chrome 확장 29 · Universal Cart 21 · App Store 가이드라인 12 · Gmail AI Inbox 8 · Pixel AI Pro 체험 7. Trends 7일: `iphone handoff` 0.3(최고 5) > `one ui 9` 0.2. 자동완성 "iphone handoff" 22개(verizon·att·setting·not working)
- 제외: Trends 급상승 RSS의 IT 주제는 `one ui 9`(200+)뿐이지만 공식 배포 발표가 09-16(Samsung Newsroom)이라 48시간 밖, 최근 기사는 기기별 배포·QuickStar 문제(Samsung 커뮤니티 403). Apple TV 4K·HomePod mini(10-13)·지진 경보·Windows Photos(10-15)는 48시간 밖. ChatGPT Chrome 확장은 openai.com 403
- `Our take`: 대부분은 돈 낼 필요 없음, Verizon $10은 매주 iPhone을 바꿔 쓰는 사람 아니면 정당화 어려움(근거: 번호를 옮길 뿐 한 번에 한 대만 활성, iPad·Mac은 무료로 번호 사용, Verizon은 포함 내용 미발표). 반대 관점: 두 번째 회선을 따로 내고 있다면 Handoff가 대체해 더 쌀 수 있음
- 1차 출처: Verizon 발표(10-16), T-Mobile Newsroom(09-10)·FAQ, Apple 지원 문서 127274(09-09)·108758, Apple Newsroom(10-15, 리스 $57.99). 모두 curl 정적 HTML로 본문 확인
- 이미지 2장 (직접 만든 그래픽 1200×675): 통신사별 누적 요금(`thumbnail`), 일정 타임라인. 팔레트는 기존 글과 같은 파랑·주황
- 내부 링크: 새 글 → `iphone-duo-sold-out`·`pixel-watch-safety-signal-ending`. 역링크: `iphone-duo-sold-out` eSIM 문단에 1문장 추가 (`updatedAt` 변경 없음)
- 빌드 HTML 확인: title 78자(접미사 포함, 본제목 66자)·description 160자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 7개, `<pre>`·`<code>` 0개, 본문 이미지 2장 width·height 지정, sitemap·RSS 포함
- lint·test(30파일 229개)·build 통과

**알게 된 것**

- verizon.com/about/news·t-mobile.com(뉴스룸·기기 페이지 FAQ)·support.apple.com 문서는 curl 정적 HTML로 본문을 받을 수 있음. news.samsung.com은 페이지 직접 접속 실패(000), RSS(`/global/feed`)는 가능. us.community.samsung.com 403
- Python `urllib`로 여러 RSS를 연속으로 받으면 멈춤(프록시 연결 대기) → 뉴스 RSS는 `curl -m 25`로 받고 파싱만 Python으로
- Google News RSS 토픽(TECHNOLOGY) 피드는 빈 응답 → 검색 RSS(`when:2d`)와 매체 RSS로 대체

**다음 할 일**

- Claude: Verizon이 Handoff 시작일·포함 조건을 발표하거나 AT&T가 지원을 발표하면 `iphone-handoff-verizon-cost`에 반영하고 `updatedAt` 갱신 (Apple 지원 문서 127274 통신사 목록도 확인)
- Claude: 칼럼 발행 4주 후(11-15) H4 판정 자료: `gsc_report.py --compare /posts/iphone-handoff-verizon-cost --changed 2026-10-17 --metric impressions --type discover`(웹은 `--type web`). H5 화제 칼럼 2편째
- Claude: 검증 기록 V1(11-11)·V2(11-12) 판정, Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- (완료) 대시보드: README 절차대로 `stats` DB 7개 문서 갱신(버전 12·9 → 13·10). `ArtifactData` list·batch 모두 권한 분류기 거부 없음. 비로그인용 `data.js`는 정기 세션 규칙대로 건너뜀
- Claude: 발행 14편 / AdSense 신청 기준 20편

## 2026-10-18 · 세션 19 (정기 실행, 일반 세션): PDF 나누기 GUI 3가지 측정

세션 시각: 2026-10-18 00:15 KST → 일반 세션(`ai-tools`·`software`). 열린 PR 없음. 작업 브랜치를 `origin/main`(f4c758e)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-19 ~ 10-17, 세션 18 이후 바뀐 값만)**

- 노출 106 → **109**, 클릭 4, CTR 3.8% → 3.7%, 평균 순위 24.6 → 24.9
  - `turn-off-ai-in-chrome` 노출 54 → 56 (12.1) / `check-if-image-is-ai-generated` 11 → 12 (73.7) / 나머지 글 변화 없음
  - 검색어: `synthid checker` 3 → 4 (89.0)
- **sitemap 마지막 다운로드 10-15 03:42 → 10-17 10:45 UTC** (이틀 만에 다시 읽음). URL 검사 변화 없음: 4편 `URL is unknown`(`compress-image-to-100kb`·`compress-video-for-discord-email`·`convert-heic-to-jpg-free`·`iphone-duo-sold-out`) + `pixel-watch-safety-signal-ending`(10-17 발행) 미색인, 나머지 7편 색인
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug             | 카테고리   | 유형                                   | 직접 검증 |
| ---------------- | ---------- | -------------------------------------- | --------- |
| `split-pdf-free` | `software` | 비교 + How-to (측정형, 검색형)          | 12쪽 PDF(직접 만든 보고서 4쪽: 책갈피 4·목차 링크 3·외부 링크 1 + IRS W-9 6쪽: 양식 23칸·1번 칸 입력 + CC0 사진 2쪽)를 **GUI 3가지로 직접 조작**해 나눔: PDFsam Basic 6.0.6(Extract·Split Every page·Split by size), PDF Arranger 1.14.0(Export Selection·Export All Pages), Chromium 141 인쇄 → Save as PDF(Custom 쪽 범위). 결과마다 쪽별 텍스트·사진 바이트·책갈피·링크·양식 칸을 점검하고 Chrome 뷰어에서 양식 입력 시험 |

- 선정 근거: Trends(미국 3개월, 이번 세션은 429 없이 응답) `merge pdf` 23.5 · **`split pdf` 22.6** · `png to jpg` 14.4 · `webp to jpg` 6.6. 자동완성 "split pdf" 25개 이상(free·into individual pages·online·pages, by size·into multiple pdfs). backlog 46번(합치기 글의 짝, GUI 앱·내장 기능으로 측정하기로 한 후보)
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음
- 차별점: 나누기는 "무손실"이라 차이가 없어 보이지만 결과 파일의 **동작**이 다름 → Chrome Save as PDF는 텍스트·사진은 그대로지만 **W-9 양식을 평면화**(입력 불가)하고 책갈피 0/4·목차 링크 0/3. PDF Arranger는 양식·링크를 지키지만 **W-9만 내보낸 파일에 보고서 책갈피 4개가 남음**(Chrome에서 눌러도 이동 없음, 사용자 설명서의 "Preserve document information from the first file opened" 설정과 일치). PDFsam Basic은 모두 유지. PDFsam Split by size 1MB는 한 쪽이 한도보다 크면 그 쪽이 한도를 넘는 파일로 남음(사진 쪽 1.19·1.28MB)
- Mac 미리보기는 macOS를 실행할 수 없어 Apple 사용자 가이드 기반으로만 쓰고 요약 표에 "Not tested" 표기
- 적용한 노하우: 검색형 제목 57자·설명 154자, 측정 규모 제목 표기 `(3 Ways Tested)`, 이미지 7장(대표 점검표 1200×675 + Chrome 양식 입력 비교 + PDF Arranger 남은 책갈피 + PDFsam Extract·Split by size 화면 + PDF Arranger Export 메뉴 + Chrome 인쇄 미리 보기), 요약 표 → 사실 확인표에 기록
- 내부 링크: 새 글 → `compress-video-for-discord-email`(Gmail 25MB)·`compress-image-to-100kb`·`image-to-text-offline-free`·`convert-heic-to-jpg-free` (4개). 역링크: `image-to-text-offline-free` NAPS2 문단에 1문장 추가 (`updatedAt` 변경 없음, V 기록 대상 아님)
- 빌드 HTML 확인: title 69자(접미사 포함)·description 154자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 10개, `<pre>`·`<code>` 0개, 본문 이미지 7장 width·height 지정, sitemap·RSS 포함
- lint·test(30파일 229개)·build 통과

**알게 된 것**

- PDFsam Basic(JavaFX)도 Xvfb + xdotool로 조작 가능. 파일 선택은 GTK 대화상자에 경로를 바로 입력(`xdotool type --window`)하면 되고, 입력 칸은 창 포커스를 준 뒤(`windowfocus --sync`) 입력해야 들어감. 크롬 창이 함께 떠 있으면 포커스를 가져가 입력이 빠짐
- PDF Arranger Flatpak(1.14.0)은 `flatpak run`에 시스템 D-Bus(`dbus-daemon --system --fork`)와 세션 D-Bus(`dbus-run-session`)가 필요하고, 저장은 문서 포털(FUSE)을 거치므로 `XDG_RUNTIME_DIR=/run/user/0`을 지정해야 함 (없으면 `/root/.cache/doc/...` 없음 오류). Ubuntu apt 판은 1.10.1로 오래됨
- Chromium 인쇄 미리 보기는 Xvfb 창 모드(`--no-sandbox`)에서 열리고, "Pages" 드롭다운은 클릭으로 펼친 목록이 화면 캡처에 안 잡힐 때가 있어 포커스 후 방향키(↓×3 = Custom)가 확실함. "Print as image" 체크 상자를 잘못 누르지 않게 주의 (측정 중 한 번 눌려 다시 해제)
- `pgrep -f`/`pkill -f`에 앱 이름을 쓰면 같은 문자열을 가진 셸 명령까지 죽어 Bash 호출이 끊김(exit 144) → `pgrep -x`나 `flatpak kill` 사용
- 네트워크: pdfsam.org(다운로드 페이지)·GitHub Releases(pdfsam v6.0.6)·dl.flathub.org·flathub.org API·raw.githubusercontent.com(README·wiki)·irs.gov·support.apple.com(Playwright 렌더링)·support.google.com(렌더링) 가능. github.com 저장소·archive 소스 zip은 403

**다음 할 일**

- Claude: 새 글 노출 검색어 확인 (`split pdf free`, `split pdf into individual pages`, `split pdf by size`), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: PDF 글 GUI 시리즈 후보 — 삭제한 PDF 합치기·JPG→PDF·PDF→JPG를 PDFsam Basic·PDF Arranger·Mac 미리보기·Chrome으로 다시 측정 가능 (이번 세션 설치·조작 절차 재사용: tests/README "PDF 나누기(GUI) 측정 재현")
- (완료) 대시보드: README 절차대로 `stats` DB 7개 문서 갱신(버전 11·8 → 12·9). 이번 세션은 `ArtifactData` list·batch 모두 권한 분류기 거부 없음. 비로그인용 `data.js`는 정기 세션 규칙대로 건너뜀
- Claude: 발행 13편 / AdSense 신청 기준 20편

## 2026-10-17 · 세션 18 (정기 실행, 영향 뉴스 세션): Pixel Watch Safety Signal 종료

세션 시각: 2026-10-17 18:09 KST → 영향이 오래 가는 뉴스 칼럼 세션. 열린 PR 없음. 작업 브랜치가 `origin/main`(9a6a674)과 같아 그대로 시작.

**지표 (`gsc_report.py`, 2026-09-19 ~ 10-17, 세션 17 이후 바뀐 값만)**

- 노출 103 → **106**, 클릭 4, CTR 3.9% → 3.8%, 평균 순위 25.0 → 24.6
  - `turn-off-ai-in-chrome` 노출 52 → 54 (12.4) / `image-to-text-offline-free` 3 → 4 (10.0) / 나머지 글 변화 없음
  - 새 검색어: `optguideondevicemodel disable` 1 (3위, Chrome 글)
- sitemap 마지막 다운로드 10-15 03:42 UTC 그대로. URL 검사: `iphone-duo-sold-out` 포함 4편 `URL is unknown`(`compress-image-to-100kb`·`compress-video-for-discord-email`·`convert-heic-to-jpg-free`·`iphone-duo-sold-out`), 나머지 7편 색인
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                               | 카테고리 | 유형             | 독창 요소 |
| ---------------------------------- | -------- | ---------------- | --------- |
| `pixel-watch-safety-signal-ending` | `news`   | 뉴스 칼럼 (영향) | 연결 상황별 전후 비교 표(대표 이미지), Google 문서끼리의 차이 지적(공지 "Wi-Fi에서 계속 작동" vs 도움말 "LTE 워치는 휴대폰 없이 긴급 통화하려면 LTE 연결 필요"), 사용자 유형별 영향 표, 종료 타임라인(확정/추정 구분), Fi 2년 무료 데이터는 통화 미포함 |

- 선정 근거 (최근 30일, Google News RSS 기사 수): `"Safety Signal" "Pixel Watch"` 24. 마감일 2026-12-12, 발표 10-08. 공식 1차 출처(Google 커뮤니티 관리자 공지·도움말 4건)를 Playwright 렌더링으로 직접 확인. 자동완성 "pixel watch safety signal" 11개, "pixel watch lte" 22개(lte plan·without phone·vs wifi)
- 제외·보류: **커스텀 GPT 12-11 종료**(마감일 가장 가깝고 backlog 점수 최고지만 help.openai.com·openai.com·chatgpt.com 모두 403 → 1차 출처 미확인으로 보류), Fitbit 앱 종료(기사 100+지만 마감일 없음), Android Auto Android 10 종료(66건, "could soon" 추정 보도), Google Messages SMS 토글(APK 분석 = 루머), OneDrive iOS 18(공식 날짜 없음)
- `Our take`: 혼자 있는 시간이 많은 착용자(부모님 등)는 12-12 전에 워치 회선 추가, Wi-Fi만 믿지 않음(Google 도움말 근거). Fi 사용자는 무료. 반대 관점: 대부분은 휴대폰을 지니고 다니고, 2개 모델·4개국·유료 구독자만 해당이라 월 요금을 안 내는 선택도 합리적
- 이미지 2장 (직접 만든 그래픽 1200×675): 연결 상황별 전후 표(`thumbnail`), 종료 타임라인. 팔레트는 기존 글과 같은 파랑·주황
- 내부 링크: 새 글 → `windows-10-esu-extended`·`iphone-duo-sold-out` (관련 주제 기존 글 없음). 기존 글에서 새 글로 가는 역링크는 맞는 문맥이 없어 추가하지 않음 (카테고리·홈·관련 글 목록으로만 연결)
- 빌드 HTML 확인: title 77자(접미사 포함, 본제목 65자)·description 159자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 7개, 본문 이미지 2장 width·height 지정, 코드 블록 0개, sitemap·RSS 포함
- lint·test(30파일 229개)·build 통과

**알게 된 것**

- support.google.com 도움말·커뮤니티 글은 curl로는 본문이 비어 있음(JS 로딩) → Playwright(Python, `/opt/pw-browsers/chromium-1194`)로 렌더링하면 본문·관련 글 링크까지 받을 수 있음. 도움말 검색 결과 페이지(`/search?q=`)도 렌더링으로 열려 관련 문서 ID 찾기에 유용
- store.google.com 상품 페이지는 렌더링으로 가격 텍스트를 받을 수 있음. 통신사 요금 페이지는 Verizon 워치 목록(기기 할부)만 열리고 T-Mobile·AT&T 요금 페이지는 실패 → 통신사 회선 요금은 이번 세션에서 확인 불가
- droid-life.com·9to5google.com 본문은 curl로 열림, androidauthority.com은 Cloudflare 차단

**다음 할 일**

- Claude: 11월 중순 이메일 통지 이후나 12-12 전후로 Google이 일정 변경·보상을 발표하면 `pixel-watch-safety-signal-ending`에 반영하고 `updatedAt` 갱신
- Claude: 칼럼 발행 4주 후(11-14) H4 판정 자료: `gsc_report.py --compare /posts/pixel-watch-safety-signal-ending --changed 2026-10-17 --metric impressions --type discover`(웹은 `--type web`). H5 비교용 영향 칼럼 1편째(화제 1편: `iphone-duo-sold-out`)
- Claude: 커스텀 GPT 종료(12-11)는 help.openai.com 접근이 되면 최우선 영향 칼럼 후보. 계속 403이면 사용자에게 허용 도메인 추가 여부 확인 필요 (사용자 결정 사항: 네트워크 설정)
- 대시보드: README 절차 1단계 `ArtifactData list`(stats)가 권한 분류기에 거부됨(Data Exfiltration) → 이번 세션 갱신 못 함. 다음 세션에서 다시 시도, 계속 막히면 사용자가 대화형 세션에서 갱신하거나 정기 세션 허용 여부 결정 필요
- Claude: 발행 12편 / AdSense 신청 기준 20편

## 2026-10-17 · 세션 17 (사용자 요청): 첫 뉴스 칼럼 — iPhone Duo 매진·결제 방식별 비용

세션 시각: 2026-10-17 13:20 KST (일반 세션 시각대지만 사용자가 "화제성 높은 주제"를 요청해 화제 뉴스 칼럼으로 작성). 열린 PR 없음. 작업 브랜치가 main보다 뒤처져 있어 `origin/main`에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-19 ~ 10-17, 세션 16 이후 바뀐 값만)**

- 노출 85 → **103**, 클릭 4, CTR 4.7% → 3.9%, 평균 순위 20.6 → 25.0
  - `turn-off-ai-in-chrome` 노출 52 (12.7) / `transcribe-audio-offline-free` 22 (45.5) / `gemini-gems-to-skills` 8 (7.8) / `image-to-text-offline-free` 3 (5.3) / 홈 3 (5.7) / `about` 2
  - 새 검색어: `google ai gone` 1 (3), `turn off ai` 2 (57.5), `gems to skills` 1 (10), `synthid checker` 3 (88.7)
- sitemap 마지막 다운로드 10-15 03:42 UTC 그대로. URL 검사: 남은 10편 중 7편 색인, `compress-image-to-100kb`·`compress-video-for-discord-email`·`convert-heic-to-jpg-free` 3편 `URL is unknown`
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12)

**발행한 글**

| slug                  | 카테고리 | 유형              | 독창 요소                                                                                                                             |
| --------------------- | -------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `iphone-duo-sold-out` | `news`   | 뉴스 칼럼 (화제)  | 결제 방식별 24개월 비용 계산(일시불·ACMI·Apple Upgrade 리스 반납/인수·12개월 리스·통신사) + 그래프, 사용자 유형별 영향 표, 일정 타임라인(공식/보도 구분), 리스 약관 함정 정리 |

- 선정 근거 (최근 48시간 발표, Google News RSS 기사 수, 100 = 100건 이상): `"iPhone Duo"` **100+** · `"Gemini 4"` 73(10-13 발표라 48시간 밖) · Apple TV 4K 71 · Windows 11 10월 기능 54 · Google Universal Cart 49 · AI Mode 37 · Windows Photos 28 · Gmail AI Inbox 7. Trends 7일(미국): `iphone duo` 평균 8.0·최고 67 vs `chatgpt` 69.9, `windows 11 update`·`universal cart` 0.0. 자동완성 "iphone duo" 38개(sold out·delivery date·pre order·price). Trends 급상승 RSS 10개는 연예·스포츠
- 각도: 배송 지연 소식 자체가 아니라 "기다리는 동안 무엇을 결정해야 하나" → 결제 방식(새 Klarna 리스 Apple Upgrade)의 실제 비용과 약관. 핵심 계산: 24개월 리스 $57.99×24 = $1,391.76(가격의 69.6%, iPhone 18 Pro도 70.0%), 인수 $607.24 → 리스+인수 = 정가 $1,999 = ACMI와 같음 (ACMI는 3% Daily Cash $59.97만큼 유리)
- `Our take`: 2년 안에 바꿀 사람에게는 리스가 낫다(인수 시 ACMI와 총액 동일 + 1세대 폴더블의 중고 가치 위험을 넘김). 반대 관점: Apple Card ACMI의 3% Daily Cash·소유권·Klarna 카드 제한 없음
- 1차 출처: Apple 보도자료(09-09·10-15), 스토어·사양·Apple Upgrade·ACMI(support 102730)·AppleCare·주문 취소·반품 정책 페이지. 배송 예정일(1월 25일, 일부 1월 29일)과 Apple 성명(CNBC)은 9to5Mac 본문(WebFetch)으로 확인해 "reported"로 표기. CNBC(매장 재고 미공개)·MacRumors($5,000 재판매)는 헤드라인만 확인 → 출처 표기
- 이미지 2장 (직접 만든 그래픽, 1200×675): 결제 방식별 비용 그래프(대표 이미지, `thumbnail`), 발표~배송 타임라인. 팔레트는 기존 글과 같은 파랑·주황 (dataviz 검증 스크립트 통과)
- 내부 링크: 새 글 → `convert-heic-to-jpg-free`(HEIF 사진)·`check-if-image-is-ai-generated`(Apple의 SynthID 지원 예정). 역링크: `check-if-image-is-ai-generated` SynthID 섹션에 Apple 지원 예정 1문장 + 링크 (`updatedAt` 변경 없음)
- 빌드 HTML 확인: title 73자(접미사 포함)·description 159자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 6개, og:image 생성, 본문 이미지 2장 width·height 지정, `news` 카테고리 페이지·sitemap·RSS에 노출. 모바일(390px)·데스크톱 가로 스크롤 없음

**알게 된 것**

- Apple Store 배송 예정일 API(`/shop/fulfillment-messages`)는 curl·Playwright 브라우저 세션 모두 HTTP 541 → 배송 예정일은 직접 확인 불가, 보도 기반으로만 씀. apple.com 보도자료·스토어·사양·도움말 페이지 본문은 정적 HTML로 받을 수 있음 (AppleCare 요금·보상 판매 금액·수리비는 동적 로딩이라 불가)
- 9to5mac.com(RSS·WebFetch 본문)·appleinsider.com(RSS 요약만, 본문 403)·Google News RSS 접속 가능. 뉴스 칼럼의 "reported" 확인에는 9to5Mac 본문이 가장 쓸 만함
- 화제 판단에 Google News RSS 기사 수는 100건에서 잘림 → 100+ 후보끼리는 Trends 7일 상대값으로 구분

**다음 할 일**

- Claude: 10-23(첫 배송·매장 재고)·10-30(28개국 출시) 이후 배송 예정일·매장 판매 변화가 있으면 같은 글에 반영하고 `updatedAt` 갱신 (뉴스 칼럼 후속 갱신 규칙)
- Claude: 칼럼 발행 4주 후(11-14) H4 판정 자료: `gsc_report.py --compare /posts/iphone-duo-sold-out --changed 2026-10-17 --metric impressions --type discover`(웹은 `--type web`)
- (완료) 대시보드: 사용자 결정(2026-10-17) "루틴 규칙 그대로" → README 절차대로 `stats` DB 7개 문서 갱신(버전 11·8). 대화형 세션이라 4단계 비로그인 열람용 `data.js` 스냅숏도 재게시(아티팩트 버전 17, 이전 스냅숏은 10-15 세션 8 기준). 이번 세션은 `ArtifactData` 읽기·쓰기 모두 권한 분류기 거부 없음
- PR #204 머지(04:41 UTC) → 배포·IndexNow 자동 제출 대상
- Claude: 발행 11편 / AdSense 신청 기준 20편

## 2026-10-17 · 명령줄 글 정리: 8편 삭제 + 남은 글의 명령줄 내용 제거 (사용자 요청)

- 사용자 결정: 명령줄 방법은 비개발자가 이해할 수 없으므로 쓰지 않음. 명령줄을 첫 답으로 권한 8편은 재작성하지 않고 **삭제**, 남은 글의 명령줄 섹션도 지금 제거
- 삭제(8편, 측정 자료는 `tests/{slug}/`에 보관): `pdf-to-jpg-high-quality`·`merge-pdf-files-free-offline`·`jpg-to-pdf-free-offline`·`compress-pdf-offline-free`·`convert-pdf-to-word-offline-free`·`remove-background-from-image-free-offline`·`video-to-gif-high-quality-free`·`free-offline-text-to-speech`. 7편은 미색인(`URL is unknown`), 색인된 글은 TTS 1편. 삭제 URL은 배포 후 IndexNow 워크플로우가 자동 제출. backlog에는 "GUI 앱·내장 기능으로 새로 쓸 후보"로 남김
- 남은 글 수정 (모두 `updatedAt: 2026-10-17`, 사실 확인표에 변경 기록)
  - `turn-off-ai-in-chrome`: Windows 정책을 명령 프롬프트 대신 레지스트리 편집기 화면 단계로(같은 키·값), Mac 정책(터미널) 섹션 삭제. 레지스트리 편집기 메뉴 이름은 Microsoft 문서 기준, Windows PC에서 직접 실행하지는 못함
  - `compress-image-to-100kb`: 명령줄 섹션·jpegoptim·cwebp 비교 삭제, 그래프 2장 다시 그림 (측정값 그대로, ImageMagick은 측정 도구로만 표기)
  - `compress-video-for-discord-email`: FFmpeg 섹션·표 행 삭제, 제목 "(14 Settings Tested)" → "(7 Settings Tested)", 그래프 다시 그림, FFmpeg 비교 그래프 1장 삭제 → 이미지 4장(측정 글 목표 5장 미달)
  - `convert-heic-to-jpg-free`: ImageMagick 섹션·행 삭제, 제목 "(3 Tools Tested)" → "(2 Tools Tested)", 그래프 다시 그림. 색 비교 이미지의 "프로필 유지" 쪽은 ImageMagick 결과물이라 도구명·ΔE 수치를 지우고 예시로만 둠
  - `image-to-text-offline-free`: 측정한 OCR 엔진 4개가 모두 명령줄 도구라 측정 내용 전부 삭제 → 2,014단어 → 570단어, 이미지 0장. 제목 "Image to Text Offline for Free on Windows and Mac". 남은 내용은 Snipping Tool·PowerToys·Live Text·NAPS2 (모두 문서 기반)
  - 허브 `free-offline-ai-tools`: TTS·배경 제거·Ollama(터미널) 섹션 삭제, "five" → "three" jobs, 메모리 그래프 다시 그림 → 이미지 4장
  - `transcribe-audio-offline-free`·`check-if-image-is-ai-generated`: 삭제된 글 링크 정리
- 문서: README 세션 워크플로우의 재작성 항목 삭제, backlog 상태, tests/README 삭제 표시, traffic-playbook 예시·V1(대상 2편 삭제)·V2(허브 변경이 판단 기간에 겹침), writing-guide 예시, 정기 실행 프롬프트에서 재작성 단계 삭제
- 검증 기록에 행을 추가하지 않음: 규칙 준수용 삭제·정리라 성과 개선 실험이 아님. 단 제목이 바뀐 3편(영상 압축·HEIC·OCR)은 이후 CTR·노출 비교 때 2026-10-17 변경을 감안

**다음 할 일**

- Claude (일반 세션): `image-to-text-offline-free`는 측정 없는 570단어 글이 됨 → 내장 기능(Snipping Tool·Live Text)과 GUI 앱(NAPS2 등)을 직접 확인할 수 있으면 보강, 어려우면 사용자에게 유지·삭제 확인
- Claude: 삭제한 주제(PDF 합치기·PDF→JPG·JPG→PDF·PDF 압축·PDF→Word·배경 제거·영상→GIF·TTS)는 수요가 확인된 주제이므로, GUI 앱·OS 내장 기능으로 직접 검증할 수 있을 때 새 글로 다시 씀 (backlog 해당 행)
- 다른 글에서 링크되지 않는 글: `compress-image-to-100kb`·`windows-10-esu-extended` → 다음 관련 글 작성 때 연결

## 2026-10-17 · 규칙 변경: 뉴스 칼럼 카테고리 + 정기 실행 하루 4회 (사용자 요청)

- 사용자 결정: 화제성 높은 뉴스도 다룸. 소식 전달·카피캣이 아니라, 독자(비개발자)에게 미칠 영향을 분석하고 ToolProof의 견해를 담는 칼럼. 카테고리 `news`("News & Analysis")
- 정기 실행: 하루 4회 6시간 간격(한국 시간 00·06·12·18시), 세션마다 1편. 06시 화제 뉴스 칼럼, 18시 영향이 오래 가는 뉴스 칼럼, 00·12시 일반 글(`ai-tools`·`software`). 세션 유형은 시작 시각으로 판단, 기준을 통과하는 뉴스가 없으면 다른 뉴스 유형 → 일반 글 순으로 대체
- ~~기존 명령줄 글 8편 재작성은 일반 세션(00·12시)에서만 함~~ → 취소 (위 '명령줄 글 정리' 기록: 8편 삭제)
- 반영: `src/core/config` 카테고리 `news` 추가 (글 0개 카테고리는 헤더·사이트맵·카테고리 페이지에서 자동 숨김이라 첫 칼럼 발행 전에는 노출 없음), [README.md](README.md) 결정사항·콘텐츠 구성·뉴스 칼럼 선정 기준·발행 속도·세션 워크플로우·가설 H4·H5·인프라 상태, [writing-guide.md](writing-guide.md) 뉴스 칼럼 유형·구성·`Our take` 규칙·이미지·체크리스트, [backlog.md](backlog.md) 뉴스 칼럼 후보 섹션
- 근거(해석): 신규 도메인은 뉴스 검색 순위를 잡기 어렵고 색인도 느림(10-16 기준 16편 중 8편 색인) → 피드형(Discover) 채널과 영향이 오래 가는 뉴스로 보완. 화제 vs 영향 뉴스 성과는 H5로 비교

## 2026-10-17 · 규칙 변경: 비개발자 독자 기준 (사용자 요청)

- 사용자 결정: 블로그 독자는 비개발자. **비개발자가 이해·사용할 수 없는 방법(명령줄·코드·개발 도구)은 쓰지 않음** ("고급 사용자용" 섹션으로도 넣지 않음)
- 배경: 발행 18편 중 8편이 첫 답으로 명령줄 도구·Python 라이브러리를 권함 (`pdf-to-jpg-high-quality`·`merge-pdf-files-free-offline`·`jpg-to-pdf-free-offline`·`compress-pdf-offline-free`·`convert-pdf-to-word-offline-free`·`remove-background-from-image-free-offline`·`video-to-gif-high-quality-free`·`free-offline-text-to-speech`). 원인: 컨테이너에서 측정하기 쉬운 명령줄 도구가 비교 대상이 되고, 측정 1위가 그대로 첫 답이 됨. 반대로 GUI 앱을 Xvfb로 측정한 `convert-heic-to-jpg-free`, OS 내장 기능부터 안내한 `image-to-text-offline-free`는 비개발자가 따라 할 수 있음
- 반영: [README.md](README.md) 결정사항(독자)·주제 선정 기준 0번(필수 조건)·5번(직접 검증 = 독자가 쓸 방법을 실행), [writing-guide.md](writing-guide.md) 독자 규칙·도입 순서·비교 대상·측정 보조 도구·이미지·체크리스트, [backlog.md](backlog.md) 제외 기준·직접 검증 정의·19번(제외)·41번·46번(GUI 앱·내장 기능으로 각도 변경)
- ~~기존 8편은 정기 세션에서 1편씩 다시 씀~~ → 취소, 8편 삭제 (위 '명령줄 글 정리' 기록)

## 2026-10-16 · 세션 16 (정기 실행 15회차): PDF 합치기

세션 시각: 2026-10-16 21:10 UTC 무렵 (한국 10-17 06:10). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-18 ~ 10-16, 세션 15 이후 바뀐 값만)**

- 노출 74 → **85**, 클릭 4, CTR 5.4% → 4.7%, 평균 순위 20.6
  - `turn-off-ai-in-chrome` 노출 46 (10.0) / `transcribe-audio-offline-free` 14 (28.6) / `check-if-image-is-ai-generated` 11 (72.2) / `gemini-gems-to-skills` 6 (7.2) / `free-offline-text-to-speech` 3 (10.7) / `image-to-text-offline-free` **첫 노출** 1 (3.0)
  - 새 검색어: `chrome disable ai` 1 (7), `toolproof` 1 (5), `synthid detector` 4 (125.5)
- sitemap 마지막 다운로드 10-15 03:42 UTC 그대로. URL 검사 변화 없음 → 17편 중 8편 색인 (미색인 9편 모두 `URL is unknown`, `pdf-to-jpg-high-quality` 포함)
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                           | 카테고리   | 유형                           | 직접 검증                                                                                                   |
| ------------------------------ | ---------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `merge-pdf-files-free-offline` | `software` | 비교 + How-to (측정형, 검색형) | 5개 PDF 21쪽(직접 만든 책갈피·목차 링크 보고서 2개 + 이름을 다르게 채운 IRS W-9 2부 + CC0 사진 3쪽)을 qpdf 12.4.2·pdfunite(Poppler 26.10.0)·Ghostscript 10.08.0·pdftk-java 3.3.3·pypdf 6.21.0·PyMuPDF 1.28.2 기본 명령으로 합침 + 변형 2개(qpdf 첫 파일 기본 입력, pypdf `add_form_topname`). 책갈피·목차 링크·양식 분리·사진 픽셀·쪽별 텍스트·시간·메모리 측정, **Chrome 141 PDF 뷰어에서 링크 클릭·책갈피 패널·양식 입력을 직접 조작** |

- 선정 근거: Trends(미국 3개월, 429 3회 재시도 후 응답, 기준 `remove background` 35.1): `merge pdf` **6.3** · `png to jpg` 3.9 · `webp to jpg` 1.9 · `upscale image` 1.3. 자동완성 "merge pdf" 28개(offline·free download·mac·iphone), "combine pdf" 24개(preview on mac·microsoft edge). 백로그 45번이 "측정 차별점 약함"이었으나 책갈피·링크·양식 보존으로 각도를 잡음. 파일 변환 시리즈 9번째
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Trends 미국 급상승 10개: 연예·스포츠·날씨·"tesla autopilot"(뉴스) → IT 도구 주제 없음
- 차별점: 기본 명령으로 책갈피 8개·목차 링크 6개·양식 분리·사진 4항목을 모두 지킨 도구는 **pdftk뿐**. qpdf·pdfunite는 링크를 남기지만 이름 목적지(`/Dests`)를 빼서 클릭해도 그대로, PyMuPDF는 문서 안 링크를 삭제. **같은 W-9 2부를 합치면 pypdf·pdfunite 결과에서 4쪽에 입력한 값이 10쪽에도 들어감**(Chrome에서 직접 확인). Ghostscript는 양식 평면화
- 적용한 노하우: 검색형 제목 48자·설명 155자, 측정 규모 제목 표기, 이미지 6장(대표 점검표 1200×675 + Chrome 양식 입력·책갈피·링크 클릭·평면화 캡처 4장 + 속도·메모리 그래프), 요약 표 → 사실 확인표에 기록
- 내부 링크: 새 글 → JPG→PDF·PDF→Word·PDF 압축·OCR·PDF→JPG (5개). `compress-pdf-offline-free` 마지막 문단에서 새 글로 역링크 1개 (V 기록 대상 아님)
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 12개, og:image 생성, 본문 이미지 6장 모두 width·height 지정

**측정값 (Xeon 2.1GHz 4코어, RAM 16GB, 입력 5.6MB, 시간은 3회 중앙값, 프로그램 시작 포함)**

| 도구 (기본 명령)          | 책갈피 | 목차 링크 | W-9 2부 양식                 | 사진 픽셀 | 시간 · 최대 RAM |
| ------------------------- | ------ | --------- | ---------------------------- | --------- | --------------- |
| pdftk-java 3.3.3          | 8/8    | 6/6       | 분리 (`1.` 접두사)           | 3/3       | 0.61초 · 87MB   |
| pypdf 6.21.0              | 8/8    | 6/6       | **연결됨** (같은 이름)       | 3/3       | 0.24초 · 42MB   |
| Ghostscript 10.08.0       | 8/8    | 6/6       | 평면화 (입력 불가)           | 3/3       | 0.50초 · 30MB   |
| qpdf 12.4.2               | 0/8    | 0/6       | 분리 (`+1`)                  | 3/3       | 0.06초 · 22MB   |
| pdfunite (Poppler 26.10)  | 0/8    | 0/6       | **연결됨**, AcroForm 삭제    | 3/3       | 0.16초 · 11MB   |
| PyMuPDF 1.28.2            | 0/8    | 0/6 (삭제) | 분리 (`[215]`)              | 3/3       | 0.16초 · 58MB   |
| qpdf 첫 파일 기본 입력    | 4/8    | 3/6       | 분리                         | 3/3       | 0.05초          |
| pypdf + `add_form_topname`| 8/8    | 6/6       | 분리                         | 3/3       | 0.23초          |

- 외부 링크 2개는 모두 유지. 쪽별 텍스트는 Ghostscript(17/21, 평면화된 W-9 쪽) 외 모두 21/21 동일
- Poppler 24.02·Ghostscript 10.02.1(Ubuntu 패키지)도 같은 항목 결과 (10.02.1만 JPEG 끝에 2바이트 덧붙임, 픽셀 동일)

**알게 된 것**

- "무손실이라 차이 없음"으로 보이던 작업도 **문서 수준 구조(책갈피·이름 목적지·AcroForm)** 를 재면 도구 차이가 큼. 백로그에서 "측정 차별점 약함"으로 보류한 주제는 결과물의 구조·동작을 측정 항목으로 바꿔 다시 검토할 것 (예: MP4→MP3의 메타데이터·챕터)
- Chromium 141 `--headless=new`에서 내장 PDF 뷰어가 열리고, 마우스 클릭·`insert_text`로 양식 입력, 휠 스크롤로 쪽 이동이 됨. `keyboard.type`은 공백이 빠지고 `Control+A`는 안 먹음(End → Shift+Home 사용). `location.hash`로 쪽 이동은 안 됨. PDF 관련 글에서 실제 뷰어 동작 스크린샷 재료로 재사용 가능
- 같은 이름 양식 칸 문제는 pypdf 문서("Merging forms")·PyMuPDF 문서(`join_duplicates`)에 적혀 있지만 기본값이 서로 다름 → 도구 문서의 기본값을 측정 전에 확인하면 측정 항목을 빨리 정할 수 있음
- 네트워크: irs.gov·poppler.freedesktop.org·GitHub Releases(qpdf v12.4.2, ghostpdl gs10080)·gitlab.com API(pdftk-java releases·README raw)·formulae.brew.sh·support.apple.com·tools.pdf24.org·pdflabs.com·readthedocs(qpdf·pypdf·PyMuPDF·Ghostscript)·archive.ubuntu.com(apt) 가능. gitlab.com 릴리스 HTML 페이지는 WebFetch에서 본문이 비어 API로 확인
- 실수: 처음 링크 판정 스크립트가 "같은 쪽을 가리키는 링크"를 오답으로 셌음(Summary 링크는 1쪽→1쪽) → 입력 파일의 링크 대상과 비교하도록 고침

**다음 할 일**

- 사용자: 미색인 9편(모두 `URL is unknown`, 가장 오래된 `remove-background-from-image-free-offline` 발행 6일째). Search Console URL 검사 → **색인 생성 요청** 권장 (API로는 요청 불가). sitemap이 10-15 이후 다시 읽히지 않아 sitemap 재제출도 검토
- 사용자: 대시보드 — 정기 세션의 대시보드 DB 갱신 허용 여부 결정 전까지 이번 세션도 갱신 건너뜀
- Claude: 새 글 노출 검색어 확인 (`merge pdf files free`, `merge pdf offline`, `combine pdf files into one` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 허브 후보 `Best Free Offline File Converters` — `software` 측정 글 9편(PDF→Word·HEIC→JPG·PDF 압축·영상→GIF·영상 압축·이미지 압축·JPG→PDF·PDF→JPG·PDF 합치기). V2 판정(11-12) 후 결정. PDF 4편(압축·Word·JPG·합치기)은 "PDF 도구" 허브로 따로 묶는 안도 검토
- Claude: 발행 18편 / AdSense 신청 기준 20편 (2편 남음)

## 2026-10-16 · 세션 15 (정기 실행 14회차): PDF→JPG 고화질 변환

세션 시각: 2026-10-16 16:55 UTC 무렵 (한국 10-17 01:55). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-18 ~ 10-16, 세션 14 이후 바뀐 값만)**

- 변화 없음: 노출 74, 클릭 4, CTR 5.4%, 평균 순위 20.6. sitemap 마지막 다운로드 10-15 03:42 UTC 그대로. URL 검사 변화 없음 → 16편 중 8편 색인 (미색인 8편 모두 `URL is unknown`, `jpg-to-pdf-free-offline` 포함)
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                      | 카테고리   | 유형                           | 직접 검증                                                                                                   |
| ------------------------- | ---------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `pdf-to-jpg-high-quality` | `software` | 비교 + How-to (측정형, 검색형) | PDF 3개(IRS Form 1040 2쪽 + 직접 만든 흰 배경 없는 보고서 1쪽 + CC0 사진 3쪽)를 pdftoppm(Poppler 26.10.0)·PyMuPDF 1.28.2·Ghostscript 10.08.0·ImageMagick 7.1.2-34·LibreOffice 26.8.1의 기본·300 DPI 설정으로 변환, 픽셀 크기·JPEG 품질·쪽당 크기·Tesseract OCR 단어 재현율·시간·메모리 측정 + pdftoppm DPI 7단계 × 품질 2단계 스윕 + GIMP 3.2.6 가져오기·LibreOffice JPEG 옵션 대화상자 스크린샷 |

- 선정 근거: Trends API 429(세션 13에 이어 두 번째) → 자동완성으로 선정. "pdf to jpg" 30개(converter·converter free·free·canva 3곳, high quality·iphone 2곳, high resolution·in pc·no sign up), "merge pdf" 28개, "png to jpg" 29개, "webp to jpg" 22개. `merge pdf`는 무손실 결합이라 측정 차별점이 약하고, `pdf to jpg`는 "high quality/high resolution" 하위 검색어가 측정(DPI)과 바로 맞아서 선택. 파일 변환 시리즈 8번째, JPG→PDF의 반대 방향
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Trends 미국 급상승 10개: 연예·스포츠 → IT 주제 없음. 공식 피드 새 항목은 세션 14와 같음
- 차별점: 기본 설정에서 **3개 도구(PyMuPDF·Ghostscript·ImageMagick)가 72 DPI** → IRS 1040 1쪽 OCR 3~7%, 300 DPI로 바꾸면 5개 모두 82~91%. **ImageMagick이 흰 배경을 칠하지 않는 브라우저 PDF를 검은 페이지로 저장**(OCR 0%) → `-background white -alpha remove`. LibreOffice는 1쪽만 내보내고 글꼴을 바꿔 글자가 겹침
- 적용한 노하우: 검색형 제목 55자·설명 154자, 측정 규모 제목 표기, 이미지 7장(대표 그래프 1200×675 + DPI별 확대 + DPI 크기·판독률 + ImageMagick 검은 배경 + LibreOffice 글꼴 + 스크린샷 2장), 요약 표 → 사실 확인표에 기록
- 내부 링크: 새 글 → JPG→PDF·이미지 100KB·OCR·PDF→Word·PDF 압축 (5개). `jpg-to-pdf-free-offline` 마지막 문단에서 새 글로 역링크 1개 (V 기록 대상 아님)
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 15개, og:image 생성, 본문 이미지 7장 모두 width·height 지정

**측정값 (Xeon 2.8GHz 4코어, RAM 16GB, GPU 없음, OCR = Tesseract 5.3.4가 1040 1쪽 단어를 읽어 낸 비율)**

| 도구                | 기본 크기(Letter) · 품질 | 기본 OCR | 300 DPI·Q90 OCR | 300 DPI 시간(6쪽) | 기본 설정 문제 |
| ------------------- | ------------------------ | -------- | --------------- | ----------------- | -------------- |
| pdftoppm 26.10      | 1275×1650 (150) · 75     | 81%      | 91%             | 1.8초             | 없음           |
| PyMuPDF 1.28        | 612×792 (72) · 95        | 7%       | 90%             | 4.5초             | 72 DPI         |
| Ghostscript 10.08   | 612×792 (72) · 75        | 3%       | 90% (AA 켬)     | 2.9초             | 72 DPI, 안티앨리어싱 없음 |
| ImageMagick 7.1.2   | 612×792 (72) · 92        | 6%       | 82% (흰 배경)   | 21.4초 · 500MB    | 72 DPI, 투명 → 검은 배경 |
| LibreOffice 26.8    | 816×1056 (96) · 75       | 58%      | 82% (2550×3300) | -                 | 1쪽만, 글꼴 대체 |

- DPI 스윕(pdftoppm, 1040 KB/쪽 Q75): 72 125KB·4% / 150 386KB·81% / 200 576KB·87% / 300 1.0MB·89% / 600 2.6MB·93%. Q75→Q90은 크기 +40%, OCR 차이 없음(±3~5%p)
- Poppler 24.02(Ubuntu 패키지)와 26.10.0 pdftoppm 출력이 바이트 단위로 같음

**알게 된 것**

- 문서→이미지 변환 글은 "기본 DPI"가 가장 큰 차이. 도구 기본값을 픽셀 크기로 직접 재면 문서(Ghostscript "usually 72 dpi")보다 확실한 근거가 됨
- 흰 배경을 칠하지 않는 PDF(브라우저 인쇄)를 입력에 넣어야 투명도 문제가 드러남. 공문서 양식만 썼다면 ImageMagick 검은 배경을 못 찾았음 → 문서 변환 측정 세트에는 브라우저 PDF를 항상 포함
- PyMuPDF는 JPEG 헤더에 96 DPI를 적지만 실제 픽셀은 72 DPI 크기. 헤더 DPI가 아니라 픽셀 크기로 판단할 것
- GIMP 내보내기 대화상자는 창 관리자 없는 Xvfb에서 xdotool 입력이 본 창으로 가서 실패(도구 단축키가 눌림). GUI 측정이 필요하면 가벼운 창 관리자를 먼저 띄울 것. GIMP 출력은 측정하지 않고 가져오기 기본값만 썼음
- Poppler 26.10 소스 빌드는 `-DENABLE_HARFBUZZ=OFF` 등 옵션으로 약 3분. Ubuntu 패키지 24.02와 렌더링 결과가 같아 다음부터는 패키지로 충분
- Google Trends API 429가 세션 13에 이어 다시 발생(세션 14는 정상) → 간헐적. README에 "429면 자동완성만으로 선정하고 log에 기록" 정도의 대체 절차를 다음 세션에서 검토
- 네트워크: irs.gov PDF·poppler.freedesktop.org·formulae.brew.sh API·download.gimp.org·download.documentfoundation.org·GitHub Releases(ImageMagick·ghostpdl)·archive.ubuntu.com(apt) 가능. support.apple.com에 Preview PDF→JPEG 전용 문서는 찾지 못함(이미지 형식 변환 문서만)

**다음 할 일**

- 사용자: 미색인 8편(모두 `URL is unknown`, 가장 오래된 `remove-background-from-image-free-offline` 발행 6일째). Search Console URL 검사 → **색인 생성 요청** 권장 (API로는 요청 불가). sitemap이 10-15 이후 다시 읽히지 않아 sitemap 재제출도 검토
- 사용자: 대시보드 — 정기 세션의 대시보드 DB 갱신 허용 여부 결정 전까지 이번 세션도 갱신 건너뜀
- Claude: 새 글 노출 검색어 확인 (`pdf to jpg`, `pdf to jpg high quality` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 허브 후보 `Best Free Offline File Converters` — `software` 측정 글 8편(PDF→Word·HEIC→JPG·PDF 압축·영상→GIF·영상 압축·이미지 압축·JPG→PDF·PDF→JPG). V2 판정(11-12) 후 결정
- Claude: 발행 17편 / AdSense 신청 기준 20편

## 2026-10-16 · 세션 14 (정기 실행 13회차): JPG→PDF 오프라인 변환

세션 시각: 2026-10-16 15:50 UTC 무렵 (한국 10-17 00:50). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-18 ~ 10-16, 세션 13 이후 바뀐 값만)**

- 노출 66 → **74**, 클릭 3 → **4**, CTR 5.4%, 평균 순위 20.6
  - `turn-off-ai-in-chrome` 노출 42 (10.5) / `transcribe-audio-offline-free` 13 (24.6) / `gemini-gems-to-skills` 4 (7.8) / 홈 클릭 2·노출 3 / `/about` 노출 2
  - 새 검색어: `tool proof` 클릭 1 (4위, 브랜드 검색 첫 클릭), `offline transcription software` 2 (79), `speech to text offline` 1 (85), `turn off ai` 2 (57.5)
- sitemap 마지막 다운로드 10-15 03:42 UTC 그대로. URL 검사 변화 없음 → 15편 중 8편 색인 (미색인 7편 모두 `URL is unknown`: 이미지 100KB·PDF 압축·영상 압축·HEIC→JPG·PDF→Word·배경 제거·영상→GIF)
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                       | 카테고리   | 유형                           | 직접 검증                                                                                                   |
| -------------------------- | ---------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `jpg-to-pdf-free-offline`  | `software` | 비교 + How-to (측정형, 검색형) | 12MP 사진 24장(CC0 20장 + EXIF Orientation=6 세로 4장)을 img2pdf 0.6.3·ImageMagick 7.1.2-34·Pillow 12.3.0·LibreOffice 26.8.1·Chromium 141(Playwright `page.pdf`)로 변환, PDF 크기·삽입 사진 픽셀 동일 여부·SSIMULACRA2·세로 사진 방향·시간·메모리 측정 + LibreOffice 무손실 설정 비교 + Draw·PDF 내보내기 대화상자 스크린샷 |

- 선정 근거: Trends(미국 3개월, 기준 `remove background` 35.4): `jpg to pdf` **13.1** · `mp4 to mp3` 8.8 · `image to pdf` 8.1 · `compress pdf` 4.8 · `png to jpg` 3.9 · `webp to jpg` 1.9 · `upscale image` 1.4. 자동완성 "jpg to pdf" 32개(converter·free 3곳, merge·combine·high quality·on mac·windows 11), "image to pdf" 29개. 백로그 후보(업스케일·WebP→JPG)보다 수요가 5~9배라 새 후보로 선정
- Google Trends API: 이번 세션은 쿠키 방식으로 정상 응답 (세션 13의 429는 일시적이었음 → README 대체 절차 기록 불필요)
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Trends 미국 급상승 10개: 연예·정치·주식 → IT 주제 없음. 공식 피드 새 항목은 세션 13과 같음
- 차별점: 기본 설정에서 **세로 사진(EXIF 회전 태그)을 옆으로 눕히는 도구가 5개 중 3개**(ImageMagick·Pillow·LibreOffice), 사진을 그대로 넣는 도구는 img2pdf·Chromium뿐. LibreOffice 기본 내보내기는 JPEG 90%·300 DPI로 사진 픽셀을 약 1/3로 줄임
- 적용한 노하우: 검색형 제목 56자·설명 159자, 측정 규모 제목 표기, 이미지 6장(대표 그래프 1200×675 + 세로 사진 방향 비교 + 확대 비교 + 속도 그래프 + LibreOffice 스크린샷 2장), 요약 표 → 사실 확인표에 기록
- 내부 링크: 새 글 → HEIC→JPG·이미지 100KB·PDF 압축·OCR·PDF→Word (5개). `convert-pdf-to-word-offline-free` 마지막 문단에서 새 글로 역링크 1개 (V 기록 대상 아님)
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 12개, og:image 생성, 본문 이미지 6장 모두 width·height 지정

**측정값 (Xeon 2.8GHz 4코어, RAM 16GB, GPU 없음, 24장 61.8MB, 시간은 3회 중앙값)**

| 도구 (기본 설정)        | PDF 크기 | 픽셀 동일 | SSIMULACRA2 중앙값 (최저) | 세로 사진 바로 | 시간 · 최대 RAM |
| ----------------------- | -------- | --------- | ------------------------- | -------------- | --------------- |
| img2pdf 0.6.3           | 61.8MB   | 24/24     | 100                       | 4/4            | 0.28초 · 108MB  |
| Chromium 141 인쇄       | 146.3MB  | 24/24     | 100 (세로 쪽은 무압축 20~27MB) | 4/4       | 31.6초*         |
| ImageMagick 7.1.2-34    | 61.8MB   | 0/24      | 92.3 (89.3), 품질 92 재인코딩 | 0/4 (`-auto-orient` 4/4) | 34.1초 · 3.3GB |
| Pillow 12.3.0           | 33.1MB   | 0/24      | 78.9 (73.6), 품질 75       | 0/4            | 3.1초 · 1.1GB   |
| LibreOffice 26.8.1      | 20.3MB   | 0/24      | 59.5 (26.7), 2244px·품질 90 | 0/4           | 33.6초*         |
| LibreOffice 무손실+해상도 변경 끔 | 61.9MB | 24/24 | 100                      | 0/4            | -               |

- \* 사진당 PDF 1개, 프로그램 시작 포함. 메모리는 자식 프로세스가 빠져 기록 안 함

**알게 된 것**

- "변환"이라는 같은 이름 아래 도구가 하는 일이 셋으로 갈림: 그대로 복사(img2pdf), 다시 압축(ImageMagick·Pillow·LibreOffice), 풀어서 무압축(Chromium 세로 사진). 크기만 보면 ImageMagick이 img2pdf와 같아 보여 픽셀 동일 여부를 따로 재야 차이가 드러남 → 파일 변환 글은 "결과가 원본과 비트·픽셀 단위로 같은가"를 측정 항목에 넣을 것
- 휴대폰 세로 사진의 EXIF 회전 태그는 HEIC 글에 이어 이번에도 도구 간 차이가 가장 큰 항목. 이미지 관련 측정 세트에는 세로(회전 태그) 사진을 항상 포함
- LibreOffice는 로캘이 없으면 A4, `LANG=en_US.UTF-8`이면 Letter. 기본값은 대화상자 스크린샷과 `share/registry/main.xcd`(`Filter/PDF/Export`)로 확인 가능
- ImageMagick `-orient`은 EXIF가 없는 파일에 태그를 쓰지 않음 → JPEG를 다시 인코딩하지 않고 APP1을 직접 삽입하는 스크립트(`set_orientation.py`)로 해결
- 실수: `pgrep -f "lo-gui" | xargs kill`이 같은 문자열을 가진 내 셸까지 종료(exit 144, 세션 13과 같은 함정). 프로세스 종료는 반드시 PID로
- Windows `Microsoft Print to PDF`는 support.microsoft.com 공식 문서를 찾지 못함(검색·Learn 검색 모두 Q&A 커뮤니티 답변뿐) → 본문에 단계 없이 "테스트하지 못함"만 씀
- 네트워크: pd12m S3·GitHub Releases(ImageMagick·libjxl)·download.documentfoundation.org·PyPI·gitlab.mister-muffin.de 가능

**다음 할 일**

- 사용자: 미색인 7편(모두 `URL is unknown`, 가장 오래된 `remove-background-from-image-free-offline`은 발행 6일째). Search Console URL 검사 → **색인 생성 요청** 권장 (API로는 요청 불가). sitemap이 10-15 이후 다시 읽히지 않아 sitemap 재제출도 검토
- 사용자: 대시보드 — 세션 13에서 `ArtifactData` 읽기가 권한 분류기에 거부됨. 정기 세션의 대시보드 DB 갱신 허용 여부 결정 전까지 이번 세션도 갱신 건너뜀
- Claude: 새 글 노출 검색어 확인 (`jpg to pdf`, `image to pdf`, `jpg to pdf free` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 허브 후보 `Best Free Offline File Converters` — `software` 측정 글 7편(PDF→Word·HEIC→JPG·PDF 압축·영상→GIF·영상 압축·이미지 압축·JPG→PDF). V2 판정(11-12) 후 결정
- Claude: 발행 16편 / AdSense 신청 기준 20편

## 2026-10-16 · 세션 13 (정기 실행 12회차): 이미지 100KB 압축

세션 시각: 2026-10-16 11:09 UTC (한국 20:09). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-18 ~ 10-16, 세션 12 이후 바뀐 값만)**

- 노출 65 → **66**, 클릭 3, CTR 4.5%, 평균 순위 22.2. `check-if-image-is-ai-generated` 노출 9 → 10 (순위 69.4)
- sitemap 마지막 다운로드 10-15 03:42 UTC 그대로. URL 검사: `remove-background-from-image-free-offline`이 `Discovered - currently not indexed` → **`URL is unknown to Google`**로 바뀜 (원인 불명, 색인 생성 요청 필요성 커짐). 14편 중 8편 색인 (미색인 6편 모두 `URL is unknown`)
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                      | 카테고리   | 유형                           | 직접 검증                                                                                                   |
| ------------------------- | ---------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `compress-image-to-100kb` | `software` | How-to + 측정 (검색형)         | 12MP 사진 20장(CC0, HEIC 글과 같은 세트)을 목표 5개(1MB·500KB·200KB·100KB·50KB) × 크기 9개로 ImageMagick 7.1.2-34(`jpeg:extent`)·jpegoptim 1.5.6(`--size`)·cwebp 1.6.0(`-size`) 압축, 1,900건의 크기·목표 통과·SSIMULACRA2(1600×1200 화면 기준) 측정 + GIMP 3.2.6 크기 조정·JPEG 내보내기(파일 크기 미리보기) 직접 조작 |

- 선정 근거: 자동완성 "compress image" 30개(to 2mb·without losing quality가 Google·Bing·YouTube 3곳, to 1mb·free·online, to 100kb·200kb·50kb), "reduce image size" 30개(in kb·to 100kb·mac). 압축 시리즈(PDF·영상)와 같은 독자, 업로드 한도 검색이 구체적이라 측정 차별점이 큼. "upscale image"(32개)·"webp to jpg"(22개)는 후보로 남김
- **Google Trends API 429**: 쿠키 방식으로도 3회 재시도(최대 약 2.5분) 후 실패, 몇 분 뒤 재시도도 실패 → 이번 세션은 상대 검색량 비교 없이 자동완성으로 선정 (RSS는 정상)
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Trends 미국 급상승 10개: 스포츠·날씨·연예 → IT 주제 없음. 공식 피드 새 항목은 세션 12와 같음
- 차별점: 원본 크기(4032px)로 100KB를 지정하면 ImageMagick은 품질 2까지 내려도 6/20장이 목표를 넘기고 **오류 없이(종료 코드 0) 저장**, jpegoptim은 KB=1,024 + 근사 탐색으로 2/20만 100,000바이트 이하. 1024px로 줄인 뒤엔 20/20 통과·화질 중앙값 -49.9 → 52.8
- 적용한 노하우: 검색형 제목 52자·설명 153자, 측정 규모 제목 표기, 이미지 5장(대표 그래프 1200×675 + 통과 수 그래프 + 고양이 확대 비교 + GIMP 스크린샷 2장), 요약 표 → 사실 확인표에 기록
- 내부 링크: 새 글 → HEIC→JPG·PDF 압축·영상 압축·허브·배경 제거 (5개). `compress-pdf-offline-free` 마지막 문단에서 새 글로 역링크 1개 (V 기록 대상 아님)
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 10개, og:image 생성, 본문 이미지 5장 모두 width·height 지정 (관련 글 카드 썸네일 3장은 크기 속성 없음 — 기존 글과 같은 동작)

**측정값 (Xeon 2.8GHz 4코어, RAM 16GB, GPU 없음, 20장 중앙값, SSIMULACRA2 1600×1200 화면 기준, ImageMagick JPEG)**

| 목표   | 원본 4032px (통과) | 최적 긴 변 | 최적 점수 (하위 10%) | 고른 JPEG 품질 중앙값 (범위) |
| ------ | ------------------ | ---------- | -------------------- | ---------------------------- |
| 1MB    | 88.0 (20/20)       | 1600px     | 89.7 (85.8)          | 96.5 (90~100)                |
| 500KB  | 75.1 (20/20)       | 1600~1920px| 83.4~83.8 (72.4)     | 89 (64~97) @1600             |
| 200KB  | 15.3 (19/20)       | 1280px     | 69.1 (49.4)          | 78 (33~94)                   |
| 100KB  | -49.9 (14/20)      | 1024px     | 52.8 (26.7)          | 67 (23~92)                   |
| 50KB   | -50.6 (0/20)       | 800px      | 32.9 (1.5)           | 50.5 (17~90)                 |

- WebP(cwebp -size)는 같은 크기에서 점수가 비슷하거나 조금 높지만(100KB@1024 54.4, 200KB@1600 71.6) 목표 초과가 잦음(표 크기에서 0~5/20 초과, 원본 크기 100KB 11/20 초과)
- GIMP 3.2.6: 1600×1200 품질 60에서 4:4:4 213.5 kB → 4:2:0 181.8 kB, 저장 파일 181,788바이트 (kB = 1,000바이트)

**알게 된 것**

- 목표 용량 기능(`jpeg:extent`, jpegoptim `--size`, cwebp `-size`)은 모두 "최선을 다함"이지 보장이 아님. 문서(ImageMagick "does not exceed the value")와 실제 동작이 달라 측정이 곧 차별점이 됨. "도구가 약속한 값을 지켰는지"를 측정 항목에 넣을 것
- 화질 지표를 고정 화면 크기(1600×1200)로 계산하면 1600px 근처가 구조적으로 유리함 → 본문에 기준과 한계(작게 쓰는 프로필 사진이면 손해가 적음)를 밝힘. 원본 해상도 SSIMULACRA2는 12MP 1회 약 14초라 1,900건엔 부적합
- 속도 함정: 첫 실행은 점수용 리사이즈를 ImageMagick AppImage로 해 1건 3.7초 → Pillow Lanczos로 바꿔 0.5초. 4개 병렬 + `MAGICK_THREAD_LIMIT=1`로 1,900건 약 37분. 또 `pkill -f gimp`가 같은 문자열을 가진 내 셸까지 종료함(exit 144) → 프로세스 종료는 PID로
- 네트워크: storage.googleapis.com(libwebp 1.6.0 바이너리)·github.com Releases(libjxl v0.11.1 static, jpegoptim v1.5.6, ImageMagick 7.1.2-34)·download.gimp.org·archive.ubuntu.com(apt) 가능. Windows Photos 앱 크기 조정의 Microsoft 공식 문서는 찾지 못해 PowerToys 문서로 대체
- GIMP 3.2.6 첫 실행 시 "Welcome to GIMP" 창이 떠 xdotool `search --name`이 기대한 창을 못 찾음 → `xdotool search --name .`로 창 ID 목록을 보고 ID로 조작

**다음 할 일**

- 사용자: `remove-background-from-image-free-offline`이 발행 6일째 미색인이고 이번에 `URL is unknown`으로 바뀜. Search Console URL 검사 → **색인 생성 요청** 1회 권장 (API로는 요청 불가)
- Claude: 새 글 노출 검색어 확인 (`compress image to 100kb`, `reduce image size in kb` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 허브 후보 `Best Free Offline File Converters` — `software` 측정 글 6편(PDF→Word·HEIC→JPG·PDF 압축·영상→GIF·영상 압축·이미지 압축). V2 판정(11-12) 후 기존 허브와 역할 정리해 결정. 압축 3편(PDF·영상·이미지)은 "파일 크기 줄이기" 허브로 묶는 안도 검토
- Claude: Trends API 429가 다음 세션에도 계속되면 README 주제 발굴 소스에 대체 절차 기록
- Claude: 발행 15편 / AdSense 신청 기준 20편
- 대시보드: `ArtifactData` `list`(stats 읽기)가 권한 분류기에 거부됨(사유: PII Data Handling) → 이번 세션 DB 갱신 못 함. 사용자: 정기 세션의 대시보드 DB 읽기·쓰기를 허용할지, 정기 세션에서는 대시보드 갱신을 건너뛸지 결정 필요 (README 운영 대시보드 절차)

## 2026-10-16 · 세션 12 (정기 실행 11회차): Discord·이메일용 영상 압축

세션 시각: 2026-10-16 09:14 UTC (한국 18:14). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-18 ~ 10-16, 세션 11 이후 바뀐 값만)**

- 노출 60 → **65**, 클릭 3, CTR 4.6%, 평균 순위 21.1
  - `turn-off-ai-in-chrome` 노출 38 (10.6) / `check-if-image-is-ai-generated` 9 (67.0) / `gemini-gems-to-skills` 2 (8.5) / `free-offline-text-to-speech` 2 (13.5)
  - 새 검색어: `google ai gone` 1 (3위), `synthid checker` 2 (87.5), `synthid detector` 3 (134)
- sitemap 마지막 다운로드 10-15 03:42 UTC 그대로. URL 검사 변화 없음 → 13편 중 8편 색인 (미색인: PDF 압축·HEIC→JPG·PDF→Word·영상→GIF `URL is unknown`, 배경 제거 `Discovered - currently not indexed`)
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                               | 카테고리   | 유형                           | 직접 검증                                                                                                   |
| ---------------------------------- | ---------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `compress-video-for-discord-email` | `software` | 비교 + How-to (측정형, 검색형) | 60초 1080p 클립 3개(BBB·ToS CC BY 3.0 + 직접 녹화 화면)를 HandBrake 1.11.2(설정 7개)·FFmpeg 9.0.2(x264·x265·SVT-AV1, 설정 7개)로 압축, 크기·VMAF(평균·하위 5%)·시간·메모리 측정 + HandBrake Social 프리셋 내부 값 확인 |

- 선정 근거: 백로그 39. Trends(미국 3개월, 기준 `remove background` 35.0): `mp4 to mp3` 8.8 · `screen recorder` 3.5 · `compress video` **2.4** · `upscale image` 1.4. 자동완성 "compress video" 32개(for discord·free·without losing quality·to 10mb·for email·with handbrake). `mp4 to mp3`는 측정 차별점이 약해 계속 보류
- 차별점: Discord 무료 한도가 2026-08 **10MB → 20MB**로 바뀜(Discord File Attachments FAQ, 10-15 갱신). HandBrake Social 프리셋은 10MB·25MB용이라 20MB에 맞지 않음을 측정으로 보임
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Google Trends 미국 급상승 10개: 스포츠·연예·주식·"artificial intelligence news" → 새 IT 도구 주제 없음. 공식 피드 새 항목은 세션 11과 같음
- 적용한 노하우: 검색형 제목 57자·설명 157자, 측정 규모 제목 표기, 이미지 5장(대표 그래프 1200×675 + 인코더별 VMAF + 시간 + 화면 글자·얼굴 확대 비교), 요약 표 + 길이별 비트레이트 표 + 전체 결과 표 → 사실 확인표에 기록. 앱 화면 스크린샷 없음 (아래)
- 내부 링크: 새 글 → 영상→GIF·PDF 압축·HEIC→JPG·허브 (4개). `video-to-gif-high-quality-free` 마지막 문단에서 새 글로 역링크 1개 (V 기록 대상 아님)
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 10개, og:image 생성, 본문 이미지 5장 모두 width·height 지정

**측정값 (Xeon 2.8GHz 4코어, RAM 16GB, GPU 없음, 60초 클립, 크기 MB · 평균 VMAF, 1회 실행)**

| 설정                               | 애니메이션  | 실사        | 화면 녹화   |
| ---------------------------------- | ----------- | ----------- | ----------- |
| HandBrake Fast 1080p30 (기본)      | 20.5 · 91.6 | 32.9 · 95.4 | 4.8 · 99.6  |
| HandBrake Social 10 MB 1 Minute    | 9.7 · 83.7  | 9.7 · 84.0  | 8.3 · 82.2  |
| HandBrake Social 25 MB 1 Minute    | 23.9 · 90.1 | 23.8 · 93.9 | 20.2 · 96.3 |
| HandBrake 평균 비트레이트 19MB     | 19.0 · 91.2 | 19.0 · 90.4 | 17.0 · 99.6 |
| FFmpeg x264 2-pass 19MB            | 19.0 · 95.8 | 19.0 · 93.2 | 14.6 · 99.6 |
| FFmpeg x265 2-pass 19MB            | 18.9 · 96.1 | 18.9 · 94.8 | 18.9 · 99.6 |
| FFmpeg SVT-AV1 19MB (1-pass VBR)   | 17.4 · 96.3 | 15.5 · 94.8 | 12.7 · 99.6 |
| FFmpeg x264 9.5MB 1280 폭          | 9.5 · 90.0  | 9.5 · 84.9  | 9.0 · 96.2  |

- 3개 클립 합계 시간: HandBrake 19MB 3.6분, FFmpeg x264 2-pass 3.3분, x265 6.8분, AV1 4.2분(최대 RAM 1,003MB)

**알게 된 것**

- support.discord.com 일반 페이지는 403이지만 Zendesk API(`/api/v2/help_center/en-us/articles/{id}.json`, 검색 `/api/v2/help_center/articles/search.json?query=…`)는 열림 → 본문·갱신일을 1차 출처로 확인 가능. 뉴스 보도(Nitro 500MB)와 공식 문서(Nitro 최대 1GB)가 달라 공식 문서를 따름
- HandBrake 최신판(1.11.2) Linux는 GUI flatpak만 배포. `apt install flatpak` + Flathub 런타임 설치는 되지만 `flatpak run`은 D-Bus 없이 실패 → 런타임의 `ld-linux-x86-64.so.2`로 `HandBrakeCLI`를 직접 실행하면 동작(`hb.sh`). GUI(`ghb`)는 같은 방식으로 Xvfb에 창이 뜨지 않아 스크린샷을 못 찍음 → GUI 라벨은 바이너리 문자열로 확인
- HandBrake 출력은 우리 애니메이션·실사 클립에서 RF 5(거의 무손실)에서도 원본 대비 PSNR 40.8dB(FFmpeg CRF 5는 60.9dB), 화면 녹화는 50.8dB. 색 태그·crop·decomb·인코더 preset·profile 모두 원인 아님. 원인을 못 찾아 글에 "우리 클립에 한정될 수 있음"으로 명시. 측정 도구 간 비교에서 한쪽만 이상하면 거의 무손실 설정으로 파이프라인 자체 손실부터 확인
- 측정 실수 2건: (1) 2.4:1 영상을 `scale=-2:720`으로 줄여 1728×720이 됨 → 16:9 상자 기준(`scale=1280:-2`)으로 바꿔 재측정. (2) PSNR 기준 파일을 다르게 잘라 FFmpeg CRF 5를 51.6dB로 잘못 계산 → 같은 기준 파일로 다시 재서 60.9dB. 비교 기준 파일은 스크립트로 고정
- 시간 측정 중 다른 확인 작업을 함께 돌려 일부 HandBrake 시간이 늘어남 → 글에 "30% 미만 차이는 노이즈"로 밝힘. 다음 측정은 시간 측정 중 다른 작업을 하지 않음
- trac.ffmpeg.org는 Anubis 봇 차단(JS 필요) → FFmpeg 기본값은 출력 파일의 x264 설정 문자열(`crf=23.0`)로 직접 확인

**다음 할 일**

- 사용자: `remove-background-from-image-free-offline`이 발행 6일째 크롤링 전(`Discovered - currently not indexed`). Search Console URL 검사 → **색인 생성 요청** 1회 권장 (API로는 요청 불가)
- Claude: 새 글 노출 검색어 확인 (`compress video for discord`, `compress video to 10mb` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 허브 후보 `Best Free Offline File Converters` — `software` 측정 글 5편(PDF→Word·HEIC→JPG·PDF 압축·영상→GIF·영상 압축). V2 판정(11-12) 후 기존 허브와 역할 정리해 결정
- Claude: 발행 14편 / AdSense 신청 기준 20편
- 대시보드: `stats` DB 7개 문서 갱신(버전 10·7). 정기 세션 규칙에 따라 `data.js` 재게시는 건너뜀

## 2026-10-16 · 세션 11 (정기 실행 10회차): 영상→GIF 고화질 변환

세션 시각: 2026-10-16 03:21 UTC (한국 12:21). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-18 ~ 10-16, 세션 10 이후 바뀐 값만)**

- 변화 없음: 노출 60, 클릭 3, CTR 5.0%, 평균 순위 20.6. sitemap 마지막 다운로드 10-15 03:42 UTC 그대로
- URL 검사: `compress-pdf-offline-free`(10-16 발행)도 `URL is unknown` → 12편 중 8편 색인 (미색인: PDF 압축·HEIC→JPG·PDF→Word `URL is unknown`, 배경 제거 `Discovered - currently not indexed`)
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                             | 카테고리   | 유형                           | 직접 검증                                                                                                   |
| -------------------------------- | ---------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `video-to-gif-high-quality-free` | `software` | 비교 + How-to (측정형, 검색형) | 클립 3개(Big Buck Bunny·Tears of Steel CC BY 3.0 장면 + 직접 녹화한 화면, 각 5초·15fps·75프레임)를 FFmpeg 9.0.2·gifski 1.34.0·ImageMagick 7.1.2-34의 설정 7개로 변환, 크기·프레임별 SSIM·재생 시간(지연값)·시간·메모리 측정 + 폭·fps별 크기 |

- 선정 근거: Trends(미국 3개월, 기준 `remove background` 35.0): `video to gif` **7.1** · `gif maker` 6.5 · `mp4 to gif` 3.0 · `compress video` 2.4 · `webp to jpg` 1.8 · `upscale image` 1.4. 자동완성: "video to gif" 23개(converter·high quality가 Google·Bing·YouTube 3곳, free·discord·iphone), "compress video" 32개. 측정 차별점(도구별 화질·크기 차이가 큼)이 분명해 `video to gif` 선택, `compress video`는 후보로 남김
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Google Trends 미국 급상승 10개: 야구·연예 → IT 주제 없음. 공식 피드 새 항목(Gmail Live 유료 Workspace, SynthID TIME 선정, Google 검색 AI 모드 변경) → 새 글 대상 아님
- 적용한 노하우: 검색형 제목 51자·설명 159자, 측정 규모 제목 표기, 이미지 6장(대표 그래프 1200×675 + 하늘·얼굴·화면 글자 확대 비교 3장 + 폭·fps 크기 + 속도·메모리), 요약 표 + 전체 결과 표 → 사실 확인표에 기록. 앱 화면 스크린샷 없음(세 도구 모두 명령줄)
- 내부 링크: 새 글 → PDF 압축·HEIC→JPG·배경 제거·허브 (4개). `convert-heic-to-jpg-free` 마지막 문단에서 새 글로 역링크 1개 (V 기록 대상 아님). V1·V2 대상 글은 변경하지 않음
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 9개, og:image 생성, 본문 이미지 6장 모두 width·height 지정

**측정값 (Xeon 2.8GHz 4코어, RAM 16GB, GPU 없음, 같은 PNG 프레임 입력, 3회 중앙값)**

| 설정                  | 3개 GIF 합계 | 평균 SSIM | 재생 시간 | 3개 변환 시간 | 최대 RAM |
| --------------------- | ------------ | --------- | --------- | ------------- | -------- |
| FFmpeg 기본           | 13.8MB       | **0.482** | 5.0초     | 0.8초         | 44MB     |
| FFmpeg + 팔레트       | 10.5MB       | 0.962     | 5.0초     | 5.8초         | 120MB    |
| FFmpeg small 팔레트   | 8.9MB        | 0.970     | 5.0초     | 2.0초         | 121MB    |
| gifski 기본(Q90)      | **6.5MB**    | 0.948     | 5.0초     | 7.2초         | 57MB     |
| gifski Q70            | 4.1MB        | 0.897     | 5.0초     | 5.6초         | 57MB     |
| ImageMagick 기본      | 12.5MB       | 0.972     | **4.5초** | 41.2초        | 744MB    |
| ImageMagick Optimize  | 9.6MB        | 0.958     | **4.5초** | 59.2초        | 451MB    |

- 폭 480→320px: 52~54% 감소, 15→10fps: 26~27% 감소 (실사 클립, FFmpeg small·gifski 모두)

**알게 된 것**

- SSIM은 띠(banding)를 거의 벌하지 않고 디더링 입자를 벌함 → gifski가 SSIM은 낮아도 하늘 그라데이션은 가장 원본에 가까워 보였고, SSIM이 높은 FFmpeg small·ImageMagick은 띠가 보임. 화질 측정 글은 점수 + 같은 영역 확대 비교를 함께 실어야 결론이 틀리지 않음
- 측정 함정: 처음엔 GIF와 원본을 ffmpeg 타임스탬프로 맞춰 비교 → GIF 지연값 반올림(70/60ms) 때문에 프레임이 어긋나 SSIM이 0.5~0.9로 왜곡. GIF를 `-fps_mode passthrough`로 프레임별로 풀어 1:1 비교로 바꿈. 새 비교 방식은 프레임 수(75=75)부터 확인
- ImageMagick `-delay 1x15`는 60ms로 저장돼 10% 빨리 재생 (100으로 나누어떨어지지 않는 fps의 함정). 크기·화질만 보면 놓치는 차이 → GIF·영상 주제는 재생 시간도 측정 항목에 넣음
- 컨테이너: `/usr/bin/time` 없음 → `os.wait4`의 `ru_maxrss`로 최대 메모리 측정. Pillow도 기본 python에 없어 venv 사용. download.blender.org(Blender 오픈 무비, CC BY 3.0)·BtbN FFmpeg 빌드(`releases/download/latest/…`)·crates.io API·formulae.brew.sh API 접속 가능
- Xvfb + Chromium 키오스크 + `ffmpeg -f x11grab`(libx264rgb `-qp 0`)로 저작권 문제 없는 무손실 화면 녹화 클립을 직접 만들 수 있음 (Chromium 시작에 약 3~4초 걸리므로 페이지 동작을 지연 시작)

**다음 할 일**

- 사용자: `remove-background-from-image-free-offline`이 발행 6일째 크롤링 전(`Discovered - currently not indexed`). Search Console URL 검사 → **색인 생성 요청** 1회 권장 (API로는 요청 불가)
- Claude: 새 글 노출 검색어 확인 (`video to gif`, `video to gif high quality` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 허브 후보 `Best Free Offline File Converters` — `software` 측정 글 4편(PDF→Word·HEIC→JPG·PDF 압축·영상→GIF). V2 판정(11-12) 후 기존 허브와 역할 정리해 결정
- Claude: 발행 13편 / AdSense 신청 기준 20편
- 대시보드: `stats` DB 7개 문서 갱신(버전 9·6). 정기 세션 규칙에 따라 `data.js` 재게시는 건너뜀

## 2026-10-16 · 세션 10 (정기 실행 9회차): PDF 오프라인 압축

세션 시각: 2026-10-16 01:25 UTC (한국 10:25). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-18 ~ 10-16, 세션 9 이후 바뀐 값만)**

- 노출 58 → **60**, 클릭 3, CTR 5.0%, 평균 순위 20.6. `turn-off-ai-in-chrome` 노출 37 (순위 10.7), 홈 노출 2, `/about` 첫 노출 1 (3위)
- sitemap 마지막 다운로드 10-15 03:42 UTC (변화 없음). URL 검사: `convert-heic-to-jpg-free`(10-16 발행)·`convert-pdf-to-word-offline-free` `URL is unknown`, `remove-background-from-image-free-offline` `Discovered - currently not indexed` 유지 → 11편 중 8편 색인
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                        | 카테고리   | 유형                           | 직접 검증                                                                                                   |
| --------------------------- | ---------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `compress-pdf-offline-free` | `software` | 비교 + How-to (측정형, 검색형) | 직접 만든 PDF 4개(46쪽, 48.1MB: 사진 안내서·스캔·스크린샷 슬라이드·텍스트 보고서)를 Ghostscript 10.08.0(소스 빌드)·OCRmyPDF 17.13.0·qpdf 12.4.2의 설정 10개로 압축, 크기·쪽별 SSIM·OCR 판독률·링크·텍스트 층·시간·메모리 측정 |

- 선정 근거: Trends(미국 3개월, 기준 `remove background` 34.9): `mp4 to mp3` 8.7 · `compress pdf` **4.8** · `compress video` 2.4 · `reduce pdf size` 1.9. 자동완성: "compress pdf" 31개(free·on mac·without losing quality·to 1mb), "compress pdf offline" 12개(windows 10/11·free download·mac). PDF→Word 글과 같은 PDF 주제군, 업로드 없는 측정으로 차별화. `mp4 to mp3`는 도구 간 차이(같은 인코더)가 작아 측정 글 차별점이 약해 보류
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Google Trends 미국 급상승 10개: 스포츠·연예·정치 → IT 주제 없음. 공식 피드 새 항목(Edge 업데이트 방식, Gmail AI Inbox 유료 Workspace, Circle to Search 문자 사기 확인) → 직접 검증 불가·유료 대상이라 새 글로 쓰지 않음
- 적용한 노하우: 검색형 제목 48자·설명 152자, 측정 규모 제목 표기, 이미지 6장(대표 그래프 1200×675 + 판독률·속도 그래프 + 사진·스캔·슬라이드 확대 비교 3장), 요약 표 + 전체 결과 표 → 사실 확인표에 기록. 앱 화면 스크린샷은 없음(세 도구 모두 명령줄)
- 내부 링크: 새 글 → OCR·PDF→Word·HEIC→JPG·허브 (4개). `convert-pdf-to-word-offline-free`에서 새 글로 역링크 1개 (V 기록 대상 아님). 허브는 V2 판정 전이라 변경하지 않음
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 9개, og:image 생성, 본문 이미지 6장 모두 width·height 지정

**측정값 (Xeon 2.1GHz 4코어, RAM 16GB, GPU 없음, 3회 중앙값)**

| 설정                 | 사진 39.6MB | 스캔 7.1MB | 슬라이드 1.4MB | 텍스트 86KB | 합계      | 최저 쪽 SSIM | 스캔/슬라이드 OCR |
| -------------------- | ----------- | ---------- | -------------- | ----------- | --------- | ------------ | ----------------- |
| qpdf (무손실)        | 100%        | 100%       | 88%            | 87%         | 99.6%     | 1.000        | 100% / 100%       |
| OCRmyPDF -O3         | 14%         | 33%        | 29%            | 89%         | **17%**   | 0.988        | 100% / 100%       |
| Ghostscript /ebook   | 4%          | 19%        | 115%           | 133%        | 10%       | 0.798        | 100% / 100%       |
| Ghostscript /screen  | 1%          | 7%         | 76%            | 133%        | 4.5%      | 0.853        | **79% / 76%**     |

- 사진 안내서 시간·메모리: qpdf 0.08초·27MB, OCRmyPDF -O3 2.0초·817MB, GS /ebook 4.0초·86MB. 모든 설정에서 링크 28개·텍스트 층 유지

**알게 된 것**

- Ghostscript는 파일 전체를 다시 쓰므로 큰 이미지가 없는 PDF(텍스트·PNG 스크린샷)는 모든 프리셋에서 오히려 커짐(+15~40%). "압축 도구 = 항상 작아짐"이 아니라는 점이 측정으로 드러난 차별점
- 테스트 파일 생성 함정: ReportLab 기본값(`useA85=1`)이 이미지를 ASCII85로 한 번 더 감싸 OCRmyPDF가 최적화를 건너뜀("multiple compression filters") → 실제 앱 PDF와 다른 입력이 결론을 바꿀 뻔함. 생성한 입력 파일의 필터·인코딩을 `pdfimages -list`로 먼저 확인
- 최신판 확보: Ghostscript는 Linux 바이너리를 더 배포하지 않고(GitHub `ghostpdl-downloads` 바이너리 404), Ubuntu 최신 deb는 glibc 2.43 필요 → 공식 소스 tar.gz(`releases/download/gs10080/ghostscript-10.08.0.tar.gz`)를 4코어에서 약 10분에 빌드. qpdf는 공식 `qpdf-12.4.2-bin-linux-x86_64.zip` 바로 사용 가능. 태그 이름을 알면 github.com Releases 다운로드 가능
- 컨테이너 CPU가 세션마다 다를 수 있음(이번 2.1GHz, 이전 2.8GHz) → 측정 글마다 `lscpu`로 다시 확인해 적음
- OCRmyPDF -O2/-O3는 pngquant로 PNG를 16색으로 줄여 스크린샷 PDF를 크게 줄임. Windows 설치 가이드에서 pngquant는 선택 사항이라 결과가 환경마다 다를 수 있음

**다음 할 일**

- 사용자: `remove-background-from-image-free-offline`이 발행 6일째 크롤링 전(`Discovered - currently not indexed`). Search Console URL 검사 → **색인 생성 요청** 1회 권장 (API로는 요청 불가)
- Claude: 새 글 노출 검색어 확인 (`compress pdf offline`, `compress pdf without losing quality` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 허브 `free-offline-ai-tools`는 V2 판정(11-12) 후 PDF·이미지 변환 측정 글(PDF→Word·HEIC→JPG·PDF 압축) 연결 검토 (현재 `software` 측정 글 3편 → 별도 허브 `Best Free Offline File Converters` 후보)
- Claude: 발행 12편 / AdSense 신청 기준 20편
- 대시보드: `stats` DB 7개 문서 갱신(버전 8·5). 정기 세션 규칙에 따라 `data.js` 재게시는 건너뜀

## 2026-10-16 · 세션 9 (정기 실행 8회차): HEIC→JPG 오프라인 변환

세션 시각: 2026-10-15 21:11 UTC (한국 10-16 06:11). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-17 ~ 10-15, 세션 8 이후 바뀐 값만)**

- 클릭 1 → **3**, 노출 39 → **58**, CTR 5.2%, 평균 순위 21.2
  - `turn-off-ai-in-chrome` **클릭 2**·노출 36 (순위 10.8, 세션 8의 5.4보다 낮은 순위 노출이 늘어 평균 하락) / `transcribe-audio-offline-free` 12 (26.3) / `check-if-image-is-ai-generated` 8 (64.2) / `gemini-gems-to-skills` 첫 노출 1 (7.0) / 홈 1클릭
  - 새 검색어: `offline transcription software` 2 (79위), `synthid checker` 1 (86위), `turn off ai` 2 (57.5위)
- sitemap 마지막 다운로드 10-15 03:42 UTC (변화 없음). URL 검사: `convert-pdf-to-word-offline-free`(10-15 발행) `URL is unknown`, `remove-background-from-image-free-offline` `Discovered - currently not indexed` 유지 (발행 5일째) → 10편 중 8편 색인
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                       | 카테고리   | 유형                       | 직접 검증                                                                                                   |
| -------------------------- | ---------- | -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `convert-heic-to-jpg-free` | `software` | 비교 + How-to (측정형, 검색형) | 직접 만든 HEIC 24장(CC0 사진 → 4032×3024 Display P3, GPS·날짜, 세로 4장은 irot+EXIF 회전)을 XnConvert 1.118·ImageMagick 7.1.2·GIMP 3.2.6으로 변환, 원본 대비 ΔE2000·메타데이터·회전·속도 측정 + 설정 변경 후 재측정 |

- 선정 근거: 백로그 34. Trends(미국 3개월, 기준 `remove background` 35.7): `heic to jpg` **8.8** · `png to jpg` 4.0 · `compress video` 2.5 · `webp to jpg` 1.9. 자동완성: "heic to jpg" 34개(converter·windows·bulk·free·offline), "convert heic to jpg" 25개(windows 11·on mac·on iphone)
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Google Trends 미국 급상승 10개: 스포츠·화재·"varonis"(주식) → IT 도구 주제 없음. 공식 피드 새 항목: Windows 11 새 Photos 앱(Insider, HEIC 편집 포함)·Windows 11 기능 업데이트 글(10-15) → 직접 검증 불가라 새 글로 쓰지 않고 HEIC 글에 Photos 앱 소식 1문장으로 반영
- 적용한 노하우: 검색형 제목 53자·설명 155자, 측정 규모 제목 표기, 이미지 5장(대표 그래프 1200×675 + 설정 후 색·메모리 그래프 + 같은 사진 색 비교 + **직접 캡처한 앱 설정 화면 2장**(XnConvert·GIMP, Xvfb)), 요약 표 → 사실 확인표에 기록
- 내부 링크: 새 글 → 허브·배경 제거·OCR·PDF→Word·AI 이미지 판별 (5개). `convert-pdf-to-word-offline-free`에서 새 글로 역링크 1개 (V 기록 대상 아님). V1·V2 대상 글은 판정 전이라 변경하지 않음
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 10개, og:image 생성, 본문 이미지 5장 모두 width·height 지정

**측정값 (Xeon 2.8GHz 4코어, RAM 16GB, GPU 없음, 24장 일괄 × 3회 중앙값)**

| 도구 (기본 설정)  | 색 차이 ΔE2000 (중앙값) | 색 프로필 | GPS·날짜 | 세로 회전 | 24장 시간 | 최대 RAM | 평균 크기 |
| ----------------- | ----------------------- | --------- | -------- | --------- | --------- | -------- | --------- |
| XnConvert 1.118   | 1.63                    | 0/24      | 24/24    | 4/4       | **33초**  | 255MB    | 2.03MB    |
| ImageMagick 7.1.2 | **0.61**                | 24/24     | 24/24    | 4/4       | 55초      | 244MB    | 2.85MB    |
| GIMP 3.2.6        | 1.60                    | 0/24      | **0/24** | 4/4       | 67초      | 448MB    | 2.50MB    |

- 설정 변경 후: XnConvert **Preserve color profile** 켬 → ΔE 0.67, GIMP **Save Exif·Save color profile** 켬 → ΔE 0.63·GPS 24/24. XnConvert Preserve Metadata 끔 + 색 프로필 켬 → GPS·날짜 0/24, ΔE 0.67 (공유 전 위치 제거 방법)

**알게 된 것**

- 색 프로필을 버리는 변환기는 겉보기엔 정상이라 단어·해상도 비교로는 안 드러남 → 원본 대비 ΔE와 같은 사진 비교 이미지로 차이를 보여 줌. 기본 설정이 결론을 가르는 주제(메타데이터·색)는 "기본값 vs 설정 변경"을 둘 다 측정해야 함
- GUI 앱도 측정 가능: Xvfb + xdotool로 XnConvert(Qt) 창을 열어 클릭·스크린샷. 부족한 라이브러리(`libxcb-cursor0`, `libxcb-icccm4`, `libxcb-keysyms1`)는 apt로 설치. GIMP 3.2.6 AppImage는 `gimp-console --batch-interpreter python-fu-eval`로 배치 가능. 창 관리자가 없어 키 입력이 캔버스로 가는 경우가 있음 → 입력 전 `xdotool windowfocus`, 결과를 GUI 결과와 대조
- `pkill -f`/`pgrep -f` 패턴이 내 셸 명령 문자열과도 맞아 셸이 종료됨 (exit 144) → 프로세스 이름(`pgrep -x`)이나 PID로 종료
- Wikimedia Commons API·upload.wikimedia.org는 컨테이너에서 429(Too Many Requests) → 퍼블릭 도메인 사진은 Hugging Face `Spawning/PD12M` 메타데이터(parquet) + `pd12m.s3.us-west-2.amazonaws.com` 사본으로 받음. download.gimp.org·xnview.com·imagemagick.org(→ GitHub Releases 고정 태그)·apps.microsoft.com 접속 가능
- 실수: Wikimedia 다운로드 재시도 중 요청 User-Agent에 계정 이메일을 1회 넣음 (요청은 429로 거부). 외부 요청 헤더에 개인 정보를 넣지 않도록 함
- 1차 출처가 없는 일반 상식(“iPhone은 Display P3로 저장”, “ΔE 1 이하는 안 보임”)은 글에 쓰지 않고 측정 조건으로만 표현

**다음 할 일**

- 사용자: `remove-background-from-image-free-offline`이 발행 5일째 크롤링 전(`Discovered - currently not indexed`). Search Console URL 검사 → **색인 생성 요청** 1회 권장 (API로는 요청 불가, 세션 8에서도 요청)
- Claude: 새 글 노출 검색어 확인 (`heic to jpg`, `convert heic to jpg free` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`, 클릭 2회로 가장 성과 있는 글)
- Claude: 발행 11편 / AdSense 신청 기준 20편
- 대시보드: `stats` DB 7개 문서는 갱신됨(버전 7·4). 비로그인 열람용 `data.js` 스냅숏 재게시는 세션 8에 이어 이번에도 Claude Code 자동 모드 권한 분류기가 거부("Live-Shared Artifact Sensitive Delta") → 비로그인 화면은 세션 7 값. → **사용자 결정(2026-10-16)**: 정기 세션에서는 `data.js`를 자동으로 올리지 않음. 공개 링크 아티팩트는 `Artifact` 허용 규칙이 있어도 정기 실행에서 재게시할 수 없음(문서: 정기 실행의 무확인 재게시는 공개 링크가 아닌 아티팩트만 가능). README 대시보드 절차 4단계를 대화형 세션 전용으로 바꿈

## 2026-10-15 · 세션 8 (정기 실행 7회차): PDF→Word 오프라인 변환

세션 시각: 2026-10-15 09:10 UTC (한국 18:10). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-17 ~ 10-15, 세션 7 이후 바뀐 값만)**

- 노출 33 → **39**, 클릭 1(홈), CTR 2.6%, 평균 순위 15.4
  - `turn-off-ai-in-chrome` 21 → 25 (순위 5.4) / `transcribe-audio-offline-free` 6 → 8 (18.8) / `check-if-image-is-ai-generated` 5 (62.2)
  - 새 검색어 `speech to text offline` (85위, `transcribe-audio-offline-free`로 추정)
- sitemap 10-15 03:42 UTC 재다운로드. URL 검사: `image-to-text-offline-free` **`Submitted and indexed`** (10-15 07:14 UTC 크롤링, 발행 당일) → 9편 중 8편 색인. `remove-background-from-image-free-offline`은 `URL is unknown` → 다시 **`Discovered - currently not indexed`** (발행 후 4일째 미크롤링)
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                               | 카테고리   | 유형                  | 직접 검증                                                                                                   |
| ---------------------------------- | ---------- | --------------------- | ----------------------------------------------------------------------------------------------------------- |
| `convert-pdf-to-word-offline-free` | `software` | 비교 (측정형, 검색형) | 직접 만든 PDF 11개(텍스트 10개 15쪽 + 스캔 1개)를 LibreOffice 26.8.1·pdf2docx 0.5.13·Calibre 7.6으로 변환, 정답과 비교 + 편집 테스트 + OCRmyPDF 후 재변환 |

- 선정 근거: Trends(미국 3개월, 기준 `remove background` 35.3): `pdf to word` **23.4** · `passkey` 16.6 · `heic to jpg` 8.6 · `compress pdf` 4.9 · `upscale image` 1.3 · `photo enhancer` 1.4. 자동완성: "pdf to word offline" 16개(Google·Bing·YouTube: converter·free download·for pc), "convert pdf to word free" 29개(no sign up·ocr·editable). 상위 결과가 업로드형 온라인 변환기 → "업로드 없이"·직접 측정으로 차별화
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Google Trends 미국 급상승 10개: 연예·스포츠·복권·"fortnite servers"(게임 서버 장애) → IT 도구 주제 없음. 공식 피드 새 항목(Chrome 조기 안정판 업데이트, Gemini 4 Argon 안전성 글) → 새 글 대상 아님
- 적용한 노하우: 검색형 제목 53자·설명 156자, 측정 규모 제목 표기, 이미지 5장(대표 그래프 1200×675 + 송장 표 비교 + 편집 테스트 + 2단 뉴스레터 비교 + 속도·메모리), 요약 표 → 사실 확인표에 기록. **첫 `software` 카테고리 측정 글**
- 내부 링크: 새 글 → OCR 글·허브·받아쓰기·배경 제거 (4개). `image-to-text-offline-free`에서 새 글로 역링크 1개 (V 기록 대상 아님). 허브는 V2 판정 전이라 변경하지 않음
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 9개, og:image 생성, 본문 이미지 5장 모두 width·height 지정

**측정값 (Xeon 2.8GHz 4코어, RAM 16GB, GPU 없음, 기본 설정, 파일당 1회 실행 × 3회 중앙값)**

| 도구             | 문단 유지 | 격자 표 재구성(/4) | 텍스트 상자 비율 | 2단 순서 유지 | 초/파일 | 최대 RAM |
| ---------------- | --------- | ------------------ | ---------------- | ------------- | ------- | -------- |
| pdf2docx 0.5.13  | **95.5%** | **4**              | 0%               | 10/10         | 0.68    | 125MB    |
| LibreOffice 26.8 | 0%        | 0                  | 100%             | 2/10          | 0.71    | 202MB    |
| Calibre 7.6      | 84%       | 0                  | 0%               | 2/10          | 0.94    | 100MB    |

- 3개 모두 텍스트 PDF의 단어 100%·이미지 3/3 유지, 스캔 PDF는 0%. OCRmyPDF 17.13(3.1초) 후 재변환: LibreOffice 95.5%, pdf2docx·Calibre 0% (보이지 않는 OCR 텍스트 층을 무시)

**알게 된 것**

- LibreOffice는 `--convert-to docx`만 쓰면 PDF를 Draw로 열어 "no export filter" 오류 (24.2·26.8 모두). `--infilter=writer_pdf_import` 필요. 결과는 한 줄마다 텍스트 상자라 겉모양은 가장 비슷하지만 문장을 넣으면 상자 밖으로 잘림
- 렌더링 함정: `dpkg -x`로 푼 LibreOffice 26.8은 시스템 글꼴 대체 설정을 못 써 Helvetica를 Noto Serif로 그려 글자가 잘려 보였음 → 결과 화면은 시스템 LibreOffice 24.2(Liberation Sans)로 다시 렌더링. 처음 화면만 보고 "LibreOffice가 글자를 자른다"고 쓸 뻔함 → 렌더링 환경의 글꼴(`pdffonts`)부터 확인
- download.documentfoundation.org(LibreOffice deb 220MB)·archive.ubuntu.com(calibre·tesseract) 접속 가능. download.calibre-ebook.com·code.calibre-ebook.com은 curl TLS 오류(exit 60) → apt calibre 7.6.0 사용
- 정답을 아는 문서를 직접 만들면 "단어 보존"은 세 도구 모두 100%라 변별력이 없음 → 편집 가능성(문단·표·텍스트 상자) 지표가 결론을 가름

**다음 할 일**

- 사용자: `remove-background-from-image-free-offline`이 발행 4일째 크롤링 전(`Discovered`↔`URL is unknown` 반복). Search Console URL 검사 → **색인 생성 요청** 1회 권장 (API로는 요청 불가)
- Claude: 새 글 노출 검색어 확인 (`pdf to word offline`, `convert pdf to word free` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 발행 10편 / AdSense 신청 기준 20편
- 대시보드: `stats` DB 7개 문서는 갱신됨(버전 6·3). 비로그인 열람용 `data.js` 스냅숏 재게시는 Claude Code 자동 모드 권한 분류기가 거부 → 비로그인 화면은 세션 7 값. 다음 세션에서 다시 시도, 계속 막히면 사용자가 허용 여부 결정

## 2026-10-15 · 세션 7 (정기 실행 6회차): 무료 오프라인 이미지→텍스트(OCR)

세션 시각: 2026-10-14 21:10 UTC (한국 10-15 06:10). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-16 ~ 10-14, 세션 6 이후 바뀐 값만)**

- **첫 클릭 1** (홈 `/`, 순위 3.0). 노출 23 → **33**, CTR 3.0%, 평균 순위 14.6
  - `turn-off-ai-in-chrome` 노출 15 → 21 (순위 5.2) / `transcribe-audio-offline-free` 6 (9.5) / `check-if-image-is-ai-generated` 5 (62.2)
  - 검색어 2개(`google ai gone` 3위, `synthid detector` 143.5위)는 같음
- URL 검사: `free-offline-ai-tools`(10-14 19:12 UTC 크롤링)·`gemini-gems-to-skills`(11:38 UTC) **`Submitted and indexed`** → 8편 중 7편 색인. `remove-background-from-image-free-offline`은 `Discovered - currently not indexed` → **`URL is unknown to Google`**로 바뀜 (세션 5에서 발견됐던 URL이 다시 미발견 상태로 표시, 원인 불명)
- 성과 검증: 판단 시점이 지난 행 없음 (V1 판단 11-11) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                         | 카테고리   | 유형                      | 직접 검증                                                                                                   |
| ---------------------------- | ---------- | ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `image-to-text-offline-free` | `ai-tools` | 비교 (측정형, 검색형)     | OCR 4개 엔진 7개 설정(Tesseract 5.3.4 기본·`--psm 6`, RapidOCR 3.10 small·medium, EasyOCR 1.7.2, docTR 1.1.0 기본·mobile)을 직접 만든 50장(스크린샷·11px 글자·스캔·사진·영수증 각 10장)으로 측정 |

- 선정 근거: 백로그 32(허브 확장용 번역·OCR). Trends(미국 3개월, 기준 `remove background` 35.5): `ocr` 13.2 · `image to text` 9.8 · `offline translator` 0.0 · `extract text from image` 0.0 → OCR, 주 검색어 `image to text`. 자동완성: "image to text free" 26개(Google·Bing·YouTube: no sign up·unlimited·offline), "image to text offline" 19개, "ocr offline" 21개(windows·free·software)
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Google Trends 미국 급상승 10개: 정치·스포츠·날씨 → IT 주제 없음. 공식 피드 새 항목(Python 3.15 Windows on Arm, Apple TV·HomePod) → 일반 사용자 검색 수요 약해 보류
- 적용한 노하우: 검색형 제목 51자·설명 154자, 측정 규모 제목 표기, 이미지 5장(대표 표 그래프 1200×675 + 속도·메모리 + 테스트 이미지 예시 + 영수증·작은 글자 실제 출력 비교), 요약 표 → 사실 확인표에 기록
- 내부 링크: 새 글 → 허브 + 측정 글 3편. **허브 `free-offline-ai-tools`에 OCR 섹션·요약 표 행 추가, `updatedAt` 2026-10-15** (검증 기록 V2). V1 대상 3편은 판정 전 추가 변경 금지 규칙 때문에 새 글 역링크를 넣지 않음 (허브가 역링크 역할)
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 9개, og:image 생성, 이미지 모두 width·height 지정. 허브 `dateModified` 2026-10-15

**측정값 (Xeon 2.8GHz 4코어, RAM 16GB, GPU 없음, 기본 설정)**

| 엔진                  | 거의 완벽(CER≤2%, /50) | 단어 재현율 | 영수증 숫자 | 초/장 | 최대 RAM |
| --------------------- | ---------------------- | ----------- | ----------- | ----- | -------- |
| Tesseract `--psm 6`   | **42**                 | 96.4%       | 86%         | 0.54  | 0.05GB   |
| Tesseract 기본        | 33                     | 93.1%       | 51%         | 0.55  | 0.05GB   |
| docTR 기본            | 33                     | 99.0%       | 97%         | 2.99  | 1.34GB   |
| docTR mobile          | 31                     | **99.1%**   | 98%         | 1.06  | 1.09GB   |
| RapidOCR small        | 34                     | 93.6%       | 95%         | 1.50  | 0.61GB   |
| RapidOCR medium       | 35                     | 97.3%       | 98%         | 26.4  | 0.89GB   |
| EasyOCR               | 1                      | 85.6%       | 47%         | 3.56  | 1.79GB   |

**알게 된 것**

- 정확도 지표를 하나만 쓰면 결론이 뒤집힘: docTR은 단어는 99% 읽지만 영수증 가격을 별도 블록으로 출력해 CER 기준 영수증 0/10 → "단어 재현율(순서 무시)"과 "거의 완벽(순서 포함)"을 함께 보고
- Tesseract 기본(`--psm 3`)은 영수증 10장 중 7장에서 가격 열 대부분을 누락, `--psm 6`으로 바꾸면 숫자 재현율 51% → 86%. 작은 글자에서는 "I"를 "|"로 읽음
- RapidOCR(PP-OCRv6 small)은 화면 폭 전체의 긴 줄을 흩어진 글자로 내놓는 경우가 있음 (스크린샷 20장 중 12장 단어 재현율 97% 미만). medium은 덜하지만 약 18배 느림
- 저작권 문제 없는 정답 텍스트 확보: Project Gutenberg(퍼블릭 도메인) 본문 + 직접 만든 영수증으로 이미지를 생성해 정답을 정확히 앎. gutenberg.org·modelscope.cn·doctr-static.mindee.com·EasyOCR 모델(GitHub Releases 고정 태그)·apt(archive.ubuntu.com) 모두 접속 가능
- 측정 중 실수: (1) 실행 중인 `run_all.sh`를 수정·폴더 이름 변경 → 스크립트 중단, 나머지 엔진은 같은 순서로 따로 실행 (결과 영향 없음). (2) RapidOCR medium 측정 중 `pnpm install`(약 15초)을 함께 실행 → 이미지 1~2장 시간이 늘었을 수 있음 (중앙값 사용, 18배 차이라 결론 영향 없음). (3) Python 파일 쓰기 버퍼 때문에 결과 줄 수로 진행률을 볼 수 없었음 → 다음엔 `flush`
- Apple Live Text 문서는 오프라인 동작 여부를 밝히지 않음 → 글에서 오프라인이라고 쓰지 않음. Microsoft는 Snipping Tool 텍스트 인식이 기기 안에서 처리된다고 명시

**다음 할 일**

- Claude: `remove-background-from-image-free-offline` `URL is unknown` 추적 (이번 세션 확인: 배포된 sitemap에 포함, HTTP 200, `index, follow`, canonical 자기 자신 → 사이트 쪽 문제는 없음). 다음 세션에도 같으면 사용자에게 Search Console URL 검사 → 색인 요청 제안
- Claude: 새 글 노출 검색어 확인 (`image to text offline`, `ocr offline` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 발행 9편 / AdSense 신청 기준 20편

## 2026-10-14 · 세션 6 (정기 실행 5회차): 허브 글 — 무료 오프라인 AI 도구

세션 시각: 2026-10-14 09:10 UTC (한국 18:10). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-16 ~ 10-14, 세션 5 이후 바뀐 값만)**

- 노출 21 → **23** (`turn-off-ai-in-chrome` 13 → 15, 순위 5.7), 클릭 0, 평균 순위 15.6. 검색어 2개는 같음
- URL 검사: `free-offline-text-to-speech` **`Submitted and indexed`** (10-14 00:02 UTC 크롤링). `remove-background-from-image-free-offline`은 `Discovered - currently not indexed` 유지, `gemini-gems-to-skills`(10-14 발행)는 `URL is unknown`
- 성과 검증: 판단 시점이 지난 행 없음 → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                    | 카테고리   | 유형                           | 직접 검증                                                                                                   |
| ----------------------- | ---------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `free-offline-ai-tools` | `ai-tools` | 허브 + 비교 (측정형, 검색형) | 오프라인 챗봇 7개 모델(Qwen3.5 0.8B·2B·4B, Gemma 4 E2B·E4B, Llama 3.2 3B, Phi-4-mini)을 llama.cpp로 속도·RAM·20문항·이메일 요약 측정 + 기존 측정 글 3편 결과 정리 |

- 선정 근거: 백로그 28 (허브, traffic-playbook 3). 자동완성: "offline ai tools" Google·Bing·YouTube 14개(for pc·for mac·free·download), "free offline ai tools" 18개(Google·Bing: is there an offline ai, ai that works offline, offline ai for windows). 기존 3편은 받아쓰기·TTS·배경 제거뿐이라 검색 의도의 중심인 "오프라인 챗봇"을 새로 측정해 허브를 채움
- 반복 일정: Chrome 156은 10-20, Windows 다음 Patch Tuesday 11-10 → 이번 세션 해당 없음
- 다른 후보: passkey 설정(자동완성 27개, Google 블로그 10-08 글)은 수요가 크지만 Google·Apple 공식 문서 경쟁이 강하고 직접 검증이 어려워 백로그에 추가. Google Trends 미국 급상승 10개: 스포츠·연예·"spectrum outage"(통신 장애) → IT 도구 주제 없음
- 적용한 노하우: 첫 허브 글(노하우 3, 제목에 연도), 검색형 제목 53자, 이미지 5장(대표 그래프 1200×675 + 그래프 2 + 실제 출력 비교 1 + rembg 화면 재사용 1), 요약 표 → 사실 확인표에 기록
- 내부 링크: 새 글 → 측정 글 3편 + `turn-off-ai-in-chrome`, 측정 글 3편에서 허브로 역링크 (검증 기록 V1)
- 빌드 HTML 확인: title·description(160자)·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 11개, og:image 생성, 본문 이미지 5장 모두 width·height 지정

**측정값 (Xeon 2.3GHz 4코어, RAM 16GB, GPU 없음, llama-cpp-python 0.3.36, Q4_K_M, 3회 중앙값)**

| 모델          | 20문항 | 이메일 요약(초) | 날짜 4개 | 단어/초 | 최대 RAM |
| ------------- | ------ | --------------- | -------- | ------- | -------- |
| Qwen3.5 0.8B  | 12     | 14 (13줄, 지시 무시) | 4   | 12.8    | 1.3GB    |
| Qwen3.5 2B    | 19     | 10              | 3        | 6.7     | 2.7GB    |
| Gemma 4 E2B   | 18     | 10              | 4        | 8.8     | 4.2GB    |
| Llama 3.2 3B  | 17     | 16              | 3        | 7.1     | 4.4GB    |
| Phi-4-mini    | 16     | 17              | 3        | 5.5     | 5.4GB    |
| Qwen3.5 4B    | 19     | 22              | 4        | 3.9     | 5.6GB    |
| Gemma 4 E4B   | 19     | 17              | 4        | 4.7     | 7.8GB    |

**알게 된 것**

- `github.com/.../releases/latest` 리다이렉트도 403 → llama.cpp 사전 빌드 바이너리 대신 PyPI `llama-cpp-python` 소스 빌드(약 5분, cmake·gcc 있음). Qwen3.5·Gemma 4 아키텍처 모두 0.3.36에서 동작
- huggingface.co GGUF 7개(약 17GB) 약 6분에 다운로드. 다운로드 중 측정한 첫 실행은 속도 편차가 커서 다운로드 완료 후 재측정 (세션 3 교훈 재확인)
- 자동 채점은 실행 후 오답을 직접 보고 고쳐야 함: "1 7/8"(=1.875), "225 minutes"가 처음엔 오답 처리됨 → 채점 함수 수정, 저장된 답으로 재채점 (`score_20_at_run`에 원래 점수 보존)
- 측정 서버 CPU가 세션마다 다를 수 있음 (이번 2.3GHz, 세션 3·4는 2.8GHz) → 글에 행 간 비교 금지 명시. 측정 글은 `lscpu` 결과를 항상 저장
- LM Studio 홈이 "Bionic"(에이전트 앱, 유료 클라우드 플랜)으로 바뀜. 무료 플랜은 로컬 모델 포함. Ollama도 클라우드 모델이 생겨 `OLLAMA_NO_CLOUD=1`로 로컬 전용 가능 → "오프라인" 글에서 앱의 클라우드 기능을 구분해야 함

**다음 할 일**

- Claude: 허브 글 노출 검색어 확인 (`offline ai tools for pc` 등), 새 측정 글(예: 오프라인 번역·OCR)이 생기면 허브 표에 추가하고 `updatedAt` 갱신
- Claude: 검증 기록 V1(허브 역링크) 2026-11-11 판정
- Claude: `remove-background-from-image-free-offline`·`gemini-gems-to-skills` 색인 여부 확인
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 발행 8편 / AdSense 신청 기준 20편

## 2026-10-14 · 세션 5 (정기 실행 4회차): Gemini Gems → 스킬 전환

세션 시각: 2026-10-13 22:10 UTC (한국 10-14 07:10). 열린 PR 없음.

**지표 (Search Console API, `gsc_report.py`, 2026-09-15 ~ 10-13, 미확정 데이터 포함)**

- 클릭 0 · **노출 21** (세션 4의 7에서 증가) · 평균 순위 16.4
  - `turn-off-ai-in-chrome`: 노출 13, 평균 순위 5.5 / `transcribe-audio-offline-free`: 노출 5, 순위 10.6 / `check-if-image-is-ai-generated`: 노출 3, 순위 73.3
  - 검색어(익명 처리 제외 2개): `google ai gone` 순위 3, `synthid detector` 순위 207 (세션 4와 같음)
- sitemap: 오류·경고 0, **10-13 08:11 UTC 재다운로드** (10-11 이후 처음)
- URL 검사: 4편 `Submitted and indexed`. `free-offline-text-to-speech`는 `URL is unknown` → **`Discovered - currently not indexed`**로 진전, `remove-background-from-image-free-offline`도 `Discovered - currently not indexed` (둘 다 크롤링 전)
- 성과 검증: 검증 기록에 판단 시점이 지난 행 없음 (기록 0건) → 판정·노하우 상태·writing-guide 변경 없음
- 해석(가설): 사이트맵 재다운로드 후 새 글 2편이 발견됨 → 다음 1~2일 내 크롤링 예상. 노출은 아직 글당 100회 미만이라 제목·설명 개선 판단 불가

**발행한 글**

| slug                    | 카테고리   | 유형                          | 직접 검증                                                                                                                                  |
| ----------------------- | ---------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `gemini-gems-to-skills` | `ai-tools` | How-to + Explainer (피드형) | 예시 Gem(지식 파일 4개)을 SKILL.md 폴더·zip으로 변환해 skills-ref 0.1.1로 검사, Gem 이름 8개 이름 규칙 검사. Gemini 로그인 화면은 확인 못 함 |

- 선정 근거: 백로그 7 (Gems → Skills). 10-13 Google이 Gemini 앱 스킬 배포 시작 + Workspace 배포 연기 공지 (Workspace Updates 피드, `discover`). 자동완성 "gemini skills" 25개(Google·Bing·YouTube), "gemini skills vs gems" Google·Bing 둘 다. 경쟁 글(Android Central·PCWorld 등)은 있으나 "유료 전용" 같은 틀린 보도가 있어 Google 도움말 기준 정리 + 직접 변환 검사로 차별화
- 반복 일정: 10월 Patch Tuesday(10-13) Windows 10 업데이트 `KB5126657`(19045.7807) 확인. 자동완성에 KB 번호·설치 오류 검색어가 없음(`KB5126657`은 Bing에 다른 KB만) → 세션 3 지침대로 새 글 대신 `windows-10-esu-extended` 빌드 표만 갱신(`updatedAt` 10-14). "windows 10 october 13 2026"·"windows 10 security updates october 2026"은 자동완성에 있음 → 기존 ESU 글이 받는 검색어인지 GSC로 관찰
- 다른 후보: Gemini 4 Argon(10-13 출시, 자동완성 16개: free·vs opus 5.5·pricing)은 뉴스·벤치마크 경쟁이 심하고 직접 검증 불가 → 보류. CISA에 Windows 명령 주입 취약점(CVE-2026-96951, 10-13) 추가 → 소비자 검색 수요 없음
- Google Trends 미국 급상승(10개): 스포츠·연예 → IT 주제 없음
- 적용한 노하우: **피드형 제목 67자**(노하우 1·5, ToolProof 첫 피드형), 이미지 3장(일정 그래프 대표 1200×675 + 직접 실행 결과 화면 2), 요약 표 4개 → 사실 확인표에 기록
- 내부 링크: 새 글 → `turn-off-ai-in-chrome`·`check-if-image-is-ai-generated` (관련 글 2편뿐이라 How-to 목표 4개 미달), `turn-off-ai-in-chrome`에서 새 글로 역링크
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 9개, og:image 생성, 본문 이미지 3장 모두 width·height 지정

**측정값 (Linux, Python 3.11, skills-ref 0.1.1)**

| 검사                            | 결과                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| 예시 Gem 지식 파일 4개          | .csv·.md 유지, .docx 변환 필요(미지원), .DS_Store 제거 → `agentskills validate` 통과  |
| 이름 8개 그대로 사용            | 7개 오류(대문자·공백·기호·연속/앞 하이픈·64자 초과), `résumé-coach`는 검사 통과       |
| `résumé-coach` (악센트 소문자)  | skills-ref 0.1.1은 유니코드 소문자 허용 → 통과, 스펙 문서(agentskills.io)는 a-z만 허용 |

**알게 된 것**

- (세션 후 추가, 사용자 질문으로 확인) Google Trends 상대 검색량 (`trends_compare.py`, 미국, 최근 3개월, 최고점 = 100): `remove background` 평균 35.5 · `gemini 4 argon` 1.1(최근 7일 8.1, 출시 직후 급증) · `gemini skills` 0.3(최근 7일 0.9) · `gemini gems` 0.2. 즉 **Gems → 스킬 주제는 배경 제거보다 검색량이 수십 분의 1 수준**. `gemini skills` 관련 검색어 급상승: "automate tasks using gemini skills"(Breakout), "gemini gems"(+250%), "gemini spark"(+70%)
- 반성: 주제 선정 때 수요를 자동완성(있다/없다)으로만 봐서 크기를 비교하지 못했고, 주 검색어 `gemini gems to skills`는 자동완성 조회도 안 했음 → 다음 세션부터 후보끼리 + 기존 글 주 검색어(기준)를 Trends로 비교해 backlog에 기록 (README 선정 기준 1번에 반영)
- Google 문서끼리 메뉴 경로가 다름: Gems 전환 FAQ는 **Settings > Skills**, 스킬 도움말은 **Customize > Skills** → 글에 둘 다 표기. Workspace 관리자 문서는 11-17에 "All users"의 Gems가 Settings로 이동한다고 함
- 스킬 유료 여부(backlog 미확인 항목): Google 도움말이 "Skills are available without a Google AI subscription"으로 명시 → 해결. 일부 언론의 "paywalled" 보도는 Google 문서와 다름
- 공식 참조 검사기(skills-ref 0.1.1)가 스펙 문서보다 느슨함(악센트 문자 허용) → 검사 도구 결과만 믿지 않고 스펙 원문도 대조해야 함
- support.google.com·knowledge.workspace.google.com·services.google.com(PDF)·agentskills.io·PyPI(skills-ref) 모두 curl로 접속 가능
- frontmatter 설명에 콜론(`:`)이 있으면 YAML 파싱 실패 → 따옴표로 감쌈

**다음 할 일**

- Claude: 첫 피드형 글(`gemini-gems-to-skills`)의 Discover 노출 확인 (`gsc_report.py --type discover`, 발행 2주 후). 피드형 3편 이상 쌓이면 검색형과 노하우 1 비교
- Claude: 11월 Gems 종료일(개인 계정)·Drive 파일·공유 기능 추가가 발표되면 새 글 갱신 (Workspace Updates·Gemini 도움말 확인)
- Claude: `free-offline-text-to-speech`·`remove-background-from-image-free-offline` 색인 여부 확인
- Claude: 허브 글 후보(backlog 28) 수요 확인, Chrome 156(10-20) 반영 여부 검토
- Claude: 이미지 적용 글(세션 4·5부터)과 미적용 글 5편의 발행 후 28~56일 지표 비교 → 노하우 7 판정

## 2026-10-13 · 세션 4 (정기 실행 3회차): 무료 오프라인 배경 제거

**지표 (Search Console API, `gsc_report.py`, 2026-09-15 ~ 10-13, 미확정 데이터 포함)**

- **첫 노출**: 클릭 0 · 노출 7 · 평균 순위 38.1
  - `turn-off-ai-in-chrome`: 노출 3, 평균 순위 7.0 / `transcribe-audio-offline-free`: 노출 3, 순위 13.0 / `check-if-image-is-ai-generated`: 노출 1, 순위 207
  - 검색어(익명 처리 제외 2개): `google ai gone` 순위 3 (Chrome AI 글로 추정), `synthid detector` 순위 207
- sitemap: 오류·경고 0 (마지막 다운로드 10-11 06:33 UTC, 이후 재다운로드 없음)
- URL 검사: 4편 `Submitted and indexed`, `free-offline-text-to-speech`는 **`URL is unknown to Google`** (10-12 발행, IndexNow 제출 후에도 Google 미발견)
- 성과 검증: 검증 기록에 판단 시점이 지난 행 없음 (기록 0건) → 판정·노하우 상태 변경 없음
- 해석(가설): 노출이 아직 한 자릿수라 제목·설명 개선 판단 불가. `google ai gone`은 Chrome AI 글 소제목·FAQ 보강 후보 (노출 100회 이상 쌓이면 판단)

**발행한 글**

| slug                                        | 카테고리   | 유형                       | 직접 검증                                                                                                                   |
| ------------------------------------------- | ---------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `remove-background-from-image-free-offline` | `ai-tools` | 비교 (측정형, 검색형 채널) | rembg 2.0.85 8개 모델을 AIM-500 50장(정답 알파 매트)으로 IoU·속도 측정, CLI 1장 메모리, 웹 UI 실행·스크린샷, EXIF 제거 확인 |

- 선정 근거: 백로그 10 (점수 37, 상시 수요, 직접 측정 가능). 자동완성: "remove background from image free" 28개(Google·Bing·YouTube), "remove background offline" 20개, "rembg" 18개, "birefnet" 19개. 일반 독자 각도는 "업로드·가입 없이 무료" + 내장 웹 UI 스크린샷 + Mac·Windows·Office 기본 기능
- 반복 일정: Windows 10월 Patch Tuesday는 10-13 17:00 UTC 배포라 세션 시점(02:00 UTC)에는 미배포 → 다음 세션으로 (backlog 29). Chrome 156은 10-20
- Google Trends 미국 급상승(10개): 정치·스포츠·연예 → IT 주제 없음. 공식 피드 새 항목: Google Health·Fitbit(10-12), Meet 양자내성 암호화 → 수요 미확인으로 보류
- 적용한 노하우: 검색형 제목 58자, 측정 규모 제목 표기, **이미지 5장(첫 이미지 사용 글)**, 대표 이미지 1200×675 측정 그래프 → 사실 확인표에 기록 (이미지 0장인 기존 5편과 비교용)
- 내부 링크: 새 글 → 3편, `check-if-image-is-ai-generated`·`transcribe-audio-offline-free`·`free-offline-text-to-speech`에서 새 글로 역링크
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개, og:image 생성, 본문 이미지 5장 모두 width·height 지정

**측정값 (4코어 Xeon 2.8GHz, GPU 없음, 투명 물체 6장 제외 44장 기준)**

| 모델                   | 깨끗(IoU≥0.95) | 실패(<0.8) | 초/장 | CLI 1장 RAM |
| ---------------------- | -------------- | ---------- | ----- | ----------- |
| bria-rmbg (rembg 기본) | 40             | 0          | 46    | 9.4GB       |
| birefnet-general       | 39             | 0          | 41    | 9.6GB       |
| birefnet-general-lite  | 38             | 0          | 30    | 7.8GB       |
| isnet-general-use      | 30             | 5          | 1.5   | 1.1GB       |
| u2netp                 | 28             | 4          | 0.3   | 0.5GB       |

(전체 8개는 `tests/remove-background-from-image-free-offline/summary.json`)

**알게 된 것**

- 측정 데이터 라이선스 확인 필요: DIS5K(배경 제거 벤치마크 표준)는 **비상업 전용** 약관 → 광고 사이트 측정에 쓰지 않음. AIM-500·P3M-10k는 MIT (이미지 저작권은 원저작자 → 글에는 데이터셋 이미지를 싣지 않고 scikit-image의 퍼블릭 도메인·CC0 사진으로 예시 그림 생성)
- rembg 2.0.85 기본 모델이 `bria-rmbg`(CC BY-NC 4.0)로 바뀌어 있음 → 가장 느리고 상업 이용 불가. 웹 UI(`rembg s`)는 Alpha matting·Post process mask가 기본으로 켜져 CLI와 결과가 다름
- 같은 프로세스에서 대형 ONNX 세션을 여러 개 열면 14GB를 넘어 OOM 종료 → 모델마다 새 프로세스로 측정. 처음엔 이를 "16GB에서 실행 불가"로 오해할 뻔했음 (단일 CLI는 9.6GB로 정상 동작)
- 네트워크: `huggingface.co` 데이터셋 parquet 다운로드 가능, Playwright(Python)로 `/opt/pw-browsers/chromium-1194` 실행해 로컬 웹 UI 스크린샷 가능 → How-to 글 스크린샷 수단으로 사용 가능
- 대형 모델 측정 50장에 약 1.5시간 소요 (모델당 25~40분) → 측정 글은 표본 크기를 미리 시간 예산에 맞춰 정함

**다음 할 일**

- Claude: 다음 세션에서 10월 Patch Tuesday(10-13) Windows 10 KB·설치 오류 검색어 확인 → Fix형 새 글 여부 판단, `windows-10-esu-extended` 빌드 표 갱신
- Claude: `free-offline-text-to-speech`가 계속 `URL is unknown`이면 원인 확인 (sitemap 재다운로드 여부)
- Claude: 허브 글 후보(backlog 28, 오프라인 AI 측정 글 3편) 수요 확인
- Claude: 이미지 적용 글(이번 글부터)과 미적용 글 5편의 발행 후 28~56일 지표 비교 → 노하우 7 판정 (최소 각 3편 필요)

## 2026-10-12 · 세션 3 (정기 실행 2회차): 무료 오프라인 TTS 비교

**지표 (Search Console API, `gsc_report.py`)**

- 2026-09-13 ~ 10-11: 클릭 0 · 노출 0
- sitemap: 오류·경고 0 (마지막 다운로드 2026-10-11 06:33 UTC)
- 글 4편 URL 검사: **모두 `Submitted and indexed`** (PASS, 마지막 크롤링 10-11 15:47~21:45 UTC). 세션 2의 `Discovered - currently not indexed`에서 하루 만에 색인

**발행한 글**

| slug                          | 카테고리   | 유형          | 직접 검증                                                                                                                                                                                 |
| ----------------------------- | ---------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `free-offline-text-to-speech` | `ai-tools` | 비교 (측정형) | sherpa-onnx 1.13.8로 TTS 11개 음성(Piper 5·Kokoro 2·KittenTTS 2·Supertonic·Matcha) 속도·명료도(Parakeet 받아쓰기 WER)·자연스러움 예측(UTMOS) 측정, piper-tts 1.8.0 CLI 설치·오프라인 실행 |

- 선정 근거: 백로그 15 (점수 36, 상시 수요, 직접 측정 가능). 자동완성: "free text to speech offline" 21개(Google·Bing·YouTube), "piper tts"·"kokoro tts" 각 21~22개로 세 곳 모두에서 하위 검색어 다수
- Google Trends 미국 급상승(10개): 전부 스포츠 → IT 주제 없음. 공식 피드 후보(Drive·Docs Markdown 지원, GPT-6 for everyone, SynthID 확대)는 backlog에 추가
- 내부 링크: `transcribe-audio-offline-free` ↔ 새 글 (같은 엔진, 반대 방향)

**측정값 (4코어 Xeon 2.8GHz, GPU 없음, 4스레드 3회 중앙값)**

| 음성                 | 1분 음성 생성 시간 | 1스레드 | 받아쓰기 오류(242단어) | UTMOS 평균(최저) |
| -------------------- | ------------------ | ------- | ---------------------- | ---------------- |
| Kokoro v1.0 af_heart | 28초               | 71초    | 4                      | 4.42 (4.33)      |
| Kokoro v0.19         | 32초               | 86초    | 2                      | 4.45 (4.37)      |
| Piper lessac medium  | 3.8초              | 8.3초   | 3                      | 4.33 (3.85)      |
| Piper amy medium     | 3.5초              | 8.5초   | 2                      | 4.36 (4.02)      |
| KittenTTS nano int8  | 25초               | 38초    | 0                      | 4.24 (3.55)      |
| Matcha               | 4.5초              | 7.0초   | 6                      | 3.90 (3.40)      |

(전체 11개는 `tests/free-offline-text-to-speech/summary.json`)

- 명료도는 모든 음성이 거의 만점(오류 0~6/242) → 차이는 속도·자연스러움·숫자 읽기
- "10/21" 같은 슬래시 날짜를 11개 중 9개가 "slash"로 읽음. KittenTTS는 "1,250" 같은 큰 숫자를 망가뜨림 (Parakeet·Whisper small 둘 다 같은 결과)

**알게 된 것**

- 첫 측정은 모델 다운로드와 겹쳐 Piper 속도가 2배 가까이 느리게 나옴 (lessac-low RTF 0.107 → 재측정 0.050). 속도는 반드시 다운로드·다른 작업이 끝난 뒤 재측정
- 네트워크: `github.com` HTML 페이지·소스 zip(archive)은 차단("GitHub access to this repository is not enabled"), Releases 다운로드·`raw.githubusercontent.com`·`k2-fsa.github.io`·`download.pytorch.org`·`en.wikipedia.org`는 가능. torch.hub는 `api.github.com` 403으로 실패 → raw 파일로 우회
- Hugging Face에서 받은 Piper 음성 파일이 한 번 잘려 받아짐(61.9MB/63.2MB) → `INVALID_PROTOBUF` 오류. 재다운로드로 해결, 글의 문제 해결 팁으로 사용
- UTMOS는 짧은 문장에서 4.2~4.45에 몰려 변별력이 작음 → 평균보다 최저값(일관성)이 더 쓸모 있는 지표

**다음 할 일**

- Claude: 다음 세션 GSC에서 첫 노출 확인 (색인 완료 → 노출 시작 여부), 노출 검색어로 글 제목·FAQ 보강 판단
- (완료) IndexNow 키 파일·제출 스크립트 추가 (`tools/indexnow.py`), 배포 후 기존 글 5편 + 홈 제출
- (해결) `ad-blog`만 바꾼 PR이 머지되지 않음 (PR #156): `jinho-blog-web` 배포가 Ignored로 건너뛰어져 필수 체크 `Vercel – jinho-blog-web`이 보고되지 않음 → 사용자가 Vercel 필수 체크 제거, CI에 `build` 잡 추가 (바뀐 패키지·의존 앱만 빌드, 항상 결과 보고)
- 사용자: 저장소 필수 체크에 `build` 추가
- Claude: 10월 Patch Tuesday(10-13) 이후 Windows 10 업데이트는 **새 글 후보로 판단** (사용자 제안): KB 번호·설치 오류 검색어가 자동완성에 나오면 Fix형 새 글로 쓰고, `windows-10-esu-extended`는 빌드 표만 갱신 + 새 글로 링크

## 2026-10-11 · 세션 2 (정기 실행 1회차): Windows 10 ESU 글

**지표 (Search Console API, `gsc_report.py`)**

- 2026-09-13 ~ 10-11: 클릭 0 · 노출 0 (도메인 연결 당일)
- sitemap: 2026-10-11 06:33 UTC 다운로드 성공, 오류·경고 0 ("가져올 수 없음"에서 정상화)
- 글 3편 URL 검사: 모두 `Discovered - currently not indexed` (크롤링 전)

**발행한 글**

| slug                      | 카테고리   | 유형               | 직접 검증                                                                                           |
| ------------------------- | ---------- | ------------------ | --------------------------------------------------------------------------------------------------- |
| `windows-10-esu-extended` | `software` | Explainer + How-to | 없음 (Windows 환경 없음). Microsoft ESU 페이지(미국·아일랜드판)·KB 문서 6개를 curl로 받아 원문 대조 |

- 선정 근거: 원래 소비자 ESU 종료일(2026-10-13)이 이틀 뒤. Microsoft가 2027-10-12로 연장했지만 검색 결과·Q&A에 옛 날짜가 아직 많음 (경쟁 공백), 광고 가치 높음
- Google Trends 미국 급상승(10개): 스포츠·연예·복권·"fall back 2026"(서머타임) → IT 도구 관련 없음, 백로그 상위 후보로 진행
- 내부 링크: 관련 기존 글 없음 (Windows 주제 첫 글) → 다음 Windows 글(14 Windows 11 26H2 AI 끄기 등)과 서로 연결

**알게 된 것**

- 네트워크 허용 범위가 넓어짐: `microsoft.com`·`support.microsoft.com`·`learn.microsoft.com`·`support.google.com`·`apple.com`·`huggingface.co`·`tool-proof.com` 접속 가능. `help.openai.com`은 여전히 403, `api.github.com` 403 (Releases 다운로드는 가능)
- Microsoft 지역별 ESU 페이지 내용이 다름: 60일 로그인 규칙은 EEA(en-ie) 페이지에만 있음
- 같은 KB(KB5122878)의 빌드 번호가 페이지마다 7720/7725로 다르게 표기 → KB 페이지 제목 기준 채택
- `pnpm install` 후 `packages/nextjs-routes/dist/cli.js`가 바뀜 → 커밋 전 되돌림
- 배포 사이트 `https://tool-proof.com` 200 응답 확인
- 주제 발굴 소스 확장: Trends 급상승 RSS에는 IT 주제가 거의 없음 → 공식 피드·CISA·자동완성(Google·Bing·YouTube) 조회 스크립트 [tools/demand_check.py](tools/demand_check.py) 추가, README "주제 발굴 소스"에 정리. Wikipedia 조회수는 검색 의도가 달라 제외 (사용자 결정)
- ESU 글 보강: YouTube 자동완성의 "esu not showing"·"esu local account" 반영 (소제목 문구, 로컬 계정 절)

**다음 할 일**

- Claude: 다음 세션 GSC 재조회 (색인 시작 여부). 색인 후 IndexNow 구성
- Claude: 10월 Patch Tuesday(10-13) 이후 글의 "최신 빌드" 표 갱신 (`updatedAt`)
- Claude: Hugging Face 접속이 가능해져 백로그 15(TTS)·10(배경 제거) 측정 범위 확대 가능
- 사용자: Bing Webmaster Tools 등록 (이전 세션에서 이월)

## 2026-10-11 · 세션 1 (계속): 도메인·호스팅 연결

- 도메인 `tool-proof.com` 구매·Vercel `ad-blog` 프로젝트(Pro 플랜)에 연결, `NEXT_PUBLIC_SITE_URL` Production 설정 (사용자)
- `NEXT_PUBLIC_SITE_URL=https://tool-proof.com`으로 로컬 빌드해 확인: robots `Allow: /` + sitemap 주소, 전 페이지 `index, follow`, canonical·og:url·JSON-LD·RSS가 모두 `https://tool-proof.com` 기준
- 실제 배포 사이트는 컨테이너 네트워크 제한으로 직접 확인 못 함
- `ad-blog` Vercel 프로젝트 추가 후 상태 체크 이름이 `Vercel` → `Vercel – {프로젝트}`로 바뀌어 main 머지가 막힘 → 사용자가 필수 체크를 `Vercel – jinho-blog-web`으로 변경
- Search Console: 도메인 속성 확인(DNS TXT), sitemap 제출(첫 상태 "가져올 수 없음" — 새 속성에서 흔한 일시 상태, robots·sitemap 형식은 정상 확인), 글 3편 색인 요청 (사용자)
- 정기 실행 Routine "ToolProof 정기 글 작성" 생성 (월·수·금 08:45 KST, 커넥터 없이 생성됨 → 첫 실행에서 GitHub 도구 접근 확인 필요)

**다음 할 일**

- 사용자: Bing Webmaster Tools(Search Console에서 가져오기), 허용 도메인에 `tool-proof.com` 추가
- (완료) Search Console API: 서비스 계정 키를 `GSC_SERVICE_ACCOUNT_JSON_B64`로 등록, `searchconsole.googleapis.com`·`oauth2.googleapis.com` 접속 확인. 조회 스크립트 `tools/gsc_report.py` 추가 (이 세션에는 환경변수가 없어 실제 조회는 다음 세션부터)
- Claude: 다음 세션에서 sitemap 상태가 "성공"으로 바뀌었는지, 글 3편 색인 여부 확인 (API 접근 전에는 사용자에게 확인 요청)
- Claude: 색인 시작 후 IndexNow 키 파일·제출 스크립트 추가, 첫 2주간 색인·노출 기록

## 2026-10-11 · 세션 1: 실험 시작

**한 일**

- 시장·분야 결정: 영어권(미국) · 일반 사용자 대상 IT·AI 도구 ([README.md](README.md) 결정사항)
- 사이트를 ToolProof로 설정, UI·날짜·읽기 시간·구조화 데이터를 영어 기준으로 전환 (작성자 JSON-LD는 Organization)
- 카테고리 `ai-tools`, `software` 생성, 소개·문의·개인정보처리방침 영어로 작성, 한국어 샘플 글 삭제
- 운영 문서([README.md](README.md), [writing-guide.md](writing-guide.md), [backlog.md](backlog.md)) 작성

**환경 확인**

- WebSearch(미국 결과)·WebFetch 사용 가능, `trends.google.com`은 네트워크 정책으로 차단
- Search Console·AdSense 데이터 접근 없음, 도메인·호스팅 미연결 (배포해도 noindex 상태)

**발행한 글**

| slug                             | 카테고리   | 유형               | 직접 검증                                                                       |
| -------------------------------- | ---------- | ------------------ | ------------------------------------------------------------------------------- |
| `transcribe-audio-offline-free`  | `ai-tools` | 비교 (측정형)      | 8개 음성 인식 모델을 22분 실제 통화(Earnings-21)로 WER·속도 측정                |
| `check-if-image-is-ai-generated` | `ai-tools` | How-to + 측정      | C2PA 서명 이미지에 일상 편집 12종 적용 → 11종 중 8종이 출처 정보를 삭제         |
| `turn-off-ai-in-chrome`          | `software` | How-to (설정·정책) | Chromium 155 소스(정책 YAML·설정 문자열)로 메뉴명·정책값 대조, 정책 로딩 테스트 |

- 첫 글 선정: 도메인이 아직 없어 색인이 늦어지므로 마감형 주제(커스텀 GPT 종료 등)보다 상시 수요·측정형 주제를 우선
- 작업 방식: 받아쓰기 글은 직접 측정·작성, 나머지 2편은 서브에이전트가 조사·초안 작성 → 원자료·1차 출처 대조 후 수정
- 측정 스크립트·결과·사실 확인표는 [tests/](tests/README.md)에 글 slug별로 보관 (글 갱신 시 재현용)

**알게 된 것**

- CPU 벤치마크는 다른 작업과 겹치면 속도가 최대 ~10% 느리게 나옴 → 속도 측정은 다른 작업이 없을 때 따로 실행
- help.openai.com·support.google.com 등은 WebFetch로 열리지 않음 → 공식 GitHub 저장소(SDK 타입 정의, Chromium 소스, 프로젝트 README)가 가장 확실한 1차 출처
- 필수 체크 "Vercel"(web 앱 미리보기 배포)이 끝나야 PR 머지 가능 → 푸시 후 3~5분 대기 필요
- 글 제목 뒤에 ` | ToolProof`가 붙어 검색 결과 제목이 60자를 넘는 경우가 있음 → 도메인 연결 후 CTR 데이터를 보고 접미사 제거 여부 판단 (가설 후보)

**다음 할 일**

- 사용자: 도메인 구매·Cloudflare Pages 연결·`NEXT_PUBLIC_SITE_URL` 설정, Search Console 연결
- Claude: backlog 상위 주제로 글 작성 지속 (다음 후보: 9 Windows 10 ESU, 1·7·8 GPT·Gems → Skills 묶음), 도메인 연결 후 sitemap 제출·IndexNow 구성
