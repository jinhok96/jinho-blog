import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 완전 정적 사이트: `next build` 결과(out/)를 정적 호스팅에 그대로 배포
  output: 'export',
  images: {
    // 정적 export는 기본 이미지 최적화 로더를 지원하지 않음
    unoptimized: true,
  },
};

export default nextConfig;
