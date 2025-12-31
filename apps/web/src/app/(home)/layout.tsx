import type { PropsWithChildren, ReactNode } from 'react';

import { Header } from '@/modules/header';

type Props = PropsWithChildren<{
  modal?: ReactNode;
}>;

export default function HomeLayout({ children, modal }: Props) {
  return (
    <div className="flex-col-center size-full flex-1">
      <Header />
      {children}
      {modal}
    </div>
  );
}
