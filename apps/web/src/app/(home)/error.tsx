'use client';

import { ErrorFallback } from '@/core/ui';

type ErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function Error({ error, retry }: ErrorProps) {
  return (
    <ErrorFallback
      error={error}
      reset={retry}
    />
  );
}
