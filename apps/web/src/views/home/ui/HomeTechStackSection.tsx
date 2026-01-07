import type { TechStack } from '@jinho-blog/shared';

import { HomeSection } from '@/views/home/ui/HomeSection';
import { TechStackItem } from '@/views/home/ui/techStackSection/TechStackItem';

type StackProps = {
  label: string;
  techs: TechStack[];
};

function Stack({ label, techs }: StackProps) {
  return (
    <div className="size-full">
      <p className="mb-4 w-full text-left font-caption-14 text-foreground-6">{label}</p>

      <ol
        className={`
          grid grid-cols-3 gap-2
          tablet:gap-2.5
        `}
      >
        {techs.map(tech => (
          <TechStackItem
            key={tech}
            tech={tech}
          />
        ))}
      </ol>
    </div>
  );
}

type Props = {
  id: string;
  label: string;
};

export function HomeTechStackSection({ id, label }: Props) {
  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>여러 기술 및 도구를 사용할 수 있어요</HomeSection.Header>

      <div
        className={`
          grid size-full max-w-sm grid-cols-2 gap-x-6 gap-y-7
          tablet:max-w-2xl tablet:grid-cols-3 tablet:gap-8
        `}
      >
        <Stack
          label="프론트엔드"
          techs={['html', 'javascript', 'typescript', 'react', 'vue', 'nextjs', 'react-native']}
        />
        <Stack
          label="스타일"
          techs={['css', 'sass', 'styled-component', 'tailwindcss']}
        />
        <Stack
          label="라이브러리"
          techs={['tanstack-query', 'swr', 'zustand', 'react-hook-form', 'jest', 'motion']}
        />
        <Stack
          label="번들러, 배포"
          techs={['webpack', 'babel', 'electron', 'turbopack', 'vercel']}
        />
        <Stack
          label="디자인"
          techs={['figma', 'illustrator', 'photoshop', 'in-design', 'after-effects']}
        />
        <Stack
          label="협업"
          techs={['git', 'github', 'slack', 'trello', 'jira', 'notion']}
        />
      </div>
    </HomeSection>
  );
}
