import { useEffect } from 'react';

export function useMountEffect(callback: () => void): void {
  useEffect(() => {
    callback();
  }, []);
}
