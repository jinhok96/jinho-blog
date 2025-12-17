import { useState } from 'react';

import { useStopwatch } from '@/core/hooks/internal/useStopwatch';
import { useTimeoutRef } from '@/core/hooks/internal/useTimeoutRef';

export function usePressable(delay: number = 100) {
  const [isPressed, setIsPressed] = useState(false);

  const timeout = useTimeoutRef();
  const stopwatch = useStopwatch();

  const start = () => {
    timeout.clear();
    stopwatch.start();
    setIsPressed(true);
  };

  const end = () => {
    const animatedTime = stopwatch.get();
    const remain = Math.max(delay - animatedTime, 0);

    if (remain <= 0) {
      setIsPressed(false);
    } else {
      timeout.set(() => {
        setIsPressed(false);
      }, remain);
    }

    stopwatch.reset();
  };

  return { start, end, isPressed };
}
