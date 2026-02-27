import { useLayoutEffect } from 'react';

export function useLayoutMountEffect(callback: () => void): void {
  useLayoutEffect(() => {
    callback();
  }, []);
}
