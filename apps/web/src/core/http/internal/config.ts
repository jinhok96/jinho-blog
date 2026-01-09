export const HTTP_DEFAULT_TIMEOUT = 10 * 1000;
export const HTTP_DEFAULT_RETRY = 3;

/**
 * HTTP 기본 Base URL
 * - 서버 사이드: VERCEL_BRANCH_URL 또는 VERCEL_URL 사용 (Deployment Protection 우회)
 * - 클라이언트: NEXT_PUBLIC_BASE_URL 사용
 */
export const HTTP_DEFAULT_BASE_URL =
  typeof window === 'undefined'
    ? process.env.VERCEL_BRANCH_URL
      ? `https://${process.env.VERCEL_BRANCH_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : ''
    : process.env.NEXT_PUBLIC_BASE_URL || '';

export const HTTP_DEFAULT_REVALIDATE_TIME = 60 * 10; // 10분 (초 단위)
