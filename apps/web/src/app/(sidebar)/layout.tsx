import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren;

export default function SidebarLayout({ children }: Props) {
  return <div className="relative flex-row-start size-full flex-1">{children}</div>;
}
