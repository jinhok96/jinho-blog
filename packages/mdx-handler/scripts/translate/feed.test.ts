import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchFeedItems } from './feed.js';

const mockParseURL = vi.hoisted(() => vi.fn());

vi.mock('rss-parser', () => ({
  default: vi.fn().mockImplementation(function (this: object) {
    (this as { parseURL: unknown }).parseURL = mockParseURL;
  }),
}));

describe('fetchFeedItems', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('정상 피드에서 FeedItem 배열 반환', async () => {
    mockParseURL.mockResolvedValue({
      items: [
        {
          title: 'React Compiler',
          link: 'https://react.dev/blog/react-compiler',
          contentSnippet: 'Introduces React Compiler',
          isoDate: '2024-10-21T00:00:00.000Z',
        },
        {
          title: 'Next.js 15',
          link: 'https://nextjs.org/blog/next-15',
          isoDate: '2024-10-23T00:00:00.000Z',
        },
      ],
    });

    const items = await fetchFeedItems('https://react.dev/feed.xml');

    expect(items).toHaveLength(2);
    expect(items[0]).toEqual({
      title: 'React Compiler',
      link: 'https://react.dev/blog/react-compiler',
      summary: 'Introduces React Compiler',
      pubDate: '2024-10-21',
    });
    expect(items[1].pubDate).toBe('2024-10-23');
  });

  it('link 또는 title 없는 아이템 필터링', async () => {
    mockParseURL.mockResolvedValue({
      items: [
        { title: 'Valid', link: 'https://example.com/post' },
        { title: 'No Link' },
        { link: 'https://example.com/no-title' },
        { title: null, link: null },
      ],
    });

    const items = await fetchFeedItems('https://react.dev/feed.xml');
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('Valid');
  });

  it('isoDate 없고 pubDate만 있으면 pubDate 사용', async () => {
    mockParseURL.mockResolvedValue({
      items: [{ title: 'Post', link: 'https://example.com/post', pubDate: 'Mon, 21 Oct 2024 00:00:00 GMT' }],
    });

    const items = await fetchFeedItems('https://example.com/feed.xml');
    expect(items[0].pubDate).toBe('2024-10-21');
  });

  it('날짜 필드 없으면 pubDate는 undefined', async () => {
    mockParseURL.mockResolvedValue({
      items: [{ title: 'Post', link: 'https://example.com/post' }],
    });

    const items = await fetchFeedItems('https://example.com/feed.xml');
    expect(items[0].pubDate).toBeUndefined();
  });

  it('빈 피드는 빈 배열 반환', async () => {
    mockParseURL.mockResolvedValue({ items: [] });
    const items = await fetchFeedItems('https://example.com/feed.xml');
    expect(items).toEqual([]);
  });

  it('items 필드 없으면 빈 배열 반환', async () => {
    mockParseURL.mockResolvedValue({});
    const items = await fetchFeedItems('https://example.com/feed.xml');
    expect(items).toEqual([]);
  });

  it('파싱 실패 시 빈 배열 반환 및 경고 출력', async () => {
    mockParseURL.mockRejectedValue(new Error('Network error'));

    const items = await fetchFeedItems('https://invalid.url/feed.xml');

    expect(items).toEqual([]);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('RSS 파싱 실패'), expect.any(Error));
  });

  it('summary가 없으면 undefined', async () => {
    mockParseURL.mockResolvedValue({
      items: [{ title: 'Post', link: 'https://example.com/post', isoDate: '2024-01-01T00:00:00.000Z' }],
    });

    const items = await fetchFeedItems('https://example.com/feed.xml');
    expect(items[0].summary).toBeUndefined();
  });
});
