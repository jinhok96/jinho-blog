'use client';

import { type PropsWithChildren, useRef } from 'react';

import { Button, Show } from '@/core/ui';
import { cn } from '@/core/utils';

import CopyIcon from 'public/icons/copy.svg';

type Props = PropsWithChildren<{ className?: string; copyable?: boolean }>;

export default function Callout({ children, className, copyable, ...props }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    const text = contentRef.current?.textContent || '';
    await navigator.clipboard.writeText(text);
  };

  return (
    <div
      className={cn('group/callout relative my-0.5 size-full overflow-auto rounded-2xl bg-gray-1 pb-2', className)}
      {...props}
    >
      <div
        ref={contentRef}
        className={`
          scrollbar-margin-2.5 size-full overflow-auto p-4 pb-2
          tablet:p-5 tablet:pb-3
        `}
      >
        {children}
      </div>

      {/* 복사 버튼 */}
      <Show when={copyable}>
        <Button
          className={`
            absolute top-4 right-4 size-10 p-1.5 text-gray-5
            not-group-hover/callout:invisible not-group-hover/callout:opacity-0
            hover:text-gray-8
          `}
          color="background"
          size="md"
          onClick={handleCopy}
        >
          <CopyIcon />
        </Button>
      </Show>
    </div>
  );
}
