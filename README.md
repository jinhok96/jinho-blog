# jinho-blog

[![CI][badge-ci]][ci-workflow] [![Vercel][badge-deploy]][vercel-deploy]

## Coverage

| Package       | Coverage                                                                    |
| ------------- | --------------------------------------------------------------------------- |
| web           | [![web coverage][badge-cov-web]][codecov-web]                               |
| nextjs-routes | [![nextjs-routes coverage][badge-cov-nextjs-routes]][codecov-nextjs-routes] |
| mdx-handler   | [![mdx-handler coverage][badge-cov-mdx-handler]][codecov-mdx-handler]       |

## 소개

개인 블로그 및 포트폴리오 사이트. 기술 글쓰기, 개인 프로젝트 소개, 사용하는 라이브러리 정리를 한 곳에서 관리합니다.

Next.js 기반 Turborepo 모노레포로 구성했으며, 콘텐츠는 모두 MDX 파일로 작성합니다. FSD 아키텍처를 적용해 기능별 관심사를 레이어로 분리했고, 타입 안전 라우팅을 위한 내부 도구를 직접 제작했습니다.

## 기술 스택

| 분류       | 기술                                                                           |
| ---------- | ------------------------------------------------------------------------------ |
| 환경       | ![Node.js][badge-nodejs] ![pnpm][badge-pnpm] ![Turborepo][badge-turborepo]     |
| 프레임워크 | ![Next.js][badge-nextjs] ![React][badge-react] ![TypeScript][badge-typescript] |
| UI         | ![Tailwind CSS][badge-tailwind] ![Zustand][badge-zustand]                      |
| 테스트     | ![Vitest][badge-vitest] ![Codecov][badge-codecov]                              |
| 배포       | ![Vercel][badge-vercel]                                                        |

## 프로젝트 구조

```
jinho-blog/
├── apps/
│   └── web/          # Next.js 블로그 앱
├── packages/
│   ├── shared/       # 공유 타입 및 상수
│   ├── mdx-handler/  # MDX 콘텐츠 처리
│   └── nextjs-routes/# 타입 안전 라우팅 생성기
└── content/
    └── mdx/          # MDX 콘텐츠 파일
```

패키지 의존 방향은 `shared → mdx-handler → web`으로 단방향을 유지하며, Turborepo가 빌드 순서를 자동으로 관리합니다.

## web

블로그 메인 애플리케이션으로, 홈페이지와 세 가지 콘텐츠 도메인으로 구성됩니다.

- **홈** - 포트폴리오
- **블로그** — 기술 블로그
- **프로젝트** — 참여한 프로젝트 소개
- **라이브러리** — 재사용 가능한 코드 보관

OG 이미지 동적 생성과 RSS 피드, 사이트맵을 자동으로 제공합니다.

### 아키텍처

[FSD(Feature-Sliced Design)][fsd]를 기반으로 한 단방향 의존성 레이어 구조입니다. Next.js 앱 라우터와 함께 IDE에서 의존성을 직관적으로 확인할 수 있도록 알파벳 순서로 레이어를 구성했습니다.

```
App (Pages)
  ↓
Views (Pages)
  ↓
Modules (Widgets)
  ↓
Features
  ↓
Entities
  ↓
Core (App, Shared)
```

| 레이어   | 역할                                              |
| -------- | ------------------------------------------------- |
| App      | Next.js App Router (라우트, 레이아웃, API 핸들러) |
| Views    | 페이지 단위 조립 모듈                             |
| Modules  | 재사용 가능한 복합 UI 블록                        |
| Features | 재사용 가능한 독립적인 인터랙션 단위 UI           |
| Entities | 도메인 서비스 로직                                |
| Core     | 전역 상태, UI 컴포넌트, 유틸, 훅, 설정            |

## packages

### shared

모노레포 전체에서 사용하는 타입과 상수의 단일 진실 공급원입니다.

- 별도 빌드 없이 TypeScript 소스를 직접 참조
- 블로그·프로젝트·라이브러리 메타데이터 타입 제공
- 카테고리, 정렬 옵션, 에러 타입 등 공통 타입 관리

### mdx-handler

MDX 기반 콘텐츠를 읽고 가공하는 패키지입니다.

- frontmatter 파싱으로 메타데이터 추출
- 카테고리 필터링, 정렬, 페이지네이션 지원
- `dev`나 `build` 실행 시 첨부 이미지로부터 썸네일 자동 생성

### nextjs-routes

npm에 배포된 [nextjs-routes][nextjs-routes-repo] 패키지를 포크해 수정한 타입 안전 라우팅 도구입니다.

- App Router 디렉토리 구조를 분석해 TypeScript 라우트 타입 자동 생성
- 경로 파라미터와 쿼리 파라미터를 타입으로 관리해 런타임 오류 방지
- `next.config.ts`에 등록하면 빌드 시 자동으로 타입 갱신

## CI/CD

- **CI** — `main`, `dev` 브랜치 push 및 `main` 브랜치 PR 시 GitHub Actions가 전체 테스트를 실행하고, 패키지별 커버리지를 Codecov에 업로드합니다.
- **CD** — `main` 브랜치에 병합되면 Vercel이 자동으로 프로덕션 배포를 수행합니다.

## 콘텐츠 작성

`content/mdx/` 아래 `blog/`, `projects/`, `libraries/` 폴더에 MDX 파일을 추가하는 것만으로 콘텐츠를 게시할 수 있습니다. 각 파일 상단의 frontmatter에 제목, 설명, 카테고리, 날짜를 작성하면 목록 페이지와 상세 페이지가 자동으로 구성됩니다.

<!-- Links -->

[fsd]: https://feature-sliced.design
[nextjs-routes-repo]: https://github.com/tatethurston/nextjs-routes
[ci-workflow]: https://github.com/jinhok96/jinho-blog/actions/workflows/ci.yml
[vercel-deploy]: https://github.com/jinhok96/jinho-blog/deployments/Production

<!-- Coverage badges -->

[badge-cov-web]: https://codecov.io/gh/jinhok96/jinho-blog/graph/badge.svg?flag=web
[badge-cov-nextjs-routes]: https://codecov.io/gh/jinhok96/jinho-blog/graph/badge.svg?flag=nextjs-routes
[badge-cov-mdx-handler]: https://codecov.io/gh/jinhok96/jinho-blog/graph/badge.svg?flag=mdx-handler
[codecov-web]: https://app.codecov.io/gh/jinhok96/jinho-blog/tree/main?flags%5B0%5D=web
[codecov-nextjs-routes]: https://app.codecov.io/gh/jinhok96/jinho-blog/tree/main?flags%5B0%5D=nextjs-routes
[codecov-mdx-handler]: https://app.codecov.io/gh/jinhok96/jinho-blog/tree/main?flags%5B0%5D=mdx-handler

<!-- CI/CD badges -->

[badge-ci]: https://github.com/jinhok96/jinho-blog/actions/workflows/ci.yml/badge.svg
[badge-deploy]: https://img.shields.io/github/deployments/jinhok96/jinho-blog/Production?label=vercel&logo=vercel&logoColor=white&color=000000

<!-- Tech stack badges -->

[badge-nodejs]: https://img.shields.io/badge/Node.js_24-339933?style=flat&logo=nodedotjs&logoColor=white
[badge-pnpm]: https://img.shields.io/badge/pnpm_10-F69220?style=flat&logo=pnpm&logoColor=white
[badge-nextjs]: https://img.shields.io/badge/Next.js_16-000000?style=flat&logo=nextdotjs&logoColor=white
[badge-react]: https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black
[badge-typescript]: https://img.shields.io/badge/TypeScript_5-3178C6?style=flat&logo=typescript&logoColor=white
[badge-tailwind]: https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat&logo=tailwindcss&logoColor=white
[badge-zustand]: https://img.shields.io/badge/Zustand_5-443E38?style=flat&logo=zustand&logoColor=white
[badge-turborepo]: https://img.shields.io/badge/Turborepo-EF4444?style=flat&logo=turborepo&logoColor=white
[badge-vitest]: https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white
[badge-codecov]: https://img.shields.io/badge/Codecov-F01F7A?style=flat&logo=codecov&logoColor=white
[badge-vercel]: https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white
