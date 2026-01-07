import { HomeSection } from '@/views/home/ui/HomeSection';
import { Stacks } from '@/views/home/ui/techStackSection/Stacks';

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
        <Stacks
          label="프론트엔드"
          techs={['html', 'javascript', 'typescript', 'react', 'vue', 'nextjs', 'react-native']}
        />
        <Stacks
          label="스타일"
          techs={['css', 'sass', 'styled-component', 'tailwindcss']}
        />
        <Stacks
          label="라이브러리"
          techs={['tanstack-query', 'swr', 'zustand', 'react-hook-form', 'jest', 'motion']}
        />
        <Stacks
          label="번들러, 배포"
          techs={['webpack', 'babel', 'electron', 'turbopack', 'vercel']}
        />
        <Stacks
          label="디자인"
          techs={['figma', 'illustrator', 'photoshop', 'in-design', 'after-effects']}
        />
        <Stacks
          label="협업"
          techs={['git', 'github', 'slack', 'trello', 'jira', 'notion']}
        />
      </div>
    </HomeSection>
  );
}
