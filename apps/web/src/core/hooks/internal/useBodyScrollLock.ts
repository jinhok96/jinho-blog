import { useLayoutEffect } from 'react';

/**
 * 스크롤을 방지하고 현재 위치 반환
 */
const preventScroll = (): number => {
  const currentScrollY = window.scrollY;

  document.body.style.position = 'fixed';
  document.body.style.top = `-${currentScrollY}px`; // 현재 스크롤 위치
  document.body.style.overflowY = 'scroll';

  return currentScrollY;
};

/**
 * 스크롤을 허용하고 이전 스크롤 위치 복구
 */
const allowScroll = (prevScrollY: number) => {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.overflowY = '';

  window.scrollTo({ top: prevScrollY, behavior: 'instant' });
};

export function useBodyScrollLock(isLocked: boolean): void {
  useLayoutEffect(() => {
    if (!isLocked) return;

    // 페이지에 스크롤이 있는지 확인
    const hasScroll = document.documentElement.scrollHeight > document.documentElement.clientHeight;

    if (!hasScroll) return;

    const prevScrollY = preventScroll();
    return () => allowScroll(prevScrollY);
  }, [isLocked]);
}
