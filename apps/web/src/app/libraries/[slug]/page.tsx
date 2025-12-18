import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { routes } from '@jinho-blog/nextjs-routes';

import { LIBRARY_CATEGORY_MAP } from '@/core/map';
import { ContentHeader, MDXComponent } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

import { createLibrariesService } from '@/entities/libraries';

const librariesService = createLibrariesService();

type Props = {
  params: Promise<{ slug: string }>;
};

// SEO: 동적 메타데이터
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const library = await librariesService.getLibrary({ slug });

  if (!library) return {};

  return generatePageMetadata({
    path: routes({ pathname: '/libraries/[slug]', params: { slug } }),
    title: library.title,
    description: library.description,
  });
}

export default async function LibraryPage({ params }: Props) {
  const { slug } = await params;
  const library = await librariesService.getLibrary({ slug });

  if (!library) notFound();

  const { title, category, createdAt, updatedAt, tech } = library;

  const fileContent = await librariesService.getLibraryContent({ slug });

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
