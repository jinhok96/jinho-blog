import type { ComponentProps } from 'react';

import { Prism } from 'react-syntax-highlighter';
import { atomDark as style } from 'react-syntax-highlighter/dist/esm/styles/prism';

import Callout from '@/core/ui/markdown/Callout';

type Props = ComponentProps<typeof Prism>;

export default function CodeBlock({ children, language = 'typescript', ...props }: Props) {
  return (
    <Callout>
      <Prism
        {...props}
        className="m-0! bg-transparent! p-0! tracking-normal! whitespace-pre"
        language={language}
        style={{ ...style }}
      >
        {children}
      </Prism>
    </Callout>
  );
}
