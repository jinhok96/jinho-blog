'use client';

import type { ComponentProps, Ref } from 'react';

import { routes } from '@jinho-blog/nextjs-routes';

import { Button, Show } from '@/core/ui';
import { cn } from '@/core/utils';

import { HeaderNavButton } from '@/modules/header/ui/HeaderNavButton';

import MenuIcon from 'public/icons/hamburger_menu.svg';

type Props = {
  leftMenuButton?: boolean;
  leftMenuButtonClassName?: string;
  onLeftMenuButtonClick?: ComponentProps<typeof Button>['onClick'];
  leftMenuButtonRef?: Ref<HTMLButtonElement>;
};

export function Header({ leftMenuButton, leftMenuButtonClassName, onLeftMenuButtonClick, leftMenuButtonRef }: Props) {
  return (
    <>
      {/* 배경 */}
      <div
        className={`
          pointer-events-auto fixed top-0 left-0 z-header-background h-header w-full mask-b-from-85% mask-b-to-100%
          mask-alpha backdrop-blur-md
        `}
      />

      {/* 헤더 */}
      <header className="pointer-events-none fixed top-0 left-0 z-header h-header w-screen">
        <div
          className={`
            mx-auto flex-row-center size-full justify-between px-layout
            touch:px-[calc(var(--padding-layout-x)-0.75rem)]
          `}
        >
          {/* 메뉴, 홈 */}
          <div className="flex-row-center">
            <Show when={leftMenuButton}>
              <Button
                className={cn(
                  `
                    aspect-square size-11 p-2.5 text-gray-5
                    hover:text-gray-8
                  `,
                  leftMenuButtonClassName,
                )}
                color="background"
                size="md"
                aria-label="메뉴 열기"
                onClick={onLeftMenuButtonClick}
                ref={leftMenuButtonRef}
              >
                <MenuIcon />
              </Button>
            </Show>
            <HeaderNavButton href={routes({ pathname: '/' })}>홈</HeaderNavButton>
          </div>

          {/* 네비게이션 */}
          <nav>
            <ul className="flex-row-center gap-1">
              <li>
                <HeaderNavButton href={routes({ pathname: '/projects' })}>프로젝트</HeaderNavButton>
              </li>
              <li>
                <HeaderNavButton href={routes({ pathname: '/blog' })}>블로그</HeaderNavButton>
              </li>
              <li>
                <HeaderNavButton href={routes({ pathname: '/libraries' })}>라이브러리</HeaderNavButton>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
