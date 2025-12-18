import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { getBlogPosts } from '@jinho-blog/mdx-handler';
import { type BlogCategory, type ContentSortOption, type GetBlogPostsOptions } from '@jinho-blog/shared';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const category = searchParams.get('category') as BlogCategory | null;
    const sort = searchParams.get('sort') as ContentSortOption | null;
    const page = searchParams.get('page');
    const count = searchParams.get('count');
    const search = searchParams.get('search');

    const options: GetBlogPostsOptions = {
      category,
      sort,
      page: page ? Number(page) : null,
      count: count ? Number(count) : null,
      search,
    };

    const result = await getBlogPosts(options);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
