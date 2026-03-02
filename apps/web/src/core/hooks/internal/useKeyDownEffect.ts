import { useEffect, useEffectEvent } from 'react';

export function useKeyDownEffect(keys: string[], callback: (e: KeyboardEvent) => void) {
  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (!keys.includes(e.key)) return;
    callback(e);
  });

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
