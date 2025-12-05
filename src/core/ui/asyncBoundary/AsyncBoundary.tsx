'use client';

import { forwardRef, type ReactNode, Suspense } from 'react';

import { ErrorBoundary, type ErrorBoundaryProps, type ErrorBoundaryRef } from '@/core/ui/asyncBoundary/ErrorBoundary';

export type AsyncBoundaryRef = ErrorBoundaryRef;

type Props = Omit<ErrorBoundaryProps, 'fallback'> & {
  errorFallback?: ErrorBoundaryProps['fallback'];
  loadingFallback?: ReactNode;
};

export const AsyncBoundary = forwardRef<AsyncBoundaryRef, Props>(function AsyncBoundary(
  { children, errorFallback = null, loadingFallback, onError, onReset, resetKeys },
  ref,
) {
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
});
