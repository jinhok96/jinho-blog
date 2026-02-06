const getBaseUrl = () => {
  // 브라우저 환경
  if (typeof window !== 'undefined') {
    return '';
  }

  // SSR 환경
  // Vercel 자동 제공 (preview, production)
  if (process.env.VERCEL_URL) {
    console.log('process.env.VERCEL_URL', process.env.VERCEL_URL);
    return `https://${process.env.VERCEL_URL}`;
  }

  // 로컬 개발
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  return '';
};

export const HTTP_DEFAULT_TIMEOUT = 10 * 1000;
export const HTTP_DEFAULT_RETRY = 3;
export const HTTP_DEFAULT_BASE_URL = getBaseUrl();
// export const HTTP_DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
export const HTTP_DEFAULT_REVALIDATE_TIME = 60 * 10; // 10분 (초 단위)
