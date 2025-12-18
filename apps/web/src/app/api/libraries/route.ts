import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { getLibraries } from '@jinho-blog/mdx-handler';
import { type ContentSortOption, type GetLibrariesOptions, type LibraryCategory } from '@jinho-blog/shared';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const category = searchParams.get('category') as LibraryCategory | null;
    const sort = searchParams.get('sort') as ContentSortOption | null;
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
    console.error('Error fetching libraries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
