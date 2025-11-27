'use client';

import type { HTMLElements } from 'motion';
import type { ComponentProps } from 'react';

import { Reorder } from 'motion/react';

import { cn } from '@/core/utils';

type Props<V, TagName extends keyof HTMLElements = 'ul'> = ComponentProps<typeof Reorder.Group<V, TagName>>;

function Carousel<V, TagName extends keyof HTMLElements>({ children, className, ...props }: Props<V, TagName>) {
  return (
    <Reorder.Group
      className={cn('overflow-anchor-none', className)}
      {...props}
    >
      {children}
    </Reorder.Group>
  );
}

type ItemProps<V, TagName extends keyof HTMLElements = 'li'> = Omit<
  ComponentProps<typeof Reorder.Item<V, TagName>>,
  'dragListener'
>;

function Item<V, TagName extends keyof HTMLElements = 'li'>({ children, className, ...props }: ItemProps<V, TagName>) {
  return (
    <Reorder.Item
      {...props}
      className={cn('shrink-0', className)}
      dragListener={false}
    >
      {children}
    </Reorder.Item>
  );
}

Carousel.Item = Item;

export { Carousel };
