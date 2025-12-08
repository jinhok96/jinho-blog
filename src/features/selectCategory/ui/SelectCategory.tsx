'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useQueryParams } from '@/core/hooks';
import { Select } from '@/core/ui';

type Option<T extends string> = {
  key: T;
  label: string;
};

type AllOptionKey = 'all';
type OptionsWithAll<T extends string> = Option<T | AllOptionKey>[];

const ALL: Option<AllOptionKey> = {
  key: 'all',
  label: '전체',
};

type Props<T extends string> = { options: Option<T>[] };

export function SelectCategory<T extends string>({ options }: Props<T>) {
  const router = useRouter();
  const params = useQueryParams();

  const category = params.get('category');
  const initIndex = options.findIndex(option => option.key === category);

  const [currentIndex, setCurrentIndex] = useState(initIndex === -1 ? 0 : initIndex);

  const optionsWithAll: OptionsWithAll<T> = [ALL, ...options];
  const label = currentIndex === 0 ? '카테고리' : optionsWithAll[currentIndex].label;

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
    <Select>
      <Select.Trigger
        size="md"
        color="background"
      >
        {label}
      </Select.Trigger>
      <Select.Container>
        {optionsWithAll.map((option, index) => (
          <Select.Option
            key={option.key}
            onClick={() => handleOptionClick(index)}
            isSelected={index === currentIndex}
          >
            {option.label}
          </Select.Option>
        ))}
      </Select.Container>
    </Select>
  );
}
