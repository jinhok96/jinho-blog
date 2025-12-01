import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren;

export default function Callout({ children }: Props) {
  return (
    <div className="size-full overflow-hidden rounded-2xl bg-gray-1 pb-2">
      <div className="scrollbar-margin-2.5 size-full overflow-auto p-5 pb-3">{children}</div>
    </div>
  );
}
