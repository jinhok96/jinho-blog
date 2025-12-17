'use client';

import { type ComponentProps, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useQueryParams } from '@/core/hooks';
import { Select, type SelectOption } from '@/core/ui';

type AllOptionKey = 'all';
type OptionsWithAll<T extends string> = SelectOption<T | AllOptionKey>[];

const ALL: SelectOption<AllOptionKey> = {
  key: 'all',
  label: '전체',
};

type Props<T extends string> = {
  className?: string;
  options: SelectOption<T>[];
  position?: ComponentProps<typeof Select.Container>['position'];
};

export function SelectCategory<T extends string>({ className, options, position }: Props<T>) {
  const router = useRouter();
  const params = useQueryParams<{ category: T | AllOptionKey; page: string }>();

  const category = params.get('category');
  const initIndex = options.findIndex(option => option.key === category);

  const [currentIndex, setCurrentIndex] = useState(initIndex === -1 ? 0 : initIndex);

  const optionsWithAll: OptionsWithAll<T> = [ALL, ...options];
  const label = currentIndex === 0 ? '카테고리' : optionsWithAll[currentIndex].label;

  const handleOptionClick = (index: number) => {
    setCurrentIndex(index);

    const paramsWithoutPage = params.remove('page');

    if (index === 0) {
      const nextHref = paramsWithoutPage.remove('category').toHref();
      return router.replace(nextHref);
    }

    const nextHref = paramsWithoutPage.set('category', optionsWithAll[index].key).toHref();
    router.replace(nextHref);
  };

  return (
    <Select className={className}>
      <Select.Trigger
        size="md"
        color="background"
        rounded
        variant="outline"
      >
        {label}
      </Select.Trigger>
      <Select.Container position={position}>
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
