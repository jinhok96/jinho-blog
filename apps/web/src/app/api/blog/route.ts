import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { getBlogPosts } from '@jinho-blog/mdx-handler';
import { type GetBlogPostsOptions, isBlogCategory, isContentSortOption } from '@jinho-blog/shared';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const category = searchParams.get('category');
    const sort = searchParams.get('sort');
    const page = searchParams.get('page');
    const count = searchParams.get('count');
    const search = searchParams.get('search');

    const options: GetBlogPostsOptions = {
      category: isBlogCategory(category) ? category : undefined,
      sort: isContentSortOption(sort) ? sort : undefined,
      page: Number(page) || undefined,
      count: Number(count) || undefined,
      search: search || undefined,
    };

    const result = await getBlogPosts(options);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
