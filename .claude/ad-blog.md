# apps/ad-blog

광고 수익형 블로그 **ToolProof** — 영어권(미국) 일반 사용자 대상 IT·AI 도구 가이드. 블로그 기능 + SEO 중심. 사용자 문서 → [apps/ad-blog/README.md](apps/ad-blog/README.md)

- 운영 실험(Claude가 주제 조사·작성·배포·분석) 문서 → [apps/ad-blog/experiment/](apps/ad-blog/experiment/README.md): 전략·세션 워크플로우(README), 글쓰기 가이드, 트래픽 노하우(`traffic-playbook.md`, 대형 블로그 분석 → 재분석 도구 `tools/blog_patterns.py`), 주제 클러스터 맵(`clusters.md`, 점검 도구 `tools/link_audit.py`, Google이 크롤링한 판의 링크 확인 `tools/link_seen.py`), 글 간 반복 문장 점검(`tools/dup_check.py`), 날짜가 지나 낡은 미래형·상대 시점 문장 점검(`tools/stale_check.py`), 본문 외부 링크(1차 출처)가 살아 있는지 점검(`tools/extlink_check.py`), 외부 링크 후보·초안(`outreach.md`, 게시는 사용자만), 주제 백로그, 운영 로그, 글별 검증 자료(`tests/{slug}/`)
- 개선 세션 SEO 스킬(`seo-audit`·`copy-editing`·`link-building`·`ai-seo`, 외부 공개 스킬을 고정 커밋으로 받아 둠) → [.claude/skills/MARKETINGSKILLS.md](.claude/skills/MARKETINGSKILLS.md)
- 글 작성·수정 시 [writing-guide.md](apps/ad-blog/experiment/writing-guide.md) 기준 (영어, 1차 출처 확인, 가상 체험담 금지, 독자는 비개발자: 명령줄·코드·개발 도구 방법 금지, 모든 글: 본문 첫 줄 AI 생성 대표 이미지(`experiment/tools/hero_image.py`, 썸네일 겸용) + 본문 이미지 3장 이상). 채널별 제목·허브 글·반복 일정 등은 [traffic-playbook.md](apps/ad-blog/experiment/traffic-playbook.md)

- Next.js 16 **정적 export** (`output: 'export'`, 결과물 `out/`), 서버 런타임 없음
- FSD 구조·import 규칙·TS 규칙은 web과 동일 → [web.md](.claude/web.md), [monorepo.md](.claude/monorepo.md)
- 개발 서버 포트 3402

## 구조

```
src/
├── app/            # 라우트 (얇게 유지, views 조합) + sitemap·robots·rss.xml·ads.txt·manifest·icon
├── views/          # home, posts(/page/n), post, category, static-page
├── modules/        # header, footer, post-list (인피드 광고 위치 lib 포함)
├── entities/       # post, page (조회 서비스 + 타입)
└── core/
    ├── config/     # 사이트 정보(ToolProof, en-US, AUTHOR_TYPE)·카테고리(ai-tools, software, news — 글 0개 카테고리는 자동 숨김)·광고 ID
    ├── ads/        # AdSlot·AdSenseScript (클라이언트), ads.txt·슬롯 속성 헬퍼
    ├── analytics/  # AnalyticsScript (Cloudflare Web Analytics 비컨·GA4 gtag.js 로더, 클라이언트)·로드 조건·gtag 초기화·동의 기본값 헬퍼
    ├── content/    # 컬렉션 Zod 스키마·설정·레지스트리 리더
    ├── seo/        # buildMetadata, JSON-LD 빌더, JsonLd, absoluteUrl
    ├── mdx/        # renderMdx (본문 # → h2, 로컬 이미지 크기 지정, 링크 처리)
    ├── routes/     # 경로·페이지 번호·제목 헬퍼
    ├── ui/         # Breadcrumbs, Container, LocalDate, Pagination, Prose, Toc 등
    └── utils/      # cn, 날짜, 읽기 시간, withEmptyStaticParam
content/            # posts/*.mdx, pages/*.mdx (about·contact·editorial-policy·privacy)
experiment/         # 운영 실험 문서·검증 자료 (빌드·린트 대상 아님)
scripts/registry.ts # 미디어 복사 → 레지스트리 생성 → 기본 OG 이미지 생성
scripts/indexnow.ts # IndexNow 제출 (로직·테스트는 scripts/lib/indexnow.ts)
```

## 정적 export 규칙

- 동적 라우트: `export const dynamicParams = false` + `generateStaticParams`를 `withEmptyStaticParam(params, keys)`로 감쌈 (빈 배열이면 빌드 실패 → 자리표시 경로를 404로 렌더링)
- 데이터가 없거나 페이지 번호가 잘못되면 `notFound()`
- 라우트 props는 명시 타입 (`{ params: Promise<{ slug: string }> }`) — 전역 `PageProps`는 빌드 후에만 생성되어 `tsc` 실패
- Route Handler·metadata 라우트(sitemap, robots, manifest, rss)는 `export const dynamic = 'force-static'`
- 서버 컴포넌트 기본 (`'use client'`는 `core/ads`·`core/analytics`와 `core/ui`의 `LocalDate`만), 이미지 최적화 미사용 (`images.unoptimized`)

## 콘텐츠 규칙

- 레지스트리는 public 밖 `.content/registry.json` (정적 export에 원문 JSON 노출 방지). `core/content/internal/reader.ts`는 경로를 리터럴로 유지하고 `reader.test.ts`가 설정과 일치 검증
- 날짜는 frontmatter만 사용 (`gitDates: false`): `createdAt` 필수(글·페이지), `updatedAt` 미지정 시 발행일, 수정일 < 발행일이면 빌드 에러
- `createdAt`은 UTC 시각까지 작성 (예: `2026-10-17T21:44:00Z`, 날짜만 쓰면 UTC 자정). 목록·이전/다음 글은 시각까지 비교해 최신순, 화면에는 날짜만 표시 (시각은 표시 안 함)
- 스키마는 strict: 정의되지 않은 frontmatter 키는 빌드 에러
- `draft: true` 글은 개발 서버에서만 노출 (`entities/post`의 `isVisible`)
- `hub: true` 글(클러스터 허브)은 홈 상단 "Start here"에 항상 고정 (`getHubPosts`). clusters.md 허브 칸과 일치해야 함 (`link_audit.py`가 점검)
- 본문 소제목은 `##`부터 (페이지 `<h1>`은 제목, 본문 `#`은 `<h2>`)
- 연락처 이메일은 MDX에 직접 쓰지 않고 `<ContactEmail />` 사용 (값은 `core/config`의 `CONTACT_EMAIL`)
- UI·콘텐츠는 영어 (`SITE_LANGUAGE = 'en-US'`, `<html lang>`도 이 값). 코드 주석·개발자용 에러 메시지·개발 서버 광고 자리표시는 한국어 유지
- 날짜 표시는 `en-US`·**방문자 시간대 기준**: `core/ui`의 `LocalDate`로만 표시 (정적 HTML·hydration은 UTC 날짜, hydration 직후 브라우저 시간대로 다시 렌더링). 날짜만 쓴 값(UTC 자정)은 시간대와 무관하게 그 날짜로 고정 (미국 시간대로 바꾸면 하루 전 날짜가 되므로). 수정일 표시 여부(`isSameDate`)는 UTC 기준
- 읽기 시간은 영어 기준 분당 230단어

## SEO 규칙

- 페이지 메타는 `buildMetadata` 사용 (canonical·OG·Twitter·robots·RSS alternate)
- URL은 `absoluteUrl` 한 곳에서 생성 (홈은 끝 슬래시 없음, 비ASCII 경로 퍼센트 인코딩) — canonical·JSON-LD·sitemap·RSS가 같은 URL을 쓰도록
- `NEXT_PUBLIC_SITE_URL` 미설정 시 `SITE_INDEXABLE = false` → 전 페이지 noindex + robots 전체 차단
- sitemap `lastmod`·RSS `lastBuildDate`는 콘텐츠 날짜 기준 (빌드 시각 금지)
- sitemap은 전체 URL, RSS는 최근 변경: RSS 항목은 `updatedAt` 내림차순 상위 `RSS_ITEM_LIMIT`(20)개, `pubDate`는 `updatedAt`(마지막 의미 있는 수정 시각, sitemap `lastmod`와 같은 값). 크게 고친 옛 글도 sitemap보다 자주 받아 가는 피드에 다시 오르게 함 (Google Search Central "Best practices for XML sitemaps and RSS/Atom feeds", 2026-11-01)
- 페이지당 `<h1>` 1개, 이미지는 크기 지정(CLS 0)
- JSON-LD author·publisher의 `@type`은 `AUTHOR_TYPE`(현재 `Organization`, 이름 = `SITE_NAME`), `url`은 `/about`, `publishingPrinciples`는 `/editorial-policy` (편집 정책 페이지 slug를 바꾸면 `jsonLd.ts`도 함께)
- 글 머리(`PostHeader`) 메타 첫 항목은 작성자 `By {AUTHOR_NAME}` → `/about` (AdSense 신뢰 신호, 2026-11-01)
- 삭제한 글 URL은 같은 주제 글로 `vercel.json` `redirects`(`permanent: true` → 308). 원본 글 파일이 없고 대상 글 파일이 있는지 `scripts/lib/vercel-redirects.test.ts`가 검증. 대체 글이 없으면 같은 클러스터 허브, 허브도 없으면 404 ([clusters.md](apps/ad-blog/experiment/clusters.md#규칙))
- IndexNow(Bing 등): 프로덕션 배포 성공(`deployment_status`, 환경 `Production – ad-blog`) 시 [indexnow.yml](.github/workflows/indexnow.yml)이 직전 성공 배포 이후 추가·수정·삭제된 MDX의 URL만 제출. 배포된 sitemap에 없는 수정 글(초안)은 제외. 수동 실행(workflow_dispatch)은 sitemap 전체 제출
  - 키는 `scripts/lib/indexnow.ts`의 `INDEXNOW_KEY` = `public/{키}.txt` (테스트가 일치 검증), 도메인은 워크플로우의 `NEXT_PUBLIC_SITE_URL`
  - URL 매핑은 mdx-handler 규칙(`content/{컬렉션}/{slug}.mdx` → `{route}/{slug}`)을 따름 — 컬렉션·라우트 구조를 바꾸면 함께 확인

## 광고 규칙

- **AdSense 자동 광고(Auto ads) 사용** (2026-10-22 사용자 결정: 광고 위치를 직접 관리하지 않음). 위치·개수·형식은 AdSense 화면 설정이 정함 → [experiment/README.md](apps/ad-blog/experiment/README.md) 결정사항. 수동 슬롯(`AD_SLOTS`)은 ID를 비워 두어 렌더링 안 함 (다시 쓰려면 사용자 결정)
- 광고 제외 페이지(404·정적 페이지)는 `core/ads`의 `<NoAds />`를 렌더링 → `AdSenseScript`가 그 페이지에서 스크립트를 로드하지 않음 (자동 광고는 스크립트를 로드한 페이지 어디에나 광고를 넣으므로). 광고를 두면 안 되는 새 페이지(오류·내용 없는 페이지)를 만들면 `<NoAds />`를 넣음
- 수동 광고를 쓸 때는 `core/ads`의 `<AdSlot placement="…" />`로만 삽입 (`<ins class="adsbygoogle">` 직접 작성 금지)
- 게시자·광고 단위 ID는 `core/config/internal/ads.ts`(`ADSENSE_CLIENT`, `AD_SLOTS`)에만 작성, 형식 오류는 `validateAdsConfig`가 빌드 에러로 처리
- ID가 비어 있으면 렌더링 안 함 (게시자 ID 없으면 스크립트·확인 메타·슬롯 없음, `ads.txt`는 주석만)
- 수동 슬롯 위치: `postTop`(첫 소제목 앞, 도입부가 있는 글만), `postMiddle`(두 번째 소제목 앞, 소제목 3개 이상인 글만), `postBottom`(이전·다음 글 링크 뒤·관련 글 앞 — 내비게이션 링크와 붙지 않게), `listInFeed`(`PostList`의 `inFeedAd` — 6번째 카드 뒤, 7개 이상일 때만. 홈·`/page/n`·카테고리만 켜고 관련 글은 끔)
- 본문 광고(`postTop`·`postMiddle`)는 `renderMdx(…, { ads: true })`의 `rehypeContentAds`가 삽입하고, 광고 컴포넌트도 이 옵션일 때만 주입 (정적 페이지 MDX에 직접 써도 빌드 에러). 소제목은 최상위 `#`·`##`(렌더링 h2)만 세고 JSX로 쓴 `<h2>`는 세지 않음
- (수동 슬롯) 첫 화면(제목 아래)에는 광고를 두지 않음: 미게재 시 슬롯이 접히며 생기는 CLS와 모바일 광고 밀도 기준 회피 (도입부가 아주 짧으면 `postTop`이 첫 화면 하단에 걸릴 수 있음, 측정 CLS ≈ 0.03). 자동 광고는 위치를 코드로 제어하지 않으므로 이 보장은 없음
- 정적 페이지·404에는 광고 없음 (`<NoAds />`로 스크립트 미로드, 루트 레이아웃 등 공통 영역에 슬롯 금지)
- AdSense 스크립트는 `AdSenseScript`(루트 레이아웃)가 hydration 후 직접 삽입하고 경로가 바뀔 때마다 제외 페이지인지 다시 확인 — `next/script`는 `data-nscript` 속성 때문에 AdSense 콘솔 경고가 나므로 사용 금지. 정적 HTML에 스크립트가 없으므로 AdSense 사이트 확인은 `ads.txt`·메타 태그로
- 개발 서버는 ID와 무관하게 점선 자리표시 상자 (실제 광고 요청 안 함), 슬롯은 최소 높이로 CLS 방지·미게재 시 숨김

## 방문 측정 (Cloudflare Web Analytics + GA4)

- 실제 페이지뷰는 Cloudflare Web Analytics로 측정 (2026-10-25 사용자 결정: Vercel Web Analytics는 유료라 제외). 쿠키 없음, JS를 실행한 방문만 집계. 전체 조회수는 Cloudflare 기준 (GA4는 유럽 동의 거부 방문이 빠짐)
- 체류시간(참여 시간)·90% 스크롤은 Google Analytics 4로 측정 (2026-11-05 사용자 결정: 무료·Data API·AdSense 연결. Clarity·Plausible·Vercel Web Analytics 제외). GTM 없이 측정 ID 직접 (설정이 저장소에 남음)
- Cloudflare 사이트 토큰은 `core/config/internal/analytics.ts`의 `CF_WEB_ANALYTICS_TOKEN`에만 작성 (비어 있으면 로드 안 함, 32자리 16진수가 아니면 빌드 에러)
- GA4 측정 ID는 같은 파일의 `GA_MEASUREMENT_ID`(`G-GMRVKRVMHS`)에만 작성 (비어 있으면 로드 안 함, `G-` 형식이 아니면 빌드 에러 — `validateGaMeasurementId`)
- `AnalyticsScript`(루트 레이아웃)가 hydration 후 비컨·gtag.js를 직접 삽입 (`next/script` 금지, AdSense와 같은 이유). 개발 서버·`SITE_URL` 도메인(www 포함)이 아닌 호스트(미리보기 배포 등)에서는 둘 다 로드 안 함. 클라이언트 라우팅 이동은 비컨·GA4가 직접 집계하므로 한 번만 삽입
- GA4 초기화·스크립트 주소·동의 기본값은 `core/analytics/internal/google.ts`(`initGtag`·`getGtagSrc`·`getConsentDefault`)
- 동의 기본값: EEA·영국·스위스(지역 코드 32개)만 consent mode `ad_storage`·`ad_user_data`·`ad_personalization`·`analytics_storage` 모두 denied + `wait_for_update` 500ms → 동의 전에는 분석 쿠키 없음. 그 밖 지역은 기본값 없음
  - 컨테이너 브라우저로는 확인 불가: 프록시 IP의 위치를 Google이 몰라 gtag.js의 지역 값이 비고, 이때 지역 지정 기본값이 모든 방문에 적용돼 미국 IP여도 `gcs=G100`(거부)·쿠키 없음 (2026-11-05, 가짜 지역 `ZZ`로도 같음). 실제 동작은 배포 후 비유럽 브라우저의 `_ga` 쿠키·GA4 실시간 보고서로 확인
- 루트 레이아웃에서 `AnalyticsScript`를 `AdSenseScript`보다 먼저 렌더링 (동의 기본값이 AdSense·동의 메시지보다 먼저 들어가야 함). AdSense 동의 메시지(개인정보 보호 및 메시지 > 유럽 규정)의 "분석 목적 동의 모드"를 켜면 GA4가 같은 동의를 읽음 (사용자 설정)
- 페이지뷰는 GA4 향상된 측정의 "브라우저 기록 이벤트 기반 페이지 변경"(기본 켜짐)에 맡김. 수동 `page_view` 전송 없음. 90% 스크롤도 향상된 측정 기본값
- 측정 항목을 바꾸면 개인정보처리방침(`content/pages/privacy.mdx`) Analytics 항목도 함께 수정
- GA4 수치는 `experiment/tools/ga_analytics.py`가 Data API로 읽어 `dashboard_data.py`가 `stats` DB(`engagement` 문서, `posts`·`otherPages`의 `engagement`)에 기록. 속성 ID `486901575`는 도구 상수(비밀 아님), 인증은 Search Console 서비스 계정 키 재사용(범위 `analytics.readonly`). 날짜는 속성 시간대(한국). 사이트 도메인(`SITE_HOSTS`)으로 거르므로 도메인을 바꾸면 함께 수정
- 운영 대시보드 글별 첫 관측값(`indexedAt`·`firstCrawlAt`·`firstImpressionAt`·`firstSeenLinkAt`, 2026-11-07부터 발견 경로 `discoveredAt`·`discoveredVia`·`feedSeenAt`·`sitemapSeenAt`·`crawledAt`와 기록 시작 시각 `discoverySince`)은 저장소 `experiment/dashboard/first-seen.json`, `stats` 문서 버전은 `experiment/dashboard/versions.json`에 두고 `dashboard_data.py`가 읽고 씀 (2026-11-04: DB 문서를 파일로 저장하는 것이 거부돼 DB에서 이어받지 않음). 갱신한 세션이 두 파일을 커밋
- 운영 대시보드 글별 `newsType`(가설 H5)·`verifyType`·`verifyTypeSince`(가설 H3)는 `dashboard_data.py`가 `experiment/tests/{slug}/factcheck.md`(10-14 전 글은 `facts.md`)의 '뉴스 유형'·'검증 유형' 줄에서 굵은 값을 읽음 (형식: `experiment/writing-guide.md` 작성 전 브리프·뉴스 칼럼). `keyword`(가설 H6)는 같은 파일의 '주 검색어 (가설 H6)' 줄 백틱 값 + `experiment/dashboard/keyword-trends.json`(`tools/keyword_trends.py`가 측정한 Trends 상대량). 사실 확인표 줄 형식을 바꾸면 `news_type`·`verify_type`·`keyword_trends.KEYWORD_LINE` 정규식도 함께 수정
- 운영 대시보드 `posts`의 글별 `index.sitemaps`·`index.referring`(URL 검사 `sitemap`·`referringUrls`)과 `summary.sitemaps`(사이트맵·피드별 다운로드)는 2026-11-05 회차부터 기록. `summary.sitemap`은 `/sitemap.xml` 고정 (그 전 회차는 API 첫 항목인 `rss.xml` 값). 공용 계산은 `gsc_report.py`의 `index_refs`·`main_sitemap`
- 운영 대시보드 조회수(KPI·날짜별 조회수·유입 사이트·클러스터/글별 표·글 순위)는 `experiment/tools/cf_analytics.py`가 Cloudflare GraphQL API로 읽어 `dashboard_data.py`가 `stats` DB(`traffic` 문서, `posts`의 `views`)에 기록. 사이트 도메인으로 거르므로(`SITE_HOSTS`, 사이트 목록 REST API는 Account Analytics Read 토큰으로 403) 도메인을 바꾸면 함께 수정. 필요한 토큰 권한은 Account → Account Analytics → Read

## 명령어

```bash
pnpm --filter @jinho-blog/ad-blog dev       # registry 생성 후 개발 서버
pnpm --filter @jinho-blog/ad-blog build     # registry 생성 후 정적 빌드 → out/
pnpm --filter @jinho-blog/ad-blog test
pnpm --filter @jinho-blog/ad-blog lint
INDEXNOW_MODE=all INDEXNOW_DRY_RUN=true NEXT_PUBLIC_SITE_URL=https://tool-proof.com pnpm --filter @jinho-blog/ad-blog indexnow  # 제출 대상 확인
```
