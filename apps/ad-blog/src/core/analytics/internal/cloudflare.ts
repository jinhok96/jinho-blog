export const CF_BEACON_SRC = 'https://static.cloudflareinsights.com/beacon.min.js';

/**
 * Cloudflare Web Analytics 비컨 설정 (`data-cf-beacon` 속성 값)
 */
export function getBeaconConfig(token: string): string {
  return JSON.stringify({ token });
}

/**
 * 측정 스크립트 로드 여부
 * - 개발 서버·미리보기 배포(*.vercel.app 등)는 실제 방문이 아니므로 제외: 사이트 도메인(www 포함)에서만 로드
 */
export function shouldLoadAnalytics({
  isDevelopment,
  token,
  hostname,
  siteUrl,
}: {
  isDevelopment: boolean;
  token: string;
  /** 현재 페이지의 location.hostname */
  hostname: string;
  siteUrl: string;
}): boolean {
  if (isDevelopment || !token) return false;
  const siteHost = new URL(siteUrl).hostname.replace(/^www\./, '');
  return hostname.replace(/^www\./, '') === siteHost;
}
