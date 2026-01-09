import type { Blog } from '@jinho-blog/mdx-handler';

import { BLOG_CATEGORY_MAP } from '@/core/map';
import { ContentHeader, MDXComponent } from '@/core/ui';

type Props = {
  post: Blog;
  fileContent: string;
};

export async function BlogPostContentSection({ post, fileContent }: Props) {
  const { title, category, createdAt, updatedAt } = post;

  return (
    <>
      <ContentHeader
        category={BLOG_CATEGORY_MAP[category]}
        title={title}
      >
        <ContentHeader.Date
          createdAt={createdAt}
          updatedAt={updatedAt}
        />
      </ContentHeader>

      <MDXComponent fileContent={fileContent} />
    </>
  );
}
