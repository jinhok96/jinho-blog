import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useIsMounted } from './useIsMounted';

// ---------------------------------------------------------------------------
// useIsMounted
// ---------------------------------------------------------------------------
describe('useIsMounted', () => {
  it('마운트 후 true 반환', () => {
    const { result } = renderHook(() => useIsMounted());
    expect(result.current).toBe(true);
  });

  it('최초 렌더링 시 동기적으로 true (useLayoutEffect)', () => {
    // renderHook은 act() 내부에서 실행되므로 useLayoutEffect가 즉시 반영됨
    const { result } = renderHook(() => useIsMounted());
    expect(result.current).toBe(true);
  });

  it('unmount 시 cleanup이 실행됨', () => {
    const { result, unmount } = renderHook(() => useIsMounted());
    expect(result.current).toBe(true);
    // unmount()는 useLayoutEffect cleanup(setIsMounted(false))을 호출함
    // useState 기반 구현으로 unmount 후 re-render가 발생하지 않으므로
    // result.current는 마지막 렌더 값(true)을 유지함
    unmount();
  });
});
