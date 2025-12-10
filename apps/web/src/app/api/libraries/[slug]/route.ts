import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { getLibrary } from '@jinho-blog/mdx-handler';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const library = await getLibrary(slug);

    if (!library) {
      return NextResponse.json({ error: 'Library not found' }, { status: 404 });
    }

    return NextResponse.json(library);
  } catch (error) {
    console.error('Error fetching library:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
