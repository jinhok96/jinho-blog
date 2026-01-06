import type { PropsWithChildren } from 'react';

import { Header } from '@/modules/header';

type Props = PropsWithChildren;

export default function HomeLayout({ children }: Props) {
  return (
    <div className="flex-col-center size-full flex-1">
      <Header />
      {children}
    </div>
  );
}
