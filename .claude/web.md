# apps/web

Next.js App Router 기반 블로그 (포트 3401). FSD 아키텍처 적용.

## FSD 레이어 계층

```
App (최상위)
  ↓ Views ↓ Modules ↓ Features ↓ Entities ↓ Core (최하위)
```

### 레이어별 Import 규칙

| 레이어       | Import 가능                                   | Import 불가         |
| ------------ | --------------------------------------------- | ------------------- |
| **App**      | 모든 레이어                                   | -                   |
| **Views**    | Core, Entities, Features, Modules, 같은 Slice | 다른 Views, App     |
| **Modules**  | Core, Entities, Features, 같은 Slice          | Views, App          |
| **Features** | Core, Entities, 같은 Slice                    | Modules, Views, App |
| **Entities** | Core, 같은 Slice                              | Features 이상       |
| **Core**     | Core만                                        | 모든 상위 레이어    |

### 핵심 원칙

1. **하위 레이어만 import** - 상위 레이어 import 금지
2. **같은 레이어의 다른 Slice import 금지**
3. **Public API(index.ts) 사용** - Segment 직접 접근 최소화

```typescript
// ✅ Good - Public API
import { getBlogPosts } from '@/entities/blog';

// ❌ Bad - Segment 직접 접근
import { getBlogPosts } from '@/entities/blog/service/service';

// ❌ Bad - 같은 레이어 다른 Slice
// src/entities/blog/...
import { Project } from '@/entities/project';
```

## Import 순서

ESLint 자동 정렬 (`pnpm lint`):

** 반드시 pnpm lint 먼저 시도 **

```typescript
// 1. Type-only imports
import type { BlogMetadata } from '@jinho-blog/shared';
import type { Blog } from '@/entities/blog';

// 2. React & Next.js
import { useState } from 'react';
import Link from 'next/link';

// 3. External packages
import { motion } from 'motion';

// 4. Internal packages (@jinho-blog/*)
import { getBlogPosts } from '@jinho-blog/mdx-handler';
import { routes } from '@jinho-blog/nextjs-routes';

// 5. Absolute imports (@/)
import { http } from '@/core/http';
import { Button } from '@/core/ui/button';
import { Pagination } from '@/features/pagination';

// 6. Public
import Logo from 'public/logo.svg';

// 7. Relative (index.ts만)
import { BlogHeader } from './BlogHeader';

// 8. Style
import '@/styles/globals.css';
```

## 컴포넌트 파일 구조

```typescript
// 1. 'use client' (필요 시)
'use client';

// 2. Type imports
import type { ButtonHTMLAttributes } from 'react';

// 3. 일반 imports
import { buttonVariants } from '@/core/ui/button/variants';

// 4. Type 정의
type Props = { ... };

// 5. Named export
export function ComponentName({ prop }: Props) {
  return <div>...</div>;
}
```

## 스타일링

CVA + cn 패턴:

```typescript
import { cn } from '@/core/utils';
import { buttonVariants } from '@/core/ui/button/variants';

<button className={cn(buttonVariants({ variant, size }), className)}>
```

## 패키지 스크립트

```bash
pnpm dev -w @jinho-blog/web    # 개발 서버 (포트 3401)
pnpm build -w @jinho-blog/web  # 빌드
pnpm lint -w @jinho-blog/web   # lint + 자동 수정
```

## FSD/코딩 체크리스트

- [ ] FSD 레이어 계층 준수 (하위만 import)
- [ ] 같은 레이어 다른 Slice import 없음
- [ ] Public API(index.ts) 사용
- [ ] Import 순서 준수
- [ ] `import type` 사용
- [ ] Named export 사용
- [ ] `@/*` 절대 경로 사용 (index.ts 제외)
- [ ] `pnpm lint` 통과

## 패턴 참고 파일

- [apps/web/src/app](apps/web/src/app) - App Router
- [apps/web/src/views/blog](apps/web/src/views/blog) - Views 패턴
- [apps/web/src/modules/header](apps/web/src/modules/header) - Modules 패턴
- [apps/web/src/features/pagination](apps/web/src/features/pagination) - Features 패턴
- [apps/web/src/entities/blog](apps/web/src/entities/blog) - Entities 패턴
- [apps/web/src/core/ui/button](apps/web/src/core/ui/button) - Core UI 패턴
- [apps/web/src/styles/globals.css](apps/web/src/styles/globals.css) - 전역 스타일
- [apps/web/src/core/ui/button/variants.ts](apps/web/src/core/ui/button/variants.ts) - CVA 패턴
