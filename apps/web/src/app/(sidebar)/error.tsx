'use client';

import { ErrorFallback } from '@/core/ui';

import { Header } from '@/modules/header';

type ErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function Error({ error, retry }: ErrorProps) {
  return (
    <>
      <Header />

      <ErrorFallback
        error={error}
        reset={retry}
      />
    </>
  );
}
