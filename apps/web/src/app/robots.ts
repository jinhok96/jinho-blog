import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/core/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // 색인 대상이 아닌 경로. 정렬/페이지 쿼리는 canonical로 정리되므로 차단하지 않는다
        // `/_next/`는 렌더링에 필요한 JS/CSS이므로 차단하지 않는다 (구글 렌더링 가이드)
        disallow: ['/api/', '/_static/registry.json'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
