import type { Metadata } from 'next';

import Link from 'next/link';

import { generatePageMetadata } from '@/core/utils';

import { getLibraries } from '@/entities/library';

export const metadata: Metadata = generatePageMetadata({
  routerName: 'libraries',
  title: 'Libraries',
  description: '라이브러리 목록',
});

export default async function LibrariesListPage() {
  const libraries = await getLibraries();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Libraries</h1>
      <div
        className={`
          grid grid-cols-1 gap-6
          md:grid-cols-2
        `}
      >
        {libraries.map(library => (
          <Link
            key={library.slug}
            href={`/libraries/${library.slug}`}
            className={`
              block rounded-lg border p-6 transition-shadow
              hover:shadow-lg
            `}
          >
            <h2 className="mb-2 text-xl font-bold">{library.title}</h2>
            <p className="mb-4 text-gray-600">{library.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
