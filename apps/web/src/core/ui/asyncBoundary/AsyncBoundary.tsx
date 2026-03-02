'use client';

import { type ReactNode, type Ref, Suspense } from 'react';

import { ErrorBoundary, type ErrorBoundaryProps, type ErrorBoundaryRef } from '@/core/ui/asyncBoundary/ErrorBoundary';

type Props = Omit<ErrorBoundaryProps, 'fallback'> & {
  errorFallback?: ErrorBoundaryProps['fallback'];
  loadingFallback?: ReactNode;
  ref?: Ref<ErrorBoundaryRef>;
};

export function AsyncBoundary({
  children,
  errorFallback = null,
  loadingFallback,
  onError,
  onReset,
  resetKeys,
  ref,
}: Props) {
  return (
    <ErrorBoundary
      ref={ref}
      fallback={errorFallback}
      onError={onError}
      onReset={onReset}
      resetKeys={resetKeys}
    >
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
