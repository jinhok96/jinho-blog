import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { TranslateSource } from '../../src/core/config';

import { translateNewPosts } from './orchestrator.js';

// vi.mock은 호이스팅되므로 hoisted로 mock 함수를 미리 정의
const {
  mockFetchFeedItems,
  mockScrapeArticle,
  mockTranslateWithGemini,
  mockGetTranslatedInfo,
  mockGetMdxDir,
  mockFindMonorepoRoot,
  mockGenerateSlug,
  mockBuildMdxContent,
  mockNormalizeHeadings,
  MockFatalGeminiError,
} = vi.hoisted(() => {
  class MockFatalGeminiError extends Error {
    constructor(msg?: string) {
      super(msg);
      this.name = 'FatalGeminiError';
    }
  }
  return {
    mockFetchFeedItems: vi.fn(),
    mockScrapeArticle: vi.fn(),
    mockTranslateWithGemini: vi.fn(),
    mockGetTranslatedInfo: vi.fn(),
    mockGetMdxDir: vi.fn().mockReturnValue('/monorepo/content/mdx/translate'),
    mockFindMonorepoRoot: vi.fn().mockReturnValue('/monorepo'),
    mockGenerateSlug: vi.fn().mockReturnValue('react-react-compiler'),
    mockBuildMdxContent: vi.fn().mockReturnValue('---\ntitle: Test\n---\n\nContent'),
    mockNormalizeHeadings: vi.fn().mockImplementation((s: string) => s),
    MockFatalGeminiError,
  };
});

vi.mock('../../src/core/config', () => ({
  TRANSLATE_SOURCES: [
    { name: 'React Blog', category: 'react', rssUrl: 'https://react.dev/feed.xml', license: 'cc-by-4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/' },
    { name: 'Next.js Blog', category: 'nextjs', rssUrl: 'https://nextjs.org/feed.xml', license: 'all-rights-reserved' },
  ] satisfies TranslateSource[],
  TRANSLATE_SCRIPT_CONFIG: {
    GEMINI_MODEL: 'gemini-2.5-flash-lite',
    MAX_RETRIES: 3,
    INITIAL_POST_COUNT: 3,
    SCRAPE_TIMEOUT_MS: 10_000,
    SCRAPE_USER_AGENT: 'Mozilla/5.0 (compatible; TranslateBot/1.0)',
  },
}));

vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(function (this: object) {}),
}));

vi.mock('dotenv', () => ({
  config: vi.fn(),
}));

vi.mock('fs');

vi.mock('./feed', () => ({
  fetchFeedItems: mockFetchFeedItems,
}));

vi.mock('./scraper', () => ({
  scrapeArticle: mockScrapeArticle,
}));

vi.mock('./gemini', () => ({
  FatalGeminiError: MockFatalGeminiError,
  translateWithGemini: mockTranslateWithGemini,
}));

vi.mock('./mdx-builder', () => ({
  generateSlug: mockGenerateSlug,
  buildMdxContent: mockBuildMdxContent,
  normalizeHeadings: mockNormalizeHeadings,
}));

vi.mock('./state', () => ({
  findMonorepoRoot: mockFindMonorepoRoot,
  getMdxDir: mockGetMdxDir,
  getTranslatedInfo: mockGetTranslatedInfo,
}));

import * as fs from 'fs';

const FEED_ITEM = {
  title: 'React Compiler',
  link: 'https://react.dev/blog/react-compiler',
  pubDate: '2024-10-21',
};

const SCRAPED = { title: 'React Compiler', markdown: '## Intro\n\nContent' };

const TRANSLATION = {
  title: 'React 컴파일러',
  description: 'React 컴파일러 설명',
  body: '## 소개\n\n내용',
};

describe('translateNewPosts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    process.env.GEMINI_API_KEY = 'test-api-key';

    vi.mocked(fs.mkdirSync).mockReturnValue(undefined as never);
    vi.mocked(fs.writeFileSync).mockReturnValue(undefined);

    mockGetTranslatedInfo.mockReturnValue({
      urls: new Set<string>(),
      byCategory: new Map<string, Set<string>>(),
    });
    mockGetMdxDir.mockReturnValue('/monorepo/content/mdx/translate');
    mockFindMonorepoRoot.mockReturnValue('/monorepo');
    mockFetchFeedItems.mockResolvedValue([FEED_ITEM]);
    mockScrapeArticle.mockResolvedValue(SCRAPED);
    mockTranslateWithGemini.mockResolvedValue(TRANSLATION);
    mockGenerateSlug.mockReturnValue('react-react-compiler');
    mockBuildMdxContent.mockReturnValue('---\ntitle: Test\n---\n\nContent');
    mockNormalizeHeadings.mockImplementation((s: string) => s);
  });

  it('GEMINI_API_KEY 없으면 throw', async () => {
    delete process.env.GEMINI_API_KEY;

    await expect(translateNewPosts()).rejects.toThrow('GEMINI_API_KEY');
  });

  it('최초 수집 — INITIAL_POST_COUNT(3)개만 처리', async () => {
    const manyItems = Array.from({ length: 10 }, (_, i) => ({
      title: `Post ${i}`,
      link: `https://react.dev/blog/post-${i}`,
    }));
    mockFetchFeedItems.mockResolvedValue(manyItems);

    await translateNewPosts();

    // 2 sources × 3 items = 6 scrapes
    expect(mockScrapeArticle).toHaveBeenCalledTimes(6);
  });

  it('이미 번역된 URL은 건너뜀', async () => {
    mockGetTranslatedInfo.mockReturnValue({
      urls: new Set(['https://react.dev/blog/react-compiler']),
      byCategory: new Map([['react', new Set(['https://react.dev/blog/react-compiler'])]]),
    });
    mockFetchFeedItems.mockResolvedValue([FEED_ITEM]);

    await translateNewPosts();

    expect(mockScrapeArticle).not.toHaveBeenCalled();
  });

  it('이후 수집 — 마지막 번역 이후 새 글만 처리', async () => {
    const existingUrl = 'https://react.dev/blog/old';
    mockGetTranslatedInfo.mockReturnValue({
      urls: new Set([existingUrl]),
      byCategory: new Map([['react', new Set([existingUrl])]]),
    });
    const items = [
      { title: 'New Post', link: 'https://react.dev/blog/new' },
      { title: 'Old Post', link: existingUrl },
    ];
    mockFetchFeedItems.mockResolvedValue(items);

    await translateNewPosts();

    expect(mockScrapeArticle).toHaveBeenCalled();
  });

  it('스크래핑 실패(null) 시 skip하고 번역 호출 안함', async () => {
    mockFetchFeedItems.mockResolvedValue([FEED_ITEM]);
    mockScrapeArticle.mockResolvedValue(null);

    await translateNewPosts();

    expect(mockTranslateWithGemini).not.toHaveBeenCalled();
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it('번역 실패(null) 시 skip하고 파일 저장 안함', async () => {
    mockFetchFeedItems.mockResolvedValue([FEED_ITEM]);
    mockScrapeArticle.mockResolvedValue(SCRAPED);
    mockTranslateWithGemini.mockResolvedValue(null);

    await translateNewPosts();

    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it('FatalGeminiError 발생 시 process.exit(1) 호출 후 에러 전파', async () => {
    mockFetchFeedItems.mockResolvedValue([FEED_ITEM]);
    mockScrapeArticle.mockResolvedValue(SCRAPED);
    mockTranslateWithGemini.mockRejectedValue(new MockFatalGeminiError('Fatal'));

    // process.exit이 mock되면 이후 throw error가 실행되어 promise가 reject됨
    const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

    await expect(translateNewPosts()).rejects.toBeInstanceOf(MockFatalGeminiError);
    expect(mockExit).toHaveBeenCalledWith(1);
    mockExit.mockRestore();
  });

  it('번역 성공 시 MDX 파일 저장', async () => {
    mockFetchFeedItems.mockResolvedValue([FEED_ITEM]);
    mockScrapeArticle.mockResolvedValue(SCRAPED);
    mockTranslateWithGemini.mockResolvedValue(TRANSLATION);

    await translateNewPosts();

    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('피드에서 번역된 글이 없으면 모든 미번역 글 처리', async () => {
    const existingUrl = 'https://react.dev/blog/very-old';
    mockGetTranslatedInfo.mockReturnValue({
      urls: new Set([existingUrl]),
      byCategory: new Map([['react', new Set([existingUrl])]]),
    });
    const items = [
      { title: 'New Post 1', link: 'https://react.dev/blog/new1' },
      { title: 'New Post 2', link: 'https://react.dev/blog/new2' },
    ];
    mockFetchFeedItems.mockResolvedValue(items);

    await translateNewPosts();

    // react source: 2개 모두 처리 (기존 글이 피드에 없음)
    // nextjs source도 같은 items 반환 → 각 2개씩
    expect(mockScrapeArticle).toHaveBeenCalledTimes(4); // 2 sources × 2 items
  });
});
