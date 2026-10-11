import type { PropsWithChildren } from 'react';

import { cn } from '@/core/utils';

type Props = PropsWithChildren<{
  className?: string;
}>;

/**
 * MDX 본문 타이포그래피 (색상은 globals.css에서 디자인 토큰에 연결 — 다크 모드 자동 대응)
 */
export function Prose({ children, className }: Props) {
  return (
    <div
      className={cn(
        `
          prose max-w-none
          md:prose-lg
        `,
        className,
      )}
    >
      {children}
    </div>
  );
}
