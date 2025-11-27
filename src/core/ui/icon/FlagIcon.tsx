'use client';

import type { CurrencyCode } from '@/core/types';

import Image from 'next/image';

import { cn } from '@/core/utils';

type FlagIconProps = {
  className?: string;
  currencyCode: CurrencyCode;
  ratio: '4x3' | '1x1';
  objectFit?: 'cover' | 'contain';
};

const FLAG_MAP: Record<CurrencyCode, string> = {
  KRW: 'kr',
  USD: 'us',
  JPY: 'jp',
  EUR: 'eu',
  CNY: 'cn',
  THB: 'th',
  HKD: 'hk',
  TWD: 'tw',
  VND: 'vn',
  IDR: 'id',
  PHP: 'ph',
  SGD: 'sg',
  MYR: 'my',
  AUD: 'au',
  CAD: 'ca',
  NZD: 'nz',
  DKK: 'dk',
  GBP: 'gb',
  CHF: 'ch',
};

/**
 * 국기 아이콘
 * @see https://github.com/lipis/flag-icons
 */
export function FlagIcon({ className, currencyCode, ratio, objectFit = 'contain' }: FlagIconProps) {
  const flag = FLAG_MAP[currencyCode];

  if (!flag) throw new Error(`Invalid currency code: ${currencyCode}`);

  return (
    <div className={cn('overflow-hidden', className)}>
      <Image
        className={cn('size-full', {
          'aspect-4/3': ratio === '4x3',
          'aspect-square': ratio === '1x1',
          'object-contain': objectFit === 'contain',
          'object-cover': objectFit === 'cover',
        })}
        src={`/images/flags/${ratio}/${flag}.svg`}
        alt={`${currencyCode} flag`}
        width={ratio === '4x3' ? 400 : 300}
        height={300}
        unoptimized
      />
    </div>
  );
}
