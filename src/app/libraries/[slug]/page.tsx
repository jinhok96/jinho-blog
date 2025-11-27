import type { Metadata } from 'next';

import Link from 'next/link';
import { notFound } from 'next/navigation';

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

  const LibraryComponent = library.Component;

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-4 text-4xl font-bold">{library.title}</h1>
      <p className="mb-4 text-gray-600">{library.description}</p>
      <div className="mb-8 flex gap-4">
        {library.npm && (
          <Link
            href={library.npm}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              rounded-sm bg-red-100 px-4 py-2 text-red-700
              hover:bg-red-200
            `}
          >
            NPM Package
          </Link>
        )}
        {library.github && (
          <Link
            href={library.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              rounded-sm bg-gray-100 px-4 py-2 text-gray-700
              hover:bg-gray-200
            `}
          >
            GitHub Repository
          </Link>
        )}
      </div>
      <div className="max-w-none">
        <LibraryComponent />
      </div>
    </article>
  );
}
