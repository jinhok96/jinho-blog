import type { PropsWithChildren, ReactNode } from 'react';

import { Header } from '@/modules/header';

type Props = PropsWithChildren<{
  hero?: ReactNode;
}>;

export default function HomeLayout({ children, hero }: Props) {
  return (
    <div className="flex-col-center size-full flex-1">
      <Header />

      <div className="size-full">
        {hero}
        {children}
      </div>
    </div>
  );
}
