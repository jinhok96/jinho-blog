import { act, renderHook } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { useThrowError } from './useThrowError';

beforeAll(() => {
  // React 에러 바운더리 처리 시 console.error 출력 억제
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// useThrowError
// ---------------------------------------------------------------------------
describe('useThrowError', () => {
  it('초기 상태에서 setError 함수를 반환함', () => {
    const { result } = renderHook(() => useThrowError());
    expect(result.current).toBeTypeOf('function');
  });

  it('setError 호출 시 에러를 throw함', () => {
    const { result } = renderHook(() => useThrowError());
    const error = new Error('test error');

    // setError(error) → re-render 시 if (error) throw error 실행 → act() 자체가 throw됨
    expect(() => {
      act(() => {
        result.current(error);
      });
    }).toThrow('test error');
  });
});
