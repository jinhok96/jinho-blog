import type { Post } from '@/entities/post';

import { SITE_DESCRIPTION, SITE_NAME } from '@/core/config';
import { HOME_PATH } from '@/core/routes';
import { Container, PageHeader, Pagination } from '@/core/ui';

import { PostList } from '@/modules/post-list';

type Props = {
  /** 전체 글 1페이지 */
  posts: Post[];
  totalPages: number;
};

/**
 * 홈: 사이트 소개 + 최신 글 목록 (전체 글 1페이지)
 */
export function HomeView({ posts, totalPages }: Props) {
  return (
    <Container
      className={`
        py-10
        sm:py-14
      `}
    >
      <PageHeader
        title={SITE_NAME}
        description={SITE_DESCRIPTION}
      />

      <section
        aria-labelledby="latest-posts-heading"
        className="mt-10"
      >
        <h2
          id="latest-posts-heading"
          className="text-xl font-bold tracking-tight"
        >
          최신 글
        </h2>
        <PostList
          posts={posts}
          headingLevel={3}
          priorityCount={1}
          className="mt-6"
        />
        <Pagination
          basePath={HOME_PATH}
          currentPage={1}
          totalPages={totalPages}
          className="mt-10"
        />
      </section>
    </Container>
  );
}
