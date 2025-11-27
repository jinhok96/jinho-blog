import type { Metadata } from 'next';

import Link from 'next/link';

import { generatePageMetadata } from '@/core/utils';

import { getBlogPosts } from '@/entities/blog';

export const metadata: Metadata = generatePageMetadata({
  routerName: 'blog',
  title: 'Blog',
  description: '블로그 목록',
});

export default async function BlogListPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Blog</h1>
      <div className="space-y-6">
        {posts.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={`
              block rounded-lg border p-6 transition-shadow
              hover:shadow-lg
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="mb-2 text-2xl font-bold">{post.title}</h2>
                <p className="mb-4 text-gray-600">{post.description}</p>
                {post.category.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.category.map(cat => (
                      <span key={cat} className="rounded-sm bg-gray-100 px-2 py-1 text-sm text-gray-700">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {post.createdAt && (
                <time className="ml-4 text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString('ko-KR')}</time>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
