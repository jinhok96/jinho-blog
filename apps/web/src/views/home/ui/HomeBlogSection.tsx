import { routes } from '@jinho-blog/nextjs-routes';

import { BLOG_CATEGORY_MAP } from '@/core/map';
import { ContentCardSection, LinkButton, Show } from '@/core/ui';

import { createBlogService } from '@/entities/blog';

import { HomeSection } from '@/views/home/ui/HomeSection';

import ChevronRightIcon from 'public/icons/chevron_right.svg';

const blogService = createBlogService();

type Props = {
  id: string;
  label: string;
};

export async function HomeBlogSection({ id, label }: Props) {
  const { items } = await blogService.getBlogPosts({ count: String(6) });

  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>자세한 문제 해결 과정을 볼 수 있어요</HomeSection.Header>

      <div className="w-full">
        <Show
          when={items.length}
          fallback={ContentCardSection.Placeholder}
        >
          <ContentCardSection>
            {items.map(({ category, slug, path, title, description, createdAt }) => (
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
        className="flex-row-center w-fit gap-2 text-foreground-6"
        href={routes({ pathname: '/blog' })}
        size="md"
        color="background"
      >
        <span>블로그 더보기</span>
        <div className="mb-px size-3">
          <ChevronRightIcon strokeWidth={1.5} />
        </div>
      </LinkButton>
    </HomeSection>
  );
}
