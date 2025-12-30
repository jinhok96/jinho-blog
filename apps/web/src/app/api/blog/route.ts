import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { getBlogPosts } from '@jinho-blog/mdx-handler';
import { ERROR_CODES, type GetBlogPostsOptions } from '@jinho-blog/shared';

import { ApiError, createErrorResponse, logError } from '@/app/api/_lib';

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
    logError(error, { endpoint: '/api/blog' });

    if (error instanceof ApiError) {
      return createErrorResponse(error.code, error.details);
    }

    // 예상치 못한 에러
    return createErrorResponse(ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}
