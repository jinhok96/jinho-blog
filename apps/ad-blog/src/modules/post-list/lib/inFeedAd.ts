/** 인피드 광고 앞에 둘 카드 수 (1·2·3열 모두 줄이 꽉 찬 뒤 — 광고가 빈칸 없이 한 줄 전체를 차지) */
const CARDS_BEFORE_IN_FEED_AD = 6;

/**
 * 인피드 광고 위치: 이 인덱스의 카드 바로 뒤
 * - 카드가 기준 수보다 많을 때만 (광고 뒤에도 카드가 이어지도록 — 짧은 목록·목록 끝 광고 방지)
 * - 넣지 않으면 null
 */
export function getInFeedAdIndex(postCount: number): number | null {
  return postCount > CARDS_BEFORE_IN_FEED_AD ? CARDS_BEFORE_IN_FEED_AD - 1 : null;
}
