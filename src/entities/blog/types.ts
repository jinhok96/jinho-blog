import type { BlogMetadata } from '@/core/types/metadata';
import type { FC } from 'react';

export type Blog = BlogMetadata & {
  slug: string;
  Component: FC;
};
