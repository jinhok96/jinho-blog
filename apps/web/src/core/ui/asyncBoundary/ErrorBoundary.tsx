'use client';

import { type ComponentType, createElement, type ReactNode, type Ref, useImperativeHandle, useRef } from 'react';
import {
  type FallbackProps,
  ErrorBoundary as ReactErrorBoundary,
  type ErrorBoundaryProps as ReactErrorBoundaryProps,
} from 'react-error-boundary';

export type ErrorFallbackProps = Omit<FallbackProps, 'resetErrorBoundary'> & {
  reset: FallbackProps['resetErrorBoundary'];
};

export type ErrorBoundaryRef = {
  reset: ErrorFallbackProps['reset'];
};

export type ErrorBoundaryProps = Pick<ReactErrorBoundaryProps, 'onError' | 'onReset' | 'resetKeys' | 'children'> & {
  fallback?: ReactNode | ComponentType<ErrorFallbackProps>;
  ref?: Ref<ErrorBoundaryRef>;
};

export function ErrorBoundary({ fallback, ref, ...props }: ErrorBoundaryProps) {
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
}
