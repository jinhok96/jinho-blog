import { describe, expect, it } from 'vitest';

import { SITE_DESCRIPTION, SITE_LANGUAGE, SITE_NAME } from '@/core/config';

import manifest, { dynamic } from './manifest';

describe('manifest', () => {
  it('사이트 설정 기반 매니페스트 + SVG 아이콘', () => {
    expect(manifest()).toMatchObject({
      name: SITE_NAME,
      short_name: SITE_NAME,
      description: SITE_DESCRIPTION,
      lang: SITE_LANGUAGE,
      start_url: '/',
      icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
    });
  });

  it('정적 export용 force-static 설정', () => {
    expect(dynamic).toBe('force-static');
  });
});
