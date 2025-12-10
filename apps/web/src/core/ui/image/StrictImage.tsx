'use client';

import type { ComponentProps, ReactEventHandler } from 'react';

import Image from 'next/image';

import { useThrowError } from '@/core/hooks';

export function StrictImage({ src, alt, onError, ...props }: ComponentProps<typeof Image>) {
  const throwError = useThrowError();

  const handleError: ReactEventHandler<HTMLImageElement> = e => {
    onError?.(e);
    throwError(new Error(`유효하지 않은 src입니다. (src: ${src})`));
  };

  if (!src) throw new Error('src가 비어있습니다.');

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      onError={handleError}
    />
  );
}
