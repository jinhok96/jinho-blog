# ToolProof 글쓰기 가이드

글 작성·수정 시 이 기준을 따릅니다. 새로 알게 된 규칙(성과 데이터로 확인된 것 포함)은 이 문서에 추가합니다.

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

| 유형           | 검색 의도 예                         | 핵심 구성                                                   |
| -------------- | ------------------------------------ | ----------------------------------------------------------- |
| How-to         | how to use / turn on / set up X      | 짧은 답 → 요구 조건 → 단계별 방법 → 문제 해결 → FAQ         |
| Fix            | X not working / error message        | 원인 요약 → 빠른 해결 → 원인별 해결 → 그래도 안 될 때 → FAQ |
| Comparison     | X vs Y / best X for Y                | 결론 먼저 → 비교표 → 항목별 차이 → 상황별 추천              |
| Explainer      | what is X / is X free / is X safe    | 한 문단 정의 → 무엇을 할 수 있나 → 가격·한도 → 주의점       |

## 구조

- **제목(title)**: 60자 이내, 핵심 키워드를 앞쪽에. 연도는 가격·비교처럼 시점이 중요한 글에만
- **설명(description)**: 140~160자, 검색 결과에 그대로 노출되므로 글이 답하는 내용을 구체적으로
- **도입**: 2~3문장으로 답 요약. 필요하면 바로 아래 `## Quick answer` 대신 첫 문단에서 해결
- **소제목**: `##`부터 시작 (본문 `#` 금지). 검색 질문 형태의 소제목 권장. 도입부가 있으면 첫 소제목 앞에, `##`이 3개 이상이면 두 번째 소제목 앞에 본문 광고가 들어감
- **검증 정보**: 직접 실행한 글은 `## What we tested` 또는 해당 단계 안에 환경·날짜·결과를 기록
- **FAQ**: 관련 질문(People also ask) 3~5개를 `## FAQ` 아래 `###`로
- **출처**: 본문 링크로 충분하면 생략, 많으면 `## Sources` 목록
- **길이**: 검색 의도를 다 채우는 만큼. 보통 900~1,800단어, 분량 채우기용 문단 금지

## 파일·frontmatter

- 파일: `content/posts/{slug}.mdx`. slug는 영문 소문자·숫자·하이픈, 핵심 키워드 3~6단어 (예: `chatgpt-memory-not-working`). 날짜·연도 넣지 않음 (URL은 바꾸지 않기 위해)
- 이미지: `content/posts/images/{slug}/…` (webp 권장), `![구체적인 대체 텍스트](./images/{slug}/file.webp)`. 직접 찍은 스크린샷(로컬 실행 결과 또는 네트워크 허용 시 웹 화면)·직접 만든 그림만 사용 (저작권). 이미지가 없으면 표·단계 목록으로 대체

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
- 내용을 크게 고치면 `updatedAt` 갱신 (사소한 오탈자는 제외)

## 링크

- 내부 링크: 관련 글이 있으면 2개 이상 연결 (`/posts/{slug}`), 새 글을 쓰면 기존 관련 글에도 링크 추가
- 외부 링크: 1차 출처 위주. 경쟁 블로그·제휴 링크 금지

## AdSense 정책

- 금지 주제: 해킹·크랙·불법 다운로드·유료 기능 우회·탈옥(jailbreak)·성인·도박
- 광고 클릭 유도 문구 금지, 광고처럼 보이는 링크·버튼 금지
- 남의 글·이미지 복제 금지, 짧게 인용할 때는 출처 표시

## 발행 전 체크리스트

- [ ] 사실마다 1차 출처를 이번 세션에서 확인했다
- [ ] 직접 실행한 내용과 문서 기반 내용을 구분해서 썼다
- [ ] 제목 60자 이내, 설명 140~160자, 핵심 키워드 포함
- [ ] 첫 2~3문장에서 답을 준다
- [ ] `##` 소제목 3개 이상, FAQ 포함
- [ ] 내부 링크(가능한 경우)·외부 출처 링크
- [ ] 금지 표현·이모지·가상 체험담 없음
- [ ] `pnpm --filter @jinho-blog/ad-blog build` 통과, 생성된 HTML에서 제목·설명·JSON-LD 확인
