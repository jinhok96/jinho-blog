import type { TechStack } from '@/core/types';
import type { PropsWithChildren } from 'react';

export type BadgeProps = PropsWithChildren<{
  className?: string;
}>;

export interface TechBadgeProps extends Omit<BadgeProps, 'children'> {
  tech: TechStack;
}
