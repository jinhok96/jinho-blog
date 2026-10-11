# ad-blog

광고 수익형 블로그 **ToolProof**(영어권 대상 IT·AI 도구 가이드)의 Next.js 앱 (`@jinho-blog/ad-blog`). 블로그 기능과 검색 노출(SEO)에 필요한 구성을 갖추고 있으며, 운영 실험의 전략·기록·글쓰기 기준은 [experiment/](experiment/README.md)에 있습니다.

- `output: 'export'` 완전 정적 사이트: 빌드 결과(`out/`)를 정적 호스팅에 그대로 배포 (서버 런타임 없음)
- MDX 콘텐츠: `content/posts`(글), `content/pages`(소개·문의·개인정보처리방침 등)
- 사이트 정보·카테고리·광고 ID는 `src/core/config` 한 곳에서 관리

## URL 구조

| 경로                                      | 내용                                     |
| ----------------------------------------- | ---------------------------------------- |
| `/`, `/page/{n}`                          | 전체 글 목록                             |
| `/posts/{slug}`                           | 글 (`content/posts/{slug}.mdx`)          |
| `/categories/{category}`, `.../page/{n}`  | 카테고리별 글 목록                       |
| `/{slug}`                                 | 정적 페이지 (`content/pages/{slug}.mdx`) |
| `/sitemap.xml`, `/robots.txt`, `/rss.xml` | SEO 파일 (빌드 시 생성)                  |
| `/ads.txt`                                | 광고 판매자 목록 (빌드 시 생성)          |

## 사이트 설정

1. **사이트 정보** — `src/core/config/internal/site.ts`: `SITE_NAME`, `SITE_DESCRIPTION`, `SITE_KEYWORDS`, `AUTHOR_NAME`, `AUTHOR_SAME_AS`, `POSTS_PER_PAGE`
2. **카테고리** — `src/core/config/internal/categories.ts`: `CATEGORY_MAP`의 키(slug, URL에 사용)와 이름·설명. 기존 글의 `category`가 정의에 없으면 빌드 실패
3. **도메인** — 빌드 환경변수 `NEXT_PUBLIC_SITE_URL` (예: `https://my-blog.com`)
   - 미설정 시 `https://example.com` 기준으로 빌드되고, 모든 페이지 `noindex` + `robots.txt`가 `Disallow: /` (검색엔진 색인 차단)
   - 설정해야 canonical·OG·sitemap URL이 실제 도메인으로 바뀌고 색인이 허용됨
4. **정적 페이지** — `content/pages/about.mdx`, `contact.mdx`, `privacy.mdx` (연락처·광고·개인정보 안내)
5. **아이콘** — `src/app/icon.svg` 교체, 매니페스트 색상은 `src/app/manifest.ts`

기본 OG 이미지(`/_static/og-default.jpg`, 1200x630)는 `SITE_NAME`으로 빌드 시 자동 생성되므로 따로 만들 필요가 없습니다.

## 글 작성

`content/posts/{slug}.mdx` 파일을 추가하면 `/posts/{slug}`로 발행됩니다. 파일 이름이 URL이 되므로 영문 소문자·숫자·하이픈을 권장합니다 (한글은 퍼센트 인코딩되어 URL이 길어짐).

```mdx
---
title: How to Turn Off ChatGPT Memory
description: Step-by-step instructions to pause or turn off ChatGPT memory on web and mobile.
category: ai-tools
createdAt: 2026-01-01
tags:
  - ChatGPT
---

Body (Markdown)
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
| `draft`       |      | `true`면 개발 서버에서만 표시 (빌드·sitemap·RSS 제외, 아래 주의 참고)                |

- 정의되지 않은 항목은 빌드 실패 (오타 방지)
- 초안의 페이지는 빌드되지 않지만, 초안 폴더의 이미지와 자동 생성 썸네일·OG 이미지는 `out/`에 포함됩니다 (링크는 없음). 공개 전 이미지는 커밋하지 않는 것을 권장
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

## 광고 (AdSense)

AdSense 수동 광고 단위 4곳이 연결되어 있습니다. 설정은 `src/core/config/internal/ads.ts` 한 곳입니다.

| 위치 (`AD_SLOTS` 키) | 자리                                                                        |
| -------------------- | --------------------------------------------------------------------------- |
| `postTop`            | 글 제목 아래                                                                |
| `postMiddle`         | 본문 두 번째 `##` 소제목 앞 (`##`이 3개 이상인 글만)                        |
| `postBottom`         | 본문 끝, 이전·다음 글 링크 앞                                               |
| `listInFeed`         | 글 목록(홈·`/page/{n}`·카테고리)의 6번째 카드 뒤 (글이 7개 이상인 페이지만) |

- 정적 페이지(소개·문의·개인정보처리방침)·404, 글 아래 관련 글 목록에는 광고가 없습니다
- 광고 스크립트는 페이지 로드(hydration) 후 삽입되어 본문 표시를 늦추지 않습니다
- 게시자 ID를 넣으면 `/ads.txt`와 사이트 확인용 `<meta name="google-adsense-account">`가 자동 생성됩니다
- ID가 비어 있으면 광고를 만들지 않습니다: 게시자 ID가 없으면 스크립트·메타 태그·슬롯 모두 없음(`ads.txt`는 주석만), 광고 단위 ID가 없는 슬롯은 렌더링 안 함
- 개발 서버는 ID와 무관하게 점선 자리표시 상자만 보여 주고 실제 광고는 요청하지 않습니다 (본인 광고 노출·클릭 방지)
- 슬롯마다 최소 높이(280px)를 미리 확보해 광고가 늦게 채워져도 본문이 밀리지 않고(CLS 방지), 미게재(unfilled) 응답이면 슬롯을 숨깁니다

### 설정

1. **신청** — AdSense 계정의 게시자 ID(`ca-pub-` + 숫자 16자리, 계정 > 계정 정보)를 `ADSENSE_CLIENT`에 넣고 배포한 뒤, AdSense에 사이트를 추가합니다. 소유권 확인은 자동 생성된 메타 태그나 `ads.txt`를 선택하면 됩니다
2. **광고 단위 생성 (승인 후)** — AdSense > 광고 > 광고 단위별에서 만듭니다
   - `postTop`·`postBottom`·`listInFeed`: 디스플레이 광고 (`layout: 'display'`)
   - `postMiddle`: 콘텐츠 내 자동 삽입 광고 (`layout: 'in-article'`)
   - `listInFeed`를 인피드 광고로 바꾸려면 `layout: 'in-feed'`와 광고 코드의 `data-ad-layout-key` 값을 `layoutKey`에 함께 입력
3. **광고 단위 ID 입력** — 각 광고 코드의 `data-ad-slot` 값을 `AD_SLOTS.{위치}.slotId`에 넣고 배포합니다
4. **자동 광고는 끈 채로 둡니다** — 스크립트가 모든 페이지에 로드되므로, 켜면 정적 페이지·404 등 슬롯 밖에도 광고가 삽입됩니다

게시자 ID 형식, 숫자가 아닌 광고 단위 ID, `layoutKey` 없는 인피드 광고는 빌드 에러로 알려 줍니다 (오타로 광고가 조용히 빠지지 않도록).

### EEA·영국 방문자 동의

유럽 경제 지역(EEA)·영국·스위스 방문자에게 광고를 게재하려면 Google 인증 동의 관리 플랫폼(CMP)이 필요합니다. AdSense > **개인정보 보호 및 메시지**에서 유럽 규정 메시지를 만들어 게시하면 AdSense 스크립트가 동의 메시지를 띄웁니다 (코드 수정 불필요).

### 정책 주의

- 본인 광고를 클릭하지 않습니다 (무효 트래픽으로 계정 정지 사유). 배포 사이트에서 광고를 확인할 때도 클릭 금지
- 오류 페이지·내용이 없는 페이지에는 광고를 넣지 않습니다 (404에는 슬롯 없음 — 루트 레이아웃 등 공통 영역에 슬롯을 두지 않음)
- 광고가 콘텐츠보다 많아 보이지 않게 합니다: 짧은 글은 본문 중간 광고가 자동 생략되며, 슬롯을 추가할 때도 콘텐츠 대비 비율을 고려

## 공개 전 체크리스트

- [ ] `NEXT_PUBLIC_SITE_URL` 설정 후 배포, `/robots.txt`에 `Allow: /`와 `Sitemap:`이 보이는지 확인
- [ ] 페이지 소스의 canonical이 실제 도메인이고 `noindex`가 없는지 확인
- [ ] 사이트 정보·카테고리·아이콘 교체, 샘플 글 삭제, 정적 페이지 placeholder 수정
- [ ] [Google Search Console](https://search.google.com/search-console)에 도메인 등록 후 `https://도메인/sitemap.xml` 제출
- [ ] (한국어 검색) [네이버 서치어드바이저](https://searchadvisor.naver.com)에 사이트 등록, sitemap·RSS 제출
- [ ] 광고 신청 전 개인정보처리방침(`content/pages/privacy.mdx`)의 연락처·시행일 placeholder 수정, 쿠키·광고 안내 확인 (소개·문의 페이지도 함께)
- [ ] AdSense 신청: `ADSENSE_CLIENT` 입력 후 배포, `/ads.txt`와 페이지 소스의 `google-adsense-account` 메타 태그 확인
- [ ] 승인 후 광고 단위 ID를 `AD_SLOTS`에 입력하고 자동 광고는 끈 채로 유지, EEA·영국 동의 메시지 게시 ([광고](#광고-adsense) 참고)
