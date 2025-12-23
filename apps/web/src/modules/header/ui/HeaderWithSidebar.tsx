'use client';

import { type PropsWithChildren, useRef, useState } from 'react';

import { useKeyDownEffect, useOutsideClickEffect } from '@/core/hooks';
import { Sidebar } from '@/core/ui';

import { Header } from '@/modules/header/ui/Header';

type Props = PropsWithChildren<{
  className?: string;
}>;

export function HeaderWithSidebar({ children, className }: Props) {
  const [isShow, setIsShow] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  const handleToggle = () => {
    setIsShow(!isShow);
  };

  useKeyDownEffect(['Escape'], () => {
    setIsShow(false);
  });

  useOutsideClickEffect(() => {
    setIsShow(false);
  }, [menuButtonRef, sidebarRef]);

  return (
    <>
      <Header
        leftMenuButton
        leftMenuButtonClassName="desktop:hidden"
        onLeftMenuButtonClick={handleToggle}
        leftMenuButtonRef={menuButtonRef}
      />

      <Sidebar
        className={className}
        isShow={isShow}
        ref={sidebarRef}
      >
        {children}
      </Sidebar>
    </>
  );
}
