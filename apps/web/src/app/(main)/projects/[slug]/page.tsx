import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { routes, type SearchParams } from '@jinho-blog/nextjs-routes';

import { AsyncBoundary, ContentDetailWrapper, JsonLd } from '@/core/ui';
import { generateArticleJsonLd, generatePageMetadata } from '@/core/utils';

import { createProjectsService, type GetProjects } from '@/entities/projects';

import { OtherProjectsContentSection, ProjectDetail } from '@/views/projects';

const projectsService = createProjectsService();

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams<Record<keyof GetProjects['search'], string | string[] | undefined>>>;
};

// SEO: 동적 메타데이터
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await projectsService.getProject({ slug });

  if (!project) return {};

  return generatePageMetadata({
    path: routes({ pathname: '/projects/[slug]', params: { slug } }),
    title: project.title,
    description: project.description,
    type: 'article',
    thumbnail: project.thumbnail,
  });
}

export default async function ProjectPage({ params, searchParams }: Props) {
  const [{ slug }, { page }] = await Promise.all([params, searchParams]);

  const [project, fileContent] = await Promise.all([
    projectsService.getProject({ slug }),
    projectsService.getProjectContent({ slug }),
  ]);

  if (!project) notFound();
  if (!fileContent) notFound();

  const { category } = project;
  const jsonLd = generateArticleJsonLd(project);

  return (
    <>
      {/* JSON-LD: TechArticle */}
      <JsonLd jsonLd={jsonLd} />

      <ContentDetailWrapper rootHref={routes({ pathname: '/projects' })}>
        <ProjectDetail
          project={project}
          fileContent={fileContent}
        />

        <AsyncBoundary>
          <OtherProjectsContentSection
            category={category}
            page={page}
          />
        </AsyncBoundary>
      </ContentDetailWrapper>
    </>
  );
}
