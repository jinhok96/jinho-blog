import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useUnmountEffect } from './useUnmountEffect';

// ---------------------------------------------------------------------------
// useUnmountEffect
// ---------------------------------------------------------------------------
describe('useUnmountEffect', () => {
  it('마운트 중에는 callback 호출 안 됨', () => {
    const callback = vi.fn();
    renderHook(() => useUnmountEffect(callback));
    expect(callback).not.toHaveBeenCalled();
  });

  it('unmount 시 callback 호출됨', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useUnmountEffect(callback));
    unmount();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('rerender 시 callback 호출 안 됨', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(() => useUnmountEffect(callback));
    rerender();
    expect(callback).not.toHaveBeenCalled();
  });
});
