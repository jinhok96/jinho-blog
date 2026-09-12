import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/core/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 빌드 산출물(전체 MDX 원문 JSON) — 색인 대상이 아님
      disallow: '/_static/registry.json',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
