import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useLayoutMountEffect } from './useLayoutMountEffect';

// ---------------------------------------------------------------------------
// useLayoutMountEffect
// ---------------------------------------------------------------------------
describe('useLayoutMountEffect', () => {
  it('마운트 시 callback 1회 호출됨', () => {
    // useLayoutEffect는 DOM 업데이트 직후 동기적으로 실행됨
    const callback = vi.fn();
    renderHook(() => useLayoutMountEffect(callback));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('rerender 시 callback 재호출 없음', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(() => useLayoutMountEffect(callback));
    rerender();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('unmount 후 callback 추가 호출 없음', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useLayoutMountEffect(callback));
    unmount();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
