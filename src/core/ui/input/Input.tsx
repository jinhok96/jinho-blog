import type { DetailedHTMLProps, InputHTMLAttributes } from 'react';

import { cn } from '@/core/utils';

type Props = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  error?: boolean; // 에러 상태인지 여부
  highlight?: boolean; // 항상 테두리 색을 표시할지 여부
};

export function Input({ className, error, highlight, ...props }: Props) {
  return (
    <input
      {...props}
      className={cn(
        `
          rounded-lg border border-foreground-3 animated-100
          placeholder:text-foreground-6
        `,
        !error && 'focus:border-blue-7',
        !error && highlight && 'border-blue-7',
        error && 'focus:border-red-7',
        error && highlight && 'border-red-7',
        className,
      )}
      spellCheck={false}
    />
  );
}
