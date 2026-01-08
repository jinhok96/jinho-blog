import { LINKS } from '@/core/constants';
import { LinkButton } from '@/core/ui';

import GithubIcon from 'public/icons/github.svg';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="light w-full bg-black px-layout font-body-14 text-gray-5">
      <div className="flex-col-center w-full justify-center gap-6 border-t border-gray-8 pt-18 pb-layout">
        <div className="flex-row-center gap-2">
          <LinkButton
            href={LINKS.JINHO_BLOG_REPOSITORY}
            target="_blank"
            className={`
              aspect-square w-11 rounded-full bg-gray-8 p-2 text-white
              hover:bg-gray-6
            `}
          >
            <GithubIcon />
          </LinkButton>
        </div>

        {/* Copyright */}
        <p>&copy; {year} Jinho Blog. All rights reserved.</p>
      </div>
    </footer>
  );
}
