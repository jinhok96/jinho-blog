import { describe, expect, it } from 'vitest';

import { getReadingMinutes } from './readingTime';

describe('getReadingMinutes', () => {
  it('짧은 글은 최소 1분', () => {
    expect(getReadingMinutes('안녕하세요')).toBe(1);
    expect(getReadingMinutes('')).toBe(1);
  });

  it('공백 제외 500자당 1분 (올림)', () => {
    expect(getReadingMinutes('가'.repeat(500))).toBe(1);
    expect(getReadingMinutes('가'.repeat(501))).toBe(2);
    expect(getReadingMinutes('가 '.repeat(1000))).toBe(2);
  });

  it('코드 블록, 이미지, 링크 URL, 마크다운 기호는 제외', () => {
    const content = [
      '## 제목',
      '```ts',
      'x'.repeat(2000),
      '```',
      '![대체 텍스트](/_static/mdx/posts/images/a.webp)',
      '[링크](https://example.com/very/long/url)',
    ].join('\n');

    expect(getReadingMinutes(content)).toBe(1);
  });
});
