import type { ContentSortOption, GetLibrariesOptions, LibraryCategory } from '@jinho-blog/shared';
import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { getLibraries } from '@jinho-blog/mdx-handler';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const options: GetLibrariesOptions = {
      category: searchParams.get('category') as LibraryCategory | undefined,
      sort: searchParams.get('sort') as ContentSortOption | undefined,
      page: Number(searchParams.get('page')) || undefined,
      count: Number(searchParams.get('count')) || undefined,
      search: searchParams.get('search') || undefined,
    };

    const result = await getLibraries(options);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching libraries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
