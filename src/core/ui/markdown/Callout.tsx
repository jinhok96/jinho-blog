import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren;

export default function Callout({ children }: Props) {
  return <div className="size-full rounded-2xl bg-gray-1 p-5">{children}</div>;
}
