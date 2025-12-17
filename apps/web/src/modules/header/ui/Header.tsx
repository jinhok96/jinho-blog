import { routes } from '@jinho-blog/nextjs-routes';

import { HeaderNavButton } from '@/modules/header/ui/HeaderNavButton';

export function Header() {
  return (
    <header className="fixed top-0 left-0 z-header h-header w-full">
      <div
        className={`
          absolute top-0 left-0 -z-10 size-full bg-background-3 mask-b-from-85% mask-b-to-100% mask-alpha
          backdrop-blur-md
        `}
      />

      <div className="container mx-auto flex-row-center size-full justify-between px-layout">
        <HeaderNavButton href={routes({ pathname: '/' })}>홈</HeaderNavButton>

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
  );
}
