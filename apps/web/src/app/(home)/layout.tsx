import type { PropsWithChildren, ReactNode } from 'react';

import { Header } from '@/modules/header';

type Props = PropsWithChildren<{
  hero?: ReactNode;
  contact?: ReactNode;
}>;

export default function HomeLayout({ children, hero, contact }: Props) {
  return (
    <div className="flex-col-center size-full flex-1">
      <Header />

      <div className="flex-col-center size-full flex-1">
        {hero}
        {children}
      </div>

      <div className="dark size-full bg-black text-foreground">{contact}</div>
    </div>
  );
}
