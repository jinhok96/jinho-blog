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
    const target = targetRef.current;
    if (!target) return;

    const { root, rootMargin, threshold, onlyOnce } = optionsRef.current || {};

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && onlyOnce) {
          // 한 번만 감지 후 추적 종료
          setIsIntersecting(true);
          observerRef.current?.disconnect();
          return;
        }

        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: threshold || 0.1,
        root,
        rootMargin,
      },
    );

    observerRef.current.observe(target);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  return [targetRef, isIntersecting];
}
