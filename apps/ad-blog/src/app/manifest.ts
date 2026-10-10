import type { MetadataRoute } from 'next';

import { SITE_DESCRIPTION, SITE_LANGUAGE, SITE_NAME } from '@/core/config';

/** 정적 export(`output: 'export'`)는 빌드 시 manifest.webmanifest 파일로 생성하도록 명시해야 함 */
export const dynamic = 'force-static';

/**
 * 웹 앱 매니페스트
 * - 아이콘은 app/icon.svg (Next.js가 `/icon.svg`로 제공)
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    lang: SITE_LANGUAGE,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
