/**
 * MDX 관련 경로 상수
 */

// 빌드 및 런타임에서 사용되는 공통 경로
export const PATHS = {
  // Public 디렉토리 (빌드 시 파일 출력)
  PUBLIC_STATIC_DIR: 'apps/web/public/_static',
  PUBLIC_STATIC_MDX_DIR: 'apps/web/public/_static/mdx',

  // Registry JSON 파일
  REGISTRY_JSON: 'apps/web/public/_static/registry.json',

  // URL 경로 (브라우저에서 접근)
  STATIC_MDX_URL: '/_static/mdx',
} as const;
