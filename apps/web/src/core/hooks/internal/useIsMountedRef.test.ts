import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useIsMountedRef } from './useIsMountedRef';

// ---------------------------------------------------------------------------
// useIsMountedRef
// ---------------------------------------------------------------------------
describe('useIsMountedRef', () => {
  it('마운트 후 ref.current가 true', () => {
    // useEffect가 실행된 후 isMountedRef.current = true
    const { result } = renderHook(() => useIsMountedRef());
    expect(result.current.current).toBe(true);
  });

  it('rerender 후에도 ref.current가 true 유지', () => {
    const { result, rerender } = renderHook(() => useIsMountedRef());
    rerender();
    expect(result.current.current).toBe(true);
  });

  it('unmount 후 ref.current가 false', () => {
    // useEffect cleanup에서 isMountedRef.current = false
    const { result, unmount } = renderHook(() => useIsMountedRef());
    expect(result.current.current).toBe(true);
    unmount();
    expect(result.current.current).toBe(false);
  });

  it('항상 동일한 ref 객체 반환', () => {
    // useRef는 동일 참조를 유지
    const { result, rerender } = renderHook(() => useIsMountedRef());
    const refBefore = result.current;
    rerender();
    expect(result.current).toBe(refBefore);
  });
});
