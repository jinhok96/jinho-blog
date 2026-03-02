import { useSyncExternalStore } from 'react';

export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true, // true on client
    () => false, // false on server
  );
}
