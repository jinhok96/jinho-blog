import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../core/utils/index.js', async () => {
  const actual = await vi.importActual<typeof import('../../core/utils/index.js')>('../../core/utils/index.js');
  return {
    ...actual,
    getRegistry: vi.fn(),
  };
});

import type { Blog } from './blog.service.js';

import { getRegistry } from '../../core/utils/index.js';
import { getBlogContent, getBlogPost, getBlogPosts } from './blog.service.js';

const mockGetRegistry = vi.mocked(getRegistry);

function makeBlog(overrides: Partial<Blog> & Pick<Blog, 'slug' | 'title'>): Blog {
  return {
    slug: overrides.slug,
    title: overrides.title,
    description: overrides.description ?? 'desc',
    category: overrides.category ?? 'frontend',
    createdAt: overrides.createdAt ?? '2024-01-01T00:00:00Z',
    updatedAt: overrides.updatedAt ?? '2024-01-01T00:00:00Z',
    filePath: overrides.filePath ?? `/blog/${overrides.slug}.mdx`,
    path: overrides.path ?? `/blog/${overrides.slug}`,
    content: overrides.content ?? `# ${overrides.title}`,
  };
}

const MOCK_POSTS: Blog[] = [
  makeBlog({ slug: 'react-hooks', title: 'React Hooks', category: 'frontend', createdAt: '2024-01-01T00:00:00Z' }),
  makeBlog({ slug: 'algo-bfs', title: 'BFS 알고리즘', category: 'algorithm', createdAt: '2024-03-01T00:00:00Z' }),
  makeBlog({ slug: 'ts-tips', title: 'TypeScript Tips', category: 'frontend', createdAt: '2024-02-01T00:00:00Z' }),
];

beforeAll(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

beforeEach(() => {
  vi.clearAllMocks();
  mockGetRegistry.mockReturnValue(MOCK_POSTS);
});

afterAll(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// getBlogPosts
// ---------------------------------------------------------------------------
describe('getBlogPosts', () => {
  it('옵션 없이 기본 정렬(createdAt,desc)로 전체 반환', async () => {
    const result = await getBlogPosts();
    expect(result.items).toHaveLength(3);
    expect(result.items[0].slug).toBe('algo-bfs'); // createdAt,desc 최신순
  });

  it('category 필터링', async () => {
    const result = await getBlogPosts({ category: 'frontend' });
    expect(result.items.map(p => p.slug)).toEqual(expect.arrayContaining(['react-hooks', 'ts-tips']));
    expect(result.items).toHaveLength(2);
  });

  it('search 필터링 (title 기준)', async () => {
    const result = await getBlogPosts({ search: 'typescript' });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].slug).toBe('ts-tips');
  });

  it('sort: createdAt,asc 오래된 순', async () => {
    const result = await getBlogPosts({ sort: 'createdAt,asc' });
    expect(result.items[0].slug).toBe('react-hooks');
  });

  it('pagination: count=1, page=2', async () => {
    const result = await getBlogPosts({ count: '1', page: '2' });
    expect(result.items).toHaveLength(1);
    expect(result.pagination.currentPage).toBe(2);
    expect(result.pagination.totalItems).toBe(3);
  });

  it('빈 registry: items=[], pagination.totalItems=0', async () => {
    mockGetRegistry.mockReturnValue([]);
    const result = await getBlogPosts();
    expect(result.items).toHaveLength(0);
    expect(result.pagination.totalItems).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getBlogPost
// ---------------------------------------------------------------------------
describe('getBlogPost', () => {
  it('존재하는 slug: 해당 post 반환', async () => {
    const result = await getBlogPost('react-hooks');
    expect(result?.slug).toBe('react-hooks');
  });

  it('존재하지 않는 slug: null 반환', async () => {
    const result = await getBlogPost('nonexistent');
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// getBlogContent
// ---------------------------------------------------------------------------
describe('getBlogContent', () => {
  it('content 있는 slug: content 문자열 반환', async () => {
    const result = await getBlogContent('react-hooks');
    expect(result).toBe('# React Hooks');
  });

  it('존재하지 않는 slug: null 반환', async () => {
    const result = await getBlogContent('nonexistent');
    expect(result).toBeNull();
  });

  it('content 필드 없는 post: null 반환', async () => {
    const postWithoutContent = makeBlog({ slug: 'no-content', title: 'No Content' });
    delete (postWithoutContent as Record<string, unknown>).content;
    mockGetRegistry.mockReturnValue([postWithoutContent]);

    const result = await getBlogContent('no-content');
    expect(result).toBeNull();
  });
});
