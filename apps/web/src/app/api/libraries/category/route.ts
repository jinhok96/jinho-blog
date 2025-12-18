import type { GetLibraryGroupsByCategoryOptions } from '@jinho-blog/shared';

import { type NextRequest, NextResponse } from 'next/server';

import { getLibraryGroupsByCategory } from '@jinho-blog/mdx-handler';

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
    console.error('Error fetching libraries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
