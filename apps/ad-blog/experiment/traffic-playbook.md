# 트래픽 노하우

대형 IT 블로그가 조회수를 모으는 방식을 분석해 ToolProof에 옮길 규칙으로 정리한 문서입니다. 글을 쓸 때마다 다른 블로그를 다시 찾아보지 않고 이 문서와 [writing-guide.md](writing-guide.md)를 따릅니다. 분석은 분기마다 다시 돌려 달라진 점만 고칩니다 ([재분석](#재분석)).

처음 노하우는 모두 외부 분석에서 나온 **가설**입니다. 우리 Search Console 데이터로 효과가 확인되면 **검증됨**으로 올리고, 효과가 없으면 고치거나 **기각**합니다 ([성과 검증](#성과-검증)). 외부 분석과 우리 데이터가 다르면 우리 데이터를 따릅니다.

## 노하우 상태

| #   | 노하우                                 | 상태 | 검증 기록 | 갱신일     |
| --- | -------------------------------------- | ---- | --------- | ---------- |
| 1   | 채널에 따라 제목을 다르게 쓴다         | 가설 | -         | 2026-10-22 |
| 2   | 직접 해 본 결과를 설명·첫 문단에서 내세운다 | 가설 | -         | 2026-10-22 |
| 3   | 상시 글·허브 글을 계속 갱신한다        | 가설 | -         | 2026-10-22 |
| 4   | 반복 수요를 일정표로 잡는다            | 가설 | -         | 2026-10-13 |
| 5   | 새 소식은 "그래서 내가 할 일"로 받는다 | 가설 | -         | 2026-10-22 |
| 6   | 모르던 기능·설정 모음                  | 가설 | -         | 2026-10-13 |
| 7   | 사용법 글은 짧고 이미지가 많다         | 가설 | -         | 2026-10-13 |
| 8   | 주 검색어는 가장 구체적인 롱테일로 잡는다 | 가설 | -         | 2026-10-22 |
| 9   | 클러스터 링크로 새 글을 빨리 발견시킨다 | 가설 | -         | 2026-10-22 |

## 분석 방법 (2026-10-13)

| 자료              | 규모                                                                                                                                                    | 무엇을 봤나                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| RSS 최근 글       | 12개 사이트 710편 (Tom's Guide, TechRadar, Windows Central, Laptop Mag, Lifehacker, PCWorld, Ars Technica, 9to5Google, 9to5Mac, PCMag, Engadget, Wired) | 글 유형 비율, 제목 특징 ([`tools/blog_patterns.py`](tools/blog_patterns.py)) |
| 본문 포함 피드    | 7개 사이트 333편                                                                                                                                        | 유형별 분량·소제목·이미지·표·링크·FAQ·요약 박스                              |
| PCMag How-To 피드 | 100편                                                                                                                                                   | 사용법 글만 모았을 때의 제목 방식                                            |
| 인기 글 목록      | Ars Most Read, The Verge Most Popular, 9to5 네트워크 Trending, How-To Geek 홈                                                                           | 실제로 많이 읽히는 글의 성격 (스냅숏)                                        |
| 댓글 수           | 9to5Google·9to5Mac 200편                                                                                                                                | 반응이 큰 글의 특징 (조회수 대리 지표)                                       |
| 상시 글 날짜      | Tom's Guide·TechRadar·PCMag·Zapier 대표 글                                                                                                              | 발행일과 수정일(JSON-LD)로 갱신 여부                                         |

한계: 본문까지 받을 수 있는 How-to 글은 8편뿐이라 How-to 구조 수치는 참고용입니다. 조회수 자체는 공개되지 않아 인기 목록·댓글·갱신 여부를 대리 지표로 씁니다. RSS는 최근 발행 글이라 뉴스·할인 비중이 높고, 유형 분류는 제목 정규식이라 오분류가 있습니다. How-To Geek·MakeUseOf·XDA는 컨테이너에서 접속이 막혀 WebFetch로 일부만 봤습니다.

## 노하우

### 1. 채널에 따라 제목을 다르게 쓴다

- **발견**: 오래 검색되는 사용법 글은 검색어 그대로의 짧은 제목입니다 (Tom's Guide `How to reset an iPhone`, 2021년 발행 후 수정 없이 유지). 새로 발행하는 글은 Discover·뉴스 피드에서 눈에 띄도록 독자의 상황을 말합니다. PCMag How-To 100편 중 `How to`로 시작하는 제목은 3%뿐이고, you/your 70%, 질문형 32%, 길이 중앙값 75자입니다 (예: `Your Internet Provider Is Secretly Tracking Everything You Do at Home. Here's How to Stop It`). 확인한 PCMag·Tom's Guide 글은 모두 `<title>`·`og:title`·H1이 같았습니다 (제목을 채널별로 따로 두지 않음)
- **적용**: 글마다 주 채널을 하나 정합니다
  - **검색형** (검색어가 분명한 How-to·Fix·비교, 상시 수요): 검색어 그대로, 60자 이내
  - **피드형** (출시·변경 직후 글, 측정 결과 자체가 흥미로운 글): 바뀐 사실이나 측정 결과를 한 문장으로 쓰고 75자까지 허용. 주 검색어는 앞 60자 안에 둠. 결과를 숨기는 제목은 쓰지 않음 (Google Discover 정책)
  - 두 채널 모두 제목은 주제만 씀. 콜론·대시 부제나 괄호 측정 규모 같은 꼬리표는 붙이지 않음 (2026-10-22 사용자 결정, [writing-guide.md](writing-guide.md#제목설명-클릭률))
  - 예: 검색형 `How to Transcribe Audio Offline for Free` / 피드형 `Parakeet Transcribes Audio About 5x Faster Than Whisper`

### 2. 직접 해 본 결과를 설명·첫 문단에서 내세운다

- **발견**: 뉴스·할인·반복형을 뺀 글 133편 중 18%가 제목에 test·tried, 28%가 1인칭입니다 (`We Tested Top VPNs on Starlink: How Much Speed Do You Actually Lose?` PCMag, `Best workstation laptops in 2025: 6 tested and reviewed` Laptop Mag). 체험형 글 본문은 중앙값 1,379단어, 이미지 16장
- **적용**: 측정 규모·결과는 제목이 아니라 설명(description)과 첫 문단에서 내세움. 제목에 `We Tested {N} …:`·`({N} Tools Tested)`를 붙이지 않음 (2026-10-22 사용자 결정). 1인칭 `I`와 "두 달 써 봤다" 같은 체험담은 쓰지 않음 (가상 체험 금지). 실제로 측정한 `we`만 씀. 그래프·실행 화면을 넉넉히 넣음

### 3. 돈 되는 상시 글은 계속 갱신하고 시점을 제목에 드러낸다

- **발견**: TechRadar `The best VPN service 2026`은 2023-08 발행 후 2026-10-07 수정, PCMag는 `The Best VPNs We've Tested (October 2026)`처럼 월까지 표기, Zapier 추천 글은 2018 발행 후 2026-04 갱신. 반면 단순 사용법 글(Tom's Guide 아이폰 초기화)은 2021년 이후 수정 기록이 없음. best 글 본문은 중앙값 5,736단어, h2 10·h3 12, 이미지 103장, 내부 링크 34개, FAQ 100%, 요약 박스 73%, 영상 67%
- **적용**
  - 같은 클러스터([clusters.md](clusters.md)) 상시 글이 3편 쌓이면 `Best Free {분야} Tools` 같은 **허브 글**을 만들어 개별 글로 모두 연결 (허브는 상위 검색어, 개별 글은 세부 검색어). 허브 작성·갱신은 12·18시 개선 세션에서
  - 허브는 새 측정이 생길 때마다 갱신하고 `updatedAt`과 제목의 시점 표기(괄호 없이 `in 2026`)를 함께 바꿈. 단순 사용법 글은 메뉴·버전이 바뀔 때만 갱신
  - 분량 경쟁(5,000단어 이상)은 따라 하지 않음. 허브의 요약 표·평가 기준·도구별 섹션 구성만 따름

### 4. 예측 가능한 반복 수요를 일정표로 잡는다

- **발견**: Tom's Guide·TechRadar·PCMag 최근 글의 16%·8%·8%가 매일·매주 반복되는 검색(퍼즐 힌트, 이번 주 스트리밍 목록, 경기 시청 방법)을 노린 정기 글
- **적용**: IT 분야의 반복 일정을 backlog에 적어 두고, 발표 당일·다음 날 세션에서 우선 검토
  - Chrome 안정판: 약 2주 간격 (156: 10-20, 157: 11-03, 158: 11-17, 159: 12-08, 160: 2027-01-05). 일정은 `https://chromiumdash.appspot.com/fetch_milestone_schedule?offset=-1&n=5`로 확인
  - Windows: 월간 보안 업데이트 매월 둘째 화요일 10:00(태평양 시간), 선택적 미리 보기 넷째 주, 연간 기능 업데이트 하반기 ([Microsoft Learn](https://learn.microsoft.com/en-us/windows/deployment/update/release-cycle))
  - 새 버전마다 새 글을 쓰기보다, 바뀐 메뉴·기능을 기존 글에 반영하고 변화가 클 때만 새 글

### 5. 새 소식은 뉴스가 아니라 "그래서 내가 할 일"로 받는다

- **발견**: 최근 글의 55%가 뉴스지만, 9to5 댓글 상위 25% 글은 보도·루머·논쟁형 비율이 높고(22% vs 하위 25% 14%), 할인 글은 낮음(4% vs 38%). 인기 글은 사용자에게 직접 영향이 있는 소식입니다 (`These US states just said 'no' to Apple Wallet driver's licenses` 댓글 73개, The Verge `What to expect from Apple's 'Welcome Home' event`, `Learning to use local AI is exciting, overwhelming, and frustrating`)
- **적용**: 신규 도메인은 뉴스 속도로 경쟁할 수 없으므로, 소식 다음 날 생기는 검색(끄는 법·내 지역에서 되는지·나에게 달라지는 것)을 노림. 제목은 바뀐 사실 한 문장 (`{제품} {바뀐 것}`, `: What Changes for You` 같은 꼬리표 없이)

### 6. 이미 쓰는 기기·앱의 "모르던 기능·설정"이 많이 읽힌다

- **발견**: How-To Geek 홈의 최근 글 10편 중 4편이 이 형식입니다 (`Your Samsung Galaxy's side button can do a lot more than you think`, `4 new Waze features you probably haven't tried yet`, `A small key icon just appeared in your Android status bar`). Tom's Guide `3 hidden macOS security features you need to turn on right now`, PCMag `18 Handy Apple Messages Features You Should Already Be Using`
- **적용**: 큰 업데이트 직후 `{N} {제품} Settings to Change After the {버전} Update` 같은 설정 모음 글을 피드형으로 씀. 모든 설정은 실제 메뉴 이름을 1차 출처나 직접 실행으로 확인한 것만

### 7. 사용법 글은 짧고 이미지가 많다

- **발견** (유형별 본문 중앙값)

  | 유형       | 단어  | 첫 소제목 전 | h2  | 이미지 | 내부 링크 | FAQ  | 요약 박스 |
  | ---------- | ----- | ------------ | --- | ------ | --------- | ---- | --------- |
  | How-to     | 822   | 222          | 2   | 6      | 4         | 12%  | 0%        |
  | 비교(vs)   | 1,256 | 263          | 4   | 14     | 8         | 0%   | 14%       |
  | 체험·측정  | 1,379 | 276          | 4   | 16     | 6         | 29%  | 24%       |
  | 설명       | 735   | 221          | 1   | 2      | 3         | 0%   | 11%       |
  | best(허브) | 5,736 | 287          | 10  | 103    | 34        | 100% | 73%       |
  | 뉴스       | 552   | 236          | 1   | 2      | 3         | 4%   | 9%        |

- **적용**
  - 이미지: How-to 3장 이상, 측정·비교 글 5장 이상(그래프·실행 화면)을 목표로 함. 현재 ToolProof 글 5편은 모두 이미지가 0장이라 가장 큰 차이
    - 2026-10-22 사용자 결정으로 강화: 모든 글에 AI 생성 대표 이미지 + 본문 3장 이상 ([writing-guide.md](writing-guide.md#이미지))
  - 도입: 첫 2~3문장에 답, 이어서 측정 범위·대상까지 첫 소제목 전 100~250단어
  - 내부 링크: 관련 글이 있으면 How-to·측정 글 4개 이상, 허브는 모든 개별 글
  - FAQ·요약 박스는 허브(best)에서 거의 항상 쓰고 사용법 글에서는 드묾 → 사용법 글은 FAQ를 선택 사항으로 둠

### 8. 주 검색어는 가장 구체적인 롱테일로 잡는다

외부 분석이 아니라 **우리 Search Console 데이터**에서 나온 가설입니다 (2026-10-22, searchfit-seo `content-strategy`·`keyword-clustering` 기준 분석).

- **발견**: 2026-09-24 ~ 10-22 노출 325회 중 10위 안 비브랜드 검색어 11개는 모두 제품·기능에 동작·조건이 붙은 롱테일 (`chrome disable ai` 7위, `google ai gone` 3위, `offline ocr tools` 5위, `where did gems go in gemini` 6위). 사이트 노출 1위 `turn-off-ai-in-chrome`(103회, 13위)의 주 검색어는 Trends 상대량 0.0인데, 상대량이 큰 상위 검색어(`pdf to word` 23.2·`heic to jpg` 8.5)를 노린 글은 노출이 거의 없거나 색인 전. 상위 검색어 결과는 iLovePDF·Smallpdf 같은 도구 사이트가 차지
- **적용**: 주 검색어는 자동완성 3곳에 나오는 가장 구체적인 변형 (`turn off copilot in word`). Trends는 같은 클러스터 후보끼리 비교에만 씀. 상위 검색어는 허브가 맡고, 상시 글은 세부 검색어를 맡음 ([writing-guide.md](writing-guide.md#작성-전-브리프) 브리프)
- **검증**: README 가설 H6 (롱테일 vs 상위 검색어 글의 발행 28일 노출·순위)

### 9. 클러스터 링크로 새 글을 빨리 발견시킨다

- **발견**: 2026-10-22 발행 32편 중 15편이 `URL is unknown`. 홈은 12편씩 보여서 하루 4편 발행이면 사흘 만에 첫 페이지에서 밀려남. 받는 링크가 1개뿐인 글 7편은 모두 최근 칼럼·새 글. Google 지침: 모든 글이 다른 글에서 링크되어야 발견됨 ([Link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable))
- **적용**: 허브 ↔ 상시 글 ↔ 뉴스 칼럼 링크 규칙과 받는 링크 2개 이상 ([clusters.md](clusters.md#규칙)). 새 글은 이미 색인된 같은 클러스터 글에서 링크를 받음. 개선 세션은 `URL is unknown` 3일 넘은 글부터 연결. 점검은 `link_audit.py`
- **검증**: 개선 세션에서 링크를 보강한 글이 보강 후 7일 안에 색인되는 비율을 log.md에 기록. 같은 기간 보강하지 않은 글과 비교해 5편 이상 쌓이면 판정 (검증 기록에 행 추가, 지표는 색인 여부). 보강한 링크를 Google이 봤는지(링크한 글의 마지막 크롤링이 링크 배포 뒤인지)는 `tools/link_seen.py`로 구분 — 보지 못한 링크는 판정에서 뺌. 2026-10-26부터 대시보드 DB가 회차마다 글별 `seenLinks`·`firstSeenLinkAt`(Google이 링크를 처음 본 크롤링 시각)을 남기므로, 판정 때는 `history` 컬렉션의 `posts` 문서에서 `firstSeenLinkAt` → `indexedAt` 간격을 읽음
- **중간 관찰 (2026-10-26)**: 마지막 크롤링 10-21 08:37 UTC 이후 사이트 전체 크롤링 0. 미색인 26편 중 크롤링된 판에서 링크를 받은 글은 9편(홈 목록 7·`merge-pdf-files-free` 본문 4, 겹침 포함)뿐이고 이 9편도 5~6일째 `URL is unknown`. 나머지 17편은 링크를 단 글이 링크 뒤로 한 번도 크롤링되지 않음 → 지금 병목은 링크 경로가 아니라 크롤링 빈도 (log.md 2026-10-26 세션 52)
- **중간 관찰 (2026-10-29)**: 홈이 10-28 23:14 UTC에 다시 크롤링됨 (10-21 08:37 이후 7일 15시간 만, 그 사이 다른 페이지 크롤링 0). Google이 본 링크가 있는 미색인 글 10편 → 20편(홈 목록 11·홈 허브 고정 3·10-19~20 크롤링된 글 본문 등 6). 하지만 두 홈 크롤링 사이에 발행해 어느 크롤링에서도 홈 목록(최신 12편)에 걸리지 않은 글 10편(10-21 09:27 `gemini-free-flash-lite` ~ 10-24 04:18 `turn-off-ai-in-windows-11`)은 허브·다른 미색인 글에서만 링크를 받아 Google이 본 링크 0. 하루 2편이면 한 글이 홈 첫 페이지에 6일 머무는데 홈 재크롤링 간격이 그보다 길면 일부 글은 홈 경로를 놓침 → 홈 재크롤링 간격을 1~2회 더 보고 홈 목록 편수(12) 조정을 검토 (log.md 2026-10-29 세션 64)

## 따르지 않는 것

대형 블로그는 하지만 ToolProof는 하지 않습니다.

- 결과를 숨겨 궁금증만 유발하는 제목 (Google Discover가 금지하는 방식)
- 제목 꼬리표: 콜론·대시로 붙이는 부제(`: What It Means for You`)·괄호 측정 규모(`(6 Tools Tested)`)·`We Tested {N} …:` 앞머리 (2026-10-22 사용자 결정. 제목은 주제만)
- 1인칭 체험담·사용 기간 주장 (가상 체험 금지. 실제 측정한 `we`만)
- 할인·제휴 글 (최근 글의 24%를 차지하지만, 수익 모델이 AdSense이고 제휴 링크 금지)
- 분량 경쟁 (Google은 선호 분량이 없다고 밝힘)
- SEO 스킬의 일반 조언 중 우리 근거와 다른 것 (2026-10-22 searchfit-seo 설치 후): FAQPage 구조화 데이터(리치 결과 종료), 키워드 3~5회 반복 목표, 결론 요약 문단 + CTA, llms.txt (Google이 쓰지 않음)

## 성과 검증

지표를 올리려고 한 작업(기존 글 수정, 노하우를 적용한 새 글)은 모두 기록하고, 판단 시점에 같은 기준으로 판정해 노하우에 반영합니다.

### 절차

1. **기록**: 작업을 배포한 세션에서 아래 [검증 기록](#검증-기록)에 행을 추가 (ID, 관련 노하우 번호, 대상 글, 바꾼 내용, 배포일, 판정 지표, 판단 시점). 변경 전 지표는 판정 때 도구가 다시 계산하므로 따로 적지 않아도 됨
2. **판정**: 매 세션 지표 확인 때 판단 시점이 지난 행을 판정
   - **기존 글 수정**: `/tmp/gsc/bin/python -I apps/ad-blog/experiment/tools/gsc_report.py --compare /posts/{slug} --changed {배포일} --metric {ctr|impressions|position}` (피드형은 `--type discover`도 실행). 배포일 전후 28일을 비교하고, 같은 기간 나머지 글(대조군)의 변화를 빼서 판정. 결과 표는 log.md에 붙임
   - **새 글에 적용한 노하우**: 적용한 글과 적용하지 않은 글을 각 3편 이상 모아, 각 글의 발행 후 28~56일 구간 평균(노출·CTR·순위)을 비교. 기준은 아래와 같음
   - 노출 부족으로 `보류`면 28일 뒤 다시 판정, 최대 3번(약 12주)까지. 그래도 부족하면 `판단 불가`로 닫음
3. **반영**
   - 같은 노하우에서 서로 다른 글 2건 이상이 `효과 있음`(그리고 `역효과` 0건) → 상태를 **검증됨**으로 올리고, 확인한 수치를 해당 노하우의 **발견** 아래 "우리 데이터"로 추가, [writing-guide.md](writing-guide.md) 규칙을 더 구체적으로 고침
   - `역효과` 1건 또는 `차이 없음` 2건 이상 → 원인(주제·순위대·계절 등)을 적고 노하우를 고치거나 **기각**. 기각하면 writing-guide에서 해당 규칙을 뺌
   - 노하우 상태 표의 상태·검증 기록·갱신일을 고치고, log.md에 무엇을 왜 바꿨는지 기록
   - 작업 중 새로 효과를 확인한 방법은 새 노하우로 추가 (상태 `검증됨`, 근거는 검증 기록 ID)

### 판정 기준

`gsc_report.py`의 상수와 같게 유지합니다. 기준을 바꾸면 두 곳을 함께 고칩니다.

| 지표      | 쓰는 경우                                         | 효과 있음                 | 역효과        |
| --------- | ------------------------------------------------- | ------------------------- | ------------- |
| CTR       | 제목·설명 수정                                    | 대조군 대비 +1.0%p 이상   | -1.0%p 이하   |
| 노출      | 소제목·FAQ 보강, 새 검색어 대응, 피드형(Discover) | 대조군 대비 1.2배 이상    | 1/1.2배 이하  |
| 평균 순위 | 본문 보강·내부 링크                               | 대조군 대비 2위 이상 개선 | 2위 이상 하락 |

- 변경 전·후 기간 모두 대상 글 노출 100회 이상일 때만 판정 (미만이면 `보류`)
- 한 글에 여러 변경을 동시에 하지 않음 (어느 변경의 효과인지 알 수 없음). 같은 글은 이전 변경의 판정이 끝난 뒤 다음 변경
- Google 코어 업데이트 기간과 겹치면 판정을 한 번 미룸

### 검증 기록

| ID  | 노하우 | 대상 글   | 바꾼 내용 | 배포일 | 지표 | 판단 시점 | 판정 | 반영 |
| --- | ------ | --------- | --------- | ------ | ---- | --------- | ---- | ---- |
| V1  | 3      | `transcribe-audio-offline-free` (같이 바꾼 `free-offline-text-to-speech`·`remove-background-from-image-free-offline`은 2026-10-17 삭제) | 허브 글 `free-offline-ai-tools`로 역링크 1개씩 추가 | 2026-10-14 | position | 2026-11-11 | - | - |
| V2  | 3      | `free-offline-ai-tools` | 허브에 OCR 섹션·요약 표 행 추가 (새 측정 글 `image-to-text-offline-free` 연결), `updatedAt` 2026-10-15. 2026-10-17 TTS·배경 제거 섹션과 명령줄 내용 삭제가 판단 기간에 겹침 → 판정 때 참고 | 2026-10-15 | impressions | 2026-11-12 | - | - |
| V3  | 4      | `turn-off-ai-in-chrome` | Chrome 156 재검증 반영: 설명·첫 문단의 현재 버전 155 → 156, 재검증 문단 1개(메뉴·정책 변화 없음), How we checked에 156 비교 추가, 이미지 0 → 4장(그래픽 3 + chrome://policy 캡처, `thumbnail` 지정. 노하우 7과 겹침 → 판정 때 두 변경을 구분할 수 없음을 적음). 반복 일정(Chrome 안정판) 대응의 첫 사례 | 2026-10-21 | position | 2026-11-18 | - | - |
| V4  | 1      | `spotify-family-qr-code-verification` | 제목·설명만 교체 (CTR): 노출 164·클릭 0, 상위 검색어(다른 매체 기사 제목형 3개, 4.8~5.6위)에서 클릭 0 → `seo-audit` Weak click-through. 제목 `Spotify Family QR Code Check and 12-Month Lockout: What It Means for You` → `Spotify Family Plan QR Code Verification Gives Members 7 Days to Scan`(검색어의 `family plan`·`qr code verification`을 앞쪽에, 꼬리표 제거), 설명 교체. 본문·`updatedAt` 그대로 | 2026-10-25 | ctr | 2026-11-22 | - | - |
| V5  | 2      | `image-to-text-offline-free` | `seo-audit` rankings-push: NAPS2 8.5.1 GUI 직접 측정(50장·설정 3가지) 섹션 추가 — 사용 단계, 유형별 정확도 표, Best·노이즈 제거 비교, How we tested, 둘째 문단을 측정 결과로 교체. 이미지 0 → 대표 + 본문 3장(노하우 7과 겹침 → 판정 때 구분 불가로 적음), `updatedAt` 2026-10-25. 마지막 크롤링 10-15라 10-17 명령줄 내용 삭제판도 아직 Google이 못 봄 → 판정은 '10-15판 → 10-25판' 비교. 변경 전 28일 노출 74(100 미만이면 보류). **2026-10-30 06:36 UTC 재크롤링**(URL 검사 lastCrawl, 세션 68) → Google이 10-25판을 본 시점은 배포 5일 뒤. 판정 때 변경 후 기간을 10-30부터로도 함께 계산해 비교 | 2026-10-25 | position | 2026-11-22 | - | - |
| V6  | 7      | `check-if-image-is-ai-generated` | 본문 이미지 0 → 4장(Adobe Inspect·CAI Verify 직접 업로드 캡처 그래픽 3 + 10-11 편집 측정 결과 그래픽 1). 같은 확인으로 2단계·FAQ의 Inspect 문구를 직접 본 문구로 정정(노하우 2와 겹침 → 판정 때 구분 불가로 적음), `updatedAt` 2026-10-29. 10-28 대표 이미지(V 대상 아님) 다음 변경. 마지막 크롤링 10-11이라 10-17·10-28판도 아직 Google이 못 봄 → 판정은 '10-11판 → 10-29판' 비교. 변경 전 28일 노출 42(100 미만이면 보류) | 2026-10-29 | position | 2026-11-26 | - | - |

## 재분석

- 분기마다 `python3 -I apps/ad-blog/experiment/tools/blog_patterns.py --cache /tmp/blog-patterns` 실행. 수치가 크게 달라진 항목만 이 문서를 고침
- 재분석 결과가 우리 데이터로 검증된 노하우와 다르면 우리 데이터를 유지하고, 차이를 이 항목에 적음
- README [가설](README.md#가설) H1~H3의 판정 결과도 관련 노하우에 반영

## 근거

| 출처                                                                                                                                                                                                                                                                                                                                                                                                   | 반영한 내용                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Google [Creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)                                                                                                                                                                                                                                                                                     | 과장 없는 제목, 원본 정보·분석, 선호 분량 없음, 날짜만 바꾸는 갱신은 경고 신호                                                   |
| Google [Write high quality reviews](https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews)                                                                                                                                                                                                                                                                          | 정량 측정, 선택 기준, 대안 비교, 근거 있는 추천                                                                                  |
| Google [Title links](https://developers.google.com/search/docs/appearance/title-link)·[Snippets](https://developers.google.com/search/docs/appearance/snippet)                                                                                                                                                                                                                                         | 제목 재작성 사유, 스니펫은 주로 본문에서 뽑음                                                                                    |
| Google [Discover](https://developers.google.com/search/docs/appearance/google-discover)·[Image SEO](https://developers.google.com/search/docs/appearance/google-images)                                                                                                                                                                                                                                | 가로 1200px 이상 대표 이미지, 글자 위주 이미지와 핵심을 숨기는 제목 금지                                                         |
| Google [Link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)                                                                                                                                                                                                                                                                                              | 설명형 앵커 텍스트, 모든 글이 다른 글에서 링크되게                                                                               |
| Google [Search Central 변경 기록](https://developers.google.com/search/updates)                                                                                                                                                                                                                                                                                                                        | FAQ 리치 결과는 2026-05-07부터 표시 안 됨                                                                                        |
| [Zyppy 제목 재작성 연구](https://zyppy.com/seo/google-title-rewrites/) (2022, title 80,959개)                                                                                                                                                                                                                                                                                                          | 51~60자 재작성 최소, 60자 초과 76% 이상 재작성, 대괄호 77.6% 재작성                                                              |
| [Backlinko CTR 연구](https://backlinko.com/google-ctr-stats)                                                                                                                                                                                                                                                                                                                                           | 40~60자 제목 CTR 최고, URL과 검색어 일치 시 CTR 45% 높음, 2페이지 이하 클릭 0.63%                                                |
| Google [AI features](https://developers.google.com/search/docs/appearance/ai-features)                                                                                                                                                                                                                                                                                                                 | AI Overviews용 별도 최적화는 필요 없음, 중요한 내용은 텍스트로, 내부 링크                                                        |
| 구성 사례: Zapier [추천 글](https://zapier.com/blog/best-transcription-apps/)·[앱 선정 방식](https://zapier.com/blog/selecting-apps/), How-To Geek [Disable Recall](https://www.howtogeek.com/how-to-disable-recall/), Tom's Guide [iPhone SOS fix](https://www.tomsguide.com/phones/iphones/my-iphone-kept-getting-stuck-in-sos-mode-heres-how-i-finally-fixed-it), [RTINGS](https://www.rtings.com/) | 첫 문장에 테스트 규모와 요약 표, 방법별 소제목과 쉬운 방법 먼저, 지워지는 설정 경고, 같은 조건(test bench) 측정과 방법 변경 표시 |
| [Chromium Dash](https://chromiumdash.appspot.com/schedule)·[Microsoft Learn](https://learn.microsoft.com/en-us/windows/deployment/update/release-cycle)                                                                                                                                                                                                                                                | Chrome·Windows 반복 일정                                                                                                         |
| searchfit-seo 플러그인 스킬 (`content-strategy`·`keyword-clustering`·`internal-linking`·`technical-seo`·`ai-visibility`·`content-brief`) + 우리 Search Console (2026-09-24 ~ 10-22) | 노하우 8·9, 클러스터 맵·우선순위 매트릭스, 브리프 형식, AI 답변 인용 규칙, 개선 세션·주간 SEO 점검 (2026-10-22) |
