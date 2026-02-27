import type { NextConfig } from 'next';

import { withRoutes } from '@jinho-blog/nextjs-routes';

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  serverExternalPackages: ['@resvg/resvg-js', 'sharp', 'satori'],

  images: {
    localPatterns: [{ pathname: '/api/og' }, { pathname: '/images/**' }, { pathname: '/_static/**' }],
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
