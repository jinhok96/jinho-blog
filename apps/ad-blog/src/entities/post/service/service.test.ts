import type { Post } from '@/entities/post/types';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/core/content', () => ({
  contentReader: { getEntries: vi.fn() },
}));

vi.mock('@/core/config', async importOriginal => ({
  ...(await importOriginal<object>()),
  POSTS_PER_PAGE: 2,
  CATEGORIES: ['general', 'review'],
}));

import { contentReader } from '@/core/content';

import {
  getAdjacentPosts,
  getCategorySummaries,
  getPost,
  getPostPageCount,
  getPosts,
  getPostsPage,
  getRelatedPosts,
} from './service';

const mockGetEntries = vi.mocked(contentReader.getEntries<'posts'>);

function makePost(overrides: Partial<Post> & Pick<Post, 'slug' | 'createdAt'>): Post {
  return {
    title: overrides.slug,
    description: 'desc',
    category: 'general',
    tags: [],
    draft: false,
    updatedAt: overrides.createdAt,
    thumbnail: `/_static/mdx/posts/generated/${overrides.slug}.webp`,
    content: '본문',
    filePath: `/content/posts/${overrides.slug}.mdx`,
    path: `/posts/${overrides.slug}`,
    ...overrides,
  };
}

// 등록 순서와 무관하게 최신순 정렬되는지 확인하기 위해 섞어서 배치
const POSTS: Post[] = [
  makePost({ slug: 'b', createdAt: '2026-02-01T00:00:00.000Z', tags: ['x'] }),
  makePost({ slug: 'd', createdAt: '2026-04-01T00:00:00.000Z', category: 'review' as Post['category'], tags: ['x'] }),
  makePost({ slug: 'a', createdAt: '2026-01-01T00:00:00.000Z' }),
  makePost({ slug: 'c', createdAt: '2026-03-01T00:00:00.000Z', tags: ['y'] }),
  makePost({ slug: 'draft', createdAt: '2026-05-01T00:00:00.000Z', draft: true }),
];

beforeEach(() => {
  vi.clearAllMocks();
  mockGetEntries.mockReturnValue(POSTS);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getPosts', () => {
  it('posts 컬렉션을 최신순으로 반환하고 초안은 제외', () => {
    expect(getPosts().map(post => post.slug)).toEqual(['d', 'c', 'b', 'a']);
    expect(mockGetEntries).toHaveBeenCalledWith('posts');
  });

  it('개발 서버에서는 초안 포함', () => {
    vi.stubEnv('NODE_ENV', 'development');

    expect(getPosts()[0].slug).toBe('draft');
  });

  it('카테고리 필터', () => {
    expect(getPosts({ category: 'review' as Post['category'] }).map(post => post.slug)).toEqual(['d']);
  });
});

describe('getPostsPage / getPostPageCount', () => {
  it('페이지당 POSTS_PER_PAGE개 (페이지 범위 정보 포함)', () => {
    const page2 = getPostsPage(2);

    expect(page2.items.map(post => post.slug)).toEqual(['b', 'a']);
    expect(page2.pagination).toMatchObject({ currentPage: 2, totalPages: 2, hasNext: false, hasPrev: true });
  });

  it('카테고리별 페이지', () => {
    expect(getPostsPage(1, { category: 'general' as Post['category'] }).items.map(post => post.slug)).toEqual([
      'c',
      'b',
    ]);
  });

  it('총 페이지 수 (글이 없어도 1)', () => {
    expect(getPostPageCount()).toBe(2);
    expect(getPostPageCount({ category: 'review' as Post['category'] })).toBe(1);

    mockGetEntries.mockReturnValue([]);
    expect(getPostPageCount()).toBe(1);
  });
});

describe('getPost', () => {
  it('slug로 조회', () => {
    expect(getPost('c')?.slug).toBe('c');
  });

  it('없는 글·초안은 null', () => {
    expect(getPost('none')).toBeNull();
    expect(getPost('draft')).toBeNull();
  });
});

describe('getRelatedPosts', () => {
  it('같은 카테고리·공유 태그 점수순, 자기 자신 제외', () => {
    // b(general, x) 기준: c(general)=2, a(general)=2, d(review, x)=1
    const post = getPost('b')!;

    expect(getRelatedPosts(post).map(related => related.slug)).toEqual(['c', 'a', 'd']);
    expect(getRelatedPosts(post, 1).map(related => related.slug)).toEqual(['c']);
  });

  it('관련 점수가 없으면 제외', () => {
    // d(review, x) 기준: b(x)=1만 관련
    expect(getRelatedPosts(getPost('d')!).map(related => related.slug)).toEqual(['b']);
  });
});

describe('getAdjacentPosts', () => {
  it('이전 글은 더 오래된 글, 다음 글은 더 최신 글', () => {
    const { previous, next } = getAdjacentPosts(getPost('c')!);

    expect(previous?.slug).toBe('b');
    expect(next?.slug).toBe('d');
  });

  it('처음·마지막 글은 한쪽이 null', () => {
    expect(getAdjacentPosts(getPost('d')!).next).toBeNull();
    expect(getAdjacentPosts(getPost('a')!).previous).toBeNull();
  });

  it('목록에 없는 글(초안)은 둘 다 null', () => {
    expect(getAdjacentPosts(POSTS[4])).toEqual({ previous: null, next: null });
  });
});

describe('getCategorySummaries', () => {
  it('글이 있는 카테고리만 정의 순서대로 글 수와 함께 반환', () => {
    expect(getCategorySummaries()).toEqual([
      { category: 'general', count: 3 },
      { category: 'review', count: 1 },
    ]);

    mockGetEntries.mockReturnValue([POSTS[0]]);
    expect(getCategorySummaries()).toEqual([{ category: 'general', count: 1 }]);
  });
});
