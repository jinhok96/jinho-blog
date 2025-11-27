import type { FC } from 'react';

export type Portfolio = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  Component: FC;
};
