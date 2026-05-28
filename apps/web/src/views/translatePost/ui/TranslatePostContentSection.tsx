import type { Translate } from '@jinho-blog/mdx-handler';

import { TRANSLATE_CATEGORY_MAP } from '@jinho-blog/shared';

import { ContentHeader, MDXComponent } from '@/core/ui';

type Props = {
  post: Translate;
  fileContent: string;
};

export async function TranslatePostContentSection({ post, fileContent }: Props) {
  const { title, category, createdAt, updatedAt } = post;

  return (
    <>
      <ContentHeader
        category={TRANSLATE_CATEGORY_MAP[category]}
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
