import type { PropsWithChildren } from 'react';

import { act, renderHook } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { createSharedState } from './createSharedState';

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// 테스트용 상태/액션 정의
// ---------------------------------------------------------------------------
type CountState = { count: number };
type CountActions = { increment: () => void; decrement: () => void; reset: () => void };

const { Provider, useSharedState, useSharedActions } = createSharedState<CountState, CountActions>(
  { count: 0 },
  set => ({
    increment: () => set(prev => ({ count: prev.count + 1 })),
    decrement: () => set(prev => ({ count: prev.count - 1 })),
    reset: () => set({ count: 0 }),
  }),
);

function wrapper({ children }: PropsWithChildren) {
  return <Provider>{children}</Provider>;
}

// ---------------------------------------------------------------------------
// useSharedState
// ---------------------------------------------------------------------------
describe('useSharedState', () => {
  it('초기 상태 반환', () => {
    const { result } = renderHook(() => useSharedState(), { wrapper });
    expect(result.current.count).toBe(0);
  });

  it('initState로 초기값 오버라이드', () => {
    const customWrapper = ({ children }: PropsWithChildren) => (
      <Provider initState={{ count: 10 }}>{children}</Provider>
    );
    const { result } = renderHook(() => useSharedState(), { wrapper: customWrapper });
    expect(result.current.count).toBe(10);
  });

  it('Provider 없이 사용 시 에러 throw', () => {
    expect(() => renderHook(() => useSharedState())).toThrow('Provider 안에서 사용되어야 합니다.');
  });
});

// ---------------------------------------------------------------------------
// useSharedActions
// ---------------------------------------------------------------------------
describe('useSharedActions', () => {
  it('increment 호출 시 count 증가', () => {
    const { result } = renderHook(() => ({ state: useSharedState(), actions: useSharedActions() }), { wrapper });
    act(() => {
      result.current.actions.increment();
    });
    expect(result.current.state.count).toBe(1);
  });

  it('decrement 호출 시 count 감소', () => {
    const { result } = renderHook(() => ({ state: useSharedState(), actions: useSharedActions() }), { wrapper });
    act(() => {
      result.current.actions.decrement();
    });
    expect(result.current.state.count).toBe(-1);
  });

  it('reset 호출 시 count 초기화', () => {
    const { result } = renderHook(() => ({ state: useSharedState(), actions: useSharedActions() }), { wrapper });
    act(() => {
      result.current.actions.increment();
      result.current.actions.increment();
    });
    act(() => {
      result.current.actions.reset();
    });
    expect(result.current.state.count).toBe(0);
  });

  it('Provider 없이 사용 시 에러 throw', () => {
    expect(() => renderHook(() => useSharedActions())).toThrow('Provider 안에서 사용되어야 합니다.');
  });

  it('actions 참조가 state 변경 시에도 안정적 (useMemo)', () => {
    const renders: CountActions[] = [];
    const { result } = renderHook(
      () => {
        const actions = useSharedActions();
        renders.push(actions);
        return actions;
      },
      { wrapper },
    );
    act(() => {
      result.current.increment();
    });
    // 리렌더링이 발생해도 actions 참조가 동일해야 함
    expect(renders[0]).toBe(renders[renders.length - 1]);
  });
});
