import { useRef } from 'react';

import { useUnmountEffect } from 'motion/react';

export function useTimeoutRef() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const set = (callback: () => void, delay: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(callback, delay);
  };

  const clear = () => {
    if (!timeoutRef.current) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  useUnmountEffect(clear);

  return { set, clear };
}
