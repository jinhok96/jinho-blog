import { afterEach, describe, expect, it, vi } from 'vitest';

async function loadJsonLd() {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://my-blog.com');
  return import('./jsonLd');
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('websiteJsonLd', () => {
  it('사이트 이름·URL·언어 포함', async () => {
    const { websiteJsonLd } = await loadJsonLd();

    expect(websiteJsonLd()).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: '블로그 이름',
      url: 'https://my-blog.com',
      inLanguage: 'ko-KR',
    });
  });
});

describe('blogPostingJsonLd', () => {
  const params = {
    title: '제목',
    description: '설명',
    path: '/posts/hello',
    image: '/_static/mdx/posts/og/hello.jpg',
    publishedTime: '2026-01-01T00:00:00.000Z',
    modifiedTime: '2026-01-02T00:00:00.000Z',
    section: '일반',
    keywords: ['a', 'b'],
  };

  it('Article 리치 결과 필수·권장 필드 포함 (절대 URL)', async () => {
    const { blogPostingJsonLd } = await loadJsonLd();

    expect(blogPostingJsonLd(params)).toMatchObject({
      '@type': 'BlogPosting',
      headline: '제목',
      url: 'https://my-blog.com/posts/hello',
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://my-blog.com/posts/hello' },
      image: ['https://my-blog.com/_static/mdx/posts/og/hello.jpg'],
      datePublished: '2026-01-01T00:00:00.000Z',
      dateModified: '2026-01-02T00:00:00.000Z',
      author: { '@type': 'Person', name: '작성자', url: 'https://my-blog.com/about' },
      articleSection: '일반',
      keywords: 'a, b',
    });
  });

  it('선택 필드가 없으면 생략', async () => {
    const { blogPostingJsonLd } = await loadJsonLd();

    const jsonLd = blogPostingJsonLd({ ...params, image: undefined, section: undefined, keywords: [] });

    expect(jsonLd).not.toHaveProperty('image');
    expect(jsonLd).not.toHaveProperty('articleSection');
    expect(jsonLd).not.toHaveProperty('keywords');
  });
});

describe('breadcrumbJsonLd', () => {
  it('순서대로 position 부여, 절대 URL', async () => {
    const { breadcrumbJsonLd } = await loadJsonLd();

    expect(
      breadcrumbJsonLd([
        { name: '홈', path: '/' },
        { name: '일반', path: '/categories/general' },
      ]).itemListElement,
    ).toEqual([
      { '@type': 'ListItem', position: 1, name: '홈', item: 'https://my-blog.com' },
      { '@type': 'ListItem', position: 2, name: '일반', item: 'https://my-blog.com/categories/general' },
    ]);
  });
});
