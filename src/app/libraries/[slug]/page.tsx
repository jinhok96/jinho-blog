import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { readFileSync } from 'fs';

import { LIBRARY_CATEGORY_MAP } from '@/core/map';
import { ContentHeader, MDXComponent } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

import { getLibraries, getLibrary } from '@/entities/library';

type Props = {
  params: Promise<{ slug: string }>;
};

// SSG: 빌드 시 모든 경로 생성
export async function generateStaticParams() {
  const { items: libraries } = await getLibraries();
  return libraries.map(library => ({ slug: library.slug }));
}

// SEO: 동적 메타데이터
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const library = await getLibrary(slug);

  if (!library) return {};

  return generatePageMetadata({
    routerName: 'libraries',
    title: library.title,
    description: library.description,
  });
}

export default async function LibraryPage({ params }: Props) {
  const { slug } = await params;
  const library = await getLibrary(slug);

  if (!library) notFound();

  const { title, category, createdAt, updatedAt, tech, filePath } = library;

  const fileContent = readFileSync(filePath, 'utf-8');

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
