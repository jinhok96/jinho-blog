import { describe, expect, it } from 'vitest';

import { buildAdsTxt } from '@/core/ads';
import { ADSENSE_CLIENT } from '@/core/config';

import { dynamic, GET } from './route';

describe('ads.txt', () => {
  it('정적 생성 + text/plain 응답', async () => {
    const response = GET();

    expect(dynamic).toBe('force-static');
    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
    // 내용 형식은 buildAdsTxt 테스트에서 검증, 여기서는 설정된 게시자 ID로 생성하는지만 확인
    expect(await response.text()).toBe(buildAdsTxt(ADSENSE_CLIENT));
  });
});
