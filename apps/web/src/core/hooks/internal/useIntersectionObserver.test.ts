import React from 'react';

import { act, render, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useIntersectionObserver } from './useIntersectionObserver';

type IntersectionCallback = (entries: IntersectionObserverEntry[]) => void;

let capturedCallback: IntersectionCallback | null = null;
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  capturedCallback = null;
  mockObserve.mockClear();
  mockDisconnect.mockClear();

  // arrow function은 constructor가 아니므로 class로 모킹
  const observe = mockObserve;
  const disconnect = mockDisconnect;
  class MockIntersectionObserver {
    constructor(callback: IntersectionCallback) {
      capturedCallback = callback;
    }
    observe = observe;
    disconnect = disconnect;
  }
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

function makeEntry(isIntersecting: boolean): IntersectionObserverEntry {
  return { isIntersecting } as IntersectionObserverEntry;
}

// ref를 실제 DOM 엘리먼트에 연결하는 테스트용 컴포넌트
function createTestComponent(options?: Parameters<typeof useIntersectionObserver>[0]) {
  return function TestComponent() {
    const [ref, isIntersecting] = useIntersectionObserver(options);
    return React.createElement('div', {
      ref,
      'data-testid': 'target',
      'data-intersecting': String(isIntersecting),
    });
  };
}

// ---------------------------------------------------------------------------
// useIntersectionObserver
// ---------------------------------------------------------------------------
describe('useIntersectionObserver', () => {
  it('초기 isIntersecting은 false', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    expect(result.current[1]).toBe(false);
  });

  it('initValue=true이면 초기 isIntersecting이 true', () => {
    const { result } = renderHook(() => useIntersectionObserver({ initValue: true }));
    expect(result.current[1]).toBe(true);
  });

  it('ref를 엘리먼트에 연결 후 observe 호출', () => {
    const TestComponent = createTestComponent();
    render(React.createElement(TestComponent));
    expect(mockObserve).toHaveBeenCalledOnce();
  });

  it('intersection 발생 시 isIntersecting이 true로 변경', () => {
    const TestComponent = createTestComponent();
    const { getByTestId } = render(React.createElement(TestComponent));
    act(() => {
      capturedCallback?.([makeEntry(true)]);
    });
    expect(getByTestId('target').dataset.intersecting).toBe('true');
  });

  it('intersection 해제 시 isIntersecting이 false로 변경', () => {
    const TestComponent = createTestComponent();
    const { getByTestId } = render(React.createElement(TestComponent));
    act(() => {
      capturedCallback?.([makeEntry(true)]);
    });
    act(() => {
      capturedCallback?.([makeEntry(false)]);
    });
    expect(getByTestId('target').dataset.intersecting).toBe('false');
  });

  it('unmount 시 disconnect 호출', () => {
    const TestComponent = createTestComponent();
    const { unmount } = render(React.createElement(TestComponent));
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('onlyOnce=true이면 첫 intersection 후 observer 재등록 없음', () => {
    const TestComponent = createTestComponent({ onlyOnce: true });
    render(React.createElement(TestComponent));
    const observeCallsBefore = mockObserve.mock.calls.length;
    act(() => {
      capturedCallback?.([makeEntry(true)]);
    });
    // isIntersecting=true 후 effect 재실행되지만 onlyOnce이므로 observe 재호출 안됨
    expect(mockObserve.mock.calls.length).toBe(observeCallsBefore);
    // cleanup으로 disconnect는 호출됨
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
