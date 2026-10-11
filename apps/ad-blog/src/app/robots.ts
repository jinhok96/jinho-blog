import type { MetadataRoute } from 'next';

import { SITE_INDEXABLE } from '@/core/config';
import { absoluteUrl } from '@/core/seo';

/** 정적 export(`output: 'export'`)는 빌드 시 robots.txt 파일로 생성하도록 명시해야 함 */
export const dynamic = 'force-static';

/**
 * robots.txt
 * - 도메인 미설정(placeholder) 상태로 배포되면 전체 크롤링 차단 (페이지 메타도 noindex)
 * - `/_next/`는 렌더링에 필요한 JS/CSS이므로 차단하지 않음
 */
export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXABLE) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
