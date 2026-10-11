# packages/mdx-handler

사이트에 독립적인 MDX 콘텐츠 컬렉션 엔진. 앱이 컬렉션(경로, Zod 스키마, 썸네일·미디어 정책)을 정의하면 빌드 시 frontmatter 검증 후 `registry.json`을 생성하고, 런타임에 타입 안전하게 조회한다.

사이트 전용 코드(컬렉션 정의, 스키마, 조회 서비스)는 앱에 둔다 → [web.md](.claude/web.md) "콘텐츠 (MDX 컬렉션)"

## Public API

### 런타임 — `@jinho-blog/mdx-handler`

[packages/mdx-handler/src/index.ts](packages/mdx-handler/src/index.ts)

```typescript
import {
  // 컬렉션 정의
  defineCollection,    // ({ route, schema, generateThumbnail?, copyMedia? }) => CollectionDefinition
  defineContentConfig, // ({ contentDir, staticDir, staticUrl, registryFile?, github?, gitDates?, collections }) => ContentConfig
  frontmatterSchema,   // 공통 strict 스키마 (title, description, thumbnail?, createdAt?, updatedAt?) → .extend()로 확장
  frontmatterDate,     // YAML 날짜/날짜 문자열 → ISO 문자열
  // 조회
  createContentReader, // (config, readRegistry: () => string) => { getEntries(name) }
  // 콘텐츠 유틸
  filterByCategory, filterByTechStack, searchContent, sortContent, paginateContentWithMeta,
} from '@jinho-blog/mdx-handler';

import type { CollectionEntry, CollectionName, ContentEntry } from '@jinho-blog/mdx-handler';
```

- 항목 타입 = 스키마 출력 + 생성 필드(`slug`, `filePath`, `path`, `createdAt`, `updatedAt`, `thumbnail?`, `ogImage?`, `content`)
- `generateThumbnail: true` 컬렉션은 `thumbnail` 필수 타입
- `createContentReader`는 파일을 직접 읽지 않음: 앱이 리터럴 경로로 읽는 함수를 전달 (Turbopack 파일 트레이싱이 정적 분석하도록. 동적 경로는 앱 전체가 서버 출력에 포함됨)

### ContentConfig 옵션

| 옵션 | 기본값 | 설명 |
|---|---|---|
| `contentDir` | (필수) | MDX 루트, 컬렉션별 `{contentDir}/{name}/*.mdx` |
| `staticDir` / `staticUrl` | (필수) | 미디어 출력 디렉토리와 공개 URL (`{staticDir}/mdx/{name}`) |
| `registryFile` | `{staticDir}/registry.json` | 레지스트리 경로. public이 그대로 배포되는 정적 export 앱은 public 밖으로 지정 |
| `github` | 없음 | Vercel 빌드에서 GitHub API로 커밋 날짜 조회 (`GITHUB_TOKEN` 필요) |
| `gitDates` | `true` | `false`면 frontmatter 날짜만 사용 (얕은 클론으로 빌드하는 호스트용) |

날짜 우선순위: `createdAt` = frontmatter → Git 첫 커밋 → 빌드 시각, `updatedAt` = frontmatter → Git 마지막 커밋 → `createdAt`

### 빌드 전용 — `@jinho-blog/mdx-handler/build`

[packages/mdx-handler/scripts/build.ts](packages/mdx-handler/scripts/build.ts)

```typescript
import { buildContentRegistry, copyContentMedia, resolveContentPaths } from '@jinho-blog/mdx-handler/build';
```

- `copyContentMedia(config)`: `{contentDir}/{name}`의 이미지·비디오 → `{staticDir}/mdx/{name}` (`copyMedia: false` 제외)
- `buildContentRegistry(config)`: 전체 파일 스키마 검증(실패 시 한국어 메시지로 일괄 보고) → Git 날짜·썸네일·OG 이미지·이미지 경로 변환 → `{staticDir}/registry.json`
- 경로는 앱 루트(`process.cwd()`) 기준. 런타임 엔트리에서는 export하지 않음 (번들 트레이싱 방지)

## 내부 구조

```
src/                    # 런타임
├── core/
│   ├── collection/     # defineCollection, 타입, 공통 스키마
│   ├── config/         # 기본 정렬/페이지, 미디어 확장자, 번역 설정
│   ├── paths/          # resolveContentPaths (빌드 전용, src/index.ts에서 export 안 함)
│   └── utils/          # 콘텐츠 유틸, 레지스트리 리더
scripts/                # 빌드 전용 (build.ts 엔트리)
├── build-registry.ts   # 검증 → 레지스트리 생성
├── copy-mdx-images.ts  # 미디어 복사
└── translate/          # 기술 블로그 자동 번역 (pnpm translate)
```

## 테스트

Vitest 기반:

```bash
pnpm --filter @jinho-blog/mdx-handler test
```

## 빌드 관련

`apps/web`의 `dev`/`build` 실행 시 자동으로 `pnpm registry` 실행 (`apps/web/scripts/registry.ts`: 미디어 복사 + 레지스트리 빌드).

```bash
# 수동 실행 시
pnpm --filter @jinho-blog/web registry
```
