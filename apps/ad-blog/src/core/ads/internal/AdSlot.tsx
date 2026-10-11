'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { AD_SLOTS, type AdPlacement, ADSENSE_CLIENT } from '../../config';
import { cn } from '../../utils';
import { getAdSlotAttributes, resolveAdSlotState } from './adsense';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type Props = {
  placement: AdPlacement;
  className?: string;
};

/**
 * 광고 슬롯 (AdSense 수동 광고 단위)
 * - 최소 높이를 미리 확보해 광고가 늦게 채워져도 본문이 밀리지 않도록 함 (CLS 방지)
 * - 미게재(unfilled) 응답이면 슬롯 전체를 숨김
 * - 클라이언트 이동 시 경로별로 새 광고 요청 (`<ins>`를 경로 key로 재생성)
 */
export function AdSlot({ placement, className }: Props) {
  const pathname = usePathname();
  const slot = AD_SLOTS[placement];
  const state = resolveAdSlotState({
    isDevelopment: process.env.NODE_ENV === 'development',
    client: ADSENSE_CLIENT,
    slotId: slot.slotId,
  });

  useEffect(() => {
    if (state !== 'live') return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error(`[ads] ${placement} 광고 요청 실패`, error);
    }
  }, [state, placement, pathname]);

  if (state === 'hidden') return null;

  return (
    <aside
      aria-label="광고"
      data-ad-placement={placement}
      className={cn(
        `
          flex min-h-70 flex-col gap-1
          has-[ins[data-ad-status=unfilled]]:hidden
        `,
        className,
      )}
    >
      <p className="text-xs text-muted">광고</p>
      {state === 'live' ? (
        <ins
          key={pathname}
          className="adsbygoogle block w-full flex-1"
          {...getAdSlotAttributes(ADSENSE_CLIENT, slot)}
        />
      ) : (
        <div
          className={`
            flex flex-1 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted
          `}
        >
          광고 자리 · {placement}
          {slot.slotId ? '' : ' (광고 단위 ID 미설정)'}
        </div>
      )}
    </aside>
  );
}
