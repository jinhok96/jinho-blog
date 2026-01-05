import type { Metadata } from 'next';

import { routes } from '@jinho-blog/nextjs-routes';

import { LinkButton } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

import { createBlogService } from '@/entities/blog';
import { createProjectsService } from '@/entities/projects';

import { BlogContentSection } from '@/views/blog';
import { HomeHeroSection, HomeSlideTab } from '@/views/home';
import { HomeSection } from '@/views/home/ui/HomeSection';
import { ProjectsContentSection } from '@/views/projects';

import ChevronRightIcon from 'public/icons/chevron_right.svg';

export const metadata: Metadata = generatePageMetadata({ path: routes({ pathname: '/' }) });

const projectsService = createProjectsService();
const blogService = createBlogService();

const SECTION_ID_MAP = {
  CORE_SKILLS: 'skills-section',
  TECH_STACK: 'stack-section',
  CAREER: 'career-section',
  PROJECTS: 'projects-section',
  BLOG: 'blog-section',
  EDUCATION: 'education-section',
  CONTACT: 'contact-section',
} as const;

const SECTION_TAB_LIST: { id: (typeof SECTION_ID_MAP)[keyof typeof SECTION_ID_MAP]; label: string }[] = [
  { id: SECTION_ID_MAP.CORE_SKILLS, label: '핵심 역량' },
  { id: SECTION_ID_MAP.TECH_STACK, label: '기술 스택' },
  { id: SECTION_ID_MAP.CAREER, label: '경력 사항' },
  { id: SECTION_ID_MAP.PROJECTS, label: '프로젝트' },
  { id: SECTION_ID_MAP.BLOG, label: '블로그' },
  { id: SECTION_ID_MAP.EDUCATION, label: '교육' },
  { id: SECTION_ID_MAP.CONTACT, label: '연락처' },
];

export default async function HomePage() {
  const [{ items: projects }, { items: blogPosts }] = await Promise.all([
    projectsService.getProjects({ count: String(6) }),
    blogService.getBlogPosts({ count: String(6) }),
  ]);

  return (
    <div className="size-full pb-layout">
      {/* 히어로 */}
      <HomeHeroSection />

      <div className="relative size-full py-layout">
        <HomeSlideTab tabs={SECTION_TAB_LIST} />

        <HomeSection id={SECTION_ID_MAP.CORE_SKILLS}>핵심 역량</HomeSection>

        <HomeSection id={SECTION_ID_MAP.TECH_STACK}>기술 스택</HomeSection>

        <HomeSection id={SECTION_ID_MAP.CAREER}>경력 사항</HomeSection>

        <HomeSection id={SECTION_ID_MAP.PROJECTS}>
          <div className="w-full text-center">
            <p className="mb-2 w-full font-subtitle-16 text-blue-7">프로젝트</p>
            <p className="font-title-28">주요 프로젝트의 세부 사항을 확인해보세요</p>
          </div>

          <ProjectsContentSection projects={projects} />

          <LinkButton
            className="flex-row-center w-fit gap-2"
            href={routes({ pathname: '/projects' })}
            size="md"
            color="background"
            variant="outline"
          >
            <span>프로젝트 더보기</span>
            <div className="size-4">
              <ChevronRightIcon />
            </div>
          </LinkButton>
        </HomeSection>

        <HomeSection id={SECTION_ID_MAP.BLOG}>
          <div className="w-full text-center">
            <p className="mb-2 w-full font-subtitle-16 text-blue-7">블로그</p>
          </div>

          <BlogContentSection posts={blogPosts} />

          <LinkButton
            className="flex-row-center w-fit gap-2"
            href={routes({ pathname: '/blog' })}
            size="md"
            color="background"
            variant="outline"
          >
            <span>블로그 더보기</span>
            <div className="size-4">
              <ChevronRightIcon />
            </div>
          </LinkButton>
        </HomeSection>

        <HomeSection id={SECTION_ID_MAP.EDUCATION}>교육</HomeSection>

        <HomeSection id={SECTION_ID_MAP.CONTACT}>연락처</HomeSection>
      </div>
    </div>
  );
}
