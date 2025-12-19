import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren;

export default function HomeLayout({ children }: Props) {
  return <div className="container flex-col-center size-full flex-1 p-layout">{children}</div>;
}
