import type { AdjacentPosts, CategorySummary, Post, PostListOptions } from '@/entities/post/types';
import type { PaginatedResult } from '@jinho-blog/shared';

import { paginateContentWithMeta, sortContent } from '@jinho-blog/mdx-handler';

import { CATEGORIES, POSTS_PER_PAGE } from '@/core/config';
import { contentReader } from '@/core/content';

/**
 * 초안은 개발 서버에서만 노출 (빌드 결과·sitemap·RSS에서 제외)
 */
function isVisible(post: Post): boolean {
  return !post.draft || process.env.NODE_ENV === 'development';
}

/**
 * 공개 글 목록 (최신순)
 */
export function getPosts(options?: PostListOptions): Post[] {
  const posts = contentReader.getEntries('posts').filter(isVisible);
  const filtered = options?.category ? posts.filter(post => post.category === options.category) : posts;

  return sortContent(filtered, 'createdAt,desc');
}

/**
 * 목록 페이지 (1부터 시작, POSTS_PER_PAGE개씩)
 */
export function getPostsPage(page: number, options?: PostListOptions): PaginatedResult<Post> {
  return paginateContentWithMeta(getPosts(options), page, POSTS_PER_PAGE);
}

/**
 * 목록 총 페이지 수 (글이 없어도 1)
 */
export function getPostPageCount(options?: PostListOptions): number {
  return Math.max(1, Math.ceil(getPosts(options).length / POSTS_PER_PAGE));
}

/**
 * 단일 글 조회 (초안은 개발 서버에서만)
 */
export function getPost(slug: string): Post | null {
  return getPosts().find(post => post.slug === slug) ?? null;
}

/**
 * 관련 글: 같은 카테고리(2점) + 공유 태그(태그당 1점) 점수순, 동점이면 최신순
 */
export function getRelatedPosts(post: Post, limit: number = 3): Post[] {
  const tags = new Set(post.tags);

  return getPosts()
    .filter(candidate => candidate.slug !== post.slug)
    .map(candidate => ({
      candidate,
      score: (candidate.category === post.category ? 2 : 0) + candidate.tags.filter(tag => tags.has(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

/**
 * 이전 글(더 오래된 글)·다음 글(더 최신 글)
 */
export function getAdjacentPosts(post: Post): AdjacentPosts {
  const posts = getPosts();
  const index = posts.findIndex(candidate => candidate.slug === post.slug);

  if (index === -1) return { previous: null, next: null };

  return {
    previous: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
}

/**
 * 글이 있는 카테고리와 글 수 (카테고리 정의 순서)
 */
export function getCategorySummaries(): CategorySummary[] {
  const posts = getPosts();

  return CATEGORIES.map(category => ({
    category,
    count: posts.filter(post => post.category === category).length,
  })).filter(({ count }) => count > 0);
}
