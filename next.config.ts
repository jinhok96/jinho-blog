import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },

  cacheComponents: true,

  // turbopack 설정
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // webpack 설정 -> 빌드에서도 turbopack을 사용하므로 필요없음
  // webpack: config => {
  //   // @ts-expect-error rule 타입 에러 무시
  //   const fileLoaderRule = config.module.rules.find(rule => rule.test?.test?.('.svg'));

  //   config.module.rules.push(
  //     {
  //       ...fileLoaderRule,
  //       test: /\.svg$/i,
  //       resourceQuery: /url/,
  //     },
  //     {
  //       test: /\.svg$/i,
  //       issuer: fileLoaderRule.issuer,
  //       resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
  //       use: [
  //         {
  //           loader: '@svgr/webpack',
  //           options: {
  //             typescript: true,
  //             ext: 'tsx',
  //           },
  //         },
  //       ],
  //     },
  //   );

  //   fileLoaderRule.exclude = /\.svg$/i;
  //   return config;
  // },
};

export default nextConfig;
