'use client';

import type { ComponentProps } from 'react';

import { Dropdown } from '@/core/ui/dropdown';
import { cn } from '@/core/utils';

type Props = ComponentProps<typeof Dropdown>;

export function Select({ ...props }: Props) {
  return <Dropdown {...props} />;
}

type TriggerProps = ComponentProps<typeof Dropdown.Trigger>;

function Trigger({ ...props }: TriggerProps) {
  return <Dropdown.Trigger {...props} />;
}

type ContainerProps = ComponentProps<typeof Dropdown.Container>;

function Container({ className, ...props }: ContainerProps) {
  return (
    <Dropdown.Container
      className={cn(
        `
          overflow-y-auto rounded-xl border border-foreground-2 bg-background-5 py-2 shadow-lg shadow-black/15
          backdrop-blur-lg
          dark:border-foreground-3 dark:bg-foreground-2
        `,
        className,
      )}
      {...props}
    />
  );
}

type OptionProps = Omit<ComponentProps<typeof Dropdown.Item>, 'size' | 'color'> & {
  isSelected?: boolean;
};

function Option({ isSelected, className, children, ...props }: OptionProps) {
  return (
    <Dropdown.Item
      className={cn('rounded-none text-left', isSelected && 'text-blue-7', className)}
      size="md"
      color="background"
      {...props}
    >
      {children}
    </Dropdown.Item>
  );
}

Select.Trigger = Trigger;
Select.Container = Container;
Select.Option = Option;
