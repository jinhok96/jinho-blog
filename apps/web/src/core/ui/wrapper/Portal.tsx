'use client';

import type { PORTAL } from '@/core/config';

import { type PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

import { useIsHydrated } from '@/core/hooks';

type Props = PropsWithChildren<{ portalId: keyof typeof PORTAL }>;

export function Portal({ children, portalId }: Props) {
  const isHydrated = useIsHydrated();

  if (!isHydrated) return null;

  const portalElement = document.getElementById(portalId);
  if (!portalElement) throw new Error(`Portal(${portalId})을 찾을 수 없습니다.`);

  return createPortal(children, portalElement);
}
