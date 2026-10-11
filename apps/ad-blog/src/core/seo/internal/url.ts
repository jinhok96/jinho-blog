import { SITE_URL } from '../../config';

/**
 * 사이트 경로 → 절대 URL (canonical·og:url·JSON-LD·sitemap·RSS 공통)
 * - 홈은 끝 슬래시 없이 `https://domain.com` (Next.js canonical 렌더링과 동일)
 * - 한글 등 비ASCII 경로는 퍼센트 인코딩 (Next.js canonical 렌더링과 동일)
 * - 이미 절대 URL이면 그대로 반환
 */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;

  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized === '/') return SITE_URL;

  return `${SITE_URL}${encodeURI(normalized)}`;
}
