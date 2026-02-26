import type { Metadata } from 'next';

import { routes } from '@jinho-blog/nextjs-routes';
import { LIBRARY_CATEGORY_MAP, LIBRARY_CATEGORY_MAP_KEYS } from '@jinho-blog/shared';

import { LinkButton } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

import { createLibrariesService } from '@/entities/libraries';

import { Header } from '@/modules/header';
import { LibrariesContentSection } from '@/views/libraries';

import ChevronRightIcon from 'public/icons/chevron_right.svg';

const librariesService = createLibrariesService();

const LIMIT = 6;

export const metadata: Metadata = generatePageMetadata({
  path: routes({ pathname: '/libraries' }),
  title: '라이브러리',
});

export default async function LibrariesListPage() {
  const groups = await librariesService.getLibraryGroupsByCategory({
    count: LIMIT.toString(),
  });

  return (
    <div className="flex-col-center size-full">
      <Header />

      <div className="container flex-col-start size-full gap-6 p-layout">
        <h1 className="font-title-36">라이브러리</h1>

        <p>
          재사용 가능한 컴포넌트, 훅, 유틸 함수를 보관합니다. 개발에 사용할 목적으로 작성되었으며 지속적으로 추가/관리할
          예정입니다.
        </p>

        <div className="flex-col-start w-full gap-14 pt-8">
          {LIBRARY_CATEGORY_MAP_KEYS.map(category => {
            const libraries = groups[category];
            if (!libraries?.length) return null;

            return (
              <section
                key={category}
                className="w-full"
              >
                <div className="mb-5 flex-row-center justify-between">
                  <span className="font-subtitle-24">{LIBRARY_CATEGORY_MAP[category]}</span>
                  <LinkButton
                    href={routes({
                      pathname: '/libraries/[slug]',
                      params: { slug: libraries[0].slug },
                    })}
                    size="md"
                    color="background"
                    className={`
                      flex-row-center gap-1.5 leading-none text-gray-5
                      hover:text-gray-8
                    `}
                  >
                    더보기
                    <div className="size-4">
                      <ChevronRightIcon />
                    </div>
                  </LinkButton>
                </div>

                <LibrariesContentSection libraries={libraries.slice(0, LIMIT)} />
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
