import type { GetLibraryGroupsByCategoryOptions } from '@jinho-blog/shared';

import { type NextRequest, NextResponse } from 'next/server';

import { getLibraryGroupsByCategory } from '@jinho-blog/mdx-handler';
import { ERROR_CODES } from '@jinho-blog/shared';

import { ApiError, createErrorResponse, logError } from '@/lib/api/error';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const count = searchParams.get('count');

    const options: GetLibraryGroupsByCategoryOptions = {
      count: count ? Number(count) : null,
    };

    const result = await getLibraryGroupsByCategory(options);

    return NextResponse.json(result);
  } catch (error) {
    logError(error, { endpoint: '/api/libraries/category' });

    if (error instanceof ApiError) {
      return createErrorResponse(error.code, error.details);
    }

    // 예상치 못한 에러
    return createErrorResponse(ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}
