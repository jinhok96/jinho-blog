# packages/mdx-handler

MDX 파싱, 필터링, 정렬. `gray-matter`로 frontmatter 파싱.

## Public API

[packages/mdx-handler/src/index.ts](packages/mdx-handler/src/index.ts)

### 서비스 함수

```typescript
import {
  // Blog
  getBlogPosts,   // (options?: GetBlogPostsOptions) => BlogMetadata[]
  getBlogPost,    // (slug: string) => BlogMetadata
  getBlogContent, // (slug: string) => MdxInfo
  // Library
  getLibraries,               // (options?) => LibraryMetadata[]
  getLibrary,                 // (slug: string) => LibraryMetadata
  getLibraryContent,          // (slug: string) => MdxInfo
  getLibraryGroupsByCategory, // (options?) => Record<LibraryCategory, LibraryMetadata[]>
  // Project
  getProjects,       // (options?) => ProjectMetadata[]
  getProject,        // (slug: string) => ProjectMetadata
  getProjectContent, // (slug: string) => MdxInfo
} from '@jinho-blog/mdx-handler';
```

### 타입

```typescript
import type { Blog, Library, Project } from '@jinho-blog/mdx-handler';
```

## 내부 구조

```
src/
├── core/
│   ├── config/   # 경로 설정 (MDX 파일 위치)
│   └── utils/    # 파싱 유틸리티
├── services/
│   ├── blog.service.ts
│   ├── library.service.ts
│   └── project.service.ts
└── types.ts
```

## 테스트

Vitest 기반:

```bash
pnpm test -w @jinho-blog/mdx-handler
```

## 빌드 관련

`apps/web`의 `dev`/`build` 실행 시 자동으로 `pnpm registry` 실행 (이미지 복사 + 레지스트리 빌드).

```bash
# 수동 실행 시
pnpm run registry -w @jinho-blog/web
```
