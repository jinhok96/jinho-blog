import type { ScrollDepthTarget } from './scroll';

import { describe, expect, it, vi } from 'vitest';

import { getNewThresholds, getScrollPercent, SCROLL_DEPTH_THRESHOLDS, startScrollDepthTracking } from './scroll';

describe('SCROLL_DEPTH_THRESHOLDS', () => {
  it('25·50·75 (90은 향상된 측정이 보내므로 제외)', () => {
    expect(SCROLL_DEPTH_THRESHOLDS).toEqual([25, 50, 75]);
    expect(SCROLL_DEPTH_THRESHOLDS).not.toContain(90);
  });
});

describe('getScrollPercent', () => {
  const page = { viewportHeight: 1000, documentHeight: 5000 };

  it('화면 아래 끝 위치 / 문서 높이', () => {
    expect(getScrollPercent({ ...page, scrollY: 1500 })).toBe(50);
  });

  it('맨 위는 화면에 보이는 비율', () => {
    expect(getScrollPercent({ ...page, scrollY: 0 })).toBe(20);
  });

  it('맨 아래는 100', () => {
    expect(getScrollPercent({ ...page, scrollY: 4000 })).toBe(100);
  });

  it('소수점은 버림', () => {
    expect(getScrollPercent({ ...page, scrollY: 1249 })).toBe(44);
  });

  it('나눗셈 부동소수점 오차로 1 작게 버려지지 않음 (290/1000×100 = 28.999…)', () => {
    expect(getScrollPercent({ scrollY: 160, viewportHeight: 130, documentHeight: 1000 })).toBe(29);
  });

  it('스크롤할 수 없는 페이지(문서 ≤ 화면)는 0', () => {
    expect(getScrollPercent({ scrollY: 0, viewportHeight: 1000, documentHeight: 800 })).toBe(0);
    expect(getScrollPercent({ scrollY: 0, viewportHeight: 1000, documentHeight: 1000 })).toBe(0);
  });

  it('오버스크롤 등으로 범위를 벗어나면 0~100으로 제한', () => {
    expect(getScrollPercent({ ...page, scrollY: 6000 })).toBe(100);
    expect(getScrollPercent({ ...page, scrollY: -2000 })).toBe(0);
  });
});

describe('getNewThresholds', () => {
  it('도달한 구간이 없으면 빈 배열', () => {
    expect(getNewThresholds(20, new Set())).toEqual([]);
  });

  it('구간 값과 같으면 도달', () => {
    expect(getNewThresholds(25, new Set())).toEqual([25]);
  });

  it('여러 구간을 한 번에 지나면 오름차순으로 모두', () => {
    expect(getNewThresholds(80, new Set())).toEqual([25, 50, 75]);
  });

  it('이미 보낸 구간은 제외', () => {
    expect(getNewThresholds(80, new Set([25]))).toEqual([50, 75]);
    expect(getNewThresholds(100, new Set([25, 50, 75]))).toEqual([]);
  });

  it('구간 목록을 지정하면 오름차순으로 정렬', () => {
    expect(getNewThresholds(60, new Set(), [50, 10, 90])).toEqual([10, 50]);
  });
});

/**
 * 가짜 window: 화면 1000px, 문서 5000px (맨 위 20%). 프레임은 flushFrames()로 직접 실행
 */
function createFakeTarget({ documentHeight = 5000, withGtag = true } = {}) {
  const listeners = new Set<() => void>();
  const frames = new Map<number, () => void>();
  let nextFrameId = 1;
  const gtag = vi.fn<(...args: unknown[]) => void>();

  const target = {
    scrollY: 0,
    innerHeight: 1000,
    document: { documentElement: { scrollHeight: documentHeight } },
    ...(withGtag && { gtag }),
    addEventListener: vi.fn((_type: 'scroll', listener: () => void) => {
      listeners.add(listener);
    }),
    removeEventListener: vi.fn((_type: 'scroll', listener: () => void) => {
      listeners.delete(listener);
    }),
    requestAnimationFrame: vi.fn((callback: () => void) => {
      const id = nextFrameId++;
      frames.set(id, callback);
      return id;
    }),
    cancelAnimationFrame: vi.fn((id: number) => {
      frames.delete(id);
    }),
  } satisfies ScrollDepthTarget;

  /** 스크롤 위치를 바꾸고 scroll 이벤트 발생 */
  const scrollTo = (y: number) => {
    target.scrollY = y;
    for (const listener of listeners) listener();
  };

  /** 예약된 애니메이션 프레임 실행 */
  const flushFrames = () => {
    const pending = [...frames.values()];
    frames.clear();
    for (const callback of pending) callback();
  };

  /** 보낸 percent_scrolled 값 목록 */
  const sentPercents = () =>
    gtag.mock.calls.map(([command, eventName, params]) => {
      expect([command, eventName]).toEqual(['event', 'scroll']);
      return (params as { percent_scrolled: number }).percent_scrolled;
    });

  return { target, gtag, listeners, frames, scrollTo, flushFrames, sentPercents };
}

describe('startScrollDepthTracking', () => {
  it('passive scroll 리스너 등록', () => {
    const { target, listeners } = createFakeTarget();
    startScrollDepthTracking(target);

    expect(target.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });
    expect(listeners.size).toBe(1);
  });

  it('스크롤 전에는 아무것도 보내지 않음 (로드 시 화면 비율만으로 전송 안 함)', () => {
    const { target, gtag, flushFrames } = createFakeTarget({ documentHeight: 2000 }); // 맨 위 50%
    startScrollDepthTracking(target);
    flushFrames();

    expect(target.requestAnimationFrame).not.toHaveBeenCalled();
    expect(gtag).not.toHaveBeenCalled();
  });

  it('`scroll` 이벤트 + percent_scrolled 파라미터로 전송', () => {
    const { target, gtag, scrollTo, flushFrames } = createFakeTarget();
    startScrollDepthTracking(target);
    scrollTo(250);
    flushFrames();

    expect(gtag.mock.calls).toEqual([['event', 'scroll', { percent_scrolled: 25 }]]);
  });

  it('구간마다 한 번만 전송', () => {
    const { target, scrollTo, flushFrames, sentPercents } = createFakeTarget();
    startScrollDepthTracking(target);

    scrollTo(250);
    flushFrames();
    scrollTo(300);
    flushFrames();
    scrollTo(1500);
    flushFrames();
    scrollTo(0);
    flushFrames();
    scrollTo(1500);
    flushFrames();

    expect(sentPercents()).toEqual([25, 50]);
  });

  it('여러 구간을 한 번에 지나면 낮은 구간부터 모두 전송 (90은 보내지 않음)', () => {
    const { target, scrollTo, flushFrames, sentPercents } = createFakeTarget();
    startScrollDepthTracking(target);
    scrollTo(4000);
    flushFrames();

    expect(sentPercents()).toEqual([25, 50, 75]);
  });

  it('프레임당 한 번만 측정하고 프레임 시점의 위치 사용', () => {
    const { target, scrollTo, flushFrames, sentPercents } = createFakeTarget();
    startScrollDepthTracking(target);
    scrollTo(100);
    scrollTo(200);
    scrollTo(1500);

    expect(target.requestAnimationFrame).toHaveBeenCalledTimes(1);
    flushFrames();
    expect(sentPercents()).toEqual([25, 50]);
  });

  it('문서 높이는 프레임 시점 값 사용 (지연 로드로 길어진 문서)', () => {
    const { target, scrollTo, flushFrames, sentPercents } = createFakeTarget({ documentHeight: 2000 });
    startScrollDepthTracking(target);
    scrollTo(500);
    target.document.documentElement.scrollHeight = 10000;
    flushFrames();

    expect(sentPercents()).toEqual([]);
  });

  it('스크롤할 수 없는 페이지는 전송 안 함', () => {
    const { target, gtag, scrollTo, flushFrames } = createFakeTarget({ documentHeight: 800 });
    startScrollDepthTracking(target);
    scrollTo(0);
    flushFrames();

    expect(gtag).not.toHaveBeenCalled();
  });

  it('모든 구간을 보낸 뒤에는 프레임을 예약하지 않음', () => {
    const { target, scrollTo, flushFrames } = createFakeTarget();
    startScrollDepthTracking(target);
    scrollTo(4000);
    flushFrames();
    scrollTo(3000);

    expect(target.requestAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it('gtag가 없어도 오류 없음', () => {
    const { target, scrollTo, flushFrames } = createFakeTarget({ withGtag: false });
    startScrollDepthTracking(target);
    scrollTo(4000);

    expect(() => flushFrames()).not.toThrow();
  });

  describe('reset', () => {
    it('보낸 구간 기록을 지워 다시 전송 (페이지 이동)', () => {
      const { target, scrollTo, flushFrames, sentPercents } = createFakeTarget();
      const tracker = startScrollDepthTracking(target);
      scrollTo(4000);
      flushFrames();

      tracker.reset();
      scrollTo(0);
      flushFrames();
      expect(sentPercents()).toEqual([25, 50, 75]);

      scrollTo(1500);
      flushFrames();
      expect(sentPercents()).toEqual([25, 50, 75, 25, 50]);
    });

    it('초기화만으로는 전송 안 함 (스크롤 필요)', () => {
      const { target, gtag, flushFrames } = createFakeTarget({ documentHeight: 2000 });
      const tracker = startScrollDepthTracking(target);
      tracker.reset();
      flushFrames();

      expect(gtag).not.toHaveBeenCalled();
    });

    it('이전 페이지 스크롤로 예약된 프레임은 취소', () => {
      const { target, gtag, frames, scrollTo, flushFrames } = createFakeTarget();
      const tracker = startScrollDepthTracking(target);
      scrollTo(4000);
      tracker.reset();

      expect(target.cancelAnimationFrame).toHaveBeenCalledTimes(1);
      expect(frames.size).toBe(0);
      flushFrames();
      expect(gtag).not.toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    it('등록한 리스너를 제거해 이후 스크롤은 측정 안 함', () => {
      const { target, gtag, listeners, scrollTo, flushFrames } = createFakeTarget();
      const tracker = startScrollDepthTracking(target);
      const [listener] = listeners;

      tracker.stop();
      expect(target.removeEventListener).toHaveBeenCalledWith('scroll', listener);
      expect(listeners.size).toBe(0);

      scrollTo(4000);
      flushFrames();
      expect(target.requestAnimationFrame).not.toHaveBeenCalled();
      expect(gtag).not.toHaveBeenCalled();
    });

    it('예약된 프레임도 취소', () => {
      const { target, gtag, scrollTo, flushFrames } = createFakeTarget();
      const tracker = startScrollDepthTracking(target);
      scrollTo(4000);
      tracker.stop();
      flushFrames();

      expect(target.cancelAnimationFrame).toHaveBeenCalledTimes(1);
      expect(gtag).not.toHaveBeenCalled();
    });
  });
});
