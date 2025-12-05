'use client';

import type { PORTAL } from '@/core/config/internal';

import { type PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

import { useIsMounted } from '@/core/hooks/internal';

type Props = PropsWithChildren<{ portalId: keyof typeof PORTAL }>;

export function Portal({ children, portalId }: Props) {
  const mounted = useIsMounted();

  if (!mounted) return;

  const portalElement = document.getElementById(portalId);
  if (!portalElement) throw new Error(`Portal(${portalId})을 찾을 수 없습니다.`);

  return createPortal(children, portalElement);
}
