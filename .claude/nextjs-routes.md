# packages/nextjs-routes

타입 안전 라우팅 생성기. `app/` 디렉토리 구조를 분석해 TypeScript 타입 자동 생성.

> **주의**: 빌드 필요 패키지. `dist/`가 없으면 동작하지 않음.

## Public API

[packages/nextjs-routes/src/index.ts](packages/nextjs-routes/src/index.ts)

### routes() — 주요 사용법

```typescript
import { routes } from '@jinho-blog/nextjs-routes';

const url = routes({
  pathname: '/blog/[slug]',
  params: { slug: 'my-post' },
  search: { page: '1' },   // optional
});
// → '/blog/my-post?page=1'
```

### withRoutes() — next.config.ts 래퍼

```typescript
// apps/web/next.config.ts
import { withRoutes } from '@jinho-blog/nextjs-routes';

export default withRoutes({
  // Next.js 설정
});
```

Next.js config 로드 시 라우트 타입 자동 생성.

### generateRoutes() — 수동 생성

```typescript
import { generateRoutes } from '@jinho-blog/nextjs-routes';

generateRoutes(); // 현재 디렉토리 기준
generateRoutes('/path/to/project');
```

## 빌드

```bash
pnpm build -w @jinho-blog/nextjs-routes  # dist/ 생성
```

## CLI

```bash
npx nextjs-routes  # 라우트 타입 생성
```

## 참고 파일

- [packages/nextjs-routes/src/core.ts](packages/nextjs-routes/src/core.ts) - 핵심 로직
- [packages/nextjs-routes/src/routes.ts](packages/nextjs-routes/src/routes.ts) - routes() 구현
