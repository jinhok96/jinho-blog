import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useTimeoutEffect } from './useTimeoutEffect';

// ---------------------------------------------------------------------------
// useTimeoutEffect
// ---------------------------------------------------------------------------
describe('useTimeoutEffect', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('delay 경과 후 callback 호출됨', () => {
    const callback = vi.fn();
    renderHook(() => useTimeoutEffect(callback, 500));
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('delay 미경과 시 callback 미호출', () => {
    const callback = vi.fn();
    renderHook(() => useTimeoutEffect(callback, 1000));
    vi.advanceTimersByTime(999);
    expect(callback).not.toHaveBeenCalled();
  });

  it('unmount 시 타이머 정리 (callback 미호출)', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useTimeoutEffect(callback, 500));
    unmount();
    vi.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
  });

  it('deps 변경 시 타이머 재설정 후 callback 재호출', () => {
    const callback = vi.fn();
    let dep = 0;
    const { rerender } = renderHook(() => useTimeoutEffect(callback, 300, [dep]));

    vi.advanceTimersByTime(200);
    expect(callback).not.toHaveBeenCalled();

    dep = 1;
    rerender();

    vi.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
