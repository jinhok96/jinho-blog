import type { NextConfig } from 'next';

import { withRoutes } from '@jinho-blog/nextjs-routes';

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },

  images: {
    localPatterns: [{ pathname: '/api/og' }, { pathname: '/images/**' }],
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
