const FALLBACK_SITE_URL = 'https://jinho-blog.com';

/**
 * 사이트 URL을 확정합니다.
 * 환경 변수가 누락되어도 canonical/OG/sitemap URL이 빈 문자열이 되지 않도록 폴백 체인을 둡니다.
 * 1. NEXT_PUBLIC_SITE_URL (직접 지정)
 * 2. VERCEL_PROJECT_PRODUCTION_URL (Vercel 프로덕션 도메인)
 * 3. FALLBACK_SITE_URL (하드코딩된 프로덕션 도메인)
 */
function resolveSiteUrl(): string {
  const candidate = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || '';

  if (!candidate) return FALLBACK_SITE_URL;

  const withProtocol = /^https?:\/\//.test(candidate) ? candidate : `https://${candidate}`;

  // 끝 슬래시 제거: `${SITE_URL}${path}` 조합 시 중복 슬래시 방지
  return withProtocol.replace(/\/+$/, '');
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = 'Jinho Blog';
export const SITE_DESCRIPTION = '프론트엔드 개발자 강진호입니다.';
export const AUTHOR_NAME = 'Jinho';
export const AUTHOR_FULL_NAME = '강진호';
export const SITE_LOCALE = 'ko_KR';
export const SITE_LANGUAGE = 'ko-KR';

/** 기본 OG 이미지 (1200x630, 크롤러 호환을 위해 PNG) */
export const DEFAULT_OG_IMAGE = '/images/og-home.png';
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;

/** 저자 프로필로 연결되는 외부 링크 (JSON-LD sameAs) */
export const AUTHOR_SAME_AS = ['https://github.com/jinhok96'];

/** 사이트 전역 키워드 */
export const SITE_KEYWORDS = [
  '강진호',
  '프론트엔드 개발자',
  '프론트엔드',
  '기술 블로그',
  'React',
  'Next.js',
  'TypeScript',
  '포트폴리오',
];
