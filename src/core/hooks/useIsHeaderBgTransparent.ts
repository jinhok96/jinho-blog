import { useEffect, useState } from 'react';

import { useScrollTargetHeight } from '@/core/hooks';

export function useIsHeaderBgTransparent(value: boolean = false): boolean {
  const [isValue, setIsValue] = useState(value);
  const isTop = useScrollTargetHeight(0, value);

  useEffect(() => {
    setIsValue(value);
  }, [value]);

  return isValue && isTop;
}
