import { HomeSection } from '@/views/home/ui/HomeSection';

type Props = {
  id: string;
  label: string;
};

/**
 *  1. 빠른 학습과 발전: 상황에 따라 필요한 기술을 찾고 빠르게 습득 후 숙련도 향상
    2. 높은 UI/UX 이해도: 시각디자인을 전공, 어플리케이션 리디자인 및 웹페이지 디자인 경험
    3. 효율적인 AI 활용: AI 에이전트를 활용해 빠른 프로젝트 구현부터 MCP를 연결해 최적화 및 문서화한 경험
 */

export function HomeCoreSkillsSection({ id, label }: Props) {
  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>핵심 역량입니다</HomeSection.Header>
    </HomeSection>
  );
}
