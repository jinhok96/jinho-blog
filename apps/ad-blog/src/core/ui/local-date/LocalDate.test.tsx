import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it } from 'vitest';

import { LocalDate } from './LocalDate';

describe('LocalDate', () => {
  it('정적 HTML은 UTC 날짜 + ISO dateTime (hydration 후 방문자 시간대로 다시 렌더링)', () => {
    const html = renderToStaticMarkup(
      <LocalDate
        dateTime="2026-10-18T21:40:00.000Z"
        className="text-xs"
      />,
    );

    expect(html).toBe('<time dateTime="2026-10-18T21:40:00.000Z" class="text-xs">Oct 18, 2026</time>');
  });
});
