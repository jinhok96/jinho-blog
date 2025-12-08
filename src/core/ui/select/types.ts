import type { ReactNode } from 'react';

export type SelectOption<T extends string> = {
  key: T;
  label: ReactNode;
};
