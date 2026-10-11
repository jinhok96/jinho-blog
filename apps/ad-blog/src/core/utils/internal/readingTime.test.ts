import { describe, expect, it } from 'vitest';

import { getReadingMinutes } from './readingTime';

describe('getReadingMinutes', () => {
  it('짧은 글은 최소 1분', () => {
    expect(getReadingMinutes('Hello world')).toBe(1);
    expect(getReadingMinutes('')).toBe(1);
  });

  it('230단어당 1분 (올림)', () => {
    expect(getReadingMinutes('word '.repeat(230))).toBe(1);
    expect(getReadingMinutes('word '.repeat(231))).toBe(2);
    expect(getReadingMinutes('word\n'.repeat(460))).toBe(2);
  });

  it('코드 블록, 이미지, 링크 URL, 마크다운 기호는 제외', () => {
    const content = [
      '## Title',
      '```ts',
      'x '.repeat(2000),
      '```',
      '![alt text](/_static/mdx/posts/images/a.webp)',
      '[link](https://example.com/very/long/url)',
      '- - - | | |',
    ].join('\n');

    expect(getReadingMinutes(content)).toBe(1);
  });
});
