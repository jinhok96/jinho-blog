# 프로젝트 컨벤션

Turborepo 기반 monorepo 프로젝트의 코딩 컨벤션과 구조를 정의합니다.

## 1. Monorepo 구조

### 워크스페이스

```
jinho-blog/
├── apps/
│   └── web/              # Next.js 16.1.1 블로그 애플리케이션 (포트 3401)
└── packages/
    ├── shared/           # 공유 타입 및 상수
    ├── mdx-handler/      # MDX 파싱 및 처리
    └── nextjs-routes/    # 타입 안전 라우팅 생성기
```

### 패키지 간 의존성

```
@jinho-blog/shared
    ↓
@jinho-blog/mdx-handler
    ↓
@jinho-blog/web
```

### Turbo 명령어

```bash
npm run dev     # 모든 워크스페이스 개발 서버
npm run build   # 의존성 순서대로 빌드
npm run lint    # 전체 린팅
```

## 2. FSD 아키텍처 핵심 규칙

### 레이어 계층

```
App (최상위)
  ↓
Views
  ↓
Modules
  ↓
Features
  ↓
Entities
  ↓
Core (최하위)
```

### 레이어별 Import 규칙

| 레이어       | Import 가능                                   | Import 불가         |
| ------------ | --------------------------------------------- | ------------------- |
| **App**      | 모든 레이어                                   | 제한 없음           |
| **Views**    | Core, Entities, Features, Modules, 같은 Slice | 다른 Views, App     |
| **Modules**  | Core, Entities, Features, 같은 Slice          | Views, App          |
| **Features** | Core, Entities, 같은 Slice                    | Modules, Views, App |
| **Entities** | Core, 같은 Slice                              | Features 이상       |
| **Core**     | Core만                                        | 모든 상위 레이어    |

### 핵심 원칙 3가지

1. **하위 레이어만 import** - 상위 레이어 import 금지
2. **같은 레이어의 다른 Slice import 금지** - Slice 간 격리
3. **Public API (index.ts) 사용 권장** - Segment 직접 접근 최소화

### Slice vs Segment

- **Slice**: 레이어의 최상위 폴더 (예: `src/entities/blog`)
  - Public API로 취급 (`index.ts` 필수)
  - 다른 레이어에서 import 가능

- **Segment**: Slice 내부 폴더 (예: `src/entities/blog/service`)
  - Private 구현
  - 같은 Slice 내에서만 접근 (Public API 권장)

### Import 규칙 Good vs Bad

**✅ Good - Public API 사용:**

```typescript
import { getBlogPosts } from '@/entities/blog';
```

**❌ Bad - Segment 직접 접근:**

```typescript
import { getBlogPosts } from '@/entities/blog/service/service';
```

**✅ Good - 하위 레이어 import:**

```typescript
// src/entities/blog/service/service.ts
import { http } from '@/core/http'; // Entities → Core
```

**❌ Bad - 상위 레이어 import:**

```typescript
// src/entities/blog/service/service.ts
import { Pagination } from '@/features/pagination'; // Entities → Features (금지)
```

**❌ Bad - 같은 레이어의 다른 Slice:**

```typescript
// src/entities/blog/service/service.ts
import { Project } from '@/entities/project'; // blog → project (금지)
```

### 참고

- [apps/web/eslint.config.mjs](../../apps/web/eslint.config.mjs) - eslint-plugin-boundaries 설정

## 3. 내부 패키지 Import

### @jinho-blog/shared

**역할:** 공유 타입 및 상수

**주요 Export:**

- 타입: `BlogMetadata`, `ProjectMetadata`, `LibraryMetadata`, `ErrorCode`
- 상수: `ERROR_CODES`, `ERROR_MESSAGES`, `ERROR_STATUS_MAP`

**Import 예시:**

```typescript
import type { BlogMetadata, BlogCategory } from '@jinho-blog/shared';
import { ERROR_CODES } from '@jinho-blog/shared';
```

### @jinho-blog/mdx-handler

**역할:** MDX 파싱, 필터링, 정렬

**주요 함수:**

- `getBlogPosts(options)` - 블로그 포스트 목록
- `getBlogPost(slug)` - 단일 포스트
- `getProjects(options)` - 프로젝트 목록
- `getLibraries(options)` - 라이브러리 목록

**Import 예시:**

```typescript
import { getBlogPosts, getBlogPost } from '@jinho-blog/mdx-handler';
```

### @jinho-blog/nextjs-routes

**역할:** 타입 안전 라우팅

**사용법:**

```typescript
import { routes } from '@jinho-blog/nextjs-routes';

const url = routes({
  pathname: '/blog/[slug]',
  params: { slug: 'my-post' },
  search: { page: '1' },
});
```

### TypeScript 경로 별칭

| 워크스페이스           | 경로 별칭                                              |
| ---------------------- | ------------------------------------------------------ |
| `apps/web`             | `@/*`, `@jinho-blog/shared`, `@jinho-blog/mdx-handler` |
| `packages/mdx-handler` | `@jinho-blog/shared`                                   |
| `packages/shared`      | 없음                                                   |

## 4. Import 순서

**ESLint 자동 정렬 (npm run lint):**

1. **Type-only imports** - `import type { ... }`
2. **React & Next.js** - `react`, `next`
3. **External packages** - npm 패키지
4. **Internal packages** - `@jinho-blog/*` ⭐
5. **Absolute imports** - `@/core`, `@/entities`, `@/features`, `@/modules`, `@/views`, `@/`
6. **Public imports** - `public/*`
7. **Relative imports** - `./`, `../` (index.ts만)
8. **Style imports** - `.css`

**예시:**

```typescript
// 1. Type-only
import type { BlogMetadata } from '@jinho-blog/shared';
import type { Blog } from '@/entities/blog';

// 2. React & Next.js
import { useState } from 'react';
import Link from 'next/link';

// 3. External
import { motion } from 'motion';

// 4. Internal packages
import { getBlogPosts } from '@jinho-blog/mdx-handler';
import { routes } from '@jinho-blog/nextjs-routes';

// 5. Absolute
import { http } from '@/core/http';
import { Button } from '@/core/ui/button';
import { createBlogService } from '@/entities/blog';
import { Pagination } from '@/features/pagination';

// 6. Public
import Logo from 'public/logo.svg';

// 7. Relative
import { BlogHeader } from './BlogHeader';

// 8. Style
import '@/styles/globals.css';
```

## 5. 코딩 컨벤션

### TypeScript 규칙

**Type import:**

```typescript
// ✅ Good
import type { PropsWithChildren } from 'react';

// ❌ Bad
import { PropsWithChildren } from 'react';
```

**타입 우선순위:**

- `any` 사용 금지
- `interface`보다 `type` 선호
- Type annotation을 assertion보다 우선

### 컴포넌트 작성 규칙

**파일 구조:**

```typescript
// 1. 'use client' 지시어 (필요 시)
'use client';

// 2. Type imports
import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

// 3. 일반 imports (순서 준수)
import { buttonVariants } from '@/core/ui/button/variants';

// 4. Type 정의
type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

// 5. 컴포넌트 (named export)
export function ComponentName({ prop1, prop2 }: Props) {
  return <div>...</div>;
}
```

**Export:**

- Named export 사용 (default export 금지)

### 스타일링

**CVA + cn 사용:**

```typescript
import { cn } from '@/core/utils';
import { buttonVariants } from '@/core/ui/button/variants';

<button
  className={cn(
    buttonVariants({ variant, size }),
    className
  )}
>
```

### Prettier 설정

| 옵션                     | 값      |
| ------------------------ | ------- |
| `tabWidth`               | `2`     |
| `useTabs`                | `false` |
| `singleQuote`            | `true`  |
| `trailingComma`          | `'all'` |
| `printWidth`             | `120`   |
| `endOfLine`              | `'lf'`  |
| `singleAttributePerLine` | `true`  |

## 6. 개발 워크플로우

### Turbo 스크립트

**루트 레벨 (모든 워크스페이스):**

```bash
npm run dev           # 개발 서버 시작
npm run build         # 의존성 순서대로 빌드
npm run lint          # 린팅 (lf + eslint + type-check)
npm run type-check    # TypeScript 타입 검사
```

**워크스페이스별:**

```bash
npm run dev -w @jinho-blog/web    # web만 실행
```

### 빌드 의존성 순서

```
1. @jinho-blog/shared (타입 정의)
   ↓
2. @jinho-blog/mdx-handler (shared 사용)
   ↓
3. @jinho-blog/nextjs-routes (독립적)
   ↓
4. @jinho-blog/web (shared + mdx-handler 사용)
```

Turborepo가 `turbo.json`의 `dependsOn: ["^build"]` 설정으로 자동 순서 보장

## 7. 필수 체크리스트

### Monorepo 체크

- [ ] 내부 패키지 의존성이 올바른가? (`@jinho-blog/*`)
- [ ] 패키지 Public API(`index.ts`)를 통해 import하는가?
- [ ] Turbo 빌드 순서를 고려했는가?
- [ ] 워크스페이스별 경로 별칭이 올바른가?
- [ ] 패키지 간 순환 의존성이 없는가?

### FSD 아키텍처 체크

- [ ] FSD 레이어 계층을 준수하는가? (하위 레이어만 import)
- [ ] 같은 레이어의 다른 Slice를 import하지 않는가?
- [ ] Public API를 우선적으로 사용하는가?
- [ ] eslint-plugin-boundaries 규칙을 위반하지 않는가?
- [ ] Slice는 `index.ts`로 export를 명시하는가?

### 코딩 체크

- [ ] Import 순서가 ESLint 규칙을 따르는가?
- [ ] Type import는 `import type`을 사용했는가?
- [ ] 경로는 `@/*` 절대 경로를 사용했는가? (index.ts 제외)
- [ ] Named export를 사용하는가?
- [ ] Prettier 규칙을 준수했는가?
- [ ] `npm run lint`를 실행해 오류가 없는가?

## 8. 참고 파일

### 핵심 설정 파일

- [turbo.json](../../turbo.json) - Turborepo tasks 설정
- [package.json](../../package.json) - 루트 패키지 설정
- [apps/web/tsconfig.json](../../apps/web/tsconfig.json) - TypeScript 경로 별칭
- [apps/web/eslint.config.mjs](../../apps/web/eslint.config.mjs) - ESLint + boundaries
- [apps/web/next.config.ts](../../apps/web/next.config.ts) - Next.js 설정

### 패턴 참고 파일

**FSD 레이어 구조:**

- [apps/web/src/app](../../apps/web/src/app) - App Router
- [apps/web/src/views/blog](../../apps/web/src/views/blog) - Views 패턴
- [apps/web/src/modules/header](../../apps/web/src/modules/header) - Modules 패턴
- [apps/web/src/features/pagination](../../apps/web/src/features/pagination) - Features 패턴
- [apps/web/src/entities/blog](../../apps/web/src/entities/blog) - Entities 패턴
- [apps/web/src/core/ui/button](../../apps/web/src/core/ui/button) - Core UI 패턴

**내부 패키지:**

- [packages/shared/src/index.ts](../../packages/shared/src/index.ts) - Public API 예시
- [packages/mdx-handler/src/index.ts](../../packages/mdx-handler/src/index.ts) - 서비스 패턴

**스타일:**

- [apps/web/src/styles/globals.css](../../apps/web/src/styles/globals.css) - 전역 스타일
- [apps/web/src/core/ui/button/variants.ts](../../apps/web/src/core/ui/button/variants.ts) - CVA 패턴
