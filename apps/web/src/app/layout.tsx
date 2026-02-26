import type { Metadata } from 'next';
import type { PropsWithChildren, ReactNode } from 'react';

import localFont from 'next/font/local';

import { Analytics } from '@vercel/analytics/next';

import { routes } from '@jinho-blog/nextjs-routes';

import { PORTAL } from '@/core/config';
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
});

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
        <ThemeStoreProvider theme="system">
          <div id={PORTAL.leftSidebar} />

          <main className="relative flex-col-center h-fit w-full flex-1">
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
