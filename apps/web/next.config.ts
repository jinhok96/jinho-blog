import type { NextConfig } from 'next';

import fs from 'fs';
import path from 'path';

import { withRoutes } from '@jinho-blog/nextjs-routes';

// 모노레포 루트 기준 라이브러리 MDX 디렉토리 (빌드 시 apps/web에서 실행)
const LIBRARIES_CONTENT_DIR = path.resolve(process.cwd(), '../../content/mdx/libraries');

/**
 * 과거 camelCase 슬러그(`/libraries/createSelectors`)로 색인된 URL을
 * 현재 kebab-case 슬러그(`/libraries/create-selectors`)로 301 리다이렉트
 */
function getLegacyLibraryRedirects() {
  if (!fs.existsSync(LIBRARIES_CONTENT_DIR)) return [];

  return fs
    .readdirSync(LIBRARIES_CONTENT_DIR)
    .filter(fileName => fileName.endsWith('.mdx'))
    .map(fileName => fileName.replace(/\.mdx$/, ''))
    .map(slug => ({ slug, legacySlug: slug.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase()) }))
    .filter(({ slug, legacySlug }) => slug !== legacySlug)
    .map(({ slug, legacySlug }) => ({
      source: `/libraries/${legacySlug}`,
      destination: `/libraries/${slug}`,
      permanent: true,
    }));
}

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  images: {
    localPatterns: [{ pathname: '/images/**' }, { pathname: '/icons/**' }, { pathname: '/_static/**' }],
    remotePatterns: [{ hostname: 'vercel.com' }, { hostname: 'developer.chrome.com' }, { hostname: 'web.dev' }],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 320, 384, 512],
  },

  async redirects() {
    return getLegacyLibraryRedirects();
  },

  // turbopack 설정
  turbopack: {
    rules: {
      // svgr 설정
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default withRoutes(nextConfig);
