import { routes } from '@jinho-blog/nextjs-routes';

import { PROJECT_CATEGORY_MAP } from '@/core/map';
import { ContentCardSection, LinkButton, Show } from '@/core/ui';

import { createProjectsService } from '@/entities/projects';

import { HOME_SECTION_ID_LABEL_MAP } from '@/views/home/model';
import { HomeSection } from '@/views/home/ui/HomeSection';

import ChevronRightIcon from 'public/icons/chevron_right.svg';

const projectsService = createProjectsService();

export async function HomeProjectsSection() {
  const { items } = await projectsService.getProjects({ count: String(6) });
  const { id, label } = HOME_SECTION_ID_LABEL_MAP.PROJECTS;

  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>주요 프로젝트의 세부 사항을 확인해보세요</HomeSection.Header>

      <div className="w-full">
        <Show
          when={items.length}
          fallback={ContentCardSection.Placeholder}
        >
          <ContentCardSection>
            {items.map(({ category, slug, path, tech, title, description, createdAt }) => (
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
        className="flex-row-center w-fit gap-2 text-foreground-6"
        href={routes({ pathname: '/projects' })}
        size="md"
        color="background"
      >
        <span>프로젝트 더보기</span>
        <div className="mb-px size-3">
          <ChevronRightIcon strokeWidth={1.5} />
        </div>
      </LinkButton>
    </HomeSection>
  );
}
