import type { TocItem } from '@/core/mdx';
import type { BreadcrumbItem } from '@/core/seo';
import type { AdjacentPosts, Post } from '@/entities/post';
import type { ReactNode } from 'react';

import { Breadcrumbs, Container, Prose, Toc } from '@/core/ui';

import { PostList } from '@/modules/post-list';

import { AdjacentPostNav } from './AdjacentPostNav';
import { PostHeader } from './PostHeader';

type Props = {
  post: Post;
  /** 렌더링된 MDX 본문 */
  content: ReactNode;
  toc: TocItem[];
  relatedPosts: Post[];
  adjacentPosts: AdjacentPosts;
  breadcrumbs: BreadcrumbItem[];
};

/**
 * 글 상세
 */
export function PostView({ post, content, toc, relatedPosts, adjacentPosts, breadcrumbs }: Props) {
  return (
    <>
      <Container
        size="narrow"
        className={`
          py-8
          sm:py-12
        `}
      >
        <Breadcrumbs
          items={breadcrumbs}
          className="mb-6"
        />

        <article>
          <PostHeader post={post} />
          <Toc
            toc={toc}
            className="mt-8"
          />
          <Prose className="mt-8">{content}</Prose>

          {post.tags.length > 0 && (
            <footer className="mt-12">
              <ul
                aria-label="태그"
                className="flex flex-wrap gap-2"
              >
                {post.tags.map(tag => (
                  <li
                    key={tag}
                    className="rounded-full bg-surface px-3 py-1 text-sm text-muted"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            </footer>
          )}
        </article>

        <div className="mt-12">
          <AdjacentPostNav {...adjacentPosts} />
        </div>
      </Container>

      {relatedPosts.length > 0 && (
        <Container className="mt-8">
          <section
            aria-labelledby="related-posts-heading"
            className="border-t border-border pt-10"
          >
            <h2
              id="related-posts-heading"
              className="text-xl font-bold tracking-tight"
            >
              관련 글
            </h2>
            <PostList
              posts={relatedPosts}
              headingLevel={3}
              className="mt-6"
            />
          </section>
        </Container>
      )}
    </>
  );
}
