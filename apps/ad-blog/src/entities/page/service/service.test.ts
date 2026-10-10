import type { Page } from '@/entities/page/types';

import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/core/content', () => ({
  contentReader: { getEntries: vi.fn() },
}));

import { contentReader } from '@/core/content';

import { getPage, getPages } from './service';

const mockGetEntries = vi.mocked(contentReader.getEntries<'pages'>);

function makePage(slug: string, title: string): Page {
  return {
    slug,
    title,
    description: `${title} 설명`,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    content: '본문',
    filePath: `/content/pages/${slug}.mdx`,
    path: `/${slug}`,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockGetEntries.mockReturnValue([makePage('privacy', '개인정보처리방침'), makePage('about', '소개')]);
});

describe('getPages', () => {
  it('pages 컬렉션을 제목순으로 반환', () => {
    expect(getPages().map(page => page.slug)).toEqual(['privacy', 'about']);
    expect(mockGetEntries).toHaveBeenCalledWith('pages');
  });
});

describe('getPage', () => {
  it('slug로 조회, 없으면 null', () => {
    expect(getPage('about')?.title).toBe('소개');
    expect(getPage('none')).toBeNull();
  });
});
