import { useCallback, useEffect, useRef, useState } from 'react';

import { useMountEffect } from '@/core/hooks/internal/useMountEffect';

/**
 * 스크롤 높이가 특정 조건을 만족하는지 추적하는 훅
 * @param target - 비교할 스크롤 높이 값 또는 조건 함수
 * @param initValue - 초기값
 * @returns isTargetHeight - 조건이 만족되는지 여부
 */
export function useScrollTargetHeight(
  target: number | ((scrollY: number) => boolean),
  initValue: boolean = false,
): boolean {
  // 조건 만족 여부만 state로 관리 (변경 시에만 리렌더링)
  const [isTargetHeight, setIsTargetHeight] = useState(initValue);

  // 리렌더링 없이 현재 상태 추적
  const frameRef = useRef<number>(0);
  const targetRef = useRef(target);

  const handleScroll = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    frameRef.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const currentTarget = targetRef.current;

      const currentResult: boolean =
        typeof currentTarget === 'number' ? currentScrollY === currentTarget : currentTarget(currentScrollY);

      setIsTargetHeight(currentResult);
    });
  }, []);

  useMountEffect(() => {
    targetRef.current = target;
    handleScroll();
  });

  useEffect(() => {
    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll, {
      passive: true,
      capture: false,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [handleScroll, target]);

  return isTargetHeight;
}
