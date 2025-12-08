'use client';

import type { PropsWithChildren } from 'react';

import { useRouter } from 'next/navigation';

import { useKeyDownEffect } from '@/core/hooks';
import { Button } from '@/core/ui';

type Props = PropsWithChildren;

export function RouteModal({ children }: Props) {
  const router = useRouter();
  const handleClose = () => {
    router.back();
  };

  useKeyDownEffect(['Escape'], handleClose);

  return (
    <div className="fixed inset-0 z-modal flex-col-center justify-center pb-header">
      {/* 오버레이 */}
      <div
        className="fixed inset-0 backdrop-blur-xs"
        onClick={handleClose}
      />

      {/* 모달 콘텐츠 */}
      <div
        className={`
          fixed inset-0 overflow-hidden border-foreground-2 bg-background drop-shadow-2xl
          dark:bg-gray-1
          tablet:inset-auto tablet:rounded-4xl tablet:border
        `}
      >
        <div
          className={`
            relative size-full overflow-y-auto px-8
            tablet:scrollbar-margin-6 tablet:max-h-180 tablet:w-lg
          `}
        >
          <div className="py-8">{children}</div>
        </div>

        <div className="absolute top-4 right-4">
          {/* 닫기 버튼 */}
          <Button
            onClick={handleClose}
            className={`
              rounded-full p-2
              hover:bg-gray-2
            `}
          >
            ✕
          </Button>
        </div>
      </div>
    </div>
  );
}
