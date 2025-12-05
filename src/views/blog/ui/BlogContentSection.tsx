import type { BlogCategory, SearchParams } from '@/core/types';

import { BLOG_CATEGORY_MAP } from '@/core/map';
import { ContentCardSection, Show } from '@/core/ui';
import { parseContentSearchParams } from '@/core/utils';

import { getBlogPosts } from '@/entities/blog';

type Props = {
  searchParams: Promise<SearchParams>;
};

export async function BlogContentSection({ searchParams }: Props) {
  const params = await searchParams;
  const options = parseContentSearchParams<BlogCategory>(params);

  const posts = await getBlogPosts(options);

  return (
    <ContentCardSection>
      <Show
        when={posts.length}
        fallback={ContentCardSection.Placeholder}
      >
        {posts.map(({ category, slug, path, ...post }) => (
          <ContentCardSection.Card
            key={slug}
            href={path}
            category={BLOG_CATEGORY_MAP[category]}
            {...post}
          />
        ))}
      </Show>
    </ContentCardSection>
  );
}
