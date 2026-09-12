import type { MetadataRoute } from 'next';

import { SITE_DESCRIPTION, SITE_LANGUAGE, SITE_NAME } from '@/core/config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'Jinho',
    description: SITE_DESCRIPTION,
    lang: SITE_LANGUAGE,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#155dfc',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
