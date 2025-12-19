import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren;

export default function LibrariesLayout({ children }: Props) {
  return <div className="flex-col-center size-full flex-1">{children}</div>;
}
