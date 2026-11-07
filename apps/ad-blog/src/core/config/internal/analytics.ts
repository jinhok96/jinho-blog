/**
 * 방문 측정 설정
 * - Cloudflare Web Analytics: 실제 방문자 페이지뷰 측정 (쿠키 없음)
 * - Google Analytics 4: 페이지별 참여 시간(체류)·90% 스크롤 측정 (쿠키 사용, 유럽은 동의 전 거부)
 * - 각 값이 비어 있으면 해당 측정 스크립트를 로드하지 않음
 */

/**
 * 사이트 토큰 (Cloudflare 대시보드 > Web Analytics > 사이트 > Manage site > JS 스니펫의 "token" 값)
 */
export const CF_WEB_ANALYTICS_TOKEN: string = '11ff5f9f67bb4894aadec935d7891e61';

/**
 * GA4 측정 ID (GA4 관리 > 데이터 스트림 > 웹 스트림의 "측정 ID", 비어 있으면 로드 안 함)
 */
export const GA_MEASUREMENT_ID: string = 'G-GMRVKRVMHS';

const TOKEN_PATTERN = /^[0-9a-f]{32}$/i;
const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/;

/**
 * 토큰 형식 검증 (빌드 시 오타로 측정이 조용히 실패하지 않도록 즉시 에러)
 */
export function validateAnalyticsConfig(token: string): void {
  if (token && !TOKEN_PATTERN.test(token)) {
    throw new Error(`CF_WEB_ANALYTICS_TOKEN 형식 오류: '${token}' (32자리 16진수)`);
  }
}

/**
 * GA4 측정 ID 형식 검증 (빌드 시 오타로 측정이 조용히 실패하지 않도록 즉시 에러)
 */
export function validateGaMeasurementId(id: string): void {
  if (id && !GA_MEASUREMENT_ID_PATTERN.test(id)) {
    throw new Error(`GA_MEASUREMENT_ID 형식 오류: '${id}' (예: 'G-XXXXXXXXXX')`);
  }
}

validateAnalyticsConfig(CF_WEB_ANALYTICS_TOKEN);
validateGaMeasurementId(GA_MEASUREMENT_ID);
