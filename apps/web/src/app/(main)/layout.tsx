import type { PropsWithChildren } from 'react';

import { Header } from '@/modules/header';

type Props = PropsWithChildren;

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex-col-center size-full container-1024 flex-1 p-layout">
      <Header />
      {children}
    </div>
  );
}
