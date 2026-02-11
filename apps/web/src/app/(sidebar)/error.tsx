'use client';

import { ErrorFallback } from '@/core/ui';

import { Header } from '@/modules/header';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return (
    <>
      <Header />

      <ErrorFallback
        error={error}
        reset={reset}
      />
    </>
  );
}
