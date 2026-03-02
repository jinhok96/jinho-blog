import { useCallback, useEffect, useRef } from 'react';

export function useBodyScrollLock(): {
  lock: () => void;
  unlock: () => void;
} {
  const scrollYRef = useRef<number | null>(null);

  const lock = useCallback(() => {
    // 페이지에 스크롤이 있는지 확인
    const hasScroll = document.documentElement.scrollHeight > document.documentElement.clientHeight;
    if (!hasScroll) return;

    // 이미 잠긴 경우 중복 실행 방지
    if (scrollYRef.current !== null) return;

    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.overflowY = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    scrollYRef.current = scrollY;
  }, []);

  const unlock = useCallback(() => {
    if (scrollYRef.current === null) return;

    const scrollY = scrollYRef.current;
    scrollYRef.current = null;

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.overflowY = '';
    document.body.style.paddingRight = '';

    window.scrollTo({ top: scrollY, behavior: 'instant' });
  }, []);

  useEffect(() => {
    return () => unlock();
  }, [unlock]);

  return { lock, unlock };
}
