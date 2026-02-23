import type { Metadata } from 'next';

import localFont from 'next/font/local';

import { routes } from '@jinho-blog/nextjs-routes';

import { SITE_URL } from '@/core/config';
import { INIT_THEME_SCRIPT, ThemeStoreProvider } from '@/core/store';
import { LinkButton } from '@/core/ui';
import { cn } from '@/core/utils';

import '@/styles/globals.css';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '300 800',
});

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'Personal blog and portfolio',
  alternates: {
    canonical: SITE_URL,
  },
};

export default function GlobalNotFound() {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className="scroll-smooth"
    >
      <head>
        {/* FOUC 방지: 페이지 로드 시 테마 즉시 적용 */}
        <script dangerouslySetInnerHTML={{ __html: INIT_THEME_SCRIPT }} />
      </head>

      <body className={cn('flex-row-start size-full min-h-screen flex-1 antialiased', pretendard.className)}>
        <ThemeStoreProvider theme="system">
          <main className="relative flex-col-center h-fit w-full flex-1">
            <div className={`container flex-col-center gap-6 p-layout`}>
              <div className="text-center">
                <h2 className="mb-3 font-title-24">요청하신 페이지를 찾을 수 없습니다</h2>
                <p className="leading-relaxed text-gray-5">
                  페이지가 존재하지 않거나 사용할 수 없습니다.
                  <br />
                  입력하신 주소가 정확한지 다시 한 번 확인해주세요.
                </p>
              </div>

              <LinkButton
                href={routes({ pathname: '/' })}
                replace
                hard
                color="blue"
                size="md"
              >
                홈페이지로 가기
              </LinkButton>
            </div>
          </main>
        </ThemeStoreProvider>
      </body>
    </html>
  );
}
