import type { ReactNode } from 'react';

// boolean
export function Show(props: {
  when: boolean;
  children: ReactNode | (() => ReactNode);
  fallback?: ReactNode | (() => ReactNode);
}): ReactNode;

// truthy
export function Show<T>(props: {
  when: T | null | undefined | false | 0 | '';
  children: ReactNode | ((value: NonNullable<T>) => ReactNode);
  fallback?: ReactNode | (() => ReactNode);
}): ReactNode;

// boolean | truthy
export function Show<T>({
  children,
  when,
  fallback = null,
}: {
  when: T | boolean | null | undefined;
  children: ReactNode | ((value: NonNullable<T>) => ReactNode);
  fallback?: ReactNode | (() => ReactNode);
}): ReactNode {
  // Truthy 체크 (null, undefined, false, 0, '' 등을 false로 처리)
  const isTruthy = Boolean(when);

  if (!isTruthy) {
    // fallback 처리
    return typeof fallback === 'function' ? fallback() : fallback;
  }

  // children 처리 (truthy일 때)
  if (typeof children === 'function') {
    return children(when as NonNullable<T>);
  }

  return <>{children}</>;
}
