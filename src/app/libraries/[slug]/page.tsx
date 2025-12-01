import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { MDXComponent } from '@/core/mdx';
import { generatePageMetadata } from '@/core/utils';

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

  if (!library) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-4 text-4xl font-bold">{library.title}</h1>

      <p className="mb-4 text-gray-600">{library.description}</p>

      <div className="mb-8 flex flex-wrap gap-2">
        <span className="text-sm text-gray-500">Tech Stack:</span>
        {library.tech.map(t => (
          <span
            key={t}
            className="rounded-sm bg-blue-100 px-3 py-1 text-sm text-blue-700"
          >
            {t}
          </span>
        ))}
      </div>

      <MDXComponent filePath={library.filePath} />
    </article>
  );
}
