import type { Metadata } from 'next';

import Link from 'next/link';

import { HOME_PATH } from '@/core/routes';
import { Container } from '@/core/ui';

// 404 응답에는 Next.js가 noindex를 자동 추가
export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
  description: '요청한 페이지가 없거나 주소가 바뀌었습니다.',
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
      <p className="text-sm font-semibold text-accent">404</p>
      <h1
        className={`
          mt-2 text-2xl font-bold tracking-tight
          sm:text-3xl
        `}
      >
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-3 text-pretty text-muted">요청한 페이지가 없거나 주소가 바뀌었을 수 있습니다.</p>
      <Link
        href={HOME_PATH}
        className={`
          mt-8 inline-flex min-h-11 items-center rounded-md bg-foreground px-5 font-medium text-background
          hover:opacity-90
        `}
      >
        홈으로 돌아가기
      </Link>
    </Container>
  );
}
