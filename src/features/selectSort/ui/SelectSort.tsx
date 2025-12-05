'use client';

import { Dropdown } from '@/core/ui';

type Props = { prop?: string };

export function SelectSort({}: Props) {
  return (
    <Dropdown>
      <Dropdown.Trigger>Sort</Dropdown.Trigger>
      <Dropdown.Container>
        <Dropdown.Item>옵션1</Dropdown.Item>
        <Dropdown.Item>옵션2</Dropdown.Item>
        <Dropdown.Item>옵션3</Dropdown.Item>
      </Dropdown.Container>
    </Dropdown>
  );
}
