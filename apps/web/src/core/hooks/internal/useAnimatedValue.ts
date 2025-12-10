import { useEffect } from 'react';

import { animate, type MotionValue, useMotionValue, useTransform } from 'motion/react';

export function useAnimatedValue<T = number>(
  value: number,
  options: { transformer?: (value: number) => T; duration?: number } = {},
): MotionValue<T> {
  const count = useMotionValue(value);
  const motionValue = useTransform(() => {
    if (!options.transformer) return count.get();
    return options.transformer(count.get());
  });

  useEffect(() => {
    const controls = animate(count, value, { duration: options.duration });
    return () => controls.stop();
  }, [value]);

  return motionValue as MotionValue<T>;
}
