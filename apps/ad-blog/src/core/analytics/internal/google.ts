export const GTAG_SRC = 'https://www.googletagmanager.com/gtag/js';

/**
 * gtag.js 스크립트 URL (측정 ID를 쿼리로 전달)
 */
export function getGtagSrc(measurementId: string): string {
  return `${GTAG_SRC}?id=${encodeURIComponent(measurementId)}`;
}

/**
 * 동의 전 저장소를 거부로 두는 지역 (ISO 3166-1 alpha-2, 32개)
 * - EEA: EU 27개국 + 아이슬란드·리히텐슈타인·노르웨이
 * - 영국·스위스: EEA 밖이지만 같은 수준의 동의 요구
 */
export const CONSENT_REQUIRED_REGIONS: readonly string[] = [
  // EU 27개국
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  // EEA (EU 외)
  'IS',
  'LI',
  'NO',
  // 영국·스위스
  'GB',
  'CH',
];

type ConsentState = 'granted' | 'denied';

export type ConsentDefault = {
  ad_storage: ConsentState;
  ad_user_data: ConsentState;
  ad_personalization: ConsentState;
  analytics_storage: ConsentState;
  region: string[];
  /** 동의 관리 도구(CMP)가 update를 보낼 때까지 태그 실행을 기다리는 시간 (ms) */
  wait_for_update: number;
};

/**
 * 동의 모드 기본값 (`gtag('consent', 'default', …)`)
 * - 유럽(`CONSENT_REQUIRED_REGIONS`)은 동의 전 모두 거부 → 쿠키 없이 측정
 * - 그 밖 지역은 기본값을 두지 않음 (허용으로 동작)
 * - AdSense 동의 메시지(Google 인증 CMP)에서 "분석 목적 동의 모드"를 켜면 방문자가 동의할 때 update가 들어옴
 */
export function getConsentDefault(): ConsentDefault {
  return {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    region: [...CONSENT_REQUIRED_REGIONS],
    wait_for_update: 500,
  };
}

/**
 * gtag 초기화 대상 (브라우저에서는 window, 테스트에서는 가짜 객체)
 */
export type GtagTarget = {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

/**
 * dataLayer·gtag 준비 후 동의 기본값 → js → config 순으로 명령 등록 (gtag.js 로드 전에 호출)
 * - gtag.js는 로드되면 dataLayer에 쌓인 명령을 순서대로 처리하므로 동의 기본값이 config보다 먼저 적용됨
 * - page_view는 수동으로 보내지 않음: config가 첫 페이지뷰를 보내고, 클라이언트 라우팅 이동은
 *   향상된 측정의 "브라우저 기록 이벤트 기반 페이지 변경"이 집계 (수동 전송 시 중복 집계)
 * - 이미 정의된 dataLayer·gtag는 덮어쓰지 않음
 */
export function initGtag(target: GtagTarget, measurementId: string): void {
  target.dataLayer ??= [];
  const gtag = (target.gtag ??= function gtag() {
    // gtag.js는 dataLayer의 arguments 객체만 gtag 명령으로 처리 (rest 파라미터 배열을 넣으면 명령으로 인식되지 않음)
    // eslint-disable-next-line prefer-rest-params
    (target.dataLayer ??= []).push(arguments);
  });

  gtag('consent', 'default', getConsentDefault());
  gtag('js', new Date());
  gtag('config', measurementId);
}
