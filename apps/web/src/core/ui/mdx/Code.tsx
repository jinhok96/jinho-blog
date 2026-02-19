'use client';

import type { ComponentProps } from 'react';

import { Prism } from 'react-syntax-highlighter';
import { oneDark as darkStyle, oneLight as lightStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import localFont from 'next/font/local';

import { useThemeStore } from '@/core/store';
import { cn } from '@/core/utils';

const jbd2 = localFont({
  src: '../../../../public/fonts/JBD2-Regular.woff2',
  display: 'swap',
  preload: false,
});

type CodePrismProps = ComponentProps<typeof Prism>;

function CodePrism({ children, className, PreTag, language = 'typescript', ...props }: CodePrismProps) {
  return (
    <Prism
      className={cn(`m-0! inline-flex bg-transparent! p-0! text-[0.875rem] tracking-normal! whitespace-pre`, className)}
      PreTag={PreTag}
      codeTagProps={{ className: jbd2.className }}
      language={language}
      {...props}
    >
      {children}
    </Prism>
  );
}

type Props = ComponentProps<typeof CodePrism> & {
  className?: string;
};

export default function Code({ children, ...props }: Props) {
  const themeClass = useThemeStore.use.themeClass();

  const style = themeClass === 'light' ? lightStyle : darkStyle;

  return (
    <CodePrism
      {...props}
      style={style}
    >
      {children}
    </CodePrism>
  );
}
