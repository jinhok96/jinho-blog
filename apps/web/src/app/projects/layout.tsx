import type { PropsWithChildren, ReactNode } from 'react';

type Props = PropsWithChildren<{
  modal?: ReactNode;
}>;

export default function ProjectsLayout({ children, modal }: Props) {
  return (
    <div className="container flex-col-center size-full flex-1 px-layout">
      {children}
      {modal}
    </div>
  );
}
