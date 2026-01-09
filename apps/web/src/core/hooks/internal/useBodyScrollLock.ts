import { useLayoutEffect } from 'react';

/**
 * 스크롤을 방지하고 현재 위치 반환
 */
const lock = (): number => {
  const scrollY = window.scrollY;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`; // 현재 스크롤 위치
  document.body.style.overflowY = 'hidden';
  document.body.style.paddingRight = `${scrollbarWidth}px`;

  return scrollY;
};

/**
 * 스크롤을 허용하고 이전 스크롤 위치 복구
 */
const unlock = (scrollY: number) => {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.overflowY = '';
  document.body.style.paddingRight = '';

  window.scrollTo({ top: scrollY, behavior: 'instant' });
};

export function useBodyScrollLock(isLocked: boolean): void {
  useLayoutEffect(() => {
    if (!isLocked) return;

    // 페이지에 스크롤이 있는지 확인
    const hasScroll = document.documentElement.scrollHeight > document.documentElement.clientHeight;

    if (!hasScroll) return;

    const scrollY = lock();
    return () => unlock(scrollY);
  }, [isLocked]);
}
