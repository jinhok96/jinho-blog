import { useEffect } from 'react';

export function useUnmountEffect(callback: () => void): void {
  useEffect(() => {
    return () => callback();
  }, []);
}
