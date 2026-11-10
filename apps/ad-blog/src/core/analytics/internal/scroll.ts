import type { GtagTarget } from './google';

/**
 * 직접 보내는 스크롤 깊이 구간 (%)
 * - 90%는 GA4 향상된 측정이 같은 `scroll` 이벤트로 보내므로 제외 (중복 집계 방지)
 */
export const SCROLL_DEPTH_THRESHOLDS = [25, 50, 75] as const;

/**
 * 스크롤 깊이 (0~100 정수): 화면 아래 끝이 문서 높이의 몇 %까지 내려왔는지 (GA4 향상된 측정 90%와 같은 기준)
 * - 소수점 버림, 0~100으로 제한 (iOS 오버스크롤로 scrollY가 음수·문서 끝 초과여도 범위 유지)
 * - 문서가 화면보다 짧거나 같으면(스크롤할 수 없는 페이지) 0 → 구간 이벤트를 보내지 않음
 */
export function getScrollPercent({
  scrollY,
  viewportHeight,
  documentHeight,
}: {
  scrollY: number;
  viewportHeight: number;
  documentHeight: number;
}): number {
  if (documentHeight <= viewportHeight) return 0;
  // 곱셈을 먼저 해서 부동소수점 오차로 1 작게 버려지지 않게 함 (290 / 1000 * 100 = 28.999…)
  const percent = Math.floor(((scrollY + viewportHeight) * 100) / documentHeight);
  return Math.min(100, Math.max(0, percent));
}

/**
 * 이번에 새로 도달한 구간 (오름차순): `percent` 이하이면서 아직 보내지 않은 구간
 */
export function getNewThresholds(
  percent: number,
  sent: ReadonlySet<number>,
  thresholds: readonly number[] = SCROLL_DEPTH_THRESHOLDS,
): number[] {
  return thresholds.filter(threshold => threshold <= percent && !sent.has(threshold)).sort((a, b) => a - b);
}

/**
 * 스크롤 깊이 측정 대상 (브라우저에서는 window, 테스트에서는 가짜 객체)
 */
export type ScrollDepthTarget = GtagTarget & {
  scrollY: number;
  innerHeight: number;
  document: { documentElement: { scrollHeight: number } };
  addEventListener(type: 'scroll', listener: () => void, options: AddEventListenerOptions): void;
  removeEventListener(type: 'scroll', listener: () => void): void;
  requestAnimationFrame(callback: () => void): number;
  cancelAnimationFrame(handle: number): void;
};

export type ScrollDepthTracker = {
  /** 보낸 구간 기록 초기화 (클라이언트 라우팅으로 페이지가 바뀔 때) */
  reset(): void;
  /** 스크롤 리스너 제거 */
  stop(): void;
};

/**
 * 스크롤 깊이 이벤트 전송 시작 (`gtag('event', 'scroll', { percent_scrolled })`, 구간별 페이지당 1회)
 * - 향상된 측정 90%와 같은 이벤트·파라미터 이름 → GA4 기본 측정기준 `percentScrolled`에 25·50·75·90이 함께 집계
 *   (맞춤 측정기준 등 GA4 관리 설정 변경 불필요)
 * - passive 스크롤 리스너 + requestAnimationFrame으로 프레임당 1회만 측정 (위치·문서 높이는 프레임 시점 값)
 * - 스크롤 이벤트가 있어야 측정: 로드 직후 화면에 보이는 비율만으로는 보내지 않음
 * - 여러 구간을 한 번에 지나면(긴 점프·End 키) 낮은 구간부터 모두 전송
 */
export function startScrollDepthTracking(target: ScrollDepthTarget): ScrollDepthTracker {
  const sent = new Set<number>();
  let frame: number | null = null;

  const measure = () => {
    frame = null;
    const percent = getScrollPercent({
      scrollY: target.scrollY,
      viewportHeight: target.innerHeight,
      documentHeight: target.document.documentElement.scrollHeight,
    });
    for (const threshold of getNewThresholds(percent, sent)) {
      sent.add(threshold);
      target.gtag?.('event', 'scroll', { percent_scrolled: threshold });
    }
  };

  const onScroll = () => {
    // 이미 예약된 프레임이 있거나 모든 구간을 보냈으면 측정 생략
    if (frame !== null || sent.size === SCROLL_DEPTH_THRESHOLDS.length) return;
    frame = target.requestAnimationFrame(measure);
  };

  const cancelFrame = () => {
    if (frame === null) return;
    target.cancelAnimationFrame(frame);
    frame = null;
  };

  target.addEventListener('scroll', onScroll, { passive: true });

  return {
    reset() {
      // 이전 페이지의 스크롤로 예약된 측정은 취소 (새 페이지에서 스크롤 없이 전송되지 않게)
      cancelFrame();
      sent.clear();
    },
    stop() {
      cancelFrame();
      target.removeEventListener('scroll', onScroll);
    },
  };
}
