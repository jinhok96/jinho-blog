'use client';

import type {
  DropdownContentProps as DropdownContainerProps,
  DropdownItemProps,
  DropdownPosition,
  DropdownProps,
  DropdownTriggerProps,
} from '@/core/ui/dropdown/types';

import { type MouseEventHandler, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createContext } from 'react';

import { useKeyDownEffect, useOutsideClickEffect } from '@/core/hooks';
import { Button } from '@/core/ui';
import { cn } from '@/core/utils';

type DropdownContextValue = {
  isOpen: boolean;
  handleToggle: () => void;
  handleClose: () => void;
};

const DropdownContext = createContext<DropdownContextValue | undefined>(undefined);

function useDropdownContext(): DropdownContextValue {
  const context = useContext(DropdownContext);
  if (context === undefined) {
    throw new Error('Dropdown components must be used within Dropdown');
  }
  return context;
}

export function Dropdown({ children, isOpen, onOpenChange, className }: DropdownProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isControlled = isOpen !== undefined;
  const isDropdownOpen = isControlled ? isOpen : internalIsOpen;

  const handleToggle = useCallback(() => {
    const newIsOpen = !isDropdownOpen;
    if (!isControlled) {
      setInternalIsOpen(newIsOpen);
    }
    onOpenChange?.(newIsOpen);
  }, [isDropdownOpen, isControlled, onOpenChange]);

  const handleClose = useCallback(() => {
    if (!isControlled) {
      setInternalIsOpen(false);
    }
    onOpenChange?.(false);
  }, [isControlled, onOpenChange]);

  useOutsideClickEffect(() => {
    handleClose();
  }, [wrapperRef]);

  useKeyDownEffect(['Escape'], () => {
    if (isDropdownOpen) handleClose();
  });

  const contextValue = useMemo<DropdownContextValue>(
    () => ({
      isOpen: isDropdownOpen,
      handleToggle,
      handleClose,
    }),
    [isDropdownOpen, handleToggle, handleClose],
  );

  return (
    <DropdownContext.Provider value={contextValue}>
      <div
        ref={wrapperRef}
        className={cn('relative', className)}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

function Trigger({ children, onClick, ...props }: DropdownTriggerProps) {
  const { handleToggle } = useDropdownContext();

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
  const { isOpen } = useDropdownContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPosition, setCurrentPosition] = useState<DropdownPosition>(position);

  useLayoutEffect(() => {
    if (currentPosition === position) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPosition(position);
  }, [position]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute flex-col-start overflow-hidden animated-150',
        DROPDOWN_POSITION_CLASSNAME_MAP[currentPosition],
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
  const { handleClose } = useDropdownContext();

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
