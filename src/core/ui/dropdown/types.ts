import type { Button } from '@/core/ui';
import type { ComponentProps, PropsWithChildren } from 'react';

export type DropdownPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

export type DropdownProps = PropsWithChildren<{
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
}>;

export type DropdownTriggerProps = PropsWithChildren<ComponentProps<typeof Button>>;

export type DropdownContentProps = PropsWithChildren<{
  className?: string;
  contentClassName?: string;
  position?: DropdownPosition;
}>;

export type DropdownItemProps = PropsWithChildren<ComponentProps<typeof Button>>;
