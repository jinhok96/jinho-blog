import type { ContentSortOption, GetProjectsOptions, ProjectCategory } from '@jinho-blog/shared';
import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { getProjects } from '@jinho-blog/mdx-handler';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const category = searchParams.get('category') as ProjectCategory | null;
    const sort = searchParams.get('sort') as ContentSortOption | null;
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
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
