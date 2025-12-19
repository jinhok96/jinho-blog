import type { PropsWithChildren } from 'react';

import { Header } from '@/modules/header';

type Props = PropsWithChildren;

export default function MainLayout({ children }: Props) {
  return (
    <div className="container flex-col-center size-full flex-1 p-layout">
      <Header />
      {children}
    </div>
  );
}
