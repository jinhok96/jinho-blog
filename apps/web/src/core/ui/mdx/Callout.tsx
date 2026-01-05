'use client';

import { type PropsWithChildren, type RefObject, useRef, useState } from 'react';

import { useTimeoutEffect } from '@/core/hooks';
import { Button, Show } from '@/core/ui';
import { cn } from '@/core/utils';

import CheckAnimatedIcon from 'public/icons/check-animated.svg';
import CopyIcon from 'public/icons/copy.svg';

const RESET_TIMEOUT = 5000;

type CopyButtonProps = {
  textRef: RefObject<HTMLDivElement | null>;
};

function CopyButton({ textRef }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    const text = textRef.current?.textContent || '';
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
  };

  const handleReset = () => {
    setIsCopied(false);
  };

  useTimeoutEffect(handleReset, RESET_TIMEOUT, [isCopied]);

  return (
    <Button
      className={`
        absolute top-2.5 right-2.5 size-10 p-2 text-foreground-5
        hover:text-foreground-7
        tablet:top-3 tablet:right-3
      `}
      color="background"
      size="md"
      onClick={handleCopy}
    >
      <Show
        when={isCopied}
        fallback={<CopyIcon />}
      >
        <div className="text-blue-7">
          <CheckAnimatedIcon strokeWidth={1.5} />
        </div>
      </Show>
    </Button>
  );
}

type Props = PropsWithChildren<{ className?: string; copyable?: boolean }>;

export default function Callout({ children, className, copyable, ...props }: Props) {
  const textRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn('group/callout relative my-0.5 size-full overflow-auto rounded-2xl bg-background pb-2', className)}
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
