import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { getBlogPosts } from '@jinho-blog/mdx-handler';
import { type GetBlogPostsOptions } from '@jinho-blog/shared';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const category = searchParams.get('category');
    const sort = searchParams.get('sort');
    const page = searchParams.get('page');
    const count = searchParams.get('count');
    const search = searchParams.get('search');

    const options: GetBlogPostsOptions = {};

    if (category) options.category = category;
    if (sort) options.sort = sort;
    if (page) options.page = Number(page);
    if (count) options.count = Number(count);
    if (search) options.search = search;

    const result = await getBlogPosts(options);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
