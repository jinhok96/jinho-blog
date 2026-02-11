import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useQueryParams } from './useQueryParams';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/blog'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

import { usePathname, useSearchParams } from 'next/navigation';

const mockUsePathname = vi.mocked(usePathname);
const mockUseSearchParams = vi.mocked(useSearchParams);

beforeEach(() => {
  mockUsePathname.mockReturnValue('/blog');
  mockUseSearchParams.mockReturnValue(new URLSearchParams() as ReturnType<typeof useSearchParams>);
});

// ---------------------------------------------------------------------------
// set + toHref
// ---------------------------------------------------------------------------
describe('set + toHref', () => {
  it('단일 파라미터 set 후 toHref', () => {
    const { result } = renderHook(() => useQueryParams<{ page: string }>());
    expect(result.current.set('page', '2').toHref()).toBe('/blog?page=2');
  });

  it('복수 파라미터 set 후 toHref (알파벳 순 정렬)', () => {
    const { result } = renderHook(() => useQueryParams<{ page: string; category: string }>());
    expect(result.current.set('page', '2').set('category', 'frontend').toHref()).toBe('/blog?category=frontend&page=2');
  });

  it('배열 값 set', () => {
    const { result } = renderHook(() => useQueryParams<{ tag: string[] }>());
    result.current.set('tag', ['a', 'b']);
    expect(result.current.getAll('tag')).toEqual(['a', 'b']);
  });

  it('기존 파라미터가 있을 때 set으로 덮어씀', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('page=1') as ReturnType<typeof useSearchParams>);
    const { result } = renderHook(() => useQueryParams<{ page: string }>());
    expect(result.current.set('page', '3').toHref()).toBe('/blog?page=3');
  });

  it('파라미터 없으면 toHref는 pathname만 반환', () => {
    const { result } = renderHook(() => useQueryParams());
    expect(result.current.toHref()).toBe('/blog');
  });

  it('커스텀 pathname 전달 시 해당 경로 사용', () => {
    const { result } = renderHook(() => useQueryParams<{ page: string }>());
    expect(result.current.set('page', '1').toHref('/projects')).toBe('/projects?page=1');
  });
});

// ---------------------------------------------------------------------------
// remove
// ---------------------------------------------------------------------------
describe('remove', () => {
  it('단일 키 제거 후 toHref', () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams('page=2&category=frontend') as ReturnType<typeof useSearchParams>,
    );
    const { result } = renderHook(() => useQueryParams<{ page: string; category: string }>());
    expect(result.current.remove('page').toHref()).toBe('/blog?category=frontend');
  });

  it('복수 키 배열로 제거', () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams('page=2&category=frontend&sort=desc') as ReturnType<typeof useSearchParams>,
    );
    const { result } = renderHook(() => useQueryParams<{ page: string; category: string; sort: string }>());
    expect(result.current.remove(['page', 'category']).toHref()).toBe('/blog?sort=desc');
  });

  it('모든 파라미터 제거 시 pathname만 반환', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('page=1') as ReturnType<typeof useSearchParams>);
    const { result } = renderHook(() => useQueryParams<{ page: string }>());
    expect(result.current.remove('page').toHref()).toBe('/blog');
  });
});

// ---------------------------------------------------------------------------
// get / getAll
// ---------------------------------------------------------------------------
describe('get / getAll', () => {
  it('존재하는 키의 값을 get', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('page=5') as ReturnType<typeof useSearchParams>);
    const { result } = renderHook(() => useQueryParams<{ page: string }>());
    expect(result.current.get('page')).toBe('5');
  });

  it('존재하지 않는 키는 null 반환', () => {
    const { result } = renderHook(() => useQueryParams<{ page: string }>());
    expect(result.current.get('page')).toBeNull();
  });

  it('복수 값을 getAll로 모두 가져옴', () => {
    const { result } = renderHook(() => useQueryParams<{ tag: string[] }>());
    result.current.set('tag', ['react', 'typescript']);
    expect(result.current.getAll('tag')).toEqual(['react', 'typescript']);
  });
});

// ---------------------------------------------------------------------------
// toString (알파벳 순 정렬)
// ---------------------------------------------------------------------------
describe('toString', () => {
  it('파라미터를 알파벳 순으로 정렬하여 문자열 반환', () => {
    const { result } = renderHook(() => useQueryParams<{ page: string; category: string }>());
    result.current.set('page', '1').set('category', 'frontend');
    expect(result.current.toString()).toBe('category=frontend&page=1');
  });

  it('파라미터 없으면 빈 문자열 반환', () => {
    const { result } = renderHook(() => useQueryParams());
    expect(result.current.toString()).toBe('');
  });
});

// ---------------------------------------------------------------------------
// 체이닝
// ---------------------------------------------------------------------------
describe('체이닝', () => {
  it('set → remove → toHref 체이닝', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('sort=desc') as ReturnType<typeof useSearchParams>);
    const { result } = renderHook(() => useQueryParams<{ sort: string; page: string }>());
    expect(result.current.set('page', '2').remove('sort').toHref()).toBe('/blog?page=2');
  });
});
