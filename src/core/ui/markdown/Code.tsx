import type { ComponentProps } from 'react';

import { Prism } from 'react-syntax-highlighter';
import { atomDark as style } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Props = ComponentProps<typeof Prism>;

export default function Code({ children, language = 'typescript', ...props }: Props) {
  return (
    <Prism
      {...props}
      className="m-0! mx-1! inline-flex rounded-lg! bg-gray-1! px-2.5! py-1! tracking-normal! whitespace-pre"
      language={language}
      style={{ ...style }}
    >
      {children}
    </Prism>
  );
}
