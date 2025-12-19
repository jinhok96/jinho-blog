import type { Library } from '@jinho-blog/mdx-handler';
import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { routes } from '@jinho-blog/nextjs-routes';

import { LIBRARY_CATEGORY_MAP, LIBRARY_CATEGORY_MAP_KEYS } from '@/core/map';
import { ContentHeader, LinkButton, MDXComponent, Show } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

import { createLibrariesService } from '@/entities/libraries';

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

  const flatGroups: Library[] = LIBRARY_CATEGORY_MAP_KEYS.map(category =>
    groups[category].flatMap(item => item),
  ).flatMap(item => item);

  const currentItemIndex = flatGroups.findIndex(item => item.slug === slug);

  const prevItem: Library | null = currentItemIndex > 0 ? flatGroups[currentItemIndex - 1] : null;
  const nextItem: Library | null = currentItemIndex < flatGroups.length - 1 ? flatGroups[currentItemIndex + 1] : null;

  const { title, category, createdAt, updatedAt, tech } = library;

  return (
    <div className="flex-row-start size-full flex-1">
      <aside
        className={`
          flex-col-start min-h-screen pt-header
          not-desktop:hidden
        `}
      >
        <div className={`flex-col-start h-full flex-1 overflow-auto border-4 border-red-6 p-layout-x`}>
          <p className="h-50 bg-amber-5">사이드바</p>
        </div>
      </aside>

      <div className="flex-col-center size-full flex-1">
        <div className="container flex-col-start size-full max-h-screen flex-1 overflow-auto p-layout">
          <ContentHeader
            category={LIBRARY_CATEGORY_MAP[category]}
            title={title}
            createdAt={createdAt}
            updatedAt={updatedAt}
            tech={tech}
          />

          <MDXComponent fileContent={fileContent} />

          <div className="flex-row-center w-full justify-between">
            <Show
              when={prevItem}
              fallback={<div />}
            >
              {item => (
                <LinkButton href={routes({ pathname: '/libraries/[slug]', params: { slug: item.slug } })}>
                  이전
                </LinkButton>
              )}
            </Show>

            <Show
              when={nextItem}
              fallback={<div />}
            >
              {item => (
                <LinkButton href={routes({ pathname: '/libraries/[slug]', params: { slug: item.slug } })}>
                  다음
                </LinkButton>
              )}
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}
