import type { BreadcrumbItem } from '@/core/seo';
import type { Post } from '@/entities/post';

import { HOME_PATH, paginatedTitle } from '@/core/routes';
import { Breadcrumbs, Container, PageHeader, Pagination } from '@/core/ui';

import { PostList } from '@/modules/post-list';

type Props = {
  posts: Post[];
  /** 2페이지 이상 (1페이지는 홈) */
  currentPage: number;
  totalPages: number;
  breadcrumbs: BreadcrumbItem[];
};

/**
 * 전체 글 n페이지
 */
export function PostsPageView({ posts, currentPage, totalPages, breadcrumbs }: Props) {
  return (
    <Container
      className={`
        py-8
        sm:py-12
      `}
    >
      <Breadcrumbs
        items={breadcrumbs}
        className="mb-6"
      />
      <PageHeader title={paginatedTitle('전체 글', currentPage)} />
      <PostList
        posts={posts}
        priorityCount={1}
        className="mt-8"
      />
      <Pagination
        basePath={HOME_PATH}
        currentPage={currentPage}
        totalPages={totalPages}
        className="mt-10"
      />
    </Container>
  );
}
