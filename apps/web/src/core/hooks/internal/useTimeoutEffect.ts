import { useEffect, useEffectEvent } from 'react';

export function useTimeoutEffect(callback: () => void, delay: number) {
  const onTimeout = useEffectEvent(callback);
  useEffect(() => {
    const timeout = setTimeout(onTimeout, delay);
    return () => clearTimeout(timeout);
  }, [delay]);
}
