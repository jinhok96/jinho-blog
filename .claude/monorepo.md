# 모노레포 구조

Turborepo 기반 모노레포. 패키지 매니저: pnpm

## 워크스페이스 구조

```
jinho-blog/
├── apps/
│   └── web/              # Next.js 블로그 (포트 3401) → [web.md](.claude/web.md)
└── packages/
    ├── shared/           # 공유 타입 및 상수 → [shared.md](.claude/shared.md)
    ├── mdx-handler/      # MDX 파싱 및 처리 → [mdx-handler.md](.claude/mdx-handler.md)
    └── nextjs-routes/    # 타입 안전 라우팅 생성기 → [nextjs-routes.md](.claude/nextjs-routes.md)
```

## 패키지 의존성 그래프

```
@jinho-blog/shared (독립)
    ↓
@jinho-blog/mdx-handler
    ↓
@jinho-blog/web

@jinho-blog/nextjs-routes (독립) → @jinho-blog/web (devDependency)
```

## 빌드 순서

Turborepo가 `turbo.json`의 `dependsOn: ["^build"]`로 자동 관리:

1. `@jinho-blog/shared`
2. `@jinho-blog/mdx-handler` + `@jinho-blog/nextjs-routes` (병렬)
3. `@jinho-blog/web`

## Turbo 명령어

```bash
pnpm dev           # 모든 워크스페이스 개발 서버
pnpm build         # 의존성 순서대로 빌드 (테스트 포함)
pnpm lint          # 전체 린팅 (lf + eslint + type-check) + 자동 수정
pnpm type-check    # TypeScript 타입 검사
pnpm test          # 전체 테스트

# 워크스페이스별 실행
pnpm dev -w @jinho-blog/web
```

## 핵심 설정 파일

- [turbo.json](turbo.json)
- [package.json](package.json)
- [apps/web/tsconfig.json](apps/web/tsconfig.json)
- [apps/web/eslint.config.mjs](apps/web/eslint.config.mjs)
- [apps/web/next.config.ts](apps/web/next.config.ts)

---

## 공통 TypeScript 규칙

- `import type` 필수 (값이 아닌 타입 import 시)
- `any` 사용 금지
- `interface`보다 `type` 선호
- Named export 사용 (default export 금지)

```typescript
// ✅ Good
import type { BlogMetadata } from '@jinho-blog/shared';

// ❌ Bad
import { BlogMetadata } from '@jinho-blog/shared';
```

## Prettier 설정

| 옵션 | 값 |
|------|-----|
| `tabWidth` | `2` |
| `useTabs` | `false` |
| `singleQuote` | `true` |
| `trailingComma` | `'all'` |
| `printWidth` | `120` |
| `endOfLine` | `'lf'` |
| `singleAttributePerLine` | `true` |

## Monorepo 체크리스트

- [ ] 내부 패키지 Public API(`index.ts`)를 통해 import하는가?
- [ ] 패키지 간 순환 의존성이 없는가?
- [ ] 워크스페이스별 경로 별칭이 올바른가?
- [ ] Turbo 빌드 순서를 고려했는가?

### TypeScript 경로 별칭

| 워크스페이스 | 경로 별칭 |
|---|---|
| `apps/web` | `@/*`, `@jinho-blog/shared`, `@jinho-blog/mdx-handler` |
| `packages/mdx-handler` | `@jinho-blog/shared` |
| `packages/shared` | 없음 |
