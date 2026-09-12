import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { routes } from '@jinho-blog/nextjs-routes';
import { PROJECT_CATEGORY_MAP } from '@jinho-blog/shared';

import { AsyncBoundary, ContentDetailWrapper, JsonLd } from '@/core/ui';
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generatePageMetadata } from '@/core/utils';

import { createProjectsService } from '@/entities/projects';

import { OtherProjectsContentSection, ProjectDetail } from '@/views/projects';

const projectsService = createProjectsService();

type Props = {
  params: Promise<{ slug: string }>;
};

// SEO: 전체 프로젝트를 빌드 시점에 정적 생성 (크롤러 응답 속도/색인 효율 개선)
export async function generateStaticParams() {
  const { items } = await projectsService.getProjects({ count: '1000' });
  return items.map(({ slug }) => ({ slug }));
}

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
    keywords: [PROJECT_CATEGORY_MAP[project.category], ...project.tech],
    publishedTime: project.createdAt,
    modifiedTime: project.updatedAt,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  const [project, fileContent] = await Promise.all([
    projectsService.getProject({ slug }),
    projectsService.getProjectContent({ slug }),
  ]);

  if (!project) notFound();
  if (!fileContent) notFound();

  const { category } = project;

  const { items: otherProjects } = await projectsService.getProjects({ category, count: '1000' });

  const jsonLd = generateArticleJsonLd(project);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: '홈', path: routes({ pathname: '/' }) },
    { name: '프로젝트', path: routes({ pathname: '/projects' }) },
    { name: project.title, path: project.path },
  ]);

  return (
    <>
      {/* JSON-LD: TechArticle */}
      <JsonLd jsonLd={jsonLd} />
      {/* JSON-LD: BreadcrumbList */}
      <JsonLd jsonLd={breadcrumbJsonLd} />

      <ContentDetailWrapper rootHref={routes({ pathname: '/projects' })}>
        <ProjectDetail
          project={project}
          fileContent={fileContent}
        />

        <AsyncBoundary>
          <OtherProjectsContentSection
            category={category}
            projects={otherProjects}
          />
        </AsyncBoundary>
      </ContentDetailWrapper>
    </>
  );
}
