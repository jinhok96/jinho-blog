import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { usePressable } from './usePressable';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1_000_000);
});

afterEach(() => {
  vi.useRealTimers();
});

// ---------------------------------------------------------------------------
// usePressable
// ---------------------------------------------------------------------------
describe('usePressable', () => {
  it('초기 isPressed는 false', () => {
    const { result } = renderHook(() => usePressable());
    expect(result.current.isPressed).toBe(false);
  });

  it('start() 호출 시 isPressed가 true', () => {
    const { result } = renderHook(() => usePressable());
    act(() => {
      result.current.start();
    });
    expect(result.current.isPressed).toBe(true);
  });

  it('delay 이상 경과 후 end() 호출 시 즉시 false', () => {
    const { result } = renderHook(() => usePressable(100));
    act(() => {
      result.current.start();
    });
    act(() => {
      vi.advanceTimersByTime(100); // delay 충족
    });
    act(() => {
      result.current.end();
    });
    expect(result.current.isPressed).toBe(false);
  });

  it('delay 미만 경과 후 end() 호출 시 남은 시간 후 false로 전환', () => {
    const { result } = renderHook(() => usePressable(200));
    act(() => {
      result.current.start();
    });
    act(() => {
      vi.advanceTimersByTime(50); // 50ms 경과 (150ms 남음)
    });
    act(() => {
      result.current.end();
    });
    // 아직 pressed 상태
    expect(result.current.isPressed).toBe(true);
    // 남은 150ms 경과 후 해제
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current.isPressed).toBe(false);
  });

  it('기본 delay(100ms) 미만 경과 시 timeout 대기', () => {
    const { result } = renderHook(() => usePressable());
    act(() => {
      result.current.start();
    });
    act(() => {
      vi.advanceTimersByTime(10); // 90ms 남음
    });
    act(() => {
      result.current.end();
    });
    expect(result.current.isPressed).toBe(true);
    act(() => {
      vi.advanceTimersByTime(90);
    });
    expect(result.current.isPressed).toBe(false);
  });

  it('end() 직후(0ms) 경과 시 전체 delay 대기', () => {
    const { result } = renderHook(() => usePressable(100));
    act(() => {
      result.current.start();
      result.current.end(); // 즉시 end
    });
    expect(result.current.isPressed).toBe(true);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.isPressed).toBe(false);
  });
});
