import { SITE_URL } from '../../config';

/**
 * 사이트 경로 → 절대 URL
 * - 홈은 canonical 일관성을 위해 끝 슬래시 포함 (`https://domain.com/`)
 * - 이미 절대 URL이면 그대로 반환
 */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;

  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
