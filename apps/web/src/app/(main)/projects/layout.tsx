import type { PropsWithChildren, ReactNode } from 'react';

type Props = PropsWithChildren<{
  modal?: ReactNode;
}>;

export default function ProjectsLayouts({ children, modal }: Props) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
