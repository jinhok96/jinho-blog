import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import Link from 'next/link';

import { routes } from '@jinho-blog/nextjs-routes';

import { generatePageMetadata } from '@/core/utils';

import { createBlogService } from '@/entities/blog';
import { createProjectsService } from '@/entities/projects';

import { BlogContentSection } from '@/views/blog';
import { ProjectsContentSection } from '@/views/projects';

export const metadata: Metadata = generatePageMetadata({ path: routes({ pathname: '/' }) });

const projectsService = createProjectsService();
const blogService = createBlogService();

type HomeSectionProps = PropsWithChildren;

function HomeSection({ children }: HomeSectionProps) {
  return (
    <section className="w-full px-layout">
      <div className="container mx-auto my-layout size-full">{children}</div>
    </section>
  );
}

export default async function HomePage() {
  const [{ items: projects }, { items: blogPosts }] = await Promise.all([
    projectsService.getProjects({ count: String(6) }),
    blogService.getBlogPosts({ count: String(6) }),
  ]);

  return (
    <div className="size-full pb-layout">
      <HomeSection>
        <h1 className="font-title-44">
          안녕하세요,
          <br />
          프론트엔드 개발자
          <br />
          <span className="text-blue-7">강진호</span>입니다.
        </h1>
        <p>소개글</p>
        <p>이력서 다운로드</p>
      </HomeSection>

      <HomeSection>핵심 역량</HomeSection>

      <HomeSection>기술 스택</HomeSection>

      <HomeSection>경력 사항</HomeSection>

      <HomeSection>
        <p>주요 프로젝트</p>
        <Link href={routes({ pathname: '/projects' })}>Projects</Link>

        <ProjectsContentSection projects={projects} />
      </HomeSection>

      <HomeSection>
        <p>블로그</p>
        <Link href={routes({ pathname: '/blog' })}>Blog</Link>

        <BlogContentSection posts={blogPosts} />
      </HomeSection>

      <HomeSection>연락처</HomeSection>
    </div>
  );
}
