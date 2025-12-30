import { useLayoutEffect } from 'react';

export function useBodyScrollLock(isLocked: boolean): void {
  useLayoutEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isLocked]);
}
