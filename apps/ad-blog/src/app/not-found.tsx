import type { Metadata } from 'next';

import Link from 'next/link';

import { NoAds } from '@/core/ads';
import { HOME_PATH } from '@/core/routes';
import { Container } from '@/core/ui';

// 404 응답에는 Next.js가 noindex를 자동 추가
export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The page you requested does not exist or has moved.',
};

export default function NotFound() {
  return (
    <Container
      size="narrow"
      className={`
        py-20 text-center
        sm:py-28
      `}
    >
      {/* 오류 페이지에는 광고 금지 (AdSense 정책) → 자동 광고 스크립트를 로드하지 않음 */}
      <NoAds />
      <p className="text-sm font-semibold text-accent">404</p>
      <h1
        className={`
          mt-2 text-2xl font-bold tracking-tight
          sm:text-3xl
        `}
      >
        Page not found
      </h1>
      <p className="mt-3 text-pretty text-muted">The page you requested does not exist or may have moved.</p>
      <Link
        href={HOME_PATH}
        className={`
          mt-8 inline-flex min-h-11 items-center rounded-md bg-foreground px-5 font-medium text-background
          hover:opacity-90
        `}
      >
        Back to home
      </Link>
    </Container>
  );
}
