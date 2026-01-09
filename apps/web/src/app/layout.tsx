import type { Metadata } from 'next';
import type { PropsWithChildren, ReactNode } from 'react';

import localFont from 'next/font/local';

import { PORTAL, SITE_URL } from '@/core/config';
import { INIT_THEME_SCRIPT, ThemeStoreProvider } from '@/core/store';
import { cn } from '@/core/utils';

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

type Props = Readonly<
  PropsWithChildren<{
    modal?: ReactNode;
  }>
>;

export default function RootLayout({ children, modal }: Props) {
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
          <div id={PORTAL.leftSidebar} />

          <main className="relative flex-col-center h-fit w-full flex-1">
            {children}
            {modal}
          </main>

          <div id={PORTAL.rightSidebar} />
        </ThemeStoreProvider>
      </body>
    </html>
  );
}
