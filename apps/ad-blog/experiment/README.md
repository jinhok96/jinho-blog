# ToolProof 운영 실험

Claude가 주제 조사 → 글 작성 → 배포 → 성과 분석을 맡아 운영하는 광고 수익형 블로그 실험입니다. 매 세션은 새 컨테이너에서 시작하므로, 실험 상태는 이 디렉터리의 문서로만 이어집니다. **세션을 시작하면 이 파일 → [log.md](log.md) → [backlog.md](backlog.md) 순서로 읽고 시작합니다.**

## 목표

1. 실제로 광고 수익을 낼 수 있는지 확인
2. SEO를 지속적으로 개선
3. 노출·유입을 막는 문제를 찾아 개선

## 결정사항

| 항목      | 결정                                                       | 결정일     |
| --------- | ---------------------------------------------------------- | ---------- |
| 시장      | 영어권 (미국 중심)                                         | 2026-10-11 |
| 분야      | 일반 사용자 대상 IT·AI 도구                                | 2026-10-11 |
| 사이트명  | ToolProof                                                  | 2026-10-11 |
| 작성자    | 브랜드 이름(ToolProof), AI 작성 공개 없음                  | 2026-10-11 |
| 배포 권한 | Claude가 모든 PR을 CI 통과 후 직접 머지                    | 2026-10-11 |
| 연락처    | 계정 이메일 (소개·문의·개인정보처리방침에 공개)            | 2026-10-11 |
| 도메인    | `tool-proof.com` (`toolproof.com`은 타인 소유, `toolproof.app`은 CloudCannon의 동명 개발 도구) | 2026-10-11 |
| 호스팅    | Vercel Pro (`jinho-blog-team`/`ad-blog`, 루트 `apps/ad-blog`), main 머지 시 자동 배포 | 2026-10-11 |

작성자를 브랜드로 표기하더라도 **가상 인물·경력·체험담은 만들지 않습니다.** "We tested"는 실제로 컨테이너에서 실행·확인한 경우에만 씁니다.

## 전략

### 왜 이 시장·분야인가

- 미국 광고 단가가 한국·일본의 약 2~3배, 구글 점유율 ~90% → Search Console 데이터로 실험 루프를 돌리기 적합
- 신규 도메인은 뉴스성 키워드에서 순위를 못 잡음 → **출시 직후 사용법·문제 해결·비교**처럼 수개월 지속되는 검색 수요를 노림
- AI Overviews가 클릭을 줄이므로 **AI 요약이 답하기 어려운 검색**을 우선: 학습 시점 이후 정보, 특정 오류·환경별 해결법, 직접 실행한 비교 결과
- 차별점: 컨테이너에서 실제로 설치·실행·측정한 결과 (E-E-A-T의 Experience). 현재 네트워크 정책상 npm·PyPI·GitHub에서 받을 수 있는 오픈소스 도구만 직접 실행 가능 (인프라 상태 참고)

### 콘텐츠 구성

- 트렌드 대응(출시·업데이트 직후 글) 30% : 상시 수요(설정법·비교·개념 설명) 70%
- 한 분야(IT·AI 도구)에 집중해 주제 권위(topical authority)를 쌓음. 카테고리: `ai-tools`, `software`
- 같은 주제의 글끼리 내부 링크로 묶음 (허브 글 ↔ 세부 글)

### 주제 선정 기준

후보마다 아래를 확인하고 [backlog.md](backlog.md)에 기록합니다.

1. 검색 수요 신호: 자동완성 하위 검색어가 여러 곳(Google·Bing·YouTube)에서 나오는지, 커뮤니티 질문이 있는지 (`demand_check.py suggest`), 후보끼리·기존 글 주 검색어와 비교한 Google Trends 상대 검색량 (`trends_compare.py`). 두 결과를 backlog에 근거로 기록
2. 수명 (며칠짜리 뉴스면 제외, 수개월 이상 우선)
3. 경쟁 (상위 결과가 대형 매체·공식 문서로만 채워져 있으면 후순위, 오래되거나 부실한 결과가 있으면 우선). 경쟁이 심해도 제외하지 않음: 대형 매체가 다루지 않는 **세부 각도**(특정 오류 메시지·기기/버전/국가 조건·설정에 없을 때의 방법·직접 측정값)를 하나 정할 수 있으면 그 각도의 검색어로 씀 (예: `turn-off-ai-in-chrome`은 경쟁 주제지만 소스 코드로 확인한 메뉴·정책으로 평균 순위 5.5). 글 20~30편 이후 Search Console 순위 추이로 경쟁 가중치를 다시 정함 (2026-10-14 사용자 결정)
4. AI Overviews 위험 (한 줄로 답이 끝나는 질문은 후순위)
5. 직접 검증 가능 여부 (컨테이너에서 실행·확인 가능하면 우선)
6. 광고 가치 (소프트웨어·SaaS·보안·생산성 주제 우선)

### 주제 발굴 소스

Google Trends 급상승 RSS에는 그날 폭증한 검색어(스포츠·연예 등)만 올라와 IT 도구 주제는 거의 안 나옵니다. RSS는 큰 IT 이슈 확인용으로만 쓰고, 아래 순서로 찾습니다. 모두 2026-10-11 컨테이너에서 접속 확인.

| 단계 | 소스 | 조회 방법 |
| --- | --- | --- |
| 발견 | 공식 피드: Windows Blog, Chrome Releases(Stable), Google Workspace Updates, Google Blog, OpenAI News, Apple Newsroom + CISA 악용 취약점(소비자 제품) | `demand_check.py discover` |
| 발견 | Windows 메시지 센터(종료·인증서 만료 공지), Gemini 릴리스 노트, Anthropic 뉴스, Apple 보안 업데이트, Microsoft 365 로드맵 | 직접 열기 (`discover` 출력 하단 링크) |
| 수요 확인 | Google·Bing·YouTube 자동완성 (YouTube는 "not showing"·"not working" 같은 문제 해결형이 잘 나옴) | `demand_check.py suggest "키워드"` |
| 수요 크기 비교 | Google Trends 상대 검색량(미국, 최대 5개) + 관련 검색어(상위·급상승). 기준 키워드를 매번 함께 넣어 요청끼리 비교. YouTube 검색 기준(`--property youtube`), 카테고리로 뜻 좁히기(`--cat 5` Computers & Electronics), 주제 ID(`--suggest`로 찾은 `/g/…`)로 표현 차이 묶기 | `trends_compare.py [--time "now 7-d"] [--property youtube] [--cat 5] [--related] "키워드" ...` |
| 소제목·FAQ 소재 | Chrome 도움말 커뮤니티, Apple Discussions 질문 제목, 자동완성 하위 검색어 | 직접 열기 |
| 사후 판단 | Search Console 노출 검색어 | `gsc_report.py` |

- 기술 뉴스 RSS(The Verge, BleepingComputer, 9to5Google, 9to5Mac, Windows Central, Ars Technica)와 Google News RSS(`news.google.com/rss/search?q=…+when:7d`)는 이슈 확인 보조용. 뉴스 자체보다 그 뒤에 생길 사용법·문제 검색을 노림
- 쓸 수 없음: Reddit(본문 비어 있음), Quora·Downdetector(403), Google 검색 결과(429), Bing Webmaster Tools API(지원 종료), Ahrefs·Semrush 무료 도구(사람 확인·로그인 필요 → 자동 조회 안 함)
- pytrends 4.9.2(2023-04 이후 업데이트 없음)는 같은 Trends API를 쓰므로 따로 설치하지 않음. 쓸 만한 기능(YouTube·카테고리·관련 주제·주제 ID)은 `trends_compare.py`로 옮김. 급상승 목록 함수는 404 (2026-10-14 확인)
- Trends API는 쿠키 없이 부르면 429지만, 홈에서 `NID` 쿠키를 받은 뒤 부르면 열림 (2026-10-14 확인, `trends_compare.py`). 연속 호출하면 429가 나서 재시도(최대 약 2.5분 대기)
- 자동완성·Trends 모두 절대 검색량이 아님 (Trends는 요청 안 최고점 = 100인 상대값). 절대량 판단은 발행 후 Search Console로

### 발행 속도

- 매일 2편 (정기 실행 1회 = 1편, 하루 2회 06:00·18:00 한국 시간, 2026-10-14 사용자 결정). 고른 주제가 1차 출처로 검증되지 않으면 건너뛰지 말고 다음 후보로 바꿔 발행
- 글은 직접 측정한 실험 결과·1차 출처로 확인한 정보만 다루므로, AI 작성 여부를 이유로 발행 수를 줄이지 않음 (2026-10-13 사용자 결정)
- AdSense 신청은 글 20편 도달 즉시 (도메인 색인 확인 후, 2026-10-14 사용자 결정)

## 세션 워크플로우

1. **상태 파악**: 이 파일, [log.md](log.md), [backlog.md](backlog.md) 읽기. 열린 PR이 있으면 먼저 처리
2. **지표 확인**: `python3 -m venv /tmp/gsc && /tmp/gsc/bin/pip install google-auth requests` 후 `/tmp/gsc/bin/python -I apps/ad-blog/experiment/tools/gsc_report.py` → 노출·클릭·CTR·순위, 사이트맵 상태, 글별 색인 상태(URL 검사)를 log.md에 붙이고 개선 작업 판단. 판단 시점이 지난 [검증 기록](traffic-playbook.md#검증-기록)은 `--compare`로 판정해 노하우 상태를 갱신
3. **주제 선택**: [backlog.md](backlog.md)의 반복 일정(Chrome·Windows)과 허브 글 기회([traffic-playbook.md](traffic-playbook.md))를 먼저 확인 → `python3 -I apps/ad-blog/experiment/tools/demand_check.py discover`로 새 주제 발굴 ([주제 발굴 소스](#주제-발굴-소스)) → 후보 키워드를 `demand_check.py suggest`로 수요 확인하고 `trends_compare.py`로 후보끼리 크기 비교 → backlog 상위 후보의 최신성 재확인 (이미 지나간 이슈인지, 새 경쟁 글이 생겼는지)
4. **조사·검증**: 공식 문서·릴리스 노트·가격 페이지를 직접 열어 확인, 가능한 것은 컨테이너에서 실행
5. **작성**: [writing-guide.md](writing-guide.md) 기준 (트래픽 노하우는 [traffic-playbook.md](traffic-playbook.md))
6. **검증**: `pnpm --filter @jinho-blog/ad-blog lint`, `test`, `build` 통과 + 빌드 결과 HTML에서 제목·메타·JSON-LD 확인
7. **배포**: 작업 브랜치에 커밋 → 푸시 → PR → CI 통과 후 머지. 배포가 끝나면 IndexNow 워크플로우가 직전 배포 이후 추가·수정·삭제된 글 URL을 자동 제출 (Actions의 `IndexNow` 실행 로그에서 제출 대상 확인)
8. **기록**: log.md에 세션 기록, backlog.md 갱신, 검증 자료는 [tests/](tests/README.md)에 보관, 새로 알게 된 규칙은 writing-guide.md에 반영, 지표 개선 작업은 traffic-playbook.md 검증 기록에 추가
9. **대시보드 갱신**: log.md 기록 후 [운영 대시보드](#운영-대시보드) 데이터를 갱신 (주소 고정, 새 아티팩트 만들지 않음)

## 운영 대시보드

- 주소: **https://claude.ai/artifact/4nL6tkJXzL4YQd2FXis8Cb** (claude.ai 아티팩트, 비공개. 공유는 사용자가 Share 메뉴에서). **이 주소를 항상 유지**: 새 아티팩트를 만들지 않고, 페이지를 고칠 때도 `Artifact` publish에 `url`로 이 주소를 넘김 (다른 세션에서 `url` 없이 발행하면 새 주소가 생김). 삭제 금지
- 페이지 원본: [dashboard/index.html](dashboard/index.html). 데이터는 아티팩트 DB(`db` 기능, 읽기 `view`·쓰기 `admin`)의 `stats` 컬렉션에 있고 페이지가 실시간으로 읽음 → 데이터만 바꿀 때는 페이지를 다시 발행하지 않음
- `stats` 문서: `summary`(갱신 시각·28일 합계·사이트맵), `daily-YYYY-MM`(달마다 날짜별 지표, 확정/미확정 표시), `posts`(글별 메타·28일 지표·색인 상태), `knowhow`(traffic-playbook 노하우 상태), `sessions`(log.md 세션 제목)
- 세션마다 갱신 절차 (log.md·traffic-playbook.md를 고친 뒤)
  1. `ArtifactData` `list` (`url` 위 주소, `collection: "stats"`)로 문서별 `version` 확인
  2. `/tmp/gsc/bin/python -I apps/ad-blog/experiment/tools/dashboard_data.py --out /tmp/dashboard --versions '{"summary": N, "posts": N, "knowhow": N, "sessions": N, "daily-2026-10": N}'` (1에서 본 버전. 새 달 문서처럼 처음 만드는 문서는 빼면 새로 생성)
  3. `/tmp/dashboard/writes.json` 내용을 `ArtifactData` `batch`의 `writes`로 그대로 전달 (버전이 어긋나면 아무것도 쓰이지 않음 → 1부터 다시)
  4. 실패하면 log.md '다음 할 일'에 기록 (대시보드 갱신은 글 발행을 막지 않음)
- 페이지 구성을 바꿀 때: `dashboard/index.html` 수정 → `Artifact` publish (`file_path` 원본, `url` 위 주소, `capabilities`는 생략해 기존 접근 규칙 유지) → 같은 PR로 커밋

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

## 인프라 상태

| 항목                          | 상태      | 필요 조치 (담당)                                                                   |
| ----------------------------- | --------- | ---------------------------------------------------------------------------------- |
| 도메인·호스팅                 | 설정됨    | `tool-proof.com` 연결, `NEXT_PUBLIC_SITE_URL=https://tool-proof.com`(Production). 필수 체크는 GitHub Actions `test`·`build` (2026-10-12 Vercel 상태 체크를 필수에서 제외: `ignoreCommand`로 건너뛴 배포는 상태가 안 남아 PR이 막힘). `build`는 바뀐 패키지와 의존 앱만 빌드 |
| Search Console                | 등록·API 설정됨 | 2026-10-11 도메인 속성 확인·sitemap 제출·글 3편 색인 요청. 서비스 계정(제한된 권한) 키를 환경변수 `GSC_SERVICE_ACCOUNT_JSON_B64`로 등록, API 도메인 허용. 조회는 [tools/gsc_report.py](tools/gsc_report.py) |
| Bing Webmaster Tools·IndexNow | 설정됨 | 2026-10-12 사용자가 Bing Webmaster Tools 등록. 2026-10-14부터 프로덕션 배포마다 바뀐 글 URL 자동 제출 ([indexnow.yml](../../../.github/workflows/indexnow.yml), [scripts/indexnow.ts](../scripts/indexnow.ts)), Actions에서 수동 실행 시 sitemap 전체 제출. 키 파일 `public/{key}.txt` = `scripts/lib/indexnow.ts`의 `INDEXNOW_KEY`. Bing Webmaster Tools API(키워드 검색량 `GetKeywordStats` 포함)는 지원 종료 → 검색량 조회에 쓰지 않음 (2026-10-14 사용자 확인) |
| Google Trends 접근            | 허용됨    | 2026-10-11 사용자가 허용 도메인에 추가 (새 세션부터 적용). 미국 급상승 검색어: `https://trends.google.com/trending/rss?geo=US`. 2026-10-14 상대 검색량·관련 검색어 API를 쿠키 방식으로 사용 ([tools/trends_compare.py](tools/trends_compare.py)) |
| 컨테이너 네트워크             | 일부 허용 | 2026-10-11 세션 2 확인: npm·PyPI·GitHub(Releases 다운로드)·trends.google.com·microsoft.com·support.microsoft.com·learn.microsoft.com·support.google.com·apple.com·huggingface.co·tool-proof.com 접속 가능. help.openai.com·api.github.com은 403. 2026-10-12 세션 3: raw.githubusercontent.com·k2-fsa.github.io·download.pytorch.org·en.wikipedia.org 가능, github.com HTML 페이지·소스 zip은 차단. 2026-10-13 세션 4: huggingface.co 데이터셋 parquet 다운로드 가능, Playwright(Python)+`/opt/pw-browsers/chromium-1194`로 로컬 웹 화면 스크린샷 가능. 2026-10-14 세션 6: huggingface.co GGUF 다운로드 가능, `github.com/.../releases/latest`는 403(태그를 모르면 Releases 다운로드 불가) → PyPI `llama-cpp-python` 소스 빌드로 llama.cpp 실행 |
| AdSense                       | 미신청    | 글 20편 도달 즉시 신청, 승인 후 `src/core/config/internal/ads.ts`에 ID 입력          |
| 운영 대시보드                 | 설정됨    | 2026-10-14 생성: https://claude.ai/artifact/4nL6tkJXzL4YQd2FXis8Cb ([운영 대시보드](#운영-대시보드)). 세션마다 데이터 갱신 |
| 정기 실행                     | 설정됨    | Routine "ToolProof 정기 글 작성": 매일 06:00·18:00 (한국 시간, 2026-10-14 변경), 매번 새 세션. 커넥터 없이 생성됨 → GitHub 도구 접근이 안 되면 claude.ai Routines 화면에서 다시 생성 (사용자) |
