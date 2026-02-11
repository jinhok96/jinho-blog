import type { BaseMetadata } from '@jinho-blog/shared';

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import {
  calculatePagination,
  filterByCategory,
  filterByTechStack,
  paginateContentWithMeta,
  searchContent,
  sortContent,
} from './content.js';

type Item = BaseMetadata & { [key: string]: unknown };
type ItemWithTech = Item & { tech: string[] };

function makeItem(overrides: Partial<Item> & Pick<Item, 'title'>): Item {
  return {
    title: overrides.title,
    description: overrides.description ?? 'desc',
    category: overrides.category ?? 'frontend',
    createdAt: overrides.createdAt ?? '2024-01-01T00:00:00Z',
    updatedAt: overrides.updatedAt ?? '2024-01-01T00:00:00Z',
  };
}

function makeItemWithTech(overrides: Partial<ItemWithTech> & Pick<ItemWithTech, 'title'>): ItemWithTech {
  return {
    title: overrides.title,
    description: overrides.description ?? 'desc',
    category: overrides.category ?? 'frontend',
    createdAt: overrides.createdAt ?? '2024-01-01T00:00:00Z',
    updatedAt: overrides.updatedAt ?? '2024-01-01T00:00:00Z',
    tech: overrides.tech ?? [],
  };
}

beforeAll(() => {
  // console.warn, console.error 비활성화
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// sortContent
// ---------------------------------------------------------------------------
describe('sortContent', () => {
  const items: Item[] = [
    makeItem({ title: 'B', createdAt: '2024-02-01T00:00:00Z', updatedAt: '2024-03-01T00:00:00Z' }),
    makeItem({ title: 'A', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-04-01T00:00:00Z' }),
    makeItem({ title: 'C', createdAt: '2024-03-01T00:00:00Z', updatedAt: '2024-02-01T00:00:00Z' }),
  ];

  it('createdAt,desc: 최신 생성순 정렬', () => {
    const result = sortContent(items, 'createdAt,desc');
    expect(result.map(i => i.title)).toEqual(['C', 'B', 'A']);
  });

  it('createdAt,asc: 오래된 생성순 정렬', () => {
    const result = sortContent(items, 'createdAt,asc');
    expect(result.map(i => i.title)).toEqual(['A', 'B', 'C']);
  });

  it('updatedAt,desc: 최신 수정순 정렬', () => {
    const result = sortContent(items, 'updatedAt,desc');
    expect(result.map(i => i.title)).toEqual(['A', 'B', 'C']);
  });

  it('updatedAt,asc: 오래된 수정순 정렬', () => {
    const result = sortContent(items, 'updatedAt,asc');
    expect(result.map(i => i.title)).toEqual(['C', 'B', 'A']);
  });

  it('alphabetic,asc: 알파벳 오름차순', () => {
    const result = sortContent(items, 'alphabetic,asc');
    expect(result.map(i => i.title)).toEqual(['A', 'B', 'C']);
  });

  it('alphabetic,desc: 알파벳 내림차순', () => {
    const result = sortContent(items, 'alphabetic,desc');
    expect(result.map(i => i.title)).toEqual(['C', 'B', 'A']);
  });

  it('잘못된 sort 값이면 빈 배열 반환', () => {
    expect(sortContent(items, 'invalid')).toEqual([]);
  });

  it('null이면 DEFAULT_SORT(createdAt,desc)로 처리', () => {
    const result = sortContent(items, null);
    expect(result.map(i => i.title)).toEqual(['C', 'B', 'A']);
  });

  it('원본 배열을 변경하지 않음', () => {
    const original = [...items];
    sortContent(items, 'alphabetic,asc');
    expect(items).toEqual(original);
  });
});

// ---------------------------------------------------------------------------
// filterByCategory
// ---------------------------------------------------------------------------
describe('filterByCategory', () => {
  const items = [
    makeItem({ title: 'A', category: 'frontend' }),
    makeItem({ title: 'B', category: 'algorithm' }),
    makeItem({ title: 'C', category: 'frontend' }),
  ];

  it('null이면 전체 반환', () => {
    expect(filterByCategory(items, null)).toEqual(items);
  });

  it('undefined이면 전체 반환', () => {
    expect(filterByCategory(items, undefined)).toEqual(items);
  });

  it('단일 카테고리 필터링', () => {
    const result = filterByCategory(items, 'frontend');
    expect(result.map(i => i.title)).toEqual(['A', 'C']);
  });

  it('콤마 구분 여러 카테고리 OR 조건', () => {
    const result = filterByCategory(items, 'frontend,algorithm');
    expect(result.map(i => i.title)).toEqual(['A', 'B', 'C']);
  });

  it('일치하는 항목 없으면 빈 배열', () => {
    expect(filterByCategory(items, 'cs')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// filterByTechStack
// ---------------------------------------------------------------------------
describe('filterByTechStack', () => {
  const items = [
    makeItemWithTech({ title: 'A', tech: ['react', 'typescript'] }),
    makeItemWithTech({ title: 'B', tech: ['react', 'nextjs'] }),
    makeItemWithTech({ title: 'C', tech: ['vue', 'typescript'] }),
  ];

  it('null이면 전체 반환', () => {
    expect(filterByTechStack(items, null)).toEqual(items);
  });

  it('단일 tech 필터링', () => {
    const result = filterByTechStack(items, 'react');
    expect(result.map(i => i.title)).toEqual(['A', 'B']);
  });

  it('여러 tech AND 조건: 모두 포함해야 통과', () => {
    const result = filterByTechStack(items, 'react,typescript');
    expect(result.map(i => i.title)).toEqual(['A']);
  });

  it('일치하는 항목 없으면 빈 배열', () => {
    expect(filterByTechStack(items, 'svelte')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// searchContent
// ---------------------------------------------------------------------------
describe('searchContent', () => {
  const items = [
    makeItemWithTech({ title: 'React 입문', description: 'hooks 기초', tech: ['react'] }),
    makeItemWithTech({ title: 'Next.js 배포', description: 'vercel 사용법', tech: ['nextjs', 'vercel'] }),
    makeItemWithTech({ title: 'TypeScript 심화', description: '타입 시스템 이해', tech: ['typescript'] }),
  ];

  it('null이면 전체 반환', () => {
    expect(searchContent(items, ['title'], null)).toEqual(items);
  });

  it('단일 키 단일 검색어', () => {
    const result = searchContent(items, ['title'], 'react');
    expect(result.map(i => i.title)).toEqual(['React 입문']);
  });

  it('검색어 대소문자 무시', () => {
    const result = searchContent(items, ['title'], 'REACT');
    expect(result.map(i => i.title)).toEqual(['React 입문']);
  });

  it('여러 키 중 하나에 포함되면 통과', () => {
    const result = searchContent(items, ['title', 'description'], 'vercel');
    expect(result.map(i => i.title)).toEqual(['Next.js 배포']);
  });

  it('배열 값 포함 검색', () => {
    const result = searchContent(items, ['tech'], 'nextjs');
    expect(result.map(i => i.title)).toEqual(['Next.js 배포']);
  });

  it('콤마 구분 여러 검색어 AND 조건', () => {
    const result = searchContent(items, ['title', 'description'], 'next,vercel');
    expect(result.map(i => i.title)).toEqual(['Next.js 배포']);
  });

  it('일치하는 항목 없으면 빈 배열', () => {
    expect(searchContent(items, ['title'], 'svelte')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// calculatePagination
// ---------------------------------------------------------------------------
describe('calculatePagination', () => {
  it('정상 케이스', () => {
    const result = calculatePagination(30, 2, 10);
    expect(result).toEqual({
      currentPage: 2,
      totalPages: 3,
      totalItems: 30,
      itemsPerPage: 10,
      hasNext: true,
      hasPrev: true,
      nextPage: 3,
      prevPage: 1,
    });
  });

  it('첫 페이지: hasPrev=false, prevPage=null', () => {
    const result = calculatePagination(30, 1, 10);
    expect(result.hasPrev).toBe(false);
    expect(result.prevPage).toBeNull();
    expect(result.hasNext).toBe(true);
    expect(result.nextPage).toBe(2);
  });

  it('마지막 페이지: hasNext=false, nextPage=null', () => {
    const result = calculatePagination(30, 3, 10);
    expect(result.hasNext).toBe(false);
    expect(result.nextPage).toBeNull();
  });

  it('totalItems=0: currentPage=1, totalPages=0', () => {
    const result = calculatePagination(0, 1, 10);
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(0);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(false);
  });

  it('page > totalPages: currentPage가 totalPages로 clamp', () => {
    const result = calculatePagination(10, 99, 10);
    expect(result.currentPage).toBe(1);
  });

  it('page < 1: currentPage=1로 clamp', () => {
    const result = calculatePagination(10, 0, 10);
    expect(result.currentPage).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// paginateContentWithMeta
// ---------------------------------------------------------------------------
describe('paginateContentWithMeta', () => {
  const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));

  it('1페이지 12개: 첫 12개 반환', () => {
    const result = paginateContentWithMeta(items, 1, 12);
    expect(result.items).toHaveLength(12);
    expect(result.items[0]).toEqual({ id: 1 });
  });

  it('3페이지: 나머지 1개 반환', () => {
    const result = paginateContentWithMeta(items, 3, 12);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual({ id: 25 });
  });

  it('pagination 메타 정확성', () => {
    const result = paginateContentWithMeta(items, 2, 12);
    expect(result.pagination.currentPage).toBe(2);
    expect(result.pagination.totalItems).toBe(25);
    expect(result.pagination.totalPages).toBe(3);
  });

  it('items=null이면 빈 배열로 방어 처리', () => {
    const result = paginateContentWithMeta([], 1, 12);
    expect(result.items).toHaveLength(0);
  });

  it('page=null이면 DEFAULT_PAGE(1) 사용', () => {
    const result = paginateContentWithMeta(items, null, 12);
    expect(result.pagination.currentPage).toBe(1);
  });

  it('count=null이면 DEFAULT_COUNT(12) 사용', () => {
    const result = paginateContentWithMeta(items, 1, null);
    expect(result.items).toHaveLength(12);
  });
});
