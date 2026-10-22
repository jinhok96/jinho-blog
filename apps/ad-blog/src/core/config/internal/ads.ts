/**
 * Google AdSense 설정 (사이트 승인 후 입력)
 * - 비어 있으면 광고 스크립트·슬롯·ads.txt 항목을 만들지 않음 (개발 서버는 슬롯 자리표시 상자만 표시)
 */

/**
 * 게시자 ID (AdSense > 계정 > 계정 정보, 예: 'ca-pub-1234567890123456')
 */
export const ADSENSE_CLIENT: string = 'ca-pub-8310707193208097';

/**
 * 광고 단위 형식
 * - display: 디스플레이 광고 (반응형)
 * - in-article: 콘텐츠 내 자동 삽입 광고 (본문 중간에 적합)
 * - in-feed: 인피드 광고 (AdSense에서 발급한 layoutKey 필요)
 */
export type AdLayout = 'display' | 'in-article' | 'in-feed';

export type AdSlotConfig = {
  /** 광고 단위 ID (AdSense > 광고 > 광고 단위별 > 코드의 data-ad-slot 값) */
  slotId: string;
  layout: AdLayout;
  /** in-feed 광고의 data-ad-layout-key 값 */
  layoutKey?: string;
};

/**
 * 슬롯 위치별 광고 단위
 */
export const AD_SLOTS = {
  /** 글 본문 첫 소제목 앞 (도입부 뒤, 도입부가 있는 글만) */
  postTop: { slotId: '', layout: 'display' },
  /** 글 본문 두 번째 소제목 앞 (소제목 3개 이상인 글만) */
  postMiddle: { slotId: '', layout: 'in-article' },
  /** 글 이전·다음 글 링크 뒤, 관련 글 앞 */
  postBottom: { slotId: '', layout: 'display' },
  /** 목록 카드 사이 */
  listInFeed: { slotId: '', layout: 'display' },
} satisfies Record<string, AdSlotConfig>;

export type AdPlacement = keyof typeof AD_SLOTS;

const ADSENSE_CLIENT_PATTERN = /^ca-pub-\d{16}$/;

/**
 * 설정 형식 검증 (빌드 시 오타로 광고가 조용히 실패하지 않도록 즉시 에러)
 */
export function validateAdsConfig(client: string, slots: Record<string, AdSlotConfig>): void {
  if (client && !ADSENSE_CLIENT_PATTERN.test(client)) {
    throw new Error(`ADSENSE_CLIENT 형식 오류: '${client}' (예: 'ca-pub-1234567890123456')`);
  }

  const placementsBySlotId = new Map<string, string>();

  for (const [placement, { slotId, layout, layoutKey }] of Object.entries(slots)) {
    if (!slotId) continue;

    if (!/^\d+$/.test(slotId)) {
      throw new Error(`AD_SLOTS.${placement}.slotId 형식 오류: '${slotId}' (숫자만)`);
    }
    if (layout === 'in-feed' && !layoutKey) {
      throw new Error(`AD_SLOTS.${placement}: in-feed 광고는 layoutKey가 필요합니다.`);
    }
    if (!client) {
      throw new Error(`AD_SLOTS.${placement}: 광고 단위 ID가 있으면 ADSENSE_CLIENT도 입력해야 합니다.`);
    }
    // 같은 광고 단위를 여러 위치에 쓰면 한 페이지에 같은 광고가 반복되고 위치별 성과를 구분할 수 없음
    const duplicated = placementsBySlotId.get(slotId);
    if (duplicated) {
      throw new Error(`AD_SLOTS.${placement}.slotId가 AD_SLOTS.${duplicated}와 같습니다: '${slotId}'`);
    }
    placementsBySlotId.set(slotId, placement);
  }
}

validateAdsConfig(ADSENSE_CLIENT, AD_SLOTS);
