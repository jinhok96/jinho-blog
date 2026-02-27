import type { NextConfig } from 'next';

import { withRoutes } from '@jinho-blog/nextjs-routes';

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  images: {
    localPatterns: [{ pathname: '/images/**' }, { pathname: '/icons/**' }, { pathname: '/_static/**' }],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 320, 384, 512],
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
