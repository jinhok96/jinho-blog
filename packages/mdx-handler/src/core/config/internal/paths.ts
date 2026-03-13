/**
 * MDX 관련 경로 상수
 */

// 공통 경로 세그먼트
const WEB_APP_PREFIX = 'apps/web' as const;
const PUBLIC_STATIC_SEGMENT = 'public/_static' as const;

// 빌드 및 런타임에서 사용되는 공통 경로
export const PATHS = {
  // Public 디렉토리 (빌드 시 파일 출력, 모노레포 루트 기준)
  PUBLIC_STATIC_DIR: `${WEB_APP_PREFIX}/${PUBLIC_STATIC_SEGMENT}`,
  PUBLIC_STATIC_MDX_DIR: `${WEB_APP_PREFIX}/${PUBLIC_STATIC_SEGMENT}/mdx`,

  // Registry JSON 파일 (모노레포 루트 기준)
  REGISTRY_JSON: `${WEB_APP_PREFIX}/${PUBLIC_STATIC_SEGMENT}/registry.json`,

  // Registry JSON 파일 (apps/web 루트 기준 — 런타임 process.cwd())
  REGISTRY_JSON_FROM_WEB_ROOT: `${PUBLIC_STATIC_SEGMENT}/registry.json`,

  // URL 경로 (브라우저에서 접근) — 빌드 타임 registry 생성 시 사용
  STATIC_MDX_URL: '/_static/mdx',

  // Next.js static 미디어 URL — 런타임 parser 사용 시
  NEXT_STATIC_MDX_URL: '/_next/static/media/mdx',

  // MDX 소스 콘텐츠 디렉토리 (모노레포 루트 기준)
  MDX_CONTENT_DIR: 'content/mdx',
} as const;
