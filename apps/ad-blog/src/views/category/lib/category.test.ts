import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { getCategorySummaries } = vi.hoisted(() => ({ getCategorySummaries: vi.fn() }));

vi.mock('@/entities/post', () => ({ getCategorySummaries }));

async function loadCategory() {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://my-blog.com');
  return import('./category');
}

beforeEach(() => {
  vi.clearAllMocks();
  getCategorySummaries.mockReturnValue([{ category: 'general', count: 3 }]);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('findCategory', () => {
  it('글이 있는 카테고리만 반환', async () => {
    const { findCategory } = await loadCategory();

    expect(findCategory('general')).toBe('general');
  });

  it('정의되지 않았거나 공개 글이 없는 카테고리(초안만 있는 경우 포함)는 null', async () => {
    const { findCategory } = await loadCategory();

    expect(findCategory('unknown')).toBeNull();

    getCategorySummaries.mockReturnValue([]);
    expect(findCategory('general')).toBeNull();
  });
});

describe('getCategoryBreadcrumbs', () => {
  it('1페이지: 홈 › 카테고리', async () => {
    const { getCategoryBreadcrumbs } = await loadCategory();

    expect(getCategoryBreadcrumbs('general', 1)).toEqual([
      { name: '홈', path: '/' },
      { name: '일반', path: '/categories/general' },
    ]);
  });

  it('2페이지 이상: 페이지 항목 추가', async () => {
    const { getCategoryBreadcrumbs } = await loadCategory();

    expect(getCategoryBreadcrumbs('general', 2).at(-1)).toEqual({
      name: '2페이지',
      path: '/categories/general/page/2',
    });
  });
});

describe('buildCategoryMetadata', () => {
  it('1페이지: 카테고리 이름·설명, canonical은 카테고리 경로', async () => {
    const { buildCategoryMetadata } = await loadCategory();

    const metadata = buildCategoryMetadata('general', 1);

    expect(metadata.title).toBe('일반');
    expect(metadata.description).toBe('일반 카테고리 글 목록입니다.');
    expect(metadata.alternates?.canonical).toBe('https://my-blog.com/categories/general');
  });

  it('2페이지 이상: 제목·설명에 페이지 번호 (페이지마다 고유), canonical은 자기 자신', async () => {
    const { buildCategoryMetadata } = await loadCategory();

    const metadata = buildCategoryMetadata('general', 2);

    expect(metadata.title).toContain('2페이지');
    expect(metadata.description).toBe('일반 카테고리 글 목록입니다. (2페이지)');
    expect(metadata.alternates?.canonical).toBe('https://my-blog.com/categories/general/page/2');
  });
});
