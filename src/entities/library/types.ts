import type { FC } from 'react';

export type Library = {
  slug: string;
  title: string;
  description: string;
  npm: string;
  github: string;
  Component: FC;
};
