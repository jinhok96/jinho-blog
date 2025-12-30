import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { getLibrary } from '@jinho-blog/mdx-handler';
import { ERROR_CODES } from '@jinho-blog/shared';

import { ApiError, createErrorResponse, logError } from '@/app/api/_lib';

type Params = {
  slug: string;
};

export async function GET(request: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    const { slug } = await params;

    // 유효성 검증
    if (!slug || slug.trim() === '') {
      throw new ApiError(ERROR_CODES.INVALID_SLUG, { slug });
    }

    const library = await getLibrary(slug);

    if (!library) {
      throw new ApiError(ERROR_CODES.LIBRARY_NOT_FOUND, { slug });
    }

    return NextResponse.json(library);
  } catch (error) {
    logError(error, { endpoint: '/api/libraries/[slug]', slug: (await params).slug });

    if (error instanceof ApiError) {
      return createErrorResponse(error.code, error.details);
    }

    // 예상치 못한 에러
    return createErrorResponse(ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}
