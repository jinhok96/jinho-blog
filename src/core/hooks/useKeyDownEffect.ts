import { useEffect, useRef } from 'react';

export function useKeyDownEffect(keys: string[], callback: (e: KeyboardEvent) => void) {
  const callbackRef = useRef(callback);

  // 최신 callback을 항상 ref에 저장 (이벤트 리스너 재등록 없이 최신 함수 실행)
  callbackRef.current = callback;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!keys.includes(e.key)) return;
      callbackRef.current(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys.join()]);
}
