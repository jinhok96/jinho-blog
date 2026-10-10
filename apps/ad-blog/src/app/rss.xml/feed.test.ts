import type { FeedPost } from './feed';

import { afterEach, describe, expect, it, vi } from 'vitest';

const { getPosts } = vi.hoisted(() => ({ getPosts: vi.fn<() => FeedPost[]>() }));

vi.mock('@/entities/post', () => ({ getPosts }));

/** SITE_URL은 모듈 로드 시 환경변수로 결정되므로 모듈을 새로 불러온다 */
async function loadFeed() {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://my-blog.com');
  return import('./feed');
}

function makePost(slug: string, overrides: Partial<FeedPost> = {}): FeedPost {
  return {
    title: `제목 ${slug}`,
    description: `설명 ${slug}`,
    path: `/posts/${slug}`,
    category: 'general',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

/** 태그 내용 목록 */
function tagContents(xml: string, tag: string): string[] {
  return Array.from(xml.matchAll(new RegExp(`<${tag}(?: [^>]*)?>([^<]*)</${tag}>`, 'g')), match => match[1]);
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('escapeXml', () => {
  it('XML 특수문자 5종 이스케이프', async () => {
    const { escapeXml } = await loadFeed();

    expect(escapeXml(`A & B <tag> "q" 'a'`)).toBe('A &amp; B &lt;tag&gt; &quot;q&quot; &apos;a&apos;');
  });
});

describe('buildRssFeed', () => {
  it('RSS 2.0 채널 구조 (atom:link self, 언어)', async () => {
    const { buildRssFeed } = await loadFeed();
    const xml = buildRssFeed([makePost('a')]);

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n')).toBe(true);
    expect(xml).toContain('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">');
    expect(xml).toContain('<title>블로그 이름</title>');
    expect(xml).toContain('<link>https://my-blog.com/</link>');
    expect(xml).toContain('<language>ko-KR</language>');
    expect(xml).toContain('<atom:link href="https://my-blog.com/rss.xml" rel="self" type="application/rss+xml" />');
    expect(xml.trimEnd().endsWith('</channel>\n</rss>')).toBe(true);
  });

  it('항목: 제목·링크·guid(permalink)·RFC 822 pubDate·설명·카테고리 이름', async () => {
    const { buildRssFeed } = await loadFeed();
    const xml = buildRssFeed([makePost('a', { createdAt: '2026-03-04T05:06:07.000Z' })]);

    expect(xml).toContain(
      [
        '    <item>',
        '      <title>제목 a</title>',
        '      <link>https://my-blog.com/posts/a</link>',
        '      <guid isPermaLink="true">https://my-blog.com/posts/a</guid>',
        '      <pubDate>Wed, 04 Mar 2026 05:06:07 GMT</pubDate>',
        '      <description>설명 a</description>',
        '      <category>일반</category>',
        '    </item>',
      ].join('\n'),
    );
  });

  it('최신 20개만 포함 (입력 순서 유지)', async () => {
    const { buildRssFeed, RSS_ITEM_LIMIT } = await loadFeed();
    const posts = Array.from({ length: 25 }, (_, index) => makePost(`p${index}`));
    const links = tagContents(buildRssFeed(posts), 'guid');

    expect(RSS_ITEM_LIMIT).toBe(20);
    expect(links).toHaveLength(20);
    expect(links[0]).toBe('https://my-blog.com/posts/p0');
    expect(links[19]).toBe('https://my-blog.com/posts/p19');
  });

  it('lastBuildDate는 포함된 글의 최신 updatedAt, 글이 없으면 생략', async () => {
    const { buildRssFeed } = await loadFeed();
    const xml = buildRssFeed([
      makePost('a', { updatedAt: '2026-02-01T00:00:00.000Z' }),
      makePost('b', { updatedAt: '2026-06-01T09:00:00+09:00' }),
    ]);

    expect(tagContents(xml, 'lastBuildDate')).toEqual(['Mon, 01 Jun 2026 00:00:00 GMT']);
    expect(buildRssFeed([])).not.toContain('<lastBuildDate>');
    expect(buildRssFeed([])).not.toContain('<item>');
  });

  it('제목·설명 이스케이프, 비ASCII slug 링크 퍼센트 인코딩', async () => {
    const { buildRssFeed } = await loadFeed();
    const xml = buildRssFeed([makePost('한글&slug', { title: 'A & B <C>', description: '"인용" & \'따옴표\'' })]);

    expect(tagContents(xml, 'title')).toContain('A &amp; B &lt;C&gt;');
    expect(tagContents(xml, 'description')).toContain('&quot;인용&quot; &amp; &apos;따옴표&apos;');
    expect(tagContents(xml, 'link')).toContain('https://my-blog.com/posts/%ED%95%9C%EA%B8%80&amp;slug');
  });
});

describe('GET /rss.xml', () => {
  it('정적 생성 설정 + RSS Content-Type으로 공개 글 피드 응답', async () => {
    getPosts.mockReturnValue([makePost('a')]);
    await loadFeed();
    const { GET, dynamic } = await import('./route');

    const response = GET();

    expect(dynamic).toBe('force-static');
    expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8');
    expect(await response.text()).toContain('<link>https://my-blog.com/posts/a</link>');
  });
});
