import type { Metadata } from 'next';

import { routes } from '@jinho-blog/nextjs-routes';

import { JsonLd } from '@/core/ui';
import { generatePageMetadata, generateProfilePageJsonLd } from '@/core/utils';

import {
  HomeBlogSection,
  HomeCareerSection,
  HomeCoreSkillsSection,
  HomeEducationSection,
  HomeProjectsSection,
  HomeSlideTab,
  HomeTechStackSection,
} from '@/views/home';

export const metadata: Metadata = generatePageMetadata({
  path: routes({ pathname: '/' }),
  siteName: '강진호 프론트엔드 포트폴리오',
  description:
    '사용자 중심 UI/UX를 고민하는 프론트엔드 개발자 강진호입니다. 실무 프로젝트, 기술 블로그, 재사용 라이브러리를 정리했습니다.',
  titleMode: 'absolute',
});

export default async function HomePage() {
  const jsonLd = generateProfilePageJsonLd();

  return (
    <div className="size-full">
      {/* JSON-LD: ProfilePage */}
      <JsonLd jsonLd={jsonLd} />

      <div className="relative size-full py-layout">
        <HomeSlideTab />

        <HomeCoreSkillsSection />

        <HomeTechStackSection />

        <HomeProjectsSection />

        <HomeCareerSection />

        <HomeBlogSection />

        <HomeEducationSection />
      </div>
    </div>
  );
}
