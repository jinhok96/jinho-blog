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

1. 검색 수요 신호: 자동완성 하위 검색어가 여러 곳(Google·Bing·YouTube)에서 나오는지, 커뮤니티 질문이 있는지 (`demand_check.py suggest` 결과를 backlog에 근거로 기록)
2. 수명 (며칠짜리 뉴스면 제외, 수개월 이상 우선)
3. 경쟁 (상위 결과가 대형 매체·공식 문서로만 채워져 있으면 후순위, 오래되거나 부실한 결과가 있으면 우선)
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
| 소제목·FAQ 소재 | Chrome 도움말 커뮤니티, Apple Discussions 질문 제목, 자동완성 하위 검색어 | 직접 열기 |
| 사후 판단 | Search Console 노출 검색어 | `gsc_report.py` |

- 기술 뉴스 RSS(The Verge, BleepingComputer, 9to5Google, 9to5Mac, Windows Central, Ars Technica)와 Google News RSS(`news.google.com/rss/search?q=…+when:7d`)는 이슈 확인 보조용. 뉴스 자체보다 그 뒤에 생길 사용법·문제 검색을 노림
- 쓸 수 없음: Reddit(본문 비어 있음), Quora·Downdetector(403), Google 검색 결과·Trends 상세 API(429)
- 자동완성은 검색량 수치가 아님. 정량 판단은 발행 후 Search Console로

### 발행 속도

- 세션당 1~3편, 하루 최대 3편. 품질이 기준에 못 미치면 발행하지 않음 (scaled content abuse 위험)
- AdSense 신청은 글 20~30편 + 도메인 색인 확인 후

## 세션 워크플로우

1. **상태 파악**: 이 파일, [log.md](log.md), [backlog.md](backlog.md) 읽기. 열린 PR이 있으면 먼저 처리
2. **지표 확인**: `python3 -m venv /tmp/gsc && /tmp/gsc/bin/pip install google-auth requests` 후 `/tmp/gsc/bin/python -I apps/ad-blog/experiment/tools/gsc_report.py` → 노출·클릭·CTR·순위, 사이트맵 상태, 글별 색인 상태(URL 검사)를 log.md에 붙이고 개선 작업 판단
3. **주제 선택**: `python3 -I apps/ad-blog/experiment/tools/demand_check.py discover`로 새 주제 발굴 ([주제 발굴 소스](#주제-발굴-소스)) → 후보 키워드를 `demand_check.py suggest`로 수요 확인 → backlog 상위 후보의 최신성 재확인 (이미 지나간 이슈인지, 새 경쟁 글이 생겼는지)
4. **조사·검증**: 공식 문서·릴리스 노트·가격 페이지를 직접 열어 확인, 가능한 것은 컨테이너에서 실행
5. **작성**: [writing-guide.md](writing-guide.md) 기준
6. **검증**: `pnpm --filter @jinho-blog/ad-blog lint`, `test`, `build` 통과 + 빌드 결과 HTML에서 제목·메타·JSON-LD 확인
7. **배포**: 작업 브랜치에 커밋 → 푸시 → PR → CI 통과 후 머지 → 배포 반영 확인 후 새 글·수정한 글 URL을 IndexNow로 제출 (`python3 -I apps/ad-blog/experiment/tools/indexnow.py /posts/{slug}`)
8. **기록**: log.md에 세션 기록, backlog.md 갱신, 검증 자료는 [tests/](tests/README.md)에 보관, 새로 알게 된 규칙은 writing-guide.md에 반영

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
| Bing Webmaster Tools·IndexNow | 설정됨 | 2026-10-12 사용자가 Bing Webmaster Tools 등록. IndexNow 키 파일 `public/{key}.txt`, 제출 스크립트 [tools/indexnow.py](tools/indexnow.py) (`api.indexnow.org` 접속 가능) |
| Google Trends 접근            | 허용됨    | 2026-10-11 사용자가 허용 도메인에 추가 (새 세션부터 적용). 미국 급상승 검색어: `https://trends.google.com/trending/rss?geo=US` |
| 컨테이너 네트워크             | 일부 허용 | 2026-10-11 세션 2 확인: npm·PyPI·GitHub(Releases 다운로드)·trends.google.com·microsoft.com·support.microsoft.com·learn.microsoft.com·support.google.com·apple.com·huggingface.co·tool-proof.com 접속 가능. help.openai.com·api.github.com은 403. 2026-10-12 세션 3: raw.githubusercontent.com·k2-fsa.github.io·download.pytorch.org·en.wikipedia.org 가능, github.com HTML 페이지·소스 zip은 차단 |
| AdSense                       | 미신청    | 글 20~30편 이후 신청, 승인 후 `src/core/config/internal/ads.ts`에 ID 입력          |
| 정기 실행                     | 설정됨    | Routine "ToolProof 정기 글 작성": 월·수·금 08:45 (한국 시간), 매번 새 세션. 커넥터 없이 생성됨 → GitHub 도구 접근이 안 되면 claude.ai Routines 화면에서 다시 생성 (사용자) |
