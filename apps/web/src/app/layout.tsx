import type { Metadata, Viewport } from 'next';
import type { PropsWithChildren, ReactNode } from 'react';

import localFont from 'next/font/local';

import { Analytics } from '@vercel/analytics/next';

import { routes } from '@jinho-blog/nextjs-routes';

import { MAIN_CONTENT_ID, PORTAL } from '@/core/config';
import { INIT_THEME_SCRIPT, ThemeStoreProvider } from '@/core/store';
import { JsonLd } from '@/core/ui';
import { cn, generatePageMetadata, generateWebSiteJsonLd } from '@/core/utils';

import '@/styles/globals.css';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '300 800',
  preload: true,
});

export const metadata: Metadata = generatePageMetadata({
  path: routes({ pathname: '/' }),
  titleMode: 'template',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'light dark',
};

type Props = Readonly<
  PropsWithChildren<{
    modal?: ReactNode;
  }>
>;

export default function RootLayout({ children, modal }: Props) {
  const jsonLd = generateWebSiteJsonLd();

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
        {/* JSON-LD: WebSite */}
        <JsonLd jsonLd={jsonLd} />
      </head>

      <body className={cn('flex-row-start size-full min-h-screen flex-1 antialiased', pretendard.className)}>
        {/* 본문 바로가기: 포커스를 받을 때만 노출 */}
        <a
          href={`#${MAIN_CONTENT_ID}`}
          className={`
            sr-only
            focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-modal focus:rounded-lg focus:bg-blue-7
            focus:px-4 focus:py-2 focus:text-white
          `}
        >
          본문 바로가기
        </a>

        <ThemeStoreProvider theme="system">
          <div id={PORTAL.leftSidebar} />

          <main
            id={MAIN_CONTENT_ID}
            className="relative flex-col-center h-fit w-full flex-1"
          >
            {children}
            {modal}
          </main>

          <div id={PORTAL.rightSidebar} />
        </ThemeStoreProvider>

        {/* Vercel Web Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
