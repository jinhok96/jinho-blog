import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CATEGORY_MAP } from '@/core/config';

const { getCategorySummaries } = vi.hoisted(() => ({ getCategorySummaries: vi.fn() }));

vi.mock('@/entities/post', () => ({ getCategorySummaries }));

async function loadCategory() {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://my-blog.com');
  return import('./category');
}

beforeEach(() => {
  vi.clearAllMocks();
  getCategorySummaries.mockReturnValue([{ category: 'ai-tools', count: 3 }]);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('findCategory', () => {
  it('글이 있는 카테고리만 반환', async () => {
    const { findCategory } = await loadCategory();

    expect(findCategory('ai-tools')).toBe('ai-tools');
  });

  it('정의되지 않았거나 공개 글이 없는 카테고리(초안만 있는 경우 포함)는 null', async () => {
    const { findCategory } = await loadCategory();

    expect(findCategory('unknown')).toBeNull();

    getCategorySummaries.mockReturnValue([]);
    expect(findCategory('ai-tools')).toBeNull();
  });
});

describe('getCategoryBreadcrumbs', () => {
  it('1페이지: 홈 › 카테고리', async () => {
    const { getCategoryBreadcrumbs } = await loadCategory();

    expect(getCategoryBreadcrumbs('ai-tools', 1)).toEqual([
      { name: 'Home', path: '/' },
      { name: 'AI Tools', path: '/categories/ai-tools' },
    ]);
  });

  it('2페이지 이상: 페이지 항목 추가', async () => {
    const { getCategoryBreadcrumbs } = await loadCategory();

    expect(getCategoryBreadcrumbs('ai-tools', 2).at(-1)).toEqual({
      name: 'Page 2',
      path: '/categories/ai-tools/page/2',
    });
  });
});

describe('buildCategoryMetadata', () => {
  it('1페이지: 카테고리 이름·설명, canonical은 카테고리 경로', async () => {
    const { buildCategoryMetadata } = await loadCategory();

    const metadata = buildCategoryMetadata('ai-tools', 1);

    expect(metadata.title).toBe('AI Tools');
    expect(metadata.description).toBe(CATEGORY_MAP['ai-tools'].description);
    expect(metadata.alternates?.canonical).toBe('https://my-blog.com/categories/ai-tools');
  });

  it('2페이지 이상: 제목·설명에 페이지 번호 (페이지마다 고유), canonical은 자기 자신', async () => {
    const { buildCategoryMetadata } = await loadCategory();

    const metadata = buildCategoryMetadata('ai-tools', 2);

    expect(metadata.title).toBe('AI Tools (Page 2)');
    expect(metadata.description).toBe(`${CATEGORY_MAP['ai-tools'].description} (Page 2)`);
    expect(metadata.alternates?.canonical).toBe('https://my-blog.com/categories/ai-tools/page/2');
  });
});
