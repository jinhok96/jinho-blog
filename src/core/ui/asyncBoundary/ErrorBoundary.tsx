'use client';

import { type ComponentType, createElement, forwardRef, type ReactNode, useImperativeHandle, useRef } from 'react';
import {
  ErrorBoundary as ReactErrorBoundary,
  type ErrorBoundaryProps as ReactErrorBoundaryProps,
  type FallbackProps,
} from 'react-error-boundary';

export type ErrorFallbackProps = Omit<FallbackProps, 'resetErrorBoundary'> & {
  reset: FallbackProps['resetErrorBoundary'];
};

export type ErrorBoundaryRef = {
  reset: ErrorFallbackProps['reset'];
};

export type ErrorBoundaryProps = Pick<ReactErrorBoundaryProps, 'onError' | 'onReset' | 'resetKeys' | 'children'> & {
  fallback?: ReactNode | ComponentType<ErrorFallbackProps>;
};

export const ErrorBoundary = forwardRef<ErrorBoundaryRef, ErrorBoundaryProps>(function ErrorBoundary(
  { fallback, ...props },
  ref,
) {
  const resetRef = useRef<(() => void) | undefined>(undefined);

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (resetRef.current) resetRef.current();
    },
  }));

  if (typeof fallback === 'function') {
    const fallbackRender: ReactErrorBoundaryProps['fallbackRender'] = ({ resetErrorBoundary: reset, ...props }) => {
      resetRef.current = reset;
      return createElement(fallback, { ...props, reset });
    };

    return (
      <ReactErrorBoundary
        fallbackRender={fallbackRender}
        {...props}
      />
    );
  }

  return (
    <ReactErrorBoundary
      fallback={fallback}
      {...props}
    />
  );
});
