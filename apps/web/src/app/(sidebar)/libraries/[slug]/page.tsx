import type { Library } from '@jinho-blog/mdx-handler';
import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { routes } from '@jinho-blog/nextjs-routes';
import { TECH_STACK_MAP, type TechStack } from '@jinho-blog/shared';

import { ContentHeader, JsonLd, LinkButton, MDXComponent } from '@/core/ui';
import { cn, generateArticleJsonLd, generateBreadcrumbJsonLd, generatePageMetadata } from '@/core/utils';

import { createLibrariesService, sortLibraryGroupsByCategory } from '@/entities/libraries';

import { HeaderWithSidebar } from '@/modules/header';
import { LibraryBottomLinkSection } from '@/views/library';

const librariesService = createLibrariesService();

type Props = {
  params: Promise<{ slug: string }>;
};

// SEO: 전체 라이브러리를 빌드 시점에 정적 생성 (크롤러 응답 속도/색인 효율 개선)
export async function generateStaticParams() {
  const { items } = await librariesService.getLibraries({ count: '1000' });
  return items.map(({ slug }) => ({ slug }));
}

// SEO: 동적 메타데이터
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const library = await librariesService.getLibrary({ slug });

  if (!library) return {};

  return generatePageMetadata({
    path: routes({ pathname: '/libraries/[slug]', params: { slug } }),
    title: library.title,
    description: library.description,
    type: 'article',
    thumbnail: library.thumbnail,
    keywords: [TECH_STACK_MAP[library.category as TechStack], ...library.tech],
    publishedTime: library.createdAt,
    modifiedTime: library.updatedAt,
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

  const jsonLd = generateArticleJsonLd(library);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: '홈', path: routes({ pathname: '/' }) },
    { name: '라이브러리', path: routes({ pathname: '/libraries' }) },
    { name: library.title, path: library.path },
  ]);

  const sortedGroups = sortLibraryGroupsByCategory(groups);

  const flatGroups: Library[][] = sortedGroups
    .map(category => (groups[category] ?? []).flatMap(item => item))
    .filter(group => group.length > 0);

  const flatList: Library[] = flatGroups.flatMap(item => item);

  const currentItemIndex = flatList.findIndex(item => item.slug === slug);

  const prevLibrary: Library | null = currentItemIndex > 0 ? flatList[currentItemIndex - 1] : null;
  const nextLibrary: Library | null = currentItemIndex < flatList.length - 1 ? flatList[currentItemIndex + 1] : null;

  const { title, category, createdAt, updatedAt, tech } = library;

  return (
    <>
      {/* JSON-LD: TechArticle */}
      <JsonLd jsonLd={jsonLd} />
      {/* JSON-LD: BreadcrumbList */}
      <JsonLd jsonLd={breadcrumbJsonLd} />

      {/* 사이드바 */}
      <HeaderWithSidebar className="w-64 border-r border-gray-2">
        <div className="flex-col-start w-full">
          {flatGroups.map(group => (
            <div
              key={group[0].category}
              className={`
                w-full border-b border-gray-2 pt-6 pb-4
                first:pt-0
                last:border-0
              `}
            >
              {/* 카테고리 */}
              <p className="mb-1.5 font-caption-14 text-foreground">{TECH_STACK_MAP[group[0].category]}</p>

              {/* 리스트 */}
              <ul className="flex-col-start font-caption-16">
                {group.map(item => (
                  <li key={item.slug}>
                    <LinkButton
                      href={routes({ pathname: '/libraries/[slug]', params: { slug: item.slug } })}
                      className={cn(
                        `
                          py-1.5 text-gray-5
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
        <div
          className={`
            flex-col-start size-full container-768 flex-1 p-layout
            wide:container-1024
          `}
        >
          {/* 헤더 */}
          <ContentHeader
            category={TECH_STACK_MAP[category as TechStack]}
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
