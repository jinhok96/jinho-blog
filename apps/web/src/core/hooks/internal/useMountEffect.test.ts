import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useMountEffect } from './useMountEffect';

// ---------------------------------------------------------------------------
// useMountEffect
// ---------------------------------------------------------------------------
describe('useMountEffect', () => {
  it('마운트 시 callback 1회 호출됨', () => {
    const callback = vi.fn();
    renderHook(() => useMountEffect(callback));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('rerender 시 callback 재호출 없음', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(() => useMountEffect(callback));
    rerender();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('unmount 후 callback 추가 호출 없음', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useMountEffect(callback));
    unmount();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
