import type { GetProjectsOptions } from '@jinho-blog/shared';
import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { getProjects } from '@jinho-blog/mdx-handler';
import { ERROR_CODES } from '@jinho-blog/shared';

import { ApiError, createErrorResponse, logError } from '@/lib/api/error';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const category = searchParams.get('category');
    const sort = searchParams.get('sort');
    const page = searchParams.get('page');
    const count = searchParams.get('count');
    const search = searchParams.get('search');

    const options: GetProjectsOptions = {
      category,
      sort,
      page: page ? Number(page) : null,
      count: count ? Number(count) : null,
      search,
    };

    const result = await getProjects(options);

    return NextResponse.json(result);
  } catch (error) {
    logError(error, { endpoint: '/api/projects' });

    if (error instanceof ApiError) {
      return createErrorResponse(error.code, error.details);
    }

    // 예상치 못한 에러
    return createErrorResponse(ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}
