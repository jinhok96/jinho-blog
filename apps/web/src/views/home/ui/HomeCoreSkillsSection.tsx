import { HomeSection } from '@/views/home/ui/HomeSection';

type Props = {
  id: string;
  label: string;
};

export function HomeCoreSkillsSection({ id, label }: Props) {
  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>핵심 역량입니다</HomeSection.Header>
    </HomeSection>
  );
}
