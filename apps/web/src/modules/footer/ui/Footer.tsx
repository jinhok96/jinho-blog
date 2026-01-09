import { LINKS } from '@/core/constants';
import { LinkButton } from '@/core/ui';

import GithubIcon from 'public/icons/github.svg';
import RssIcon from 'public/icons/solid/rss-solid.svg';

function FooterLinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <LinkButton
      href={href}
      target="_blank"
      className={`
        aspect-square w-11 rounded-full bg-gray-8 p-2 text-gray-4
        hover:bg-gray-6
      `}
    >
      {children}
    </LinkButton>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="light w-full bg-black px-layout font-body-14 text-gray-5">
      <div className="flex-col-center w-full justify-center gap-8 border-t border-gray-8 pt-18 pb-layout">
        {/* 링크 버튼 */}
        <div className="flex-row-center gap-3">
          <FooterLinkButton href={LINKS.JINHO_BLOG_REPOSITORY}>
            <GithubIcon />
          </FooterLinkButton>
          <FooterLinkButton href={LINKS.RSS}>
            <RssIcon />
          </FooterLinkButton>
        </div>

        {/* Copyright */}
        <p className="font-caption-14">&copy; {year} Jinho Blog. All rights reserved.</p>
      </div>
    </footer>
  );
}
