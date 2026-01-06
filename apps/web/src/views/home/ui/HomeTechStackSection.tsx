import { HomeSection } from '@/views/home/ui/HomeSection';

type Props = {
  id: string;
  label: string;
};

export function HomeTechStackSection({ id, label }: Props) {
  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>여러 기술 및 도구를 사용할 수 있어요</HomeSection.Header>

      <div>
        프론트엔드: Javascript, Typescript, React, Vue, Next.js, React Native
        <br />
        스타일: CSS, SASS, Styled Component, TailwindCSS
        <br />
        라이브러리: Tanstack Query, SWR, Zustand, React Hook Form, Jest, Motion
        <br />
        번들러, 배포: Webpack, Babel, Electron, Turbopack, Vercel
        <br />
        디자인: Figma, Illustrator, Photoshop, InDesign, After Effects
        <br />
        협업: Git, Github, Slack, Trello, Jira, Notion
      </div>
    </HomeSection>
  );
}
