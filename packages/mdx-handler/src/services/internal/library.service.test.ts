import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../core/utils/index.js', async () => {
  const actual = await vi.importActual<typeof import('../../core/utils/index.js')>('../../core/utils/index.js');
  return {
    ...actual,
    getRegistry: vi.fn(),
  };
});

import type { Library } from './library.service.js';

import { getRegistry } from '../../core/utils/index.js';
import { getLibraries, getLibrary, getLibraryContent, getLibraryGroupsByCategory } from './library.service.js';

const mockGetRegistry = vi.mocked(getRegistry);

function makeLibrary(overrides: Partial<Library> & Pick<Library, 'slug' | 'title'>): Library {
  return {
    slug: overrides.slug,
    title: overrides.title,
    description: overrides.description ?? 'desc',
    category: overrides.category ?? 'react',
    tech: overrides.tech ?? [],
    createdAt: overrides.createdAt ?? '2024-01-01T00:00:00Z',
    updatedAt: overrides.updatedAt ?? '2024-01-01T00:00:00Z',
    filePath: overrides.filePath ?? `/libraries/${overrides.slug}.mdx`,
    path: overrides.path ?? `/libraries/${overrides.slug}`,
    content: overrides.content ?? `# ${overrides.title}`,
  };
}

const MOCK_LIBRARIES: Library[] = [
  makeLibrary({ slug: 'react-query', title: 'React Query', category: 'react', tech: ['react', 'typescript'] }),
  makeLibrary({ slug: 'next-auth', title: 'Next Auth', category: 'nextjs', tech: ['nextjs'] }),
  makeLibrary({ slug: 'swr-lib', title: 'SWR', category: 'swr', tech: ['react', 'swr'] }),
  makeLibrary({ slug: 'framer', title: 'Framer Motion', category: 'motion', tech: ['react'] }),
];

beforeAll(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

beforeEach(() => {
  vi.clearAllMocks();
  mockGetRegistry.mockReturnValue(MOCK_LIBRARIES);
});

afterAll(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// getLibraries
// ---------------------------------------------------------------------------
describe('getLibraries', () => {
  it('옵션 없이 전체 반환', async () => {
    const result = await getLibraries();
    expect(result.items).toHaveLength(4);
  });

  it('category 필터링', async () => {
    const result = await getLibraries({ category: 'react' });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].slug).toBe('react-query');
  });

  it('tech 필터링 (AND 조건)', async () => {
    const result = await getLibraries({ tech: 'react,typescript' });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].slug).toBe('react-query');
  });

  it('search 필터링 (title 기준)', async () => {
    const result = await getLibraries({ search: 'next' });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].slug).toBe('next-auth');
  });

  it('sort: alphabetic,asc 알파벳 오름차순', async () => {
    const result = await getLibraries({ sort: 'alphabetic,asc' });
    expect(result.items[0].title).toBe('Framer Motion');
  });

  it('pagination: count=2, page=2', async () => {
    const result = await getLibraries({ count: '2', page: '2' });
    expect(result.items).toHaveLength(2);
    expect(result.pagination.currentPage).toBe(2);
  });

  it('빈 registry', async () => {
    mockGetRegistry.mockReturnValue([]);
    const result = await getLibraries();
    expect(result.items).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// getLibraryGroupsByCategory
// ---------------------------------------------------------------------------
describe('getLibraryGroupsByCategory', () => {
  it('카테고리별로 그룹화', async () => {
    const result = await getLibraryGroupsByCategory();
    expect(Object.keys(result)).toEqual(expect.arrayContaining(['react', 'nextjs', 'swr', 'motion']));
    expect(result['react']).toHaveLength(1);
  });

  it('count 제한: 카테고리당 최대 count개', async () => {
    // react 카테고리에 2개 추가하여 3개로 만들기
    mockGetRegistry.mockReturnValue([
      ...MOCK_LIBRARIES,
      makeLibrary({ slug: 'react-router', title: 'React Router', category: 'react', tech: ['react'] }),
      makeLibrary({ slug: 'react-hook-form', title: 'React Hook Form', category: 'react', tech: ['react'] }),
    ]);

    const result = await getLibraryGroupsByCategory({ count: '2' });
    expect(result['react']).toHaveLength(2);
  });

  it('카테고리 내 알파벳순 정렬 (버그 수정 검증)', async () => {
    mockGetRegistry.mockReturnValue([
      makeLibrary({ slug: 'zustand-lib', title: 'Zustand', category: 'react' }),
      makeLibrary({ slug: 'react-query', title: 'React Query', category: 'react' }),
      makeLibrary({ slug: 'react-portal', title: 'Apollo Client', category: 'react' }),
    ]);

    const result = await getLibraryGroupsByCategory();
    expect(result['react'].map(l => l.title)).toEqual(['Apollo Client', 'React Query', 'Zustand']);
  });

  it('빈 registry: 빈 객체 반환', async () => {
    mockGetRegistry.mockReturnValue([]);
    const result = await getLibraryGroupsByCategory();
    expect(Object.keys(result)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// getLibrary
// ---------------------------------------------------------------------------
describe('getLibrary', () => {
  it('존재하는 slug: 해당 library 반환', async () => {
    const result = await getLibrary('react-query');
    expect(result?.slug).toBe('react-query');
  });

  it('존재하지 않는 slug: null 반환', async () => {
    const result = await getLibrary('nonexistent');
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// getLibraryContent
// ---------------------------------------------------------------------------
describe('getLibraryContent', () => {
  it('content 있는 slug: content 문자열 반환', async () => {
    const result = await getLibraryContent('react-query');
    expect(result).toBe('# React Query');
  });

  it('존재하지 않는 slug: null 반환', async () => {
    const result = await getLibraryContent('nonexistent');
    expect(result).toBeNull();
  });

  it('content 필드 없는 library: null 반환', async () => {
    const libWithoutContent = makeLibrary({ slug: 'no-content', title: 'No Content' });
    delete (libWithoutContent as Record<string, unknown>).content;
    mockGetRegistry.mockReturnValue([libWithoutContent]);

    const result = await getLibraryContent('no-content');
    expect(result).toBeNull();
  });
});
