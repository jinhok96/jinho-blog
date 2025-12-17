import { useLayoutEffect } from 'react';

export function useMountEffect(callback: () => void): void {
  useLayoutEffect(() => {
    callback();
  }, []);
}
