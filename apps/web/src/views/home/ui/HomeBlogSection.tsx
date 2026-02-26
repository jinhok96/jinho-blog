import { routes } from '@jinho-blog/nextjs-routes';
import { BLOG_CATEGORY_MAP } from '@jinho-blog/shared';

import { ContentCardSection, LinkButton, Show } from '@/core/ui';

import { createBlogService } from '@/entities/blog';

import { HOME_SECTION_ID_LABEL_MAP } from '@/views/home/model';
import { HomeSection } from '@/views/home/ui/HomeSection';

import ChevronRightIcon from 'public/icons/chevron_right.svg';

const blogService = createBlogService();

const { id, label } = HOME_SECTION_ID_LABEL_MAP.BLOG;

export async function HomeBlogSection() {
  const { items } = await blogService.getBlogPosts({ count: 3 });

  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>자세한 문제 해결 과정을 볼 수 있어요</HomeSection.Header>

      <div className="w-full">
        <Show
          when={items.length}
          fallback={ContentCardSection.Placeholder}
        >
          <ContentCardSection>
            {items.map(({ category, slug, path, title, description, createdAt, thumbnail }) => (
              <ContentCardSection.Card
                key={slug}
                href={path}
                category={BLOG_CATEGORY_MAP[category]}
                createdAt={createdAt}
                thumbnail={thumbnail ?? routes({ pathname: '/api/og', search: { title } })}
                showThumbnail
              >
                <ContentCardSection.BlogInfo
                  title={title}
                  description={description}
                />
              </ContentCardSection.Card>
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
