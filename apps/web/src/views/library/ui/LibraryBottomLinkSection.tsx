import type { Library } from '@jinho-blog/mdx-handler';

import { routes } from '@jinho-blog/nextjs-routes';

import { LinkButton, Show } from '@/core/ui';
import { cn } from '@/core/utils';

import ChevronLeftIcon from 'public/icons/chevron_left.svg';
import ChevronRightIcon from 'public/icons/chevron_right.svg';

type LibraryLinkButtonProps = {
  slug: string;
  title?: string;
  type: 'prev' | 'next';
};

function LibraryLinkButton({ slug, title, type }: LibraryLinkButtonProps) {
  return (
    <LinkButton
      className={cn(
        `
          w-full gap-2 p-4
          desktop:w-1/3
        `,
        {
          'flex-col-start': type === 'prev',
          'flex-col-end': type === 'next',
        },
      )}
      color="background"
      size="md"
      variant="outline"
      href={routes({ pathname: '/libraries/[slug]', params: { slug } })}
    >
      <div className="flex-row-center gap-1 font-caption-14 text-gray-5">
        <Show when={type === 'prev'}>
          <div className="size-3">
            <ChevronLeftIcon strokeWidth={1.5} />
          </div>
          <span>이전</span>
        </Show>
        <Show when={type === 'next'}>
          <span>다음</span>
          <div className="size-3">
            <ChevronRightIcon strokeWidth={1.5} />
          </div>
        </Show>
      </div>
      <p>{title}</p>
    </LinkButton>
  );
}

type Props = {
  prevLibrary: Library | null;
  nextLibrary: Library | null;
};

export function LibraryBottomLinkSection({ prevLibrary, nextLibrary }: Props) {
  return (
    <section className="flex-row-center w-full justify-between gap-4">
      <Show
        when={prevLibrary}
        fallback={<div />}
      >
        {item => (
          <LibraryLinkButton
            slug={item.slug}
            title={item.title}
            type="prev"
          />
        )}
      </Show>

      <Show
        when={nextLibrary}
        fallback={<div />}
      >
        {item => (
          <LibraryLinkButton
            slug={item.slug}
            title={item.title}
            type="next"
          />
        )}
      </Show>
    </section>
  );
}
