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
});
