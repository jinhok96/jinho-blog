import type { Blog } from '@jinho-blog/mdx-handler';

import { routes } from '@jinho-blog/nextjs-routes';

import { BLOG_CATEGORY_MAP } from '@/core/map';
import { ContentCardSection, LinkButton, Show } from '@/core/ui';

import { HomeSection } from '@/views/home/ui/HomeSection';

import ChevronRightIcon from 'public/icons/chevron_right.svg';

type Props = {
  id: string;
  label: string;
  posts: Blog[];
};

export function HomeBlogSection({ id, label, posts }: Props) {
  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>자세한 문제 해결 과정을 볼 수 있어요</HomeSection.Header>

      <div className="w-full">
        <Show
          when={posts.length}
          fallback={ContentCardSection.Placeholder}
        >
          <ContentCardSection>
            {posts.map(({ category, slug, path, title, description, createdAt }) => (
              <ContentCardSection.Card
                key={slug}
                href={path}
                category={BLOG_CATEGORY_MAP[category]}
                title={title}
                description={description}
                createdAt={createdAt}
              />
            ))}
          </ContentCardSection>
        </Show>
      </div>

      <LinkButton
        className="flex-row-center w-fit gap-2"
        href={routes({ pathname: '/blog' })}
        size="md"
        color="background"
        variant="outline"
      >
        <span>블로그 더보기</span>
        <div className="size-4">
          <ChevronRightIcon />
        </div>
      </LinkButton>
    </HomeSection>
  );
}
