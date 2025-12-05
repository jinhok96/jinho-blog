import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },

  cacheComponents: true,

  // turbopack 설정
  turbopack: {
    resolveAlias: {
      // 브라우저에서 Node.js 네이티브 모듈을 참조하지 않고 빈 모듈을 로드하도록 설정
      fs: {
        browser: './empty.ts',
      },
    },
    rules: {
      // svgr 설정
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
