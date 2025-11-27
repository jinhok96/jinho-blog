import type { LibraryMetadata } from '@/core/types/metadata';
import type { FC } from 'react';

export type Library = LibraryMetadata & {
  slug: string;
  Component: FC;
};
