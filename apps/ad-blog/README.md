# ad-blog

광고 수익형 블로그용 Next.js 앱 (`@jinho-blog/ad-blog`). 주제·도메인은 미정이며, 블로그 기능과 검색 노출(SEO)에 필요한 구성을 미리 갖춘 템플릿입니다.

- `output: 'export'` 완전 정적 사이트: 빌드 결과(`out/`)를 정적 호스팅에 그대로 배포 (서버 런타임 없음)
- MDX 콘텐츠: `content/posts`(글), `content/pages`(소개·문의·개인정보처리방침 등)
- 사이트 정보·카테고리는 `src/core/config` 한 곳에서 관리

## URL 구조

| 경로                                      | 내용                                     |
| ----------------------------------------- | ---------------------------------------- |
| `/`, `/page/{n}`                          | 전체 글 목록                             |
| `/posts/{slug}`                           | 글 (`content/posts/{slug}.mdx`)          |
| `/categories/{category}`, `.../page/{n}`  | 카테고리별 글 목록                       |
| `/{slug}`                                 | 정적 페이지 (`content/pages/{slug}.mdx`) |
| `/sitemap.xml`, `/robots.txt`, `/rss.xml` | SEO 파일 (빌드 시 생성)                  |

## 주제·도메인 확정 시 설정

1. **사이트 정보** — `src/core/config/internal/site.ts`: `SITE_NAME`, `SITE_DESCRIPTION`, `SITE_KEYWORDS`, `AUTHOR_NAME`, `AUTHOR_SAME_AS`, `POSTS_PER_PAGE`
2. **카테고리** — `src/core/config/internal/categories.ts`: `CATEGORY_MAP`의 키(slug, URL에 사용)와 이름·설명. 기존 글의 `category`가 정의에 없으면 빌드 실패
3. **도메인** — 빌드 환경변수 `NEXT_PUBLIC_SITE_URL` (예: `https://my-blog.com`)
   - 미설정 시 `https://example.com` 기준으로 빌드되고, 모든 페이지 `noindex` + `robots.txt`가 `Disallow: /` (검색엔진 색인 차단)
   - 설정해야 canonical·OG·sitemap URL이 실제 도메인으로 바뀌고 색인이 허용됨
4. **샘플 콘텐츠 교체**
   - `content/posts/welcome.mdx`, `writing-guide.mdx`는 `draft: true` 샘플(개발 서버에서만 표시) — 참고 후 삭제하고 실제 글 작성
   - `content/pages/about.mdx`, `contact.mdx`, `privacy.mdx`의 `[이메일 주소]`, `[시행일]` 등 placeholder 수정
5. **아이콘** — `src/app/icon.svg` 교체, 매니페스트 색상은 `src/app/manifest.ts`

기본 OG 이미지(`/_static/og-default.jpg`, 1200x630)는 `SITE_NAME`으로 빌드 시 자동 생성되므로 따로 만들 필요가 없습니다.

## 글 작성

`content/posts/{slug}.mdx` 파일을 추가하면 `/posts/{slug}`로 발행됩니다. 파일 이름이 URL이 되므로 영문 소문자·숫자·하이픈을 권장합니다 (한글은 퍼센트 인코딩되어 URL이 길어짐).

```mdx
---
title: 글 제목
description: 검색 결과에 노출될 요약
category: general
createdAt: 2026-01-01
tags:
  - 키워드
---

본문 (마크다운)
```

| 항목          | 필수 | 설명                                                                                 |
| ------------- | :--: | ------------------------------------------------------------------------------------ |
| `title`       |  O   | 제목 (검색 결과 제목)                                                                |
| `description` |  O   | 요약 (검색 결과·링크 미리보기 설명, 120자 내외 권장)                                 |
| `category`    |  O   | `CATEGORY_MAP`에 정의된 카테고리 slug                                                |
| `createdAt`   |  O   | 발행일 (예: `2026-01-01`)                                                            |
| `updatedAt`   |      | 수정일 (발행일 이후). 생략 시 발행일과 동일                                          |
| `tags`        |      | 키워드 목록 (메타 keywords·관련 글 계산용, 태그 페이지 없음)                         |
| `thumbnail`   |      | 대표 이미지 (상대 경로 또는 URL). 생략 시 본문 첫 이미지 → 없으면 제목으로 자동 생성 |
| `draft`       |      | `true`면 개발 서버에서만 표시 (빌드·sitemap·RSS 제외)                                |

- 정의되지 않은 항목은 빌드 실패 (오타 방지)
- 본문 소제목은 `##`부터 작성합니다 (글 제목이 페이지의 유일한 `<h1>`, 본문 `#`은 `<h2>`로 렌더링)
- 이미지는 `content/posts/` 기준 상대 경로로 넣습니다: `![설명](./images/photo.webp)` → 빌드 시 `public/_static/`으로 복사
- 링크 미리보기용 OG 이미지(JPEG 1200x630)는 로컬 썸네일에서 자동 생성
- 날짜는 frontmatter만 사용합니다 (Git 커밋 날짜 미사용: 얕은 클론으로 빌드하는 호스트에서도 날짜가 바뀌지 않도록). 내용을 크게 수정했다면 `updatedAt`을 갱신하세요 — sitemap `lastmod`와 구조화 데이터 `dateModified`에 반영됩니다

정적 페이지(`content/pages/*.mdx`)는 `title`, `description`, `createdAt`이 필수이고 `updatedAt`을 쓸 수 있습니다.

## 명령어

```bash
pnpm --filter @jinho-blog/ad-blog dev       # 개발 서버 (http://localhost:3402)
pnpm --filter @jinho-blog/ad-blog build     # 정적 빌드 → out/
pnpm --filter @jinho-blog/ad-blog test      # Vitest
pnpm --filter @jinho-blog/ad-blog lint      # Prettier + ESLint 자동 수정 + 타입 검사
pnpm --filter @jinho-blog/ad-blog registry  # 레지스트리·썸네일·OG 이미지만 생성
```

`dev`·`build`는 먼저 `registry`를 실행합니다. 생성물(`.content/registry.json`, `public/_static/`, `out/`)은 Git에 커밋하지 않습니다.

## 배포

`build` 결과인 `apps/ad-blog/out/` 디렉터리를 정적 호스팅에 올리면 됩니다. 서버 기능을 쓰지 않으므로 호스팅 업체에 종속되지 않습니다.

**Cloudflare Pages 예시** (저장소 루트 기준)

| 설정          | 값                                                                        |
| ------------- | ------------------------------------------------------------------------- |
| 빌드 명령     | `pnpm --filter @jinho-blog/ad-blog build`                                 |
| 출력 디렉터리 | `apps/ad-blog/out`                                                        |
| 환경변수      | `NEXT_PUBLIC_SITE_URL=https://도메인`, 필요 시 `NODE_VERSION` (20.9 이상) |

- 글 페이지는 `out/posts/{slug}.html`로 생성됩니다. Cloudflare Pages·Netlify는 `/posts/{slug}` 요청을 자동으로 `.html`에 연결하지만, Nginx 등은 `try_files $uri $uri.html $uri/ =404;` 설정이 필요합니다.
- `out/404.html`은 대부분의 정적 호스트가 404 페이지로 사용합니다.
- `public/_headers`(Cloudflare Pages·Netlify 형식)로 해시가 붙은 `/_next/static/*` 파일을 1년간 캐시합니다. 다른 호스트는 같은 캐시 헤더를 호스트 설정에 추가합니다.
- Vercel Hobby 플랜은 상업적 이용(광고 수익 포함)이 금지되어 있으므로 Pro 플랜이나 다른 호스트를 사용합니다.

## SEO 구성

- 페이지 메타: canonical, Open Graph, Twitter 카드, robots (`src/core/seo`)
- JSON-LD: `WebSite`, `BlogPosting`, `BreadcrumbList`
- `sitemap.xml`: 홈·글·카테고리·정적 페이지, `lastmod`는 콘텐츠 수정일 기준 (빌드 시각 아님)
- `robots.txt`: 도메인 설정 시 전체 허용 + sitemap, 미설정 시 전체 차단
- `rss.xml`: 최신 글 20개 (RSS 2.0)
- `manifest.webmanifest`, `icon.svg`
- OG 이미지: 글별 1200x630 JPEG 자동 생성, 기본 이미지는 `SITE_NAME`으로 생성
- 도메인 미설정 상태에서는 전 페이지 `noindex`

## 공개 전 체크리스트

- [ ] `NEXT_PUBLIC_SITE_URL` 설정 후 배포, `/robots.txt`에 `Allow: /`와 `Sitemap:`이 보이는지 확인
- [ ] 페이지 소스의 canonical이 실제 도메인이고 `noindex`가 없는지 확인
- [ ] 사이트 정보·카테고리·아이콘 교체, 샘플 글 삭제, 정적 페이지 placeholder 수정
- [ ] [Google Search Console](https://search.google.com/search-console)에 도메인 등록 후 `https://도메인/sitemap.xml` 제출
- [ ] (한국어 검색) [네이버 서치어드바이저](https://searchadvisor.naver.com)에 사이트 등록, sitemap·RSS 제출
- [ ] 광고 신청 전 개인정보처리방침(`content/pages/privacy.mdx`)에 실제 연락처·시행일·쿠키 사용 안내 작성 (소개·문의 페이지도 함께)
- [ ] 광고 연동은 포함되어 있지 않음: 광고 스크립트는 별도 추가, `ads.txt`는 `public/ads.txt`에 두면 루트에 배포됨
