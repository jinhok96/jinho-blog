import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAnimatedValue } from './useAnimatedValue';

// vi.mock은 호이스팅되므로 외부 변수 참조 불가 → vi.hoisted() 사용
const { mockStop, mockAnimate } = vi.hoisted(() => {
  const mockStop = vi.fn();
  const mockAnimate = vi.fn(() => ({ stop: mockStop }));
  return { mockStop, mockAnimate };
});

vi.mock('motion/react', () => ({
  useMotionValue: vi.fn((initial: number) => {
    let _value = initial;
    return {
      get: () => _value,
      set: (v: number) => {
        _value = v;
      },
    };
  }),
  useTransform: vi.fn((fn: () => unknown) => ({ get: fn })),
  animate: mockAnimate,
}));

// ---------------------------------------------------------------------------
// useAnimatedValue
// ---------------------------------------------------------------------------
describe('useAnimatedValue', () => {
  beforeEach(() => {
    mockStop.mockClear();
    mockAnimate.mockClear();
  });

  it('MotionValue를 반환함 (get 메서드 존재)', () => {
    const { result } = renderHook(() => useAnimatedValue(42));
    expect(typeof result.current.get).toBe('function');
  });

  it('transformer 없으면 초기 value를 그대로 반환함', () => {
    const { result } = renderHook(() => useAnimatedValue(42));
    expect(result.current.get()).toBe(42);
  });

  it('transformer 있으면 초기 value에 transformer를 적용한 값을 반환함', () => {
    const transformer = (v: number) => `${v}px`;
    const { result } = renderHook(() => useAnimatedValue(50, { transformer }));
    expect(result.current.get()).toBe('50px');
  });

  it('마운트 시 animate() 호출됨', () => {
    renderHook(() => useAnimatedValue(10));
    expect(mockAnimate).toHaveBeenCalledTimes(1);
  });

  it('unmount 시 controls.stop() 호출됨', () => {
    const { unmount } = renderHook(() => useAnimatedValue(10));
    unmount();
    expect(mockStop).toHaveBeenCalledTimes(1);
  });
});
