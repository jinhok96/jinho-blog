import type { Metadata } from 'next';

import { routes } from '@jinho-blog/nextjs-routes';

import { generatePageMetadata } from '@/core/utils';

import { createBlogService } from '@/entities/blog';
import { createProjectsService } from '@/entities/projects';

import {
  HomeBlogSection,
  HomeCareerSection,
  HomeContactSection,
  HomeCoreSkillsSection,
  HomeEducationSection,
  HomeHeroSection,
  HomeProjectsSection,
  HomeSlideTab,
  HomeTechStackSection,
} from '@/views/home';

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

const SECTION_LABEL_MAP = {
  CORE_SKILLS: '핵심 역량',
  TECH_STACK: '기술 스택',
  CAREER: '경력 사항',
  PROJECTS: '프로젝트',
  BLOG: '블로그',
  EDUCATION: '교육',
  CONTACT: '연락처',
} as const;

const SECTION_TAB_LIST: {
  id: (typeof SECTION_ID_MAP)[keyof typeof SECTION_ID_MAP];
  label: (typeof SECTION_LABEL_MAP)[keyof typeof SECTION_LABEL_MAP];
}[] = [
  { id: 'skills-section', label: '핵심 역량' },
  { id: 'stack-section', label: '기술 스택' },
  { id: 'career-section', label: '경력 사항' },
  { id: 'projects-section', label: '프로젝트' },
  { id: 'blog-section', label: '블로그' },
  { id: 'education-section', label: '교육' },
  { id: 'contact-section', label: '연락처' },
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

        <HomeCoreSkillsSection
          id={SECTION_ID_MAP.CORE_SKILLS}
          label={SECTION_LABEL_MAP.CORE_SKILLS}
        />

        <HomeTechStackSection
          id={SECTION_ID_MAP.TECH_STACK}
          label={SECTION_LABEL_MAP.TECH_STACK}
        />

        <HomeCareerSection
          id={SECTION_ID_MAP.CAREER}
          label={SECTION_LABEL_MAP.CAREER}
        />

        <HomeProjectsSection
          id={SECTION_ID_MAP.PROJECTS}
          label={SECTION_LABEL_MAP.PROJECTS}
          projects={projects}
        />

        <HomeBlogSection
          id={SECTION_ID_MAP.BLOG}
          label={SECTION_LABEL_MAP.BLOG}
          posts={blogPosts}
        />

        <HomeEducationSection
          id={SECTION_ID_MAP.EDUCATION}
          label={SECTION_LABEL_MAP.EDUCATION}
        />

        <HomeContactSection
          id={SECTION_ID_MAP.CONTACT}
          label={SECTION_LABEL_MAP.CONTACT}
        />
      </div>
    </div>
  );
}
