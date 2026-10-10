import type { PropsWithChildren } from 'react';

import { cn } from '@/core/utils';

const SIZE_CLASS_NAME = {
  /** 목록·헤더·푸터 */
  wide: 'max-w-5xl',
  /** 글 본문 (읽기 폭 약 720px) */
  narrow: 'max-w-192',
} as const;

type Props = PropsWithChildren<{
  size?: keyof typeof SIZE_CLASS_NAME;
  className?: string;
}>;

/**
 * 가운데 정렬 + 좌우 여백 레이아웃 컨테이너
 */
export function Container({ size = 'wide', className, children }: Props) {
  return (
    <div
      className={cn(
        `
          mx-auto w-full px-4
          sm:px-6
        `,
        SIZE_CLASS_NAME[size],
        className,
      )}
    >
      {children}
    </div>
  );
}
