import { type DependencyList, useEffect } from 'react';

export function useTimeoutEffect(callback: () => void, delay: number, deps: DependencyList = []) {
  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, deps);
}
