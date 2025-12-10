import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { getBlogContent } from '@jinho-blog/mdx-handler';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const content = await getBlogContent(slug);

    if (!content) {
      return NextResponse.json({ error: 'Blog content not found' }, { status: 404 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching blog content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
