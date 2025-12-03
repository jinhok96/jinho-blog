import type { Metadata } from 'next';

import { ROUTER } from '@/core/config';
import { LIBRARY_CATEGORY_MAP } from '@/core/map';
import { ContentCard } from '@/core/ui';
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
    <div className="size-full">
      <h1 className="mb-8 text-4xl font-bold">라이브러리</h1>
      <div
        className={`
          grid grid-cols-1 gap-6
          md:grid-cols-2
        `}
      >
        {libraries.map(({ category, slug, ...post }) => (
          <ContentCard
            key={slug}
            href={`${ROUTER.libraries}/${slug}`}
            category={LIBRARY_CATEGORY_MAP[category]}
            {...post}
          />
        ))}
      </div>
    </div>
  );
}
