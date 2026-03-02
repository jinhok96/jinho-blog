import { useEffectEvent, useLayoutEffect } from 'react';

export function useLayoutMountEffect(callback: () => void): void {
  const onMount = useEffectEvent(callback);
  useLayoutEffect(() => {
    onMount();
  }, []);
}
