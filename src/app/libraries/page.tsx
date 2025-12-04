import type { Metadata } from 'next';

import { LIBRARY_CATEGORY_MAP } from '@/core/map';
import { ContentCardSection } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

import { getLibraries } from '@/entities/library';

export const metadata: Metadata = generatePageMetadata({
  routerName: 'libraries',
  title: '라이브러리',
  description: '라이브러리 목록',
});

export default async function LibrariesListPage() {
  const libraries = await getLibraries();

  return (
    <div className="flex-col-start size-full gap-6">
      <h1 className="font-title-36">라이브러리</h1>

      <p>사이드바 목록, 모바일에서 드로어</p>

      <ContentCardSection>
        {libraries.map(({ category, slug, path, tech, ...items }) => (
          <ContentCardSection.Card
            key={slug}
            href={path}
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
