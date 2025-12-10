'use client';

import type { ContentSortOption } from '@/core/types';

import { type ComponentProps, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useQueryParams } from '@/core/hooks';
import { Select, type SelectOption } from '@/core/ui';

const SORT_OPTIONS: SelectOption<ContentSortOption>[] = [
  { key: 'latest', label: '최신순' },
  { key: 'updated', label: '업데이트순' },
  { key: 'oldest', label: '오래된순' },
];

type Props = {
  className?: string;
  position?: ComponentProps<typeof Select.Container>['position'];
};

export function SelectSort({ className, position }: Props) {
  const router = useRouter();
  const params = useQueryParams();

  const sort = params.get('sort');
  const initIndex = SORT_OPTIONS.findIndex(option => option.key === sort);

  const [currentIndex, setCurrentIndex] = useState(initIndex === -1 ? 0 : initIndex);

  const handleOptionClick = (index: number) => {
    setCurrentIndex(index);

    const next = params.set('sort', SORT_OPTIONS[index].key);
    router.replace(next);
  };

  return (
    <Select className={className}>
      <Select.Trigger
        size="md"
        color="background"
        rounded
      >
        {SORT_OPTIONS[currentIndex].label}
      </Select.Trigger>
      <Select.Container position={position}>
        {SORT_OPTIONS.map((option, index) => (
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
