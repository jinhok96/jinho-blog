import type { PropsWithChildren, ReactNode } from 'react';

import { SafeHTML } from '@/core/ui';
import { cn } from '@/core/utils';

type GuidelineProps = PropsWithChildren<{
  className?: string;
}>;

function Guideline({ className, children }: GuidelineProps) {
  return (
    <div className={cn('flex-col-start max-w-layout py-[calc(var(--padding-layout-y)/2)]', className)}>{children}</div>
  );
}

type TitleProps = PropsWithChildren<{
  className?: string;
}>;

function Title({ className, children }: TitleProps) {
  return (
    <p
      className={cn(
        `
          mb-8 font-subtitle-20 text-foreground-9
          mobile:font-subtitle-18
        `,
        className,
      )}
    >
      {children}
    </p>
  );
}

type ListProps = PropsWithChildren<{
  className?: string;
}>;

function List({ className, children }: ListProps) {
  return <div className={cn('flex-col-start gap-6', className)}>{children}</div>;
}

type ItemProps = {
  className?: string;
  children: ReactNode;
};

function Item({ className, children }: ItemProps) {
  return <div className={cn('', className)}>{children}</div>;
}

type LabelProps = PropsWithChildren<{
  className?: string;
  html?: string;
}>;

function Label({ className, html, children }: LabelProps) {
  if (html) {
    return (
      <SafeHTML
        className={cn(
          `
            mb-2 font-caption-18 text-foreground-9
            mobile:mb-1.5 mobile:font-caption-16
          `,
          className,
        )}
        html={html}
      />
    );
  }

  return (
    <p
      className={cn(
        `
          mb-2 font-caption-18 text-foreground-9
          mobile:mb-1.5 mobile:font-caption-16
        `,
        className,
      )}
    >
      {children}
    </p>
  );
}

type DescriptionProps = PropsWithChildren<{
  className?: string;
}>;

function Description({ className, children }: DescriptionProps) {
  return (
    <div
      className={cn(
        `
          flex-col-start gap-1 font-body-16 text-foreground-8
          mobile:font-body-14
        `,
        className,
      )}
    >
      {children}
    </div>
  );
}

type DescItemProps = PropsWithChildren<{
  className?: string;
  html?: string;
}>;

function DescItem({ className, html, children }: DescItemProps) {
  return (
    <div className={cn('flex-row-start gap-1.5', className)}>
      <span className="text-foreground-6">•</span>
      {html ? <SafeHTML html={html} /> : <span>{children}</span>}
    </div>
  );
}

Guideline.Title = Title;
Guideline.List = List;
Guideline.Item = Item;
Guideline.Label = Label;
Guideline.Description = Description;
Guideline.DescItem = DescItem;

export { Guideline };
