'use client';

import { type PropsWithChildren, useState } from 'react';

import { Sidebar } from '@/core/ui';

import { Header } from '@/modules/header/ui/Header';

type Props = PropsWithChildren<{
  className?: string;
}>;

export function HeaderWithSidebar({ children, className }: Props) {
  const [isShow, setIsShow] = useState(false);

  const handleToggle = () => {
    setIsShow(!isShow);
  };

  return (
    <>
      <Header
        leftMenuButton
        leftMenuButtonClassName="desktop:hidden"
        onLeftMenuButtonClick={handleToggle}
      />

      <Sidebar
        className={className}
        isShow={isShow}
      >
        {children}
      </Sidebar>
    </>
  );
}
