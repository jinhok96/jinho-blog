import type { ComponentType } from 'react';

import { demoRegistry } from '@/core/ui/mdx/demos';

type Props = {
  name: string;
};

export function Demo({ name }: Props) {
  const DemoComponent = demoRegistry[name] as ComponentType | undefined;

  if (!DemoComponent) {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <p className="font-caption-14 text-red-6">
          Demo &quot;{name}&quot; not found. Check the demo registry at core/ui/mdx/demos/index.ts
        </p>
      );
    }
    return null;
  }

  return <DemoComponent />;
}
