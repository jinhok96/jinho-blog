import { useRef } from 'react';

import { useUnmountEffect } from '@/core/hooks';

export function useStopwatch() {
  const startTimeRef = useRef<number | null>(null);
  const pauseStartTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  const reset = (): void => {
    pausedTimeRef.current = 0;
    pauseStartTimeRef.current = null;
    startTimeRef.current = null;
  };

  const start = (): void => {
    reset();
    startTimeRef.current = Date.now();
  };

  const pause = (): void => {
    if (!startTimeRef.current || pauseStartTimeRef.current !== null) return;
    pauseStartTimeRef.current = Date.now();
  };

  const resume = (): void => {
    if (!startTimeRef.current || pauseStartTimeRef.current === null) return;
    pausedTimeRef.current += Date.now() - pauseStartTimeRef.current;
    pauseStartTimeRef.current = null;
  };

  const get = (): number => {
    if (!startTimeRef.current) return 0;

    const elapsed = Date.now() - startTimeRef.current;
    const currentPausingTime = pauseStartTimeRef.current ? Date.now() - pauseStartTimeRef.current : 0;
    const totalPausedTime = pausedTimeRef.current + currentPausingTime;

    return elapsed - totalPausedTime;
  };

  useUnmountEffect(reset);

  return { start, pause, resume, reset, get };
}
