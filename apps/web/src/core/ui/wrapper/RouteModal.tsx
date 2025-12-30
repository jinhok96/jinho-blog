'use client';

import { type PropsWithChildren, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useKeyDownEffect, useMountEffect } from '@/core/hooks';
import { Button } from '@/core/ui';
import { cn } from '@/core/utils';

import CloseIcon from 'public/icons/close.svg';

type Props = PropsWithChildren;

export function RouteModal({ children }: Props) {
  const router = useRouter();
  const [isShow, setIsShow] = useState(false);

  const handleClose = () => {
    setIsShow(false);
    setTimeout(() => router.back(), 150);
  };

  useKeyDownEffect(['Escape'], handleClose);

  useMountEffect(() => {
    // 브라우저가 초기 상태를 렌더링한 후 애니메이션 시작
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsShow(true);
      });
    });
  });

  return (
    <div className="fixed inset-0 z-modal flex-col-center justify-center pb-header">
      {/* 오버레이 */}
      <div
        className={cn('fixed inset-0 backdrop-blur-xs animated-150', !isShow && 'opacity-0')}
        onClick={handleClose}
      />

      {/* 모달 콘텐츠 */}
      <div
        className={cn(
          `
            fixed inset-0 overflow-hidden border-foreground-2 bg-background drop-shadow-2xl animated-150
            dark:bg-gray-1
            tablet:inset-auto tablet:rounded-4xl tablet:border
          `,
          !isShow && 'opacity-0 translate-x-6 tablet:translate-x-0 tablet:translate-y-20 tablet:scale-85',
        )}
      >
        <div
          className={`
            relative size-full overflow-y-auto px-8
            tablet:scrollbar-margin-6 tablet:max-h-180 tablet:w-lg
          `}
        >
          <div className="pt-8 pb-16">{children}</div>
        </div>

        {/* 닫기 버튼 */}
        <Button
          onClick={handleClose}
          className={`
            absolute top-5 right-5 size-11 p-3 text-foreground-5
            hover:text-foreground-7
          `}
          rounded
        >
          <CloseIcon strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  );
}
