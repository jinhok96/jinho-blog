'use client';

import { type PropsWithChildren, type RefObject, useRef } from 'react';

import { Button, Show } from '@/core/ui';
import { cn } from '@/core/utils';

import CopyIcon from 'public/icons/copy.svg';

type CopyButtonProps = {
  textRef: RefObject<HTMLDivElement | null>;
};

function CopyButton({ textRef }: CopyButtonProps) {
  const handleCopy = async () => {
    const text = textRef.current?.textContent;
    if (!text) return;
    await navigator.clipboard.writeText(text);
  };

  return (
    <Button
      className={`
        absolute top-3 right-3 size-10 p-1.5 text-foreground-5
        not-group-hover/callout:not-hover-none:invisible not-group-hover/callout:not-hover-none:opacity-0
        hover:text-foreground-7
        tablet:top-4 tablet:right-4
      `}
      color="background"
      size="md"
      onClick={handleCopy}
    >
      <CopyIcon />
    </Button>
  );
}

type Props = PropsWithChildren<{ className?: string; copyable?: boolean }>;

export default function Callout({ children, className, copyable, ...props }: Props) {
  const textRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn('group/callout relative my-0.5 size-full overflow-auto rounded-2xl bg-gray-1 pb-2', className)}
      {...props}
    >
      <div
        ref={textRef}
        className={`
          scrollbar-margin-2.5 size-full overflow-auto p-4 pb-2
          tablet:p-5 tablet:pb-3
        `}
      >
        {children}
      </div>

      {/* 복사 버튼 */}
      <Show when={copyable}>
        <CopyButton textRef={textRef} />
      </Show>
    </div>
  );
}
