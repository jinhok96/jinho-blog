import { describe, expect, it } from 'vitest';

import { isExternalHref, isInternalPageLink, isInternalPath } from './link';

describe('isExternalHref', () => {
  it.each(['https://example.com', 'http://example.com/path', 'HTTPS://EXAMPLE.COM', '//cdn.example.com/a.js'])(
    '%j → true',
    href => {
      expect(isExternalHref(href)).toBe(true);
    },
  );

  it.each(['/posts/welcome', '#section', 'mailto:me@example.com', 'tel:010', 'posts/relative', ''])(
    '%j → false',
    href => {
      expect(isExternalHref(href)).toBe(false);
    },
  );
});

describe('isInternalPath', () => {
  it.each(['/', '/posts/welcome', '/categories/general#top'])('%j → true', href => {
    expect(isInternalPath(href)).toBe(true);
  });

  it.each(['//cdn.example.com', 'https://example.com', '#section', 'mailto:me@example.com', ''])('%j → false', href => {
    expect(isInternalPath(href)).toBe(false);
  });
});

describe('isInternalPageLink', () => {
  it.each(['/', '/posts/hello', '/categories/general?x=1', '/about#contact'])('%s → 페이지 링크', href => {
    expect(isInternalPageLink(href)).toBe(true);
  });

  it.each(['/rss.xml', '/_static/mdx/posts/files/guide.pdf', '/sitemap.xml?v=1', '//cdn.example.com/a', '#top'])(
    '%s → 페이지 아님 (일반 <a>)',
    href => {
      expect(isInternalPageLink(href)).toBe(false);
    },
  );
});
