'use client';

import { Dropdown } from '@/core/ui';

type Props<T extends string> = { categories: T[] };

export function SelectCategory<T extends string>({ categories }: Props<T>) {
  return (
    <Dropdown>
      <Dropdown.Trigger>Category</Dropdown.Trigger>
      <Dropdown.Container
        className={`
          rounded-xl border border-foreground-2 bg-background-5 py-2 shadow-lg shadow-black/15 backdrop-blur-md
          dark:border-foreground-3 dark:bg-foreground-2
        `}
      >
        {categories.map(category => (
          <Dropdown.Item
            key={category}
            className="rounded-none text-left"
            size="md"
            color="background"
          >
            {category}
          </Dropdown.Item>
        ))}
      </Dropdown.Container>
    </Dropdown>
  );
}
