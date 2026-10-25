/**
 * Cloudflare Web Analytics 설정 (실제 방문자 페이지뷰 측정)
 * - 비어 있으면 측정 스크립트를 로드하지 않음
 */

/**
 * 사이트 토큰 (Cloudflare 대시보드 > Web Analytics > 사이트 > Manage site > JS 스니펫의 "token" 값)
 */
export const CF_WEB_ANALYTICS_TOKEN: string = '';

const TOKEN_PATTERN = /^[0-9a-f]{32}$/i;

/**
 * 토큰 형식 검증 (빌드 시 오타로 측정이 조용히 실패하지 않도록 즉시 에러)
 */
export function validateAnalyticsConfig(token: string): void {
  if (token && !TOKEN_PATTERN.test(token)) {
    throw new Error(`CF_WEB_ANALYTICS_TOKEN 형식 오류: '${token}' (32자리 16진수)`);
  }
}

validateAnalyticsConfig(CF_WEB_ANALYTICS_TOKEN);
