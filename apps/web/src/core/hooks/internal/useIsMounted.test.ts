import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useIsMounted } from './useIsMounted';

// ---------------------------------------------------------------------------
// useIsMounted
// ---------------------------------------------------------------------------
describe('useIsMounted', () => {
  it('클라이언트 환경에서 true 반환', () => {
    // useSyncExternalStore의 클라이언트 스냅샷 (() => true)이 사용됨
    const { result } = renderHook(() => useIsMounted());
    expect(result.current).toBe(true);
  });

  it('rerender 후에도 true 유지', () => {
    const { result, rerender } = renderHook(() => useIsMounted());
    rerender();
    expect(result.current).toBe(true);
  });

  it('unmount 후 마지막 렌더 값은 true', () => {
    // useSyncExternalStore는 subscribe가 no-op이므로 구독 해제 시 별도 상태 변화 없음
    const { result, unmount } = renderHook(() => useIsMounted());
    expect(result.current).toBe(true);
    unmount();
  });
});
