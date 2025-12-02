import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren;

export default function ProjectsLayout({ children }: Props) {
  return <div className="container flex-col-center size-full flex-1 px-layout">{children}</div>;
}
