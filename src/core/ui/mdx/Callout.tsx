'use client';

import { type PropsWithChildren, type RefObject, useEffect, useRef, useState } from 'react';

import { Button, Show } from '@/core/ui';
import { cn } from '@/core/utils';

import CheckAnimatedIcon from 'public/icons/check-animated.svg';
import CopyIcon from 'public/icons/copy.svg';

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

  useEffect(() => {
    const timer = setTimeout(() => setIsCopied(false), 5000);
    return () => clearTimeout(timer);
  }, [isCopied]);

  return (
    <Button
      className={cn(
        `
          absolute top-3 right-3 size-10 p-2 text-foreground-5
          hover:text-foreground-7
          tablet:top-4 tablet:right-4
        `,
        !isCopied &&
          'not-group-hover/callout:not-hover-none:invisible not-group-hover/callout:not-hover-none:opacity-0',
      )}
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
