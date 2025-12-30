import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { getLibraries } from '@jinho-blog/mdx-handler';
import { ERROR_CODES, type GetLibrariesOptions } from '@jinho-blog/shared';

import { ApiError, createErrorResponse, logError } from '@/lib/api/error';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const category = searchParams.get('category');
    const sort = searchParams.get('sort');
    const page = searchParams.get('page');
    const count = searchParams.get('count');
    const search = searchParams.get('search');

    const options: GetLibrariesOptions = {
      category,
      sort,
      page: page ? Number(page) : null,
      count: count ? Number(count) : null,
      search,
    };

    const result = await getLibraries(options);

    return NextResponse.json(result);
  } catch (error) {
    logError(error, { endpoint: '/api/libraries' });

    if (error instanceof ApiError) {
      return createErrorResponse(error.code, error.details);
    }

    // 예상치 못한 에러
    return createErrorResponse(ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}
