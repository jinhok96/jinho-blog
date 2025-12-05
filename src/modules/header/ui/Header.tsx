import { ROUTER } from '@/core/config';

import { HeaderNavButton } from '@/modules/header/ui/HeaderNavButton';

export function Header() {
  return (
    <header className="fixed top-0 left-0 h-header w-full bg-background-5 backdrop-blur-md">
      <div className="container mx-auto flex-row-center size-full justify-between px-layout">
        <HeaderNavButton href={ROUTER.home}>홈</HeaderNavButton>

        <nav>
          <ul className="flex-row-center gap-1">
            <li>
              <HeaderNavButton href={ROUTER.projects}>프로젝트</HeaderNavButton>
            </li>
            <li>
              <HeaderNavButton href={ROUTER.blog}>블로그</HeaderNavButton>
            </li>
            <li>
              <HeaderNavButton href={ROUTER.libraries}>라이브러리</HeaderNavButton>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
