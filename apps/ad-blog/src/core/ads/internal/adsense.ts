import type { AdSlotConfig } from '../../config';

/**
 * 슬롯 렌더링 상태
 * - live: 실제 광고 (`<ins class="adsbygoogle">`)
 * - placeholder: 개발 서버 레이아웃 확인용 상자 (실제 광고 요청 안 함 — 본인 광고 노출·클릭 방지)
 * - hidden: 렌더링 안 함 (게시자 ID 또는 광고 단위 ID 미설정)
 */
export type AdSlotState = 'live' | 'placeholder' | 'hidden';

export function resolveAdSlotState({
  isDevelopment,
  client,
  slotId,
}: {
  isDevelopment: boolean;
  client: string;
  slotId: string;
}): AdSlotState {
  if (isDevelopment) return 'placeholder';
  return client && slotId ? 'live' : 'hidden';
}

/**
 * AdSense 스크립트 로드 여부 (개발 서버 제외, 게시자 ID 설정 시)
 */
export function shouldLoadAdsense({ isDevelopment, client }: { isDevelopment: boolean; client: string }): boolean {
  return !isDevelopment && Boolean(client);
}

/**
 * AdSense 스크립트 URL
 */
export function getAdsenseScriptSrc(client: string): string {
  return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
}

/**
 * `<ins class="adsbygoogle">` 데이터 속성 (AdSense 광고 단위 코드와 동일)
 */
export function getAdSlotAttributes(
  client: string,
  { slotId, layout, layoutKey }: AdSlotConfig,
): Record<string, string> {
  const base = { 'data-ad-client': client, 'data-ad-slot': slotId };

  switch (layout) {
    case 'in-article':
      return { ...base, 'data-ad-format': 'fluid', 'data-ad-layout': 'in-article' };
    case 'in-feed':
      return { ...base, 'data-ad-format': 'fluid', 'data-ad-layout-key': layoutKey ?? '' };
    case 'display':
      return { ...base, 'data-ad-format': 'auto', 'data-full-width-responsive': 'true' };
  }
}

/** AdSense 인증 기관 ID (Google 공식 ads.txt 항목 고정값) */
const GOOGLE_CERTIFICATION_AUTHORITY_ID = 'f08c47fec0942fa0';

/**
 * ads.txt 본문
 * - 게시자 ID `ca-pub-…`에서 `ca-`를 뗀 `pub-…`를 판매자 ID로 사용
 * - 미설정 시 주석만 출력 (승인 전 배포 대비)
 */
export function buildAdsTxt(client: string): string {
  if (!client) return '# AdSense publisher ID not set (src/core/config/internal/ads.ts)\n';

  return `google.com, ${client.replace(/^ca-/, '')}, DIRECT, ${GOOGLE_CERTIFICATION_AUTHORITY_ID}\n`;
}
