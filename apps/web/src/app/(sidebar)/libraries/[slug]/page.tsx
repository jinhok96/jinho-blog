import type { Library } from '@jinho-blog/mdx-handler';
import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { routes } from '@jinho-blog/nextjs-routes';

import { LIBRARY_CATEGORY_MAP, LIBRARY_CATEGORY_MAP_KEYS } from '@/core/map';
import { ContentHeader, LinkButton, MDXComponent } from '@/core/ui';
import { cn, generatePageMetadata } from '@/core/utils';

import { createLibrariesService } from '@/entities/libraries';

import { HeaderWithSidebar } from '@/modules/header';
import { LibraryBottomLinkSection } from '@/views/library';

const SIDEBAR_WIDTH_CLASSNAME = 'w-64';

const librariesService = createLibrariesService();

type Props = {
  params: Promise<{ slug: string }>;
};

// SEO: 동적 메타데이터
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const library = await librariesService.getLibrary({ slug });

  if (!library) return {};

  return generatePageMetadata({
    path: routes({ pathname: '/libraries/[slug]', params: { slug } }),
    title: library.title,
    description: library.description,
  });
}

export default async function LibraryPage({ params }: Props) {
  const { slug } = await params;

  const [groups, library, fileContent] = await Promise.all([
    librariesService.getLibraryGroupsByCategory(),
    librariesService.getLibrary({ slug }),
    librariesService.getLibraryContent({ slug }),
  ]);

  if (!library) notFound();
  if (!fileContent) notFound();

  const flatGroups: Library[][] = LIBRARY_CATEGORY_MAP_KEYS.map(category => groups[category].flatMap(item => item));

  const flatList: Library[] = flatGroups.flatMap(item => item);

  const currentItemIndex = flatList.findIndex(item => item.slug === slug);

  const prevLibrary: Library | null = currentItemIndex > 0 ? flatList[currentItemIndex - 1] : null;
  const nextLibrary: Library | null = currentItemIndex < flatList.length - 1 ? flatList[currentItemIndex + 1] : null;

  const { title, category, createdAt, updatedAt, tech } = library;

  return (
    <>
      {/* 사이드바 */}
      <HeaderWithSidebar className={cn('border-r border-gray-2', SIDEBAR_WIDTH_CLASSNAME)}>
        <div className="flex-col-start w-full">
          {flatGroups.map(group => (
            <div
              key={group[0].category}
              className={`
                w-full border-b border-gray-2 py-6
                first:pt-0
                last:border-0
              `}
            >
              {/* 카테고리 */}
              <p className="mb-2 font-caption-14 text-gray-5">{LIBRARY_CATEGORY_MAP[group[0].category]}</p>

              {/* 리스트 */}
              <ul className="flex-col-start gap-1 font-caption-16">
                {group.map(item => (
                  <li key={item.slug}>
                    <LinkButton
                      href={routes({ pathname: '/libraries/[slug]', params: { slug: item.slug } })}
                      className={cn(
                        `
                          py-1 text-gray-5
                          hover:text-gray-8
                        `,
                        item.slug === slug && 'text-blue-7 hover:text-blue-7 font-semibold',
                      )}
                    >
                      {item.title}
                    </LinkButton>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </HeaderWithSidebar>

      {/* 본문 */}
      <div className="flex-col-center size-full flex-1">
        <div className="container flex-col-start size-full flex-1 p-layout">
          {/* 헤더 */}
          <ContentHeader
            category={LIBRARY_CATEGORY_MAP[category]}
            title={title}
          >
            <ContentHeader.Date
              createdAt={createdAt}
              updatedAt={updatedAt}
            />
            <ContentHeader.TechStacks stacks={tech} />
          </ContentHeader>

          {/* MDX */}
          <MDXComponent fileContent={fileContent} />

          {/* 이전, 다음 버튼 섹션 */}
          <div className="w-full pt-14">
            <LibraryBottomLinkSection
              prevLibrary={prevLibrary}
              nextLibrary={nextLibrary}
            />
          </div>
        </div>
      </div>
    </>
  );
}
