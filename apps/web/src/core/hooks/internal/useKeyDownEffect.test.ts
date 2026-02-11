import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useKeyDownEffect } from './useKeyDownEffect';

// ---------------------------------------------------------------------------
// useKeyDownEffect
// ---------------------------------------------------------------------------
describe('useKeyDownEffect', () => {
  it('등록된 키 입력 시 콜백 호출', () => {
    const callback = vi.fn();
    renderHook(() => useKeyDownEffect(['Escape'], callback));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(callback).toHaveBeenCalledOnce();
  });

  it('미등록 키 입력 시 콜백 미호출', () => {
    const callback = vi.fn();
    renderHook(() => useKeyDownEffect(['Escape'], callback));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(callback).not.toHaveBeenCalled();
  });

  it('여러 키 등록 시 해당 키들 모두 처리', () => {
    const callback = vi.fn();
    renderHook(() => useKeyDownEffect(['ArrowUp', 'ArrowDown'], callback));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('콜백에 KeyboardEvent 전달', () => {
    const callback = vi.fn();
    renderHook(() => useKeyDownEffect(['Enter'], callback));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ key: 'Enter' }));
  });

  it('unmount 시 이벤트 리스너 제거', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useKeyDownEffect(['Escape'], callback));
    unmount();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(callback).not.toHaveBeenCalled();
  });

  it('콜백 레퍼런스 변경 후에도 최신 콜백 호출', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    let currentCallback = callback1;
    const { rerender } = renderHook(() => useKeyDownEffect(['Space'], currentCallback));
    currentCallback = callback2;
    rerender();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space' }));
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledOnce();
  });
});
