'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useQueryParams } from '@/core/hooks';
import { Dropdown } from '@/core/ui';
import { cn } from '@/core/utils';

type Props<T extends string> = { options: Array<{ key: T; value: string }> };

export function SelectCategory<T extends string>({ options }: Props<T>) {
  const router = useRouter();
  const params = useQueryParams();

  const category = params.get('category');
  const initIndex = options.findIndex(option => option.key === category);

  const [currentIndex, setCurrentIndex] = useState(initIndex === -1 ? 0 : initIndex);

  const optionsWithAll = [{ key: 'all', value: '전체' }, ...options];
  const label = currentIndex === 0 ? '카테고리' : optionsWithAll[currentIndex].value;

  const handleOptionClick = (index: number) => {
    setCurrentIndex(index);

    if (index === 0) {
      const next = params.remove('category');
      return router.replace(next);
    }

    const next = params.set('category', optionsWithAll[index].key);
    router.replace(next);
  };

  return (
    <Dropdown>
      <Dropdown.Trigger
        size="md"
        color="background"
      >
        {label}
      </Dropdown.Trigger>
      <Dropdown.Container
        className={`
          rounded-xl border border-foreground-2 bg-background-5 py-2 shadow-lg shadow-black/15 backdrop-blur-lg
          dark:border-foreground-3 dark:bg-foreground-2
        `}
      >
        {optionsWithAll.map((option, index) => (
          <Dropdown.Item
            key={option.key}
            className={cn('rounded-none text-left', currentIndex === index && 'text-blue-7')}
            size="md"
            color="background"
            onClick={() => handleOptionClick(index)}
          >
            {option.value}
          </Dropdown.Item>
        ))}
      </Dropdown.Container>
    </Dropdown>
  );
}
