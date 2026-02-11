import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useTimeoutRef } from './useTimeoutRef';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ---------------------------------------------------------------------------
// useTimeoutRef
// ---------------------------------------------------------------------------
describe('useTimeoutRef', () => {
  it('delay 경과 후 callback 호출', () => {
    const { result } = renderHook(() => useTimeoutRef());
    const callback = vi.fn();
    result.current.set(callback, 500);
    vi.advanceTimersByTime(499);
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledOnce();
  });

  it('clear 호출 시 callback 취소', () => {
    const { result } = renderHook(() => useTimeoutRef());
    const callback = vi.fn();
    result.current.set(callback, 500);
    result.current.clear();
    vi.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('set 재호출 시 이전 타이머 교체', () => {
    const { result } = renderHook(() => useTimeoutRef());
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    result.current.set(callback1, 500);
    vi.advanceTimersByTime(300);
    result.current.set(callback2, 500); // 기존 타이머 교체
    vi.advanceTimersByTime(500);
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledOnce();
  });

  it('타이머 없을 때 clear 호출해도 에러 없음', () => {
    const { result } = renderHook(() => useTimeoutRef());
    expect(() => result.current.clear()).not.toThrow();
  });

  it('unmount 시 진행 중인 타이머 자동 정리', () => {
    const { result, unmount } = renderHook(() => useTimeoutRef());
    const callback = vi.fn();
    result.current.set(callback, 500);
    unmount();
    vi.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();
  });
});
