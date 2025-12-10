import type { ReactNode } from 'react';

type BooleanCase = 'true' | 'false';

// string
export function Switch<T extends string>(props: {
  value: T | null | undefined;
  cases: Partial<Record<T, ReactNode>>;
  fallback?: ReactNode;
}): ReactNode;

// boolean
export function Switch(props: {
  value: boolean | null | undefined;
  cases: Partial<Record<BooleanCase, ReactNode>>;
  fallback?: ReactNode;
}): ReactNode;

// string | boolean
export function Switch<T extends string>({
  value,
  cases,
  fallback = null,
}: {
  value: T | boolean | null | undefined;
  cases: Record<string, ReactNode>;
  fallback?: ReactNode;
}): ReactNode {
  if (value === null || value === undefined) return fallback;

  if (typeof value === 'boolean') {
    const key = value ? 'true' : 'false';
    const result = cases[key];
    return result ?? fallback;
  }

  const result = cases[value];
  return result ?? fallback;
}
