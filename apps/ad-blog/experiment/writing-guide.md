# ToolProof 글쓰기 가이드

글 작성·수정 시 이 기준을 따릅니다. 새로 알게 된 규칙(성과 데이터로 확인된 것 포함)은 이 문서에 추가합니다. 근거로 삼은 Google 문서·대형 블로그 사례는 [참고한 기준](#참고한-기준)에 있습니다.

## 작성 전: 검색 의도와 차별점

- 주 검색어 1개와 하위 검색어 3~8개를 정함 (`demand_check.py suggest` 결과에서 고름)
- WebSearch로 주 검색어 상위 결과 5~10개의 제목·구성을 보고 세 가지를 맞춤: **유형**(how-to·fix·비교·설명), **형식**(단계 목록·순위 목록·비교표), **각도**(제목에 반복되는 요소: 무료·오프라인·최신 버전·연도 등). 상위 글을 베끼지 않되, 상위 글들이 공통으로 다루는 소주제는 빠뜨리지 않음
- 상위 글에 없는 것을 1가지 이상 차별점으로 정함: 직접 측정값, 최신 버전의 실제 메뉴 이름, 해 봤지만 안 된 방법, 무료·유료 경계. 차별점을 찾지 못하면 다른 주제로 바꿈
- 주 검색어·하위 검색어·차별점을 `tests/{slug}/factcheck.md` 맨 위에 기록 (발행 후 Search Console의 실제 검색어와 비교)

## 독자와 문체

- 독자: 기술에 익숙하지 않은 일반 사용자 (개발자 아님). 미국 영어 철자·날짜 표기
- 2인칭(you)으로 바로 할 일을 말함. 브랜드 1인칭은 `we`
- 첫 2~3문장 안에 답을 줌 (검색 의도를 바로 충족). 배경 설명은 뒤로
- 짧은 문장, 단계는 번호 목록, 메뉴 경로는 **Settings > Personalization > Memory**처럼 굵게
- 금지: 과장·낚시 제목, 이모지, 군더더기 도입("In today's fast-paced world…"), "In conclusion", "delve", "game-changer", 같은 말 반복, 키워드 반복 삽입

## 정확성 (가장 중요)

- 모든 사실(기능, 메뉴 경로, 가격, 한도, 출시일, 지원 국가)은 **이번 세션에서 직접 연 1차 출처**로 확인. 기억에 의존하지 않음
- 확인한 출처는 본문에 링크 (공식 문서·릴리스 노트·가격 페이지 우선, 언론 기사는 보조)
- 직접 실행한 내용만 "we tested / we ran"으로 표현하고, 환경(OS·버전·날짜)을 적음
- 직접 확인하지 못한 단계는 "According to [공식 문서]"처럼 출처를 밝힘
- 가상 인물·경력·사용 기간·체험담·인용문을 만들지 않음 ("I've used it for months" 금지)
- 가격·한도·지역처럼 자주 바뀌는 정보는 "as of {Month YYYY}"로 시점 표시
- 확인되지 않은 루머·유출 정보는 쓰지 않음

## 글 유형

| 유형       | 검색 의도 예                      | 제목 패턴                                                      | 핵심 구성                                                   |
| ---------- | --------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------- |
| How-to     | how to use / turn on / set up X   | `How to {동작} {제품}, {범위·조건}`                            | 짧은 답 → 요구 조건 → 방법별 단계 → 문제 해결 → FAQ         |
| Fix        | X not working / error message     | `{증상·오류 메시지 그대로}: {원인 또는 해결 방법}`             | 원인 요약 → 빠른 해결 → 원인별 해결 → 그래도 안 될 때 → FAQ |
| Comparison | X vs Y / best X for Y             | `{A} vs {B}, Tested` · `Best Free {X} ({N} Tested)`            | 결론 먼저 → 요약 표 → 평가 기준 → 도구별 결과 → 상황별 추천 |
| Explainer  | what is X / is X free / is X safe | `Is {X} Free? {핵심 조건}` · `What {X} Does and How to {동작}` | 한 문단 정의 → 무엇을 할 수 있나 → 가격·한도 → 주의점       |

## 제목·설명 (클릭률)

검색 결과에서 클릭 여부는 제목·설명·URL로 정해집니다.

- **길이**: 제목 40~55자 권장, 최대 60자. 페이지 `<title>`에는 ` | ToolProof`(12자)가 붙음. 너무 짧거나 긴 제목은 Google이 고쳐 씀 (title 60자 초과는 76% 이상, 70자 초과는 거의 전부 재작성)
- **검색어 그대로, 앞쪽에**: 주 검색어의 단어를 동의어로 바꾸지 않고 제목 앞부분에 둠. slug도 같은 단어로 (URL이 검색어와 일치하면 CTR이 높음)
- **차별점을 제목에**: 직접 측정한 글은 규모·방식을 괄호나 콜론 뒤에 넣음 (`(8 Models Tested)`, `: Piper vs Kokoro, Tested`). 숫자는 본문과 일치해야 함 (제목이 곧 H1)
- **기호**: 강조는 대괄호 `[ ]` 대신 괄호 `( )`, 구분은 콜론·대시 (대괄호 부분은 Google이 자주 지움)
- **답을 숨기지 않음**: "Here's what it means"처럼 핵심을 감춰 클릭을 유도하는 제목 금지 (Google Discover가 금지하는 방식). 무엇을 알려 주는 글인지 제목에서 드러나게
- 질문형 제목은 CTR 차이가 거의 없으므로 고집하지 않음. 문제를 강조하기보다 해결을 말하는 표현을 우선
- **연도**: 목록·가격이 해마다 바뀌는 글에만 넣음. 넣었다면 매년 내용을 재검증하고 연도와 `updatedAt`을 함께 갱신 (지난 연도가 남은 제목은 Google이 고쳐 씀)
- **설명(description)**: 140~160자. 글 전체를 요약하고 구체 정보(측정 규모·핵심 결과·대상 버전·무료 여부)를 넣음. 키워드 나열, 다른 글과 같은 문장 금지
- Google은 스니펫을 주로 본문에서 뽑고, 설명이 더 정확할 때만 설명을 씀 → 첫 문단과 각 소제목의 첫 문장도 그대로 스니펫이 될 수 있게 씀

## 구조

- **도입**: 첫 2~3문장에서 답을 줌. 측정 글은 첫 문단에 결론과 함께 무엇을 몇 개, 어떤 조건에서 테스트했는지 씀 (예: `free-offline-text-to-speech` 첫 문단 — "use Kokoro if you can wait a little, and Piper if you need speed. In our test of 11 open voices on a 4-core CPU…")
- **요약 표**: 방법이나 도구가 3개 이상이면 도입 바로 다음에 한눈에 보는 표를 둠. How-to는 방법·대상·되돌릴 수 있는지, 비교는 추천 상황(Best for)·핵심 측정값·가격(무료 여부)
- **소제목**: `##`부터 시작 (본문 `#` 금지). 목차(TOC)에 그대로 나오므로 짧고 내용이 드러나게, 검색 질문 형태 권장. 소제목 바로 아래 첫 문장은 그 소제목의 답. 도입부가 있으면 첫 소제목 앞에, `##`이 3개 이상이면 두 번째 소제목 앞에 본문 광고가 들어감
- **방법이 여러 개일 때**: 방법별로 `##`를 나누고, 쉽고 되돌릴 수 있는 방법을 먼저 둠. 데이터 삭제·초기화·레지스트리·정책처럼 영향이 큰 방법은 뒤에 두고 무엇이 지워지는지 경고
- **플랫폼별 단계**: Windows·Mac·Android·iPhone·웹의 단계가 다르면 소제목을 나눔
- **단계**: 번호 목록, 한 단계에 한 동작. 버튼·메뉴 이름은 화면 표기 그대로 굵게
- **검증 정보**: 직접 실행한 글은 `## What we tested` 또는 해당 단계 안에 환경·날짜·결과를 기록
- **FAQ**: 본문에서 답하지 않은 실제 하위 검색어(자동완성·커뮤니티 질문)가 있을 때만 `## FAQ` 아래 `###`로 2~5개. 본문 내용 반복 금지. Google FAQ 리치 결과는 2026-05-07부터 표시되지 않으므로 FAQPage 구조화 데이터는 넣지 않음
- **마무리**: 요약 문단 대신 상황별 추천("Which one should you use?")이나 다음에 할 일로 끝냄
- **출처**: 본문 링크로 충분하면 생략, 많으면 `## Sources` 목록
- **길이**: Google은 선호하는 분량이 없다고 밝힘. 검색 의도를 다 채우는 만큼만 씀 (단순 질문 600~1,000단어, 측정·비교 글 1,200~2,500단어가 보통). 분량 채우기용 문단 금지

## 비교·측정 글

- **평가 기준을 먼저**: 결과 표 위나 `## How we tested`에 선택을 가르는 기준 3~5개(정확도·속도·사용 편의·가격 등)와 그 기준을 고른 이유를 씀
- **측정값은 표로**, 바로 아래에 조건(하드웨어·버전·입력 파일·반복 횟수·중앙값 여부)을 적음
- **같은 조건 재사용**: 같은 분야 글은 같은 입력 파일·스크립트로 측정해 글끼리 결과를 비교할 수 있게 함. 측정 방법이 바뀌면 이전 결과와 직접 비교할 수 없다고 글에 밝힘
- **도구별 섹션**: `### {도구}: best for {상황}` + 측정값 요약 + 장점·단점(직접 확인한 것만) + 가격·라이선스(as of {Month YYYY})
- **추천에는 근거를**: "best"·"we recommend"를 쓰면 같은 문단에 측정값이나 직접 확인한 근거를 붙임
- **제외한 도구**: 검토했지만 뺀 도구와 이유를 `## Other tools we looked at`에 짧게 씀 (독자가 찾는 이름이 들어가 하위 검색어도 다룸)
- 이전 버전과 달라진 점이 결과에 영향을 주면 적음

## 이미지

- 측정 글은 결과 그래프 1개 이상, How-to·Fix는 직접 찍은 스크린샷(컨테이너의 Chromium·Playwright나 로컬 실행 화면)을 넣음. 직접 만든 이미지만 사용 (저작권). 만들 수 없으면 표·단계 목록으로 대체
- **대표 이미지**: frontmatter `thumbnail` → 본문 첫 이미지 순으로 썸네일·OG 이미지가 됨. 가로 1200px 이상, 16:9에 가깝고 글을 대표하는 그림(측정 그래프·실제 화면)으로 함. 로고·글자 위주 이미지 금지. 둘 다 없으면 제목 글자로 자동 생성되는데, 이는 Google Discover가 피하라고 하는 글자 위주 이미지임
- 파일: `content/posts/images/{slug}/{내용}.webp` (예: `tts-speed-chart.webp`). `image1`·`screenshot`처럼 의미 없는 이름 금지. 본문에서는 `![구체적인 대체 텍스트](./images/{slug}/file.webp)`
- alt 텍스트: 이미지가 보여주는 내용이나 그 단계의 동작을 구체적으로 씀. 키워드 나열 금지. 이미지는 관련 문단 바로 옆에 둠
- 스크린샷에는 클릭할 위치를 표시하면 좋음. 계정 이름·이메일 같은 개인 정보는 가림

## 파일·frontmatter

- 파일: `content/posts/{slug}.mdx`. slug는 영문 소문자·숫자·하이픈, 주 검색어 단어 3~6개 (예: `chatgpt-memory-not-working`). 날짜·연도 넣지 않음 (URL은 바꾸지 않기 위해)

```mdx
---
title: How to Turn Off ChatGPT Memory (and Delete What It Saved)
description: Step-by-step instructions to pause, turn off, or clear ChatGPT memory on web and mobile, plus what happens to chats you already had.
category: ai-tools
createdAt: 2026-10-11
tags:
  - ChatGPT
  - privacy
  - settings
---
```

- `category`: `ai-tools`(AI 도구·AI 기능) 또는 `software`(앱·OS·브라우저)
- `tags`: 3~6개, 제품명·주제 (관련 글 계산에 사용)
- 내용을 크게 고쳤을 때만 `updatedAt` 갱신. 오탈자 수정, 제목·설명만 바꾼 경우, 날짜만 바꾸는 갱신은 제외 (내용 변화 없이 날짜만 바꾸는 것을 Google은 경고 신호로 봄)

## 링크

- 내부 링크: 관련 글이 있으면 2개 이상 연결 (`/posts/{slug}`). 새 글을 쓰면 기존 관련 글에도 링크를 추가해 모든 글이 다른 글에서 1번 이상 링크되게 함
- 앵커 텍스트: 링크 대상이 드러나게 씀 (`our test of 8 offline transcription models`). "click here"·"this article"·"read more" 금지, 링크를 연달아 붙이지 않음
- 외부 링크: 1차 출처 위주. 경쟁 블로그·제휴 링크 금지

## AdSense 정책

- 금지 주제: 해킹·크랙·불법 다운로드·유료 기능 우회·탈옥(jailbreak)·성인·도박
- 광고 클릭 유도 문구 금지, 광고처럼 보이는 링크·버튼 금지
- 남의 글·이미지 복제 금지, 짧게 인용할 때는 출처 표시

## 발행 후 개선

`gsc_report.py`로 글별 검색어·노출·CTR·순위를 확인합니다. 고친 내용과 날짜는 log.md에 남기고 4주 후 비교합니다.

- 노출은 있는데 CTR이 낮은 글(노출 100회 이상이고, 비슷한 순위의 다른 글보다 CTR이 낮음): 실제 노출 검색어에 맞춰 제목·설명을 고침
- 8~20위 검색어: 그 검색어를 다루는 소제목·FAQ를 보강 (2페이지 이하에는 클릭이 거의 없음)
- 예상하지 못한 검색어로 노출되면 그 검색 의도를 다룰 새 글 후보로 backlog에 추가
- 버전·메뉴가 자주 바뀌는 주제(브라우저·OS·AI 앱)는 다음 메이저 업데이트 후 다시 확인

## 발행 전 체크리스트

- [ ] 주 검색어·차별점을 정했고, 상위 결과의 유형·형식에 맞췄다
- [ ] 사실마다 1차 출처를 이번 세션에서 확인했다
- [ ] 직접 실행한 내용과 문서 기반 내용을 구분해서 썼다
- [ ] 제목 60자 이내(주 검색어는 앞쪽, 차별점 포함), 설명 140~160자
- [ ] 첫 2~3문장에서 답을 주고, 소제목마다 첫 문장이 그 소제목의 답이다
- [ ] `##` 소제목 3개 이상, 방법·도구가 3개 이상이면 요약 표가 있다
- [ ] FAQ는 본문에 없는 실제 질문만 넣었다 (없으면 생략)
- [ ] 만들 수 있으면 대표 이미지(가로 1200px 이상, 직접 만든 그래프·스크린샷)와 구체적인 alt를 넣었다
- [ ] 내부 링크(가능한 경우)는 설명형 앵커 텍스트로, 외부 출처 링크도 넣었다
- [ ] 금지 표현·이모지·가상 체험담 없음
- [ ] `pnpm --filter @jinho-blog/ad-blog build` 통과, 생성된 HTML에서 제목·설명·JSON-LD 확인
- [ ] 측정 스크립트·결과·사실 확인표(주장 → 출처 → 확인 방법)를 `experiment/tests/{slug}/`에 저장 (큰 다운로드 파일은 제외)

## 참고한 기준

2026-10-13 확인. 외부 연구의 수치는 다른 사이트 표본에서 나온 것이라 이 블로그에서도 같다는 보장은 없으므로, 발행 후 Search Console로 확인합니다.

| 출처                                                                                                                                                                          | 반영한 내용                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Google [Creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)                                                            | 과장 없는 제목, 원본 정보·분석, 선호 분량 없음, 날짜만 바꾸는 갱신은 경고 신호                                                                                    |
| Google [Write high quality reviews](https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews)                                                 | 정량 측정, 선택 기준, 대안 비교, 근거 있는 "best" 추천, 이전 버전 대비 변화                                                                                       |
| Google [Title links](https://developers.google.com/search/docs/appearance/title-link)·[Snippets](https://developers.google.com/search/docs/appearance/snippet)                | 제목 재작성 사유(지난 연도·키워드 반복·H1 불일치), 스니펫은 주로 본문에서 뽑음, 설명은 글마다 다르고 구체적으로                                                   |
| Google [Discover](https://developers.google.com/search/docs/appearance/google-discover)·[Image SEO](https://developers.google.com/search/docs/appearance/google-images)       | 가로 1200px 이상 대표 이미지, 로고·글자 위주 이미지와 핵심을 숨기는 제목 금지, 파일 이름·alt                                                                      |
| Google [Link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)                                                                     | 설명형 앵커 텍스트, 모든 글이 다른 글에서 1번 이상 링크되게                                                                                                       |
| Google [Search Central 변경 기록](https://developers.google.com/search/updates)                                                                                               | FAQ 리치 결과는 2026-05-07부터 표시 안 됨                                                                                                                         |
| Google [AI features](https://developers.google.com/search/docs/appearance/ai-features)                                                                                        | AI Overviews용 별도 최적화는 필요 없음, 중요한 내용은 텍스트로, 내부 링크                                                                                         |
| [Zyppy 제목 재작성 연구](https://zyppy.com/seo/google-title-rewrites/) (2022, title 80,959개)                                                                                 | 51~60자 재작성 최소(39~42%), 60자 초과 76% 이상·70자 초과 99.9%, 대괄호 77.6% 재작성, H1과 title 일치                                                             |
| [Backlinko CTR 연구](https://backlinko.com/google-ctr-stats) (Google 결과 약 400만 개)                                                                                        | 40~60자 제목 CTR 최고, 질문형 차이 없음, URL과 검색어 일치 시 CTR 45% 높음, 2페이지 이하 클릭 0.63%                                                               |
| Ahrefs [Search intent](https://ahrefs.com/blog/search-intent/)                                                                                                                | 상위 결과의 유형·형식·각도(3 Cs)에 맞추기, 상위 글의 공통 소주제                                                                                                  |
| Zapier [Best transcription software](https://zapier.com/blog/best-transcription-apps/)·[How we select apps](https://zapier.com/blog/selecting-apps/)                          | 첫 문장에 테스트 규모, 요약 표(Best for·특징·가격), 평가 기준 섹션, 도구별 장단점·가격, 2018년 글을 같은 URL로 계속 갱신                                          |
| How-To Geek [Disable Recall](https://www.howtogeek.com/how-to-disable-recall/)·[Android key icon](https://www.howtogeek.com/small-key-icon-android-status-bar-what-it-means/) | 방법별 H2와 쉬운 방법 먼저, 단계 스크린샷에 클릭 위치 표시, 본문 내부 링크. 도입 3문단을 훅으로 쓰고 답을 늦게 주는 방식은 검색 유입용 글에 맞지 않아 따르지 않음 |
| Tom's Guide [iPhone SOS mode fix](https://www.tomsguide.com/phones/iphones/my-iphone-kept-getting-stuck-in-sos-mode-heres-how-i-finally-fixed-it)                             | 번호 붙인 해결 단계를 간단한 것부터, 설정이 지워지는 초기화는 마지막에 경고와 함께                                                                                |
| [RTINGS](https://www.rtings.com/)                                                                                                                                             | 같은 조건(test bench)으로 측정해 결과를 비교 가능하게 하고, 방법이 바뀐 리뷰에는 변경 사실을 표시                                                                 |
