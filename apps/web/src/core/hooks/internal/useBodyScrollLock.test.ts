import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useBodyScrollLock } from './useBodyScrollLock';

beforeEach(() => {
  // jsdom은 스크롤 불가 → scrollHeight > clientHeight 조건 충족을 위해 모킹
  Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 2000 });
  Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: 800 });
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 300 });
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 1007 });
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

afterEach(() => {
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
  it('lock() 호출 시 body에 position:fixed 적용', () => {
    const { result } = renderHook(() => useBodyScrollLock());
    act(() => {
      result.current.lock();
    });
    expect(document.body.style.position).toBe('fixed');
  });

  it('lock() 호출 시 body에 overflow-y:hidden 적용', () => {
    const { result } = renderHook(() => useBodyScrollLock());
    act(() => {
      result.current.lock();
    });
    expect(document.body.style.overflowY).toBe('hidden');
  });

  it('lock() 호출 시 scrollY 위치를 body top에 반영', () => {
    const { result } = renderHook(() => useBodyScrollLock());
    act(() => {
      result.current.lock();
    });
    expect(document.body.style.top).toBe('-300px');
  });

  it('unlock() 호출 시 body 스타일 초기화', () => {
    const { result } = renderHook(() => useBodyScrollLock());
    act(() => {
      result.current.lock();
    });
    act(() => {
      result.current.unlock();
    });
    expect(document.body.style.position).toBe('');
    expect(document.body.style.top).toBe('');
    expect(document.body.style.overflowY).toBe('');
    expect(document.body.style.paddingRight).toBe('');
  });

  it('unlock() 호출 시 window.scrollTo로 스크롤 위치 복구', () => {
    const { result } = renderHook(() => useBodyScrollLock());
    act(() => {
      result.current.lock();
    });
    act(() => {
      result.current.unlock();
    });
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 300, behavior: 'instant' });
  });

  it('스크롤 없을 때 (scrollHeight <= clientHeight) lock() 미적용', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 800 });
    Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: 800 });
    const { result } = renderHook(() => useBodyScrollLock());
    act(() => {
      result.current.lock();
    });
    expect(document.body.style.position).toBe('');
  });

  it('이미 잠긴 상태에서 lock() 중복 호출 시 무시', () => {
    const { result } = renderHook(() => useBodyScrollLock());
    act(() => {
      result.current.lock();
    });
    // scrollY 변경 후 재호출해도 top은 첫 번째 lock 값 유지
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 999 });
    act(() => {
      result.current.lock();
    });
    expect(document.body.style.top).toBe('-300px');
  });

  it('잠기지 않은 상태에서 unlock() 호출 시 아무 동작 없음', () => {
    const { result } = renderHook(() => useBodyScrollLock());
    act(() => {
      result.current.unlock();
    });
    expect(document.body.style.position).toBe('');
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('잠긴 상태에서 언마운트 시 body 스타일 초기화', () => {
    const { result, unmount } = renderHook(() => useBodyScrollLock());
    act(() => {
      result.current.lock();
    });
    unmount();
    expect(document.body.style.position).toBe('');
    expect(document.body.style.overflowY).toBe('');
  });

  it('잠긴 상태에서 언마운트 시 window.scrollTo로 스크롤 위치 복구', () => {
    const { result, unmount } = renderHook(() => useBodyScrollLock());
    act(() => {
      result.current.lock();
    });
    unmount();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 300, behavior: 'instant' });
  });
});
