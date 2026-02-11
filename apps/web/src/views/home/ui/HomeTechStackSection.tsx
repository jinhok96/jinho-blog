import type { TechStack } from '@jinho-blog/shared';

import { TechStackBadge } from '@/core/ui';

import { HOME_SECTION_ID_LABEL_MAP } from '@/views/home/model';
import { HomeSection } from '@/views/home/ui/HomeSection';

type TechStacksProps = {
  label: string;
  stacks: TechStack[];
};

function TechStacks({ label, stacks }: TechStacksProps) {
  return (
    <div className="size-fit">
      <p className="mb-4 font-caption-14 text-foreground-6">{label}</p>

      <ol
        className={`
          grid w-fit grid-cols-3 gap-2
          tablet:gap-2.5
        `}
      >
        {stacks.map(item => (
          <TechStackBadge
            key={item}
            tech={item}
            className={`
              size-10
              tablet:size-11
            `}
          />
        ))}
      </ol>
    </div>
  );
}

const { id, label } = HOME_SECTION_ID_LABEL_MAP.TECH_STACK;

export function HomeTechStackSection() {
  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>아래 기술과 도구를 사용할 수 있어요</HomeSection.Header>

      <div
        className={`
          grid size-fit grid-cols-2 gap-x-10 gap-y-8
          tablet:grid-cols-3 tablet:gap-x-12 tablet:gap-y-10
        `}
      >
        <TechStacks
          label="프론트엔드"
          stacks={['html', 'javascript', 'typescript', 'react', 'vue', 'nextjs', 'react-native']}
        />
        <TechStacks
          label="스타일"
          stacks={['css', 'sass', 'styled-components', 'tailwindcss']}
        />
        <TechStacks
          label="라이브러리"
          stacks={['tanstack-query', 'swr', 'zustand', 'react-hook-form', 'jest', 'motion']}
        />
        <TechStacks
          label="번들러, 배포"
          stacks={['webpack', 'babel', 'electron', 'turbopack', 'vite', 'vercel']}
        />
        <TechStacks
          label="디자인"
          stacks={['figma', 'illustrator', 'photoshop', 'in-design', 'after-effects']}
        />
        <TechStacks
          label="협업"
          stacks={['git', 'github', 'slack', 'trello', 'jira', 'notion']}
        />
      </div>
    </HomeSection>
  );
}
