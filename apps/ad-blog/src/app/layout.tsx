import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/core/config';
import { SkipLink } from '@/core/ui';

import { Footer } from '@/modules/footer';
import { Header } from '@/modules/header';

import '@/styles/globals.css';

const MAIN_CONTENT_ID = 'main-content';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
};

export const viewport: Viewport = {
  // globals.css의 --color-background와 동일
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1115' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-dvh flex-col">
        <SkipLink href={`#${MAIN_CONTENT_ID}`} />
        <Header />
        {/* 본문 바로가기 대상: tabIndex로 포커스 이동 보장 */}
        <main
          id={MAIN_CONTENT_ID}
          tabIndex={-1}
          className="flex-1 outline-none"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
