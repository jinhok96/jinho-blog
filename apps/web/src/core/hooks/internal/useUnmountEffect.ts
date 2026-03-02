import { useEffect, useEffectEvent } from 'react';

export function useUnmountEffect(callback: () => void): void {
  const onUnmount = useEffectEvent(callback);
  useEffect(() => {
    return () => onUnmount();
  }, []);
}
