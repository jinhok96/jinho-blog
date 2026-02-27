import React from 'react';
import { renderToString } from 'react-dom/server';

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

  it('서버 환경에서 false 반환 (SSR 시뮬레이션)', () => {
    // renderToString은 서버 렌더링 경로를 거치므로 useSyncExternalStore의
    // 세 번째 인자(서버 스냅샷: () => false)가 호출됨
    function TestComponent() {
      const isMounted = useIsMounted();
      return React.createElement('span', null, String(isMounted));
    }
    const html = renderToString(React.createElement(TestComponent));
    expect(html).toContain('false');
  });
});
