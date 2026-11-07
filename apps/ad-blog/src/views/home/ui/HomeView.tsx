import type { Post } from '@/entities/post';

import { SITE_DESCRIPTION, SITE_NAME } from '@/core/config';
import { HOME_PATH } from '@/core/routes';
import { Container, PageHeader, Pagination } from '@/core/ui';

import { PostList } from '@/modules/post-list';

type Props = {
  /** 허브 글 (상단 고정) */
  hubs: Post[];
  /** 전체 글 1페이지 */
  posts: Post[];
  totalPages: number;
};

/**
 * 홈: 사이트 소개 + 허브 글(고정) + 최신 글 목록 (전체 글 1페이지)
 * - 허브는 최신 글에 밀리지 않도록 항상 위에 둠 (크롤러가 자주 다시 오는 홈 → 허브 → 클러스터 글로 이어지게)
 */
export function HomeView({ hubs, posts, totalPages }: Props) {
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

      {hubs.length > 0 && (
        <section
          aria-labelledby="hub-posts-heading"
          className="mt-10"
        >
          <h2
            id="hub-posts-heading"
            className="text-xl font-bold tracking-tight"
          >
            Start here
          </h2>
          <PostList
            posts={hubs}
            headingLevel={3}
            priorityCount={1}
            className="mt-6"
          />
        </section>
      )}

      <section
        aria-labelledby="latest-posts-heading"
        className="mt-14"
      >
        <h2
          id="latest-posts-heading"
          className="text-xl font-bold tracking-tight"
        >
          Latest posts
        </h2>
        <PostList
          posts={posts}
          headingLevel={3}
          priorityCount={hubs.length > 0 ? 0 : 1}
          inFeedAd
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
