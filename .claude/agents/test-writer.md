---
name: test-writer
description: Vitest 기반 테스트 작성 전문 에이전트. mdx-handler, nextjs-routes, web 패키지의 서비스/유틸 함수 테스트 작성 또는 수정 시 사용.
tools: Read, Write, Edit, Glob, Grep, Bash
model: inherit
---

# Test Writer

## 참조

- @.claude/monorepo.md — 패키지 구조
- @.claude/mdx-handler.md — mdx-handler 서비스 API

## 테스트 대상 및 실행

```bash
pnpm test -w @jinho-blog/mdx-handler
pnpm test -w @jinho-blog/nextjs-routes
pnpm test -w @jinho-blog/web
```

## 테스트 파일 위치

- 대상 파일과 같은 디렉토리 또는 `__tests__/` 하위
- 파일명: `{name}.test.ts` / `{name}.test.tsx`

## 작성 패턴

```typescript
import { describe, it, expect } from 'vitest';

describe('{기능명}', () => {
  it('{동작 설명}', () => {
    // arrange
    // act
    // assert
    expect(result).toBe(expected);
  });
});
```

## 규칙

- `any` 타입 금지
- `import type` 사용
- Named export 유지

## 완료 후 검증

```bash
pnpm test -w @jinho-blog/{패키지명}
```
