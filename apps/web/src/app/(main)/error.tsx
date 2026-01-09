'use client';

import { ErrorFallback } from '@/core/ui';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  console.error('error', error);
  return (
    <ErrorFallback
      error={error}
      reset={reset}
    />
  );
}
