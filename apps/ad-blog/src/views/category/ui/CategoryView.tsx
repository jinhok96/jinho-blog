import type { Category } from '@/core/config';
import type { BreadcrumbItem } from '@/core/seo';
import type { Post } from '@/entities/post';

import { CATEGORY_MAP } from '@/core/config';
import { categoryPath, paginatedTitle } from '@/core/routes';
import { Breadcrumbs, Container, PageHeader, Pagination } from '@/core/ui';

import { PostList } from '@/modules/post-list';

type Props = {
  category: Category;
  posts: Post[];
  currentPage: number;
  totalPages: number;
  /** 카테고리 전체 글 수 */
  totalItems: number;
  breadcrumbs: BreadcrumbItem[];
};

/**
 * 카테고리 글 목록 (1페이지·n페이지 공용)
 */
export function CategoryView({ category, posts, currentPage, totalPages, totalItems, breadcrumbs }: Props) {
  const { name, description } = CATEGORY_MAP[category];

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
      <PageHeader
        title={paginatedTitle(name, currentPage)}
        description={description}
      />
      <p className="mt-2 text-sm text-muted">글 {totalItems}개</p>
      <PostList
        posts={posts}
        priorityCount={1}
        className="mt-8"
      />
      <Pagination
        basePath={categoryPath(category)}
        currentPage={currentPage}
        totalPages={totalPages}
        className="mt-10"
      />
    </Container>
  );
}
