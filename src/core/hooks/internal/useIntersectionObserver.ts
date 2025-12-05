import { type RefObject, useEffect, useRef, useState } from 'react';

type IntersectionObserverOptions = IntersectionObserverInit & {
  onlyOnce?: boolean;
  initValue?: boolean;
};

export function useIntersectionObserver<T extends HTMLElement>(
  options?: IntersectionObserverOptions,
): [RefObject<T | null>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(options?.initValue || false);

  const targetRef = useRef<T>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const currentOptions = optionsRef.current;
    if (isIntersecting && currentOptions?.onlyOnce) return;

    const { root, rootMargin, threshold } = currentOptions || {};

    observerRef.current = new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting), {
      threshold: threshold || 0.1,
      root,
      rootMargin,
    });

    observerRef.current.observe(target);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [isIntersecting]);

  return [targetRef, isIntersecting];
}
