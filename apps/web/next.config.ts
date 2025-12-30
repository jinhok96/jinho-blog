import type { NextConfig } from 'next';

import { withRoutes } from '@jinho-blog/nextjs-routes';

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
    serverComponentsExternalPackages: ['jsdom', 'parse5'],
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
