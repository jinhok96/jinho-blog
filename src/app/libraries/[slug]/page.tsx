import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { MDXComponent } from '@/core/mdx';
import { TechBadge } from '@/core/ui';
import { formatDateToString, generatePageMetadata } from '@/core/utils';

import { getLibraries, getLibrary } from '@/entities/library';

type Props = {
  params: Promise<{ slug: string }>;
};

// SSG: 빌드 시 모든 경로 생성
export async function generateStaticParams() {
  const libraries = await getLibraries();
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

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-14 flex-col-start gap-4">
        <div>
          <p className="mb-1 font-subtitle-20 text-gray-4">{category}</p>
          <h1 className="font-title-40">{title}</h1>
        </div>

        <div className="flex-row-center flex-wrap gap-2">
          <time className="font-caption-14 text-gray-4">작성일: {formatDateToString(createdAt)}</time>
          <time className="font-caption-14 text-gray-4">수정일: {formatDateToString(updatedAt)}</time>
        </div>

        <div className="flex-row-center flex-wrap gap-2">
          {tech.map(item => (
            <TechBadge
              key={item}
              tech={item}
            />
          ))}
        </div>
      </div>

      <MDXComponent filePath={filePath} />
    </article>
  );
}
