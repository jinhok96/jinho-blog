import type { ComponentProps } from 'react';

import { Prism } from 'react-syntax-highlighter';
import { oneDark as darkStyle, oneLight as lightStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import localFont from 'next/font/local';

import { cn } from '@/core/utils';

const monaco = localFont({
  src: '../../../../public/fonts/monaco-webfont.woff2',
  display: 'swap',
});

type Props = ComponentProps<typeof Prism>;

export default function Code({ children, language = 'typescript', className, PreTag, ...props }: Props) {
  return (
    <>
      <Prism
        {...props}
        className={cn(
          `
            m-0! inline-flex bg-transparent! p-0! text-[0.875rem] tracking-normal! whitespace-pre
            light:hidden
          `,
          className,
        )}
        language={language}
        PreTag={PreTag}
        codeTagProps={{ className: monaco.className }}
        style={darkStyle}
      >
        {children}
      </Prism>
      <Prism
        {...props}
        className={cn(
          `
            m-0! inline-flex bg-transparent! p-0! text-[0.875rem] tracking-normal! whitespace-pre
            dark:hidden
          `,
          className,
        )}
        language={language}
        PreTag={PreTag}
        codeTagProps={{ className: monaco.className }}
        style={lightStyle}
      >
        {children}
      </Prism>
    </>
  );
}
