import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useBodyScrollLock } from './useBodyScrollLock';

beforeEach(() => {
  // jsdom은 스크롤 불가 → scrollHeight > clientHeight 조건 충족을 위해 모킹
  Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 2000 });
  Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: 800 });
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

afterEach(() => {
  // body 스타일 초기화
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.overflowY = '';
  document.body.style.paddingRight = '';
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// useBodyScrollLock
// ---------------------------------------------------------------------------
describe('useBodyScrollLock', () => {
  it('isLocked=true이면 body에 position:fixed 적용', () => {
    renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.position).toBe('fixed');
  });

  it('isLocked=true이면 body에 overflow-y:hidden 적용', () => {
    renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.overflowY).toBe('hidden');
  });

  it('isLocked=false이면 body 스타일 변경 없음', () => {
    renderHook(() => useBodyScrollLock(false));
    expect(document.body.style.position).toBe('');
    expect(document.body.style.overflowY).toBe('');
  });

  it('unmount 시 스크롤 잠금 해제 (position 초기화)', () => {
    const { unmount } = renderHook(() => useBodyScrollLock(true));
    unmount();
    expect(document.body.style.position).toBe('');
    expect(document.body.style.overflowY).toBe('');
  });

  it('unmount 시 window.scrollTo 호출로 스크롤 위치 복구', () => {
    const { unmount } = renderHook(() => useBodyScrollLock(true));
    unmount();
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('스크롤 없을 때 (scrollHeight <= clientHeight) 잠금 미적용', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 800 });
    Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: 800 });
    renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.position).toBe('');
  });
});
