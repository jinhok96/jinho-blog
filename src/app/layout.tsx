import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import localFont from 'next/font/local';

import { PORTAL, SITE_URL } from '@/core/config';
import { INIT_THEME_SCRIPT, ThemeStoreProvider } from '@/core/store';
import { cn } from '@/core/utils';

import { Header } from '@/modules/header';

import '@/styles/globals.css';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '300 800',
});

export const metadata: Metadata = {
  title: 'Jinho Blog',
  description: 'Personal blog and portfolio',
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
    >
      <head>
        {/* FOUC 방지: 페이지 로드 시 테마 즉시 적용 */}
        <script dangerouslySetInnerHTML={{ __html: INIT_THEME_SCRIPT }} />
      </head>

      <body className={cn('relative flex-col-center size-full min-h-screen antialiased', pretendard.className)}>
        <ThemeStoreProvider theme="system">
          <Header />

          <main className="flex-col-center size-full flex-1 py-layout">{children}</main>

          <div id={PORTAL.headerDrawer} />
        </ThemeStoreProvider>
      </body>
    </html>
  );
}
