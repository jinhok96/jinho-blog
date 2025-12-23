import { type RefObject, useEffect } from 'react';

export function useOutsideClickEffect<T extends HTMLElement>(
  callback: () => void,
  refDeps: RefObject<T | null>[],
): void {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      const isClickInside = refDeps.some(ref => ref.current?.contains(e.target as Node));

      if (isClickInside) return;

      callback();
    };

    document.addEventListener('click', listener);

    return () => {
      document.removeEventListener('click', listener);
    };
  }, [...refDeps, callback]);
}
