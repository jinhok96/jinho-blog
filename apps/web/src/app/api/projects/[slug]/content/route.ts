import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { getProjectContent } from '@jinho-blog/mdx-handler';

type Params = {
  slug: string;
};

export async function GET(request: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    const { slug } = await params;
    const content = await getProjectContent(slug);

    if (!content) {
      return NextResponse.json({ error: 'Project content not found' }, { status: 404 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching project content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
