import type { BlogCategory, ContentSortOption, GetBlogPostsOptions } from '@jinho-blog/shared';
import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { getBlogPosts } from '@jinho-blog/mdx-handler';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const options: GetBlogPostsOptions = {
      category: searchParams.get('category') as BlogCategory | undefined,
      sort: searchParams.get('sort') as ContentSortOption | undefined,
      page: Number(searchParams.get('page')) || undefined,
      count: Number(searchParams.get('count')) || undefined,
      search: searchParams.get('search') || undefined,
    };

    const result = await getBlogPosts(options);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
