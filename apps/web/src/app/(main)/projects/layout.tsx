import type { PropsWithChildren, ReactNode } from 'react';

type Props = PropsWithChildren<{
  modal?: ReactNode;
}>;

export default function ProjectsLayouts({ children, modal }: Props) {
  return (
    <div className="flex-col-center size-full flex-1">
      {children}
      {modal}
    </div>
  );
}
