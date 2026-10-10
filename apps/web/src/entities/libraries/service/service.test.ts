import type { Library } from '@/entities/libraries/types';
import type { TechStack } from '@jinho-blog/shared';

import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { contentReader } from '@/core/content';

import { createLibrariesService } from './service';

vi.mock('@/core/content', () => ({
  contentReader: { getEntries: vi.fn() },
}));

const mockGetEntries = vi.mocked(contentReader.getEntries<'libraries'>);

const librariesService = createLibrariesService();

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
  mockGetEntries.mockReturnValue(MOCK_LIBRARIES);
});

afterAll(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// getLibraries
// ---------------------------------------------------------------------------
describe('getLibraries', () => {
  it('libraries 컬렉션 조회', async () => {
    await librariesService.getLibraries();
    expect(mockGetEntries).toHaveBeenCalledWith('libraries');
  });

  it('옵션 없이 전체 반환', async () => {
    const result = await librariesService.getLibraries();
    expect(result.items).toHaveLength(4);
  });

  it('category 필터링', async () => {
    const result = await librariesService.getLibraries({ category: 'react' });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].slug).toBe('react-query');
  });

  it('tech 필터링 (AND 조건)', async () => {
    // 서비스는 콤마로 구분된 다중 기술 스택을 지원
    const result = await librariesService.getLibraries({ tech: 'react,typescript' as TechStack });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].slug).toBe('react-query');
  });

  it('search 필터링 (title 기준)', async () => {
    const result = await librariesService.getLibraries({ search: 'next' });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].slug).toBe('next-auth');
  });

  it('sort: alphabetic,asc 알파벳 오름차순', async () => {
    const result = await librariesService.getLibraries({ sort: 'alphabetic,asc' });
    expect(result.items[0].title).toBe('Framer Motion');
  });

  it('pagination: count=2, page=2', async () => {
    const result = await librariesService.getLibraries({ count: '2', page: '2' });
    expect(result.items).toHaveLength(2);
    expect(result.pagination.currentPage).toBe(2);
  });

  it('빈 registry', async () => {
    mockGetEntries.mockReturnValue([]);
    const result = await librariesService.getLibraries();
    expect(result.items).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// getLibraryGroupsByCategory
// ---------------------------------------------------------------------------
describe('getLibraryGroupsByCategory', () => {
  it('카테고리별로 그룹화', async () => {
    const result = await librariesService.getLibraryGroupsByCategory();
    expect(Object.keys(result)).toEqual(expect.arrayContaining(['react', 'nextjs', 'swr', 'motion']));
    expect(result.react).toHaveLength(1);
  });

  it('count 제한: 카테고리당 최대 count개', async () => {
    // react 카테고리에 2개 추가하여 3개로 만들기
    mockGetEntries.mockReturnValue([
      ...MOCK_LIBRARIES,
      makeLibrary({ slug: 'react-router', title: 'React Router', category: 'react', tech: ['react'] }),
      makeLibrary({ slug: 'react-hook-form', title: 'React Hook Form', category: 'react', tech: ['react'] }),
    ]);

    const result = await librariesService.getLibraryGroupsByCategory({ count: '2' });
    expect(result.react).toHaveLength(2);
  });

  it('카테고리 내 알파벳순 정렬 (버그 수정 검증)', async () => {
    mockGetEntries.mockReturnValue([
      makeLibrary({ slug: 'zustand-lib', title: 'Zustand', category: 'react' }),
      makeLibrary({ slug: 'react-query', title: 'React Query', category: 'react' }),
      makeLibrary({ slug: 'react-portal', title: 'Apollo Client', category: 'react' }),
    ]);

    const result = await librariesService.getLibraryGroupsByCategory();
    expect(result.react?.map(l => l.title)).toEqual(['Apollo Client', 'React Query', 'Zustand']);
  });

  it('빈 registry: 빈 객체 반환', async () => {
    mockGetEntries.mockReturnValue([]);
    const result = await librariesService.getLibraryGroupsByCategory();
    expect(Object.keys(result)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// getLibrary
// ---------------------------------------------------------------------------
describe('getLibrary', () => {
  it('존재하는 slug: 해당 library 반환', async () => {
    const result = await librariesService.getLibrary({ slug: 'react-query' });
    expect(result?.slug).toBe('react-query');
  });

  it('존재하지 않는 slug: null 반환', async () => {
    const result = await librariesService.getLibrary({ slug: 'nonexistent' });
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// getLibraryContent
// ---------------------------------------------------------------------------
describe('getLibraryContent', () => {
  it('content 있는 slug: content 문자열 반환', async () => {
    const result = await librariesService.getLibraryContent({ slug: 'react-query' });
    expect(result).toBe('# React Query');
  });

  it('존재하지 않는 slug: null 반환', async () => {
    const result = await librariesService.getLibraryContent({ slug: 'nonexistent' });
    expect(result).toBeNull();
  });

  it('content 필드 없는 library: null 반환', async () => {
    const libWithoutContent = makeLibrary({ slug: 'no-content', title: 'No Content' });
    delete (libWithoutContent as Record<string, unknown>).content;
    mockGetEntries.mockReturnValue([libWithoutContent]);

    const result = await librariesService.getLibraryContent({ slug: 'no-content' });
    expect(result).toBeNull();
  });
});
