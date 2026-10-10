import { describe, expect, it } from 'vitest';

import { isExternalHref, isInternalPath } from './link';

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
