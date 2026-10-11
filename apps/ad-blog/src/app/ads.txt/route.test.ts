import { describe, expect, it } from 'vitest';

import { dynamic, GET } from './route';

describe('ads.txt', () => {
  it('정적 생성 + text/plain 응답', async () => {
    const response = GET();

    expect(dynamic).toBe('force-static');
    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
    expect(await response.text()).toMatch(/^# AdSense publisher ID not set/);
  });
});
