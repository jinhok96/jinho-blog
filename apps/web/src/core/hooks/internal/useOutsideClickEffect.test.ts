import { createRef } from 'react';

import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useOutsideClickEffect } from './useOutsideClickEffect';

afterEach(() => {
  document.body.innerHTML = '';
});

// ---------------------------------------------------------------------------
// useOutsideClickEffect
// ---------------------------------------------------------------------------
describe('useOutsideClickEffect', () => {
  it('ref가 null일 때 document 클릭 시 콜백 호출 (외부 클릭)', () => {
    const callback = vi.fn();
    const ref = createRef<HTMLDivElement>(); // current = null
    renderHook(() => useOutsideClickEffect(callback, [ref]));
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(callback).toHaveBeenCalledOnce();
  });

  it('ref 내부 엘리먼트 클릭 시 콜백 미호출', () => {
    const callback = vi.fn();
    const div = document.createElement('div');
    document.body.appendChild(div);
    const ref = { current: div };
    renderHook(() => useOutsideClickEffect(callback, [ref]));
    div.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
  });

  it('ref 자식 엘리먼트 클릭 시 콜백 미호출', () => {
    const callback = vi.fn();
    const div = document.createElement('div');
    const child = document.createElement('button');
    div.appendChild(child);
    document.body.appendChild(div);
    const ref = { current: div };
    renderHook(() => useOutsideClickEffect(callback, [ref]));
    child.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
  });

  it('복수 ref 중 하나라도 내부면 콜백 미호출', () => {
    const callback = vi.fn();
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    document.body.appendChild(div1);
    document.body.appendChild(div2);
    const ref1 = { current: div1 };
    const ref2 = { current: div2 };
    renderHook(() => useOutsideClickEffect(callback, [ref1, ref2]));
    div2.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
  });

  it('unmount 시 이벤트 리스너 제거', () => {
    const callback = vi.fn();
    const ref = createRef<HTMLDivElement>();
    const { unmount } = renderHook(() => useOutsideClickEffect(callback, [ref]));
    unmount();
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
  });
});
