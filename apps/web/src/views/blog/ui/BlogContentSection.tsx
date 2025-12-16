import type { Blog } from '@jinho-blog/mdx-handler';
import type { PaginatedResult } from '@jinho-blog/shared';

import { BLOG_CATEGORY_MAP } from '@/core/map';
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
          {posts.map(({ category, slug, path, ...post }) => (
            <ContentCardSection.Card
              key={slug}
              href={path}
              category={BLOG_CATEGORY_MAP[category]}
              {...post}
            />
          ))}
        </ContentCardSection>
      </Show>
    </div>
  );
}
