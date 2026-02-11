import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useStopwatch } from './useStopwatch';

beforeEach(() => {
  vi.useFakeTimers();
  // Date.now() = 0이면 !startTimeRef.current(= !0)이 true가 되어 get()이 0을 반환
  // epoch처럼 0이 아닌 시간으로 시작
  vi.setSystemTime(1_000_000);
});

afterEach(() => {
  vi.useRealTimers();
});

// ---------------------------------------------------------------------------
// useStopwatch
// ---------------------------------------------------------------------------
describe('useStopwatch', () => {
  it('start 전 get()은 0 반환', () => {
    const { result } = renderHook(() => useStopwatch());
    expect(result.current.get()).toBe(0);
  });

  it('start 후 경과 시간 반환', () => {
    const { result } = renderHook(() => useStopwatch());
    result.current.start();
    vi.advanceTimersByTime(500);
    expect(result.current.get()).toBe(500);
  });

  it('pause 후 시간이 멈춤', () => {
    const { result } = renderHook(() => useStopwatch());
    result.current.start();
    vi.advanceTimersByTime(300);
    result.current.pause();
    vi.advanceTimersByTime(700);
    expect(result.current.get()).toBe(300);
  });

  it('resume 후 시간 재개', () => {
    const { result } = renderHook(() => useStopwatch());
    result.current.start();
    vi.advanceTimersByTime(300);
    result.current.pause(); // 300ms에 정지
    vi.advanceTimersByTime(400); // 400ms 일시정지 (무시됨)
    result.current.resume();
    vi.advanceTimersByTime(200); // 200ms 추가 경과
    expect(result.current.get()).toBe(500); // 300 + 200
  });

  it('reset 후 get()은 0 반환', () => {
    const { result } = renderHook(() => useStopwatch());
    result.current.start();
    vi.advanceTimersByTime(500);
    result.current.reset();
    expect(result.current.get()).toBe(0);
  });

  it('start 전 pause 호출은 무시됨', () => {
    const { result } = renderHook(() => useStopwatch());
    result.current.pause();
    expect(result.current.get()).toBe(0);
  });

  it('이미 pause 상태에서 pause 재호출해도 기존 정지 시간 유지', () => {
    const { result } = renderHook(() => useStopwatch());
    result.current.start();
    vi.advanceTimersByTime(200);
    result.current.pause();
    vi.advanceTimersByTime(300);
    result.current.pause(); // 이미 pause 상태 → 무시
    vi.advanceTimersByTime(300);
    expect(result.current.get()).toBe(200);
  });

  it('pause 없이 resume 호출해도 영향 없음', () => {
    const { result } = renderHook(() => useStopwatch());
    result.current.start();
    vi.advanceTimersByTime(300);
    result.current.resume(); // pause 상태 아님 → 무시
    vi.advanceTimersByTime(300);
    expect(result.current.get()).toBe(600);
  });

  it('pause 중인 상태에서 get() 호출 시 일시정지 시간 제외', () => {
    const { result } = renderHook(() => useStopwatch());
    result.current.start();
    vi.advanceTimersByTime(200);
    result.current.pause();
    vi.advanceTimersByTime(1000); // 일시정지 중 1000ms 경과
    // pause 중이므로 현재 일시정지 시간도 포함해 반영
    expect(result.current.get()).toBe(200);
  });

  it('start 재호출 시 이전 상태 초기화 후 재시작', () => {
    const { result } = renderHook(() => useStopwatch());
    result.current.start();
    vi.advanceTimersByTime(500);
    result.current.start(); // 재시작
    vi.advanceTimersByTime(100);
    expect(result.current.get()).toBe(100);
  });
});
