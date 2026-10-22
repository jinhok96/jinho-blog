# ToolProof 운영 실험

Claude가 주제 조사 → 글 작성 → 배포 → 성과 분석을 맡아 운영하는 광고 수익형 블로그 실험입니다. 매 세션은 새 컨테이너에서 시작하므로, 실험 상태는 이 디렉터리의 문서로만 이어집니다. **세션을 시작하면 이 파일 → [log.md](log.md) → [clusters.md](clusters.md) → [backlog.md](backlog.md) 순서로 읽고 시작합니다.**

## 목표

1. 실제로 광고 수익을 낼 수 있는지 확인
2. SEO를 지속적으로 개선
3. 노출·유입을 막는 문제를 찾아 개선

## 결정사항

| 항목      | 결정                                                       | 결정일     |
| --------- | ---------------------------------------------------------- | ---------- |
| 시장      | 영어권 (미국 중심)                                         | 2026-10-11 |
| 분야      | 일반 사용자 대상 IT·AI 도구                                | 2026-10-11 |
| 독자      | 비개발자. 비개발자가 이해·사용할 수 없는 방법(명령줄·코드·개발 도구)은 글에 쓰지 않음 | 2026-10-17 |
| 사이트명  | ToolProof                                                  | 2026-10-11 |
| 작성자    | 브랜드 이름(ToolProof), AI 작성 공개 없음                  | 2026-10-11 |
| 배포 권한 | Claude가 모든 PR을 CI 통과 후 직접 머지                    | 2026-10-11 |
| 연락처    | 계정 이메일 (소개·문의·개인정보처리방침에 공개)            | 2026-10-11 |
| 도메인    | `tool-proof.com` (`toolproof.com`은 타인 소유, `toolproof.app`은 CloudCannon의 동명 개발 도구) | 2026-10-11 |
| 호스팅    | Vercel Pro (`jinho-blog-team`/`ad-blog`, 루트 `apps/ad-blog`), main 머지 시 자동 배포 | 2026-10-11 |
| 뉴스 칼럼 | 카테고리 `news`("News & Analysis"). 화제 뉴스도 다루되 단순 소식 전달·카피캣 금지. 독자(비개발자)에게 미칠 영향을 분석하고 ToolProof 견해를 담는 칼럼 | 2026-10-17 |
| 정기 실행 | 하루 4회. 한국 시간 06시 뉴스 칼럼 1편(화제 → 영향 → 클러스터 글 순으로 대체), 00·12시 클러스터 일반 글(`ai-tools`·`software`), 18시 개선 세션(기존 글 보강·허브·내부 링크, 허브·클러스터 공백 글 1편 허용). 2026-10-17의 뉴스 2·일반 2에서 변경 (근거: [데이터로 본 현재 상태](#데이터로-본-현재-상태-2026-10-22)) | 2026-10-22 |
| 주제 클러스터 | 모든 글은 [clusters.md](clusters.md)의 클러스터 1개에 속하고 허브 ↔ 상시 글로 내부 링크. 일반 글은 우선순위 높은 클러스터의 공백부터 | 2026-10-22 |
| 삭제 글 | 같은 주제 글로 301 리디렉트(`apps/ad-blog/vercel.json`). 대체 글이 없으면 같은 클러스터 허브, 허브도 없으면 404 | 2026-10-22 |
| 이미지 | 모든 글 본문 맨 앞에 글을 대표하는 AI 생성 그림(썸네일·OG 이미지 겸용. 제목 글자 자동 썸네일 대신) + 대표 이미지를 뺀 본문 이미지 3장 이상(AI 그림도 셈). 이미지 생성에 비용을 쓰지 않음 → 무료 오픈 모델(Z-Image-Turbo)을 컨테이너에서 실행. 화풍은 모든 글 공통 2.5D 일러스트(같은 사람이 그린 것처럼), 색 조합·시점은 글마다 다르게. 규칙은 [writing-guide.md](writing-guide.md#이미지) | 2026-10-22 |
| 글 제목   | 주제만 씀. `: What It Means for You` 같은 콜론·대시 부제, `(6 Tools Tested)` 같은 괄호 꼬리표 금지. 새 글부터 적용(기존 글 제목은 유지) | 2026-10-22 |

작성자를 브랜드로 표기하더라도 **가상 인물·경력·체험담은 만들지 않습니다.** "We tested"는 실제로 컨테이너에서 실행·확인한 경우에만 씁니다.

## 전략

### 데이터로 본 현재 상태 (2026-10-22)

searchfit-seo 플러그인의 content-strategy·keyword-clustering·internal-linking·technical-seo·ai-visibility 스킬 기준으로 Search Console(2026-09-24 ~ 10-22)·글 32편·라이브 사이트를 분석한 결과입니다. 이 결과로 정기 실행 구성과 주제 선정 방식을 바꿨습니다 (2026-10-22 사용자 결정). 원자료는 [log.md](log.md) 같은 날 기록.

| 발견 | 근거 | 바꾼 것 |
| --- | --- | --- |
| 노출은 경쟁이 약한 구체적 롱테일에서만 남 | 사이트 노출 325회 중 `turn-off-ai-in-chrome` 103회(13위)·`image-to-text-offline-free` 51회(9위). 10위 안 비브랜드 검색어 11개는 모두 제품·기능에 동작·조건이 붙은 롱테일(`chrome disable ai` 7위, `offline ocr tools` 5위, `where did gems go in gemini` 6위). Trends 상대량이 큰 상위 검색어(`pdf to word` 23.2 등)를 노린 PDF 글 7편은 4편이 색인 전, 색인된 `merge-pdf-files-free`는 99위 | 주제 선정 기준 3번을 "순위 가능성"으로 강화, 주 검색어는 가장 구체적인 변형으로 ([주제 선정 기준](#주제-선정-기준)) |
| 뉴스 칼럼은 아직 성과가 없음 | 칼럼 12편(발행의 37%) Discover·Google News 노출 0, 웹 노출 합계 약 50회(15%). 신규 도메인은 Discover 신뢰 신호가 부족 | 뉴스 칼럼 하루 2편 → 1편, 남는 18시 세션을 개선 세션으로 (H4·H5는 06시 칼럼으로 계속 검증) |
| 색인이 발행을 못 따라감 | 32편 중 15편 `URL is unknown`(PDF 클러스터 4편·허브 포함). 홈은 12편씩이라 하루 4편이면 사흘 만에 첫 페이지에서 밀려남 | 새 글은 이미 색인된 같은 클러스터 글에서 링크를 받게 함, 개선 세션에서 색인 안 된 글 우선 연결 ([clusters.md](clusters.md)) |
| 주제가 흩어져 있음 | 6개 주제 묶음 중 허브는 2개(PDF·오프라인 AI). 사진·영상 상시 글 6편은 허브 없음. 받는 링크 1개뿐인 글 7편 | 모든 글을 클러스터에 넣고 허브 ↔ 상시 글 링크 규칙과 점검 도구(`link_audit.py`) 도입 |
| 삭제한 글 URL이 404 | 2026-10-17 삭제한 8편 중 `free-offline-text-to-speech`가 아직 노출 12·클릭 1 | 같은 주제 글로 301 리디렉트 7개(`vercel.json`), GIF 글은 대체 글이 없어 404 유지 |

### 왜 이 시장·분야인가

- 미국 광고 단가가 한국·일본의 약 2~3배, 구글 점유율 ~90% → Search Console 데이터로 실험 루프를 돌리기 적합
- 신규 도메인은 뉴스성 키워드에서 순위를 못 잡음 → **출시 직후 사용법·문제 해결·비교**처럼 수개월 지속되는 검색 수요를 노림
  - 뉴스 칼럼(2026-10-17)은 이 한계를 두 방향으로 보완: 검색 순위 대신 피드형 채널(Google Discover)을 노리고, 며칠짜리 화제보다 영향이 몇 주~몇 달 가는 뉴스(종료일·마감일·요금·정책 시행일)를 다룸. 효과는 [가설](#가설) H4·H5로 검증. 2026-10-22 중간 데이터(Discover 0)로 하루 1편으로 줄이고, 칼럼마다 같은 클러스터의 상시 글로 이어지게 함
- AI Overviews가 클릭을 줄이므로 **AI 요약이 답하기 어려운 검색**을 우선: 학습 시점 이후 정보, 특정 오류·환경별 해결법, 직접 실행한 비교 결과
- 차별점: 독자가 실제로 쓸 방법(OS 내장 기능·설정 메뉴·무료 GUI 앱·웹 서비스)을 컨테이너에서 실행·측정한 결과 (E-E-A-T의 Experience). GUI 앱은 Xvfb+xdotool로 조작·캡처 (세션 9 XnConvert·GIMP). 명령줄 도구·라이브러리는 측정 보조(화질 점수·OCR 판독률 계산 등)로만 쓰고 글에서 방법으로 권하지 않음. 받을 수 있는 앱의 범위는 네트워크 정책에 따름 (인프라 상태 참고)

### 콘텐츠 구성

- 하루 새 글 3~4편 = 뉴스 칼럼 1편(06시) + 클러스터 일반 글 2편(00·12시) + 개선 세션(18시)의 허브·클러스터 공백 글 0~1편 (2026-10-22 변경. 이전: 뉴스 2·일반 2)
- 한 분야(IT·AI 도구)에 집중해 주제 권위(topical authority)를 쌓음. 카테고리: `ai-tools`, `software`, `news`(News & Analysis, 뉴스 칼럼 전용)
- **주제 클러스터** ([clusters.md](clusters.md)): 모든 글은 클러스터 1개에 속함. 클러스터마다 상시 글이 3편 모이면 허브를 쓰고, 허브 ↔ 상시 글 ↔ 뉴스 칼럼을 정해진 규칙으로 링크. 우선순위(2026-10-22): 1 `ai-settings`(AI 기능 끄기·옵트아웃) → 2 `photo-video`(허브 필요) → 3 `pdf` → 4 `offline-ai` → 5 `windows-microsoft` → 6 `phones-subscriptions`
- **새 글보다 기존 글 개선도 같은 비중**: 18시 개선 세션이 Search Console 데이터로 기존 글 제목·설명·소제목을 보강하고, 허브·내부 링크·색인 문제를 고침 ([개선 세션](#개선-세션))

### 주제 선정 기준

후보마다 아래를 확인하고 [backlog.md](backlog.md)에 기록합니다. **0번을 통과하지 못한 후보는 점수와 상관없이 제외합니다.**

0. **비개발자가 쓸 수 있는 방법으로 끝나는가** (필수, 2026-10-17 사용자 결정): 독자의 문제를 OS 내장 기능·설정 메뉴·무료 GUI 앱·웹 서비스로 해결할 수 있어야 함. 명령줄(터미널·명령 프롬프트·PowerShell)·코드(Python 등)·패키지 관리자·개발 도구가 있어야만 해결되는 주제, 개발자가 주 독자인 주제(라이브러리·CLI·API 버전 소식 등)는 제외
1. 검색 수요 신호: 자동완성 하위 검색어가 여러 곳(Google·Bing·YouTube)에서 나오는지, 커뮤니티 질문이 있는지 (`demand_check.py suggest`), 후보끼리·기존 글 주 검색어와 비교한 Google Trends 상대 검색량 (`trends_compare.py`). 두 결과를 backlog에 근거로 기록
2. 수명 (며칠짜리 뉴스면 제외, 수개월 이상 우선)
3. 경쟁·순위 가능성 (상위 결과가 대형 매체·공식 문서·도구 사이트로만 채워져 있으면 후순위, 오래되거나 부실한 결과가 있으면 우선). 경쟁이 심해도 제외하지 않음: 대형 매체가 다루지 않는 **세부 각도**(특정 오류 메시지·기기/버전/국가 조건·설정에 없을 때의 방법·직접 측정값)를 하나 정할 수 있으면 그 각도의 검색어로 씀 (예: `turn-off-ai-in-chrome`은 경쟁 주제지만 소스 코드로 확인한 메뉴·정책으로 평균 순위 5.5). 글 20~30편 이후 Search Console 순위 추이로 경쟁 가중치를 다시 정함 (2026-10-14 사용자 결정)
   - 2026-10-22 재평가 (글 32편): 10위 안 비브랜드 검색어 11개는 모두 제품·기능에 동작·조건이 붙은 롱테일이었고, 상위 검색어 글은 아직 노출이 없음 ([데이터로 본 현재 상태](#데이터로-본-현재-상태-2026-10-22)). → **주 검색어는 자동완성 3곳에 나오는 가장 구체적인 변형**으로 정함 (`turn off copilot`보다 `turn off copilot in word`). Trends 상대량은 같은 클러스터 후보끼리 비교할 때만 쓰고, 상대량이 크다는 이유만으로 도구 사이트가 차지한 상위 검색어를 고르지 않음
   - 상위 5개 결과의 유형(도구 사이트·대형 매체·공식 문서·포럼·작은 블로그)과 빠진 내용을 WebSearch로 확인해 브리프에 적음 ([writing-guide.md](writing-guide.md#작성-전-브리프))
4. AI Overviews 위험 (한 줄로 답이 끝나는 질문은 후순위)
5. 직접 검증 가능 여부: 독자가 쓸 방법(GUI 앱·웹 화면·설정 메뉴)을 컨테이너에서 실행·확인할 수 있으면 우선. 명령줄 도구만 실행할 수 있으면 직접 검증으로 치지 않음
6. 광고 가치 (소프트웨어·SaaS·보안·생산성 주제 우선)
7. 클러스터 (2026-10-22): [clusters.md](clusters.md)의 어느 클러스터에 들어가는지. 우선순위 1·2 클러스터의 공백 후보([backlog.md](backlog.md#클러스터-공백-후보))를 먼저 고름. 어느 클러스터에도 맞지 않으면 같은 클러스터로 이어질 상시 글 3편을 함께 적을 수 있을 때만 새 클러스터로 시작

### 뉴스 칼럼 선정 기준

뉴스 세션(06시)의 칼럼은 위 1~6번 대신 아래 기준으로 고릅니다 (0번은 공통 필수에 포함, 2026-10-17 사용자 결정. 2026-10-22부터 하루 1편). 단순 소식 전달·카피캣은 쓰지 않고, 독자에게 미칠 영향을 분석하고 견해를 담은 칼럼만 씁니다. 작성 규칙은 [writing-guide.md](writing-guide.md), 후보는 [backlog.md](backlog.md#뉴스-칼럼-후보)의 뉴스 칼럼 후보 표에 기록.

- **공통 필수** (하나라도 못 넘으면 제외)
  - 미국 일반 사용자(비개발자)가 쓰는 제품·서비스에 직접 영향: 요금·기능 추가/종료·개인정보·보안·지원 종료·기기/OS 업데이트
  - 1차 출처(공식 발표·문서·릴리스 노트)로 사실 확인 가능
  - 독자가 할 수 있는 행동이 있음
  - [주제 선정 기준](#주제-선정-기준) 0번 준수: 독자의 행동이 비개발자가 쓸 수 있는 방법(OS 내장 기능·설정 메뉴·무료 GUI 앱·웹 서비스)으로 끝나야 함
- **제외**
  - 사용자 영향 없는 업계 뉴스: 실적·투자·주가·인수·인사
  - 루머·유출
  - 개발자 대상: API·SDK·라이브러리
  - 정치·소송 공방 자체 (사용자 영향이 있으면 그 영향만 다룸)
- **화제 뉴스** (06시 세션 1순위)
  - 최근 48시간 안에 발표
  - 화제성 신호가 가장 큰 것: Trends 급상승 RSS·자동완성·Google News RSS 기사 수·Trends 관련 검색어 급상승
- **영향이 오래 가는 뉴스** (06시 세션 2순위, 화제 뉴스가 기준을 못 넘을 때)
  - 영향이 몇 주~몇 달 지속: 종료일·마감일·요금 변경 시행일·정책 시행일 등
  - 최근 30일 안에 발표했거나 시행일이 다가오는 것
  - 마감일이 있는 주제 우선
- **클러스터 연결** (2026-10-22): 신호가 비슷하면 우선순위 높은 클러스터([clusters.md](clusters.md))의 제품·서비스 뉴스를 고름. 칼럼은 같은 클러스터의 상시 글이나 허브로 1개 이상 링크하고, 뉴스 다음 날 생길 상시 검색(끄는 법·설정법·확인 방법)을 [backlog.md](backlog.md#클러스터-공백-후보)에 상시 글 후보로 1개 이상 올림

### 주제 발굴 소스

Google Trends 급상승 RSS에는 그날 폭증한 검색어(스포츠·연예 등)만 올라와 IT 도구 주제는 거의 안 나옵니다. 일반 세션에서는 RSS를 큰 IT 이슈 확인용으로만 쓰고, 아래 순서로 찾습니다. 뉴스 세션의 주 소스는 표 아래 목록 참고. 모두 2026-10-11 컨테이너에서 접속 확인.

| 단계 | 소스 | 조회 방법 |
| --- | --- | --- |
| 발견 | 공식 피드: Windows Blog, Chrome Releases(Stable), Google Workspace Updates, Google Blog, OpenAI News, Apple Newsroom + CISA 악용 취약점(소비자 제품) | `demand_check.py discover` |
| 발견 | Windows 메시지 센터(종료·인증서 만료 공지), Gemini 릴리스 노트, Anthropic 뉴스, Apple 보안 업데이트, Microsoft 365 로드맵 | 직접 열기 (`discover` 출력 하단 링크) |
| 수요 확인 | Google·Bing·YouTube 자동완성 (YouTube는 "not showing"·"not working" 같은 문제 해결형이 잘 나옴) | `demand_check.py suggest "키워드"` |
| 수요 크기 비교 | Google Trends 상대 검색량(미국, 최대 5개) + 관련 검색어(상위·급상승). 기준 키워드를 매번 함께 넣어 요청끼리 비교. YouTube 검색 기준(`--property youtube`), 카테고리로 뜻 좁히기(`--cat 5` Computers & Electronics), 주제 ID(`--suggest`로 찾은 `/g/…`)로 표현 차이 묶기 | `trends_compare.py [--time "now 7-d"] [--property youtube] [--cat 5] [--related] "키워드" ...` |
| 소제목·FAQ 소재 | Chrome 도움말 커뮤니티, Apple Discussions 질문 제목, 자동완성 하위 검색어 | 직접 열기 |
| 사후 판단 | Search Console 노출 검색어 | `gsc_report.py` |

- **뉴스 세션(06시)**: 공식 피드(`demand_check.py discover`와 위 표의 직접 열기 목록)·Google News RSS·Trends 급상승 RSS가 주 소스 (2026-10-17). 발표 내용은 공식 피드로 확인하고, 화제성 신호는 Google News RSS 기사 수·Trends 급상승 RSS·자동완성으로 잼. Google News RSS 기간은 `when:` 값을 선정 기준(화제 48시간, 영향 30일)에 맞춤
- **일반 세션**: 기술 뉴스 RSS(The Verge, BleepingComputer, 9to5Google, 9to5Mac, Windows Central, Ars Technica)와 Google News RSS(`news.google.com/rss/search?q=…+when:7d`)는 이슈 확인 보조용. 뉴스 자체보다 그 뒤에 생길 사용법·문제 검색을 노림
- 쓸 수 없음: Reddit(본문 비어 있음), Quora·Downdetector(403), Google 검색 결과(429), Bing Webmaster Tools API(지원 종료), Ahrefs·Semrush 무료 도구(사람 확인·로그인 필요 → 자동 조회 안 함)
- pytrends 4.9.2(2023-04 이후 업데이트 없음)는 같은 Trends API를 쓰므로 따로 설치하지 않음. 쓸 만한 기능(YouTube·카테고리·관련 주제·주제 ID)은 `trends_compare.py`로 옮김. 급상승 목록 함수는 404 (2026-10-14 확인)
- Trends API는 쿠키 없이 부르면 429지만, 홈에서 `NID` 쿠키를 받은 뒤 부르면 열림 (2026-10-14 확인, `trends_compare.py`). 연속 호출하면 429가 나서 재시도(최대 약 2.5분 대기)
- 자동완성·Trends 모두 절대 검색량이 아님 (Trends는 요청 안 최고점 = 100인 상대값). 절대량 판단은 발행 후 Search Console로

### 발행 속도

- 매일 새 글 3~4편 (정기 실행 하루 4회 00:00·06:00·12:00·18:00 한국 시간. 뉴스·일반 세션은 1편씩, 18시 개선 세션은 0~1편, 2026-10-22 사용자 결정). 세션 유형은 [세션 워크플로우](#세션-워크플로우) 3번. 뉴스·일반 세션에서 고른 주제가 1차 출처로 검증되지 않으면 건너뛰지 말고 대체 순서대로 다음 후보로 바꿔 발행
- 새 URL이 색인 속도를 넘지 않게 함: `URL is unknown`이 발행 글의 절반을 넘으면 개선 세션은 새 글 대신 색인된 글 → 색인 안 된 글 링크 보강을 우선 (2026-10-22)
- 글은 직접 측정한 실험 결과·1차 출처로 확인한 정보만 다루므로, AI 작성 여부를 이유로 발행 수를 줄이지 않음 (2026-10-13 사용자 결정)
- AdSense 신청은 글 20편 도달 즉시 (도메인 색인 확인 후, 2026-10-14 사용자 결정)

## 세션 워크플로우

1. **상태 파악**: 이 파일, [log.md](log.md), [clusters.md](clusters.md), [backlog.md](backlog.md) 읽기. 열린 PR이 있으면 먼저 처리. 가장 최근 [주간 SEO 점검](#주간-seo-점검) 보고가 log.md에 있으면 그 우선순위 목록도 확인
2. **지표 확인**: `python3 -m venv /tmp/gsc && /tmp/gsc/bin/pip install google-auth requests` 후 `/tmp/gsc/bin/python -I apps/ad-blog/experiment/tools/gsc_report.py` → 노출·클릭·CTR·순위, 사이트맵 상태, 글별 색인 상태(URL 검사)를 log.md에 붙이고 개선 작업 판단. 판단 시점이 지난 [검증 기록](traffic-playbook.md#검증-기록)은 `--compare`로 판정해 노하우 상태를 갱신. 이어서 `python3 -I apps/ad-blog/experiment/tools/link_audit.py --only-problems`로 클러스터·내부 링크 문제 확인
3. **세션 유형**: 세션 시작 시각(한국 시간, `TZ=Asia/Seoul date`)으로 정함. 실행 지연을 흡수하도록 시각 범위로 판단 (2026-10-22 변경)
   - **뉴스 세션** (03:00~08:59, 06시 실행): [뉴스 칼럼 선정 기준](#뉴스-칼럼-선정-기준). 공식 피드·Google News RSS·Trends 급상승 RSS로 최근 48시간 발표(화제)를 찾고 화제성 신호 비교. 기준을 넘는 화제 뉴스가 없으면 [backlog.md](backlog.md)의 뉴스 칼럼 후보·반복 일정과 최근 30일 발표·시행일이 다가오는 변경(영향)에서 고름
   - **개선 세션** (15:00~20:59, 18시 실행): 새 글 대신 기존 글·허브·내부 링크·색인 문제를 고침 ([개선 세션](#개선-세션))
   - **일반 세션** (그 외 시각, 00·12시 실행): `ai-tools`·`software` 클러스터 글. [clusters.md](clusters.md) 우선순위 1·2의 [클러스터 공백 후보](backlog.md#클러스터-공백-후보)와 반복 일정(Chrome·Windows)을 먼저 확인 → 부족하면 `python3 -I apps/ad-blog/experiment/tools/demand_check.py discover`로 새 주제 발굴 ([주제 발굴 소스](#주제-발굴-소스)) → 후보 키워드를 `demand_check.py suggest`로 수요 확인하고 `trends_compare.py`로 같은 클러스터 후보끼리 크기 비교 → 후보의 최신성 재확인 (이미 지나간 이슈인지, 새 경쟁 글이 생겼는지)
   - **대체 순서** (기준을 통과하는 후보가 없어도 뉴스·일반 세션은 1편 유지): 뉴스 세션은 화제 뉴스 → 영향 뉴스 → 클러스터 일반 글
4. **브리프**: 주제가 정해지면 쓰기 전에 `tests/{slug}/factcheck.md` 맨 위에 브리프를 씀 ([writing-guide.md](writing-guide.md#작성-전-브리프): 클러스터·역할, 주 검색어·하위 검색어, 검색 의도, 상위 결과 유형과 빈틈, 차별점, 내부 링크 계획, 소제목 개요)
5. **조사·검증**: 공식 문서·릴리스 노트·가격 페이지를 직접 열어 확인, 가능한 것은 컨테이너에서 실행
6. **작성**: [writing-guide.md](writing-guide.md) 기준 (트래픽 노하우는 [traffic-playbook.md](traffic-playbook.md)). 대표 이미지는 [tools/hero_image.py](tools/hero_image.py)로 생성해 본문 첫 줄에 넣고, 본문 이미지 3장 이상. 생성 준비(`hero_image.py --setup`, 약 10GB 다운로드·빌드)는 세션 시작 직후 백그라운드로 돌려 두고, 생성(1장 약 47분)은 속도 측정과 겹치지 않게 돌림. 브리프의 내부 링크 계획대로 새 글 → 허브·같은 클러스터 글, 이미 색인된 같은 클러스터 글 → 새 글 링크를 넣고 [clusters.md](clusters.md) 표에 새 글을 추가
7. **검증**: `pnpm --filter @jinho-blog/ad-blog lint`, `test`, `build` 통과 + 빌드 결과 HTML에서 제목·메타·JSON-LD 확인 + `link_audit.py --only-problems`에 새 글 문제가 없음
8. **배포**: 작업 브랜치에 커밋 → 푸시 → PR → CI 통과 후 머지. 배포가 끝나면 IndexNow 워크플로우가 직전 배포 이후 추가·수정·삭제된 글 URL을 자동 제출 (Actions의 `IndexNow` 실행 로그에서 제출 대상 확인)
9. **기록**: log.md에 세션 기록, backlog.md·clusters.md 갱신, 검증 자료는 [tests/](tests/README.md)에 보관, 새로 알게 된 규칙은 writing-guide.md에 반영, 지표 개선 작업은 traffic-playbook.md 검증 기록에 추가
10. **대시보드 갱신**: log.md 기록 후 [운영 대시보드](#운영-대시보드) 데이터를 갱신 (주소 고정, 새 아티팩트 만들지 않음)

### 개선 세션

18시 세션은 새 글보다 이미 쓴 글의 성과를 올리는 데 씁니다 (2026-10-22 사용자 결정). 아래 순서로 할 일을 고르고, 세션당 1~3개를 끝냅니다. 한 글에는 한 번에 한 가지 변경만 하고, 지표를 노린 변경은 [검증 기록](traffic-playbook.md#검증-기록)에 행을 추가합니다 (같은 글은 이전 변경 판정이 끝난 뒤에. 역링크 1문장 추가는 기록 대상 아님).

1. **색인**: `URL is unknown`이 3일 넘은 글 → 이미 색인된 같은 클러스터 글(허브 우선)에서 문맥에 맞는 링크 1개 추가. 사용자에게 Search Console 색인 요청이 필요한 URL은 log.md '다음 할 일'에 적음 (API로는 요청할 수 없음)
2. **링크 점검**: `link_audit.py` 문제 해결 (허브 누락 링크, 받는 링크 2개 미만, 칼럼 → 상시 글 링크 없음, 비슷한 태그 정리)
3. **허브**: 상시 글 3편 이상인데 허브가 없는 클러스터 → 허브 글 작성 (이 세션의 새 글 1편으로 셈). 있는 허브는 새 상시 글을 반영해 갱신
4. **Search Console 기반 보강** ([writing-guide.md](writing-guide.md#발행-후-개선)): 노출 100회 이상인데 CTR이 낮은 글의 제목·설명, 8~20위 검색어를 다루는 소제목·FAQ, 예상하지 못한 검색어는 backlog 후보로
5. **뉴스 칼럼 후속**: 시행일·마감일이 지났거나 후속 발표가 있는 칼럼을 같은 글에 반영 (`updatedAt`)
6. **반복 일정**: Chrome 안정판·Windows 월간 업데이트 후 관련 글 메뉴·버전 재확인
7. 고칠 것이 없으면 우선순위 1·2 클러스터의 공백 글 1편을 일반 세션 절차대로 씀

log.md 세션 제목에는 `개선 세션`을 적고, 바꾼 글·바꾼 내용·검증 기록 ID를 표로 남깁니다.

### SEO 플러그인 (searchfit-seo)

2026-10-22 설치한 searchfit-seo 플러그인 스킬을 세션에서 아래처럼 씁니다. 스킬은 일반 SEO 조언이라 이 디렉터리의 규칙과 다르면 **우리 규칙을 따릅니다** (예: FAQPage 구조화 데이터를 넣지 않음, 키워드 반복 횟수 목표 없음, 결론 요약 문단 대신 상황별 추천, 제목 꼬리표 금지, 가상 체험담 금지). 세션에 스킬이 없으면 같은 내용을 담은 문서 체크리스트만으로 진행합니다.

| 시점 | 스킬 | 쓰는 법 |
| --- | --- | --- |
| 일반·뉴스 세션 브리프 | `searchfit-seo:content-brief` | 상위 결과 분석·개요 형식 참고. 결과는 [writing-guide.md](writing-guide.md#작성-전-브리프) 브리프 항목으로 줄여 factcheck.md에 기록 |
| 일반·뉴스 세션 발행 전 | `searchfit-seo:seo-check` | 새 MDX 파일에 실행해 제목·설명·소제목·이미지 alt를 점검 (빌드 HTML 확인과 함께) |
| 개선 세션 | `searchfit-seo:internal-linking`, `searchfit-seo:on-page-seo` | `link_audit.py` 결과를 보고 링크 추가 위치·앵커 텍스트 정함, 보강할 글의 제목·설명·소제목 점검 |
| 클러스터 재평가 (월 1회, 개선 세션) | `searchfit-seo:keyword-clustering`, `searchfit-seo:content-strategy` | Search Console 검색어·자동완성으로 클러스터·우선순위([clusters.md](clusters.md)) 재평가 |
| 주간 SEO 점검 | `searchfit-seo:technical-seo`, `searchfit-seo:seo-audit`, `searchfit-seo:internal-linking`, `searchfit-seo:ai-visibility` | [주간 SEO 점검](#주간-seo-점검) |

### 주간 SEO 점검

별도 정기 실행 "주간 SEO 점검"(매주 월요일 08:45 한국 시간)이 searchfit-seo 플러그인 스킬로 사이트를 점검하고, 글·코드는 고치지 않은 채 결과를 log.md에 기록합니다 (2026-10-22 사용자 결정). 정기 세션은 매번 새 컨테이너라 저장소 문서만 읽으므로, 보고를 log.md에 남겨야 다음 개선 세션이 이어받습니다.

- 대상: `main`에 배포된 사이트(`https://tool-proof.com`)와 지난 7일간 `main`에 머지된 글·코드
- 점검 (스킬이 없으면 같은 항목을 직접 확인)
  - `searchfit-seo:technical-seo`: robots.txt·sitemap(발행 글 수와 `<loc>` 수 일치, `lastmod`)·canonical·상태 코드·[삭제 글 리디렉트](clusters.md#규칙)(`vercel.json` 원본이 308로 대상 글에 도착)·HTTP→HTTPS·www 리디렉트·noindex 누락
  - `searchfit-seo:seo-audit`: 지난 7일 새 글·수정 글의 제목 길이·꼬리표 금지, 설명 140~160자, h1 1개, 대표 이미지에서 만든 OG 이미지, BlogPosting·BreadcrumbList JSON-LD, 이미지 alt
  - `searchfit-seo:internal-linking` + `link_audit.py`: 허브 필요 클러스터, 받는 링크 2개 미만 글, 칼럼 → 상시 글 링크
  - `searchfit-seo:ai-visibility`: 지난 7일 새 글이 AI 답변에 인용되기 쉬운 구조인지 (소제목 첫 문장이 답, 측정값이 조건과 함께 한 문장, 비교는 표, 제품 이름·버전을 정확히) — [writing-guide.md](writing-guide.md#ai-답변-인용) 기준
  - Search Console(`gsc_report.py`, 서비스 계정 키가 있을 때): 7일 전 대비 노출·클릭·색인 편수, 새로 10위 안에 든 검색어, `URL is unknown` 7일 이상 글
- 기록: log.md 맨 위에 `## {날짜} · 주간 SEO 점검` 섹션 (심각도 치명·높음·보통별 문제 + 대상 URL + 다음 개선 세션 할 일 우선순위 3개 + 사용자가 할 일). 이 섹션만 담은 PR을 만들어 CI 통과 후 머지 (글·코드·다른 문서는 수정하지 않음)
- 개선 세션은 가장 최근 주간 점검의 우선순위 목록을 [개선 세션](#개선-세션) 1~6번보다 먼저 확인하고, 처리한 항목을 세션 기록에 적음

## 운영 대시보드

- 주소: **https://claude.ai/artifact/4nL6tkJXzL4YQd2FXis8Cb** (claude.ai 아티팩트, 비공개. 공유는 사용자가 Share 메뉴에서). **이 주소를 항상 유지**: 새 아티팩트를 만들지 않고, 페이지를 고칠 때도 `Artifact` publish에 `url`로 이 주소를 넘김 (다른 세션에서 `url` 없이 발행하면 새 주소가 생김). 삭제 금지
- 페이지 원본: [dashboard/index.html](dashboard/index.html). 데이터는 아티팩트 DB(`db` 기능, 읽기 `view`·쓰기 `admin`)의 `stats` 컬렉션에 있고 로그인한 사람에게는 페이지가 실시간으로 읽음. **비로그인 방문자**는 DB를 읽을 수 없어(플랫폼 규칙) 아티팩트 파일 `data.js`(마지막 세션 기준 스냅숏)를 보여 줌. **`data.js`는 정기 세션에서 자동으로 올리지 않음** (2026-10-16 사용자 결정: 대시보드가 링크 공개 상태라 정기 실행의 재게시는 권한 분류기가 매번 거부함). 비로그인 화면은 사용자가 요청한 대화형 세션에서만 갱신
- `stats` 문서: `summary`(갱신 시각·28일 합계·사이트맵), `daily-YYYY-MM`(달마다 날짜별 지표, 확정/미확정 표시), `posts`(글별 메타·단어 수·태그·28일 지표·검색어 상위 10·날짜별 노출·색인 상세(크롤러·표준 URL) + `otherPages`: 홈·카테고리 등 글 외 페이지, 글별 표 합계를 사이트 전체 KPI와 맞추기 위함), `breakdown`(28일 기기·국가·검색 유형별 지표, 사이트 검색어 상위 20), `experiments`(traffic-playbook 검증 기록), `knowhow`(traffic-playbook 노하우 상태), `sessions`(log.md 세션 제목)
- 세션마다 갱신 절차 (log.md·traffic-playbook.md를 고친 뒤). 정기 세션도 매번 이 절차를 시도하고, 권한 분류기 등에 막히면 5번대로 기록 (2026-10-17 사용자 결정: "루틴 규칙 그대로")
  1. `ArtifactData` `list` (`url` 위 주소, `collection: "stats"`)로 문서별 `version` 확인
  2. `/tmp/gsc/bin/python -I apps/ad-blog/experiment/tools/dashboard_data.py --out /tmp/dashboard --versions '{"summary": N, "posts": N, "breakdown": N, "experiments": N, "knowhow": N, "sessions": N, "daily-2026-10": N}'` (1에서 본 버전. 새 달 문서처럼 처음 만드는 문서는 빼면 새로 생성)
  3. `/tmp/dashboard/writes.json` 내용을 `ArtifactData` `batch`의 `writes`로 그대로 전달 (버전이 어긋나면 아무것도 쓰이지 않음 → 1부터 다시)
  4. (정기 세션에서는 건너뜀, 사용자가 요청한 대화형 세션에서만) 비로그인 열람용 스냅숏: `/tmp/dashboard/data.js`를 스크래치패드로 복사한 뒤 `Artifact` publish (`file_path` 페이지 원본, `url` 위 주소, `files: {"data.js": "<복사한 경로>"}`, `capabilities` 생략). 파일 원본은 작업 디렉터리나 스크래치패드 안에 있어야 함
  5. 실패하면 log.md '다음 할 일'에 기록 (대시보드 갱신은 글 발행을 막지 않음)
- 페이지 구성을 바꿀 때: `dashboard/index.html` 수정 → `Artifact` publish (`file_path` 원본, `url` 위 주소, `capabilities`는 생략해 기존 접근 규칙 유지) → 같은 PR로 커밋
- 폰트: Pretendard 1.3.9 가변 폰트(OFL-1.1)를 아티팩트 파일 `fonts/PretendardVariable.woff2`로 함께 발행 (저장소에는 넣지 않음). 페이지만 다시 발행할 때는 `files`를 생략하면 기존 폰트 파일이 유지됨. 폰트를 바꿀 때만 `files`로 다시 올림 (`https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/woff2/PretendardVariable.woff2`)

## 기록 원칙

- 사실(측정값·날짜·출처)과 해석(가설)을 구분해서 씀
- 가설은 검증 방법과 판단 시점을 함께 기록 (예: "발행 4주 후 노출 수로 판단")
- 실패도 기록 (색인 안 됨, 순위 하락, 틀린 정보 수정 등)

## 가설

| ID  | 가설                                                                       | 판단 방법                                   | 상태   |
| --- | -------------------------------------------------------------------------- | ------------------------------------------- | ------ |
| H1  | 출시 2주 이내 주제의 사용법·문제 해결 글이 신규 도메인에서도 노출을 얻는다 | 발행 4주 후 글별 노출·평균 순위             | 대기   |
| H2  | 제목에 정확한 오류 메시지·기능명을 넣은 글이 CTR이 높다                    | 같은 기간 글별 CTR 비교                     | 대기   |
| H3  | 직접 실행 결과(측정값·스크린샷)가 있는 글이 순위가 더 오래 유지된다        | 발행 8주 후 검증형 vs 조사형 글의 순위 변화 | 대기   |
| H4  | 영향 분석 뉴스 칼럼이 신규 도메인에서도 Discover 또는 검색 노출을 얻는다 | 칼럼 발행 4주 후 글별 Discover·웹 노출: `gsc_report.py --compare /posts/{slug} --changed {발행일} --metric impressions --type discover`(웹은 `--type web`)의 변경 후 값. 사이트 전체 Discover는 대시보드 검색 유형별 지표 | 대기 (2026-10-22 중간: 칼럼 12편 Discover 0, 웹 약 50회 → 하루 1편으로 줄임) |
| H5  | 영향이 오래 가는 뉴스 칼럼이 화제 뉴스 칼럼보다 발행 4주 누적 노출이 많다 | 유형별 5편 이상 쌓인 뒤 4주 누적 노출 중앙값 비교 (2026-10-22부터 06시 세션의 화제 → 영향 대체로 두 유형이 계속 쌓임) | 대기   |
| H6  | 주 검색어가 구체적인 롱테일(제품·기능 + 동작·조건)인 글이 상위 검색어 글보다 발행 4주 노출이 많고 순위가 높다 | 글별 주 검색어의 Trends 상대량(같은 기준 키워드 `remove background`)이 5 미만이면 롱테일, 5 이상이면 상위로 나눠, 각 5편 이상 쌓인 뒤 발행 후 28일 노출·평균 순위 중앙값 비교 (2026-10-22 추가, 주제 선정 기준 3번의 근거) | 대기   |

### 목표 지표 (2026-10-22)

content-strategy 스킬의 성공 지표를 우리 상황에 맞춰 정했습니다. 매 세션 지표 확인 때 함께 보고, 개선 세션의 할 일 우선순위를 정할 때 씁니다.

| 지표 | 현재 (10-22) | 목표 (11-30) | 확인 |
| --- | --- | --- | --- |
| 색인율 (색인 편수 / 발행 편수) | 17/32 (53%) | 80% 이상 | `gsc_report.py` URL 검사 |
| 28일 노출 | 325 | 2,000 | `gsc_report.py` |
| 10위 안 비브랜드 검색어 수 | 11개 | 40개 | Search Console 검색어별 순위 |
| 허브가 있는 클러스터 (상시 글 3편 이상인 클러스터 중) | 2/4 | 전부 | `link_audit.py` |
| 받는 링크 2개 미만 글 | 7편 | 0편 | `link_audit.py` |

## 인프라 상태

| 항목                          | 상태      | 필요 조치 (담당)                                                                   |
| ----------------------------- | --------- | ---------------------------------------------------------------------------------- |
| 도메인·호스팅                 | 설정됨    | `tool-proof.com` 연결, `NEXT_PUBLIC_SITE_URL=https://tool-proof.com`(Production). 필수 체크는 GitHub Actions `test`·`build` (2026-10-12 Vercel 상태 체크를 필수에서 제외: `ignoreCommand`로 건너뛴 배포는 상태가 안 남아 PR이 막힘). `build`는 바뀐 패키지와 의존 앱만 빌드 |
| Search Console                | 등록·API 설정됨 | 2026-10-11 도메인 속성 확인·sitemap 제출·글 3편 색인 요청. 서비스 계정(제한된 권한) 키를 환경변수 `GSC_SERVICE_ACCOUNT_JSON_B64`로 등록, API 도메인 허용. 조회는 [tools/gsc_report.py](tools/gsc_report.py) |
| Bing Webmaster Tools·IndexNow | 설정됨 | 2026-10-12 사용자가 Bing Webmaster Tools 등록. 2026-10-14부터 프로덕션 배포마다 바뀐 글 URL 자동 제출 ([indexnow.yml](../../../.github/workflows/indexnow.yml), [scripts/indexnow.ts](../scripts/indexnow.ts)), Actions에서 수동 실행 시 sitemap 전체 제출. 키 파일 `public/{key}.txt` = `scripts/lib/indexnow.ts`의 `INDEXNOW_KEY`. Bing Webmaster Tools API(키워드 검색량 `GetKeywordStats` 포함)는 지원 종료 → 검색량 조회에 쓰지 않음 (2026-10-14 사용자 확인) |
| Google Trends 접근            | 허용됨    | 2026-10-11 사용자가 허용 도메인에 추가 (새 세션부터 적용). 미국 급상승 검색어: `https://trends.google.com/trending/rss?geo=US`. 2026-10-14 상대 검색량·관련 검색어 API를 쿠키 방식으로 사용 ([tools/trends_compare.py](tools/trends_compare.py)) |
| 컨테이너 네트워크             | 일부 허용 | 2026-10-11 세션 2 확인: npm·PyPI·GitHub(Releases 다운로드)·trends.google.com·microsoft.com·support.microsoft.com·learn.microsoft.com·support.google.com·apple.com·huggingface.co·tool-proof.com 접속 가능. help.openai.com·api.github.com은 403. 2026-10-12 세션 3: raw.githubusercontent.com·k2-fsa.github.io·download.pytorch.org·en.wikipedia.org 가능, github.com HTML 페이지·소스 zip은 차단. 2026-10-13 세션 4: huggingface.co 데이터셋 parquet 다운로드 가능, Playwright(Python)+`/opt/pw-browsers/chromium-1194`로 로컬 웹 화면 스크린샷 가능. 2026-10-14 세션 6: huggingface.co GGUF 다운로드 가능, `github.com/.../releases/latest`는 403(태그를 모르면 Releases 다운로드 불가) → PyPI `llama-cpp-python` 소스 빌드로 llama.cpp 실행. 2026-10-15 세션 8: download.documentfoundation.org(LibreOffice 최신 deb)·archive.ubuntu.com(apt) 가능, download.calibre-ebook.com은 TLS 오류. 2026-10-16 세션 9: download.gimp.org(AppImage)·xnview.com(deb)·imagemagick.org(→ GitHub Releases 고정 태그 AppImage)·apps.microsoft.com·Hugging Face `Spawning/PD12M` + `pd12m.s3.us-west-2.amazonaws.com` 가능, Wikimedia Commons API·upload.wikimedia.org는 429. Xvfb+xdotool로 GUI 앱 조작·스크린샷 가능. 2026-10-16 세션 10: 태그를 아는 GitHub Releases 다운로드 가능(`ghostpdl-downloads/releases/download/gs10080/…tar.gz`, `qpdf/releases/download/v12.4.2/…zip`), archive.ubuntu.com 최신 deb는 glibc 2.43 필요라 사용 불가 → Ghostscript는 소스 빌드. 2026-10-16 세션 12: dl.flathub.org(flatpak 런타임)·download.blender.org·support.discord.com Zendesk API(`/api/v2/help_center/…`) 가능, support.discord.com 일반 페이지 403, trac.ffmpeg.org는 Anubis 봇 차단. 2026-10-16 세션 13: storage.googleapis.com(libwebp 바이너리)·libjxl·jpegoptim GitHub Releases·download.gimp.org 가능, Google Trends API는 쿠키 방식도 429 반복(RSS는 가능) |
| AdSense                       | 미신청    | 글 20편 도달 즉시 신청, 승인 후 `src/core/config/internal/ads.ts`에 ID 입력          |
| 이미지 생성                   | 설정됨    | 2026-10-22 [tools/hero_image.py](tools/hero_image.py): Z-Image-Turbo(Apache-2.0, `leejet/Z-Image-Turbo-GGUF` Q8_0 + `unsloth/Qwen3-4B-Instruct-2507-GGUF` Q6_K + `Comfy-Org/z_image_turbo` VAE)를 stable-diffusion.cpp(`master-987-a77d362`, github.com git clone)로 CPU 실행. 키·비용 없음. 필요 네트워크: github.com(git clone)·huggingface.co. 4코어·15GB에서 1280×720 1장 약 47분(8단계), 메모리는 `--vae-tiling`으로 15GB 안. Gemini·OpenAI 이미지 API는 무료 등급이 없어 쓰지 않음 (사용자 결정) |
| 운영 대시보드                 | 설정됨    | 2026-10-14 생성: https://claude.ai/artifact/4nL6tkJXzL4YQd2FXis8Cb ([운영 대시보드](#운영-대시보드)). 세션마다 데이터 갱신 |
| 정기 실행                     | 설정됨    | Routine "ToolProof 정기 글 작성": 매일 00:00·06:00·12:00·18:00 (한국 시간), 세션 유형(06 뉴스·18 개선·00·12 일반)은 시작 시각으로 구분, 매번 새 세션. 2026-10-22 프롬프트를 개편 전략(클러스터·브리프·개선 세션·searchfit-seo 스킬)으로 갱신. 커넥터 없이 생성됨 → GitHub 도구 접근이 안 되면 claude.ai Routines 화면에서 다시 생성 (사용자) |
| 주간 SEO 점검                 | 설정됨    | Routine "주간 SEO 점검": 매주 월요일 08:45 (한국 시간, cron `45 23 * * 0` UTC), 같은 세션에 이어서 실행. 2026-10-22 searchfit-seo 스킬로 점검하고 log.md에 보고 섹션만 PR로 기록하는 새 프롬프트를 준비함 ([주간 SEO 점검](#주간-seo-점검)). 루틴 프롬프트는 루틴이 게시하는 스레드에서만 바꿀 수 있어 그 스레드에서 적용 필요 (사용자) |
| SEO 플러그인                  | 설치됨    | 2026-10-22 사용자가 searchfit-seo 설치. 스킬 이름 `searchfit-seo:{content-strategy, content-brief, seo-check, seo-audit, technical-seo, internal-linking, on-page-seo, keyword-clustering, ai-visibility, schema-markup}` ([SEO 플러그인](#seo-플러그인-searchfit-seo)) |
| 리디렉트                      | 설정됨    | 2026-10-22 삭제 글 7개 URL → 같은 주제 글 308(`apps/ad-blog/vercel.json`, 테스트 `scripts/lib/vercel-redirects.test.ts`). `video-to-gif-high-quality-free`는 대체 글이 없어 404. `www.tool-proof.com` → 루트가 307(임시)이라 Vercel 도메인 설정에서 308(영구)로 바꾸는 것이 좋음 (사용자) |
