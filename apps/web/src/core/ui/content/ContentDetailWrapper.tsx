import type { PropsWithChildren } from 'react';

import { LinkButton } from '@/core/ui/button/LinkButton';

import ArchiveBoxIcon from 'public/icons/archive_box.svg';

type ArchiveBoxLinkButtonProps = {
  href: string;
};

export function ArchiveBoxLinkButton({ href }: ArchiveBoxLinkButtonProps) {
  return (
    <LinkButton
      className={`
        flex-row-center gap-1.5 leading-none text-gray-5
        hover:text-gray-7
      `}
      color="background"
      size="sm"
      href={href}
    >
      <div className="size-5">
        <ArchiveBoxIcon />
      </div>
      목록으로
    </LinkButton>
  );
}

type Props = PropsWithChildren<{
  rootHref: string;
}>;

export function ContentDetailWrapper({ children, rootHref }: Props) {
  return (
    <div className="flex-col-start size-full gap-3">
      {children}

      <div className="flex-row-center w-full justify-end">
        <ArchiveBoxLinkButton href={rootHref} />
      </div>
    </div>
  );
}
