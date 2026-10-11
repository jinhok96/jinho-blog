# apps/ad-blog

광고 수익형 블로그 (주제·도메인 미정). 블로그 기능 + SEO 중심. 사용자 문서 → [apps/ad-blog/README.md](apps/ad-blog/README.md)

- Next.js 16 **정적 export** (`output: 'export'`, 결과물 `out/`), 서버 런타임 없음
- FSD 구조·import 규칙·TS 규칙은 web과 동일 → [web.md](.claude/web.md), [monorepo.md](.claude/monorepo.md)
- 개발 서버 포트 3402

## 구조

```
src/
├── app/            # 라우트 (얇게 유지, views 조합) + sitemap·robots·rss.xml·manifest·icon
├── views/          # home, posts(/page/n), post, category, static-page
├── modules/        # header, footer, post-list
├── entities/       # post, page (조회 서비스 + 타입)
└── core/
    ├── config/     # 사이트 정보·카테고리 (주제 확정 시 수정하는 곳)
    ├── content/    # 컬렉션 Zod 스키마·설정·레지스트리 리더
    ├── seo/        # buildMetadata, JSON-LD 빌더, JsonLd, absoluteUrl
    ├── mdx/        # renderMdx (본문 # → h2, 로컬 이미지 크기 지정, 링크 처리)
    ├── routes/     # 경로·페이지 번호·제목 헬퍼
    ├── ui/         # Breadcrumbs, Container, Pagination, Prose, Toc 등
    └── utils/      # cn, 날짜, 읽기 시간, withEmptyStaticParam
content/            # posts/*.mdx, pages/*.mdx (about·contact·privacy)
scripts/registry.ts # 미디어 복사 → 레지스트리 생성 → 기본 OG 이미지 생성
```

## 정적 export 규칙

- 동적 라우트: `export const dynamicParams = false` + `generateStaticParams`를 `withEmptyStaticParam(params, keys)`로 감쌈 (빈 배열이면 빌드 실패 → 자리표시 경로를 404로 렌더링)
- 데이터가 없거나 페이지 번호가 잘못되면 `notFound()`
- 라우트 props는 명시 타입 (`{ params: Promise<{ slug: string }> }`) — 전역 `PageProps`는 빌드 후에만 생성되어 `tsc` 실패
- Route Handler·metadata 라우트(sitemap, robots, manifest, rss)는 `export const dynamic = 'force-static'`
- 서버 컴포넌트만 사용 (`'use client'` 없음), 이미지 최적화 미사용 (`images.unoptimized`)

## 콘텐츠 규칙

- 레지스트리는 public 밖 `.content/registry.json` (정적 export에 원문 JSON 노출 방지). `core/content/internal/reader.ts`는 경로를 리터럴로 유지하고 `reader.test.ts`가 설정과 일치 검증
- 날짜는 frontmatter만 사용 (`gitDates: false`): `createdAt` 필수(글·페이지), `updatedAt` 미지정 시 발행일, 수정일 < 발행일이면 빌드 에러
- 스키마는 strict: 정의되지 않은 frontmatter 키는 빌드 에러
- `draft: true` 글은 개발 서버에서만 노출 (`entities/post`의 `isVisible`)
- 본문 소제목은 `##`부터 (페이지 `<h1>`은 제목, 본문 `#`은 `<h2>`)

## SEO 규칙

- 페이지 메타는 `buildMetadata` 사용 (canonical·OG·Twitter·robots·RSS alternate)
- URL은 `absoluteUrl` 한 곳에서 생성 (홈은 끝 슬래시 없음, 비ASCII 경로 퍼센트 인코딩) — canonical·JSON-LD·sitemap·RSS가 같은 URL을 쓰도록
- `NEXT_PUBLIC_SITE_URL` 미설정 시 `SITE_INDEXABLE = false` → 전 페이지 noindex + robots 전체 차단
- sitemap `lastmod`·RSS `lastBuildDate`는 콘텐츠 날짜 기준 (빌드 시각 금지)
- 페이지당 `<h1>` 1개, 이미지는 크기 지정(CLS 0)

## 명령어

```bash
pnpm --filter @jinho-blog/ad-blog dev       # registry 생성 후 개발 서버
pnpm --filter @jinho-blog/ad-blog build     # registry 생성 후 정적 빌드 → out/
pnpm --filter @jinho-blog/ad-blog test
pnpm --filter @jinho-blog/ad-blog lint
```
