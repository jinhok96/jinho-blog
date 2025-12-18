import type { LibraryCategory } from '@jinho-blog/shared';
import type { Metadata } from 'next';

import { routes } from '@jinho-blog/nextjs-routes';

import { LIBRARY_CATEGORY_MAP } from '@/core/map';
import { generatePageMetadata } from '@/core/utils';

import { createLibrariesService } from '@/entities/libraries';

import { LibrariesContentSection } from '@/views/libraries';

const librariesService = createLibrariesService();

const LIMIT = 6;
const LIBRARY_CATEGORIES: LibraryCategory[] = ['react', 'nextjs', 'swr', 'motion', 'zustand'];

export const metadata: Metadata = generatePageMetadata({
  path: routes({ pathname: '/libraries' }),
  title: '라이브러리',
  description: '라이브러리 목록',
});

export default async function LibrariesListPage() {
  const { items } = await librariesService.getLibraries();

  // 카테고리별 그룹화
  const librariesByCategory = items.reduce(
    (result, item) => {
      if (!LIBRARY_CATEGORIES.includes(item.category)) return result;

      if (!result[item.category]) result[item.category] = [];
      if (result[item.category].length < LIMIT) result[item.category].push(item);

      return result;
    },
    {} as Record<LibraryCategory, typeof items>,
  );

  return (
    <div className="flex-col-start size-full gap-6">
      <h1 className="font-title-36">라이브러리</h1>

      <p>라이브러리 페이지 설명입니다. 이 페이지의 목적을 설명합니다. 지속적으로 추가할 예정입니다.</p>

      <div className="flex-col-start gap-14 pt-8">
        {LIBRARY_CATEGORIES.map(category => (
          <section
            key={category}
            className="w-full"
          >
            <p className="mb-5 font-subtitle-24">{LIBRARY_CATEGORY_MAP[category]}</p>

            <LibrariesContentSection libraries={librariesByCategory[category]} />
          </section>
        ))}
      </div>
    </div>
  );
}
