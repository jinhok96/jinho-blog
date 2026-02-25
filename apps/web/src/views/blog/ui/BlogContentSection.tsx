import type { Blog } from '@jinho-blog/mdx-handler';

import { routes } from '@jinho-blog/nextjs-routes';
import { BLOG_CATEGORY_MAP, type PaginatedResult } from '@jinho-blog/shared';

import { ContentCardSection, Show } from '@/core/ui';

type Props = {
  posts: PaginatedResult<Blog>['items'];
};

export async function BlogContentSection({ posts }: Props) {
  return (
    <div className="w-full">
      <Show
        when={posts.length}
        fallback={ContentCardSection.Placeholder}
      >
        <ContentCardSection>
          {posts.map(({ category, slug, path, title, description, createdAt, thumbnail }) => (
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
  );
}
