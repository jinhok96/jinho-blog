import { useEffect } from 'react';

export function useKeyDownEffect(keys: string[], callback: (e: KeyboardEvent) => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!keys.includes(e.key)) return;
      callback(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, callback]);
}
