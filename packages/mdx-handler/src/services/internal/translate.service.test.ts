import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../core/utils/index.js', async () => {
  const actual = await vi.importActual<typeof import('../../core/utils/index.js')>('../../core/utils/index.js');
  return {
    ...actual,
    getRegistry: vi.fn(),
  };
});

import type { Translate } from './translate.service.js';

import { getRegistry } from '../../core/utils/index.js';
import { getTranslateContent, getTranslatePost, getTranslatePosts } from './translate.service.js';

const mockGetRegistry = vi.mocked(getRegistry);

function makeTranslate(overrides: Partial<Translate> & Pick<Translate, 'slug' | 'title'>): Translate {
  return {
    slug: overrides.slug,
    title: overrides.title,
    description: overrides.description ?? 'desc',
    category: overrides.category ?? 'react',
    createdAt: overrides.createdAt ?? '2024-01-01T00:00:00Z',
    updatedAt: overrides.updatedAt ?? '2024-01-01T00:00:00Z',
    filePath: overrides.filePath ?? `/translate/${overrides.slug}.mdx`,
    path: overrides.path ?? `/translate/${overrides.slug}`,
    thumbnail: overrides.thumbnail ?? `/_static/mdx/translate/generated/${overrides.slug}.webp`,
    sourceUrl: overrides.sourceUrl ?? `https://react.dev/blog/${overrides.slug}`,
    content: overrides.content ?? `# ${overrides.title}`,
  };
}

const MOCK_POSTS: Translate[] = [
  makeTranslate({
    slug: 'react-react-compiler',
    title: 'React 컴파일러',
    category: 'react',
    createdAt: '2024-01-01T00:00:00Z',
  }),
  makeTranslate({ slug: 'nextjs-next-15', title: 'Next.js 15', category: 'nextjs', createdAt: '2024-03-01T00:00:00Z' }),
  makeTranslate({
    slug: 'typescript-5',
    title: 'TypeScript 5',
    category: 'typescript',
    createdAt: '2024-02-01T00:00:00Z',
  }),
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
// getTranslatePosts
// ---------------------------------------------------------------------------
describe('getTranslatePosts', () => {
  it('옵션 없이 기본 정렬(createdAt,desc)로 전체 반환', async () => {
    const result = await getTranslatePosts();
    expect(result.items).toHaveLength(3);
    expect(result.items[0].slug).toBe('nextjs-next-15');
  });

  it('category 필터링', async () => {
    const result = await getTranslatePosts({ category: 'react' });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].slug).toBe('react-react-compiler');
  });

  it('search 필터링 (title 기준)', async () => {
    const result = await getTranslatePosts({ search: 'next' });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].slug).toBe('nextjs-next-15');
  });

  it('sort: createdAt,asc 오래된 순', async () => {
    const result = await getTranslatePosts({ sort: 'createdAt,asc' });
    expect(result.items[0].slug).toBe('react-react-compiler');
  });

  it('pagination: count=1, page=2', async () => {
    const result = await getTranslatePosts({ count: '1', page: '2' });
    expect(result.items).toHaveLength(1);
    expect(result.pagination.currentPage).toBe(2);
    expect(result.pagination.totalItems).toBe(3);
  });

  it('빈 registry: items=[], pagination.totalItems=0', async () => {
    mockGetRegistry.mockReturnValue([]);
    const result = await getTranslatePosts();
    expect(result.items).toHaveLength(0);
    expect(result.pagination.totalItems).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getTranslatePost
// ---------------------------------------------------------------------------
describe('getTranslatePost', () => {
  it('존재하는 slug: 해당 post 반환', async () => {
    const result = await getTranslatePost('react-react-compiler');
    expect(result?.slug).toBe('react-react-compiler');
  });

  it('존재하지 않는 slug: null 반환', async () => {
    const result = await getTranslatePost('nonexistent');
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// getTranslateContent
// ---------------------------------------------------------------------------
describe('getTranslateContent', () => {
  it('content 있는 slug: content 문자열 반환', async () => {
    const result = await getTranslateContent('react-react-compiler');
    expect(result).toBe('# React 컴파일러');
  });

  it('존재하지 않는 slug: null 반환', async () => {
    const result = await getTranslateContent('nonexistent');
    expect(result).toBeNull();
  });

  it('content 필드 없는 post: null 반환', async () => {
    const postWithoutContent = makeTranslate({ slug: 'no-content', title: 'No Content' });
    delete (postWithoutContent as Record<string, unknown>).content;
    mockGetRegistry.mockReturnValue([postWithoutContent]);

    const result = await getTranslateContent('no-content');
    expect(result).toBeNull();
  });
});
