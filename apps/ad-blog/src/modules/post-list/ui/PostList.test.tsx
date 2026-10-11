import type { Post } from '@/entities/post';

import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it, vi } from 'vitest';

vi.mock('@/core/ads', () => ({
  AdSlot: ({ placement }: { placement: string }) => <div data-ad-placement={placement} />,
}));

vi.mock('./PostCard', () => ({
  PostCard: ({ post }: { post: Post }) => <span data-slug={post.slug} />,
}));

import { PostList } from './PostList';

function makePosts(count: number): Post[] {
  return Array.from({ length: count }, (_, index) => ({ slug: `post-${index + 1}` }) as Post);
}

function renderList(count: number, inFeedAd?: boolean): string {
  return renderToStaticMarkup(
    <PostList
      posts={makePosts(count)}
      inFeedAd={inFeedAd}
    />,
  );
}

function adCount(html: string): number {
  return html.match(/data-ad-placement="listInFeed"/g)?.length ?? 0;
}

describe('PostList 인피드 광고', () => {
  it('7개 이상이면 6번째 카드 바로 뒤에 한 줄 전체 광고 1개', () => {
    const html = renderList(7, true);

    expect(adCount(html)).toBe(1);
    expect(html.indexOf('listInFeed')).toBeGreaterThan(html.indexOf('data-slug="post-6"'));
    expect(html.indexOf('listInFeed')).toBeLessThan(html.indexOf('data-slug="post-7"'));
    expect(html).toContain('col-span-full');
  });

  it('6개 이하이면 광고 없음 (목록 끝 광고 방지)', () => {
    expect(adCount(renderList(6, true))).toBe(0);
  });

  it('기본값(관련 글 등 보조 목록)은 광고 없음', () => {
    expect(adCount(renderList(12))).toBe(0);
  });
});
