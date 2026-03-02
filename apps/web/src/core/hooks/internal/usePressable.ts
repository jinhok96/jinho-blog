import { useCallback, useState } from 'react';

import { useStopwatch } from '@/core/hooks/internal/useStopwatch';
import { useTimeoutRef } from '@/core/hooks/internal/useTimeoutRef';

export function usePressable(delay: number = 100) {
  const [isPressed, setIsPressed] = useState(false);

  const { set: setTimeoutRef, clear: clearTimeoutRef } = useTimeoutRef();
  const { start: startStopwatch, get: getStopwatch, reset: resetStopwatch } = useStopwatch();

  const start = useCallback(() => {
    clearTimeoutRef();
    startStopwatch();
    setIsPressed(true);
  }, [clearTimeoutRef, startStopwatch]);

  const end = useCallback(() => {
    const animatedTime = getStopwatch();
    const remain = Math.max(delay - animatedTime, 0);

    if (remain <= 0) {
      setIsPressed(false);
    } else {
      setTimeoutRef(() => {
        setIsPressed(false);
      }, remain);
    }

    resetStopwatch();
  }, [delay, getStopwatch, resetStopwatch, setTimeoutRef]);

  return { start, end, isPressed };
}
