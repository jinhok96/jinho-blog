import { type RefObject, useEffect, useEffectEvent } from 'react';

export function useOutsideClickEffect<T extends HTMLElement>(
  callback: () => void,
  refDeps: RefObject<T | null>[],
): void {
  const onOutsideClick = useEffectEvent((e: MouseEvent) => {
    const isClickInside = refDeps.some(ref => ref.current?.contains(e.target as Node));
    if (isClickInside) return;
    callback();
  });

  useEffect(() => {
    document.addEventListener('click', onOutsideClick);
    return () => {
      document.removeEventListener('click', onOutsideClick);
    };
  }, []);
}
