import type { ComponentProps } from 'react';

import { Prism } from 'react-syntax-highlighter';
import { oneDark as darkStyle, oneLight as lightStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import localFont from 'next/font/local';

import { cn } from '@/core/utils';

const monaco = localFont({
  src: '../../../../public/fonts/monaco-webfont.woff2',
  display: 'swap',
});

type CodePrismProps = ComponentProps<typeof Prism>;

function CodePrism({ children, language = 'typescript', className, PreTag, ...props }: CodePrismProps) {
  return (
    <Prism
      {...props}
      className={cn(`m-0! inline-flex bg-transparent! p-0! text-[0.875rem] tracking-normal! whitespace-pre`, className)}
      language={language}
      PreTag={PreTag}
      codeTagProps={{ className: monaco.className }}
    >
      {children}
    </Prism>
  );
}

type Props = ComponentProps<typeof CodePrism>;

export default function Code({ className, ...props }: Props) {
  return (
    <>
      <CodePrism
        {...props}
        className={cn('light:hidden', className)}
        style={darkStyle}
      />
      <CodePrism
        {...props}
        className={cn('dark:hidden', className)}
        style={lightStyle}
      />
    </>
  );
}
