import type { Metadata } from 'next';

import { routes } from '@jinho-blog/nextjs-routes';

import { generatePageMetadata } from '@/core/utils';

import {
  HomeBlogSection,
  HomeCareerSection,
  HomeContactSection,
  HomeCoreSkillsSection,
  HomeEducationSection,
  HomeProjectsSection,
  HomeSlideTab,
  HomeTechStackSection,
} from '@/views/home';

export const metadata: Metadata = generatePageMetadata({ path: routes({ pathname: '/' }) });

export default async function HomePage() {
  return (
    <div className="relative size-full py-layout">
      <HomeSlideTab />

      <HomeCoreSkillsSection />

      <HomeTechStackSection />

      <HomeCareerSection />

      <HomeProjectsSection />

      <HomeBlogSection />

      <HomeEducationSection />

      <HomeContactSection />
    </div>
  );
}
