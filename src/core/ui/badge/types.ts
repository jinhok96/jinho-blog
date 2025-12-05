import type { TechStack } from '@/core/types/internal';
import type { PropsWithChildren } from 'react';

export type BadgeProps = PropsWithChildren<{
  className?: string;
}>;

export interface TechBadgeProps extends Omit<BadgeProps, 'children'> {
  tech: TechStack;
}
