import { useEffect, useRef } from 'react';

export function useKeyDownEffect(keys: string[], callback: (e: KeyboardEvent) => void) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!keys.includes(e.key)) return;
      callbackRef.current(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys.join()]);
}
