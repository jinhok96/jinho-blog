import type { Project } from '@jinho-blog/mdx-handler';

import { routes } from '@jinho-blog/nextjs-routes';

import { PROJECT_CATEGORY_MAP } from '@/core/map';
import { ContentCardSection, LinkButton, Show } from '@/core/ui';

import { HomeSection } from '@/views/home/ui/HomeSection';

import ChevronRightIcon from 'public/icons/chevron_right.svg';

type Props = {
  id: string;
  label: string;
  projects: Project[];
};

export function HomeProjectsSection({ id, label, projects }: Props) {
  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>주요 프로젝트의 세부 사항을 확인해보세요</HomeSection.Header>

      <div className="flex-col-center w-full gap-6">
        <Show
          when={projects.length}
          fallback={ContentCardSection.Placeholder}
        >
          <ContentCardSection>
            {projects.map(({ category, slug, path, tech, title, description, createdAt }) => (
              <ContentCardSection.Card
                key={slug}
                href={path}
                scroll={false}
                category={PROJECT_CATEGORY_MAP[category]}
                title={title}
                description={description}
                createdAt={createdAt}
              >
                <ContentCardSection.TechBadgeList tech={tech} />
              </ContentCardSection.Card>
            ))}
          </ContentCardSection>
        </Show>
      </div>

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
  );
}
