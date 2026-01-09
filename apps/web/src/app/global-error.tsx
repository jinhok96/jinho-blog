'use client';

import localFont from 'next/font/local';

import { PORTAL } from '@/core/config';
import { INIT_THEME_SCRIPT, ThemeStoreProvider } from '@/core/store';
import { ErrorFallback } from '@/core/ui';
import { cn } from '@/core/utils';

import '@/styles/globals.css';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '300 800',
});

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
    >
      <head>
        {/* FOUC 방지: 페이지 로드 시 테마 즉시 적용 */}
        <script dangerouslySetInnerHTML={{ __html: INIT_THEME_SCRIPT }} />
      </head>

      <body className={cn('flex-row-start size-full min-h-screen flex-1 antialiased', pretendard.className)}>
        <ThemeStoreProvider theme="system">
          <div id={PORTAL.leftSidebar} />

          <main className="relative flex-col-center size-full flex-1">
            <ErrorFallback
              error={error}
              reset={reset}
            />
          </main>

          <div id={PORTAL.rightSidebar} />
        </ThemeStoreProvider>
      </body>
    </html>
  );
}
