import type { ProjectMetadata } from '@/core/types/metadata';
import type { FC } from 'react';

export type Project = ProjectMetadata & {
  slug: string;
  Component: FC;
};
