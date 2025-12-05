'use client';

import type { DropdownContextValue } from '@/core/ui/dropdown/dropdownContext';
import type {
  DropdownContentProps as DropdownContainerProps,
  DropdownItemProps,
  DropdownPosition,
  DropdownProps,
  DropdownTriggerProps,
} from '@/core/ui/dropdown/types';

import { type MouseEventHandler, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { useKeyDownEffect, useOutsideClickEffect } from '@/core/hooks/internal';
import { Button } from '@/core/ui';
import { dropdownContext } from '@/core/ui/dropdown/dropdownContext';
import { cn } from '@/core/utils';

function useDropdownContext(): DropdownContextValue {
  const context = useContext(dropdownContext);
  if (context === undefined) {
    throw new Error('Dropdown components must be used within Dropdown');
  }
  return context;
}

export function Dropdown({ children, isOpen: controlledIsOpen, onOpenChange, className }: DropdownProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = useCallback(() => {
    const newIsOpen = !isOpen;
    if (!isControlled) {
      setInternalIsOpen(newIsOpen);
    }
    onOpenChange?.(newIsOpen);
  }, [isOpen, isControlled, onOpenChange]);

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
    if (isOpen) handleClose();
  });

  const contextValue = useMemo<DropdownContextValue>(
    () => ({
      isOpen,
      handleToggle,
      handleClose,
    }),
    [isOpen, handleToggle, handleClose],
  );

  return (
    <dropdownContext.Provider value={contextValue}>
      <div
        ref={wrapperRef}
        className={cn('relative', className)}
      >
        {children}
      </div>
    </dropdownContext.Provider>
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
    if (!isOpen || !containerRef.current) return;

    const contentRect = containerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - contentRect.bottom;
    const spaceAbove = contentRect.top;
    const spaceRight = viewportWidth - contentRect.right;

    let newPosition: DropdownPosition = 'bottomLeft';

    if (spaceBelow < 0 && spaceAbove > spaceBelow) {
      newPosition = spaceRight < 0 ? 'topRight' : 'topLeft';
    } else {
      newPosition = spaceRight < 0 ? 'bottomRight' : 'bottomLeft';
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPosition(newPosition);
  }, [isOpen]);

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
      <div className={cn('size-full overflow-auto', contentClassName)}>{children}</div>
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
      {...props}
    >
      {children}
    </Button>
  );
}

Dropdown.Trigger = Trigger;
Dropdown.Container = Container;
Dropdown.Item = Item;
