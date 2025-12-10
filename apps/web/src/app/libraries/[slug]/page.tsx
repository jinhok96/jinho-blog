import type { Library } from '@jinho-blog/mdx-handler';
import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { LIBRARY_CATEGORY_MAP } from '@/core/map';
import { ContentHeader, MDXComponent } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

type Props = {
  params: Promise<{ slug: string }>;
};

async function fetchLibrary(slug: string): Promise<Library | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/libraries/${slug}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  return res.json();
}

async function fetchLibraryContent(slug: string): Promise<string | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/libraries/${slug}/content`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  const { content } = await res.json();
  return content;
}

// SEO: 동적 메타데이터
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const library = await fetchLibrary(slug);

  if (!library) return {};

  return generatePageMetadata({
    routerName: 'libraries',
    title: library.title,
    description: library.description,
  });
}

export default async function LibraryPage({ params }: Props) {
  const { slug } = await params;
  const library = await fetchLibrary(slug);

  if (!library) notFound();

  const { title, category, createdAt, updatedAt, tech } = library;

  const fileContent = await fetchLibraryContent(slug);

  if (!fileContent) notFound();

  return (
    <div className="size-full">
      <ContentHeader
        category={LIBRARY_CATEGORY_MAP[category]}
        title={title}
        createdAt={createdAt}
        updatedAt={updatedAt}
        tech={tech}
      />

      <MDXComponent fileContent={fileContent} />
    </div>
  );
}
