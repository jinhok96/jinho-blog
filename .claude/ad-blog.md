# apps/ad-blog

광고 수익형 블로그 **ToolProof** — 영어권(미국) 일반 사용자 대상 IT·AI 도구 가이드. 블로그 기능 + SEO 중심. 사용자 문서 → [apps/ad-blog/README.md](apps/ad-blog/README.md)

- 운영 실험(Claude가 주제 조사·작성·배포·분석) 문서 → [apps/ad-blog/experiment/](apps/ad-blog/experiment/README.md): 전략·세션 워크플로우(README), 글쓰기 가이드, 주제 백로그, 운영 로그, 글별 검증 자료(`tests/{slug}/`)
- 글 작성·수정 시 [writing-guide.md](apps/ad-blog/experiment/writing-guide.md) 기준 (영어, 1차 출처 확인, 가상 체험담 금지)

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
    ├── config/     # 사이트 정보(ToolProof, en-US, AUTHOR_TYPE)·카테고리(ai-tools, software)·광고 ID
    ├── ads/        # AdSlot·AdSenseScript (클라이언트), ads.txt·슬롯 속성 헬퍼
    ├── content/    # 컬렉션 Zod 스키마·설정·레지스트리 리더
    ├── seo/        # buildMetadata, JSON-LD 빌더, JsonLd, absoluteUrl
    ├── mdx/        # renderMdx (본문 # → h2, 로컬 이미지 크기 지정, 링크 처리)
    ├── routes/     # 경로·페이지 번호·제목 헬퍼
    ├── ui/         # Breadcrumbs, Container, Pagination, Prose, Toc 등
    └── utils/      # cn, 날짜, 읽기 시간, withEmptyStaticParam
content/            # posts/*.mdx, pages/*.mdx (about·contact·privacy)
experiment/         # 운영 실험 문서·검증 자료 (빌드·린트 대상 아님)
scripts/registry.ts # 미디어 복사 → 레지스트리 생성 → 기본 OG 이미지 생성
```

## 정적 export 규칙

- 동적 라우트: `export const dynamicParams = false` + `generateStaticParams`를 `withEmptyStaticParam(params, keys)`로 감쌈 (빈 배열이면 빌드 실패 → 자리표시 경로를 404로 렌더링)
- 데이터가 없거나 페이지 번호가 잘못되면 `notFound()`
- 라우트 props는 명시 타입 (`{ params: Promise<{ slug: string }> }`) — 전역 `PageProps`는 빌드 후에만 생성되어 `tsc` 실패
- Route Handler·metadata 라우트(sitemap, robots, manifest, rss)는 `export const dynamic = 'force-static'`
- 서버 컴포넌트 기본 (`'use client'`는 `core/ads`만), 이미지 최적화 미사용 (`images.unoptimized`)

## 콘텐츠 규칙

- 레지스트리는 public 밖 `.content/registry.json` (정적 export에 원문 JSON 노출 방지). `core/content/internal/reader.ts`는 경로를 리터럴로 유지하고 `reader.test.ts`가 설정과 일치 검증
- 날짜는 frontmatter만 사용 (`gitDates: false`): `createdAt` 필수(글·페이지), `updatedAt` 미지정 시 발행일, 수정일 < 발행일이면 빌드 에러
- 스키마는 strict: 정의되지 않은 frontmatter 키는 빌드 에러
- `draft: true` 글은 개발 서버에서만 노출 (`entities/post`의 `isVisible`)
- 본문 소제목은 `##`부터 (페이지 `<h1>`은 제목, 본문 `#`은 `<h2>`)
- 연락처 이메일은 MDX에 직접 쓰지 않고 `<ContactEmail />` 사용 (값은 `core/config`의 `CONTACT_EMAIL`)
- UI·콘텐츠는 영어 (`SITE_LANGUAGE = 'en-US'`, `<html lang>`도 이 값). 코드 주석·개발자용 에러 메시지·개발 서버 광고 자리표시는 한국어 유지
- 날짜 표시는 `en-US`·**UTC 기준** (frontmatter 날짜가 UTC 자정으로 저장되므로, 미국 시간대로 표시하면 하루 전 날짜가 됨)
- 읽기 시간은 영어 기준 분당 230단어

## SEO 규칙

- 페이지 메타는 `buildMetadata` 사용 (canonical·OG·Twitter·robots·RSS alternate)
- URL은 `absoluteUrl` 한 곳에서 생성 (홈은 끝 슬래시 없음, 비ASCII 경로 퍼센트 인코딩) — canonical·JSON-LD·sitemap·RSS가 같은 URL을 쓰도록
- `NEXT_PUBLIC_SITE_URL` 미설정 시 `SITE_INDEXABLE = false` → 전 페이지 noindex + robots 전체 차단
- sitemap `lastmod`·RSS `lastBuildDate`는 콘텐츠 날짜 기준 (빌드 시각 금지)
- 페이지당 `<h1>` 1개, 이미지는 크기 지정(CLS 0)
- JSON-LD author·publisher의 `@type`은 `AUTHOR_TYPE`(현재 `Organization`, 이름 = `SITE_NAME`)

## 광고 규칙

- 광고는 `core/ads`의 `<AdSlot placement="…" />`로만 삽입 (`<ins class="adsbygoogle">` 직접 작성 금지)
- 게시자·광고 단위 ID는 `core/config/internal/ads.ts`(`ADSENSE_CLIENT`, `AD_SLOTS`)에만 작성, 형식 오류는 `validateAdsConfig`가 빌드 에러로 처리
- ID가 비어 있으면 렌더링 안 함 (게시자 ID 없으면 스크립트·확인 메타·슬롯 없음, `ads.txt`는 주석만)
- 위치: `postTop`(첫 소제목 앞, 도입부가 있는 글만), `postMiddle`(두 번째 소제목 앞, 소제목 3개 이상인 글만), `postBottom`(이전·다음 글 링크 뒤·관련 글 앞 — 내비게이션 링크와 붙지 않게), `listInFeed`(`PostList`의 `inFeedAd` — 6번째 카드 뒤, 7개 이상일 때만. 홈·`/page/n`·카테고리만 켜고 관련 글은 끔)
- 본문 광고(`postTop`·`postMiddle`)는 `renderMdx(…, { ads: true })`의 `rehypeContentAds`가 삽입하고, 광고 컴포넌트도 이 옵션일 때만 주입 (정적 페이지 MDX에 직접 써도 빌드 에러). 소제목은 최상위 `#`·`##`(렌더링 h2)만 세고 JSX로 쓴 `<h2>`는 세지 않음
- 첫 화면(제목 아래)에는 광고를 두지 않음: 미게재 시 슬롯이 접히며 생기는 CLS와 모바일 광고 밀도 기준 회피 (도입부가 아주 짧으면 `postTop`이 첫 화면 하단에 걸릴 수 있음, 측정 CLS ≈ 0.03)
- 정적 페이지·404에는 광고 없음 (루트 레이아웃 등 공통 영역에 슬롯 금지)
- AdSense 스크립트는 `AdSenseScript`가 hydration 후 직접 삽입 — `next/script`는 `data-nscript` 속성 때문에 AdSense 콘솔 경고가 나므로 사용 금지
- 개발 서버는 ID와 무관하게 점선 자리표시 상자 (실제 광고 요청 안 함), 슬롯은 최소 높이로 CLS 방지·미게재 시 숨김

## 명령어

```bash
pnpm --filter @jinho-blog/ad-blog dev       # registry 생성 후 개발 서버
pnpm --filter @jinho-blog/ad-blog build     # registry 생성 후 정적 빌드 → out/
pnpm --filter @jinho-blog/ad-blog test
pnpm --filter @jinho-blog/ad-blog lint
```
