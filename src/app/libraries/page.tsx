import type { Metadata } from 'next';

import { ROUTER } from '@/core/config';
import { LIBRARY_CATEGORY_MAP } from '@/core/map';
import { ContentCardSection } from '@/core/ui';
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

      <ContentCardSection>
        {libraries.map(({ category, slug, tech, ...items }) => (
          <ContentCardSection.Card
            key={slug}
            href={`${ROUTER.libraries}/${slug}`}
            category={LIBRARY_CATEGORY_MAP[category]}
            {...items}
          >
            <ContentCardSection.TechBadgeList tech={tech} />
          </ContentCardSection.Card>
        ))}
      </ContentCardSection>
    </div>
  );
}
