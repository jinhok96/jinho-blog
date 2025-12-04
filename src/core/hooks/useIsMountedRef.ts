import { type RefObject, useLayoutEffect, useRef } from 'react';

export function useIsMounted(): RefObject<boolean> {
  const isMountedRef = useRef(false);

  useLayoutEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef;
}
