import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useScrollTargetHeight } from './useScrollTargetHeight';

// ---------------------------------------------------------------------------
// useScrollTargetHeight
// ---------------------------------------------------------------------------
describe('useScrollTargetHeight', () => {
  beforeEach(() => {
    // requestAnimationFrame을 즉시 실행하도록 stub
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('초기값', () => {
    it('scrollY가 target과 다르면 false 반환', () => {
      const { result } = renderHook(() => useScrollTargetHeight(100));
      expect(result.current).toBe(false);
    });

    it('마운트 시 scrollY === target(number)이면 true 반환', () => {
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true, configurable: true });
      const { result } = renderHook(() => useScrollTargetHeight(100));
      expect(result.current).toBe(true);
    });

    it('initValue와 무관하게 마운트 시 handleScroll 결과로 갱신됨', () => {
      // initValue=true이지만 scrollY=0 !== target=100 → false로 갱신
      const { result } = renderHook(() => useScrollTargetHeight(100, true));
      expect(result.current).toBe(false);
    });
  });

  describe('숫자 target', () => {
    it('스크롤 이벤트 후 scrollY === target이면 true 반환', () => {
      const { result } = renderHook(() => useScrollTargetHeight(300));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 300, writable: true, configurable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current).toBe(true);
    });

    it('스크롤 이벤트 후 scrollY !== target이면 false 반환', () => {
      Object.defineProperty(window, 'scrollY', { value: 300, writable: true, configurable: true });
      const { result } = renderHook(() => useScrollTargetHeight(300));
      expect(result.current).toBe(true);

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true, configurable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current).toBe(false);
    });
  });

  describe('함수 target', () => {
    it('마운트 시 target 함수가 true를 반환하면 true 반환', () => {
      Object.defineProperty(window, 'scrollY', { value: 150, writable: true, configurable: true });
      const { result } = renderHook(() => useScrollTargetHeight(y => y > 100));
      expect(result.current).toBe(true);
    });

    it('마운트 시 target 함수가 false를 반환하면 false 반환', () => {
      // scrollY=0, 0 > 100 = false
      const { result } = renderHook(() => useScrollTargetHeight(y => y > 100));
      expect(result.current).toBe(false);
    });

    it('스크롤 이벤트 후 target 함수 결과에 따라 상태 갱신', () => {
      const { result } = renderHook(() => useScrollTargetHeight(y => y > 100));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 200, writable: true, configurable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('unmount 시 scroll 이벤트 리스너 제거됨', () => {
      const spy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = renderHook(() => useScrollTargetHeight(100));
      unmount();
      expect(spy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });
  });
});
