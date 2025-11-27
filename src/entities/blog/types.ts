import type { FC } from 'react';

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  Component: FC;
};
