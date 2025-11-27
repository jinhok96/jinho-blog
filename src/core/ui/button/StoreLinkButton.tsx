'use client';

import type { ReactNode } from 'react';

import { LinkButton } from '@/core/ui/button/LinkButton';

type StoreLinkButtonProps = {
  href: string;
  label: string;
  icon: ReactNode;
  topText: string;
  bottomText: string;
};

export function StoreLinkButton({ href, label, icon, topText, bottomText }: StoreLinkButtonProps) {
  return (
    <LinkButton
      key={label}
      href={href}
      target="_blank"
      size="lg"
      color="foreground"
      className={`
        text-white
        dark:border-none dark:bg-foreground-1 dark:hover:bg-foreground-2
        mobile:w-full
      `}
    >
      <div className="flex-row-center gap-3">
        <div className="size-13">{icon}</div>

        <div className="flex-col-start gap-0.5 pr-2.5">
          <p className="font-caption-14">{topText}</p>
          <p className="font-title-20 leading-none">{bottomText}</p>
        </div>
      </div>
    </LinkButton>
  );
}
