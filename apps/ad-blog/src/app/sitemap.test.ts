import type { Page } from '@/entities/page';
import type { CategorySummary, Post } from '@/entities/post';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { getPosts, getCategorySummaries, getPages } = vi.hoisted(() => ({
  getPosts: vi.fn<() => Post[]>(),
  getCategorySummaries: vi.fn<() => CategorySummary[]>(),
  getPages: vi.fn<() => Page[]>(),
}));

vi.mock('@/entities/post', () => ({ getPosts, getCategorySummaries }));
vi.mock('@/entities/page', () => ({ getPages }));

/** SITE_URL은 모듈 로드 시 환경변수로 결정되므로 모듈을 새로 불러온다 */
async function loadSitemap() {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://my-blog.com');
  return import('./sitemap');
}

function makePost(overrides: Partial<Post> & Pick<Post, 'slug' | 'updatedAt'>): Post {
  return {
    title: overrides.slug,
    description: 'desc',
    category: 'general',
    tags: [],
    draft: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    thumbnail: `/_static/mdx/posts/generated/${overrides.slug}.webp`,
    content: '본문',
    filePath: `/content/posts/${overrides.slug}.mdx`,
    path: `/posts/${overrides.slug}`,
    ...overrides,
  };
}

function makePage(slug: string, updatedAt: string): Page {
  return {
    slug,
    title: slug,
    description: 'desc',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt,
    content: '본문',
    filePath: `/content/pages/${slug}.mdx`,
    path: `/${slug}`,
  };
}

const REVIEW = 'review' as Post['category'];

// getPosts()는 최신순(createdAt desc) — 수정일 순서와 다르게 배치
const POSTS: Post[] = [
  makePost({ slug: 'c', updatedAt: '2026-03-01T00:00:00.000Z' }),
  makePost({ slug: 'b', updatedAt: '2026-05-01T00:00:00.000Z', category: REVIEW }),
  makePost({ slug: 'a', updatedAt: '2026-04-01T09:00:00+09:00' }),
];

beforeEach(() => {
  vi.clearAllMocks();
  getPosts.mockReturnValue(POSTS);
  getCategorySummaries.mockReturnValue([
    { category: 'general', count: 2 },
    { category: REVIEW, count: 1 },
  ]);
  getPages.mockReturnValue([makePage('about', '2026-02-01T00:00:00.000Z')]);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('sitemap', () => {
  it('홈·글·카테고리·정적 페이지를 절대 URL로 포함 (페이지네이션 제외)', async () => {
    const { default: sitemap } = await loadSitemap();

    expect(sitemap().map(({ url }) => url)).toEqual([
      'https://my-blog.com/',
      'https://my-blog.com/posts/c',
      'https://my-blog.com/posts/b',
      'https://my-blog.com/posts/a',
      'https://my-blog.com/categories/general',
      'https://my-blog.com/categories/review',
      'https://my-blog.com/about',
    ]);
  });

  it('글·정적 페이지 lastModified는 updatedAt', async () => {
    const { default: sitemap } = await loadSitemap();
    const entries = sitemap();

    expect(entries.find(({ url }) => url.endsWith('/posts/a'))?.lastModified).toEqual(
      new Date('2026-04-01T00:00:00.000Z'),
    );
    expect(entries.find(({ url }) => url.endsWith('/about'))?.lastModified).toEqual(
      new Date('2026-02-01T00:00:00.000Z'),
    );
  });

  it('홈은 전체 글, 카테고리는 소속 글의 최신 updatedAt (타임존 표기 무관)', async () => {
    const { default: sitemap } = await loadSitemap();
    const entries = sitemap();

    expect(entries[0].lastModified).toEqual(new Date('2026-05-01T00:00:00.000Z'));
    expect(entries.find(({ url }) => url.endsWith('/categories/general'))?.lastModified).toEqual(
      new Date('2026-04-01T00:00:00.000Z'),
    );
    expect(entries.find(({ url }) => url.endsWith('/categories/review'))?.lastModified).toEqual(
      new Date('2026-05-01T00:00:00.000Z'),
    );
  });

  it('글이 없으면 홈 lastModified 생략 (빌드 시각 사용 안 함)', async () => {
    getPosts.mockReturnValue([]);
    getCategorySummaries.mockReturnValue([]);
    const { default: sitemap } = await loadSitemap();

    expect(sitemap()).toEqual([
      { url: 'https://my-blog.com/', lastModified: undefined },
      { url: 'https://my-blog.com/about', lastModified: new Date('2026-02-01T00:00:00.000Z') },
    ]);
  });

  it('비ASCII slug는 퍼센트 인코딩, & 는 XML 이스케이프', async () => {
    getPosts.mockReturnValue([makePost({ slug: '한글&글', updatedAt: '2026-01-01T00:00:00.000Z' })]);
    const { default: sitemap } = await loadSitemap();

    expect(sitemap()[1].url).toBe('https://my-blog.com/posts/%ED%95%9C%EA%B8%80&amp;%EA%B8%80');
  });

  it('정적 export용 force-static 설정', async () => {
    const { dynamic } = await loadSitemap();

    expect(dynamic).toBe('force-static');
  });
});
