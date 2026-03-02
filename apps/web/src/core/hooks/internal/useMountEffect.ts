import { useEffect, useEffectEvent } from 'react';

export function useMountEffect(callback: () => void): void {
  const onMount = useEffectEvent(callback);
  useEffect(() => {
    onMount();
  }, []);
}
