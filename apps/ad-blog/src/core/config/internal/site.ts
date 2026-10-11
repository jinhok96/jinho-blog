/**
 * 사이트 기본 정보
 * - 주제·도메인 확정 시 이 파일과 categories.ts만 수정
 */

/** 도메인 미설정 표시용 URL. 이 값이면 검색엔진 색인을 막는다 */
export const PLACEHOLDER_SITE_URL = 'https://example.com';

/**
 * 사이트 URL (canonical·OG·sitemap 절대 경로 기준)
 * - 빌드 환경변수 NEXT_PUBLIC_SITE_URL로 지정 (예: https://my-blog.com)
 */
function resolveSiteUrl(): string {
  const candidate = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!candidate) return PLACEHOLDER_SITE_URL;

  const withProtocol = /^https?:\/\//.test(candidate) ? candidate : `https://${candidate}`;
  // 끝 슬래시 제거: `${SITE_URL}${path}` 조합 시 중복 슬래시 방지
  return withProtocol.replace(/\/+$/, '');
}

export const SITE_URL = resolveSiteUrl();

/**
 * 검색엔진 색인 허용 여부
 * - 도메인 미설정 상태로 배포되면 example.com canonical이 색인되므로 noindex + robots 차단
 */
export const SITE_INDEXABLE = SITE_URL !== PLACEHOLDER_SITE_URL;

export const SITE_NAME = '블로그 이름';
export const SITE_DESCRIPTION = '블로그 소개 문구를 입력하세요. 검색 결과와 링크 미리보기에 표시됩니다.';
export const SITE_KEYWORDS: string[] = [];
export const SITE_LOCALE = 'ko_KR';
export const SITE_LANGUAGE = 'ko-KR';

export const AUTHOR_NAME = '작성자';
/** 작성자 프로필 링크 (JSON-LD sameAs). 예: SNS, 소개 페이지 */
export const AUTHOR_SAME_AS: string[] = [];

/** 기본 OG 이미지 (scripts/registry.ts가 SITE_NAME으로 생성, 1200x630 JPEG) */
export const DEFAULT_OG_IMAGE = '/_static/og-default.jpg';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/** 목록 페이지당 글 수 */
export const POSTS_PER_PAGE = 12;
