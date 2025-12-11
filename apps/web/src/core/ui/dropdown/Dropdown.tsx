'use client';

import type {
  DropdownContentProps as DropdownContainerProps,
  DropdownItemProps,
  DropdownPosition,
  DropdownProps,
  DropdownTriggerProps,
} from '@/core/ui/dropdown/types';

import { type MouseEventHandler, useLayoutEffect, useRef } from 'react';

import { useKeyDownEffect, useOutsideClickEffect } from '@/core/hooks';
import { Button } from '@/core/ui';
import { cn, createSharedState } from '@/core/utils';

type SharedState = {
  isOpen: boolean;
};

type SharedActions = {
  handleToggle: () => void;
  handleOpen: () => void;
  handleClose: () => void;
};

const { Provider, useShared, useSharedState, useSharedActions } = createSharedState<SharedState, SharedActions>(
  { isOpen: false },
  set => ({
    handleToggle: () => set(({ isOpen }) => ({ isOpen: !isOpen })),
    handleOpen: () => set({ isOpen: true }),
    handleClose: () => set({ isOpen: false }),
  }),
);

export function Dropdown({ children, isOpen, onOpenChange, className }: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isOpen: isOpenState, handleOpen, handleClose } = useShared();

  // 외부 isOpen 변경 시 내부 상태 동기화
  useLayoutEffect(() => {
    if (isOpen === undefined) return;

    if (isOpen) handleOpen();
    else handleClose();
  }, [isOpen]);

  // 내부 상태 변경 시 외부에 알림
  useLayoutEffect(() => {
    onOpenChange?.(isOpenState);
  }, [isOpenState]);

  useOutsideClickEffect(() => {
    if (!isOpenState) return;
    handleClose();
  }, [ref]);

  useKeyDownEffect(['Escape'], () => {
    if (!isOpenState) return;
    handleClose();
  });

  return (
    <Provider>
      <div
        ref={ref}
        className={cn('relative', className)}
      >
        {children}
      </div>
    </Provider>
  );
}

function Trigger({ children, onClick, ...props }: DropdownTriggerProps) {
  const { handleToggle } = useSharedActions();

  const handleClick: MouseEventHandler<HTMLButtonElement> = e => {
    onClick?.(e);
    handleToggle();
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}

const DROPDOWN_POSITION_CLASSNAME_MAP: Record<DropdownPosition, string> = {
  bottomLeft: 'top-full left-0 mt-2',
  bottomRight: 'top-full right-0 mt-2',
  topLeft: 'bottom-full left-0 mb-2',
  topRight: 'bottom-full right-0 mb-2',
};

function Container({ children, className, contentClassName, position = 'bottomLeft' }: DropdownContainerProps) {
  const { isOpen } = useSharedState();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute flex-col-start overflow-hidden animated-150',
        DROPDOWN_POSITION_CLASSNAME_MAP[position],
        isOpen ? 'visible opacity-100' : 'invisible opacity-0',
        className,
      )}
    >
      <div
        className={cn('size-full overflow-auto', contentClassName)}
        role="menu"
      >
        {children}
      </div>
    </div>
  );
}

function Item({ children, onClick, className, ...props }: DropdownItemProps) {
  const { handleClose } = useSharedActions();

  const handleClick: MouseEventHandler<HTMLButtonElement> = e => {
    onClick?.(e);
    handleClose();
  };

  return (
    <Button
      className={cn('w-full', className)}
      onClick={handleClick}
      role="option"
      {...props}
    >
      {children}
    </Button>
  );
}

Dropdown.Trigger = Trigger;
Dropdown.Container = Container;
Dropdown.Item = Item;
