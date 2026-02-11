# packages/shared

공유 타입 및 상수. 빌드 없음 — TS source 직접 사용.

## Public API

[packages/shared/src/index.ts](packages/shared/src/index.ts)

### 타입

```typescript
// 메타데이터
import type { BlogMetadata, ProjectMetadata, LibraryMetadata } from '@jinho-blog/shared';
import type { BaseMetadata, ContentMetadata, MdxInfo, TechStack } from '@jinho-blog/shared';

// 카테고리
import type { BlogCategory, LibraryCategory, ProjectCategory } from '@jinho-blog/shared';

// 옵션/결과
import type { GetBlogPostsOptions, GetProjectsOptions, GetLibrariesOptions } from '@jinho-blog/shared';
import type { PaginatedResult, PaginationInfo, SortOption } from '@jinho-blog/shared';

// 라우팅
import type { Params, ParamsWithSearchParams, SearchParams } from '@jinho-blog/shared';

// 에러
import type { ErrorCode, ErrorResponse, ContentErrorCode, HttpErrorCode } from '@jinho-blog/shared';
```

### 상수

```typescript
import { ERROR_CODES, ERROR_MESSAGES, ERROR_STATUS_MAP } from '@jinho-blog/shared';
import { CONTENT_ERROR_CODES, HTTP_ERROR_CODES, VALIDATION_ERROR_CODES } from '@jinho-blog/shared';
```

## 패키지 스크립트

```bash
pnpm lint -w @jinho-blog/shared
pnpm type-check -w @jinho-blog/shared
```
