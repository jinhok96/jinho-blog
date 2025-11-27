import type { FC } from 'react';

export type Project = {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  Component: FC;
};
