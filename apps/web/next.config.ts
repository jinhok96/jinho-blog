import type { NextConfig } from 'next';

import { withRoutes } from '@jinho-blog/nextjs-routes';

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  images: {
    localPatterns: [{ pathname: '/images/**' }, { pathname: '/icons/**' }, { pathname: '/_static/**' }],
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
